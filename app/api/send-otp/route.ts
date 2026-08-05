import { NextRequest, NextResponse } from 'next/server';
import { twilioClient } from '@/lib/twilio';
import { supabaseAdmin } from '@/lib/supabase';
import { normalizePhone } from '@/lib/phone';
import { getSession } from '@/lib/session';

const OTP_TTL_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const repSession = await getSession();
    if (!repSession) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { phone: rawPhone } = await req.json();
    if (!rawPhone) {
      return NextResponse.json({ success: false, error: 'Missing phone' }, { status: 400 });
    }
    const phone = normalizePhone(rawPhone);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('phone', phone)
      .maybeSingle();

    const { data: session, error } = await supabaseAdmin
      .from('verify_sessions')
      .insert({
        customer_phone: phone,
        customer_id: customer?.id ?? null,
        otp,
        status: 'pending',
        rep_id: repSession.repId,
        expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(),
      })
      .select('id')
      .single();

    if (error || !session) throw error ?? new Error('Failed to create session');

    const verifyUrl =
      process.env.NEXT_PUBLIC_APP_URL + '/verify?token=' + session.id + '&otp=' + otp;

    await twilioClient.messages.create({
      body:
        'VerifyAI: A representative needs to confirm your identity to continue your call. ' +
        'Tap to verify securely: ' +
        verifyUrl +
        '. Msg & data rates may apply. Reply STOP to opt out or HELP for help.',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    return NextResponse.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send OTP' }, { status: 500 });
  }
}
