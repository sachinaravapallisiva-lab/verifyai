import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

export const SESSION_COOKIE = 'verifyai_session';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export type Role = 'rep' | 'admin';

export type SessionPayload = {
  repId: string;
  email: string;
  name: string;
  role: Role;
  exp: number;
};

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not set');
  return secret;
}

function sign(data: string): string {
  return createHmac('sha256', sessionSecret()).update(data).digest('base64url');
}

export function encodeSession(payload: SessionPayload): string {
  const json = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${json}.${sign(json)}`;
}

// Pure and side-effect-free so it can also run in proxy.ts, which reads
// cookies off the NextRequest rather than through next/headers.
export function decodeSession(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [json, sig] = token.split('.');
  if (!json || !sig) return null;

  const expectedSig = sign(json);
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(json, 'base64url').toString('utf8')) as SessionPayload;
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    if (payload.role !== 'rep' && payload.role !== 'admin') return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(payload: Omit<SessionPayload, 'exp'>) {
  const exp = Date.now() + SESSION_TTL_MS;
  const token = encodeSession({ ...payload, exp });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
