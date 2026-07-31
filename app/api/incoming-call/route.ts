import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getLineType } from '@/lib/twilio';
import { normalizePhone } from '@/lib/phone';

const SESSION_TTL_MS = 30 * 60 * 1000;

// Vapi voice webhook: fires when a call comes in, before/while it connects.
// Looks the caller up against registered customers and decides whether the
// rep dashboard can auto-unlock the profile, needs a manual check, or should
// treat the caller as unregistered.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPhone = body?.message?.call?.customer?.number || body?.phoneNumber || body?.phone;
    if (!rawPhone) {
      return NextResponse.json({ error: 'No phone number' }, { status: 400 });
    }
    const phone = normalizePhone(rawPhone);
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('id, name')
      .eq('phone', phone)
      .maybeSingle();

    if (!customer) {
      const { data: session } = await supabaseAdmin
        .from('verify_sessions')
        .insert({ customer_phone: phone, customer_id: null, status: 'pending', expires_at: expiresAt })
        .select('id')
        .single();

      return NextResponse.json({ match: 'unregistered', phone, sessionId: session?.id });
    }

    const lineType = await getLineType(phone);

    if (lineType === 'mobile') {
      // Caller ID alone is spoofable, so this only unlocks the profile view.
      // Sensitive actions still require the rep to trigger an OTP.
      const { data: session } = await supabaseAdmin
        .from('verify_sessions')
        .insert({ customer_phone: phone, customer_id: customer.id, status: 'auto_verified', expires_at: expiresAt })
        .select('id')
        .single();

      return NextResponse.json({
        match: 'auto_verified',
        customer: { id: customer.id, name: customer.name },
        sessionId: session?.id,
      });
    }

    // Known customer, but their only number on file is not SMS-capable, so
    // there's no mobile number to fall back to. Leave status pending until
    // a rep completes the manual check via /api/manual-check.
    const { data: session } = await supabaseAdmin
      .from('verify_sessions')
      .insert({ customer_phone: phone, customer_id: customer.id, status: 'pending', expires_at: expiresAt })
      .select('id')
      .single();

    return NextResponse.json({
      match: 'manual_required',
      customer: { id: customer.id, name: customer.name },
      reason: 'No SMS-capable number on file for this account',
      sessionId: session?.id,
    });
  } catch (e) {
    console.error('incoming-call error:', e);
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
