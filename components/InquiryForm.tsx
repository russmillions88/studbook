'use client';

import { useState } from 'react';
import { submitInquiry } from '@/lib/actions/inquiries';

export default function InquiryForm({
  stallionId,
  isLoggedIn,
  userEmail,
}: {
  stallionId: string;
  isLoggedIn: boolean;
  userEmail?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    const result = await submitInquiry(stallionId, formData);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="card" style={{ padding: 20 }}>
        <p className="success-text" style={{ margin: 0 }}>
          Your message has been sent to the stallion owner.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="card" style={{ padding: 20 }}>
      <div className="field">
        <label htmlFor="name">Your name</label>
        <input id="name" name="name" type="text" required />
      </div>
      <div className="field">
        <label htmlFor="email">Your email</label>
        <input id="email" name="email" type="email" required defaultValue={userEmail || ''} />
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Tell them about your mare and what you're looking for..."
          style={{ resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      <button type="submit" className="btn" disabled={loading}>
        {loading ? 'Sending...' : 'Send inquiry'}
      </button>
      {!isLoggedIn && (
        <p style={{ fontSize: 13, color: 'rgba(28,27,24,0.55)', marginTop: 10 }}>
          You don&apos;t need an account to send this.
        </p>
      )}
    </form>
  );
}
