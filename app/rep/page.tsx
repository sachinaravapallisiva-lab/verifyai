'use client';
import { useState } from 'react';

export default function RepDashboard() {
  const [phone, setPhone] = useState('');

  return (
    <div style={{ minHeight: '100vh', background: '#0D1B2A', padding: '40px' }}>
      <h1 style={{ color: 'white' }}>VerifyAI Rep Dashboard</h1>
      <p style={{ color: '#94A3B8' }}>Enter customer phone to verify identity</p>
      <input
        type="tel"
        placeholder="+1 (555) 000-0000"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ padding: '12px', width: '300px', borderRadius: '8px', border: 'none', marginTop: '16px' }}
      />
      <br />
      <button
        style={{ marginTop: '16px', padding: '12px 24px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
        Send Verification
      </button>
    </div>
  );
}