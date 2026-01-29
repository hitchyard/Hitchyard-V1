"use client"

import { useState, useMemo } from "react"

function DiagnosticCard({
  onScoreCalculated,
}: {
  onScoreCalculated: (score: number) => void
}) {
  const [palletCount, setPalletCount] = useState<string>("")
  const [originZip, setOriginZip] = useState<string>("")
  const [carrierReliability, setCarrierReliability] = useState<number>(50)
  const [score, setScore] = useState<number | null>(null)

  const isValidUtahZip = (zip: string): boolean => {
    const zipNum = parseInt(zip, 10)
    return zip.length === 5 && zipNum >= 84001 && zipNum <= 84784
  }

  const calculateScore = () => {
    if (!palletCount || !originZip) return

    const pallets = parseInt(palletCount, 10)
    if (pallets < 1 || pallets > 10) return
    if (!isValidUtahZip(originZip)) return

    // Score calculation logic
    let calculatedScore = 0

    // Pallet count scoring (optimal range 4-10)
    if (pallets >= 4 && pallets <= 10) {
      calculatedScore += 40
    } else if (pallets >= 1 && pallets <= 3) {
      calculatedScore += 20
    }

    // Carrier reliability contributes directly
    calculatedScore += carrierReliability * 0.4

    // Utah ZIP bonus (core Utah areas)
    const zipNum = parseInt(originZip, 10)
    if (zipNum >= 84101 && zipNum <= 84199) {
      calculatedScore += 20 // Salt Lake City area
    } else if (zipNum >= 84601 && zipNum <= 84699) {
      calculatedScore += 18 // Provo/Utah County area
    } else {
      calculatedScore += 15 // Other Utah areas
    }

    const finalScore = Math.min(100, Math.round(calculatedScore))
    setScore(finalScore)
    onScoreCalculated(finalScore)
  }

  const interpretation = useMemo(() => {
    if (score === null) return null
    if (score >= 80) return "Operationally efficient"
    if (score >= 50) return "Moderate inefficiencies detected"
    return "Freight misalignment likely"
  }, [score])

  return (
    <div className="border border-steel-blue/30 p-8">
      <div className="space-y-6">
        {/* Pallet Count */}
        <div>
          <label
            htmlFor="pallet-count"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Pallet Count
          </label>
          <input
            id="pallet-count"
            type="number"
            min="1"
            max="10"
            placeholder="1–10 pallets"
            value={palletCount}
            onChange={(e) => setPalletCount(e.target.value)}
            className="w-full border border-steel-blue/30 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-steel-blue bg-background"
          />
        </div>

        {/* Origin ZIP Code */}
        <div>
          <label
            htmlFor="origin-zip"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Origin ZIP Code
          </label>
          <input
            id="origin-zip"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={5}
            placeholder="Utah ZIP only (84xxx)"
            value={originZip}
            onChange={(e) =>
              setOriginZip(e.target.value.replace(/\D/g, "").slice(0, 5))
            }
            className="w-full border border-steel-blue/30 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-steel-blue bg-background"
          />
        </div>

        {/* Carrier Reliability Slider */}
        <div>
          <label
            htmlFor="carrier-reliability"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Carrier Reliability
            <span className="ml-2 text-muted-foreground font-normal">
              {carrierReliability}%
            </span>
          </label>
          <input
            id="carrier-reliability"
            type="range"
            min="0"
            max="100"
            value={carrierReliability}
            onChange={(e) => setCarrierReliability(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-secondary appearance-none cursor-pointer accent-steel-blue"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span>100</span>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          type="button"
          onClick={calculateScore}
          className="w-full border border-steel-blue text-steel-blue py-3 font-medium hover:bg-steel-blue hover:text-white transition-colors"
        >
          Calculate Score
        </button>

        {/* Score Output */}
        {score !== null && (
          <div className="pt-6 border-t border-steel-blue/30">
            <p className="text-sm text-muted-foreground mb-2">
              Hitchyard Performance Score
            </p>
            <p className="text-5xl font-light text-foreground tracking-tight">
              {score}
            </p>
            <p className="text-sm text-muted-foreground mt-3">{interpretation}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function TradeOffSection() {
  return (
    <div className="border-t border-steel-blue/30 pt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        {/* Focused On */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4 tracking-wide uppercase">
            Focused On
          </h3>
          <ul className="space-y-3 text-muted-foreground">
            <li>Utah routes</li>
            <li>Dry LTL (4–10 pallets)</li>
            <li>Box trucks & sprinters</li>
            <li>Predictable short-haul freight</li>
          </ul>
        </div>

        {/* Intentionally Excluded */}
        <div className="border-t border-steel-blue/30 pt-8 md:border-t-0 md:pt-0 md:border-l md:pl-16">
          <h3 className="text-sm font-medium text-foreground mb-4 tracking-wide uppercase">
            Intentionally Excluded
          </h3>
          <ul className="space-y-3 text-muted-foreground">
            <li>Reefers</li>
            <li>Hazmat</li>
            <li>National spot freight</li>
            <li>{"53' trailer volatility"}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function CTASection({ visible }: { visible: boolean }) {
  if (!visible) return null

  const handleSubmit = () => {
    // Placeholder submit handler
    console.log("Freight Fit Check requested")
  }

  return (
    <div className="text-center pt-12">
      <button
        type="button"
        onClick={handleSubmit}
        className="bg-steel-blue text-white px-8 py-4 font-medium tracking-wide hover:bg-steel-blue/90 transition-colors"
      >
        FREE FREIGHT FIT CHECK
      </button>
      <p className="text-xs text-muted-foreground mt-3">Utah shippers only.</p>
    </div>
  )
}

export default function Page() {
  const [showCTA, setShowCTA] = useState(false)

  const handleScoreCalculated = (score: number) => {
    setShowCTA(true)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[900px] mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <header className="mb-16">
          <p className="text-sm tracking-widest text-muted-foreground uppercase">
            HITCHYARD — UTAH DRY FREIGHT, DONE RIGHT
          </p>
        </header>

        {/* Title Section */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-foreground tracking-tight mb-3">
            Freight Fit Check
          </h1>
          <p className="text-muted-foreground">
            Evaluate whether your Utah dry freight shipment is operationally
            efficient.
          </p>
        </section>

        {/* Diagnostic Card */}
        <section className="mb-16">
          <DiagnosticCard onScoreCalculated={handleScoreCalculated} />
        </section>

        {/* Trade-Off Section */}
        <section className="mb-8">
          <TradeOffSection />
        </section>

        {/* CTA */}
        <CTASection visible={showCTA} />
      </div>
    </main>
  )
}
