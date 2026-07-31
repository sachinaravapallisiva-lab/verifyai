import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { token, otp } = await req.json();
    if (!token || !otp) {
      return NextResponse.json({ success: false, error: 'Missing token or otp' }, { status: 400 });
    }

    const { data: session } = await supabaseAdmin
      .from('verify_sessions')
      .select('id, otp, status, expires_at')
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

    await supabaseAdmin.from('verify_sessions').update({ status: 'verified' }).eq('id', token);

    return NextResponse.json({ success: true });
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
    .select('id, status, customer_id, customers(name, email, phone)')
    .eq('id', token)
    .maybeSingle();

  if (!session) {
    return NextResponse.json({ verified: false });
  }

  return NextResponse.json({
    verified: session.status === 'verified',
    status: session.status,
    customer: session.customers ?? null,
  });
}
