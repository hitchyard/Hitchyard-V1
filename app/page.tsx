"use client"

import { useState } from "react"

const COMMODITIES = [
  "General Freight",
  "Building Materials",
  "Industrial Equipment",
  "Consumer Goods",
  "Other"
]

function RadialGauge({ score }: { score: number }) {
  const radius = 80
  const strokeWidth = 12
  const circumference = 2 * Math.PI * radius
  const startAngle = 135
  const endAngle = 405
  const totalAngle = endAngle - startAngle
  const scoreAngle = startAngle + (score / 100) * totalAngle
  
  // Calculate the arc path for the background (Steel Blue ring)
  const arcLength = (totalAngle / 360) * circumference
  const dashOffset = circumference - arcLength
  
  // Calculate the filled arc based on score
  const filledArcLength = (score / 100) * arcLength
  
  // Calculate needle position
  const needleAngle = (scoreAngle * Math.PI) / 180
  const needleLength = radius - 15
  const needleX = 100 + needleLength * Math.cos(needleAngle)
  const needleY = 100 + needleLength * Math.sin(needleAngle)
  
  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="160" viewBox="0 0 200 160">
        {/* Background arc (Steel Blue) */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#2A6FAF"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={dashOffset}
          transform="rotate(135 100 100)"
          opacity="0.3"
        />
        
        {/* Filled arc (Steel Blue) */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#2A6FAF"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${filledArcLength} ${circumference}`}
          strokeDashoffset={dashOffset}
          transform="rotate(135 100 100)"
        />
        
        {/* Center dot */}
        <circle cx="100" cy="100" r="6" fill="#F5F7FA" />
        
        {/* Needle (Muted Orange) */}
        <line
          x1="100"
          y1="100"
          x2={needleX}
          y2={needleY}
          stroke="#FF7F50"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Needle tip dot (Muted Orange) */}
        <circle cx={needleX} cy={needleY} r="4" fill="#FF7F50" />
      </svg>
      
      {/* Score display (Muted Orange) */}
      <p className="text-5xl font-bold text-accent mt-2">{score}</p>
    </div>
  )
}

