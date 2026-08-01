import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { PIN_LOCK_MS, PIN_MAX_ATTEMPTS, verifyPin } from '@/lib/pin';

export async function POST(req: NextRequest) {
  try {
    const { token, pin } = await req.json();
    if (!token || !pin) {
      return NextResponse.json({ success: false, error: 'Missing token or pin' }, { status: 400 });
    }

    const { data: session } = await supabaseAdmin
      .from('verify_sessions')
      .select('id, status, customer_id')
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
        { success: false, error: 'PIN locked', lockedUntil: customer.pin_locked_until },
        { status: 423 }
      );
    }

    const matched = await verifyPin(String(pin).trim(), customer.pin_hash);

    if (!matched) {
      const attempts = (customer.pin_failed_attempts ?? 0) + 1;
      const locked = attempts >= PIN_MAX_ATTEMPTS;
      await supabaseAdmin
        .from('customers')
        .update({
          pin_failed_attempts: locked ? 0 : attempts,
          pin_locked_until: locked ? new Date(Date.now() + PIN_LOCK_MS).toISOString() : null,
        })
        .eq('id', customer.id);

      return NextResponse.json(
        {
          success: false,
          error: locked ? 'PIN locked' : 'Incorrect PIN',
          locked,
          attemptsRemaining: locked ? 0 : PIN_MAX_ATTEMPTS - attempts,
        },
        { status: locked ? 423 : 401 }
      );
    }

    await supabaseAdmin
      .from('customers')
      .update({ pin_failed_attempts: 0, pin_locked_until: null })
      .eq('id', customer.id);

    await supabaseAdmin
      .from('verify_sessions')
      .update({ status: 'verified', verification_method: 'pin' })
      .eq('id', token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PIN verify error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
