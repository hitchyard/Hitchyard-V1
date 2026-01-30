"use client";

import { useState, ChangeEvent } from "react";
import { submitHitchyardLead } from '../lib/supabase-actions';
import { Calculator, Truck, MapPin, DollarSign, Weight, ChevronRight, CheckCircle2 } from "lucide-react";

function CheckMyLoadForm({ onScoreCalculated }: { onScoreCalculated: (score: number) => void }) {
  const [formData, setFormData] = useState({ origin: "", destination: "", weight: "", payout: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => 
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const calculateScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const weightNum = parseFloat(formData.weight) || 0;
    const payoutNum = parseFloat(formData.payout) || 0;
    const score = Math.min(Math.round((payoutNum / (weightNum || 1)) * 10), 100);

    try {
      await submitHitchyardLead(formData.origin, formData.destination, weightNum, payoutNum);
      onScoreCalculated(score);
    } catch (err) {
      console.error(err);
      onScoreCalculated(score);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
      <form onSubmit={calculateScore} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <input name="origin" required placeholder="Origin City, UT" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={handleChange} />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <input name="destination" required placeholder="Destination" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={handleChange} />
          </div>
          <div className="relative">
            <Weight className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <input name="weight" type="number" required placeholder="Weight (lbs)" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={handleChange} />
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <input name="payout" type="number" required placeholder="Payout ($)" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={handleChange} />
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50">
          {isSubmitting ? (
            "Analyzing Market Data..."
          ) : (
            <>
              Check My Load <ChevronRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function Page() {
  const [showCTA, setShowCTA] = useState(false);
  
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <main className="max-w-4xl mx-auto px-6 py-20">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Truck className="h-4 w-4" /> Built for Utah Owner-Operators
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600">
            Hitchyard
          </h1>
          <p className="text-xl text-slate-500 max-w-lg mx-auto leading-relaxed">
            Stop guessing. Instantly see if your load is worth the diesel and the drive.
          </p>
        </header>

        <CheckMyLoadForm onScoreCalculated={() => setShowCTA(true)} />

        {showCTA && (
          <div className="mt-8 p-6 bg-white border-2 border-green-100 rounded-2xl flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-green-900">Analysis Submitted!</h3>
              <p className="text-green-700 text-sm">We're comparing your rate against Utah market averages. We'll be in touch shortly.</p>
            </div>
          </div>
        )}

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-200 pt-12">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Focus</h4>
            <p className="text-slate-600 text-sm leading-relaxed">Intra-Utah freight and specialized loads.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Equipment</h4>
            <div className="flex flex-wrap gap-2">
              {['Box Van', 'Cargo Van', 'Sprinter'].map(t => (
                <span key={t} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Privacy</h4>
            <p className="text-slate-600 text-sm leading-relaxed">Your data is never shared with brokers. Only our carrier network.</p>
          </div>
        </div>
      </main>
    </div>
  );
}