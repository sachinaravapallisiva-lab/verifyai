import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const ACTIVE_WINDOW_MS = 90 * 1000;

// Polled by the rep dashboard to detect a just-arrived call and reflect its
// verification state live, without needing websockets.
export async function GET() {
  const since = new Date(Date.now() - ACTIVE_WINDOW_MS).toISOString();

  const { data, error } = await supabaseAdmin
    .from('verify_sessions')
    .select('id, customer_phone, customer_id, status, verification_method, rep_id, created_at, expires_at, customers(name, email)')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ active: false });
  }

  let status = data.status;
  if ((status === 'pending' || status === 'awaiting_2fa') && new Date(data.expires_at) < new Date()) {
    status = 'expired';
    await supabaseAdmin.from('verify_sessions').update({ status: 'expired' }).eq('id', data.id);
  }

  const customer = Array.isArray(data.customers) ? data.customers[0] : data.customers;

  return NextResponse.json({
    active: true,
    session: {
      id: data.id,
      phone: data.customer_phone,
      customerId: data.customer_id,
      status,
      verificationMethod: data.verification_method,
      customerName: customer?.name ?? null,
      customerEmail: customer?.email ?? null,
      repId: data.rep_id,
      createdAt: data.created_at,
    },
  });
}
