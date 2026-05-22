/**
 * @file grc.ts
 * @description All TypeScript interfaces, types, and enums for the GRC Command Center.
 *
 * Centralising types here means every component and lib function imports from
 * a single source of truth. Changing a type here propagates compiler errors
 * to every consumer — no silent contract breaks.
 */

// ─── AI Provider ────────────────────────────────────────────────────────────

/** The three supported AI provider keys. */
export type AIProvider = 'claude' | 'openai' | 'custom'

/** Runtime configuration for the AI provider. Read from env vars server-side. */
export interface AIConfig {
  /** Active provider — routes callAI() to the correct API format. */
  provider: AIProvider
  /** Model identifier string (e.g. "claude-sonnet-4-20250514", "gpt-4o"). */
  model: string
  /** Maximum tokens in the completion response. */
  maxTokens: number
  /** Optional: override endpoint URL for custom/self-hosted LLMs. */
  endpoint?: string
}

/** UI metadata for each provider shown in the header badge. */
export interface ProviderMeta {
  label: string
  color: string
}

// ─── API Route Payload ───────────────────────────────────────────────────────

/**
 * Request body sent from the browser to the /api/ai Next.js route.
 * The route holds the API key server-side and forwards to the LLM.
 */
export interface AIRequestPayload {
  systemPrompt: string
  userMessage: string
}

/**
 * Response body returned from /api/ai to the browser.
 */
export interface AIResponsePayload {
  text: string
  error?: string
}

// ─── Architecture Layers ─────────────────────────────────────────────────────

/** A single step in a GRC automation pipeline. */
export interface PipelineStep {
  /** Human-readable label for the step. */
  step: string
  /** Display icon character. */
  icon: string
  /** true = fully automated; false = requires human intervention. */
  auto: boolean
}

/** A KPI metric card shown inside an expanded layer panel. */
export interface LayerMetric {
  label: string
  value: string
  delta: string
}

/**
 * One of the five GRC automation layers displayed in the Architecture tab.
 * Each layer maps to a column of the automation stack.
 */
export interface GRCLayer {
  id: string
  label: string
  shortLabel: string
  icon: string
  /** Tailwind-safe hex colour string for theming. */
  color: string
  status: string
  description: string
  metrics: LayerMetric[]
  tools: string[]
  pipeline: PipelineStep[]
  /** Representative code sample shown in the Code Reference tab. */
  exampleRule: string
}

// ─── Live Event Stream ───────────────────────────────────────────────────────

/** Visual severity classification for an automation event. */
export type SeverityKey = 'blocked' | 'healed' | 'flagged' | 'escalated' | 'collected'

/** A single event in the real-time automation stream sidebar. */
export interface LiveEvent {
  /** Relative timestamp label (e.g. "00:03s"). */
  time: string
  /** ID of the GRC layer that generated this event. */
  layer: string
  /** Human-readable event description. */
  msg: string
  severity: SeverityKey
  /** true = system acted autonomously; false = human was involved. */
  auto: boolean
}

/** Display metadata for a severity key. */
export interface SeverityMeta {
  color: string
  label: string
}

// ─── Evidence Tracker ────────────────────────────────────────────────────────

/** Current evidence collection status for a compliance control. */
export type ControlStatus = 'PASS' | 'FAIL' | 'WARN' | 'COLLECTING'

/** Who is responsible for collecting evidence for this control. */
export type EvidenceOwner = 'AUTO' | 'HUMAN'

/**
 * A single compliance control entry in the Evidence Tracker.
 * Controls span SOC 2, ISO 27001, and NIST 800-53 frameworks.
 */
export interface EvidenceRecord {
  /** Control identifier (e.g. "CC6.1", "A.9.2", "SC-28"). */
  id: string
  /** The compliance framework this control belongs to. */
  framework: 'SOC 2' | 'ISO 27001' | 'NIST 800-53'
  /** Human-readable control name. */
  control: string
  status: ControlStatus
  /** Description of the evidence artefact currently on file. */
  evidence: string
  /** ISO 8601 timestamp of the last evidence collection run. */
  lastChecked: string
  /** ISO date string (YYYY-MM-DD) of the next required collection. */
  nextDue: string
  owner: EvidenceOwner
}

// ─── Vendor Risk Assessment ──────────────────────────────────────────────────

/** Risk severity level used in vendor gap findings. */
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

/** A single control gap identified by the vendor risk AI agent. */
export interface VendorGap {
  /** The control name that is failing (e.g. "MFA on privileged accounts"). */
  control: string
  /** Description of the specific deficiency found. */
  finding: string
  severity: RiskLevel
  /** Specific remediation recommendation for this gap. */
  recommendation: string
}

/**
 * The complete output of the AI vendor risk assessment agent.
 * This is the parsed JSON response from the LLM.
 */
export interface VendorAssessment {
  vendorName: string
  /** 0–100 residual risk score. Higher = more risk. */
  overallRiskScore: number
  riskLevel: RiskLevel
  gaps: VendorGap[]
  strengths: string[]
  /** Pre-drafted professional email to send to the vendor. */
  draftEmail: string
  /** One-line entry for the compliance audit trail log. */
  auditTrailNote: string
}

