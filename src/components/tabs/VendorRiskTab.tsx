/**
 * @file VendorRiskTab.tsx
 * @description AI Vendor Risk Assessment tab.
 *
 * Paste any vendor security document (SOC 2 summary, ISO cert, CAIQ, pentest
 * executive summary) and the AI agent returns a full risk assessment:
 * - 0–100 risk score + risk level
 * - Control gap list with severity and recommendations
 * - Security strengths
 * - Pre-drafted remediation email ready for GRC sign-off
 * - Audit trail note
 *
 * The AI call goes to /api/ai (server-side proxy) — no key in the browser.
 */

'use client'

import { useState } from 'react'
import { callAIJson } from '@/lib/aiClient'
import { VENDOR_RISK_SYSTEM_PROMPT } from '@/lib/prompts'
import { VENDOR_RUBRIC } from '@/lib/constants'
import { GlowButton } from '@/components/ui/GlowButton'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { VendorAssessment, RiskLevel } from '@/types/grc'

/** Maps a risk level to its display colour. */
function riskColor(level: RiskLevel | string): string {
  const map: Record<string, string> = {
    LOW:      'var(--color-green)',
    MEDIUM:   'var(--color-amber)',
    HIGH:     'var(--color-red)',
    CRITICAL: 'var(--color-red)',
  }
  return map[level] ?? 'var(--color-text-muted)'
}

