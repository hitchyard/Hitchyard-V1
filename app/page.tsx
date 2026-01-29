export const metadata = {
  title: 'Hitchyard | Utah Freight for Box & Cargo Vans',
};
"use client";
import React, { useState } from 'react';
import { submitHitchyardLead } from '../lib/supabase-actions';
import Image from 'next/image';

export default function Page() {
  const [email, setEmail] = useState('');
  const [palletCount, setPalletCount] = useState(4);
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{success: boolean, error: any} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const { error } = await submitHitchyardLead(email, palletCount, zipCode);
    setResult({ success: !error, error });
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1A1D21', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <header style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: 2, color: '#2A6FAF' }}>
          HITCHYARD — UTAH LTL, 4-10 PALLETS, DRY ONLY
        </h1>
        <p style={{ color: '#fff', fontSize: 18, marginTop: 12, fontWeight: 400 }}>
          No reefers. Utah-only. 4-10 dry pallets. Request your Steward Audit below.
        </p>
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
          Pallet Count (4-10)
          <input
            type="number"
            min={4}
            max={10}
            required
            value={palletCount}
            onChange={e => setPalletCount(Number(e.target.value))}
            style={{ marginTop: 8, padding: 10, borderRadius: 6, border: '1px solid #2A6FAF', background: '#181A1D', color: '#fff', width: '100%' }}
            placeholder="4"
          />
        </label>
        <label style={{ fontWeight: 500, color: '#fff' }}>
          Utah Zip Code
          <input
            type="text"
            required
            value={zipCode}
            onChange={e => setZipCode(e.target.value)}
            style={{ marginTop: 8, padding: 10, borderRadius: 6, border: '1px solid #2A6FAF', background: '#181A1D', color: '#fff', width: '100%' }}
            placeholder="84101"
            pattern="^84[0-9]{3}$"
            title="Utah zip codes start with 84"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          style={{ background: '#2A6FAF', color: '#fff', fontWeight: 700, padding: '12px 0', border: 'none', borderRadius: 8, fontSize: 18, cursor: 'pointer', transition: 'background 0.2s' }}
        >
          {loading ? 'Submitting...' : 'Request Steward Audit'}
        </button>
      </form>
      {result && (
        <div style={{ marginTop: 36, textAlign: 'center' }}>
          {result.success ? (
            <div style={{ color: '#2A6FAF', fontSize: 28, fontWeight: 700 }}>
              Steward Audit requested! We’ll be in touch soon.
            </div>
          ) : (
            <div style={{ color: '#ff4d4f', fontWeight: 600 }}>Submission failed. Please try again.</div>
          )}
        </div>
      )}
    </div>
  );
}
