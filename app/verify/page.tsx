'use client';

import { useRef, useState } from 'react';
import {
  startAuthentication,
  startRegistration,
  platformAuthenticatorIsAvailable,
} from '@simplewebauthn/browser';
import type {
  PublicKeyCredentialRequestOptionsJSON,
  PublicKeyCredentialCreationOptionsJSON,
} from '@simplewebauthn/browser';

type Status = 'idle' | 'loading' | 'pin' | 'success' | 'error';

async function postJSON(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export default function VerifyPage() {
  const [status, setStatus] = useState<Status>('idle');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinLocked, setPinLocked] = useState(false);
  const tokenRef = useRef<string | null>(null);

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
    try {
      const assertion = await startAuthentication({ optionsJSON: authOptions });
      const data = await postJSON('/api/verify/webauthn-assertion', { token, response: assertion });
      if (data.success) {
        setStatus('success');
        return;
      }
    } catch {
      // Cancelled, not supported on this device, or no matching credential —
      // step down to the next available factor rather than dead-ending.
    }
    await finishWithFallback(hasPin);
  }

  async function tryRegistration(registrationOptions: PublicKeyCredentialCreationOptionsJSON, hasPin: boolean) {
    const token = tokenRef.current;
    try {
      const available = await platformAuthenticatorIsAvailable();
      if (available) {
        const attestation = await startRegistration({ optionsJSON: registrationOptions });
        const data = await postJSON('/api/verify/webauthn-register', { token, response: attestation });
        if (data.success) {
          setStatus('success');
          return;
        }
      }
    } catch {
      // Registration unsupported/declined — fall back below.
    }
    await finishWithFallback(hasPin);
  }

  async function handleVerify() {
    setStatus('loading');
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const otp = params.get('otp');
      tokenRef.current = token;

      const data = await postJSON('/api/verify-otp', { token, otp });
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
    if (data.locked) {
      setPinLocked(true);
      setPinError('Too many incorrect attempts. Try again in 30 minutes, or ask the representative for another way to verify.');
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
              type="password"
              inputMode="numeric"
              value={pin}
              disabled={pinLocked}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && submitPin()}
              style={{ marginTop: '16px', width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #334155', background: '#141E2E', color: 'white', fontSize: '18px', textAlign: 'center', letterSpacing: '4px' }}
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
      </div>
    </main>
  );
}
