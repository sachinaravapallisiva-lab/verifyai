import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { createSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Missing email or password' }, { status: 400 });
    }

    const { data: rep } = await supabaseAdmin
      .from('reps')
      .select('id, email, password_hash, name, role, active')
      .eq('email', String(email).trim().toLowerCase())
      .maybeSingle();

    // Same error for unknown email vs wrong password so login can't be used
    // to enumerate rep accounts.
    if (!rep || !rep.active || !(await bcrypt.compare(password, rep.password_hash))) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    await createSession({ repId: rep.id, email: rep.email, name: rep.name, role: rep.role });

    return NextResponse.json({ success: true, role: rep.role });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}
