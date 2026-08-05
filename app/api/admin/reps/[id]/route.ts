import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/session';

// proxy.ts already restricts /api/admin/:path* to admin sessions; this check
// is defense in depth in case this route is ever reached another way.
async function requireAdmin() {
  const session = await getSession();
  return session?.role === 'admin' ? session : null;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { active } = await req.json();
  if (typeof active !== 'boolean') {
    return NextResponse.json({ error: 'Missing active flag' }, { status: 400 });
  }

  if (id === session.repId && !active) {
    return NextResponse.json({ error: "You can't deactivate your own account" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('reps')
    .update({ active })
    .eq('id', id)
    .select('id, email, name, role, active, created_at')
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: 'Failed to update rep' }, { status: 500 });
  }

  return NextResponse.json({ rep: data });
}
