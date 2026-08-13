import React, { useState } from 'react';
import { apiRequest } from '../api';

export default function AuthPage({ onAuthenticated }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      const { response, data } = await apiRequest(`/api/auth/${isRegistering ? 'register' : 'login'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!response.ok) throw new Error(data?.message || `Unable to continue (server returned ${response.status}).`);
      if (!data?.token) throw new Error('The server did not return a valid sign-in session. Restart any older server instances and try again.');
      onAuthenticated(data);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <main className="app-container" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}><section className="glass-panel" style={{ width: 'min(420px, 92vw)', padding: '32px' }}><h1>RiseUp Financial Manager</h1><p style={{ color: 'var(--text-secondary)' }}>{isRegistering ? 'Create your private, database-backed workspace.' : 'Sign in to your account.'}</p><form onSubmit={submit} style={{ display: 'grid', gap: '14px', marginTop: '24px' }}>{isRegistering && <><input className="form-input" placeholder="Full name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /><input className="form-input" type="number" min="18" placeholder="Age (optional)" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} /></>}<input className="form-input" type="email" placeholder="Email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /><input className="form-input" type="password" minLength="6" placeholder="Password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />{error && <div style={{ color: 'var(--accent-rose)' }}>{error}</div>}<button className="btn-primary" disabled={busy}>{busy ? 'Please wait…' : isRegistering ? 'Create account' : 'Sign in'}</button></form><button className="btn-secondary" style={{ marginTop: '16px', width: '100%' }} onClick={() => { setIsRegistering(!isRegistering); setError(''); }}>{isRegistering ? 'Already registered? Sign in' : 'New here? Create an account'}</button></section></main>;
}
