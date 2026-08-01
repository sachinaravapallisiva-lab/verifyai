import bcrypt from 'bcryptjs';

export const PIN_LOCK_MS = 30 * 60 * 1000;
export const PIN_MAX_ATTEMPTS = 3;

export async function verifyPin(pin: string, pinHash: string): Promise<boolean> {
  return bcrypt.compare(pin, pinHash);
}