// ─── OPA Rule Generator ──────────────────────────────────────────────────────

/** A test case for validating a generated OPA Rego rule. */
export interface OPATestCase {
  description: string
  /** Sample input that should trigger this result. */
  input: string
  expectedResult: 'DENY' | 'ALLOW'
}

/**
 * All four code artefacts generated by the OPA Rule Generator AI agent,
 * plus an explanation and test cases.
 */
export interface GeneratedPolicy {
  /** Complete, valid Rego deny block with package declaration. */
  regoRule: string
  /** YAML Semgrep rule for code-level detection. */
  semgrepRule: string
  /** YAML GitHub Actions CI step using conftest. */
  githubActionsStep: string
  /** Terraform / Checkov / Sentinel guardrail. */
  terraformGuardrail: string
  /** 2–3 sentence explanation of what the rule enforces and why. */
  explanation: string
  testCases: OPATestCase[]
}

// ─── Incident Response ───────────────────────────────────────────────────────

/** Incident priority level. P1 = critical, P2 = high, P3 = medium. */
export type IncidentSeverity = 'P1' | 'P2' | 'P3'

/** Current lifecycle status of an incident. */
export type IncidentStatus = 'OPEN' | 'CONTAINED' | 'RESOLVED'

/** A single entry in an incident's automated response timeline. */
export interface IncidentTimelineEntry {
  /** HH:MM:SS timestamp. */
  ts: string
  /** Description of what happened at this step. */
  event: string
  /** true = automation acted; false = human acted. */
  auto: boolean
}

/**
 * A security incident record in the Incident Response Playbook.
 */
export interface Incident {
  /** Unique incident identifier (e.g. "INC-0041"). */
  id: string
  title: string
  severity: IncidentSeverity
  status: IncidentStatus
  /** Description of affected systems and data — blast radius. */
  blastRadius: string
  timeline: IncidentTimelineEntry[]
  /** AI-generated plain-English incident narrative. */
  aiSummary: string
  /** GRC architect's recommended remediation and policy update. */
  recommendation: string
}

/**
 * Output of the AI deep root cause analysis for an incident.
 * Returned as parsed JSON from the LLM.
 */
export interface AIRootCauseAnalysis {
  rootCause: string
  attackVector: string
  /** Ordered list of remediation steps to execute immediately. */
  immediateActions: string[]
  lessonLearned: string
  /** GRC policy weaknesses that this incident surfaced. */
  policyGaps: string[]
  /** Short Rego snippet to add to OPA to prevent recurrence. */
  opaRuleRecommendation: string
  /** Whether this incident should be escalated to executive level. */
  escalationRequired: boolean
  /** Plain-English business impact assessment. */
  estimatedImpact: string
}

// ─── Tab Navigation ──────────────────────────────────────────────────────────

/** All valid tab identifiers for the main navigation. */
export type TabId =
  | 'overview'
  | 'pipeline'
  | 'code'
  | 'vendor'
  | 'opa-gen'
  | 'evidence'
  | 'incident'

/** Tab definition for the navigation bar. */
export interface TabDefinition {
  id: TabId
  label: string
  icon: string
  description: string
}


// ─── Authentication & MFA ────────────────────────────────────────────────────

/**
 * Credentials submitted on the login form (step 1 of 2).
 * These are created by administrators and distributed to authorised
 * staff — there is no self-registration flow.
 */
export interface LoginCredentials {
  email: string
  password: string
}

/**
 * The two supported MFA methods.
 * - 'totp'  — Google Authenticator / Authy app (RFC 6238 time-based OTP)
 * - 'email' — One-time code sent to the user's registered email address
 */
export type MFAMethod = 'totp' | 'email'

/**
 * Payload for verifying a submitted MFA code (step 2 of 2).
 */
export interface MFAVerifyPayload {
  /** The user's email — used to look up their TOTP secret or email code. */
  email: string
  /** The 6-digit code from the authenticator app or email. */
  code: string
  /** Which MFA method is being verified. */
  method: MFAMethod
}

/**
 * Data returned when setting up TOTP for the first time.
 * The QR code is scanned by the user's authenticator app.
 */
export interface TOTPSetupData {
  /** otpauth:// URI — encoded as QR code for the authenticator app. */
  otpauthUrl: string
  /** Base32-encoded secret — shown as backup for manual entry. */
  secret: string
  /** Pre-rendered QR code as a data URL (PNG). */
  qrCodeDataUrl: string
}

/**
 * The authenticated session object available to all server components
 * and API routes via `auth()` from NextAuth v5.
 */
export interface GRCSession {
  user: {
    id: string
    email: string
    name: string
    /** Role controls what the user can approve vs. only view. */
    role: 'admin' | 'analyst' | 'viewer'
  }
  /** Whether the user has completed the MFA step in this session. */
  mfaVerified: boolean
  expires: string
}
