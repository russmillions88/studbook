import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import NavBar from '@/components/NavBar';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <>
      <NavBar />
      <div className="wrap" style={{ paddingTop: 50, paddingBottom: 90 }}>
        <h1 style={{ fontSize: 30 }}>Welcome, {profile?.full_name || user.email}</h1>
        <p style={{ marginTop: 12, color: 'rgba(28,27,24,0.7)' }}>
          You&apos;re logged in as a {profile?.is_stallion_owner ? 'stallion owner' : 'mare owner'}.
        </p>
        <p style={{ marginTop: 24, color: 'rgba(28,27,24,0.55)', fontSize: 14 }}>
          Listing management and search are coming in the next build stage.
        </p>
      </div>
    </>
  );
}
