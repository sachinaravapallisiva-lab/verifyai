import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/session';

// Rep submits the last-4 SSN the caller provided over the phone. The real
// value never reaches the browser — only a boolean match result does.
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, customerId, last4 } = await req.json();
    if (!sessionId || !customerId || !last4) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('ssn_last4')
      .eq('id', customerId)
      .maybeSingle();

    const matched = !!customer?.ssn_last4 && customer.ssn_last4.trim() === String(last4).trim();

    if (matched) {
      await supabaseAdmin
        .from('verify_sessions')
        .update({ status: 'manual_review', rep_id: session.repId })
        .eq('id', sessionId);
    }

    return NextResponse.json({ matched });
  } catch (e) {
    console.error('manual-check error:', e);
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
