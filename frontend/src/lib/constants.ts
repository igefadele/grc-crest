/**
 * @file constants.ts
 * @description All static data for the GRC Crest - Command Center.
 *
 * Keeping data here (not inside components) means:
 * - Components stay clean and only contain rendering logic
 * - Data can be updated in one place
 * - Data can be replaced with real API calls later without touching components
 */

import type {
  GRCLayer,
  TabDefinition,
  ProviderMeta,
  AIProvider,
} from '@/types/grc'

// ─── AI Provider Metadata ────────────────────────────────────────────────────

/** Display label and colour for each supported AI provider. */
export const PROVIDER_META: Record<AIProvider, ProviderMeta> = {
  claude: { label: 'Claude (Anthropic)', color: '#CC785C' },
  openai: { label: 'GPT-4o (OpenAI)',    color: '#10A37F' },
  custom: { label: 'Custom LLM',          color: '#B16CFF' },
}

// ─── Tab Definitions ─────────────────────────────────────────────────────────

export const TABS: TabDefinition[] = [
  { id: 'overview',  label: 'Architecture',      icon: '⬡', description: 'Five-layer GRC automation map' },
  { id: 'pipeline',  label: 'Pipeline',           icon: '◈', description: 'End-to-end automation flow'    },
  { id: 'code',      label: 'Code Reference',     icon: '◉', description: 'Production rule samples'       },
  { id: 'vendor',    label: 'Vendor Risk AI',     icon: '◆', description: 'AI vendor risk assessment'     },
  { id: 'opa-gen',   label: 'OPA Generator',      icon: '⬡', description: 'Plain English → Rego rules'   },
  { id: 'evidence',  label: 'Evidence Tracker',   icon: '◉', description: 'Continuous compliance evidence'},
  { id: 'incident',  label: 'Incident Playbook',  icon: '⚠', description: 'AI-powered incident response' },
]

// ─── GRC Architecture Layers ─────────────────────────────────────────────────

