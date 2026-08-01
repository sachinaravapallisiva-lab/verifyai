import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { publicKeyFromBase64, verifyAssertion } from '@/lib/webauthn';
import type { AuthenticationResponseJSON } from '@simplewebauthn/server';

export async function POST(req: NextRequest) {
  try {
    const { token, response } = (await req.json()) as {
      token?: string;
      response?: AuthenticationResponseJSON;
    };
    if (!token || !response) {
      return NextResponse.json({ success: false, error: 'Missing token or response' }, { status: 400 });
    }

    const { data: session } = await supabaseAdmin
      .from('verify_sessions')
      .select('id, status, customer_id, webauthn_challenge, webauthn_challenge_expires_at')
      .eq('id', token)
      .maybeSingle();

    if (!session || session.status !== 'awaiting_2fa' || !session.webauthn_challenge || !session.customer_id) {
      return NextResponse.json({ success: false, error: 'No pending verification for this session' }, { status: 409 });
    }

    if (new Date(session.webauthn_challenge_expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: 'Challenge expired' }, { status: 410 });
    }

    const { data: passkey } = await supabaseAdmin
      .from('passkeys')
      .select('id, credential_id, public_key, counter, transports')
      .eq('customer_id', session.customer_id)
      .eq('credential_id', response.id)
      .maybeSingle();

    if (!passkey) {
      return NextResponse.json({ success: false, error: 'Unrecognized credential' }, { status: 401 });
    }

    const { verified, authenticationInfo } = await verifyAssertion(response, session.webauthn_challenge, {
      id: passkey.credential_id,
      publicKey: publicKeyFromBase64(passkey.public_key),
      counter: passkey.counter,
      transports: passkey.transports ?? undefined,
    });

    if (!verified) {
      return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 401 });
    }

    await supabaseAdmin
      .from('passkeys')
      .update({ counter: authenticationInfo.newCounter, last_used_at: new Date().toISOString() })
      .eq('id', passkey.id);

    await supabaseAdmin
      .from('verify_sessions')
      .update({
        status: 'verified',
        verification_method: 'biometric',
        webauthn_challenge: null,
        webauthn_challenge_expires_at: null,
      })
      .eq('id', token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('WebAuthn assertion error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
