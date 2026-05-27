/**
 * @file EvidenceTrackerTab.tsx
 * @description Continuous Evidence Tracker tab.
 *
 * Tracks compliance evidence across SOC 2, ISO 27001, and NIST 800-53.
 * - PASS  = evidence collected and verified
 * - WARN  = approaching overdue or minor gap
 * - FAIL  = action required
 * - COLLECTING = AI agent actively pulling evidence
 *
 * For AUTO-owned controls in FAIL/WARN state, a COLLECT button
 * triggers a simulated autonomous evidence collection run.
 * Click any row to inspect full evidence detail in the side panel.
 */

'use client'

import { useEffect, useState } from 'react'
import { connectRealtime, fetchEvidence } from '@/lib/crestBackendClient'
import { GlowButton } from '@/components/ui/GlowButton'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { EvidenceRecord, ControlStatus } from '@/types/grc'

type Framework = 'ALL' | 'SOC 2' | 'ISO 27001' | 'NIST 800-53'

const FRAMEWORKS: Framework[] = ['ALL', 'SOC 2', 'ISO 27001', 'NIST 800-53']

/** Maps a ControlStatus to its display colour. */
function statusColor(s: ControlStatus | string): string {
  const map: Record<string, string> = {
    PASS:       'var(--color-green)',
    FAIL:       'var(--color-red)',
    WARN:       'var(--color-amber)',
    COLLECTING: 'var(--color-purple)',
  }
  return map[s] ?? 'var(--color-text-muted)'
}

