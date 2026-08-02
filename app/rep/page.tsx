'use client';
import { useEffect, useState } from 'react';

type CallSession = {
  id: string;
  phone: string;
  customerId: string | null;
  status: string;
  verificationMethod: string | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  repId: string | null;
  createdAt: string;
};

type Badge = { label: string; color: string; note: string; rank: number };

// Ranked strongest (1) to weakest evidence. `verified` sessions are split by
// verificationMethod since biometric/PIN/tap-only carry different guarantees.
const BADGE_TIERS: Record<string, Badge> = {
  'verified:webauthn+pin': { label: 'Verified (biometric + PIN)', color: '#16A34A', note: 'Strongest evidence — customer confirmed with Face ID / Touch ID and their PIN', rank: 1 },
  'verified:biometric': { label: 'Verified (biometric)', color: '#22C55E', note: 'Customer confirmed with Face ID / Touch ID — no PIN on file to require alongside it', rank: 2 },
  'verified:pin': { label: 'Verified (PIN)', color: '#34D399', note: 'Customer confirmed with their PIN (biometric was unavailable or failed on their device)', rank: 3 },
  'verified:tap': { label: 'Verified (link tap)', color: '#4ADE80', note: 'Customer tapped the SMS link only — no biometric or PIN on file for this customer', rank: 4 },
  'manual_review:': { label: 'Manually verified', color: '#F59E0B', note: 'Rep confirmed identity manually', rank: 5 },
  'auto_verified:': { label: 'Auto-verified (Caller ID)', color: '#818CF8', note: 'Caller ID match only — spoofable, weakest evidence. Sensitive actions still need OTP.', rank: 6 },
  'awaiting_2fa:biometric': { label: 'In progress — biometric confirmed, PIN pending', color: '#38BDF8', note: 'Customer passed WebAuthn and still needs to enter their PIN before this session is verified', rank: 7 },
  'awaiting_2fa:': { label: 'Completing verification…', color: '#7DD3FC', note: 'Customer tapped the link and is confirming with biometric or PIN', rank: 8 },
  'pending:': { label: 'Pending', color: '#94A3B8', note: 'Awaiting verification', rank: 9 },
  'pin_failed:': { label: 'PIN attempts exhausted', color: '#DC2626', note: 'Customer failed the PIN stage 3 times on this link — it is now invalid, send a new verification link', rank: 10 },
  'expired:': { label: 'Expired', color: '#EF4444', note: 'Session expired before verification', rank: 11 },
};

function badgeFor(status: string, verificationMethod: string | null): Badge {
  if (status === 'verified') {
    return BADGE_TIERS[`verified:${verificationMethod ?? 'tap'}`] ?? BADGE_TIERS['verified:tap'];
  }
  if (status === 'awaiting_2fa') {
    return BADGE_TIERS[`awaiting_2fa:${verificationMethod ?? ''}`] ?? BADGE_TIERS['awaiting_2fa:'];
  }
  return BADGE_TIERS[`${status}:`] ?? BADGE_TIERS['pending:'];
}

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

  const badge = call ? badgeFor(call.status, call.verificationMethod) : null;

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

          {call.status === 'verified' && (
            <div>
              {call.customerId ? (
                <>
                  <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '4px' }}>{call.customerName ?? 'Unnamed customer'}</h2>
                  <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '2px' }}>{call.customerEmail ?? 'No email on file'}</p>
                  <p style={{ color: '#94A3B8', fontSize: '14px' }}>{call.customerPhone ?? call.phone}</p>
                </>
              ) : (
                <p style={{ color: '#94A3B8', fontSize: '13px' }}>
                  No customer record matched this session — the caller confirmed via the link, but couldn&apos;t be linked to a known profile.
                </p>
              )}
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
