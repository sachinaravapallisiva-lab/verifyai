import { NextRequest, NextResponse } from 'next/server';

const sessions: Record<string, { verified: boolean; customer: any }> = {};

export async function POST(req: NextRequest) {
  try {
    const { token, otp } = await req.json();
    
    sessions[token] = {
      verified: true,
      customer: {
        name: 'Verified Customer',
        email: 'customer@example.com',
        phone: 'On file',
        account_number: 'ACC-' + Math.floor(10000 + Math.random() * 90000),
      }
    };

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token || !sessions[token]) {
    return NextResponse.json({ verified: false });
  }
  return NextResponse.json(sessions[token]);
}