/**
 * @file page.tsx
 * @description GRC Crest - Command Center — main application page.
 *
 * Architecture:
 * - Next.js App Router page component (server component by default)
 * - Tab state is managed in the GRCDashboard client component below
 * - Each tab renders its own isolated component from /components/tabs/
 * - LiveSidebar runs independently with its own event loop
 *
 * Layout:
 *   ┌─────────────────────────────────────────────┬──────────┐
 *   │  HEADER (sticky)                            │          │
 *   ├─────────────────────────────────────────────┤ SIDEBAR  │
 *   │  TAB BAR                                    │  LIVE    │
 *   ├─────────────────────────────────────────────┤  STREAM  │
 *   │  TAB CONTENT (scrollable)                   │          │
 *   └─────────────────────────────────────────────┴──────────┘
 */

import { GRCDashboard } from '@/components/GRCDashboard'

/**
 * Root page — renders the GRC Dashboard.
 * This is a server component; the client boundary is inside GRCDashboard.
 */
export default function HomePage() {
  return <GRCDashboard />
}
