import NavBar from '@/components/NavBar';

export default function DirectoryPage() {
  return (
    <>
      <NavBar />
      <div className="wrap" style={{ paddingTop: 50, paddingBottom: 90 }}>
        <h1 style={{ fontSize: 30 }}>Directory</h1>
        <p style={{ marginTop: 12, color: 'rgba(28,27,24,0.6)' }}>
          Stallion listings and search will appear here in the next build stage.
        </p>
      </div>
    </>
  );
}
