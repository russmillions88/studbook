import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from './SignOutButton';

export default async function NavBar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="wrap">
      <nav className="site-bar">
        <Link href="/" className="wordmark" style={{ textDecoration: 'none' }}>
          Stud<span>book</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/directory">Directory</Link>
          {user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link href="/signup" className="btn" style={{ marginLeft: 24 }}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
