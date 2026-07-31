'use client';
import { useEffect, useState } from 'react';

type CallSession = {
  id: string;
  phone: string;
  customerId: string | null;
  status: string;
  customerName: string | null;
  customerEmail: string | null;
  repId: string | null;
  createdAt: string;
};

const STATUS_BADGE: Record<string, { label: string; color: string; note: string }> = {
  verified: { label: 'Verified (link)', color: '#22C55E', note: 'Strongest evidence — customer confirmed via SMS link' },
  manual_review: { label: 'Manually verified', color: '#F59E0B', note: 'Rep confirmed identity manually' },
  auto_verified: { label: 'Auto-verified (Caller ID)', color: '#818CF8', note: 'Caller ID match only — spoofable, weakest evidence. Sensitive actions still need OTP.' },
  pending: { label: 'Pending', color: '#94A3B8', note: 'Awaiting verification' },
  expired: { label: 'Expired', color: '#EF4444', note: 'Session expired before verification' },
};

export default function RepDashboard() {
  const [repId, setRepId] = useState(() =>
    typeof window === 'undefined' ? '' : window.localStorage.getItem('verifyai_rep_id') ?? ''
  );
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle');

  const [call, setCall] = useState<CallSession | null>(null);
  const [last4, setLast4] = useState('');
  const [checkResult, setCheckResult] = useState<'idle' | 'checking' | 'match' | 'no_match'>('idle');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (repId) window.localStorage.setItem('verifyai_rep_id', repId);
  }, [repId]);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch('/api/incoming-call/active');
        const data = await res.json();
        if (cancelled) return;
        if (data.active && data.session.id !== call?.id) {
          setCall(data.session);
          setCheckResult('idle');
          setAttempts(0);
          setLast4('');
        } else if (data.active) {
          setCall(data.session);
        }
      } catch {
        // ignore transient polling errors
      }
    };
    poll();
    const interval = setInterval(poll, 3000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [call?.id]);

  const sendOTP = async (targetPhone: string) => {
    if (!targetPhone) return;
    setStatus('sending');
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: targetPhone, repId }),
    });
    const data = await res.json();
    if (data.success) {
      setStatus('waiting');
    } else {
      setStatus('error');
    }
  };

  const submitManualCheck = async () => {
    if (!call?.id || !call.customerId || last4.length !== 4) return;
    setCheckResult('checking');
    const res = await fetch('/api/manual-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: call.id, customerId: call.customerId, last4, repId }),
    });
    const data = await res.json();
    if (data.matched) {
      setCheckResult('match');
      setCall({ ...call, status: 'manual_review' });
    } else {
      setCheckResult('no_match');
      setAttempts((a) => a + 1);
    }
  };

  const badge = call ? STATUS_BADGE[call.status] ?? STATUS_BADGE.pending : null;

  return (
    <div style={{ minHeight: '100vh', background: '#0D1B2A', padding: '40px' }}>
      <h1 style={{ color: 'white' }}>VerifyAI Rep Dashboard</h1>

      <div style={{ marginTop: '16px', marginBottom: '32px' }}>
        <label style={{ color: '#94A3B8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Rep name/ID</label>
        <input
          type="text"
          placeholder="e.g. jsmith"
          value={repId}
          onChange={(e) => setRepId(e.target.value)}
          style={{ padding: '8px 12px', width: '220px', borderRadius: '8px', border: '1px solid #334155', background: '#1E2D3D', color: 'white' }}
        />
      </div>

      {call && (
        <div style={{ background: '#1E2D3D', borderRadius: '12px', padding: '24px', marginBottom: '32px', maxWidth: '480px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ color: '#94A3B8', fontSize: '13px' }}>Incoming call: {call.phone}</span>
            {badge && (
              <span style={{ background: badge.color, color: '#0D1B2A', padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' }}>
                {badge.label}
              </span>
            )}
          </div>
          {badge && <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '16px' }}>{badge.note}</p>}

          {call.status === 'auto_verified' && (
            <div>
              <h2 style={{ color: 'white', fontSize: '20px', marginBottom: '4px' }}>{call.customerName}</h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '16px' }}>{call.customerEmail}</p>
              <button
                onClick={() => sendOTP(call.phone)}
                style={{ padding: '10px 20px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                Send OTP for sensitive action
              </button>
            </div>
          )}

          {call.status === 'pending' && call.customerId && (
            <div>
              <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '4px' }}>{call.customerName}</h2>
              <p style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '16px' }}>
                No SMS-capable number on file. Confirm identity manually: ask the caller for the last 4 digits of their SSN.
              </p>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="last 4 digits"
                value={last4}
                onChange={(e) => setLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                disabled={attempts >= 3}
                style={{ padding: '10px', width: '140px', borderRadius: '8px', border: '1px solid #334155', background: '#0D1B2A', color: 'white', marginRight: '12px' }}
              />
              <button
                onClick={submitManualCheck}
                disabled={last4.length !== 4 || attempts >= 3 || checkResult === 'checking'}
                style={{ padding: '10px 20px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                {checkResult === 'checking' ? 'Checking...' : 'Confirm'}
              </button>
              {checkResult === 'no_match' && attempts < 3 && (
                <p style={{ color: '#EF4444', marginTop: '12px', fontSize: '13px' }}>No match ({attempts}/3 attempts).</p>
              )}
              {attempts >= 3 && (
                <p style={{ color: '#EF4444', marginTop: '12px', fontSize: '13px' }}>Too many failed attempts — escalate to a supervisor.</p>
              )}
              {checkResult === 'match' && (
                <p style={{ color: '#22C55E', marginTop: '12px', fontSize: '13px' }}>Identity confirmed manually.</p>
              )}
            </div>
          )}

          {call.status === 'pending' && !call.customerId && (
            <p style={{ color: '#94A3B8', fontSize: '13px' }}>
              Unrecognized caller. Confirm the phone number with the caller, then use the form below to send a verification link once identity is established.
            </p>
          )}
        </div>
      )}

      <p style={{ color: '#94A3B8' }}>Enter customer phone to verify identity</p>
      <input
        type="tel"
        placeholder="+1 (555) 000-0000"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ padding: '12px', width: '300px', borderRadius: '8px', border: '1px solid #334155', background: '#1E2D3D', color: 'white', marginTop: '16px', display: 'block' }}
      />
      <button
        onClick={() => sendOTP(phone)}
        style={{ marginTop: '16px', padding: '12px 24px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}
      >
        {status === 'sending' ? 'Sending...' : 'Send Verification'}
      </button>
      {status === 'waiting' && (
        <p style={{ color: '#22C55E', marginTop: '16px' }}>OTP sent! Waiting for customer to verify...</p>
      )}
      {status === 'error' && (
        <p style={{ color: '#EF4444', marginTop: '16px' }}>Error sending OTP. Check Twilio config.</p>
      )}
    </div>
  );
}
