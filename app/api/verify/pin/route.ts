import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { PIN_LOCK_MS, PIN_MAX_ATTEMPTS, verifyPin } from '@/lib/pin';

export async function POST(req: NextRequest) {
  try {
    const { token, pin, acceptedTerms } = await req.json();
    if (acceptedTerms !== true) {
      return NextResponse.json(
        { success: false, error: 'Agree to the Terms before you continue.' },
        { status: 400 },
      );
    }
    if (!token || !pin) {
      return NextResponse.json({ success: false, error: 'Missing token or pin' }, { status: 400 });
    }

    const { data: session } = await supabaseAdmin
      .from('verify_sessions')
      .select('id, status, customer_id, webauthn_passed, pin_attempts')
      .eq('id', token)
      .maybeSingle();

    if (!session || session.status !== 'awaiting_2fa' || !session.customer_id) {
      return NextResponse.json({ success: false, error: 'No pending verification for this session' }, { status: 409 });
    }

    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('id, pin_hash, pin_failed_attempts, pin_locked_until')
      .eq('id', session.customer_id)
      .maybeSingle();

    if (!customer?.pin_hash) {
      return NextResponse.json({ success: false, error: 'PIN not available' }, { status: 400 });
    }

    if (customer.pin_locked_until && new Date(customer.pin_locked_until) > new Date()) {
      return NextResponse.json(
        { success: false, error: 'PIN locked', locked: true, lockedUntil: customer.pin_locked_until },
        { status: 423 }
      );
    }

    const matched = await verifyPin(String(pin).trim(), customer.pin_hash);

    if (!matched) {
      // Cross-session cooldown on the customer record, independent of this
      // token's own attempt count.
      const customerAttempts = (customer.pin_failed_attempts ?? 0) + 1;
      const customerLocked = customerAttempts >= PIN_MAX_ATTEMPTS;
      await supabaseAdmin
        .from('customers')
        .update({
          pin_failed_attempts: customerLocked ? 0 : customerAttempts,
          pin_locked_until: customerLocked ? new Date(Date.now() + PIN_LOCK_MS).toISOString() : null,
        })
        .eq('id', customer.id);

      // Terminal per-token counter — no fallback path. Once this specific
      // link has burned 3 PIN attempts it's dead; a rep has to issue a new
      // verification link (and the customer redoes biometric on it) rather
      // than getting more tries on this one.
      const tokenAttempts = (session.pin_attempts ?? 0) + 1;
      if (tokenAttempts >= PIN_MAX_ATTEMPTS) {
        await supabaseAdmin
          .from('verify_sessions')
          .update({ status: 'pin_failed', pin_attempts: tokenAttempts })
          .eq('id', token);
        return NextResponse.json(
          { success: false, error: 'PIN attempts exhausted for this link', terminal: true },
          { status: 423 }
        );
      }

      await supabaseAdmin.from('verify_sessions').update({ pin_attempts: tokenAttempts }).eq('id', token);
      return NextResponse.json(
        { success: false, error: 'Incorrect PIN', attemptsRemaining: PIN_MAX_ATTEMPTS - tokenAttempts },
        { status: 401 }
      );
    }

    await supabaseAdmin
      .from('customers')
      .update({ pin_failed_attempts: 0, pin_locked_until: null })
      .eq('id', customer.id);

    // webauthn_passed distinguishes the two ways this endpoint is reached:
    // the required second stage after a successful assertion (combined tier)
    // vs. PIN standing in as a fallback because the assertion failed or
    // wasn't available on this device (PIN-only tier).
    const finalMethod = session.webauthn_passed ? 'webauthn+pin' : 'pin';
    await supabaseAdmin
      .from('verify_sessions')
      .update({ status: 'verified', verification_method: finalMethod })
      .eq('id', token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PIN verify error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
