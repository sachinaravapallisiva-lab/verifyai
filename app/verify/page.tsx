'use client';

import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  startAuthentication,
  startRegistration,
  platformAuthenticatorIsAvailable,
} from '@simplewebauthn/browser';
import type {
  PublicKeyCredentialRequestOptionsJSON,
  PublicKeyCredentialCreationOptionsJSON,
} from '@simplewebauthn/browser';

type Status = 'idle' | 'loading' | 'pin' | 'retry' | 'success' | 'error';

async function postJSON(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

// The WebAuthn browser API can reject before we ever make a network call
// (NotAllowedError, no matching local credential, user cancel, etc.), which
// otherwise vanishes silently — nothing shows up in server logs. Report it
// so the real reason is visible somewhere other than this tab's console.
function reportClientError(token: string | null, stage: string, err: unknown) {
  const name = err instanceof Error ? err.name : 'Unknown';
  const message = err instanceof Error ? err.message : String(err);
  postJSON('/api/verify/client-error', { token, stage, name, message }).catch(() => {});
}

export default function VerifyPage() {
  const [status, setStatus] = useState<Status>('idle');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinLocked, setPinLocked] = useState(false);
  const tokenRef = useRef<string | null>(null);
  const inFlightRef = useRef(false);

  // TEMPORARY DEBUG — remove once the passkey-skip-to-PIN issue is diagnosed.
  const [debugInfo, setDebugInfo] = useState<{
    requiresStep?: string | null;
    hasPin?: boolean;
    webauthnError?: string;
  }>({});

  async function finishWithFallback(hasPin: boolean) {
    const token = tokenRef.current;
    if (!token) return setStatus('error');

    if (hasPin) {
      setStatus('pin');
      return;
    }

    const data = await postJSON('/api/verify/tap-fallback', { token });
    setStatus(data.success ? 'success' : 'error');
  }

  async function tryAssertion(authOptions: PublicKeyCredentialRequestOptionsJSON, hasPin: boolean) {
    const token = tokenRef.current;
    let assertion;
    try {
      assertion = await startAuthentication({ optionsJSON: authOptions });
    } catch (err) {
      // Not supported on this device, no matching credential, or the
      // customer cancelled — genuine unavailability, so step down.
      reportClientError(token, 'assertion', err);
      setDebugInfo((d) => ({
        ...d,
        webauthnError: `assertion: ${err instanceof Error ? `${err.name}: ${err.message}` : String(err)}`,
      }));
      await finishWithFallback(hasPin);
      return;
    }

    const data = await postJSON('/api/verify/webauthn-assertion', { token, response: assertion });
    if (data.success) {
      // A PIN on file is a required second factor, not a fallback — no
      // dropping to tap-only if it's subsequently entered wrong.
      setStatus(data.requiresPin ? 'pin' : 'success');
      return;
    }
    // The customer completed Face ID/Touch ID and the browser produced an
    // assertion, but the server rejected it (e.g. the challenge expired
    // waiting on the ceremony). That's not "biometrics unavailable" — silently
    // dropping to PIN here would under-record someone who really did confirm
    // with biometrics, so let them retry the same factor instead.
    setStatus('retry');
  }

  async function tryRegistration(registrationOptions: PublicKeyCredentialCreationOptionsJSON, hasPin: boolean) {
    const token = tokenRef.current;
    const available = await platformAuthenticatorIsAvailable().catch(() => false);
    if (!available) {
      await finishWithFallback(hasPin);
      return;
    }

    let attestation;
    try {
      attestation = await startRegistration({ optionsJSON: registrationOptions });
    } catch (err) {
      // Declined or failed client-side — genuine unavailability here too.
      reportClientError(token, 'registration', err);
      setDebugInfo((d) => ({
        ...d,
        webauthnError: `registration: ${err instanceof Error ? `${err.name}: ${err.message}` : String(err)}`,
      }));
      await finishWithFallback(hasPin);
      return;
    }

    const data = await postJSON('/api/verify/webauthn-register', { token, response: attestation });
    if (data.success) {
      setStatus('success');
      return;
    }
    setStatus('retry');
  }

  async function handleVerify() {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setStatus('loading');
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const otp = params.get('otp');
      tokenRef.current = token;

      const data = await postJSON('/api/verify-otp', { token, otp });
      setDebugInfo((d) => ({ ...d, requiresStep: data.requiresStep, hasPin: data.hasPin }));
      if (!data.success) {
        setStatus('error');
        return;
      }

      if (data.requiresStep === 'assertion') {
        await tryAssertion(data.authOptions, data.hasPin);
      } else if (data.requiresStep === 'register_or_pin') {
        await tryRegistration(data.registrationOptions, data.hasPin);
      } else {
        setStatus('success');
      }
    } catch {
      setStatus('error');
    } finally {
      inFlightRef.current = false;
    }
  }

  async function submitPin() {
    const token = tokenRef.current;
    if (!token || !pin) return;
    setPinError(null);
    const data = await postJSON('/api/verify/pin', { token, pin });
    if (data.success) {
      setStatus('success');
      return;
    }
    if (data.terminal) {
      // This link burned all 3 PIN attempts and is now dead — no retry, no
      // dropping to a weaker factor. Reuse the terminal error screen.
      setStatus('error');
      return;
    }
    if (data.locked) {
      setPinLocked(true);
      setPinError('Too many incorrect attempts recently. Try again in 30 minutes.');
    } else {
      setPinError(`Incorrect PIN. ${data.attemptsRemaining ?? 0} attempt(s) remaining.`);
    }
    setPin('');
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0B1220', color: '#E5EAF3', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#4F7DF3', letterSpacing: '1px' }}>VERIFYAI</p>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', marginTop: '16px' }}>Verify Your Identity</h1>

        {status === 'idle' && (
          <>
            <p style={{ color: '#9AA6BC', marginTop: '16px', lineHeight: 1.6 }}>
              A representative needs to confirm it&apos;s you to continue your call. Tap below to securely confirm your identity.
            </p>
            <button onClick={handleVerify} style={{ marginTop: '28px', width: '100%', padding: '14px', background: '#4F7DF3', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>
              Confirm My Identity
            </button>
          </>
        )}

        {status === 'loading' && (
          <p style={{ color: '#9AA6BC', marginTop: '28px' }}>Verifying…</p>
        )}

        {status === 'pin' && (
          <div style={{ marginTop: '28px' }}>
            <p style={{ color: '#9AA6BC', lineHeight: 1.6 }}>
              Enter your PIN to confirm your identity.
            </p>
            <input
              type="text"
              inputMode="numeric"
              name="verifyai-confirmation-value"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              value={pin}
              disabled={pinLocked}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && submitPin()}
              style={{ marginTop: '16px', width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #334155', background: '#141E2E', color: 'white', fontSize: '18px', textAlign: 'center', letterSpacing: '4px', WebkitTextSecurity: 'disc' } as CSSProperties}
            />
            <button
              onClick={submitPin}
              disabled={pinLocked || !pin}
              style={{ marginTop: '16px', width: '100%', padding: '14px', background: pinLocked ? '#334155' : '#4F7DF3', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 600, cursor: pinLocked ? 'not-allowed' : 'pointer' }}
            >
              Confirm
            </button>
            {pinError && (
              <p style={{ color: '#F87171', marginTop: '12px', fontSize: '13px', lineHeight: 1.6 }}>{pinError}</p>
            )}
          </div>
        )}

        {status === 'retry' && (
          <div style={{ marginTop: '28px' }}>
            <p style={{ color: '#9AA6BC', lineHeight: 1.6 }}>
              We couldn&apos;t confirm that just now. Please try again.
            </p>
            <button onClick={handleVerify} style={{ marginTop: '16px', width: '100%', padding: '14px', background: '#4F7DF3', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>
              Try Again
            </button>
          </div>
        )}

        {status === 'success' && (
          <div style={{ marginTop: '28px' }}>
            <div style={{ fontSize: '48px' }}>✓</div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginTop: '12px' }}>Identity Confirmed</h2>
            <p style={{ color: '#9AA6BC', marginTop: '12px', lineHeight: 1.6 }}>
              You&apos;re verified. You can return to your call — the representative has been notified.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div style={{ marginTop: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#F87171' }}>Verification Failed</h2>
            <p style={{ color: '#9AA6BC', marginTop: '12px', lineHeight: 1.6 }}>
              This link may have expired. Please ask the representative to send a new verification link.
            </p>
          </div>
        )}

        {/* TEMPORARY DEBUG — remove once the passkey-skip-to-PIN issue is diagnosed. */}
        <div style={{ marginTop: '32px', padding: '12px', border: '1px dashed #F59E0B', borderRadius: '8px', textAlign: 'left', fontSize: '11px', color: '#F59E0B', wordBreak: 'break-word' }}>
          <p style={{ fontWeight: 700, marginBottom: '4px' }}>DEBUG (temporary)</p>
          <p>requiresStep: {debugInfo.requiresStep === undefined ? '—' : String(debugInfo.requiresStep)}</p>
          <p>hasPin: {debugInfo.hasPin === undefined ? '—' : String(debugInfo.hasPin)}</p>
          <p>webauthn error: {debugInfo.webauthnError ?? '—'}</p>
        </div>
      </div>
    </main>
  );
}
