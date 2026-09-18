'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'mare' | 'stallion'>('mare');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // If email confirmation is off, session exists immediately and we can
    // set is_stallion_owner right away. If confirmation is required,
    // this update will run once they confirm and log in (see login page).
    if (data.user) {
      await supabase
        .from('profiles')
        .update({ is_stallion_owner: role === 'stallion' })
        .eq('id', data.user.id);
    }

    setLoading(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="wrap" style={{ maxWidth: 480, paddingTop: 80 }}>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Check your email</h1>
        <p style={{ color: 'rgba(28,27,24,0.72)' }}>
          We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click it, then{' '}
          <Link href="/login" style={{ textDecoration: 'underline' }}>log in</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="wrap" style={{ maxWidth: 440, paddingTop: 60, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 30, marginBottom: 8 }}>Create your account</h1>
      <p style={{ color: 'rgba(28,27,24,0.65)', marginBottom: 32 }}>
        Free for mare owners. Stallion owners get a free listing to start.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="field">
          <label>I am mainly here as</label>
          <div style={{ display: 'flex', gap: 20, fontWeight: 400, fontSize: 15 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 400 }}>
              <input
                type="radio"
                name="role"
                checked={role === 'mare'}
                onChange={() => setRole('mare')}
                style={{ width: 'auto' }}
              />
              A mare owner
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 400 }}>
              <input
                type="radio"
                name="role"
                checked={role === 'stallion'}
                onChange={() => setRole('stallion')}
                style={{ width: 'auto' }}
              />
              A stallion owner
            </label>
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p style={{ marginTop: 20, fontSize: 14, color: 'rgba(28,27,24,0.65)' }}>
        Already have an account? <Link href="/login" style={{ textDecoration: 'underline' }}>Log in</Link>
      </p>
    </div>
  );
}
