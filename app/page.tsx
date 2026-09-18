import Link from 'next/link';
import NavBar from '@/components/NavBar';

export default function HomePage() {
  return (
    <>
      <NavBar />
      <div className="wrap" style={{ paddingTop: 70, paddingBottom: 90 }}>
        <h1 style={{ fontSize: 42, maxWidth: '11ch', letterSpacing: '-0.01em' }}>
          A registry for finding the right match, not just any match.
        </h1>
        <p style={{ marginTop: 20, maxWidth: '46ch', fontSize: 18, color: 'rgba(28,27,24,0.78)' }}>
          Studbook is a searchable directory of stallions and the mares looking
          for them — built around pedigree, health records, and real breeding
          intent.
        </p>
        <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
          <Link href="/directory" className="btn">Browse the directory</Link>
          <Link href="/signup" className="btn btn-secondary">Create an account</Link>
        </div>
      </div>
    </>
  );
}