export function VendorRiskTab() {
  const [vendorName, setVendorName] = useState('')
  const [reportText, setReportText] = useState('')
  const [loading, setLoading]       = useState(false)
  const [result, setResult]         = useState<VendorAssessment | null>(null)
  const [error, setError]           = useState<string | null>(null)

  async function runAssessment() {
    if (!reportText.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const assessment = await callAIJson<VendorAssessment>(
        VENDOR_RISK_SYSTEM_PROMPT,
        `Vendor: ${vendorName || 'Unknown Vendor'}\n\nSecurity Report:\n${reportText}`,
      )
      setResult(assessment)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-5 h-full">

      {/* ── LEFT: Input panel ───────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <p className="text-[10px] tracking-widest" style={{ color: 'var(--color-text-dim)' }}>
          AI VENDOR RISK ASSESSMENT — SECURE SERVER-SIDE AI PROXY
        </p>

        {/* Vendor name */}
        <div>
          <label className="block text-[9px] tracking-widest mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
            VENDOR NAME
          </label>
          <input
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            placeholder="e.g. Nexus Corp, Acme Security Ltd"
            className="w-full px-3 py-2 text-[11px]"
            style={{
              background: 'var(--color-surface-alt)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>

        {/* Report paste area */}
        <div className="flex flex-col flex-1">
          <label className="block text-[9px] tracking-widest mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
            PASTE VENDOR SECURITY REPORT / SOC 2 SUMMARY / ISO CERT / QUESTIONNAIRE
          </label>
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder={`Paste any of the following:\n• SOC 2 Type II executive summary\n• ISO 27001 certificate + scope statement\n• Completed CAIQ / VSAQ security questionnaire\n• Penetration test executive summary\n\nAI returns: risk score · gap analysis · strengths · draft email.\nYou only touch it to approve or edit.`}
            className="flex-1 min-h-52 p-3 text-[11px] leading-relaxed resize-y"
            style={{
              background: 'var(--color-surface-alt)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>

        <GlowButton
          color={loading ? 'var(--color-text-dim)' : 'var(--color-amber)'}
          onClick={runAssessment}
          disabled={loading || !reportText.trim()}
          className="w-full !py-2.5"
        >
          {loading ? '⟳  AI AGENT RUNNING ASSESSMENT...' : '◆  RUN AI RISK ASSESSMENT'}
        </GlowButton>

        {/* Rubric reference */}
        <div
          className="p-3 border"
          style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}
        >
          <div className="text-[9px] tracking-widest mb-2" style={{ color: 'var(--color-text-dim)' }}>
            CORPORATE ASSESSMENT RUBRIC — 7 CONTROLS
          </div>
          {VENDOR_RUBRIC.map((rule) => (
            <div
              key={rule}
              className="text-[10px] py-1 border-b"
              style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}
            >
              <span className="mr-2" style={{ color: 'var(--color-accent)' }}>⬡</span>
              {rule}
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Results panel ────────────────────────────── */}
      <div className="overflow-y-auto flex flex-col gap-4">

        {/* Empty state */}
        {!result && !loading && !error && (
          <div
            className="flex-1 flex items-center justify-center text-center text-[11px] leading-8"
            style={{ color: 'var(--color-text-dim)' }}
          >
            Paste a vendor document and run the assessment.<br />
            AI returns: risk score · gap analysis · strengths · draft email.<br />
            Your only action is to approve or edit the output.
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="animate-pulse-slow text-2xl" style={{ color: 'var(--color-amber)' }}>◆</div>
            <div className="text-[10px] tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              AGENT ANALYSING DOCUMENT...
            </div>
            {[
              'Tokenising report structure',
              'Matching against rubric vectors',
              'Identifying control gaps',
              'Scoring residual risk (0–100)',
              'Drafting vendor response email',
            ].map((s, i) => (
              <div key={s} className="text-[9px]" style={{ color: 'var(--color-text-dim)' }}>
                {i + 1}. {s}
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div
            className="p-4 border text-[11px]"
            style={{ borderColor: 'var(--color-red)', color: 'var(--color-red)' }}
          >
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="animate-slide-in flex flex-col gap-4">

            {/* Risk score header */}
            <div
              className="p-4 border"
              style={{
                borderColor: riskColor(result.riskLevel),
                background: `${riskColor(result.riskLevel)}10`,
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="text-[13px] font-bold" style={{ color: 'var(--color-text)' }}>
                  {result.vendorName}
                </div>
                <StatusBadge value={result.riskLevel} color={riskColor(result.riskLevel)} />
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold" style={{ color: riskColor(result.riskLevel) }}>
                  {result.overallRiskScore}
                </div>
                <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                  / 100 residual risk score
                </div>
              </div>
              <div className="text-[9px] mt-1" style={{ color: 'var(--color-text-dim)' }}>
                {result.auditTrailNote}
              </div>
            </div>

            {/* Control gaps */}
            {result.gaps.length > 0 && (
              <div className="border" style={{ borderColor: 'var(--color-border)' }}>
                <div
                  className="px-3 py-2 border-b text-[9px] tracking-widest"
                  style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)', color: 'var(--color-red)' }}
                >
                  CONTROL GAPS IDENTIFIED ({result.gaps.length})
                </div>
                {result.gaps.map((gap, i) => (
                  <div
                    key={i}
                    className="px-3 py-2.5 border-b"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <div className="flex justify-between mb-1">
                      <div className="text-[11px] font-semibold" style={{ color: 'var(--color-text)' }}>
                        {gap.control}
                      </div>
                      <StatusBadge value={gap.severity} color={riskColor(gap.severity)} />
                    </div>
                    <div className="text-[10px] mb-1" style={{ color: 'var(--color-text-muted)' }}>
                      {gap.finding}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--color-accent)' }}>
                      → {gap.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Strengths */}
            {result.strengths.length > 0 && (
              <div
                className="p-3 border"
                style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}
              >
                <div className="text-[9px] tracking-widest mb-2" style={{ color: 'var(--color-green)' }}>
                  SECURITY STRENGTHS ({result.strengths.length})
                </div>
                {result.strengths.map((s, i) => (
                  <div key={i} className="text-[10px] py-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="mr-2" style={{ color: 'var(--color-green)' }}>✓</span>{s}
                  </div>
                ))}
              </div>
            )}

            {/* Draft email */}
            {result.draftEmail && (
              <div className="border" style={{ borderColor: 'var(--color-border)' }}>
                <div
                  className="flex justify-between items-center px-3 py-2 border-b"
                  style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}
                >
                  <span className="text-[9px] tracking-widest" style={{ color: 'var(--color-amber)' }}>
                    AI-DRAFTED VENDOR REMEDIATION EMAIL
                  </span>
                  <StatusBadge value="AWAITING YOUR APPROVAL" color="var(--color-amber)" />
                </div>
                <pre
                  className="p-3 text-[10px] leading-7 whitespace-pre-wrap break-words"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {result.draftEmail}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
