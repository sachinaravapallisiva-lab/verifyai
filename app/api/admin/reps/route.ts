import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/session';

// proxy.ts already restricts /api/admin/:path* to admin sessions; this check
// is defense in depth in case this route is ever reached another way.
async function requireAdmin() {
  const session = await getSession();
  return session?.role === 'admin' ? session : null;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('reps')
    .select('id, email, name, role, active, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to load reps' }, { status: 500 });
  }

  return NextResponse.json({ reps: data });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { email, password, name, role } = await req.json();
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    if (role !== 'rep' && role !== 'admin') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    if (String(password).length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const { data, error } = await supabaseAdmin
      .from('reps')
      .insert({
        email: String(email).trim().toLowerCase(),
        password_hash: passwordHash,
        name: String(name).trim(),
        role,
      })
      .select('id, email, name, role, active, created_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A rep with that email already exists' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ rep: data });
  } catch (error) {
    console.error('Create rep error:', error);
    return NextResponse.json({ error: 'Failed to create rep' }, { status: 500 });
  }
}
