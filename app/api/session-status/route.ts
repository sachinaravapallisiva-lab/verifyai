import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId');
  
  if (!sessionId) {
    return NextResponse.json({ verified: false });
  }

  const res = await fetch(process.env.NEXT_PUBLIC_APP_URL + '/api/verify-otp?token=' + sessionId);
  const data = await res.json();
  
  return NextResponse.json(data);
}