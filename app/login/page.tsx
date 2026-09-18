'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="wrap" style={{ maxWidth: 440, paddingTop: 60, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 30, marginBottom: 8 }}>Log in</h1>
      <p style={{ color: 'rgba(28,27,24,0.65)', marginBottom: 32 }}>
        Welcome back.
      </p>

      <form onSubmit={handleSubmit}>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p style={{ marginTop: 20, fontSize: 14, color: 'rgba(28,27,24,0.65)' }}>
        Don&apos;t have an account? <Link href="/signup" style={{ textDecoration: 'underline' }}>Sign up</Link>
      </p>
    </div>
  );
}
