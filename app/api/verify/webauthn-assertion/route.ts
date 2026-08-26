import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { normalizeTransports, publicKeyFromBase64, verifyAssertion } from '@/lib/webauthn';
import type { AuthenticationResponseJSON } from '@simplewebauthn/server';

export async function POST(req: NextRequest) {
  try {
    const { token, response, acceptedTerms } = (await req.json()) as {
      token?: string;
      response?: AuthenticationResponseJSON;
      acceptedTerms?: unknown;
    };
    if (acceptedTerms !== true) {
      return NextResponse.json(
        { success: false, error: 'Agree to the Terms before you continue.' },
        { status: 400 },
      );
    }
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
      transports: normalizeTransports(passkey.transports),
    });

    if (!verified) {
      return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 401 });
    }

    await supabaseAdmin
      .from('passkeys')
      .update({ counter: authenticationInfo.newCounter, last_used_at: new Date().toISOString() })
      .eq('id', passkey.id);

    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('pin_hash')
      .eq('id', session.customer_id)
      .maybeSingle();
    const requiresPin = !!customer?.pin_hash;

    // A PIN on file must also pass before this session counts as verified —
    // biometric alone isn't enough for a returning customer with both
    // factors available. webauthn_passed records that this factor is done;
    // status only moves to 'verified' once /api/verify/pin also succeeds.
    // Customers with no PIN on file have nothing to chain onto, so biometric
    // alone finalizes them, same as before.
    await supabaseAdmin
      .from('verify_sessions')
      .update({
        status: requiresPin ? 'awaiting_2fa' : 'verified',
        verification_method: 'biometric',
        webauthn_passed: true,
        webauthn_challenge: null,
        webauthn_challenge_expires_at: null,
      })
      .eq('id', token);

    return NextResponse.json({ success: true, requiresPin });
  } catch (error) {
    console.error('WebAuthn assertion error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
