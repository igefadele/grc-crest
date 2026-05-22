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
  LiveEvent,
  EvidenceRecord,
  Incident,
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

// ─── Live Event Stream ────────────────────────────────────────────────────────

export const LIVE_EVENTS: LiveEvent[] = [
  { time: '00:03s', layer: 'cicd',  msg: 'TruffleHog blocked live AWS key in PR #4471',                            severity: 'blocked',   auto: true  },
  { time: '00:11s', layer: 'ccm',   msg: 'IAM drift detected — baseline restored in 3.8s',                         severity: 'healed',    auto: true  },
  { time: '00:28s', layer: 'pac',   msg: 'OPA denied public S3 bucket in staging deploy',                           severity: 'blocked',   auto: true  },
  { time: '00:45s', layer: 'ai',    msg: "AI agent: Vendor 'Nexus Corp' SOC2 gap — MFA missing on backup storage",  severity: 'flagged',   auto: true  },
  { time: '01:02s', layer: 'cicd',  msg: 'Snyk: CVE-2024-3811 (CVSS 9.1) blocked in node_modules',                severity: 'blocked',   auto: true  },
  { time: '01:19s', layer: 'ccm',   msg: 'CloudTrail: Unauthorised IAM account creation — stripped + logged',      severity: 'healed',    auto: true  },
  { time: '01:38s', layer: 'pac',   msg: 'Semgrep: SQL injection vector caught in payment-service PR',             severity: 'blocked',   auto: true  },
  { time: '02:01s', layer: 'human', msg: 'ESCALATION: Legacy core module encryption variance — GRC sign-off req',  severity: 'escalated', auto: false },
  { time: '02:24s', layer: 'ai',    msg: 'Evidence cron: 47 new audit artefacts collected from AWS Config',        severity: 'collected', auto: true  },
  { time: '02:51s', layer: 'ccm',   msg: 'Prometheus: encryption key rotation overdue — auto-rotated',             severity: 'healed',    auto: true  },
]

// ─── Evidence Records ─────────────────────────────────────────────────────────

export const INITIAL_EVIDENCE: EvidenceRecord[] = [
  { id: 'CC6.1',  framework: 'SOC 2',       control: 'Logical Access Controls',     status: 'PASS',       evidence: 'AWS IAM policy export + CloudTrail log bundle',       lastChecked: '2025-05-21T08:00Z', nextDue: '2025-06-21', owner: 'AUTO'  },
  { id: 'CC7.2',  framework: 'SOC 2',       control: 'System Monitoring',           status: 'PASS',       evidence: 'Datadog alert config snapshot + 30-day event log',    lastChecked: '2025-05-21T08:00Z', nextDue: '2025-06-21', owner: 'AUTO'  },
  { id: 'CC8.1',  framework: 'SOC 2',       control: 'Change Management',           status: 'PASS',       evidence: 'GitHub PR audit log + OPA block events CSV',          lastChecked: '2025-05-21T08:00Z', nextDue: '2025-06-21', owner: 'AUTO'  },
  { id: 'A.9.2',  framework: 'ISO 27001',   control: 'User Access Management',      status: 'WARN',       evidence: 'SSO export pending — stale account review overdue',   lastChecked: '2025-05-20T14:00Z', nextDue: '2025-05-22', owner: 'HUMAN' },
  { id: 'A.12.6', framework: 'ISO 27001',   control: 'Patch Management',            status: 'PASS',       evidence: 'Snyk weekly report + Dependabot PR log',              lastChecked: '2025-05-21T08:00Z', nextDue: '2025-06-21', owner: 'AUTO'  },
  { id: 'A.18.1', framework: 'ISO 27001',   control: 'Compliance with Legal Reqs',  status: 'COLLECTING', evidence: 'AI agent pulling GDPR transfer impact assessment',    lastChecked: '2025-05-21T09:30Z', nextDue: '2025-05-28', owner: 'AUTO'  },
  { id: 'SC-28',  framework: 'NIST 800-53', control: 'Encryption at Rest',          status: 'PASS',       evidence: 'AWS Config rule — all EBS volumes encrypted',         lastChecked: '2025-05-21T08:00Z', nextDue: '2025-06-21', owner: 'AUTO'  },
  { id: 'AU-2',   framework: 'NIST 800-53', control: 'Audit Events',                status: 'PASS',       evidence: 'CloudTrail trail config + S3 log bucket policy',      lastChecked: '2025-05-21T08:00Z', nextDue: '2025-06-21', owner: 'AUTO'  },
  { id: 'IR-4',   framework: 'NIST 800-53', control: 'Incident Handling',           status: 'FAIL',       evidence: 'Tabletop exercise overdue — last run 180+ days ago',  lastChecked: '2025-03-01T00:00Z', nextDue: '2025-05-15', owner: 'HUMAN' },
  { id: 'PM-9',   framework: 'NIST 800-53', control: 'Risk Management Strategy',    status: 'PASS',       evidence: 'Risk register snapshot + board approval PDF',         lastChecked: '2025-05-10T00:00Z', nextDue: '2025-08-10', owner: 'HUMAN' },
]

