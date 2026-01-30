"use client";

import { useState, ChangeEvent } from "react";
import { submitHitchyardLead } from '../lib/supabase-actions';

function CheckMyLoadForm({ onScoreCalculated }: { onScoreCalculated: (score: number) => void }) {
  const [formData, setFormData] = useState({ origin: "", destination: "", weight: "", payout: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const calculateScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const weightNum = parseFloat(formData.weight) || 0;
    const payoutNum = parseFloat(formData.payout) || 0;
    const score = Math.min(Math.round((payoutNum / (weightNum || 1)) * 10), 100);
    try {
      await submitHitchyardLead({ ...formData, score });
      onScoreCalculated(score);
    } catch (err) {
      onScoreCalculated(score);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
      <form onSubmit={calculateScore} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="origin" required placeholder="Origin" className="bg-background border p-3 rounded" onChange={handleChange} />
        <input name="destination" required placeholder="Destination" className="bg-background border p-3 rounded" onChange={handleChange} />
        <input name="weight" type="number" required placeholder="Weight (lbs)" className="bg-background border p-3 rounded" onChange={handleChange} />
        <input name="payout" type="number" required placeholder="Payout ($)" className="bg-background border p-3 rounded" onChange={handleChange} />
        <button type="submit" disabled={isSubmitting} className="md:col-span-2 bg-primary text-white p-4 rounded font-bold">
          {isSubmitting ? "Calculating..." : "Check My Load"}
        </button>
      </form>
    </div>
  );
}

function VehicleTypes() {
  return (
    <div className="mt-10 border-t pt-10">
      <h3 className="text-sm font-bold uppercase mb-4">Vehicle Types</h3>
      <div className="flex gap-2">
        {['Box Van', 'Cargo Van', 'Sprinter'].map(t => <span key={t} className="px-3 py-1 bg-gray-100 rounded-full text-xs">{t}</span>)}
      </div>
    </div>
  );
}

function FAQSection() {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">FAQ</h2>
      <p className="text-sm text-gray-600">Specialized freight network for Utah owner-operators.</p>
    </div>
  );
}

export default function Page() {
  const [showCTA, setShowCTA] = useState(false);
  return (
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-4">Hitchyard</h1>
      <p className="mb-10 text-gray-600">Is your load worth the drive?</p>
      <CheckMyLoadForm onScoreCalculated={() => setShowCTA(true)} />
      {showCTA && <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">Lead submitted! We are checking market rates...</div>}
      <VehicleTypes />
      <FAQSection />
    </main>
  );
}