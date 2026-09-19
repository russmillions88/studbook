import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import NavBar from '@/components/NavBar';
import InquiryForm from '@/components/InquiryForm';

export default async function StallionDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: stallion } = await supabase
    .from('stallions')
    .select('*, breeds(name)')
    .eq('id', params.id)
    .single();

  if (!stallion) {
    notFound();
  }

  const isOwner = user?.id === stallion.owner_id;
  const studFee = stallion.stud_fee_cents ? `$${(stallion.stud_fee_cents / 100).toLocaleString()}` : 'Contact for price';

  return (
    <>
      <NavBar />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 90, maxWidth: 800 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 34 }}>{stallion.name}</h1>
            <p style={{ color: 'rgba(28,27,24,0.6)', marginTop: 4 }}>
              {stallion.breeds?.name || 'Breed not specified'}
              {stallion.location_city ? ` · ${stallion.location_city}, ${stallion.location_state || ''}` : ''}
            </p>
          </div>
          {isOwner && (
            <Link href={`/dashboard/stallions/${stallion.id}/edit`} className="btn btn-secondary">
              Edit listing
            </Link>
          )}
        </div>

        <div className="card" style={{ padding: 24, marginTop: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, color: 'rgba(28,27,24,0.55)' }}>Stud fee</div>
              <div style={{ fontWeight: 600, fontSize: 17 }}>{studFee}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'rgba(28,27,24,0.55)' }}>Color</div>
              <div style={{ fontWeight: 600, fontSize: 17 }}>{stallion.color || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'rgba(28,27,24,0.55)' }}>Height</div>
              <div style={{ fontWeight: 600, fontSize: 17 }}>
                {stallion.height_hands ? `${stallion.height_hands} hh` : '—'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'rgba(28,27,24,0.55)' }}>Birth year</div>
              <div style={{ fontWeight: 600, fontSize: 17 }}>{stallion.birth_year || '—'}</div>
            </div>
          </div>

          {stallion.description && (
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
              <p style={{ whiteSpace: 'pre-wrap' }}>{stallion.description}</p>
            </div>
          )}
        </div>

        {!isOwner && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 22, marginBottom: 14 }}>Interested in this stallion?</h2>
            <InquiryForm stallionId={stallion.id} isLoggedIn={!!user} userEmail={user?.email} />
          </div>
        )}
      </div>
    </>
  );
}