// ─── Incidents ───────────────────────────────────────────────────────────────

export const INCIDENTS: Incident[] = [
  {
    id: 'INC-0041',
    title: 'Unauthorised IAM Role Assumption — prod-data-pipeline',
    severity: 'P1',
    status: 'CONTAINED',
    blastRadius: 'prod-data-pipeline role • S3 bucket: grc-evidence-store • No data exfil confirmed',
    timeline: [
      { ts: '09:14:02', event: 'CloudTrail: AssumeRole event from unrecognised IP 185.220.x.x (Tor exit node)', auto: true  },
      { ts: '09:14:04', event: 'n8n automation: Session token revoked. Role policy stripped to baseline.',       auto: true  },
      { ts: '09:14:07', event: 'Audit log entry appended. Evidence snapshot taken to append-only S3 bucket.',   auto: true  },
      { ts: '09:14:09', event: 'AI agent: No S3 GetObject events in exposure window. Data confirmed intact.',   auto: true  },
      { ts: '09:15:22', event: 'GRC escalation triggered — P1 threshold exceeded. AI brief dispatched.',        auto: true  },
      { ts: '09:31:00', event: 'GRC Architect reviewed brief. Containment confirmed. Root-cause investigation opened.', auto: false },
    ],
    aiSummary: 'An IAM AssumeRole call originated from a Tor-exit-node IP at 09:14 UTC. The affected role (prod-data-pipeline) was automatically stripped within 2 seconds. No S3 GetObject events were logged during the 2-minute exposure window — data confirmed intact. Root cause: long-lived access key (180+ days) that bypassed MFA enforcement.',
    recommendation: 'Enforce IAM key max-age policy via OPA Rego rule. Add AWS SCP to deny AssumeRole from non-corporate IP ranges. Rotate all keys older than 90 days immediately.',
  },
  {
    id: 'INC-0039',
    title: 'Public S3 Bucket Misconfiguration — dev-assets',
    severity: 'P2',
    status: 'RESOLVED',
    blastRadius: 'dev-assets S3 bucket • Static front-end assets only • No PII or secrets confirmed',
    timeline: [
      { ts: '14:02:11', event: "OPA scan: aws_s3_bucket 'dev-assets' has ACL public-read — DENY triggered.", auto: true  },
      { ts: '14:02:12', event: 'Terraform plan blocked. Remediation PR #3892 raised with corrected ACL.',      auto: true  },
      { ts: '14:02:15', event: 'Audit log: violation event, PR ref, remediation artefact appended.',           auto: true  },
      { ts: '14:04:00', event: 'Developer accepted auto-generated remediation PR. Bucket policy corrected.',   auto: false },
    ],
    aiSummary: 'A developer attempted to create a public S3 bucket without encryption or restricted ACL. OPA blocked the Terraform plan before any deployment and auto-generated a remediation PR. The bucket never reached production — zero exposure window.',
    recommendation: 'Add S3 bucket guardrail at AWS Organisations SCP level as defence-in-depth. Add Checkov pre-commit hook to catch misconfigurations before push.',
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
