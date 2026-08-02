import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { buildAuthenticationOptions, buildRegistrationOptions } from '@/lib/webauthn';

// The default WebAuthn ceremony timeout is 60s, but a first-time platform
// authenticator prompt can add an OS-level permission dialog on top of that.
// Give real ceremonies enough room that they don't get invalidated mid-flight.
const WEBAUTHN_CHALLENGE_TTL_MS = 5 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { token, otp } = await req.json();
    if (!token || !otp) {
      return NextResponse.json({ success: false, error: 'Missing token or otp' }, { status: 400 });
    }

    const { data: session } = await supabaseAdmin
      .from('verify_sessions')
      .select('id, otp, status, expires_at, customer_id')
      .eq('id', token)
      .maybeSingle();

    if (!session) {
      return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 404 });
    }

    if (new Date(session.expires_at) < new Date()) {
      await supabaseAdmin.from('verify_sessions').update({ status: 'expired' }).eq('id', token);
      return NextResponse.json({ success: false, error: 'Link expired' }, { status: 410 });
    }

    if (!session.otp || session.otp.trim() !== String(otp).trim()) {
      return NextResponse.json({ success: false, error: 'Incorrect code' }, { status: 401 });
    }

    // No customer on file for this session (e.g. unrecognized caller) — no
    // account to attach a passkey/PIN to, so this is tap-only by definition.
    if (!session.customer_id) {
      await supabaseAdmin
        .from('verify_sessions')
        .update({ status: 'verified', verification_method: 'tap' })
        .eq('id', token);
      return NextResponse.json({ success: true, requiresStep: null });
    }

    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('id, email, phone, pin_hash')
      .eq('id', session.customer_id)
      .maybeSingle();

    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer record not found' }, { status: 404 });
    }

    const { data: passkeys } = await supabaseAdmin
      .from('passkeys')
      .select('credential_id, transports')
      .eq('customer_id', session.customer_id);

    const hasPin = !!customer?.pin_hash;

    if (passkeys && passkeys.length > 0) {
      const authOptions = await buildAuthenticationOptions(
        passkeys.map((p) => ({ id: p.credential_id, transports: p.transports ?? undefined }))
      );
      await supabaseAdmin
        .from('verify_sessions')
        .update({
          status: 'awaiting_2fa',
          webauthn_challenge: authOptions.challenge,
          webauthn_challenge_expires_at: new Date(Date.now() + WEBAUTHN_CHALLENGE_TTL_MS).toISOString(),
        })
        .eq('id', token);
      return NextResponse.json({ success: true, requiresStep: 'assertion', authOptions, hasPin });
    }

    const registrationOptions = await buildRegistrationOptions(
      { id: customer.id, email: customer.email, phone: customer.phone },
      []
    );
    await supabaseAdmin
      .from('verify_sessions')
      .update({
        status: 'awaiting_2fa',
        webauthn_challenge: registrationOptions.challenge,
        webauthn_challenge_expires_at: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
      })
      .eq('id', token);
    return NextResponse.json({ success: true, requiresStep: 'register_or_pin', registrationOptions, hasPin });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ verified: false });
  }

  const { data: session } = await supabaseAdmin
    .from('verify_sessions')
    .select('id, status, verification_method, customer_id, customers(name, email, phone)')
    .eq('id', token)
    .maybeSingle();

  if (!session) {
    return NextResponse.json({ verified: false });
  }

  return NextResponse.json({
    verified: session.status === 'verified',
    status: session.status,
    verificationMethod: session.verification_method,
    customer: session.customers ?? null,
  });
}
