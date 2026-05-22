/**
 * @file GRCDashboard.tsx
 * @description Root client component for the GRC Command Center.
 *
 * Owns the active tab state and renders the correct tab component.
 * This is the only client boundary at the top level — child tab
 * components are also client components because they manage local state.
 *
 * Component tree:
 *   GRCDashboard (client)
 *     ├─ Header (static)
 *     ├─ TabBar (drives tab state)
 *     ├─ [ActiveTabComponent] (one of seven tabs)
 *     └─ LiveSidebar (independent event loop)
 */

'use client'

import { useState } from 'react'
import { TABS, PROVIDER_META } from '@/lib/constants'
import { LiveSidebar } from '@/components/LiveSidebar'
import { OverviewTab }       from '@/components/tabs/OverviewTab'
import { PipelineTab }       from '@/components/tabs/PipelineTab'
import { CodeReferenceTab }  from '@/components/tabs/CodeReferenceTab'
import { VendorRiskTab }     from '@/components/tabs/VendorRiskTab'
import { OPAGeneratorTab }   from '@/components/tabs/OPAGeneratorTab'
import { EvidenceTrackerTab} from '@/components/tabs/EvidenceTrackerTab'
import { IncidentPlaybookTab}from '@/components/tabs/IncidentPlaybookTab'
import type { TabId } from '@/types/grc'

// ── Header KPI stats ──────────────────────────────────────────────────────────

const HEADER_STATS = [
  { label: 'AUTOMATION', value: '98.3%',     color: 'var(--color-green)' },
  { label: 'PIPELINE',   value: 'ALL CLEAR', color: 'var(--color-green)' },
  { label: 'QUEUE',      value: '1 PENDING', color: 'var(--color-amber)' },
]

// ── Active AI provider (read from public env var) ─────────────────────────────
// NEXT_PUBLIC_ prefix makes the variable available in the browser bundle.
// The actual API key is only in process.env on the server — never here.
const activeProvider = (process.env.NEXT_PUBLIC_AI_PROVIDER ?? 'claude') as keyof typeof PROVIDER_META
const providerMeta   = PROVIDER_META[activeProvider] ?? PROVIDER_META.claude

// ── Tab component map ─────────────────────────────────────────────────────────

const TAB_COMPONENTS: Record<TabId, React.ComponentType> = {
  'overview':  OverviewTab,
  'pipeline':  PipelineTab,
  'code':      CodeReferenceTab,
  'vendor':    VendorRiskTab,
  'opa-gen':   OPAGeneratorTab,
  'evidence':  EvidenceTrackerTab,
  'incident':  IncidentPlaybookTab,
}

// ─────────────────────────────────────────────────────────────────────────────

export function GRCDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const ActiveTabComponent = TAB_COMPONENTS[activeTab]

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}
    >

      {/* ── Sticky header ──────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-7 py-3.5 border-b shrink-0 z-50"
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          position: 'sticky',
          top: 0,
        }}
      >
        {/* Logo + title */}
        <div className="flex items-center gap-3.5">
          <div
            className="w-8 h-8 flex items-center justify-center text-sm font-bold border-2"
            style={{
              color: 'var(--color-accent)',
              borderColor: 'var(--color-accent)',
              boxShadow: '0 0 14px var(--color-accent-glow)',
            }}
          >
            ⬡
          </div>
          <div>
            <div className="text-[12px] font-bold tracking-widest" style={{ color: 'var(--color-text)' }}>
              GRC COMMAND CENTER
            </div>
            <div className="text-[9px] tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
              CONTINUOUS-BY-DESIGN // POLICY-AS-CODE // AI-AUTOMATED
              <span className="mx-1.5">·</span>
              <span style={{ color: providerMeta.color }}>AI: {providerMeta.label}</span>
            </div>
          </div>
        </div>

        {/* KPI stats + live indicator */}
        <div className="flex items-center gap-5">
          {HEADER_STATS.map((stat) => (
            <div key={stat.label} className="text-right">
              <div className="text-[8px] tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                {stat.label}
              </div>
              <div className="text-[12px] font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </div>
          ))}
          <div
            className="flex items-center gap-1.5 px-3 py-1 border text-[9px] tracking-widest"
            style={{ borderColor: 'var(--color-green)', color: 'var(--color-green)' }}
          >
            <span className="animate-pulse-slow text-[7px]">●</span>
            LIVE
          </div>
        </div>
      </header>

      {/* ── Main layout: content + sidebar ─────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: tab bar + content */}
        <main className="flex flex-col flex-1 overflow-hidden">

          {/* Tab navigation bar */}
          <nav
            className="flex shrink-0 border-b overflow-x-auto"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2.5 text-[10px] tracking-widest whitespace-nowrap border-b-2 cursor-pointer transition-colors duration-150 shrink-0"
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id
                    ? '2px solid var(--color-accent)'
                    : '2px solid transparent',
                  color: activeTab === tab.id
                    ? 'var(--color-accent)'
                    : 'var(--color-text-muted)',
                  marginBottom: -1,
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                }}
              >
                {tab.icon} {tab.label.toUpperCase()}
              </button>
            ))}
          </nav>

          {/* Tab content — scrollable */}
          <div className="flex-1 overflow-y-auto p-7">
            <ActiveTabComponent />
          </div>
        </main>

        {/* Right: live sidebar — fixed width */}
        <div className="w-72 shrink-0 overflow-hidden flex flex-col">
          <LiveSidebar />
        </div>
      </div>
    </div>
  )
}
