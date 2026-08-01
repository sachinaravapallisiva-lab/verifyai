import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { publicKeyToBase64, verifyRegistration } from '@/lib/webauthn';
import type { RegistrationResponseJSON } from '@simplewebauthn/server';

export async function POST(req: NextRequest) {
  try {
    const { token, response } = (await req.json()) as {
      token?: string;
      response?: RegistrationResponseJSON;
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

    const { verified, registrationInfo } = await verifyRegistration(response, session.webauthn_challenge);

    if (!verified || !registrationInfo) {
      return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 401 });
    }

    const { credential, credentialDeviceType, credentialBackedUp } = registrationInfo;

    await supabaseAdmin.from('passkeys').insert({
      customer_id: session.customer_id,
      credential_id: credential.id,
      public_key: publicKeyToBase64(credential.publicKey),
      counter: credential.counter,
      device_type: credentialDeviceType,
      backed_up: credentialBackedUp,
      transports: credential.transports ?? null,
    });

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
    console.error('WebAuthn registration error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
