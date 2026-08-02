import {
  generateRegistrationOptions,
  generateAuthenticationOptions,
  verifyRegistrationResponse,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
  WebAuthnCredential,
} from '@simplewebauthn/server';

const RP_NAME = 'VerifyAI';

function rpConfig() {
  const url = new URL(process.env.NEXT_PUBLIC_APP_URL!);
  return { rpID: url.hostname, origin: url.origin };
}

export async function buildRegistrationOptions(
  customer: { id: string; email: string | null; phone: string | null },
  excludeCredentials: { id: string; transports?: AuthenticatorTransportFuture[] }[]
) {
  const { rpID } = rpConfig();
  return generateRegistrationOptions({
    rpName: RP_NAME,
    rpID,
    userID: new TextEncoder().encode(customer.id),
    userName: customer.email ?? customer.phone ?? customer.id,
    attestationType: 'none',
    excludeCredentials,
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      residentKey: 'preferred',
      userVerification: 'required',
    },
  });
}

export async function buildAuthenticationOptions(
  allowCredentials: { id: string; transports?: AuthenticatorTransportFuture[] }[]
) {
  const { rpID } = rpConfig();
  return generateAuthenticationOptions({
    rpID,
    allowCredentials,
    userVerification: 'required',
  });
}

export async function verifyRegistration(response: RegistrationResponseJSON, expectedChallenge: string) {
  const { rpID, origin } = rpConfig();
  return verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: true,
  });
}

export async function verifyAssertion(
  response: AuthenticationResponseJSON,
  expectedChallenge: string,
  credential: WebAuthnCredential
) {
  const { rpID, origin } = rpConfig();
  return verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    credential,
    requireUserVerification: true,
  });
}

export function publicKeyToBase64(publicKey: Uint8Array): string {
  return Buffer.from(publicKey).toString('base64');
}

export function publicKeyFromBase64(encoded: string) {
  // .slice() copies into a fresh Uint8Array<ArrayBuffer>, matching the
  // Uint8Array_ type @simplewebauthn/server expects (Buffer's backing store
  // is typed as ArrayBufferLike, which TS won't narrow automatically).
  return new Uint8Array(Buffer.from(encoded, 'base64')).slice();
}

// `transports` is stored as a Postgres array/jsonb, but a stringified JSON
// array has been observed coming back from the DB (a scalar column holding
// '["internal","hybrid"]' rather than a real array). WebKit rejects a bare
// string for the sequence<DOMString> transports member outright ("Value is
// not a sequence"), so normalize whatever shape comes back before it ever
// reaches @simplewebauthn/browser.
export function normalizeTransports(value: unknown): AuthenticatorTransportFuture[] | undefined {
  if (Array.isArray(value)) return value as AuthenticatorTransportFuture[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed as AuthenticatorTransportFuture[];
    } catch {
      // Not JSON — treat as unusable rather than passing a raw string through.
    }
  }
  return undefined;
}
