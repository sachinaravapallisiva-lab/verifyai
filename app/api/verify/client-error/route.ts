import { NextRequest, NextResponse } from 'next/server';

// The browser's WebAuthn API can reject before any verification request is
// ever sent (NotAllowedError, no matching local credential, user cancel,
// etc.), which is invisible to server logs by default. The client reports
// those failures here so they show up in the same place as everything else.
export async function POST(req: NextRequest) {
  try {
    const { token, stage, name, message } = await req.json();
    console.error('Client WebAuthn failure:', { token, stage, name, message });
  } catch {
    // Best-effort logging only.
  }
  return NextResponse.json({ logged: true });
}
