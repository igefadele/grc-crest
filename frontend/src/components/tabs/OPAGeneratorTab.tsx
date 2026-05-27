/**
 * @file OPAGeneratorTab.tsx
 * @description OPA Rule Generator tab.
 *
 * Describe a compliance policy in plain English, select a target resource type,
 * and the AI generates four production-ready policy artefacts simultaneously:
 * - OPA Rego rule
 * - Semgrep YAML rule
 * - GitHub Actions CI step
 * - Terraform / Checkov guardrail
 * Plus test cases with DENY / ALLOW expected results and a copy button per block.
 */

'use client'

import { useState } from 'react'
import { callAIJson } from '@/lib/aiClient'
import { OPA_GENERATOR_SYSTEM_PROMPT } from '@/lib/prompts'
import { OPA_RESOURCE_TYPES } from '@/lib/constants'
import { GlowButton } from '@/components/ui/GlowButton'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { GeneratedPolicy } from '@/types/grc'

export function OPAGeneratorTab() {
  const [policyDesc,      setPolicyDesc]      = useState('')
  const [targetResource,  setTargetResource]  = useState('aws_s3_bucket')
  const [loading,         setLoading]         = useState(false)
  const [result,          setResult]          = useState<GeneratedPolicy | null>(null)
  const [error,           setError]           = useState<string | null>(null)

  async function generate() {
    if (!policyDesc.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const policy = await callAIJson<GeneratedPolicy>(
        OPA_GENERATOR_SYSTEM_PROMPT,
        `Policy: ${policyDesc}\nTarget resource type: ${targetResource}`,
      )
      setResult(policy)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: '380px 1fr' }}>

      {/* ── LEFT: Input panel ───────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <p className="text-[10px] tracking-widest" style={{ color: 'var(--color-text-dim)' }}>
          OPA REGO RULE GENERATOR — PLAIN ENGLISH → PRODUCTION CODE
        </p>

        {/* Resource type selector */}
        <div>
          <label className="block text-[9px] tracking-widest mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
            TARGET RESOURCE TYPE
          </label>
          <div className="relative">
            <select
              value={targetResource}
              onChange={(e) => setTargetResource(e.target.value)}
              className="w-full px-3 py-2 text-[11px] cursor-pointer"
              style={{
                background: 'var(--color-surface-alt)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              {OPA_RESOURCE_TYPES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs"
              style={{ color: 'var(--color-text-dim)' }}
            >
              ▾
            </span>
          </div>
        </div>

        {/* Plain English description */}
        <div className="flex flex-col flex-1">
          <label className="block text-[9px] tracking-widest mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
            DESCRIBE THE POLICY IN PLAIN ENGLISH
          </label>
          <textarea
            value={policyDesc}
            onChange={(e) => setPolicyDesc(e.target.value)}
            placeholder={`Examples:\n\n• "All S3 buckets must have server-side encryption and versioning enabled"\n\n• "IAM roles must not contain wildcard (*) actions"\n\n• "RDS instances must not be publicly accessible and must have deletion protection"\n\n• "Security groups must not allow inbound SSH (port 22) from 0.0.0.0/0"`}
            className="flex-1 min-h-48 p-3 text-[11px] leading-relaxed resize-y"
            style={{
              background: 'var(--color-surface-alt)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>

        <GlowButton
          color={loading ? 'var(--color-text-dim)' : 'var(--color-accent)'}
          onClick={generate}
          disabled={loading || !policyDesc.trim()}
          className="w-full !py-2.5"
        >
          {loading ? '⟳  GENERATING RULES...' : '⬡  GENERATE POLICY-AS-CODE'}
        </GlowButton>

        {/* Output reference */}
        <div
          className="p-3 border"
          style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}
        >
          <div className="text-[9px] tracking-widest mb-2" style={{ color: 'var(--color-text-dim)' }}>
            EVERY GENERATION INCLUDES
          </div>
          {[
            'OPA Rego rule (deny block + test cases)',
            'Semgrep YAML rule (code-level detection)',
            'GitHub Actions CI/CD step',
            'Terraform / Checkov guardrail',
            'Test cases with DENY / ALLOW assertions',
          ].map((item) => (
            <div key={item} className="text-[10px] py-0.5" style={{ color: 'var(--color-text-muted)' }}>
              <span className="mr-2" style={{ color: 'var(--color-accent)' }}>⬡</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Output panel ─────────────────────────────── */}
      <div className="overflow-y-auto flex flex-col gap-4">

        {/* Empty state */}
        {!result && !loading && !error && (
          <div
            className="flex-1 flex items-center justify-center text-center text-[11px] leading-8"
            style={{ color: 'var(--color-text-dim)' }}
          >
            Describe a compliance requirement in plain English.<br />
            AI generates production-ready OPA Rego, Semgrep,<br />
            GitHub Actions, and Terraform guardrails instantly.
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="animate-pulse-slow text-2xl" style={{ color: 'var(--color-accent)' }}>⬡</div>
            <div className="text-[10px] tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              COMPILING POLICY-AS-CODE...
            </div>
          </div>
        )}

        {/* Error */}
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

            {/* Explanation */}
            {result.explanation && (
              <div
                className="p-4 border text-[11px] leading-relaxed"
                style={{
                  background: 'var(--color-surface-alt)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <span className="mr-2" style={{ color: 'var(--color-accent)' }}>⬡</span>
                {result.explanation}
              </div>
            )}

            {result.regoRule           && <CodeBlock label="OPA REGO RULE"           code={result.regoRule}           color="var(--color-accent)"  />}
            {result.semgrepRule        && <CodeBlock label="SEMGREP YAML RULE"        code={result.semgrepRule}        color="var(--color-green)"   />}
            {result.githubActionsStep  && <CodeBlock label="GITHUB ACTIONS CI STEP"   code={result.githubActionsStep}  color="var(--color-purple)"  />}
            {result.terraformGuardrail && <CodeBlock label="TERRAFORM / CHECKOV"      code={result.terraformGuardrail} color="var(--color-amber)"   />}

            {/* Test cases */}
            {result.testCases.length > 0 && (
              <div className="border" style={{ borderColor: 'var(--color-border)' }}>
                <div
                  className="px-3 py-2 border-b text-[9px] tracking-widest"
                  style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)', color: 'var(--color-teal)' }}
                >
                  TEST CASES ({result.testCases.length})
                </div>
                {result.testCases.map((tc, i) => (
                  <div
                    key={i}
                    className="px-3 py-2.5 border-b flex justify-between gap-3 items-start"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <div>
                      <div className="text-[10px] mb-1" style={{ color: 'var(--color-text)' }}>
                        {tc.description}
                      </div>
                      <div className="text-[9px] font-mono" style={{ color: 'var(--color-text-dim)' }}>
                        {tc.input}
                      </div>
                    </div>
                    <StatusBadge
                      value={tc.expectedResult}
                      color={tc.expectedResult === 'DENY' ? 'var(--color-red)' : 'var(--color-green)'}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