export const LAYERS: GRCLayer[] = [
  {
    id: 'pac',
    label: '01 — POLICY-AS-CODE',
    shortLabel: 'PaC Engine',
    icon: '⬡',
    color: '#00D4FF',
    status: 'ACTIVE',
    description: 'OPA / Rego rules enforced in git. Zero policy binders. Every constraint is version-controlled code.',
    metrics: [
      { label: 'OPA Rules Active',   value: '347',   delta: '+12 this week'   },
      { label: 'Violations Blocked', value: '1,204', delta: 'this month'      },
      { label: 'Auto-Remediated',    value: '98.3%', delta: 'of all findings' },
    ],
    tools: ['Open Policy Agent', 'Rego', 'Semgrep', 'Conftest', 'Checkov'],
    pipeline: [
      { step: 'Git Commit',     icon: '◈', auto: true },
      { step: 'OPA Eval',       icon: '⬡', auto: true },
      { step: 'Policy Match',   icon: '◆', auto: true },
      { step: 'Block / Pass',   icon: '◉', auto: true },
      { step: 'PR Remediation', icon: '↩', auto: true },
    ],
    exampleRule: `# OPA Rego — Block public S3 buckets
package grc.aws

deny[msg] {
  input.resource.type == "aws_s3_bucket"
  input.resource.config.acl == "public-read"
  msg := "POLICY VIOLATION: S3 bucket must not be public"
}`,
  },
  {
    id: 'cicd',
    label: '02 — CI/CD SHIFT-LEFT',
    shortLabel: 'Pipeline Guards',
    icon: '◈',
    color: '#00FF88',
    status: 'ACTIVE',
    description: 'Compliance gates embedded at commit-time. Non-compliant code cannot physically reach production.',
    metrics: [
      { label: 'Builds Scanned',        value: '8,441', delta: 'last 30 days'      },
      { label: 'Secrets Caught',         value: '23',    delta: 'prevented exposure' },
      { label: 'Critical CVEs Blocked',  value: '61',    delta: 'CVSS ≥ 8.0'        },
    ],
    tools: ['TruffleHog', 'Snyk', 'Dependabot', 'Semgrep SAST', 'GitHub Actions'],
    pipeline: [
      { step: 'Dev Commit',    icon: '◈',  auto: true },
      { step: 'TruffleHog',   icon: '🔍', auto: true },
      { step: 'Snyk Deps',    icon: '⚠',  auto: true },
      { step: 'Semgrep SAST', icon: '◆',  auto: true },
      { step: 'Clean Deploy', icon: '✓',  auto: true },
    ],
    exampleRule: `# GitHub Actions — Block build on critical CVE
- name: Snyk Security Scan
  uses: snyk/actions/node@master
  with:
    args: --severity-threshold=high
  env:
    SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}`,
  },
  {
    id: 'ccm',
    label: '03 — CONTINUOUS CONTROLS MONITORING',
    shortLabel: 'Runtime CCM',
    icon: '◉',
    color: '#B16CFF',
    status: 'STREAMING',
    description: 'Real-time observability at runtime. Every state-change event is captured, evaluated, and auto-remediated.',
    metrics: [
      { label: 'Events Processed/hr',   value: '142K',  delta: 'live stream'          },
      { label: 'Auto-Healed Drift',      value: '99.1%', delta: 'without human touch'  },
      { label: 'Mean Time to Remediate', value: '4.2s',  delta: 'avg across all rules' },
    ],
    tools: ['AWS CloudTrail', 'Datadog', 'Prometheus', 'n8n', 'Node.js Microservices'],
    pipeline: [
      { step: 'CloudTrail Event', icon: '◉', auto: true },
      { step: 'Rule Evaluation',  icon: '⬡', auto: true },
      { step: 'Drift Detected?',  icon: '◆', auto: true },
      { step: 'Auto-Remediate',   icon: '↺', auto: true },
      { step: 'Audit Log Append', icon: '✓', auto: true },
    ],
    exampleRule: `// TypeScript — Auto-strip rogue IAM permissions
interface DriftEvent {
  detected: boolean
  resource: string
  deviation: string
}

const iamDrift: DriftEvent = await checkIAMBaseline(event)
if (iamDrift.detected) {
  await restoreBaselineTemplate(iamDrift.resource)
  await appendAuditLog(iamDrift, 'AUTO_REMEDIATED')
  // No human alert fired — fully autonomous
}`,
  },
  {
    id: 'ai',
    label: '04 — AGENTIC AI GRC AUTOMATIONS',
    shortLabel: 'AI Agents',
    icon: '◆',
    color: '#FFB830',
    status: 'RUNNING',
    description: 'AI-powered agents handle vendor risk, evidence collection, and gap analysis at machine speed.',
    metrics: [
      { label: 'Vendor Reports Parsed',   value: '214',   delta: 'this quarter'      },
      { label: 'Evidence Auto-Collected', value: '3,890', delta: 'audit artefacts'   },
      { label: 'Human Review Required',   value: '1.7%',  delta: 'of all AI outputs' },
    ],
    tools: ['Claude API / OpenAI GPT', 'Pinecone RAG', 'LangChain', 'Chroma DB'],
    pipeline: [
      { step: 'Vendor SOC2 Upload', icon: '◈',  auto: true  },
      { step: 'AI Parse + RAG',     icon: '◆',  auto: true  },
      { step: 'Gap Analysis',       icon: '⬡',  auto: true  },
      { step: 'Risk Score + Draft', icon: '◉',  auto: true  },
      { step: '→ Human Approval',   icon: '👤', auto: false },
    ],
    exampleRule: `// TypeScript — Provider-agnostic AI agent call
interface VendorAssessment {
  gaps: Gap[]
  riskScore: number     // 0-100; higher = more risk
  riskLevel: RiskLevel  // LOW | MEDIUM | HIGH | CRITICAL
  draftResponse: string
}

// callAI() routes to Claude or OpenAI based on env config
const raw = await callAI(VENDOR_SYSTEM_PROMPT, reportText)
const assessment: VendorAssessment = JSON.parse(raw)`,
  },
  {
    id: 'human',
    label: '05 — HIGH-JUDGMENT HUMAN FIREWALL',
    shortLabel: 'Human Escalation',
    icon: '👤',
    color: '#FF4560',
    status: 'STANDBY',
    description: 'Humans only intercept true logical paradoxes: risk acceptance, incident orchestration, regulatory rewrites.',
    metrics: [
      { label: 'Human Escalations/month', value: '12',    delta: 'vs 800+ automated' },
      { label: 'Avg Decision Time',        value: '47min', delta: 'with full AI brief' },
      { label: 'False Escalation Rate',    value: '0.3%',  delta: 'precision-tuned'   },
    ],
    tools: ['PagerDuty', 'Jira', 'Confluence', 'Slack AI Summaries'],
    pipeline: [
      { step: 'Automation Fails',  icon: '✗',  auto: false },
      { step: 'AI Prepares Brief', icon: '◆',  auto: true  },
      { step: 'Page On-Call GRC',  icon: '📟', auto: false },
      { step: 'Human Decides',     icon: '👤', auto: false },
      { step: 'Policy Update',     icon: '↩',  auto: false },
    ],
    exampleRule: `// TypeScript — Escalation trigger guard
type EscalationTrigger =
  | 'RISK_ACCEPTANCE_VARIANCE'  // Legacy module crash if forced
  | 'UNRESOLVABLE_INCIDENT'     // Automation cannot auto-heal
  | 'REGULATORY_REWRITE'        // New AI Safety / GDPR change

function shouldEscalate(event: GRCEvent): boolean {
  // Only 3 triggers ever reach a human inbox
  return ESCALATION_TRIGGERS.includes(
    event.type as EscalationTrigger
  )
}`,
  },
]

// ─── Assessment Rubric ───────────────────────────────────────────────────────

/** The 7 corporate security controls the vendor risk agent checks against. */
export const VENDOR_RUBRIC: string[] = [
  'MFA on all privileged accounts',
  'Encryption at rest — AES-256 minimum',
  'Incident response SLA < 4hr for P1',
  'SOC 2 Type II or ISO 27001 certified',
  'Penetration test within past 12 months',
  'Vendor sub-processor list disclosed',
  'Data residency compliant with GDPR Art. 46',
]

/** Supported OPA target resource types shown in the generator dropdown. */
export const OPA_RESOURCE_TYPES: string[] = [
  'aws_s3_bucket',
  'aws_iam_role',
  'aws_security_group',
  'aws_rds_instance',
  'aws_lambda_function',
  'aws_ec2_instance',
  'kubernetes_deployment',
  'google_storage_bucket',
]
