'use client';

import { useState } from 'react';

export default function VerifyPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleVerify() {
    setStatus('loading');
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const otp = params.get('otp');

      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, otp }),
      });
      const data = await res.json();
      setStatus(data.success ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
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
