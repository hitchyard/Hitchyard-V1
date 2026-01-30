"use client"

import { useState, useEffect } from "react"

const COMMODITIES = [
  "General Freight",
  "Building Materials",
  "Industrial Equipment",
  "Consumer Goods",
  "Electronics",
  "Furniture",
  "Other"
]

// Animated radial gauge with score breakdown
function HPSGauge({ score, animated }: { score: number; animated: boolean }) {
  const [displayScore, setDisplayScore] = useState(0)
  const radius = 90
  const strokeWidth = 14
  const circumference = 2 * Math.PI * radius
  const startAngle = 135
  const endAngle = 405
  const totalAngle = endAngle - startAngle
  
  useEffect(() => {
    if (animated) {
      const duration = 1500
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayScore(Math.round(score * eased))
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    } else {
      setDisplayScore(score)
    }
  }, [score, animated])

  const scoreAngle = startAngle + (displayScore / 100) * totalAngle
  const arcLength = (totalAngle / 360) * circumference
  const dashOffset = circumference - arcLength
  const filledArcLength = (displayScore / 100) * arcLength
  
  const needleAngle = (scoreAngle * Math.PI) / 180
  const needleLength = radius - 20
  const needleX = 110 + needleLength * Math.cos(needleAngle)
  const needleY = 110 + needleLength * Math.sin(needleAngle)
  
  return (
    <div className="flex flex-col items-center">
      <svg width="220" height="180" viewBox="0 0 220 180">
        {/* Background arc */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="#2A6FAF"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={dashOffset}
          transform="rotate(135 110 110)"
          opacity="0.2"
        />
        
        {/* Filled arc */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="#2A6FAF"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${filledArcLength} ${circumference}`}
          strokeDashoffset={dashOffset}
          transform="rotate(135 110 110)"
          className="transition-all duration-100"
        />
        
        {/* Center dot */}
        <circle cx="110" cy="110" r="8" fill="#F5F5F5" />
        
        {/* Needle */}
        <line
          x1="110"
          y1="110"
          x2={needleX}
          y2={needleY}
          stroke="#FF7F50"
          strokeWidth="4"
          strokeLinecap="round"
          className="transition-all duration-100"
        />
        
        {/* Needle tip */}
        <circle cx={needleX} cy={needleY} r="5" fill="#FF7F50" className="transition-all duration-100" />
      </svg>
      
      {/* Score display */}
      <p className="text-6xl font-bold text-accent -mt-2">{displayScore}</p>
      <p className="text-sm text-muted-foreground mt-1 uppercase tracking-wider">Hitchyard Performance Score</p>
    </div>
  )
}

// Score breakdown bars
function ScoreBreakdown({ score }: { score: number }) {
  const breakdown = {
    reliability: Math.round(score * 0.4),
    efficiency: Math.round(score * 0.3),
    relationship: Math.round(score * 0.2),
    matchSuccess: Math.round(score * 0.1),
  }

  const bars = [
    { label: "Reliability", value: breakdown.reliability, max: 40, color: "#2A6FAF" },
    { label: "Efficiency", value: breakdown.efficiency, max: 30, color: "#2A6FAF" },
    { label: "Relationship", value: breakdown.relationship, max: 20, color: "#2A6FAF" },
    { label: "Match Success", value: breakdown.matchSuccess, max: 10, color: "#2A6FAF" },
  ]

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {bars.map((bar) => (
        <div key={bar.label}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-foreground">{bar.label}</span>
            <span className="text-muted-foreground">{bar.value}/{bar.max}</span>
          </div>
          <div className="h-2 bg-border-subtle rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${(bar.value / bar.max) * 100}%`,
                backgroundColor: bar.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Freight Fit Check form
function FreightFitCheck({
  onScoreCalculated,
}: {
  onScoreCalculated: (score: number) => void
}) {
  const [email, setEmail] = useState("")
  const [palletCount, setPalletCount] = useState(4)
  const [originZip, setOriginZip] = useState("")
  const [destinationZip, setDestinationZip] = useState("")
  const [commodity, setCommodity] = useState("")
  const [weight, setWeight] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const isValidUtahZip = (zip: string): boolean => {
    const zipNum = parseInt(zip, 10)
    return zip.length === 5 && zipNum >= 84001 && zipNum <= 84784
  }

  const calculateScore = () => {
    setErrorMessage(null)

    if (!email || !originZip || !destinationZip || !commodity) {
      setErrorMessage("Please fill in all required fields.")
      return
    }

    if (!isValidUtahZip(originZip)) {
      setErrorMessage("Please enter a valid Utah origin ZIP code (84xxx).")
      return
    }

    if (!isValidUtahZip(destinationZip)) {
      setErrorMessage("Please enter a valid Utah destination ZIP code (84xxx).")
      return
    }

    setIsCalculating(true)

    // Simulate calculation delay for animation effect
    setTimeout(() => {
      let baseScore = 65
      
      // Pallet count scoring (2-10 is ideal)
      if (palletCount >= 2 && palletCount <= 10) {
        baseScore += 20
      } else if (palletCount === 1) {
        baseScore += 10
      } else if (palletCount > 10) {
        baseScore += 5
      }
      
      // ZIP code scoring (Wasatch Front areas score higher)
      const originNum = parseInt(originZip, 10)
      const destNum = parseInt(destinationZip, 10)
      
      // Origin scoring
      if (originNum >= 84101 && originNum <= 84199) {
        baseScore += 8
      } else if (originNum >= 84601 && originNum <= 84699) {
        baseScore += 6
      } else if (originNum >= 84401 && originNum <= 84499) {
        baseScore += 6
      }
      
      // Destination scoring
      if (destNum >= 84101 && destNum <= 84199) {
        baseScore += 7
      } else if (destNum >= 84601 && destNum <= 84699) {
        baseScore += 5
      } else if (destNum >= 84401 && destNum <= 84499) {
        baseScore += 5
      } else if (destNum >= 84770 && destNum <= 84784) {
        baseScore += 4 // St. George area
      }

      const finalScore = Math.min(100, Math.max(0, baseScore))
      onScoreCalculated(finalScore)
      setIsCalculating(false)
    }, 800)
  }

  return (
    <div className="bg-card border border-border-subtle p-8 md:p-10 max-w-xl mx-auto">
      <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2 uppercase tracking-wide text-center">
        Freight Fit Check
      </h2>
      <p className="text-muted-foreground text-center mb-8">
        See how your shipment matches our network
      </p>
      
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
            className="w-full border border-border-subtle bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-steel-blue transition-colors"
          />
        </div>

        {/* Pallet Count Slider */}
        <div>
          <label htmlFor="pallet-count" className="block text-sm text-muted-foreground mb-2">
            Pallet Count: <span className="text-foreground font-medium">{palletCount}</span>
          </label>
          <input
            id="pallet-count"
            name="pallet_count"
            type="range"
            min="1"
            max="12"
            value={palletCount}
            onChange={(e) => setPalletCount(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-border-subtle rounded-full appearance-none cursor-pointer accent-steel-blue"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1</span>
            <span>12</span>
          </div>
        </div>

        {/* ZIP Codes Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="origin-zip" className="block text-sm text-muted-foreground mb-2">
              Origin Zip Code
            </label>
            <input
              id="origin-zip"
              name="origin_zip"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              placeholder="84xxx"
              value={originZip}
              onChange={(e) => setOriginZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              className="w-full border border-border-subtle bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-steel-blue transition-colors"
            />
          </div>
          <div>
            <label htmlFor="destination-zip" className="block text-sm text-muted-foreground mb-2">
              Destination Zip Code
            </label>
            <input
              id="destination-zip"
              name="destination_zip"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              placeholder="84xxx"
              value={destinationZip}
              onChange={(e) => setDestinationZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              className="w-full border border-border-subtle bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-steel-blue transition-colors"
            />
          </div>
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
            className="w-full border border-border-subtle bg-background px-4 py-3 text-foreground focus:outline-none focus:border-steel-blue transition-colors"
          >
            <option value="">Select commodity type</option>
            {COMMODITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Weight (optional) */}
        <div>
          <label htmlFor="weight" className="block text-sm text-muted-foreground mb-2">
            Weight (lbs) <span className="text-muted-foreground/60">Optional</span>
          </label>
          <input
            id="weight"
            name="weight"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 2500"
            value={weight}
            onChange={(e) => setWeight(e.target.value.replace(/\D/g, ""))}
            className="w-full border border-border-subtle bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-steel-blue transition-colors"
          />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className="text-sm text-accent">{errorMessage}</p>
        )}

        {/* Submit Button */}
        <button
          type="button"
          onClick={calculateScore}
          disabled={isCalculating}
          className="w-full bg-steel-blue text-primary-foreground py-4 font-medium hover:bg-accent hover:text-accent-foreground transition-colors uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCalculating ? "Calculating..." : "Calculate Score"}
        </button>
      </div>
    </div>
  )
}

// HPS Results Section
function HPSResults({ score }: { score: number }) {
  return (
    <section className="py-20 text-center">
      <HPSGauge score={score} animated={true} />
      
      <div className="mt-12">
        <ScoreBreakdown score={score} />
      </div>
      
      <p className="text-muted-foreground mt-10 max-w-lg mx-auto leading-relaxed">
        This score shows how well your shipment fits our vetted drivers and network, 
        building confidence in our performance-based system.
      </p>
    </section>
  )
}

// Trade-Off Grid with icons
function HitchyardStandard() {
  const weDo = [
    { icon: "📦", label: "Dry LTL" },
    { icon: "🗺️", label: "Utah Coverage" },
    { icon: "🚐", label: "Box Trucks & Sprinters" },
    { icon: "📊", label: "Performance Scoring" },
  ]

  const weDoNot = [
    { icon: "❄️", label: "Reefers" },
    { icon: "☢️", label: "Hazmat" },
    { icon: "🚛", label: "53-foot Spot Chaos" },
    { icon: "🚨", label: "Emergency Hero Loads" },
  ]

  return (
    <section className="py-20 border-t border-border-subtle">
      <h2 className="font-serif text-2xl md:text-4xl text-foreground mb-4 uppercase tracking-wide text-center">
        The Hitchyard Standard
      </h2>
      <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
        We focus on what we do best so you get predictable, reliable service every time.
      </p>
      
      <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        {/* We Do */}
        <div className="bg-card border border-border-subtle p-8">
          <h3 className="text-sm text-steel-blue mb-6 uppercase tracking-wider font-medium">
            We Do
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {weDo.map((item) => (
              <div
                key={item.label}
                className="group flex flex-col items-center text-center p-4 hover:bg-steel-blue/10 transition-colors cursor-default"
              >
                <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="text-foreground text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* We Do Not */}
        <div className="bg-card border border-border-subtle p-8">
          <h3 className="text-sm text-muted-foreground mb-6 uppercase tracking-wider font-medium">
            We Do Not
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {weDoNot.map((item) => (
              <div
                key={item.label}
                className="group flex flex-col items-center text-center p-4 opacity-60 hover:opacity-100 transition-opacity cursor-default"
              >
                <span className="text-3xl mb-3 grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                <span className="text-muted-foreground text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// How It Works Process Section
function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Submit Details",
      description: "Enter your shipment information in the Freight Fit Check form above.",
    },
    {
      number: "02",
      title: "Generate Score",
      description: "Receive your Hitchyard Performance Score based on reliability, efficiency, and match success.",
    },
    {
      number: "03",
      title: "Advisor Review",
      description: "A Hitchyard Logistics Advisor reviews your score and shipment details for optimal matching.",
    },
    {
      number: "04",
      title: "Confirm Match",
      description: "Get matched with a vetted driver who fits your shipment profile perfectly.",
    },
  ]

  return (
    <section className="py-20 border-t border-border-subtle">
      <h2 className="font-serif text-2xl md:text-4xl text-foreground mb-4 uppercase tracking-wide text-center">
        How Hitchyard Protects Your Freight
      </h2>
      <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
        A systematic approach to matching your shipment with the right driver.
      </p>
      
      <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="relative group"
          >
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-full w-full h-px bg-border-subtle -translate-x-4" />
            )}
            
            <div className="bg-card border border-border-subtle p-6 h-full hover:border-steel-blue transition-colors">
              <span className="text-4xl font-bold text-steel-blue/30 group-hover:text-steel-blue transition-colors">
                {step.number}
              </span>
              <h3 className="text-foreground font-medium mt-4 mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// FAQ Accordion
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "Will my 3 to 8 pallet shipment fit in a box truck or sprinter?",
      answer: "Our system evaluates each shipment with the Hitchyard Performance Score to ensure the right truck and driver for safe and predictable delivery."
    },
    {
      question: "I have had unreliable carriers before. How can I be sure Hitchyard is different?",
      answer: "All drivers in our network are vetted and scored for reliability, efficiency, and on-time performance. We only dispatch trusted carriers."
    },
    {
      question: "Can you cover shipments anywhere in Utah, not just Salt Lake?",
      answer: "Yes, our local network reaches Ogden, Provo, St. George, and every commercial hub in the state."
    },
    {
      question: "How long will it take to get a Freight Fit Check?",
      answer: "Once you submit your shipment details, a Hitchyard Logistics Advisor reviews your shipment within 24 to 48 hours."
    },
    {
      question: "What if my freight is fragile or oddly shaped?",
      answer: "The Hitchyard Performance Score evaluates weight, pallet size, and commodity type to match your shipment to the right truck and driver."
    },
    {
      question: "Do you handle hazardous or refrigerated freight?",
      answer: "No, we specialize in dry LTL shipments, which allows us to guarantee faster, safer, and more predictable service."
    },
    {
      question: "Why should I trust Hitchyard instead of a big national broker?",
      answer: "We focus exclusively on the Utah market with vetted drivers and performance data. You get transparency, predictability, and local expertise."
    }
  ]

  return (
    <section className="py-20 border-t border-border-subtle">
      <h2 className="font-serif text-2xl md:text-4xl text-foreground mb-12 uppercase tracking-wide text-center">
        Frequently Asked Questions
      </h2>
      
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-border-subtle bg-card overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-steel-blue/5 transition-colors"
            >
              <span className="text-foreground font-medium pr-4">{faq.question}</span>
              <span className="text-steel-blue text-2xl flex-shrink-0">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Animated background for hero
function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #2A6FAF 1px, transparent 1px),
              linear-gradient(to bottom, #2A6FAF 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-steel-blue/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-steel-blue/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
    </div>
  )
}

export default function Page() {
  const [score, setScore] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center py-24">
        <HeroBackground />
        
        <div className="relative z-10 text-center px-6">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 uppercase tracking-wide leading-tight">
            Your Shipment. Our Guarantee.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            2 to 10 pallet shipments anywhere in Utah using vetted box trucks and sprinters. 
            Predictable delivery. No reefers. No hazmat. No surprises.
          </p>
          <a
            href="#freight-fit-check"
            className="inline-block bg-steel-blue text-primary-foreground px-8 py-4 font-medium hover:bg-accent hover:text-accent-foreground transition-colors uppercase tracking-wide"
          >
            Check Your Freight Fit
          </a>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6">
        {/* Freight Fit Check Card */}
        <section id="freight-fit-check" className="py-20">
          <FreightFitCheck onScoreCalculated={setScore} />
        </section>

        {/* HPS Results (hidden until calculated) */}
        {score !== null && <HPSResults score={score} />}

        {/* The Hitchyard Standard */}
        <HitchyardStandard />

        {/* How It Works */}
        <HowItWorks />

        {/* FAQ */}
        <FAQ />

        {/* CTA Section */}
        <section className="py-20 text-center border-t border-border-subtle">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4 uppercase tracking-wide">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Your shipment is scored and matched with the right driver for predictable delivery.
          </p>
          <a
            href="#freight-fit-check"
            className="inline-block bg-steel-blue text-primary-foreground px-10 py-4 font-medium hover:bg-accent hover:text-accent-foreground transition-colors uppercase tracking-wide"
          >
            Check Your Freight Fit
          </a>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t border-border-subtle py-12">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Hitchyard is a licensed freight broker and is not a motor carrier.
          </p>
        </div>
      </footer>
    </main>
  )
}