export function EvidenceTrackerTab() {
  const [evidence,   setEvidence]   = useState<EvidenceRecord[]>([])
  const [filter,     setFilter]     = useState<Framework>('ALL')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [collecting, setCollecting] = useState<string | null>(null)

  useEffect(() => {
    void fetchEvidence().then((rows) => setEvidence(rows))

    const socket = connectRealtime()
    socket.on('evidence.updated', (record: EvidenceRecord) => {
      setEvidence((prev) => {
        const exists = prev.some((item) => item.id === record.id)
        if (exists) {
          return prev.map((item) => (item.id === record.id ? record : item))
        }
        return [record, ...prev]
      })
    })
    return () => {
      socket.disconnect()
    }
  }, [])

  const filtered = filter === 'ALL' ? evidence : evidence.filter((e) => e.framework === filter)
  const selected = evidence.find((e) => e.id === selectedId) ?? null

  // Status counts for KPI row
  const counts: Record<ControlStatus, number> = {
    PASS:       evidence.filter((e) => e.status === 'PASS').length,
    FAIL:       evidence.filter((e) => e.status === 'FAIL').length,
    WARN:       evidence.filter((e) => e.status === 'WARN').length,
    COLLECTING: evidence.filter((e) => e.status === 'COLLECTING').length,
  }

  /** Simulate a 3-second AI evidence collection run. */
  function triggerCollection(id: string) {
    setCollecting(id)
    setEvidence((prev) =>
      prev.map((e) => e.id === id ? { ...e, status: 'COLLECTING' as ControlStatus } : e),
    )
    setTimeout(() => {
      setEvidence((prev) =>
        prev.map((e) =>
          e.id === id
            ? {
                ...e,
                status: 'PASS' as ControlStatus,
                lastChecked: new Date().toISOString(),
                evidence: `AI agent: Evidence collected and verified — ${new Date().toLocaleTimeString()}`,
              }
            : e,
        ),
      )
      setCollecting(null)
    }, 3000)
  }

  return (
    <div className="grid gap-4 h-full" style={{ gridTemplateColumns: '1fr 340px' }}>

      {/* ── LEFT: Table + filters ───────────────────────────── */}
      <div className="flex flex-col gap-3">

        {/* KPI summary row */}
        <div className="grid grid-cols-4 gap-2">
          {(Object.entries(counts) as [ControlStatus, number][]).map(([status, count]) => (
            <div
              key={status}
              className="p-3 border"
              style={{
                background: 'var(--color-surface)',
                borderColor: `${statusColor(status)}30`,
              }}
            >
              <div className="text-[9px] tracking-widest mb-1" style={{ color: 'var(--color-text-dim)' }}>
                {status}
              </div>
              <div className="text-2xl font-bold" style={{ color: statusColor(status) }}>
                {count}
              </div>
            </div>
          ))}
        </div>

        {/* Framework filter tabs */}
        <div className="flex border-b" style={{ borderColor: 'var(--color-border)' }}>
          {FRAMEWORKS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 text-[10px] tracking-widest border-b-2 cursor-pointer transition-colors duration-150"
              style={{
                background: 'none',
                border: 'none',
                borderBottom: filter === f
                  ? '2px solid var(--color-accent)'
                  : '2px solid transparent',
                color: filter === f ? 'var(--color-accent)' : 'var(--color-text-muted)',
                marginBottom: -1,
                fontFamily: 'var(--font-mono)',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Table header */}
        <div
          className="grid text-[8px] tracking-widest px-3 py-1.5 border-b"
          style={{
            gridTemplateColumns: '60px 90px 1fr 100px 70px 72px',
            background: 'var(--color-surface-alt)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-dim)',
          }}
        >
          {['CTRL ID', 'FRAMEWORK', 'CONTROL', 'STATUS', 'OWNER', 'ACTION'].map((h) => (
            <div key={h}>{h}</div>
          ))}
        </div>

        {/* Table rows */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((ev) => {
            const isCollecting = collecting === ev.id
            const currentStatus: ControlStatus = isCollecting ? 'COLLECTING' : ev.status

            return (
              <button
                key={ev.id}
                onClick={() => setSelectedId(selectedId === ev.id ? null : ev.id)}
                className="w-full grid text-left px-3 py-2.5 border-b cursor-pointer transition-colors duration-150"
                style={{
                  gridTemplateColumns: '60px 90px 1fr 100px 70px 72px',
                  alignItems: 'center',
                  borderColor: 'var(--color-border)',
                  background: selectedId === ev.id ? 'var(--color-surface-alt)' : 'transparent',
                }}
              >
                <div className="text-[10px] font-bold" style={{ color: 'var(--color-accent)' }}>
                  {ev.id}
                </div>
                <div className="text-[9px]" style={{ color: 'var(--color-text-muted)' }}>
                  {ev.framework}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--color-text)' }}>
                  {ev.control}
                </div>
                <div>
                  <StatusBadge
                    value={isCollecting ? 'RUNNING...' : ev.status}
                    color={statusColor(currentStatus)}
                  />
                </div>
                <div
                  className="text-[9px] font-semibold"
                  style={{ color: ev.owner === 'AUTO' ? 'var(--color-green)' : 'var(--color-amber)' }}
                >
                  {ev.owner}
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  {(ev.status === 'FAIL' || ev.status === 'WARN') && ev.owner === 'AUTO' && (
                    <GlowButton
                      color="var(--color-purple)"
                      onClick={() => triggerCollection(ev.id)}
                      disabled={isCollecting}
                      className="px-2! py-0.5! text-[8px]!"
                    >
                      {isCollecting ? '...' : 'COLLECT'}
                    </GlowButton>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── RIGHT: Detail panel ─────────────────────────────── */}
      <div
        className="border overflow-y-auto"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        {selected ? (
          <div className="animate-slide-in p-4 flex flex-col gap-4">
            {/* Control header */}
            <div className="flex justify-between items-start">
              <div>
                <div className="text-lg font-bold" style={{ color: statusColor(selected.status) }}>
                  {selected.id}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                  {selected.framework}
                </div>
              </div>
              <StatusBadge value={selected.status} color={statusColor(selected.status)} />
            </div>

            <div className="text-[12px] font-semibold" style={{ color: 'var(--color-text)' }}>
              {selected.control}
            </div>

            {/* Detail fields */}
            {[
              { label: 'EVIDENCE ON FILE',   value: selected.evidence },
              { label: 'LAST CHECKED',       value: new Date(selected.lastChecked).toLocaleString() },
              { label: 'NEXT DUE',           value: selected.nextDue },
              { label: 'COLLECTION OWNER',   value: selected.owner },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="p-3 border"
                style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}
              >
                <div className="text-[8px] tracking-widest mb-1" style={{ color: 'var(--color-text-dim)' }}>
                  {label}
                </div>
                <div className="text-[10px] leading-relaxed" style={{ color: 'var(--color-text)' }}>
                  {value}
                </div>
              </div>
            ))}

            {/* Action required callout */}
            {(selected.status === 'FAIL' || selected.status === 'WARN') && (
              <div
                className="p-3 border"
                style={{ background: 'var(--color-red-glow)', borderColor: 'var(--color-red)' }}
              >
                <div className="text-[9px] tracking-widest mb-1.5" style={{ color: 'var(--color-red)' }}>
                  ⚠ ACTION REQUIRED
                </div>
                <div className="text-[10px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {selected.owner === 'AUTO'
                    ? 'Trigger AI evidence collection to resolve this control gap automatically.'
                    : 'This control requires human action. Assign owner and set remediation deadline.'}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className="h-full flex items-center justify-center text-[11px]"
            style={{ color: 'var(--color-text-dim)' }}
          >
            Select a control to inspect evidence
          </div>
        )}
      </div>
    </div>
  )
}
