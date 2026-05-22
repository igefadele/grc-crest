/**
 * @file layout.tsx
 * @description Next.js App Router root layout.
 * Applies global styles and sets HTML metadata for the application.
 */

import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'GRC Command Center — Continuous Compliance by Design',
  description:
    'GRC-as-Code automation platform. Policy-as-Code, continuous controls monitoring, AI vendor risk assessment, and automated evidence collection. Built for elite GRC engineering teams.',
  keywords: [
    'GRC', 'Governance Risk Compliance', 'Policy as Code', 'OPA', 'Rego',
    'Continuous Compliance', 'DevSecOps', 'SOC 2', 'ISO 27001', 'NIST 800-53',
    'AI GRC', 'Automated Compliance', 'GRC-as-Code',
  ],
  authors: [{ name: 'GRC Architect' }],
  robots: 'noindex, nofollow', // Internal tool — not for public search indexing
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0D14',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
