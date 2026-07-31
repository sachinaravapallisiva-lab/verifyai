'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  );
}

function VerifyForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('idle');

  const verify = async () => {
    if (!otp || otp.length !== 6) return;
    setStatus('verifying');
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, otp }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D1B2A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#1E2D3D', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <h1 style={{ color: 'white', fontSize: '24px', marginBottom: '8px' }}>VerifyAI</h1>
        <p style={{ color: '#94A3B8', marginBottom: '32px', fontSize: '14px' }}>Enter your 6-digit verification code</p>

        {status === 'idle' && (
          <>
            <input
              type="number"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.slice(0, 6))}
              style={{ width: '100%', padding: '16px', fontSize: '24px', textAlign: 'center', borderRadius: '8px', border: '1px solid #334155', background: '#0D1B2A', color: 'white', marginBottom: '16px', boxSizing: 'border-box', letterSpacing: '8px' }}
            />
            <button
              onClick={verify}
              style={{ width: '100%', padding: '14px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Verify Identity
            </button>
          </>
        )}

        {status === 'verifying' && (
          <p style={{ color: '#94A3B8', fontSize: '16px' }}>Verifying...</p>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ color: '#22C55E', fontSize: '22px', marginBottom: '8px' }}>Identity Verified!</h2>
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>You can now close this window. Your support rep has been notified.</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>❌</div>
            <p style={{ color: '#EF4444', marginBottom: '16px' }}>Invalid code. Please try again.</p>
            <button
              onClick={() => setStatus('idle')}
              style={{ padding: '12px 24px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              Try Again
            </button>
          </>
        )}

        <p style={{ color: '#475569', fontSize: '12px', marginTop: '24px' }}>Secured by VerifyAI</p>
      </div>
    </div>
  );
}
