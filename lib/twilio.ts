import twilio from 'twilio';

export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export type LineType = 'mobile' | 'landline' | 'voip' | 'unknown';

// Uses Twilio Lookup v2 line_type_intelligence to distinguish mobile
// (SMS-capable) numbers from landlines before deciding on the OTP fallback.
export async function getLineType(phone: string): Promise<LineType> {
  try {
    const result = await twilioClient.lookups.v2
      .phoneNumbers(phone)
      .fetch({ fields: 'line_type_intelligence' });

    const type = result.lineTypeIntelligence?.type;
    if (type === 'mobile') return 'mobile';
    if (type === 'landline') return 'landline';
    if (type) return 'voip';
    return 'unknown';
  } catch (e) {
    console.error('Twilio Lookup error:', e);
    return 'unknown';
  }
}
