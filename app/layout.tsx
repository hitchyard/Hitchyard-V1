import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Cinzel, League_Spartan } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const leagueSpartan = League_Spartan({ subsets: ["latin"], variable: "--font-league-spartan" });

export const metadata: Metadata = {
  title: 'Hitchyard | Utah Dry Shipment Coverage',
  description: 'Utah-based dry shipment coverage using cargo vans, sprinters, and box trucks for palletized and awkward freight across regional lanes.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${leagueSpartan.variable} ${cinzel.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
