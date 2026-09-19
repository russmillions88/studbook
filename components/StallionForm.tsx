'use client';

import { useState } from 'react';
import { createStallion, updateStallion } from '@/lib/actions/stallions';

type Breed = { id: number; name: string };

type StallionData = {
  id?: string;
  name?: string;
  breed_id?: number | null;
  color?: string | null;
  height_hands?: number | null;
  birth_year?: number | null;
  stud_fee_cents?: number | null;
  location_city?: string | null;
  location_state?: string | null;
  description?: string | null;
};

export default function StallionForm({
  breeds,
  existing,
}: {
  breeds: Breed[];
  existing?: StallionData;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEdit = !!existing?.id;
  const studFeeDollars = existing?.stud_fee_cents ? (existing.stud_fee_cents / 100).toString() : '';

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    const result = isEdit
      ? await updateStallion(existing!.id!, formData)
      : await createStallion(formData);

    // If we get here without a redirect having happened, there was an error.
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit}>
      <div className="field">
        <label htmlFor="name">Stallion name *</label>
        <input id="name" name="name" type="text" required defaultValue={existing?.name || ''} />
      </div>

      <div className="field">
        <label htmlFor="breed_id">Breed</label>
        <select id="breed_id" name="breed_id" defaultValue={existing?.breed_id?.toString() || ''}>
          <option value="">Select a breed</option>
          {breeds.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <div className="field" style={{ flex: 1 }}>
          <label htmlFor="color">Color</label>
          <input id="color" name="color" type="text" defaultValue={existing?.color || ''} />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label htmlFor="height_hands">Height (hands)</label>
          <input
            id="height_hands"
            name="height_hands"
            type="number"
            step="0.1"
            defaultValue={existing?.height_hands?.toString() || ''}
          />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label htmlFor="birth_year">Birth year</label>
          <input
            id="birth_year"
            name="birth_year"
            type="number"
            defaultValue={existing?.birth_year?.toString() || ''}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="stud_fee_dollars">Stud fee (USD)</label>
        <input
          id="stud_fee_dollars"
          name="stud_fee_dollars"
          type="number"
          step="1"
          placeholder="e.g. 1500"
          defaultValue={studFeeDollars}
        />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <div className="field" style={{ flex: 1 }}>
          <label htmlFor="location_city">City</label>
          <input
            id="location_city"
            name="location_city"
            type="text"
            defaultValue={existing?.location_city || ''}
          />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label htmlFor="location_state">State / Region</label>
          <input
            id="location_state"
            name="location_state"
            type="text"
            defaultValue={existing?.location_state || ''}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={existing?.description || ''}
          style={{ resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" className="btn" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
        {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Create listing'}
      </button>
    </form>
  );
}
