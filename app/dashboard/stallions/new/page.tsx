import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import NavBar from '@/components/NavBar';
import StallionForm from '@/components/StallionForm';

export default async function NewStallionPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: breeds } = await supabase.from('breeds').select('id, name').order('name');

  return (
    <>
      <NavBar />
      <div className="wrap" style={{ maxWidth: 640, paddingTop: 50, paddingBottom: 90 }}>
        <h1 style={{ fontSize: 30, marginBottom: 8 }}>List a stallion</h1>
        <p style={{ color: 'rgba(28,27,24,0.65)', marginBottom: 32 }}>
          You can add photos and documents after creating the listing.
        </p>
        <StallionForm breeds={breeds || []} />
      </div>
    </>
  );
}
