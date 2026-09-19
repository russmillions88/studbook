import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import NavBar from '@/components/NavBar';
import StallionForm from '@/components/StallionForm';
import DeleteStallionButton from '@/components/DeleteStallionButton';

export default async function EditStallionPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: stallion } = await supabase
    .from('stallions')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!stallion) {
    notFound();
  }

  if (stallion.owner_id !== user.id) {
    redirect(`/stallions/${params.id}`);
  }

  const { data: breeds } = await supabase.from('breeds').select('id, name').order('name');

  return (
    <>
      <NavBar />
      <div className="wrap" style={{ maxWidth: 640, paddingTop: 50, paddingBottom: 90 }}>
        <h1 style={{ fontSize: 30, marginBottom: 32 }}>Edit {stallion.name}</h1>
        <StallionForm breeds={breeds || []} existing={stallion} />
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
          <DeleteStallionButton stallionId={stallion.id} stallionName={stallion.name} />
        </div>
      </div>
    </>
  );
}
