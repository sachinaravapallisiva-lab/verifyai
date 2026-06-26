'use client';
import { useState, useEffect } from 'react';

export default function RepDashboard() {
  const [sessionId, setSessionId] = useState('');
  const [status, setStatus] = useState('idle');
  const [customer, setCustomer] = useState(null);
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);

  const sendOTP = async () => {
    if (!phone) return;
    setSending(true);
    setStatus('sending');
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, sessionId }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('waiting');
        setSessionId(data.sessionId);
      }
    } catch (e) {
      setStatus('error');
    }
    setSending(false);
  };

  useEffect(() => {
    if (status !== 'waiting' || !sessionId) return;
    const interval = setInterval(async () => {
      const res = await fetch('/api/session-status?sessionId=' + sessionId);
      const data = await res.json();
      if (data.verified) {
        setCustomer(data.customer);
        setStatus('verified');
        clearInterval(interval);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [status, sessionId]);

  return (
    <div style={{ minHeight: '100vh', background: '#0D1B2A', fontFamily: 'Arial, sans-serif', padding: '40px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: 'white', fontSize: '28px', marginBottom: '8px' }}>VerifyAI</h1>
        <p style={{ color: '#94A3B8', marginBottom: '32px' }}>Rep Dashboard</p>

        {status === 'idle' && (
          <div style={{ background: '#1E2D3D', borderRadius: '12px', padding: '24px' }}>
            <label style={{ color: 'white', display: 'block', marginBottom: '8px' }}>Customer Phone Number</label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0D1B2A', color: 'white', fontSize: '16px', marginBottom: '16px', boxSizing: 'border-box' }}
            />
            <button
              onClick={sendOTP}
              disabled={sending}
              style={{ width: '100%', padding: '14px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}
            >
              Send Verification Link
            </button>
          </div>
        )}

        {status === 'waiting' && (
          <div style={{ background: '#1E2D3D', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📱</div>
            <h2 style={{ color: 'white', marginBottom: '8px' }}>Waiting for customer...</h2>
            <p style={{ color: '#94A3B8' }}>OTP sent to {phone}. Verifying identity silently.</p>
          </div>
        )}

        {status === 'verified' && customer && (
          <div style={{ background: '#1E2D3D', borderRadius: '12px
[6:17 PM, 6/26/2026] S: 'use client';
import { useState, useEffect } from 'react';

export default function RepDashboard() {
  const [sessionId, setSessionId] = useState('');
  const [status, setStatus] = useState('idle');
  const [customer, setCustomer] = useState(null);
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);

  const sendOTP = async () => {
    if (!phone) return;
    setSending(true);
    setStatus('sending');
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, sessionId }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('waiting');
        setSessionId(data.sessionId);
      }
    } catch (e) {
      setStatus('error');
    }
    setSending(false);
  };

  useEffect(() => {
    if (status !== 'waiting' || !sessionId) return;
    const interval = setInterval(async () => {
      const res = await fetch('/api/session-status?sessionId=' + sessionId);
      const data = await res.json();
      if (data.verified) {
        setCustomer(data.customer);
        setStatus('verified');
        clearInterval(interval);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [status, sessionId]);

  return (
    <div style={{ minHeight: '100vh', background: '#0D1B2A', fontFamily: 'Arial, sans-serif', padding: '40px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: 'white', fontSize: '28px', marginBottom: '8px' }}>VerifyAI</h1>
        <p style={{ color: '#94A3B8', marginBottom: '32px' }}>Rep Dashboard</p>

        {status === 'idle' && (
          <div style={{ background: '#1E2D3D', borderRadius: '12px', padding: '24px' }}>
            <label style={{ color: 'white', display: 'block', marginBottom: '8px' }}>Customer Phone Number</label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0D1B2A', color: 'white', fontSize: '16px', marginBottom: '16px', boxSizing: 'border-box' }}
            />
            <button
              onClick={sendOTP}
              disabled={sending}
              style={{ width: '100%', padding: '14px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}
            >
              Send Verification Link
            </button>
          </div>
        )}

        {status === 'waiting' && (
          <div style={{ background: '#1E2D3D', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📱</div>
            <h2 style={{ color: 'white', marginBottom: '8px' }}>Waiting for customer...</h2>
            <p style={{ color: '#94A3B8' }}>OTP sent to {phone}. Verifying identity silently.</p>
          </div>
        )}

        {status === 'verified' && customer && (
          <div style={{ background: '#1E2D3D', borderRadius: '12px', padding: '24px' }}>
            <div style={{ color: '#22C55E', fontSize: '18px', marginBottom: '16px' }}>Identity Verified</div>
            <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{customer.name}</div>
            <div style={{ color: '#94A3B8', marginBottom: '4px' }}>Email: {customer.email}</div>
            <div style={{ color: '#94A3B8', marginBottom: '4px' }}>Phone: {customer.phone}</div>
            <div style={{ color: '#94A3B8' }}>Account: {customer.account_number}</div>
            <button
              onClick={() => { setStatus('idle'); setCustomer(null); setPhone(''); setSessionId(''); }}
              style={{ marginTop: '24px', width: '100%', padding: '12px', background: '#334155', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              New Verification
            </button>
          </div>
        )}

        {status === 'error' && (
          <div style={{ background: '#1E2D3D', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <p style={{ color: '#EF4444' }}>Something went wrong. Please try again.</p>
            <button onClick={() => setStatus('idle')} style={{ marginTop: '16px', padding: '12px 24px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}