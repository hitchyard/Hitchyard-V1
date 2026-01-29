
export const metadata = {
  title: 'Hitchyard | Utah Freight for Box & Cargo Vans',
};

"use client";
import { useState } from "react";
import { submitHitchyardLead } from '../lib/supabase-actions';

function CheckMyLoadForm({
  onScoreCalculated,
}: {
  onScoreCalculated: (score: number) => void
}) {
  const [palletCount, setPalletCount] = useState<string>("");
  const [originZip, setOriginZip] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [score, setScore] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const isValidUtahZip = (zip: string): boolean => {
    const zipNum = parseInt(zip, 10);
    return zip.length === 5 && zipNum >= 84001 && zipNum <= 84784;
  };

  const calculateScore = async () => {
    setErrorMessage(null);

    if (!palletCount || !originZip) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const pallets = parseInt(palletCount, 10);
    if (pallets < 4) {
      setErrorMessage("Minimum 4 pallets for box trucks, Sprinters, or cargo vans.");
      setScore(null);
      return;
    }
    if (pallets > 10) {
      setErrorMessage("Maximum 10 pallets for this service.");
      setScore(null);
      return;
    }
    if (!isValidUtahZip(originZip)) {
      setErrorMessage("Please enter a valid Utah ZIP code (84xxx).");
      setScore(null);
      return;
    }

    // HPS Formula: (Reliability * 0.4) + (Efficiency * 0.3) + (Relationship * 0.2) + (Match Success * 0.1)
    // Simplified calculation based on available inputs
    const reliability = 85; // Base reliability score
    const efficiency = Math.min(100, 70 + (pallets - 4) * 5); // Higher efficiency for more pallets
    const relationship = 75; // Base relationship score
    // Match success based on ZIP (core Wasatch Front areas score higher)
    const zipNum = parseInt(originZip, 10);
    let matchSuccess = 70;
    if (zipNum >= 84101 && zipNum <= 84199) {
      matchSuccess = 95; // Salt Lake City area
    } else if (zipNum >= 84601 && zipNum <= 84699) {
      matchSuccess = 90; // Provo/Utah County area
    } else if (zipNum >= 84401 && zipNum <= 84499) {
      matchSuccess = 88; // Ogden area
    }
    const hpsScore = Math.round(
      (reliability * 0.4) + (efficiency * 0.3) + (relationship * 0.2) + (matchSuccess * 0.1)
    );
    const finalScore = Math.min(100, hpsScore);
    setScore(finalScore);
    onScoreCalculated(finalScore);

    // Submit lead if email is provided
    if (email) {
      setSubmitting(true);
      const { error } = await submitHitchyardLead(email, pallets, originZip);
      setSubmitting(false);
      if (!error) {
        setSubmitted(true);
      } else {
        setErrorMessage("Submission failed. Please try again.");
      }
    }
  };

  return (
    <div className="border border-border-subtle/40 p-6 md:p-8">
      <h2 className="text-xl font-medium text-foreground mb-6">Check My Load</h2>
      <div className="space-y-5">
        {/* Pallet Count */}
        <div>
          <label htmlFor="pallet-count" className="block text-sm text-muted-foreground mb-2">Pallet Count (4-10)</label>
          <input id="pallet-count" name="pallet_count" type="number" min="4" max="10" placeholder="4–10 pallets" value={palletCount} onChange={(e) => setPalletCount(e.target.value)} className="w-full border border-border-subtle/40 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-steel-blue bg-background" />
        </div>
        {/* Origin ZIP Code */}
        <div>
          <label htmlFor="origin-zip" className="block text-sm text-muted-foreground mb-2">Origin ZIP Code</label>
          <input id="origin-zip" name="origin_zip" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={5} placeholder="Utah ZIP only (84xxx)" value={originZip} onChange={(e) => setOriginZip(e.target.value.replace(/\D/g, "").slice(0, 5))} className="w-full border border-border-subtle/40 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-steel-blue bg-background" />
        </div>
        {/* Company Name (optional) */}
        <div>
          <label htmlFor="company-name" className="block text-sm text-muted-foreground mb-2">Company Name (optional)</label>
          <input id="company-name" name="company_name" type="text" placeholder="Your company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full border border-border-subtle/40 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-steel-blue bg-background" />
        </div>
        {/* Email (optional) */}
        <div>
          <label htmlFor="email" className="block text-sm text-muted-foreground mb-2">Email (optional)</label>
          <input id="email" name="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-border-subtle/40 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-steel-blue bg-background" />
        </div>
        {/* Error Message */}
        {errorMessage && (<p className="text-sm text-red-400">{errorMessage}</p>)}
        {/* Check My Load Button */}
        <button type="button" onClick={calculateScore} className="w-full bg-steel-blue text-primary-foreground py-3 font-medium hover:bg-steel-blue/90 transition-colors" disabled={submitting}>{submitting ? 'Submitting...' : submitted ? 'Submitted!' : 'Check My Load'}</button>
        {/* Score Output */}
        {score !== null && (
          <div className="pt-6 border-t border-border-subtle/40">
            <p className="text-sm text-muted-foreground mb-2">Hitchyard Performance Score (HPS)</p>
            <p className="text-5xl font-light text-foreground tracking-tight">{score}</p>
            <p className="text-sm text-muted-foreground mt-3">{score >= 80 ? "Strong match for Hitchyard service" : score >= 60 ? "Good fit with some considerations" : "May require further evaluation"}</p>
            {submitted && (<p className="text-green-500 mt-4">Thank you! Your request has been received.</p>)}
          </div>
        )}
      </div>
    </div>
  );
}

