'use client';

import { useState } from 'react';
import { deleteStallion } from '@/lib/actions/stallions';

export default function DeleteStallionButton({
  stallionId,
  stallionName,
}: {
  stallionId: string;
  stallionName: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => setConfirming(true)}
        style={{ color: '#a3423c', borderColor: '#a3423c' }}
      >
        Delete listing
      </button>
    );
  }

  return (
    <div>
      <p style={{ fontSize: 14, marginBottom: 12 }}>
        Delete <strong>{stallionName}</strong>? This can&apos;t be undone.
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="button"
          className="btn"
          style={{ background: '#a3423c' }}
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await deleteStallion(stallionId);
          }}
        >
          {loading ? 'Deleting...' : 'Yes, delete it'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => setConfirming(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
