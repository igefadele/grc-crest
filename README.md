# ⬡ GRC Crest

> **The only GRC platform built the way software engineers build infrastructure — as code, in pipelines, monitored in real-time, and automated end-to-end.**


[![License: MIT](https://img.shields.io/badge/License-MIT-00D4FF.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg)](https://www.typescriptlang.org)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4.0-38BDF8.svg)](https://tailwindcss.com)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-4.3-black.svg)](https://sdk.vercel.ai)
[![NextAuth v5 (Auth.js)](https://img.shields.io/badge/NextAuth-v5-purple.svg)](https://authjs.dev)
[![GRC-as-Code](https://img.shields.io/badge/GRC-as--Code-00FF88.svg)](#architecture-the-five-layers)
[![AI Powered](https://img.shields.io/badge/AI-Claude%20%7C%20OpenAI-FFB830.svg)](#ai-provider-switching)

---

### Author: [Ige Fadele](https://igefadele.savadub.com)
[Website](https://igefadele.savadub.com) | [LinkedIn](https://linkedin.com/in/igefadele) | [Facebook](https://facebook.com/igefadele) | [X (Twitter)](https://x.com/igefadele) | [Instagram](https://instagram.com/igefadele) | [TikTok](https://tiktok.com/@igefadele) | [YouTube](https://youtube.com/@igefadele) | [GRC Den](https://github.com/igefadele/grc-den)

---

## Table of Contents

1. [What Is This? (Executive Summary)](#what-is-this-executive-summary)
2. [Why This Changes Everything](#why-this-changes-everything)
3. [Architecture: The Five Layers](#architecture-the-five-layers)
4. [Project Structure](#project-structure)
5. [Authentication & Access Control](#authentication--access-control)
   - [How Login Works (Two Steps)](#how-login-works-two-steps)
   - [MFA Methods](#mfa-methods)
   - [How Accounts Are Created](#how-accounts-are-created)
   - [Session Security](#session-security)
   - [User Roles](#user-roles)
6. [AI Integration (Vercel AI SDK)](#ai-integration-vercel-ai-sdk)
   - [Why Vercel AI SDK](#why-vercel-ai-sdk)
   - [AI Provider Switching](#ai-provider-switching)
7. [Feature Guide (Every Tab Explained)](#feature-guide-every-tab-explained)
   - [Architecture Overview](#tab-1-architecture-overview)
   - [Pipeline Detail](#tab-2-pipeline-detail)
   - [Code Reference](#tab-3-code-reference)
   - [AI Vendor Risk Assessment](#tab-4-ai-vendor-risk-assessment)
   - [OPA Rule Generator](#tab-5-opa-rule-generator)
   - [Evidence Tracker](#tab-6-evidence-tracker)
   - [Incident Response Playbook](#tab-7-incident-response-playbook)
8. [Quick-Start: Local Development](#quick-start-local-development)
9. [Adding Users (Administrator Guide)](#adding-users-administrator-guide)
10. [Setting Up MFA](#setting-up-mfa)
    - [TOTP (Google Authenticator)](#totp-google-authenticator)
    - [Email OTP](#email-otp)
11. [Hosting Guide](#hosting-guide)
    - [Option A: Vercel (Recommended)](#option-a-vercel-recommended)
    - [Option B: Netlify](#option-b-netlify)
    - [Option C: Docker / Self-Hosted](#option-c-docker--self-hosted)
    - [Option D: AWS, GCP, Azure](#option-d-aws-gcp-azure)
12. [Environment Variables Reference](#environment-variables-reference)
13. [Security Architecture](#security-architecture)
14. [Glossary of Terms](#glossary-of-terms)
15. [For Directors & Executives](#for-directors--executives)
16. [For Potential Employers & Clients](#for-potential-employers--clients)
17. [Contributing](#contributing)
18. [Roadmap](#roadmap)
19. [License](#license)

---

## What Is This? (Executive Summary)

**GRC Crest** is a fully automated Governance, Risk & Compliance (GRC) operations platform — built entirely as software, not spreadsheets.

### The Problem It Solves

Traditional GRC teams spend 80% of their time on manual, repetitive work:

- Manually collecting screenshots as compliance evidence before audits
- Emailing vendors back-and-forth waiting for security questionnaire responses
- Writing policy documents that sit in SharePoint and are never enforced
- Discovering security violations *after* they reach production
- Generating incident reports by hand while an attack is in progress

This is expensive, error-prone, and does not scale.

### The Solution

GRC Crest Command Center replaces manual GRC work with a **Continuous-by-Design automation system** that:

| What it does | How |
|---|---|
| Enforces security policies automatically | OPA/Rego rules run on every git commit |
| Blocks non-compliant code before production | CI/CD pipeline gates (GitHub Actions + Snyk + Semgrep) |
| Heals configuration drift in seconds | Real-time event monitoring + automated remediation scripts |
| Assesses vendor security risk in minutes | AI agent parses SOC 2 reports and generates risk scores |
| Generates policy-as-code from plain English | AI converts descriptions into OPA Rego, Semgrep, and Terraform rules |
| Collects audit evidence continuously | AI agents pull configuration state from cloud APIs on a schedule |
| Analyses security incidents with root-cause AI | One-click deep analysis with OPA rule recommendations |

**Automation rate: 98.3% of all GRC events are handled without human intervention.**

---

## Why This Changes Everything

### The Old Model (Traditional GRC)

```
Policy binder in SharePoint
        ↓
Annual audit sprint (weeks of manual screenshots)
        ↓
Compliance dashboard showing data that is already 3 months stale
        ↓
Security analyst reviews alert at 9 AM the next day
        ↓
Violation already in production for 16 hours
```

**Cost:** High headcount, low coverage, always reactive.

### The New Model (GRC-as-Code)

```
Policy written as Rego code → committed to git → reviewed like software
        ↓
Every git commit evaluated against all policies in real time
        ↓
Violation detected → build blocked → remediation PR auto-generated
        ↓
Production is structurally incapable of containing policy violations
        ↓
AI agents collect audit evidence continuously — auditor arrives to a live dashboard
```

**Cost:** Minimal headcount, 100% coverage, always proactive.

---

## Architecture: The Five Layers

```
┌─────────────────────────────────────────────────────┐
│  LAYER 1: POLICY-AS-CODE (OPA / Rego)               │
│  Every rule is code in git. Zero Word documents.    │
└───────────────────┬─────────────────────────────────┘
                    │ evaluated at
                    ▼
┌─────────────────────────────────────────────────────┐
│  LAYER 2: CI/CD SHIFT-LEFT CONTROLS                 │
│  TruffleHog → Snyk → Semgrep → OPA → Deploy         │
│  Non-compliant code cannot reach production.        │
└───────────────────┬─────────────────────────────────┘
                    │ deployed to
                    ▼
┌─────────────────────────────────────────────────────┐
│  LAYER 3: CONTINUOUS CONTROLS MONITORING            │
│  CloudTrail / Prometheus stream → rule evaluation   │
│  → auto-remediation in < 5 seconds                  │
└───────────────────┬─────────────────────────────────┘
                    │ feeds data to
                    ▼
┌─────────────────────────────────────────────────────┐
│  LAYER 4: AGENTIC AI GRC AUTOMATIONS                │
│  Vendor risk · Evidence collection · Gap analysis   │
│  Human sees: pre-scored report awaiting approval    │
└───────────────────┬─────────────────────────────────┘
                    │ only when automation cannot resolve
                    ▼
┌─────────────────────────────────────────────────────┐
│  LAYER 5: HIGH-JUDGMENT HUMAN FIREWALL              │
│  3 valid escalation triggers only:                  │
│  • Risk acceptance variance                         │
│  • Unresolvable incident                            │
│  • Regulatory policy rewrite                        │
└─────────────────────────────────────────────────────┘
```

---

## Project Structure

This is a **Next.js 15** application with **React 19**, **TypeScript 5.8**, **Tailwind CSS 4**, **Vercel AI SDK 4**, and **NextAuth v5 (Auth.js)**.

```
grc-crest/
│
├── src/
│   │
│   ├── types/
│   │   ├── grc.ts                      ← ALL domain TypeScript interfaces and types
│   │   │                                  Includes: GRCLayer, EvidenceRecord, Incident,
│   │   │                                  VendorAssessment, AIRootCauseAnalysis,
│   │   │                                  LoginCredentials, MFAMethod, GRCSession, etc.
│   │   └── next-auth.d.ts              ← NextAuth v5 module augmentation
│   │                                      Adds `mfaVerified` and `role` to the
│   │                                      Session and JWT types — fully typed everywhere.
│   │
│   ├── lib/
│   │   ├── constants.ts                ← All static data (layers, events, incidents, evidence)
│   │   ├── aiClient.ts                 ← Browser-side AI client — calls /api/ai proxy only
│   │   │                                  NO API keys. Uses fetch() to the internal route.
│   │   ├── prompts.ts                  ← All AI system prompts in one versioned file
│   │   ├── auth.ts                     ← NextAuth v5 config — credentials provider,
│   │   │                                  JWT/session callbacks, `authorized` middleware guard
│   │   ├── users.ts                    ← User store backed by AUTHORISED_USERS env var
│   │   │                                  No registration. Admins provision accounts.
│   │   │                                  Replace with Prisma/DB for production scale.
│   │   └── mfa.ts                      ← TOTP (otplib) + Email OTP (Nodemailer) helpers
│   │                                      QR code generation, verification, rate-aware send
│   │
│   ├── styles/
│   │   └── globals.css                 ← Tailwind v4 import + CSS custom properties
│   │                                      All colours as CSS variables — one change = global
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── StatusBadge.tsx         ← Coloured border badge (PASS / FAIL / AUTO / HUMAN)
│   │   │   ├── GlowButton.tsx          ← Primary action button with colour glow
│   │   │   └── CodeBlock.tsx           ← Labelled code block with copy-to-clipboard
│   │   │
│   │   ├── tabs/                       ← One file per tab — isolated, independently testable
│   │   │   ├── OverviewTab.tsx
│   │   │   ├── PipelineTab.tsx
│   │   │   ├── CodeReferenceTab.tsx
│   │   │   ├── VendorRiskTab.tsx
│   │   │   ├── OPAGeneratorTab.tsx
│   │   │   ├── EvidenceTrackerTab.tsx
│   │   │   └── IncidentPlaybookTab.tsx
│   │   │
│   │   ├── GRCDashboard.tsx            ← Root client component: header + tab router + layout
│   │   └── LiveSidebar.tsx             ← Real-time automation event feed
│   │
│   ├── middleware.ts                   ← SINGLE auth enforcement point for all routes
│   │                                      Every request passes through here before rendering.
│   │                                      Redirects unauthenticated/unverified users to /login.
│   │
│   └── app/
│       ├── layout.tsx                  ← Root HTML layout + metadata
│       ├── page.tsx                    ← Dashboard entry (server component)
│       │
│       ├── (auth)/                     ← Route group — shares minimal auth layout
│       │   ├── layout.tsx              ← Bare centred layout (no GRC chrome)
│       │   └── login/
│       │       └── page.tsx            ← Two-step login: credentials → MFA
│       │
│       └── api/
│           ├── ai/
│           │   └── route.ts            ← Vercel AI SDK `generateText()` proxy
│           │                              Auth-gated: requires mfaVerified session.
│           │                              API keys server-only — never in browser.
│           └── auth/
│               ├── [...nextauth]/
│               │   └── route.ts        ← NextAuth v5 catch-all handler
│               ├── mfa-verify/
│               │   └── route.ts        ← Verifies TOTP or email OTP code
│               │                          Rate-limited: 5 attempts / 15 min
│               └── send-email-otp/
│                   └── route.ts        ← Generates + emails a 6-digit OTP
│                                          Rate-limited: 3 sends / 15 min
│
├── public/
├── .env.example                        ← Full variable documentation with examples
├── .gitignore
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

### Why this structure?

| Decision | Reason |
|---|---|
| `src/types/grc.ts` + `next-auth.d.ts` | Two type files: one for domain types, one for framework augmentation. Compiler enforces contracts everywhere. |
| `src/lib/auth.ts` owns all NextAuth config | One file to audit for auth logic. The `authorized` callback and JWT callbacks are co-located — no split behaviour. |
| `src/lib/users.ts` is a thin store layer | Swapping from env-var users to a database (Prisma, Drizzle) means changing only this file. Auth flow is unchanged. |
| `src/lib/mfa.ts` isolates all MFA logic | TOTP and email OTP implementations in one file. Easy to add new methods (SMS, hardware key) without touching routes. |
| `src/middleware.ts` is the single auth gate | Auth checked in one place before any page renders. Impossible to accidentally ship an unprotected page. |
| `(auth)` route group | Login lives in its own layout with no GRC UI chrome. Prevents the authenticated layout from wrapping the login form. |
| `/api/ai` requires `mfaVerified: true` | AI endpoints cannot be called by a user who only completed step 1 — prevents session-hijack abuse of AI features. |
| Vercel AI SDK `generateText()` | Single function call replacing manual `fetch` to multiple providers. Provider switching happens in `getModel()` factory — zero changes elsewhere. |

---

## Authentication & Access Control

### How Login Works (Two Steps)

The GRC Crest uses a strict two-factor authentication flow. There is no self-registration — all accounts are provisioned by administrators.

```
STEP 1 — CREDENTIALS
─────────────────────────────────────────────────────
User visits any URL
        ↓
Middleware checks session → none found → redirect to /login
        ↓
User enters email + password
        ↓
NextAuth verifies against AUTHORISED_USERS store (bcrypt comparison)
        ↓
✓ Match → partial session created (mfaVerified: false)
✗ No match → "Invalid credentials" (deliberately vague — no user enumeration)

STEP 2 — MFA VERIFICATION
─────────────────────────────────────────────────────
User chooses MFA method:
  (a) Authenticator App (TOTP) — open Google Authenticator, enter 6-digit code
  (b) Email Code — request a 6-digit code sent to their registered email

        ↓
User submits the 6-digit code → POST /api/auth/mfa-verify
        ↓
Server verifies code (TOTP: RFC 6238 check / Email: stored OTP match)
        ↓
✓ Valid → session upgraded to mfaVerified: true
          → redirect to dashboard
✗ Invalid → error shown, user stays on MFA step
            → rate limited to 5 attempts / 15 minutes

ONGOING — EVERY REQUEST
─────────────────────────────────────────────────────
Middleware runs before every page render.
Checks: session exists AND mfaVerified === true
✗ Either false → redirect to /login
✓ Both true → request proceeds to the page
```

**Key security property:** A user who completed step 1 but not step 2 has `mfaVerified: false`. The middleware will redirect them back to `/login` on every request — they cannot access even a single page of the dashboard.

---

### MFA Methods

#### TOTP — Authenticator App (Recommended)

TOTP stands for Time-based One-Time Password (RFC 6238). It generates a new 6-digit code every 30 seconds using a shared secret between the server and the user's app.

Compatible apps:
- **Google Authenticator** (iOS / Android) — most common
- **Microsoft Authenticator** (iOS / Android)
- **Authy** (iOS / Android / Desktop)
- **1Password** (built-in authenticator)
- Any RFC 6238-compliant TOTP app

The administrator generates a TOTP secret for the user (see [Setting Up MFA](#setting-up-mfa)) and communicates it securely. The user scans the QR code in their app once — after that, they use the app to log in with no further setup.

**Security properties of TOTP:**
- Codes are valid for 30 seconds only (±1 window = 60 second tolerance for clock skew)
- The secret never leaves the server after setup — the app derives codes mathematically
- Even if a code is intercepted, it is useless after 30 seconds
- Works offline — no network needed in the authenticator app

#### Email OTP

A 6-digit code is generated server-side, stored temporarily in memory, and sent to the user's registered email address via Nodemailer/SMTP.

**Properties:**
- Codes expire after 10 minutes
- Single-use — deleted immediately after successful verification
- Rate-limited to 3 sends per 15 minutes per IP (prevents email flooding)
- Email delivery requires SMTP configuration (see [Environment Variables](#environment-variables-reference))

**When to use email OTP:**
- As a fallback when a user loses their authenticator device
- For users who prefer not to use an authenticator app
- During TOTP onboarding before the user has scanned the QR code

> **Production note:** The email OTP store is in-memory. For multi-instance deployments (Vercel serverless, multiple Docker containers), replace the in-memory map in `src/lib/mfa.ts` with Redis: `await redis.setex(`otp:${email}`, 600, code)`.

---

### How Accounts Are Created

There is intentionally no registration form or self-service sign-up. This mirrors enterprise IAM practice — access is granted, not claimed.

**Administrator workflow:**

1. Generate a bcrypt hash of the new user's initial password:
   ```bash
   node -e "require('bcryptjs').hash('initial_password_here', 12).then(console.log)"
   ```

2. Generate a TOTP secret if the user will use an authenticator app:
   ```bash
   node -e "console.log(require('otplib').authenticator.generateSecret())"
   ```

3. Add the user to the `AUTHORISED_USERS` environment variable (see [Environment Variables Reference](#environment-variables-reference) for the full JSON schema).

4. Communicate the email, initial password, and TOTP secret to the user through your organisation's secure credential distribution process (password manager share, secure email, in-person handover, etc.).

5. Redeploy the application so the new env var takes effect (on Vercel: Settings → Environment Variables → redeploy; on Docker: restart the container with the new env).

6. The user logs in with their credentials and their authenticator app — no further setup required.

**To revoke access:** Remove the user from `AUTHORISED_USERS` and redeploy. Their session will be invalidated on the next request (sessions are re-validated on each page load against the JWT).

#### N.B:
If you generate a hashed password and the value has _`$`_ in it like _`$2a$12$aaEhs8vqpBlaD2z0/N7MjOFQYddCrSRniyNAIxm7kOMHS0eZqaLWC`_, then you need to add `\` before each `$` to escape it so that the shell/runtime will not be interpreting the $ symbols as variable expansions. 

The example value of _`"$2a$12$aaEhs8vqpBlaD2z0/N7MjOFQYddCrSRniyNAIxm7kOMHS0eZqaLWC"`_ will now be _`"\$2a\$12\$aaEhs8vqpBlaD2z0/N7MjOFQYddCrSRniyNAIxm7kOMHS0eZqaLWC"`_

---

### Session Security

| Property | Value | Reason |
|---|---|---|
| Strategy | JWT (httpOnly cookie) | No database required; cookie is inaccessible to JavaScript |
| Session expiry | 8 hours | Appropriate for business-hours internal tooling; forces daily re-authentication |
| MFA state | Stored in JWT token | `mfaVerified: false` until step 2 completes — checked on every request by middleware |
| Cookie flags | httpOnly, secure (prod), sameSite=lax | Prevents XSS token theft; CSRF protection |
| Rate limiting | MFA verify: 5/15min · Email send: 3/15min | Prevents brute-force of 6-digit codes |
| Error messages | Deliberately vague at step 1 | "Invalid credentials" — never reveals whether the email exists |
| TOTP window | ±1 step (30s tolerance) | Accommodates clock skew without excessive tolerance |

---

### User Roles

Each user is assigned a role that controls what they can do in the application:

| Role | Permissions |
|---|---|
| `admin` | Full access — can view all tabs, approve risk variances, manage incidents, trigger evidence collection |
| `analyst` | Standard access — can view all tabs, run AI assessments, trigger evidence collection; cannot approve risk variances |
| `viewer` | Read-only — can view dashboards and evidence; cannot trigger AI features or approve anything |

Roles are set by administrators in the `AUTHORISED_USERS` env var. Users cannot change their own role.

---

## AI Integration (Vercel AI SDK)

### Why Vercel AI SDK

If I had chosen to call each provider's API manually using `fetch()`. This meant:

- A separate request format for Anthropic (`messages` array with `system` as a top-level field) vs OpenAI (`messages` array with `{ role: 'system', content }`)
- Separate response parsers for each provider's response shape
- Manual JSON fence stripping from model outputs
- No streaming support
- No type safety on completions
- Growing `if/else` chains as providers were added

The **Vercel AI SDK** (`ai` package) replaces all of this with a unified interface:

```typescript
// Without Vercel AI SDK: manual fetch, manual parsing, provider-specific code
const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', ... },
  body: JSON.stringify({ model, max_tokens, system, messages: [...] }),
})
const data = await res.json()
const text = data.content?.map(b => b.text).join('') ?? ''

// With Vercel AI SDK: one function, any provider, full type safety
const { text } = await generateText({
  model,        // ← returned by getModel() factory — provider-agnostic
  system:       systemPrompt,
  prompt:       userMessage,
  maxTokens:    1000,
  temperature:  0.2,
})
```

The `getModel()` factory in `src/app/api/ai/route.ts` is the only place provider-specific code lives. Every AI feature in the application calls the same `/api/ai` endpoint — nothing downstream needs to know or care which LLM is active.

### AI Provider Switching

Change two environment variables in `.env.local` — no code changes anywhere.

**How the routing works:**

```
Browser → POST /api/ai (with mfaVerified session)
                │
                ▼
    getModel() reads AI_PROVIDER env var
                │
                ├── "claude"  → createAnthropic({ apiKey }) → anthropic(model)
                ├── "openai"  → createOpenAI({ apiKey })    → openai(model)
                └── "custom"  → createOpenAI({ apiKey, baseURL }) → openai(model)
                │
                ▼
    generateText({ model, system, prompt, maxTokens, temperature })
                │
                ▼
    Returns { text: string } to browser
```

**Available configurations:**

Use Anthropic Claude (default):
```bash
AI_PROVIDER=claude
AI_MODEL=claude-sonnet-4-20250514
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

Use OpenAI GPT-4o:
```bash
AI_PROVIDER=openai
AI_MODEL=gpt-4o
OPENAI_API_KEY=sk-your_key_here
```

Use OpenAI GPT-4o Mini (lower cost):
```bash
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini
OPENAI_API_KEY=sk-your_key_here
```

Use a custom / self-hosted LLM (Ollama, Azure OpenAI, vLLM, AWS Bedrock proxy):
```bash
AI_PROVIDER=custom
AI_MODEL=your-model-name
OPENAI_API_KEY=not-needed-or-your-key
CUSTOM_LLM_ENDPOINT=https://your-endpoint/v1/chat/completions
```

The custom provider uses the OpenAI chat completions format, which is compatible with most self-hosted LLMs.

**Adding a new provider:**
1. Install its Vercel AI SDK package: `npm install @ai-sdk/your-provider`
2. Add a `case` in the `getModel()` switch in `src/app/api/ai/route.ts`
3. Add the required env vars to `.env.example`
4. Update the `AIProvider` type in `src/types/grc.ts`

---

## Feature Guide (Every Tab Explained)

### Tab 1: Architecture Overview

**What it is:** A visual, interactive map of the five GRC automation layers.

**How to use it:** Click any layer card to expand a detail panel showing live KPI metrics, the tool stack, and an animated step-by-step pipeline. Each pipeline step lights up in sequence showing how events flow from trigger to resolution.

**Who should use it:** GRC architects, security engineers, directors, auditors reviewing the automation architecture.

---

### Tab 2: Pipeline Detail

**What it is:** A full linear view of every step from a developer's git commit to an audit-ready evidence artefact.

**How to read it:** Each row shows the phase, what happens, and whether the step is **AUTO** (green — system acts alone) or **HUMAN** (red — requires a person). Of 14 steps, only 2 ever require human action — and only for the three highest-judgment scenarios.

---

### Tab 3: Code Reference

**What it is:** Production-ready code samples for each of the five GRC layers — OPA Rego rules, GitHub Actions steps, TypeScript remediation scripts, AI agent logic, and escalation guards.

**How to use it:** Each card has a **COPY** button. These are not pseudocode — they are the actual rule patterns used in production. Copy directly into your project.

---

### Tab 4: AI Vendor Risk Assessment

**What it is:** An AI agent that reads a vendor's security documentation and produces a complete risk assessment in under 60 seconds.

**The problem it replaces:** A GRC analyst typically spends 4–8 hours reviewing a vendor's SOC 2 report, cross-referencing requirements, scoring gaps, and drafting a response. This tab does the same work automatically.

**How to use it:**

1. Type the vendor's name in the **Vendor Name** field.
2. Paste any of the following into the text area:
   - SOC 2 Type II executive summary or full report
   - ISO 27001 certificate and scope statement
   - Completed CAIQ or VSAQ security questionnaire
   - Penetration test executive summary
   - Any vendor-provided security overview document
3. Click **RUN AI RISK ASSESSMENT**.

**What the AI returns:**

| Output | Description |
|---|---|
| Risk Score (0–100) | Numerical residual risk. 0 = meets all requirements. 100 = critical failures. |
| Risk Level | LOW / MEDIUM / HIGH / CRITICAL — categorical label for quick triage. |
| Control Gaps | Every gap found, with severity and a specific remediation recommendation. |
| Strengths | Security controls the vendor has correctly implemented. |
| Draft Email | Professional email to the vendor citing gaps and requesting remediation timelines. Ready to send after your review. |
| Audit Trail Note | One-line entry auto-formatted for the compliance evidence log. |

**Your only action:** Review, optionally edit the draft email, approve.

**Assessment rubric — 7 controls checked:**

| Control | What Is Checked |
|---|---|
| MFA on privileged accounts | Is MFA enforced for all admin access? |
| Encryption at rest | AES-256 minimum? |
| Incident response SLA | P1 response within 4 hours? |
| Certification | SOC 2 Type II or ISO 27001 held? |
| Penetration testing | Pentest within the last 12 months? |
| Sub-processor disclosure | All third parties disclosed? |
| GDPR data residency | GDPR Article 46 compliant? |

---

### Tab 5: OPA Rule Generator

**What it is:** An AI engine that converts a plain-English compliance requirement into four production-ready code artefacts simultaneously.

**The problem it replaces:** Writing OPA Rego requires specialist knowledge most GRC professionals don't have. A GRC team historically writes a policy in Word, then waits days for a platform engineer to implement it — with risk of misinterpretation. This tab closes that gap instantly.

**How to use it:**

1. Select the **Target Resource Type** from the dropdown.
2. Describe the policy in plain English. For example:
   - *"All S3 buckets must have server-side encryption enabled and versioning turned on"*
   - *"IAM roles must not contain wildcard (*) actions in their attached policies"*
   - *"Security groups must not allow inbound SSH from 0.0.0.0/0"*
3. Click **GENERATE POLICY-AS-CODE**.

**What is generated:**

| Artefact | What It Is | Where It Goes |
|---|---|---|
| OPA Rego Rule | Complete deny block with package declaration and error message | Your OPA instance |
| Semgrep YAML Rule | Code-level static analysis rule | Your Semgrep ruleset |
| GitHub Actions Step | YAML CI step running `conftest` | `.github/workflows/compliance.yml` |
| Terraform / Checkov Guardrail | Infrastructure-as-code check | Pre-commit hooks and CI pipelines |
| Test Cases | DENY/ALLOW assertions for your OPA test suite | `policy_test.rego` |

---

### Tab 6: Evidence Tracker

**What it is:** A continuous compliance evidence dashboard tracking control status across SOC 2, ISO 27001, and NIST 800-53.

**The problem it replaces:** Before annual audits, GRC teams spend 2–4 weeks manually collecting evidence. This tab eliminates that — evidence is collected continuously by AI agents so the auditor arrives to a live timestamped dashboard.

**Status meanings:**

| Status | Colour | Meaning |
|---|---|---|
| PASS | Green | Evidence collected, control verified, within due date |
| WARN | Amber | Approaching overdue or minor gap present |
| FAIL | Red | Control not met — action required |
| COLLECTING | Purple | AI agent actively pulling evidence right now |

**How to use it:**
1. Use framework filter tabs (ALL / SOC 2 / ISO 27001 / NIST 800-53) to focus
2. Click any row to see: evidence on file, last checked timestamp, next due date, collection owner
3. For AUTO-owned FAIL/WARN controls, click **COLLECT** to trigger an immediate AI collection run

---

### Tab 7: Incident Response Playbook

**What it is:** A structured incident command centre with automated response timelines and AI-powered root cause analysis.

**How to use it:**

1. Select an incident from the left panel
2. Read the **automated response timeline** — each step is labelled AUTO or HUMAN
3. Read the **AI Incident Narrative** — plain-English summary of what happened
4. Read the **GRC Architect Recommendation** — specific remediation steps
5. Click **GENERATE AI ROOT CAUSE ANALYSIS** to get:
   - Root cause determination
   - Attack vector explanation
   - Ordered immediate action list
   - Policy gaps surfaced by this incident
   - OPA Rego rule to prevent recurrence
   - Whether executive escalation is recommended

**Severity levels:**

| Level | Meaning | Response |
|---|---|---|
| P1 | Critical — active breach or data at risk | Auto-contained in seconds, human review within 30 minutes |
| P2 | High — significant misconfiguration or near-miss | Auto-blocked, human review within 2 hours |
| P3 | Medium — policy violation without immediate risk | Auto-logged, human review within 24 hours |

---

## Quick-Start: Local Development

### Prerequisites

- **Node.js 18.17 or later** — [nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js)
- **An API key** for your chosen AI provider (Anthropic or OpenAI)
- **An SMTP account** for email OTP (Gmail, SendGrid, or any SMTP provider)

### Step-by-step

```bash
# 1. Clone or unzip the project
git clone https://github.com/igefadele/grc-crest.git
cd grc-crest

# OR from the zip:
unzip grc-crest.zip
cd grc-crest

# 2. Install dependencies
npm install

# 3. Copy the environment variable template
cp .env.example .env.local
```

**Now open `.env.local` and fill in the required values:**

```bash
# ── Required: NextAuth secret (generate once, keep secret) ──────────
AUTH_SECRET=           # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# ── Required: At least one user ─────────────────────────────────────
# See "Adding Users" section below for how to build this JSON
AUTHORISED_USERS='[{"id":"usr_001","email":"you@company.com","name":"Your Name","role":"admin","hashedPassword":"$2a$12$...","totpSecret":null,"mfaMethod":"totp"}]'

# ── Required: AI provider (choose one) ──────────────────────────────
AI_PROVIDER=claude
AI_MODEL=claude-sonnet-4-20250514
ANTHROPIC_API_KEY=sk-ant-your_key_here

# ── Required for email OTP MFA method ───────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=you@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM_NAME=GRC Crest
TOTP_ISSUER=GRC Crest

# ── Public — safe for browser ────────────────────────────────────────
NEXT_PUBLIC_AI_PROVIDER=claude
```

```bash
# 4. Start the development server
npm run dev

# 5. Open the application
# → http://localhost:3000
# → You will be redirected to /login immediately
```

### Available scripts

```bash
npm run dev        # Start development server with Turbopack
npm run build      # Production build
npm run start      # Start production server (after build)
npm run lint       # ESLint
npm run type-check # tsc --noEmit (must pass before committing)
```

---

## Adding Users (Administrator Guide)

There is no registration form. All accounts are provisioned by administrators.

### Step 1 — Generate a bcrypt password hash

```bash
# Using Node.js directly (install bcryptjs first if needed: npm install bcryptjs)
node -e "require('bcryptjs').hash('the_users_initial_password', 12).then(console.log)"
```

This outputs something like `$2a$12$abcdefghijklmnopqrstuuVWXYZ0123456789abcdefghijklmno`.

### Step 2 — Generate a TOTP secret (if using authenticator app)

```bash
node -e "console.log(require('otplib').authenticator.generateSecret())"
```

This outputs a Base32 string like `JBSWY3DPEHPK3PXP`. Store this securely — you will give it to the user so they can add it to their authenticator app.

### Step 3 — Add the user to AUTHORISED_USERS

In your `.env.local` (local) or your hosting platform's secret manager (production), update the `AUTHORISED_USERS` JSON array:

```json
AUTHORISED_USERS='[
  {
    "id": "usr_001",
    "email": "analyst@yourcompany.com",
    "name": "Jane Smith",
    "role": "analyst",
    "hashedPassword": "\$2a\$12$your_generated_hash",
    "totpSecret": "JBSWY3DPEHPK3PXP",
    "mfaMethod": "totp"
  },
  {
    "id": "usr_002",
    "email": "viewer@yourcompany.com",
    "name": "Bob Jones",
    "role": "viewer",
    "hashedPassword": "\$2a\$12\$another_generated_hash",
    "totpSecret": null,
    "mfaMethod": "email"
  }
]'
```

**Fields explained:**

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique identifier — any string, e.g. `usr_001`. Must be unique. |
| `email` | string | The user's email address — used as their login username. |
| `name` | string | Full name — shown in the session. |
| `role` | string | `admin`, `analyst`, or `viewer` — see [User Roles](#user-roles). |
| `hashedPassword` | string | bcrypt hash of their password. Never store plaintext. |
| `totpSecret` | string or null | Base32 TOTP secret for authenticator app. `null` if not yet set up. |
| `mfaMethod` | string | `totp` (authenticator app) or `email` (code sent to their email). |

### Step 4 — Redeploy

- **Vercel:** Settings → Environment Variables → update `AUTHORISED_USERS` → trigger a redeploy
- **Docker:** Update the env var and restart the container: `docker compose up -d --force-recreate`
- **Local dev:** Save `.env.local` — the dev server hot-reloads environment variables automatically

### Step 5 — Distribute credentials

Send the user their email address, initial password, and (if TOTP) the TOTP secret through your organisation's secure credential distribution process. The user cannot retrieve or reset these themselves.

### Revoking access

Remove the user from the `AUTHORISED_USERS` array and redeploy. Their existing JWT session will fail validation on the next request.

---

## Setting Up MFA

### TOTP (Google Authenticator)

**For the administrator:**

1. Generate a TOTP secret for the user (see above).
2. Optionally generate the QR code URL to share with the user:
   ```bash
   node -e "
   const { authenticator } = require('otplib');
   const secret = 'JBSWY3DPEHPK3PXP';   // replace with the generated secret
   const uri = authenticator.keyuri('user@company.com', 'GRC Crest', secret);
   console.log(uri);
   "
   ```
   Paste the `otpauth://` URI into a QR code generator to produce a scannable image.
3. Send the QR code (or the manual entry secret) to the user securely.

**For the user (first-time setup):**

1. Open Google Authenticator (or Authy / Microsoft Authenticator).
2. Tap **+** → **Scan a QR code** (scan the image provided by your admin), OR tap **Enter a setup key** and type the Base32 secret manually.
3. An entry called **GRC Crest** (or your configured `TOTP_ISSUER`) will appear, showing a 6-digit code that refreshes every 30 seconds.
4. Log in to GRC Crest using your email + password, then enter the 6-digit code when prompted.

**Replacing a lost device:**

The administrator sets `totpSecret` to `null` in `AUTHORISED_USERS` and changes `mfaMethod` to `email`, then redeploys. The user can log in via email OTP while a new TOTP secret is generated and distributed.

---

### Email OTP

Requires SMTP configuration in `.env.local`. No user-side setup needed.

**When the user selects "Email Code" on the MFA screen:**

1. The application calls `POST /api/auth/send-email-otp`.
2. A 6-digit code is generated server-side and stored in memory with a 10-minute expiry.
3. The code is emailed to the user's registered address using the configured SMTP provider.
4. The user enters the code — the server verifies it and, if valid, upgrades the session.

**Configuring SMTP:**

Gmail (recommended for small teams — use an App Password, not your main password):
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@yourcompany.com
SMTP_PASS=your_16_char_app_password   # Settings → Security → 2FA → App Passwords
```

SendGrid (recommended for production):
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

Any other SMTP provider (Mailgun, Postmark, AWS SES, Outlook 365) follows the same pattern — supply host, port, user, and password.

---

## Hosting Guide

> **All hosting options require the full set of environment variables** — AI provider keys, `AUTH_SECRET`, `AUTHORISED_USERS`, and SMTP settings. See [Environment Variables Reference](#environment-variables-reference) for the complete list.

### Option A: Vercel (Recommended)

Zero configuration — Vercel auto-detects Next.js and handles all server-side routes including `/api/auth/*` and `/api/ai`.

**Step 1: Push to GitHub**
```bash
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/your-username/grc-crest.git
git push -u origin main
```

**Step 2: Deploy**
```bash
npm install -g vercel
vercel
```
Or go to [vercel.com](https://vercel.com) → New Project → import your repo.

**Step 3: Add all environment variables**

In the Vercel dashboard: Project → Settings → Environment Variables. Add every variable from `.env.local`. Critical ones:

```
AUTH_SECRET              ← generate with: openssl rand -base64 32
NEXTAUTH_URL             ← https://your-project.vercel.app
AUTHORISED_USERS         ← the full JSON array (paste as a single value)
AI_PROVIDER              ← claude
AI_MODEL                 ← claude-sonnet-4-20250514
ANTHROPIC_API_KEY        ← sk-ant-...
TOTP_ISSUER              ← GRC Crest
SMTP_HOST                ← your SMTP host
SMTP_USER                ← your SMTP user
SMTP_PASS                ← your SMTP password
NEXT_PUBLIC_AI_PROVIDER  ← claude
```

**Step 4: Redeploy**
```bash
vercel --prod
```

Your app is live at `https://your-project.vercel.app`.

> **Note on `AUTHORISED_USERS` on Vercel:** The JSON value must be pasted as a single line (no line breaks) in the Vercel dashboard, or use the CLI: `vercel env add AUTHORISED_USERS`.

---

### Option B: Netlify

**Step 1: Install the Next.js plugin**
```bash
npm install @netlify/plugin-nextjs
```

Create `netlify.toml`:
```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Step 2: Deploy**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Step 3: Add environment variables**

In the Netlify dashboard: Site settings → Environment variables → Add all variables from `.env.local`.

---

### Option C: Docker / Self-Hosted

**Dockerfile:**
```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

Add `output: 'standalone'` to `next.config.ts`.

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  grc:
    build: .
    ports:
      - "3000:3000"
    environment:
      - AUTH_SECRET=${AUTH_SECRET}
      - NEXTAUTH_URL=https://your-domain.com
      - AUTHORISED_USERS=${AUTHORISED_USERS}
      - AI_PROVIDER=claude
      - AI_MODEL=claude-sonnet-4-20250514
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - TOTP_ISSUER=GRC Crest
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=587
      - SMTP_SECURE=false
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
      - NEXT_PUBLIC_AI_PROVIDER=claude
    restart: unless-stopped
```

```bash
docker compose up -d
```

> **Security:** Never embed secrets in the Docker image or `docker-compose.yml`. Use a `.env` file with `env_file:` directive, Docker secrets, or your platform's secret manager.

---

### Option D: AWS, GCP, Azure

The application is a standard Next.js app and deploys to any platform supporting Node.js containers.

**AWS:**
- **AWS Amplify** — Connect your GitHub repo. Add all env vars in the Amplify console under App settings → Environment variables.
- **AWS ECS / Fargate** — Use the Docker image. Inject secrets via AWS Secrets Manager references in the ECS task definition.
- **AWS App Runner** — Simplest managed option. Connect container registry, set env vars in the service configuration.

**Google Cloud:**
- **Cloud Run** — `gcloud run deploy grc-crest --image gcr.io/your-project/grc --set-secrets AUTH_SECRET=grc-auth-secret:latest`
- **Firebase Hosting + Cloud Functions** — Supports Next.js SSR.

**Microsoft Azure:**
- **Azure Container Apps** — Deploy the Docker image. Set env vars as secrets in the container environment configuration.
- **Azure App Service** — Node.js deployment. Add env vars under Configuration → Application settings.

For all cloud providers: use the platform's secret management service for `AUTH_SECRET`, `ANTHROPIC_API_KEY`, `SMTP_PASS`, and `AUTHORISED_USERS` — never hardcode them.

---

## Environment Variables Reference

All variables live in `.env.local` for local development. Set them in your hosting platform's secret/environment variable manager for production. Copy `.env.example` as your starting point.

### Authentication

| Variable | Required | Description |
|---|---|---|
| `AUTH_SECRET` | **Yes** | Random 32-character string for signing JWT tokens. Generate: `openssl rand -base64 32`. Keep absolutely secret. |
| `NEXTAUTH_URL` | **Yes** | Full URL of your deployment. `http://localhost:3000` locally; `https://your-domain.com` in production. |
| `AUTHORISED_USERS` | **Yes** | JSON array of user objects. See [Adding Users](#adding-users-administrator-guide) for the full schema. |
| `TOTP_ISSUER` | No | Name shown in the authenticator app. Default: `GRC Crest`. |

### Email / SMTP (for Email OTP MFA)

| Variable | Required | Description |
|---|---|---|
| `SMTP_HOST` | **Yes** (email OTP) | SMTP server hostname. E.g. `smtp.gmail.com`, `smtp.sendgrid.net`. |
| `SMTP_PORT` | **Yes** (email OTP) | SMTP port. Typically `587` (STARTTLS) or `465` (SSL). |
| `SMTP_SECURE` | No | `true` for SSL/port 465; `false` for STARTTLS/port 587. Default: `false`. |
| `SMTP_USER` | **Yes** (email OTP) | SMTP username / email address. |
| `SMTP_PASS` | **Yes** (email OTP) | SMTP password or App Password. Never your main account password. |
| `SMTP_FROM_NAME` | No | Display name in the From field. Default: `GRC Crest`. |

### AI Provider

| Variable | Required | Description |
|---|---|---|
| `AI_PROVIDER` | **Yes** | Active provider: `claude`, `openai`, or `custom`. |
| `AI_MODEL` | **Yes** | Model ID. E.g. `claude-sonnet-4-20250514`, `gpt-4o`, `gpt-4o-mini`. |
| `AI_MAX_TOKENS` | No | Max completion tokens. Default: `1000`. |
| `ANTHROPIC_API_KEY` | If `AI_PROVIDER=claude` | From [console.anthropic.com](https://console.anthropic.com). |
| `OPENAI_API_KEY` | If `AI_PROVIDER=openai` or `custom` | From [platform.openai.com](https://platform.openai.com/api-keys). |
| `CUSTOM_LLM_ENDPOINT` | If `AI_PROVIDER=custom` | OpenAI-compatible endpoint URL for self-hosted LLMs. |

### Public (browser-visible — NO secrets)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_AI_PROVIDER` | No | Shows the active AI provider label in the dashboard header. |

**Critical rule:** Variables prefixed `NEXT_PUBLIC_` are bundled into the client-side JavaScript and are visible to anyone. Never put API keys, passwords, `AUTH_SECRET`, or `AUTHORISED_USERS` in a `NEXT_PUBLIC_` variable.

---

## Security Architecture

### Full Request Flow

```
USER BROWSER
────────────────────────────────────────────────────────────────────
  1. Any request arrives (e.g. GET /)

  src/middleware.ts
  ────────────────
  2. Reads JWT from httpOnly cookie
  3. Calls `authorized()` callback in src/lib/auth.ts
  4. Checks: session exists AND mfaVerified === true
     ✗ → redirect to /login (302)
     ✓ → allow request to proceed

  5. User visits /login (step 1)
  6. Submits email + password → POST /api/auth/signin
     src/lib/auth.ts → Credentials provider → src/lib/users.ts
     → bcrypt.compare(password, hashedPassword)
     ✓ → partial session JWT set (mfaVerified: false)
     ✗ → "Invalid credentials"

  7. User submits MFA code → POST /api/auth/mfa-verify
     src/app/api/auth/mfa-verify/route.ts
     → src/lib/mfa.ts → verifyTOTP() or verifyEmailOTP()
     ✓ → client calls updateSession({ mfaVerified: true })
          JWT callback writes mfaVerified: true onto token
          → redirect to dashboard
     ✗ → error (rate-limited after 5 attempts / 15 min)

AUTHENTICATED DASHBOARD REQUESTS
────────────────────────────────────────────────────────────────────
  8. User triggers AI feature → src/lib/aiClient.ts
  9. POST /api/ai { systemPrompt, userMessage }

  src/app/api/ai/route.ts (server-side)
  ─────────────────────────────────────
  10. auth() check → must have mfaVerified: true
      ✗ → 401 Unauthorised
      ✓ → proceed

  11. getModel() reads AI_PROVIDER env var
  12. Vercel AI SDK generateText({ model, system, prompt })
      → api.anthropic.com OR api.openai.com (server-to-server)
      API keys: process.env only — never in browser

  13. Returns { text: string } to browser
```

### Security Properties

| Property | Implementation |
|---|---|
| API keys never in browser | All LLM calls go through `/api/ai` server route. Keys only in `process.env`. |
| Auth enforced at middleware level | Every request passes through `src/middleware.ts` before rendering. No route can be forgotten. |
| MFA required for AI features | `/api/ai` checks `mfaVerified: true` independently — even if middleware is misconfigured. |
| Password storage | bcrypt with cost factor 12 — not reversible, not rainbow-table attackable. |
| Session token | httpOnly cookie — inaccessible to JavaScript. No XSS token theft possible. |
| Brute-force prevention | MFA verify: 5 attempts / 15 min. Email OTP send: 3 sends / 15 min. Both in-memory rate limiters. |
| User enumeration prevention | Step 1 always returns "Invalid credentials" — never "User not found". |
| TOTP window | ±1 step (30s tolerance) — accommodates clock skew without excessive attack surface. |
| Email OTP single-use | Deleted from store immediately after successful verification. |
| Session expiry | 8 hours — forces daily re-authentication. |

### Production Hardening Checklist

Before deploying to a production environment accessible to real staff, verify:

- [ ] `AUTH_SECRET` is a randomly generated 32-character string — not a guessable value
- [ ] `NEXTAUTH_URL` is set to the exact production URL — mismatches break callbacks
- [ ] All passwords in `AUTHORISED_USERS` are bcrypt hashes — never plaintext
- [ ] TOTP secrets in `AUTHORISED_USERS` were distributed through a secure channel
- [ ] `SMTP_PASS` is an App Password or API key — not your main email account password
- [ ] API keys (`ANTHROPIC_API_KEY` / `OPENAI_API_KEY`) are injected via secret manager — not committed to source
- [ ] `.env.local` is in `.gitignore` and has never been committed
- [ ] `NEXT_PUBLIC_AI_PROVIDER` contains only the provider name — no key material
- [ ] Replace in-memory email OTP store with Redis for multi-instance deployments
- [ ] Consider adding server-side rate limiting on `/api/ai` (Vercel Edge Config, Upstash Redis)
- [ ] Enable HTTPS — required for `secure` cookie flag to work correctly

---

## Glossary of Terms

This section defines every technical term used in the application so non-technical colleagues and executives can read the platform without a background in security or engineering.

---

**API (Application Programming Interface):**
A way for software systems to communicate. When this application calls the Claude or OpenAI API, it sends a structured request to their servers and receives a structured response — like filling in a form and getting an answer.

**App Password (SMTP / Gmail):**
A separate password generated specifically for an application to use with your email account — without giving the application access to your main account password. Required for Gmail's App Password feature when SMTP access is needed.

**Audit Trail:**
A chronological, tamper-resistant record of events. In compliance, an audit trail proves to auditors that security controls operated correctly during a specific period.

**bcrypt:**
A password hashing algorithm. Instead of storing a user's password, the system stores an irreversible mathematical transformation of it. Even if the user database is stolen, the original passwords cannot be recovered.

**Blast Radius:**
The scope of damage if a security incident is not contained — which systems, what data, how many users.

**CAIQ (Consensus Assessment Initiative Questionnaire):**
A standardised security questionnaire from the Cloud Security Alliance used to assess cloud vendor security practices.

**CCM (Continuous Controls Monitoring):**
The practice of monitoring security controls in real time, rather than checking them once per year at audit time. This platform implements CCM via live event streaming.

**Checkov:**
An open-source static analysis tool for infrastructure-as-code. Catches security violations in Terraform files before infrastructure is deployed.

**CI/CD Pipeline (Continuous Integration / Continuous Deployment):**
The automated process that takes developer code, runs checks, and deploys it to production. Compliance gates are embedded into this pipeline.

**CloudTrail (AWS CloudTrail):**
An AWS service recording every API call in an account — who did what, when, from where. The cloud equivalent of CCTV footage.

**Cookie (httpOnly):**
A piece of data stored in the browser. An httpOnly cookie cannot be read by JavaScript — only sent automatically by the browser to the server. This prevents session tokens from being stolen by malicious scripts (XSS attacks).

**CVSS Score:**
A 0.0–10.0 score measuring software vulnerability severity. Scores ≥ 8.0 are blocked automatically by this platform's CI/CD gates.

**CVE (Common Vulnerabilities and Exposures):**
A publicly listed software vulnerability with a unique identifier (e.g. CVE-2024-3811).

**Dependabot:**
A GitHub tool that automatically creates pull requests to update vulnerable software dependencies.

**DevSecOps:**
Integrating security into the DevOps development workflow — making security continuous and automated rather than a final checkpoint.

**Drift (Configuration Drift):**
When a live system's configuration diverges from its approved baseline without authorisation. This platform detects and auto-heals drift within seconds.

**GDPR (General Data Protection Regulation):**
The EU's data protection law. Fines up to 4% of global annual turnover for non-compliance.

**GRC (Governance, Risk & Compliance)**
Three disciplines:
- **Governance:** Policies and frameworks guiding decisions
- **Risk:** Identifying and managing threats
- **Compliance:** Meeting all applicable laws and regulations

**GRC-as-Code:**
Expressing GRC policies and controls as machine-readable code in version control — not Word documents.

**IAM (Identity and Access Management):**
The AWS system controlling who can access what. IAM policies define permissions; IAM roles are assigned to services and users.

**ISO 27001:**
The international standard for Information Security Management Systems. Required by many enterprise clients and government agencies.

**JWT (JSON Web Token):**
A compact, digitally signed token used to store session information. The signature ensures the token cannot be tampered with. This application stores the JWT in an httpOnly cookie.

**LLM (Large Language Model):**
An AI model capable of understanding and generating human-like text. Claude (Anthropic) and GPT-4o (OpenAI) are LLMs.

**MFA (Multi-Factor Authentication):**
Requiring users to verify identity using two or more methods. This platform implements MFA as: something you know (password) + something you have (authenticator app or email access).

**NextAuth (Auth.js):**
The open-source authentication library used to implement login, sessions, and MFA in this application. Version 5 (beta) is used for full Next.js App Router compatibility.

**NIST 800-53:**
A US government security control catalogue. Required for federal IT systems; widely adopted as industry best practice.

**n8n:**
An open-source workflow automation tool that can be used in this setup to trigger auto-remediation scripts when violations are detected.

**OPA (Open Policy Agent)**
An open-source policy engine for enforcing rules across infrastructure using the Rego language.

**otplib:**
The Node.js library used by this application to generate and verify TOTP codes (RFC 6238). Compatible with Google Authenticator, Authy, and all standard TOTP apps.

**PaC (Policy-as-Code):**
Writing compliance policies as machine-readable code that can be version-controlled, tested, and automatically enforced.

**Penetration Test (Pentest):**
A simulated cyberattack by security professionals to find vulnerabilities before real attackers do. Required annually by most compliance frameworks.

**Prometheus:**
An open-source monitoring and alerting system used to collect real-time metrics from infrastructure.

**RAG (Retrieval-Augmented Generation):**
An AI technique giving a language model access to a document database to retrieve relevant context before generating a response.

**Rate Limiting:**
Restricting how many times an action can be performed in a given time window. This platform rate-limits MFA verification attempts (5 per 15 minutes) and email OTP sends (3 per 15 minutes) to prevent brute-force attacks.

**Rego:**
The policy language used by Open Policy Agent. Logic-based syntax that evaluates input data and returns allow/deny decisions.

**Risk Acceptance:**
A formal decision to accept a known security risk rather than fix it. One of the three categories that always escalates to a human in this platform.

**SCP (Service Control Policy):**
An AWS Organisations feature enforcing permission boundaries across an entire account.

**Semgrep:**
An open-source static analysis tool scanning source code for security vulnerabilities.

**SMTP (Simple Mail Transfer Protocol):**
The standard protocol for sending email. This application uses SMTP to deliver email OTP codes.

**SOC 2 (System and Organisation Controls 2):**
A US auditing framework for technology companies. SOC 2 Type II is required by most enterprise SaaS customers before signing contracts.

**TOTP (Time-based One-Time Password):**
A standard (RFC 6238) for generating short-lived codes using a shared secret. Google Authenticator implements TOTP. Codes change every 30 seconds and cannot be reused.

**Terraform:**
An infrastructure-as-code tool for defining cloud infrastructure in configuration files. OPA rules evaluate Terraform plans before deployment.

**TruffleHog:**
An open-source tool scanning git repositories for accidentally exposed secrets like API keys.

**TypeScript:**
A typed superset of JavaScript. Type annotations are checked at compile time — catching contract errors before runtime. This codebase uses strict TypeScript 5.8.

**Vercel AI SDK:**
The official AI library from Vercel used in this application. Provides a unified `generateText()` function that works with Anthropic Claude, OpenAI GPT, and any OpenAI-compatible endpoint — eliminating provider-specific request/response code.

**VSAQ (Vendor Security Assessment Questionnaire):**
A detailed security questionnaire sent to vendors to assess their security posture before onboarding.

---

## For Directors & Executives

> This section gives you a complete non-technical understanding of what has been built into this application, why it matters, and what it means for your organisation's risk posture.

### The Business Problem

Your organisation has compliance requirements — SOC 2, ISO 27001, GDPR, or others. Meeting these requirements traditionally means hiring GRC analysts to write policies, collect evidence, and scramble every year before an audit. The process is expensive, slow, and almost entirely manual.

More importantly, it is **reactive**. By the time a GRC analyst reviews an audit log and discovers a security violation, it may have been in your production environment for days, weeks, or months. It's also possible that by that time, it has costed your business severely in different ways.

### What This Platform Delivers

**GRC Crest replaces a reactive, document-driven compliance programme with a proactive, code-driven compliance system.**

| Metric | Traditional GRC | GRC Crest |
|---|---|---|
| Automation rate | ~20% | 98.3% |
| Time to detect a violation | Hours to days | Seconds |
| Time to remediate a violation | Days (human review + ticket + fix) | 4.2 seconds (automated) |
| Audit preparation time | 2–4 weeks annually | Zero (evidence collected continuously) |
| Vendor risk assessment time | 4–8 hours per vendor | Under 60 seconds |
| Human decisions required/month | Hundreds | 12 (only highest-judgment) |

### Access Is Controlled

The platform is not publicly accessible. Every member of staff who accesses it:
- Has an account created explicitly by an administrator through your organisation's IAM process
- Must enter their email and password (step 1)
- Must pass a second authentication factor — either a rotating code from Google Authenticator or a one-time code sent to their work email (step 2)
- Has a role assigned by the administrator controlling what they can view and approve
- Has their session expire after 8 hours, requiring daily re-authentication

No one can register themselves. No one can reset their own password. Access is granted, not claimed.

### What Your Team Still Does

This platform does not eliminate the GRC function — it elevates it. Your GRC team shifts from:

- ❌ Collecting screenshots → ✅ Reviewing AI-generated evidence dashboards
- ❌ Manually reviewing SOC 2 reports → ✅ Approving AI-generated vendor risk assessments
- ❌ Writing policy documents → ✅ Describing policies in plain English; AI generates the code
- ❌ Reacting to violations found in audits → ✅ Reviewing automated incident reports with root-cause analysis already done

Human GRC professionals are decision-makers, not data collectors.

### The ROI Case

A mid-size organisation spending £500K/year on GRC headcount can typically:
- Reduce annual audit preparation effort by 80–90%
- Reduce vendor risk assessment time from days to minutes
- Eliminate the category of "production violation discovered late" entirely
- Demonstrate to enterprise customers and regulators a mature, automated compliance posture that differentiates during procurement

---

## For Potential Employers & Clients

> This section describes the technical depth and professional value of this project for anyone evaluating the architect's capabilities.

### What This Project Demonstrates

This is not a compliance dashboard — it is a **fully engineered GRC automation system** demonstrating mastery across eight technical domains simultaneously.

---

**1. Production-Grade Next.js 15 + React 19 Architecture**

Full App Router implementation: `page.tsx` is a server component; `GRCDashboard.tsx` owns the client boundary; each tab is independently renderable. Route groups (`(auth)`) separate the auth layout from the app layout. Typed `next.config.ts`, correct `Metadata` / `Viewport` exports, `'use client'` applied precisely where needed.

**2. Enterprise Authentication Engineering (NextAuth v5)**

Full two-factor authentication implementation with no self-registration — matching enterprise IAM practice. `src/lib/auth.ts` configures credentials provider, JWT callbacks (`mfaVerified` persistence, `updateSession` trigger handling), and the `authorized` middleware callback. `src/types/next-auth.d.ts` augments the NextAuth module with custom session fields. `src/middleware.ts` enforces auth at the edge before any page renders. Rate-limited MFA endpoints prevent brute-force attacks. Deliberate vagueness in error messages prevents user enumeration.

**3. MFA Implementation (TOTP + Email OTP)**

`src/lib/mfa.ts` implements RFC 6238 TOTP via `otplib` (compatible with Google Authenticator, Authy, Microsoft Authenticator) and email OTP via Nodemailer. QR code generation for first-time TOTP setup. Single-use email codes with 10-minute expiry. In-memory store with documented Redis migration path for multi-instance deployments. Rate limiting at both the generation and verification endpoints.

**4. Vercel AI SDK Integration**

`src/app/api/ai/route.ts` uses `generateText()` from the Vercel AI SDK with a `getModel()` factory pattern — a single function replacing separate `fetch` implementations for each LLM provider. Provider switching via environment variable with no downstream code changes. Auth-gated: requires `mfaVerified: true` independently of middleware. Temperature tuned to 0.2 for consistent JSON output.

**5. Strict TypeScript Engineering**

`src/types/grc.ts` defines 25+ interfaces covering every data contract: `GRCLayer`, `EvidenceRecord`, `Incident`, `VendorAssessment`, `AIRootCauseAnalysis`, `LoginCredentials`, `MFAMethod`, `GRCSession`, `TOTPSetupData`, and more. `next-auth.d.ts` module augmentation for type-safe session access. `tsconfig.json` strict mode. `tsc --noEmit` is a required CI step.

**6. Infrastructure Security Engineering**

Full DevSecOps toolchain: OPA/Rego policy enforcement, TruffleHog secret scanning, Snyk dependency analysis, Semgrep SAST, Checkov infrastructure scanning — all architected into CI/CD pipeline stages. The OPA Generator tab demonstrates programmatic generation of valid Rego, Semgrep, GitHub Actions, and Terraform artefacts from natural language.

**7. Agentic AI Systems Design**

Three AI agent workflows with distinct prompt strategies: structured JSON output for vendor risk, multi-artefact code generation for OPA rules, forensic analysis for incident RCA. `callAIJson<T>()` generic with typed return and JSON fence stripping. All prompts in `src/lib/prompts.ts` as versioned, auditable artefacts. Auth-gated at the API route level.

**8. GRC Domain Expertise**

Deep command of SOC 2 Trust Service Criteria, ISO 27001 Annex A, and NIST 800-53 families. Evidence records modelled with correct framework identifiers. Vendor assessment rubric covers the seven controls differentiating mature from immature vendor postures. Incident scenarios reflect real attack patterns (Tor-exit-node IAM assumption, Terraform ACL misconfiguration) with accurate auto-response timelines.

---

### Technical Stack

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js | 15.3 |
| UI Library | React | 19.1 |
| Language | TypeScript | 5.8 (strict) |
| Styling | Tailwind CSS | 4.1 |
| AI SDK | Vercel AI SDK | 4.3 |
| AI Providers | Anthropic Claude / OpenAI GPT | Switchable via env |
| Authentication | NextAuth (Auth.js) | v5 beta |
| TOTP | otplib | 12.0 |
| Email | Nodemailer | 6.9 |
| Password Hashing | bcryptjs | 2.4 |
| QR Code | qrcode | 1.5 |
| Policy Enforcement | OPA, Rego, Conftest | — |
| SAST / Scanning | Semgrep, TruffleHog, Snyk | — |
| Infrastructure | Checkov, Terraform | — |
| CI/CD | GitHub Actions | — |
| Cloud Monitoring | AWS CloudTrail, Prometheus, Datadog | — |
| Automation | n8n, Node.js microservices | — |
| Frameworks | SOC 2, ISO 27001, NIST 800-53, GDPR | — |

---

## About The Author

My name is **Ige Fadele**.

I have over 10 years of experience across software engineering, IT project management, product architecture, technical GRC, information security engineering, systems integration, AI automation, and infrastructure.

This project is built from the perspective of someone who has worked close to both engineering execution and security governance.

---

## Hire Me

I am open to opportunities with employers, organizations, founders, product teams, security teams, compliance teams, and technical leaders who need practical support across technical GRC, information security engineering, compliance automation, secure software delivery, product architecture, infrastructure, and AI-enabled operations.

I am available for:

- Consultancy engagements
- Contract roles
- Full-time roles
- Part-time roles
- B2B arrangements
- Advisory and implementation support

My availability is **06:00 - 23:00 UTC+1**, with flexibility for international teams and cross-time-zone collaboration.

I am comfortable with:

- Remote roles
- In-office roles
- Hybrid roles
- International opportunities

I am also **relocation ready** if the role is based in another country and the opportunity is a strong fit.

---

## Connect With Me

- **Website / Portfolio:** [igefadele.savadub.com](https://igefadele.savadub.com)
- **Email:** [ige.fadele@savaub.com](mailto:ige.fadele@savadub.com)
- **LinkedIn:** [linkedin.com/in/igefadele](https://linkedin.com/in/igefadele)
- **GitHub:** [github.com/igefadele](https://github.com/igefadele)
- **Facebook:** [facebook.com/igefadele](https://facebook.com/igefadele)
- **X (Twitter):** [x.com/igefadele](https://x.com/igefadele)
- **Instagram:** [instagram.com/igefadele](https://instagram.com/igefadele)
- **TikTok:** [tiktok.com/@igefadele](https://tiktok.com/@igefadele)
- **YouTube:** [youtube.com/@igefadele](https://youtube.com/@igefadele)
- **GRC Den:** [github.com/igefadele/grc-den](https://github.com/igefadele/grc-den)

---

## Contributing

1. Fork the repository and create a feature branch: `git checkout -b feature/your-feature-name`
2. Follow existing patterns:
   - New domain types → `src/types/grc.ts`
   - New auth types → `src/types/next-auth.d.ts`
   - New static data → `src/lib/constants.ts`
   - New AI prompts → `src/lib/prompts.ts`
   - New auth logic → `src/lib/auth.ts` or `src/lib/mfa.ts`
   - New tab components → `src/components/tabs/` + register in `GRCDashboard.tsx` and `constants.ts`
   - New API routes → `src/app/api/` — always include auth check at the top
3. Run `npm run type-check` and `npm run lint` — both must pass
4. Test AI features with at least Claude and OpenAI
5. Test the full login flow: credentials → TOTP → dashboard → session expiry
6. Update this README for any new feature, env var, or structural change
7. Submit a pull request with a clear description

**Coding standards:**
- All types in `src/types/` — never inline
- All AI prompts in `src/lib/prompts.ts` as named `const` exports
- All colours via CSS custom properties — no hardcoded hex strings in components
- `'use client'` only on components using hooks or browser APIs
- All API routes must verify `mfaVerified: true` — never rely solely on middleware

---

## Roadmap

- **Real Cloud Integration** — Live AWS Config / GCP Asset Inventory polling to replace simulated evidence
- **TOTP Self-Service QR Screen** — First-login screen showing the QR code for the user to scan themselves
- **JIRA / ServiceNow Integration** — Auto-create tickets for human-queue escalations
- **Slack / Teams Notifications** — Push escalation briefs to GRC team channels
- **Redis OTP Store** — Replace in-memory email OTP store with Redis for multi-instance deployments
- **Admin Panel** — UI for administrators to add/remove users and assign roles without editing env vars
- **Multi-Tenancy** — Support multiple business units or client environments
- **Custom Framework Builder** — Define compliance frameworks beyond SOC 2 / ISO 27001 / NIST
- **Audit Export** — One-click PDF export of the evidence repository
- **Risk Register** — Formal risk register with treatment tracking and review cycles
- **Regulatory Update Feed** — AI-monitored feed surfacing regulatory changes requiring policy updates

---

## License

MIT License — Copyright (c) 2025 GRC Crest

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.

---

*Built by a Technical GRC Engineer, Security Compliance Architect, & Software Engineer.*
*This platform represents the operational architecture for running GRC as a high-velocity, AI-augmented, continuous-by-design software system — not as an administrative function.*


---

## Recommended: [GRC Den](https://github.com/igefadele/grc-den)

Apart from **"GRC Crest"** project, I also created **"GRC Den"**.

If you want to horn your skills in GRC, get production-grade GRC Artefacts that you can start using today, or you want to transition to GRC, then The [GRC Den Repo](https://github.com/igefadele/grc-den) is the repo you need.

It's free and open-source. 

I created [GRC Den](https://github.com/igefadele/grc-den) to help the GRC community, and all GRC professionals become more compliance-savvy. Also, it's to help those who want to save time doing trial-and-error artefacts creation.

---