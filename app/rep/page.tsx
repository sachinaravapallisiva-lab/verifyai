'use client';
import { useState } from 'react';

export default function RepDashboard() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle');
  const [sessionId, setSessionId] = useState('');

  const sendOTP = async () => {
    if (!phone) return;
    setStatus('sending');
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    if (data.success) {
      setSessionId(data.sessionId);
      setStatus('waiting');
    } else {
      setStatus('error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D1B2A', padding: '40px' }}>
      <h1 style={{ color: 'white' }}>VerifyAI Rep Dashboard</h1>
      <p style={{ color: '#94A3B8' }}>Enter customer phone to verify identity</p>
      <input
        type="tel"
        placeholder="+1 (555) 000-0000"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ padding: '12px', width: '300px', borderRadius: '8px', border: '1px solid #334155', background: '#1E2D3D', color: 'white', marginTop: '16px', display: 'block' }}
      />
      <button
        onClick={sendOTP}
        style={{ marginTop: '16px', padding: '12px 24px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}
      >
        {status === 'sending' ? 'Sending...' : 'Send Verification'}
      </button>
      <p style={{ color: '#94A3B8', fontSize: '12px', maxWidth: '400px', marginTop: '16px' }}>
  Tap <strong>Send Verification</strong> only after the customer has verbally
  agreed to receive a one-time verification text from <strong>VerifyAI</strong> to
  confirm their identity. Msg &amp; data rates may apply. The customer may reply
  STOP to opt out or HELP for help. See our{' '}
  <a href="/privacy" style={{ color: '#94A3B8', textDecoration: 'underline' }}>Privacy Policy</a>{' '}
  and{' '}
  <a href="/terms" style={{ color: '#94A3B8', textDecoration: 'underline' }}>Terms</a>.
</p>
      {status === 'waiting' && (
        <p style={{ color: '#22C55E', marginTop: '16px' }}>OTP sent! Waiting for customer to verify...</p>
      )}
      {status === 'error' && (
        <p style={{ color: '#EF4444', marginTop: '16px' }}>Error sending OTP. Check Twilio config.</p>
      )}
    </div>
  );
}
