/**
 * @file IncidentPlaybookTab.tsx
 * @description Incident Response Playbook tab.
 *
 * Displays pre-loaded incidents with auto-response timelines.
 * "Generate AI Root Cause Analysis" sends the incident data to
 * the /api/ai proxy and returns deep forensic analysis:
 * - Root cause + attack vector
 * - Immediate action list
 * - Policy gaps surfaced
 * - OPA Rego rule to prevent recurrence
 * - Executive escalation recommendation
 */

'use client'

import { useState } from 'react'
import { INCIDENTS } from '@/lib/constants'
import { callAIJson } from '@/lib/aiClient'
import { INCIDENT_RCA_SYSTEM_PROMPT } from '@/lib/prompts'
import { GlowButton } from '@/components/ui/GlowButton'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CodeBlock } from '@/components/ui/CodeBlock'
import type { Incident, AIRootCauseAnalysis, IncidentSeverity, IncidentStatus } from '@/types/grc'

function sevColor(s: IncidentSeverity): string {
  return { P1: 'var(--color-red)', P2: 'var(--color-amber)', P3: 'var(--color-green)' }[s]
}

function statusColor(s: IncidentStatus): string {
  return { OPEN: 'var(--color-red)', CONTAINED: 'var(--color-amber)', RESOLVED: 'var(--color-green)' }[s]
}

