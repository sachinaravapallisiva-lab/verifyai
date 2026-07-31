// Normalizes phone numbers to E.164 so Twilio-supplied numbers reliably
// match the format stored in customers.phone.
export function normalizePhone(raw: string): string {
  const cleaned = raw.trim().replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.length === 10) return '+1' + cleaned;
  if (cleaned.length === 11 && cleaned.startsWith('1')) return '+' + cleaned;
  return '+' + cleaned;
}
