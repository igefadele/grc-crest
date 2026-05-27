/**
 * @file LiveSidebar.tsx
 * @description Real-time automation event stream sidebar.
 *
 * Cycles through LIVE_EVENTS on a 2.4s interval to simulate
 * a live event feed. Shows KPI counters and the human escalation
 * queue at the bottom.
 */

'use client'

import { useState, useEffect } from 'react'
import { LAYERS } from '@/lib/constants'
import { connectRealtime, fetchEvents } from '@/lib/crestBackendClient'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { GlowButton } from '@/components/ui/GlowButton'
import type { LiveEvent, SeverityKey } from '@/types/grc'

const SEV_META: Record<SeverityKey, { color: string; label: string }> = {
  blocked:   { color: 'var(--color-red)',    label: 'BLOCKED'     },
  healed:    { color: 'var(--color-green)',  label: 'AUTO-HEALED' },
  flagged:   { color: 'var(--color-amber)',  label: 'AI FLAGGED'  },
  escalated: { color: 'var(--color-red)',    label: 'ESCALATED'   },
  collected: { color: 'var(--color-purple)', label: 'COLLECTED'   },
}

const KPI_STATS = [
  { label: 'AUTO-RESOLVED', value: '1,204', color: 'var(--color-green)'  },
  { label: 'ESCALATED',     value: '1',     color: 'var(--color-red)'    },
  { label: 'AI PROCESSED',  value: '214',   color: 'var(--color-amber)'  },
  { label: 'EVIDENCE',      value: '3,890', color: 'var(--color-purple)' },
]

export function LiveSidebar() {
  const [visibleEvents, setVisibleEvents] = useState<LiveEvent[]>([])

  useEffect(() => {
    void fetchEvents(7).then((events) => {
      setVisibleEvents(events.slice(0, 7))
    })

    const socket = connectRealtime()
    socket.on('event.created', (event: LiveEvent) => {
      setVisibleEvents((prev) => [event, ...prev].slice(0, 7))
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <aside
      className="flex flex-col min-h-0 border-l"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3.5 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <span className="text-[10px] tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
          LIVE STREAM
        </span>
        <div className="flex items-center gap-1.5">
          <span className="animate-pulse-slow text-[7px]" style={{ color: 'var(--color-green)' }}>●</span>
          <span className="text-[9px]" style={{ color: 'var(--color-green)' }}>STREAMING</span>
        </div>
      </div>

      {/* KPI counters grid */}
      <div className="grid grid-cols-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
        {KPI_STATS.map((stat) => (
          <div
            key={stat.label}
            className="p-3 border-r border-b"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="text-[8px] tracking-wide mb-1" style={{ color: 'var(--color-text-dim)' }}>
              {stat.label}
            </div>
            <div className="text-lg font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Event feed */}
      <div className="flex-1 overflow-y-auto">
        {visibleEvents.map((evt, i) => {
          const sev  = SEV_META[evt.severity]
          const layer = LAYERS.find((l) => l.id === evt.layer)

          return (
            <div
              key={i}
              className="animate-fade-down px-3.5 py-2.5 border-b border-l-2"
              style={{
                borderColor: 'var(--color-border)',
                borderLeftColor: evt.auto ? sev.color : 'var(--color-red)',
                background: i === 0 ? 'var(--color-surface-alt)' : 'transparent',
              }}
            >
              <div className="flex justify-between mb-1">
                <span className="text-[8px] tracking-widest font-bold" style={{ color: sev.color }}>
                  {sev.label}
                </span>
                <span className="text-[8px]" style={{ color: 'var(--color-text-dim)' }}>
                  {evt.time}
                </span>
              </div>
              <div className="text-[9px] leading-snug mb-1" style={{ color: 'var(--color-text)' }}>
                {evt.msg}
              </div>
              {layer && (
                <div className="text-[8px]" style={{ color: layer.color, opacity: 0.7 }}>
                  {layer.shortLabel}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Human escalation queue */}
      <div
        className="border-t p-3.5"
        style={{ borderColor: 'var(--color-red)', background: 'var(--color-red-glow)' }}
      >
        <div
          className="text-[9px] tracking-widest mb-1.5 font-bold"
          style={{ color: 'var(--color-red)' }}
        >
          ⚠ HUMAN QUEUE — 1 PENDING
        </div>
        <p className="text-[9px] leading-snug mb-1.5" style={{ color: 'var(--color-text)' }}>
          Risk Variance: Legacy module encryption conflict — crash on forced encryption mid-transaction.
        </p>
        <p className="text-[8px] mb-3" style={{ color: 'var(--color-text-muted)' }}>
          AI brief ready · Awaiting GRC sign-off
        </p>
        <div className="flex gap-2">
          <GlowButton color="var(--color-red)"   className="flex-1 py-1.5! text-[8px]!">REVIEW</GlowButton>
          <GlowButton color="var(--color-green)" className="flex-1 py-1.5! text-[8px]!">APPROVE</GlowButton>
        </div>
      </div>
    </aside>
  )
}