function QuickShipmentCheck({
  onScoreCalculated,
}: {
  onScoreCalculated: (score: number) => void
}) {
  const [email, setEmail] = useState("")
  const [palletCount, setPalletCount] = useState(6)
  const [pickupZip, setPickupZip] = useState("")
  const [commodity, setCommodity] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isValidUtahZip = (zip: string): boolean => {
    const zipNum = parseInt(zip, 10)
    return zip.length === 5 && zipNum >= 84001 && zipNum <= 84784
  }

  const calculateScore = () => {
    setErrorMessage(null)

    if (!email || !pickupZip || !commodity) {
      setErrorMessage("Please fill in all fields.")
      return
    }

    if (!isValidUtahZip(pickupZip)) {
      setErrorMessage("Please enter a valid Utah ZIP code (84xxx).")
      return
    }

    // Score calculation based on pallet count and ZIP
    let baseScore = 70
    
    // Pallet count scoring (4-10 is ideal)
    if (palletCount >= 4 && palletCount <= 10) {
      baseScore += 20
    } else if (palletCount >= 2 && palletCount <= 3) {
      baseScore += 10
    } else if (palletCount === 1) {
      baseScore += 5
    } else if (palletCount > 10) {
      baseScore -= 10
    }
    
    // ZIP code scoring (Wasatch Front areas score higher)
    const zipNum = parseInt(pickupZip, 10)
    if (zipNum >= 84101 && zipNum <= 84199) {
      baseScore += 10 // Salt Lake City area
    } else if (zipNum >= 84601 && zipNum <= 84699) {
      baseScore += 8 // Provo/Utah County area
    } else if (zipNum >= 84401 && zipNum <= 84499) {
      baseScore += 8 // Ogden area
    }

    const finalScore = Math.min(100, Math.max(0, baseScore))
    onScoreCalculated(finalScore)
  }

  return (
    <div className="bg-card border border-border-subtle p-8 max-w-lg mx-auto">
      <div className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm text-muted-foreground mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border-subtle bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-steel-blue"
          />
        </div>

        {/* Pallet Count Range */}
        <div>
          <label htmlFor="pallet-count" className="block text-sm text-muted-foreground mb-2">
            Pallet Count: {palletCount}
          </label>
          <input
            id="pallet-count"
            name="pallet_count"
            type="range"
            min="1"
            max="12"
            value={palletCount}
            onChange={(e) => setPalletCount(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-steel-blue"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1</span>
            <span>12</span>
          </div>
        </div>

        {/* Pickup ZIP Code */}
        <div>
          <label htmlFor="pickup-zip" className="block text-sm text-muted-foreground mb-2">
            Pickup Zip Code
          </label>
          <input
            id="pickup-zip"
            name="pickup_zip"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={5}
            placeholder="84xxx"
            value={pickupZip}
            onChange={(e) => setPickupZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
            className="w-full border border-border-subtle bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-steel-blue"
          />
        </div>

        {/* Commodity Select */}
        <div>
          <label htmlFor="commodity" className="block text-sm text-muted-foreground mb-2">
            Commodity
          </label>
          <select
            id="commodity"
            name="commodity"
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="w-full border border-border-subtle bg-background px-4 py-3 text-foreground focus:outline-none focus:border-steel-blue"
          >
            <option value="">Select commodity type</option>
            {COMMODITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className="text-sm text-red-400">{errorMessage}</p>
        )}

        {/* Submit Button */}
        <button
          type="button"
          onClick={calculateScore}
          className="w-full bg-steel-blue text-primary-foreground py-3 font-medium hover:bg-steel-blue/90 transition-colors uppercase tracking-wide"
        >
          Can You Move This?
        </button>
      </div>
    </div>
  )
}

function CoverageConfidence({ score }: { score: number }) {
  return (
    <section className="py-16 text-center">
      <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wide">
        Coverage Confidence
      </p>
      <RadialGauge score={score} />
      <p className="text-foreground mt-6 max-w-md mx-auto">
        {score >= 80
          ? "Strong match. This shipment fits our coverage area and capacity well."
          : score >= 60
          ? "Good potential. Some factors may require review before confirmation."
          : "Limited match. This shipment may fall outside our typical coverage."}
      </p>
    </section>
  )
}

function HitchyardStandard() {
  return (
    <section className="py-16 border-t border-border-subtle">
      <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-10 uppercase tracking-wide text-center">
        The Hitchyard Standard
      </h2>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-3xl mx-auto">
        <div>
          <h3 className="text-sm text-muted-foreground mb-4 uppercase tracking-wide">
            What We Handle
          </h3>
          <ul className="space-y-3 text-foreground">
            <li>Dry, palletized shipments</li>
            <li>Awkward dimensions</li>
            <li>Partial loads</li>
            <li>Cargo van and sprinter shipments</li>
            <li>Box truck loads</li>
            <li>Utah regional lanes</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm text-muted-foreground mb-4 uppercase tracking-wide">
            What We Do Not Handle
          </h3>
          <ul className="space-y-3 text-foreground">
            <li>Refrigerated freight</li>
            <li>Hazmat shipments</li>
            <li>Full truckload (FTL) only</li>
            <li>Out-of-state destinations</li>
            <li>Time-critical same-hour delivery</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function GeoFAQ() {
  const faqs = [
    {
      question: "What kind of shipments does Hitchyard handle in Utah?",
      answer: "Hitchyard focuses on dry, palletized shipments that don't fit standard LTL easily, including awkward dimensions, partial loads, and small cargo van or sprinter shipments."
    },
    {
      question: "What areas of Utah do you cover?",
      answer: "We primarily cover the Wasatch Front, Northern Utah, and common in-state commercial lanes, depending on shipment size, timing, and delivery details."
    },
    {
      question: "Do you handle same-day or next-day shipments?",
      answer: "Coverage depends on timing, location, and shipment details. Availability is confirmed case by case."
    },
    {
      question: "Do you move refrigerated or hazmat freight?",
      answer: "No. Hitchyard does not handle refrigerated or hazmat shipments."
    },
    {
      question: "Is Hitchyard a carrier or a broker?",
      answer: "Hitchyard is a licensed freight broker and is not a motor carrier."
    },
    {
      question: "How is Hitchyard different from load boards?",
      answer: "Shipments are not posted publicly. Each shipment is reviewed and matched intentionally to avoid delays, price spikes, and last-minute cancellations."
    },
    {
      question: "How do I know if my shipment works?",
      answer: "Use the Quick Shipment Check above. If it's a good match, we'll confirm next steps. If not, we'll tell you upfront."
    }
  ]

  return (
    <section className="py-16 border-t border-border-subtle">
      <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-10 uppercase tracking-wide text-center">
        Utah Shipping FAQ
      </h2>
      <div className="space-y-8 max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index}>
            <p className="text-foreground font-medium mb-2">Q: {faq.question}</p>
            <p className="text-muted-foreground">A: {faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Page() {
  const [score, setScore] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-24">
        {/* Hero */}
        <header className="text-center mb-16">
          <h1 className="font-serif text-3xl md:text-5xl text-foreground mb-6 uppercase tracking-wide leading-tight">
            Utah Dry Shipments, Done Right.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Predictable coverage for palletized and awkward shipments across Utah.
          </p>
        </header>

        {/* Quick Shipment Check */}
        <section className="mb-16">
          <QuickShipmentCheck onScoreCalculated={setScore} />
        </section>

        {/* Coverage Confidence (hidden until score calculated) */}
        {score !== null && <CoverageConfidence score={score} />}

        {/* The Hitchyard Standard */}
        <HitchyardStandard />

        {/* Primary CTA */}
        <section className="py-16 text-center border-t border-border-subtle">
          <button
            type="button"
            className="bg-steel-blue text-primary-foreground px-8 py-4 font-medium hover:bg-steel-blue/90 transition-colors uppercase tracking-wide"
          >
            Request Load Review
          </button>
        </section>

        {/* Geo FAQ */}
        <GeoFAQ />

        {/* Footer */}
        <footer className="pt-16 border-t border-border-subtle text-center">
          <p className="text-sm text-muted-foreground">
            Hitchyard is a licensed freight broker and is not a motor carrier.
          </p>
        </footer>
      </div>
    </main>
  )
}
