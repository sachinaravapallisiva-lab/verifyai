'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Rep = {
  id: string;
  email: string;
  name: string;
  role: 'rep' | 'admin';
  active: boolean;
  created_at: string;
};

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  width: '100%',
  borderRadius: '8px',
  border: '1px solid #334155',
  background: '#0D1B2A',
  color: 'white',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  color: '#94A3B8',
  fontSize: '13px',
  display: 'block',
  marginBottom: '4px',
};

export default function AdminDashboardClient() {
  const router = useRouter();
  const [reps, setReps] = useState<Rep[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'rep' | 'admin'>('rep');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  const loadReps = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/reps');
    if (res.ok) {
      const data = await res.json();
      setReps(data.reps);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReps();
  }, []);

  const logout = async () => {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const createRep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setFormError('Agree to the Terms of Service before you create this account.');
      return;
    }
    setCreating(true);
    setFormError('');
    const res = await fetch('/api/admin/reps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role, acceptedTerms: true }),
    });
    const data = await res.json();
    if (!res.ok) {
      setFormError(data.error ?? 'Failed to create rep');
      setCreating(false);
      return;
    }
    setEmail('');
    setPassword('');
    setName('');
    setRole('rep');
    setAcceptedTerms(false);
    setCreating(false);
    await loadReps();
  };

  const toggleActive = async (rep: Rep) => {
    const res = await fetch(`/api/admin/reps/${rep.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !rep.active }),
    });
    if (res.ok) {
      await loadReps();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D1B2A', padding: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ color: 'white' }}>VerifyAI Admin</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/rep" style={{ color: '#4F7DF3', fontSize: '13px', textDecoration: 'underline' }}>
            Rep Dashboard
          </a>
          <button
            onClick={logout}
            disabled={loggingOut}
            style={{ padding: '8px 16px', background: '#1E2D3D', color: 'white', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
          >
            {loggingOut ? 'Signing out...' : 'Log out'}
          </button>
        </div>
      </div>

      <div style={{ background: '#1E2D3D', borderRadius: '12px', padding: '24px', marginTop: '32px', maxWidth: '420px' }}>
        <h2 style={{ color: 'white', fontSize: '16px', marginBottom: '16px' }}>Create rep account</h2>
        <form onSubmit={createRep}>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Name</label>
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Email</label>
            <input type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Role</label>
            <select style={inputStyle} value={role} onChange={(e) => setRole(e.target.value as 'rep' | 'admin')}>
              <option value="rep">Rep</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', marginBottom: 0 }}>
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                required
                style={{ marginTop: '2px' }}
              />
              <span>
                I agree to the{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#4F7DF3', textDecoration: 'underline' }}>
                  Terms
                </a>
              </span>
            </label>
          </div>
          {formError && <p style={{ color: '#EF4444', fontSize: '13px', marginBottom: '12px' }}>{formError}</p>}
          <button
            type="submit"
            disabled={creating || !acceptedTerms}
            style={{
              padding: '10px 20px',
              width: '100%',
              background: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: creating || !acceptedTerms ? 'not-allowed' : 'pointer',
              opacity: creating || !acceptedTerms ? 0.5 : 1,
            }}
          >
            {creating ? 'Creating...' : 'Create rep'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '32px', maxWidth: '720px' }}>
        <h2 style={{ color: 'white', fontSize: '16px', marginBottom: '16px' }}>Rep accounts</h2>
        {loading ? (
          <p style={{ color: '#94A3B8' }}>Loading...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#94A3B8', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '8px', borderBottom: '1px solid #334155' }}>Name</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #334155' }}>Email</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #334155' }}>Role</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #334155' }}>Status</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #334155' }}></th>
              </tr>
            </thead>
            <tbody>
              {reps.map((rep) => (
                <tr key={rep.id} style={{ color: 'white', fontSize: '14px' }}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #1E2D3D' }}>{rep.name}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #1E2D3D', color: '#94A3B8' }}>{rep.email}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #1E2D3D', color: '#94A3B8' }}>{rep.role}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #1E2D3D' }}>
                    <span style={{ color: rep.active ? '#22C55E' : '#EF4444' }}>{rep.active ? 'Active' : 'Deactivated'}</span>
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #1E2D3D' }}>
                    <button
                      onClick={() => toggleActive(rep)}
                      style={{ padding: '6px 12px', background: rep.active ? '#DC2626' : '#334155', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      {rep.active ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
