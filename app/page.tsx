import React, { useState } from 'react';
import { submitHitchyardLead } from '../lib/supabase-actions';
import Image from 'next/image';

export default function Page() {
  const [email, setEmail] = useState('');
  const [reliability, setReliability] = useState(50);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{score: string, error: any} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const { score, error } = await submitHitchyardLead(email, reliability);
    setResult({ score, error });
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1A1D21', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <header style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: 2, color: '#2A6FAF' }}>
          HITCHYARD — UTAH DRY FREIGHT, DONE RIGHT
        </h1>
      </header>
      <Image src="/truck.png" alt="Truck" width={320} height={160} style={{ marginBottom: 32, borderRadius: 12, boxShadow: '0 4px 24px #0006' }} />
      <form onSubmit={handleSubmit} style={{ background: '#23262B', padding: 32, borderRadius: 16, boxShadow: '0 2px 12px #0004', minWidth: 320, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <label style={{ fontWeight: 500, color: '#fff' }}>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ marginTop: 8, padding: 10, borderRadius: 6, border: '1px solid #2A6FAF', background: '#181A1D', color: '#fff', width: '100%' }}
            placeholder="your@email.com"
          />
        </label>
        <label style={{ fontWeight: 500, color: '#fff' }}>
          Reliability ({reliability})
          <input
            type="range"
            min={0}
            max={100}
            value={reliability}
            onChange={e => setReliability(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#2A6FAF', marginTop: 8 }}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          style={{ background: '#2A6FAF', color: '#fff', fontWeight: 700, padding: '12px 0', border: 'none', borderRadius: 8, fontSize: 18, cursor: 'pointer', transition: 'background 0.2s' }}
        >
          {loading ? 'Submitting...' : 'Get HPS Score'}
        </button>
      </form>
      {result && (
        <div style={{ marginTop: 36, textAlign: 'center' }}>
          {result.error ? (
            <div style={{ color: '#ff4d4f', fontWeight: 600 }}>Submission failed. Please try again.</div>
          ) : (
            <div style={{ color: '#2A6FAF', fontSize: 48, fontWeight: 800, letterSpacing: 2 }}>
              HPS Score: {result.score}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
