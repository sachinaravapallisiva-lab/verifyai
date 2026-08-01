import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId');
  if (!sessionId) {
    return NextResponse.json({ verified: false });
  }

  const { data: session } = await supabaseAdmin
    .from('verify_sessions')
    .select('id, status, verification_method, customer_id, customers(name, email, phone)')
    .eq('id', sessionId)
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
