/**
 * @file PipelineTab.tsx
 * @description Full end-to-end automation pipeline view.
 * Shows every step from git commit to audit artefact,
 * labelled AUTO or HUMAN, with gate logic notes.
 */

import { StatusBadge } from '@/components/ui/StatusBadge'

interface PipelineRow {
  phase: string
  label: string
  auto: boolean
  color: string
  note?: string
}

const PIPELINE_ROWS: PipelineRow[] = [
  { phase: 'DEV',        label: 'Developer Git Commit',                           auto: true,  color: 'var(--color-text-muted)'                                                               },
  { phase: 'GATE 1',     label: 'TruffleHog Secret Scan',                         auto: true,  color: 'var(--color-green)',   note: 'Leaked token detected? → FAIL BUILD'                    },
  { phase: 'GATE 2',     label: 'Snyk Dependency Check',                          auto: true,  color: 'var(--color-green)',   note: 'CVSS ≥ 8.0 found? → FAIL BUILD'                         },
  { phase: 'GATE 3',     label: 'Semgrep SAST (TypeScript / JS rules)',            auto: true,  color: 'var(--color-green)',   note: 'SQL injection / data leak vector? → FAIL BUILD'         },
  { phase: 'GATE 4',     label: 'OPA Policy Evaluation (Rego)',                   auto: true,  color: 'var(--color-accent)',  note: 'Unencrypted resource / public bucket? → BLOCK + REMEDIATE PR' },
  { phase: 'DEPLOY',     label: 'Clean Container Deployed to Production',          auto: true,  color: 'var(--color-green)'                                                                    },
  { phase: 'RUNTIME',    label: 'CloudTrail / Prometheus Continuous Stream',       auto: true,  color: 'var(--color-purple)'                                                                   },
  { phase: 'DETECT',     label: 'IAM / Config Drift Detected',                    auto: true,  color: 'var(--color-amber)',   note: 'Out-of-baseline event flagged by rule engine'            },
  { phase: 'HEAL',       label: 'n8n / Node.js Auto-Remediation Script Fires',    auto: true,  color: 'var(--color-green)',   note: 'Baseline restored < 5s — no human alert ever sent'      },
  { phase: 'LOG',        label: 'Append-Only Audit Log Entry Written',             auto: true,  color: 'var(--color-purple)'                                                                   },
  { phase: 'EVIDENCE',   label: 'AI Agent Cron: Pull Config State from AWS',       auto: true,  color: 'var(--color-amber)'                                                                    },
  { phase: 'AUDIT',      label: 'Continuous Evidence Repository Updated',          auto: true,  color: 'var(--color-amber)'                                                                    },
  { phase: '⚠ ESCALATE', label: 'Automation Failure / Logical Paradox Detected',  auto: false, color: 'var(--color-red)',     note: '3 triggers: risk variance · unresolvable incident · regulatory rewrite' },
  { phase: 'HUMAN',      label: 'GRC Architect Receives AI-Prepared Brief',        auto: false, color: 'var(--color-red)',     note: 'High-judgment decision — full context pre-loaded by AI' },
]

export function PipelineTab() {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] tracking-widest mb-3" style={{ color: 'var(--color-text-muted)' }}>
        END-TO-END GRC AUTOMATION FLOW — FROM GIT COMMIT TO AUDIT ARTEFACT
      </p>

      {PIPELINE_ROWS.map((row, i) => (
        <div
          key={i}
          className="grid items-center gap-3 px-4 py-2.5 border"
          style={{
            gridTemplateColumns: '88px 1fr auto',
            background: row.auto ? 'var(--color-surface)' : 'var(--color-red-glow)',
            borderColor: row.auto ? 'var(--color-border)' : 'var(--color-red)',
          }}
        >
          {/* Phase label */}
          <div
            className="text-right text-[9px] font-bold tracking-widest"
            style={{ color: row.color }}
          >
            {row.phase}
          </div>

          {/* Step description */}
          <div>
            <div className="text-[11px]" style={{ color: 'var(--color-text)' }}>
              {row.label}
            </div>
            {row.note && (
              <div className="text-[9px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                {row.note}
              </div>
            )}
          </div>

          {/* AUTO / HUMAN badge */}
          <StatusBadge
            value={row.auto ? 'AUTO' : 'HUMAN'}
            color={row.auto ? 'var(--color-green)' : 'var(--color-red)'}
          />
        </div>
      ))}
    </div>
  )
}
