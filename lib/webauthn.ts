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
