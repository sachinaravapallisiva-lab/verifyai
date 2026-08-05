'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? 'Invalid email or password');
        setSubmitting(false);
        return;
      }
      const next = searchParams.get('next');
      router.push(next && next.startsWith('/') ? next : '/rep');
      router.refresh();
    } catch {
      setError('Something went wrong. Try again.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D1B2A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <form
        onSubmit={submit}
        style={{ background: '#1E2D3D', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '360px' }}
      >
        <h1 style={{ color: 'white', fontSize: '20px', marginBottom: '24px' }}>VerifyAI Rep Login</h1>

        <label style={{ color: '#94A3B8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Email</label>
        <input
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px 12px', width: '100%', borderRadius: '8px', border: '1px solid #334155', background: '#0D1B2A', color: 'white', marginBottom: '16px', boxSizing: 'border-box' }}
        />

        <label style={{ color: '#94A3B8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Password</label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px 12px', width: '100%', borderRadius: '8px', border: '1px solid #334155', background: '#0D1B2A', color: 'white', marginBottom: '16px', boxSizing: 'border-box' }}
        />

        {error && <p style={{ color: '#EF4444', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          style={{ padding: '10px 20px', width: '100%', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' }}
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