export function IncidentPlaybookTab() {
  const [selectedId,  setSelectedId]  = useState<string>(INCIDENTS[0].id)
  const [aiLoading,   setAiLoading]   = useState(false)
  const [aiAnalysis,  setAiAnalysis]  = useState<AIRootCauseAnalysis | null>(null)
  const [aiError,     setAiError]     = useState<string | null>(null)
  const [newIncOpen,  setNewIncOpen]  = useState(false)
  const [newDesc,     setNewDesc]     = useState('')

  const inc: Incident | undefined = INCIDENTS.find((i) => i.id === selectedId)

  function selectIncident(id: string) {
    setSelectedId(id)
    setAiAnalysis(null)
    setAiError(null)
  }

  async function runRCA() {
    if (!inc) return
    setAiLoading(true)
    setAiAnalysis(null)
    setAiError(null)

    try {
      const analysis = await callAIJson<AIRootCauseAnalysis>(
        INCIDENT_RCA_SYSTEM_PROMPT,
        [
          `Incident: ${inc.title}`,
          `Severity: ${inc.severity}`,
          `Status: ${inc.status}`,
          `Blast radius: ${inc.blastRadius}`,
          `Timeline:\n${inc.timeline.map((t) => `${t.ts}: ${t.event}`).join('\n')}`,
          `AI Summary: ${inc.aiSummary}`,
        ].join('\n'),
      )
      setAiAnalysis(analysis)
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="grid gap-4 h-full" style={{ gridTemplateColumns: '260px 1fr' }}>

      {/* ── LEFT: Incident register ─────────────────────────── */}
      <div className="flex flex-col gap-2">
        <div className="text-[10px] tracking-widest mb-1" style={{ color: 'var(--color-text-dim)' }}>
          INCIDENT REGISTER
        </div>

        {INCIDENTS.map((i) => (
          <button
            key={i.id}
            onClick={() => selectIncident(i.id)}
            className="text-left p-3 border transition-all duration-150 cursor-pointer"
            style={{
              borderColor: selectedId === i.id ? sevColor(i.severity) : 'var(--color-border)',
              background: selectedId === i.id
                ? `${sevColor(i.severity)}10`
                : 'var(--color-surface)',
            }}
          >
            <div className="flex justify-between mb-1.5">
              <span className="text-[9px]" style={{ color: 'var(--color-text-dim)' }}>{i.id}</span>
              <div className="flex gap-1">
                <StatusBadge value={i.severity} color={sevColor(i.severity)} />
                <StatusBadge value={i.status}   color={statusColor(i.status)} />
              </div>
            </div>
            <div className="text-[10px] leading-snug" style={{ color: 'var(--color-text)' }}>
              {i.title}
            </div>
          </button>
        ))}

        {/* New incident toggle */}
        <GlowButton
          color="var(--color-teal)"
          onClick={() => setNewIncOpen(!newIncOpen)}
          className="w-full !py-2 mt-1"
        >
          + NEW INCIDENT
        </GlowButton>

        {newIncOpen && (
          <div
            className="p-3 border"
            style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-teal)' }}
          >
            <div className="text-[9px] tracking-widest mb-1.5" style={{ color: 'var(--color-text-dim)' }}>
              INCIDENT DESCRIPTION
            </div>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Brief incident description..."
              className="w-full min-h-20 p-2 text-[10px]"
              style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
            <GlowButton
              color="var(--color-teal)"
              className="w-full !py-1.5 mt-2 !text-[9px]"
            >
              LOG INCIDENT
            </GlowButton>
          </div>
        )}
      </div>

      {/* ── RIGHT: Incident detail ──────────────────────────── */}
      {inc && (
        <div className="overflow-y-auto flex flex-col gap-4">

          {/* Header */}
          <div
            className="p-4 border"
            style={{
              borderColor: sevColor(inc.severity),
              background: `${sevColor(inc.severity)}08`,
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-[9px] mb-1" style={{ color: 'var(--color-text-dim)' }}>{inc.id}</div>
                <div className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{inc.title}</div>
              </div>
              <div className="flex gap-1.5">
                <StatusBadge value={inc.severity} color={sevColor(inc.severity)} />
                <StatusBadge value={inc.status}   color={statusColor(inc.status)} />
              </div>
            </div>
            <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
              <span className="mr-1.5" style={{ color: 'var(--color-amber)' }}>⚠ BLAST RADIUS:</span>
              {inc.blastRadius}
            </div>
          </div>

          {/* Automated response timeline */}
          <div className="border" style={{ borderColor: 'var(--color-border)' }}>
            <div
              className="px-3 py-2 border-b text-[9px] tracking-widest"
              style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
            >
              AUTOMATED RESPONSE TIMELINE
            </div>
            {inc.timeline.map((entry, i) => (
              <div
                key={i}
                className="px-3 py-2 border-b"
                style={{
                  borderColor: 'var(--color-border)',
                  display: 'grid',
                  gridTemplateColumns: '65px 1fr auto',
                  gap: '12px',
                  alignItems: 'start',
                }}
              >
                <div className="text-[9px] font-mono" style={{ color: 'var(--color-text-dim)' }}>
                  {entry.ts}
                </div>
                <div className="text-[10px] leading-relaxed" style={{ color: 'var(--color-text)' }}>
                  {entry.event}
                </div>
                <StatusBadge
                  value={entry.auto ? 'AUTO' : 'HUMAN'}
                  color={entry.auto ? 'var(--color-green)' : 'var(--color-red)'}
                />
              </div>
            ))}
          </div>

          {/* AI narrative */}
          <div
            className="p-4 border"
            style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}
          >
            <div className="text-[9px] tracking-widest mb-2" style={{ color: 'var(--color-amber)' }}>
              AI INCIDENT NARRATIVE
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text)' }}>
              {inc.aiSummary}
            </p>
          </div>

          {/* GRC recommendation */}
          <div
            className="p-4 border"
            style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-accent)' }}
          >
            <div className="text-[9px] tracking-widest mb-2" style={{ color: 'var(--color-accent)' }}>
              GRC ARCHITECT RECOMMENDATION
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text)' }}>
              {inc.recommendation}
            </p>
          </div>

          {/* RCA trigger */}
          <GlowButton
            color={aiLoading ? 'var(--color-text-dim)' : 'var(--color-purple)'}
            onClick={runRCA}
            disabled={aiLoading}
            className="w-full !py-2.5"
          >
            {aiLoading
              ? '⟳  RUNNING AI ROOT CAUSE ANALYSIS...'
              : '◆  GENERATE AI ROOT CAUSE ANALYSIS'}
          </GlowButton>

          {/* Loading indicator */}
          {aiLoading && (
            <div
              className="flex items-center gap-3 p-4 border"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="animate-pulse-slow" style={{ color: 'var(--color-purple)' }}>◆</div>
              <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                Analysing attack vectors, policy gaps, and prevention rules...
              </div>
            </div>
          )}

          {/* AI error */}
          {aiError && (
            <div
              className="p-4 border text-[11px]"
              style={{ borderColor: 'var(--color-red)', color: 'var(--color-red)' }}
            >
              {aiError}
            </div>
          )}

          {/* RCA results */}
          {aiAnalysis && (
            <div className="animate-slide-in flex flex-col gap-3">
              {[
                { label: 'ROOT CAUSE',       key: 'rootCause',       color: 'var(--color-red)'   },
                { label: 'ATTACK VECTOR',    key: 'attackVector',    color: 'var(--color-amber)'  },
                { label: 'LESSON LEARNED',   key: 'lessonLearned',   color: 'var(--color-text)'   },
                { label: 'ESTIMATED IMPACT', key: 'estimatedImpact', color: 'var(--color-amber)'  },
              ].map(({ label, key, color }) => {
                const value = aiAnalysis[key as keyof AIRootCauseAnalysis]
                if (!value || typeof value !== 'string') return null
                return (
                  <div
                    key={key}
                    className="p-3 border"
                    style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}
                  >
                    <div className="text-[8px] tracking-widest mb-1" style={{ color: 'var(--color-text-dim)' }}>
                      {label}
                    </div>
                    <div className="text-[11px] leading-relaxed" style={{ color }}>
                      {value}
                    </div>
                  </div>
                )
              })}

              {/* Immediate actions */}
              {aiAnalysis.immediateActions.length > 0 && (
                <div
                  className="p-3 border"
                  style={{ background: 'var(--color-red-glow)', borderColor: 'var(--color-red)' }}
                >
                  <div className="text-[9px] tracking-widest mb-2" style={{ color: 'var(--color-red)' }}>
                    IMMEDIATE ACTIONS
                  </div>
                  {aiAnalysis.immediateActions.map((action, i) => (
                    <div key={i} className="text-[10px] py-0.5" style={{ color: 'var(--color-text)' }}>
                      <span className="mr-2" style={{ color: 'var(--color-red)' }}>{i + 1}.</span>
                      {action}
                    </div>
                  ))}
                </div>
              )}

              {/* Policy gaps */}
              {aiAnalysis.policyGaps.length > 0 && (
                <div className="p-3 border" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="text-[9px] tracking-widest mb-2" style={{ color: 'var(--color-amber)' }}>
                    POLICY GAPS IDENTIFIED
                  </div>
                  {aiAnalysis.policyGaps.map((gap, i) => (
                    <div key={i} className="text-[10px] py-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      <span className="mr-2" style={{ color: 'var(--color-amber)' }}>⚠</span>
                      {gap}
                    </div>
                  ))}
                </div>
              )}

              {/* OPA prevention rule */}
              {aiAnalysis.opaRuleRecommendation && (
                <CodeBlock
                  label="RECOMMENDED OPA RULE — PREVENTS RECURRENCE"
                  code={aiAnalysis.opaRuleRecommendation}
                  color="var(--color-accent)"
                />
              )}

              {/* Executive escalation */}
              {aiAnalysis.escalationRequired && (
                <div
                  className="p-3 border text-[11px]"
                  style={{ background: 'var(--color-red-glow)', borderColor: 'var(--color-red)', color: 'var(--color-red)' }}
                >
                  ⚠ AI RECOMMENDS EXECUTIVE ESCALATION — This incident meets the P1 threshold for board-level notification.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