function VehicleTypes() {
  return (
    <div className="border-t border-border-subtle/40 pt-10">
      <h3 className="text-sm font-medium text-foreground mb-4 tracking-wide uppercase">Vehicle Types</h3>
      <ul className="space-y-2 text-muted-foreground">
        <li>Box Trucks</li>
        <li>Sprinter Vans</li>
        <li>Cargo Vans</li>
      </ul>
    </div>
  );
}

function FAQSection() {
  const faqs = [
    {
      question: "What is Hitchyard?",
      answer: "Hitchyard is a licensed freight broker operating in Utah. We connect shippers with reliable local trucks."
    },
    {
      question: "Are you a motor carrier?",
      answer: "No. Hitchyard is a freight broker only; we do not operate trucks ourselves."
    },
    {
      question: "What shipments do you handle?",
      answer: "We handle 4–10 pallet loads using Box Trucks, Sprinters, and Cargo Vans."
    },
    {
      question: "Do you serve locations outside Utah?",
      answer: "No. We focus exclusively on local Utah deliveries."
    },
    {
      question: "Are there minimum requirements?",
      answer: "All shipments are subject to minimum pallet counts and vehicle availability."
    }
  ];
  return (
    <div className="border-t border-border-subtle/40 pt-10">
      <h3 className="text-sm font-medium text-foreground mb-6 tracking-wide uppercase">FAQ</h3>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index}>
            <p className="text-foreground font-medium mb-1">Q: {faq.question}</p>
            <p className="text-muted-foreground">A: {faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  const [showCTA, setShowCTA] = useState(false);

  const handleScoreCalculated = (score: number) => {
    setShowCTA(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[900px] mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <header className="mb-12">
          <p className="text-sm tracking-widest text-muted-foreground uppercase mb-8">HITCHYARD</p>
          <h1 className="text-3xl md:text-4xl font-medium text-foreground tracking-tight mb-4 text-balance">UTAH DRY FREIGHT. RELIABLE, EVERY TIME.</h1>
          <p className="text-lg text-muted-foreground">We move 4–10 pallets across the Wasatch Front. On-time pickup. Local expertise.</p>
        </header>
        {/* Check My Load Form */}
        <section className="mb-12">
          <CheckMyLoadForm onScoreCalculated={handleScoreCalculated} />
        </section>
        {/* Vehicle Types */}
        <section className="mb-12">
          <VehicleTypes />
        </section>
        {/* FAQ Section */}
        <section className="mb-12">
          <FAQSection />
        </section>
        {/* Footer */}
        <footer className="border-t border-border-subtle/40 pt-10 text-center">
          <p className="text-sm text-muted-foreground">Serving Utah shippers only. Focused on local deliveries.</p>
        </footer>
      </div>
    </main>
  );
}
