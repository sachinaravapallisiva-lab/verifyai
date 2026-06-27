import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const sessionId = Math.random().toString(36).substring(2, 15);
    const verifyUrl = process.env.NEXT_PUBLIC_APP_URL + '/verify?token=' + sessionId + '&otp=' + otp;

    await client.messages.create({
      body: 'VerifyAI: Click to verify your identity securely: ' + verifyUrl,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    return NextResponse.json({ success: true, sessionId });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send OTP' }, { status: 500 });
  }
}