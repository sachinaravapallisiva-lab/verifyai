import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Terminal path when the browser can't do WebAuthn and no PIN is on file for
// the customer — today's tap-only flow, now explicitly tagged as the
// weakest verified tier so the rep dashboard can show it distinctly.
export async function POST(req: NextRequest) {
  try {
    const { token, acceptedTerms } = await req.json();
    if (acceptedTerms !== true) {
      return NextResponse.json(
        { success: false, error: 'Agree to the Terms before you continue.' },
        { status: 400 },
      );
    }
    if (!token) {
      return NextResponse.json({ success: false, error: 'Missing token' }, { status: 400 });
    }

    const { data: session } = await supabaseAdmin
      .from('verify_sessions')
      .select('id, status')
      .eq('id', token)
      .maybeSingle();

    if (!session || session.status !== 'awaiting_2fa') {
      return NextResponse.json({ success: false, error: 'No pending verification for this session' }, { status: 409 });
    }

    await supabaseAdmin
      .from('verify_sessions')
      .update({
        status: 'verified',
        verification_method: 'tap',
        webauthn_challenge: null,
        webauthn_challenge_expires_at: null,
      })
      .eq('id', token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tap fallback error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
