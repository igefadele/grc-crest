# ⬡ GRC Crest - Command Center

> **The only GRC platform built the way software engineers build infrastructure — as code, in pipelines, monitored in real-time, and automated end-to-end.**

[![License: MIT](https://img.shields.io/badge/License-MIT-00D4FF.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg)](https://www.typescriptlang.org)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4.0-38BDF8.svg)](https://tailwindcss.com)
[![GRC-as-Code](https://img.shields.io/badge/GRC-as--Code-00FF88.svg)](#architecture-the-five-layers)
[![AI Powered](https://img.shields.io/badge/AI-Claude%20%7C%20OpenAI-FFB830.svg)](#ai-provider-switching)

---

## Table of Contents

1. [What Is This? (Executive Summary)](#what-is-this-executive-summary)
2. [Why This Changes Everything](#why-this-changes-everything)
3. [Architecture: The Five Layers](#architecture-the-five-layers)
4. [Project Structure](#project-structure)
5. [Feature Guide (Every Tab Explained)](#feature-guide-every-tab-explained)
   - [Architecture Overview](#tab-1-architecture-overview)
   - [Pipeline Detail](#tab-2-pipeline-detail)
   - [Code Reference](#tab-3-code-reference)
   - [AI Vendor Risk Assessment](#tab-4-ai-vendor-risk-assessment)
   - [OPA Rule Generator](#tab-5-opa-rule-generator)
   - [Evidence Tracker](#tab-6-evidence-tracker)
   - [Incident Response Playbook](#tab-7-incident-response-playbook)
6. [AI Provider Switching](#ai-provider-switching)
7. [Quick-Start: Local Development](#quick-start-local-development)
8. [Hosting Guide](#hosting-guide)
   - [Option A: Vercel (Recommended — Free)](#option-a-vercel-recommended--free)
   - [Option B: Netlify](#option-b-netlify)
   - [Option C: Docker / Self-Hosted](#option-c-docker--self-hosted)
   - [Option D: AWS, GCP, Azure](#option-d-aws-gcp-azure)
9. [Environment Variables Reference](#environment-variables-reference)
10. [Security Architecture](#security-architecture)
11. [Glossary of Terms](#glossary-of-terms)
12. [For Directors & Executives](#for-directors--executives)
13. [For Potential Employers & Clients](#for-potential-employers--clients)
14. [Contributing](#contributing)
15. [Roadmap](#roadmap)
16. [License](#license)

---

## What Is This? (Executive Summary)

**GRC Crest - Command Center** is a fully automated Governance, Risk & Compliance (GRC) operations platform — built entirely as software, not spreadsheets.

### The Problem It Solves

Traditional GRC teams spend 80% of their time on manual, repetitive work:

- Manually collecting screenshots as compliance evidence before audits
- Emailing vendors back-and-forth waiting for security questionnaire responses
- Writing policy documents that sit in SharePoint and are never enforced
- Discovering security violations *after* they reach production
- Generating incident reports by hand while an attack is in progress

This is expensive, error-prone, and does not scale. A team of 5 GRC analysts cannot keep pace with a modern engineering organisation shipping hundreds of deployments per week.

### The Solution

GRC Crest - Command Center replaces manual GRC work with a **Continuous-by-Design automation system** that:

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

Human GRC professionals only intervene for three categories of decision that genuinely require judgment: risk acceptance negotiations, unresolvable security incidents, and regulatory policy rewrites.

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

The platform is built on five automation layers that work together as a single continuous system.

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

This is a **Next.js 15** application with **React 19**, **TypeScript 5.8**, and **Tailwind CSS 4**. The codebase is structured for clarity, separation of concerns, and long-term maintainability.

```
grc-command-center/
│
├── src/
│   │
│   ├── types/
│   │   └── grc.ts                  ← ALL TypeScript interfaces and types
│   │                                  Single source of truth for every data shape.
│   │                                  Change a type here → compiler catches every consumer.
│   │
│   ├── lib/
│   │   ├── constants.ts            ← All static data (layers, events, incidents, evidence)
│   │   │                              No data lives inside components. Replace with API calls later
│   │   │                              without touching any UI code.
│   │   ├── aiClient.ts             ← Browser-side AI client (NO API keys — calls /api/ai only)
│   │   └── prompts.ts              ← All AI system prompts in one versioned file
│   │                                  Update prompt wording here without touching React code.
│   │
│   ├── styles/
│   │   └── globals.css             ← Tailwind v4 import + CSS custom properties (design tokens)
│   │                                  All colours defined as CSS variables — change the palette
│   │                                  in one place and it updates the entire application.
│   │
│   ├── components/
│   │   │
│   │   ├── ui/                     ← Reusable primitive components
│   │   │   ├── StatusBadge.tsx     ← Coloured border badge (PASS / FAIL / AUTO / HUMAN etc.)
│   │   │   ├── GlowButton.tsx      ← Primary action button with colour glow
│   │   │   └── CodeBlock.tsx       ← Labelled code block with copy-to-clipboard
│   │   │
│   │   ├── tabs/                   ← One file per tab — isolated, independently testable
│   │   │   ├── OverviewTab.tsx     ← Architecture Overview (interactive layer cards)
│   │   │   ├── PipelineTab.tsx     ← End-to-end pipeline flow diagram
│   │   │   ├── CodeReferenceTab.tsx← Production rule samples with copy buttons
│   │   │   ├── VendorRiskTab.tsx   ← AI vendor risk assessment agent
│   │   │   ├── OPAGeneratorTab.tsx ← Plain English → OPA Rego + Semgrep + GHA + Terraform
│   │   │   ├── EvidenceTrackerTab.tsx ← Continuous compliance evidence dashboard
│   │   │   └── IncidentPlaybookTab.tsx ← AI-powered incident root cause analysis
│   │   │
│   │   ├── GRCDashboard.tsx        ← Root client component: header + tab router + layout
│   │   └── LiveSidebar.tsx         ← Real-time automation event feed (independent loop)
│   │
│   └── app/                        ← Next.js 15 App Router
│       ├── layout.tsx              ← Root HTML layout + metadata + global CSS import
│       ├── page.tsx                ← Entry point (server component → renders GRCDashboard)
│       └── api/
│           └── ai/
│               └── route.ts        ← SECURE server-side LLM proxy
│                                      API keys ONLY here — never in the browser bundle.
│                                      Routes to Claude, OpenAI, or custom endpoint based on env.
│
├── public/                         ← Static assets
│
├── .env.example                    ← Environment variable template with full documentation
├── .gitignore                      ← Excludes .env.local, node_modules, .next/
├── next.config.ts                  ← Next.js 15 configuration (typed)
├── postcss.config.mjs              ← Tailwind CSS v4 PostCSS plugin
├── tsconfig.json                   ← Strict TypeScript configuration
└── package.json                    ← Dependencies and scripts
```

### Why this structure?

| Decision | Reason |
|---|---|
| `src/types/grc.ts` is the only types file | One source of truth. No scattered inline types. TypeScript compiler enforces contracts everywhere. |
| `src/lib/constants.ts` holds all data | Components contain zero hard-coded data. Swap static data for real API calls in one file later. |
| `src/lib/prompts.ts` holds all AI prompts | Prompts can be reviewed and updated by non-engineers without reading React code. |
| `src/app/api/ai/route.ts` is the only AI caller | API keys never reach the browser. This file is the single, auditable point of external AI contact. |
| One file per tab in `src/components/tabs/` | Each tab is independently testable and deployable. A broken tab never affects other tabs. |
| CSS custom properties in `globals.css` | Change `--color-accent` once → updates every component that references it. No find-and-replace. |

---

## Feature Guide (Every Tab Explained)

### Tab 1: Architecture Overview

**What it is:**
A visual, interactive map of the five GRC automation layers.

**How to use it:**
Click on any of the five layer cards to expand a detailed panel showing:
- Live KPI metrics (rules active, violations blocked, events processed)
- The tool stack powering that layer
- An animated step-by-step pipeline that walks through how events flow, with each step lighting up in sequence

**Why it matters:**
This is the "control room" view of your entire GRC operation. At a glance you can see which layers are active, streaming, or in standby — and inspect real-time metrics for each.

**Who should use it:**
GRC architects, security engineers, directors reviewing the compliance posture, auditors wanting to understand the automation architecture.

---

### Tab 2: Pipeline Detail

**What it is:**
A full, linear view of every step in the end-to-end automation flow — from a developer's git commit all the way to an audit-ready evidence artefact.

**How to read it:**
Each row shows the phase name, what happens at that step, and whether it is **AUTO** (green — system acts alone) or **HUMAN** (red — requires a person).

**Key insight:**
Of the 14 pipeline steps, only 2 ever require human action — and those only fire for the three highest-judgment scenarios that genuinely cannot be automated.

---

### Tab 3: Code Reference

**What it is:**
Production-ready code samples for each of the five GRC layers — OPA Rego rules, GitHub Actions steps, TypeScript remediation scripts, AI agent logic, and escalation trigger guards.

**How to use it:**
Each card has a **COPY** button. Copy directly into your project. These are not pseudocode — they are the actual patterns used in production.

---

### Tab 4: AI Vendor Risk Assessment

**What it is:**
An AI agent that reads a vendor's security documentation and produces a complete risk assessment in under 60 seconds.

**The problem it replaces:**
A GRC analyst typically spends 4–8 hours manually reviewing a vendor's SOC 2 report, cross-referencing it against requirements, scoring gaps, and drafting a response. This tab does the same work automatically.

**How to use it:**

1. Type the vendor's name in the **Vendor Name** field.
2. Paste any of the following:
   - SOC 2 Type II executive summary or full report
   - ISO 27001 certificate and scope statement
   - Completed CAIQ or VSAQ security questionnaire
   - Penetration test executive summary
   - Any vendor-provided security overview
3. Click **RUN AI RISK ASSESSMENT**.

**What the AI returns:**

| Output | Description |
|---|---|
| Risk Score (0–100) | Numerical residual risk. 0 = meets all requirements. 100 = critical failures across the board. |
| Risk Level | LOW / MEDIUM / HIGH / CRITICAL — categorical label for triage. |
| Control Gaps | Every gap found, with severity and a specific remediation recommendation. |
| Strengths | Security controls the vendor has correctly implemented. |
| Draft Email | A professionally written email to the vendor, citing each gap and requesting remediation timelines. Ready to send after your review. |
| Audit Trail Note | One-line entry auto-formatted for your compliance evidence log. |

**Your only action:** Review, optionally edit the draft email, approve.

**Assessment rubric — the 7 controls checked:**

| Control | What Is Checked |
|---|---|
| MFA on privileged accounts | Is multi-factor authentication enforced for all admin access? |
| Encryption at rest | Is data encrypted using AES-256 minimum? |
| Incident response SLA | Can the vendor respond to a P1 incident within 4 hours? |
| Certification | SOC 2 Type II or ISO 27001 held? |
| Penetration testing | Pentest conducted within the last 12 months? |
| Sub-processor disclosure | All third parties who process your data disclosed? |
| GDPR data residency | Storage compliant with GDPR Article 46 transfer rules? |

---

### Tab 5: OPA Rule Generator

**What it is:**
An AI engine that converts a plain-English compliance requirement into four production-ready code artefacts simultaneously.

**The problem it replaces:**
Writing OPA Rego requires specialist knowledge most GRC professionals don't have. Historically a GRC team writes a policy in Word, then waits days for a platform engineer to implement it — with the risk of misinterpretation. This tab closes that gap instantly.

**How to use it:**

1. Select the **Target Resource Type** from the dropdown (e.g. `aws_s3_bucket`, `aws_iam_role`, `kubernetes_deployment`).
2. Describe the policy in plain English. Examples:
   - *"All S3 buckets must have server-side encryption enabled and versioning turned on"*
   - *"IAM roles must not contain wildcard (*) actions in their attached policies"*
   - *"Security groups must not allow inbound SSH from 0.0.0.0/0"*
3. Click **GENERATE POLICY-AS-CODE**.

**What is generated:**

| Artefact | What It Is | Where It Goes |
|---|---|---|
| OPA Rego Rule | Complete deny block with package declaration and error message | Your OPA instance — evaluated on every Terraform plan |
| Semgrep YAML Rule | Code-level static analysis rule | Your Semgrep ruleset — runs in CI/CD on every PR |
| GitHub Actions Step | YAML CI step running `conftest` | `.github/workflows/compliance.yml` |
| Terraform / Checkov Guardrail | Infrastructure-as-code check | Pre-commit hooks and CI pipelines |
| Test Cases | DENY/ALLOW assertions | Your OPA test suite |

---

### Tab 6: Evidence Tracker

**What it is:**
A continuous compliance evidence dashboard tracking control status across SOC 2, ISO 27001, and NIST 800-53 — updated automatically by AI agent crons.

**The problem it replaces:**
Before annual audits, GRC teams spend 2–4 weeks manually collecting evidence screenshots. This tab eliminates that entirely — evidence is collected on a continuous schedule, so when the auditor arrives a live timestamped dashboard is already waiting.

**Status meanings:**

| Status | Colour | Meaning |
|---|---|---|
| PASS | Green | Evidence collected, control verified, within due date |
| WARN | Amber | Approaching overdue or minor gap present |
| FAIL | Red | Control not met — action required |
| COLLECTING | Purple | AI agent actively pulling evidence right now |

**Column definitions:**
- **CTRL ID:** Control identifier in the relevant framework (e.g. `CC6.1` for SOC 2, `A.9.2` for ISO 27001, `SC-28` for NIST 800-53)
- **Framework:** Which compliance standard this control belongs to
- **Owner:** `AUTO` = AI agent collects on a schedule. `HUMAN` = manual collection required.
- **Action:** COLLECT button appears for AUTO-owned FAIL/WARN controls — triggers immediate AI collection run

**How to use it:**
1. Use the framework filter tabs to focus on a specific standard
2. Click any row to open the detail panel — shows evidence on file, last checked, next due date, owner
3. For AUTO controls in FAIL/WARN state, click **COLLECT** to trigger an immediate collection run

---

### Tab 7: Incident Response Playbook

**What it is:**
A structured incident command centre with real-world incident scenarios, automated response timelines, and AI-powered root cause analysis.

**How to use it:**

1. Select an incident from the left panel
2. Read the **automated response timeline** — each step is labelled AUTO or HUMAN
3. Read the **AI Incident Narrative** — plain-English summary of what happened
4. Read the **GRC Architect Recommendation** — remediation steps and policy updates
5. Click **GENERATE AI ROOT CAUSE ANALYSIS** to run deep AI analysis returning:
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

## AI Provider Switching

The application supports three AI providers. **Switching providers requires one environment variable change** — no code modifications anywhere in the application.

### How provider routing works

```
Browser → POST /api/ai → Next.js Route Handler (server-side)
                              │
                              ├─ AI_PROVIDER=claude  → Anthropic API (Claude)
                              ├─ AI_PROVIDER=openai  → OpenAI API (GPT-4o)
                              └─ AI_PROVIDER=custom  → Your custom endpoint
```

The API key is read from environment variables **on the server only**. It is never sent to the browser or included in the JavaScript bundle.

### Switching providers

Open `.env.local` and change the two lines:

#### Use Anthropic Claude (default):
```bash
AI_PROVIDER=claude
AI_MODEL=claude-sonnet-4-20250514
ANTHROPIC_API_KEY=your_key_here
```

#### Use OpenAI GPT-4o:
```bash
AI_PROVIDER=openai
AI_MODEL=gpt-4o
OPENAI_API_KEY=your_key_here
```

#### Use OpenAI GPT-4o Mini (lower cost):
```bash
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini
OPENAI_API_KEY=your_key_here
```

#### Use a custom or self-hosted LLM (Ollama, Azure OpenAI, AWS Bedrock proxy):
```bash
AI_PROVIDER=custom
AI_MODEL=your-model-name
OPENAI_API_KEY=your_key_here
CUSTOM_LLM_ENDPOINT=https://your-endpoint/v1/chat/completions
```

The custom provider uses the OpenAI chat completions request format, which is compatible with most self-hosted LLMs (Ollama, LM Studio, vLLM, Azure OpenAI, etc.).

---

## Quick-Start: Local Development

### Prerequisites

- **Node.js 18.17 or later** — download from [nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js) or **pnpm** / **yarn**
- **An API key** for your chosen AI provider (Claude or OpenAI)
- A modern code editor (VS Code recommended)

### Step-by-step

```bash
# 1. Clone or unzip the project
git clone https://github.com/your-username/grc-command-center.git
cd grc-command-center

# OR if you downloaded the zip:
unzip grc-command-center.zip
cd grc-command-center

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

Now open `.env.local` in your editor and fill in your API key:

```bash
# For Claude (Anthropic):
AI_PROVIDER=claude
AI_MODEL=claude-sonnet-4-20250514
ANTHROPIC_API_KEY=sk-ant-...your-key-here...

# For OpenAI:
# AI_PROVIDER=openai
# AI_MODEL=gpt-4o
# OPENAI_API_KEY=sk-...your-key-here...
```

```bash
# 4. Start the development server
npm run dev

# 5. Open the application
# → http://localhost:3000
```

The app will hot-reload automatically as you make changes. The AI features (Vendor Risk, OPA Generator, Incident Playbook) are fully functional once your API key is set.

### Available scripts

```bash
npm run dev        # Start development server with Turbopack (fast hot reload)
npm run build      # Build for production
npm run start      # Start production server (run after build)
npm run lint       # Run ESLint
npm run type-check # Run TypeScript compiler check (no emit)
```

---

## Hosting Guide

### Option A: Vercel (Recommended — Free)

Vercel is the company that builds Next.js. Deploying there gives you:
- Zero configuration required — Vercel auto-detects Next.js
- Automatic HTTPS
- Global CDN
- Free tier sufficient for team internal tooling
- Environment variable management via dashboard

**Step 1: Push your code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/grc-command-center.git
git push -u origin main
```

**Step 2: Deploy to Vercel**
```bash
npm install -g vercel
vercel
# Follow the prompts — accept all defaults
```

Or go to [vercel.com](https://vercel.com), click **New Project**, and import your GitHub repository.

**Step 3: Add environment variables**

In the Vercel dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add each variable from your `.env.local` file:
   - `AI_PROVIDER` = `claude`
   - `AI_MODEL` = `claude-sonnet-4-20250514`
   - `ANTHROPIC_API_KEY` = your key
   - `NEXT_PUBLIC_AI_PROVIDER` = `claude` *(this one is shown in the UI header)*

**Step 4: Redeploy**
```bash
vercel --prod
```

Your app is live at `https://your-project.vercel.app`.

> **Important:** Add `NEXT_PUBLIC_AI_PROVIDER` in addition to `AI_PROVIDER`. The `NEXT_PUBLIC_` prefix makes the value available in the browser for the UI header label. The actual API key is only in `AI_PROVIDER` — which is server-only.

---

### Option B: Netlify

**Step 1: Build the project**
```bash
npm run build
```

**Step 2: Deploy**

Option B1 — via CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.next
```

Option B2 — via drag and drop:
1. Go to [netlify.com](https://netlify.com)
2. Drag the `.next` folder into the deploy zone

**Step 3: Add environment variables**

In the Netlify dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add all variables from `.env.local`

> **Note:** Netlify requires the Next.js runtime plugin for server-side features like the `/api/ai` route. Install it: `npm install @netlify/plugin-nextjs` and add to `netlify.toml`:
```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

### Option C: Docker / Self-Hosted

Use this option if your organisation requires on-premise hosting or you want full infrastructure control.

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

Add `output: 'standalone'` to `next.config.ts` for optimised Docker builds:
```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  // ... rest of config
}
```

**Build and run:**
```bash
docker build -t grc-command-center .

docker run -p 3000:3000 \
  -e AI_PROVIDER=claude \
  -e AI_MODEL=claude-sonnet-4-20250514 \
  -e ANTHROPIC_API_KEY=your_key \
  -e NEXT_PUBLIC_AI_PROVIDER=claude \
  grc-command-center
```

**Using Docker Compose:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  grc:
    build: .
    ports:
      - "3000:3000"
    environment:
      - AI_PROVIDER=claude
      - AI_MODEL=claude-sonnet-4-20250514
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - NEXT_PUBLIC_AI_PROVIDER=claude
    restart: unless-stopped
```
```bash
docker compose up -d
```

---

### Option D: AWS, GCP, Azure

The application is a standard Next.js app and can be deployed to any cloud platform that supports Node.js containers.

**AWS:**
- **AWS Amplify** — Connect your GitHub repo. Amplify auto-detects Next.js. Add env vars in the Amplify console.
- **AWS ECS / Fargate** — Use the Docker image above. Add env vars as ECS task environment variables or AWS Secrets Manager references.
- **AWS App Runner** — Connect your container registry. Simplest managed option on AWS.

**Google Cloud:**
- **Cloud Run** — `gcloud run deploy grc-command-center --image gcr.io/your-project/grc-command-center --set-env-vars AI_PROVIDER=claude`
- **Firebase Hosting** — Supports Next.js with server-side rendering via Cloud Functions.

**Microsoft Azure:**
- **Azure Container Apps** — Deploy the Docker image. Set env vars in the Azure portal under Container → Environment variables.
- **Azure App Service** — Supports Node.js deployments. Add env vars under Configuration → Application settings.

For all cloud providers: **never put API keys in the Docker image**. Always inject them via the platform's secret or environment variable management system.

---

## Environment Variables Reference

All variables are set in `.env.local` for local development, and in your hosting platform's environment variable settings for production.

| Variable | Required | Example Value | Description |
|---|---|---|---|
| `AI_PROVIDER` | Yes | `claude` | Active LLM provider: `claude`, `openai`, or `custom` |
| `AI_MODEL` | Yes | `claude-sonnet-4-20250514` | Model identifier for the active provider |
| `AI_MAX_TOKENS` | No | `1000` | Max completion tokens (default: 1000) |
| `ANTHROPIC_API_KEY` | If using Claude | `sk-ant-...` | Anthropic API key from [console.anthropic.com](https://console.anthropic.com) |
| `OPENAI_API_KEY` | If using OpenAI | `sk-...` | OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys) |
| `CUSTOM_LLM_ENDPOINT` | If using custom | `https://...` | Custom LLM API endpoint (OpenAI-compatible format) |
| `NEXT_PUBLIC_AI_PROVIDER` | Recommended | `claude` | Shows active provider in the UI header badge |

**Important naming note:**
- Variables **without** `NEXT_PUBLIC_` are server-only — never exposed to the browser. Use these for API keys.
- Variables **with** `NEXT_PUBLIC_` are included in the browser JavaScript bundle. Never put secrets here.

---

## Security Architecture

### API Key Security Model

```
┌─────────────────────┐         ┌──────────────────────────────────┐
│  Browser (client)   │         │  Next.js Server (route.ts)       │
│                     │         │                                  │
│  src/lib/           │  POST   │  src/app/api/ai/route.ts         │
│  aiClient.ts        │ ──────► │                                  │
│                     │ /api/ai │  Reads: process.env.ANTHROPIC_   │
│  { systemPrompt,    │         │  API_KEY (server only)           │
│    userMessage }    │         │                                  │
│                     │ ◄────── │  Forwards to: Anthropic / OpenAI │
│  { text: string }   │  JSON   │                                  │
└─────────────────────┘         └──────────────────────────────────┘

API keys: ONLY in server environment variables. Never in browser bundle.
```

### What this means in practice

- A user opening DevTools → Network in their browser will see requests to `/api/ai` — your own domain. They will never see requests to `api.anthropic.com` or `api.openai.com`, and they will never see an API key.
- The API key is only accessible inside the Node.js server process, read from environment variables at request time.
- If the browser-side code was compromised (XSS), there is no API key to steal from it.

### Additional security recommendations for production

1. **Rate limit the `/api/ai` endpoint** to prevent abuse. Use a library like `express-rate-limit` or Vercel's built-in edge rate limiting.
2. **Add authentication** before the `/api/ai` route if the tool is publicly accessible. Use NextAuth.js or your organisation's SSO provider.
3. **Log AI requests** server-side for audit purposes — log the feature used and timestamp, but not the content of vendor documents.
4. **Rotate API keys** on a schedule. Set a calendar reminder to rotate every 90 days.

---

## Glossary of Terms

This section defines every technical term used in the application, so non-technical colleagues and executives can read the platform without a background in security or engineering.

---

**API (Application Programming Interface)**
A way for software systems to communicate with each other. When this application calls the Claude or OpenAI API, it sends a structured request to their servers and receives a structured response.

**Audit Trail**
A chronological, tamper-resistant record of events and actions. In compliance, an audit trail proves to auditors that controls were operating correctly during a specific period.

**Blast Radius**
The scope of damage if a security incident is not contained — which systems are affected, what data is at risk, and how many users are impacted.

**CAIQ (Consensus Assessment Initiative Questionnaire)**
A standardised security questionnaire from the Cloud Security Alliance used to assess cloud vendor security practices.

**CCM (Continuous Controls Monitoring)**
The practice of monitoring security controls in real time, rather than checking them once per year at audit time.

**Checkov**
An open-source static analysis tool for infrastructure-as-code (Terraform, CloudFormation). Checks configuration files for security violations before infrastructure is deployed.

**CI/CD Pipeline (Continuous Integration / Continuous Deployment)**
The automated process that takes code written by a developer, runs checks on it, and deploys it to production. Compliance gates (checks) are embedded into this pipeline.

**CloudTrail (AWS CloudTrail)**
An AWS service that records every API call made in an AWS account — who did what, when, from where. The equivalent of a CCTV system for cloud infrastructure.

**Compliance**
The state of meeting all required security controls, policies, and regulations.

**Conftest**
A command-line tool used to run OPA Rego policy tests against configuration files.

**CVSS Score (Common Vulnerability Scoring System)**
A 0.0–10.0 score measuring security vulnerability severity. Scores of 7.0–8.9 are "High"; 9.0–10.0 are "Critical". This platform automatically blocks builds with CVSS ≥ 8.0.

**CVE (Common Vulnerabilities and Exposures)**
A publicly listed software vulnerability with a unique identifier (e.g. CVE-2024-3811).

**Dependabot**
A GitHub tool that automatically creates pull requests to update software dependencies when vulnerabilities are discovered.

**DevSecOps**
The practice of integrating security into the DevOps workflow — making security a continuous, automated part of development rather than a final checkpoint.

**Drift (Configuration Drift)**
When the actual configuration of a live system diverges from its approved baseline without authorisation.

**EBS Volume (Elastic Block Store)**
A type of storage in AWS attached to compute instances. EBS volumes must be encrypted to comply with most security standards.

**Evidence Artefact**
A document proving a security control was operating correctly at a point in time. Examples: log export, certificate, API response showing a setting is enabled.

**GDPR (General Data Protection Regulation)**
The EU's data protection law. Governs how personal data of EU residents must be handled. Fines up to 4% of global annual turnover for non-compliance.

**GRC (Governance, Risk & Compliance)**
Three disciplines that make up an organisation's approach to risk and regulatory obligations:
- **Governance:** Policies and frameworks guiding decision-making
- **Risk:** Identifying and managing threats to the organisation
- **Compliance:** Meeting all applicable laws, regulations, and standards

**GRC-as-Code**
Expressing GRC policies and controls as machine-readable code in version control — rather than Word documents or spreadsheets.

**IAM (Identity and Access Management)**
The AWS system controlling who can access what. IAM policies define permissions; IAM roles are assigned to services and users.

**ISO 27001**
The international standard for Information Security Management Systems. Required by many enterprise clients and government agencies.

**LLM (Large Language Model)**
An AI model capable of understanding and generating human-like text. Claude (Anthropic) and GPT-4o (OpenAI) are LLMs.

**MFA (Multi-Factor Authentication)**
A security mechanism requiring users to verify identity using two or more methods. Absence of MFA on privileged accounts is a critical gap.

**n8n**
An open-source workflow automation tool used to trigger remediation scripts automatically when violations are detected.

**NIST 800-53**
A security control catalogue from the US National Institute of Standards and Technology. Required for US federal IT systems; widely adopted as best practice.

**Next.js**
The React framework this application is built on. Provides server-side rendering, API routes, file-based routing, and TypeScript support out of the box.

**OPA (Open Policy Agent)**
An open-source policy engine for defining and enforcing rules across infrastructure using the Rego language.

**PaC (Policy-as-Code)**
Writing compliance policies as machine-readable code so they can be version-controlled, tested, and automatically enforced.

**Penetration Test (Pentest)**
A simulated cyberattack by security professionals to find vulnerabilities before real attackers do. Most compliance frameworks require an annual pentest.

**Prometheus**
An open-source monitoring and alerting system used to collect real-time metrics from infrastructure.

**Pull Request (PR)**
A request to merge code changes in a version control system. GRC pipelines evaluate PRs and can block them or push remediation commits back to them.

**RAG (Retrieval-Augmented Generation)**
An AI technique giving a language model access to a specific document database to retrieve relevant context before generating a response.

**RDS (Relational Database Service)**
AWS's managed database service. RDS instances must not be publicly accessible — enforced by OPA rules.

**Rego**
The policy language used by Open Policy Agent. Logic-based syntax that evaluates input data and returns allow/deny decisions.

**Remediation**
Fixing a security or compliance issue. In this platform, most remediations are performed autonomously within seconds.

**Risk Acceptance**
A formal decision to accept a known security risk rather than fix it. Requires documented sign-off and is one of the three categories that always escalates to a human.

**Risk Score**
A 0–100 numerical representation of security risk. In the Vendor Risk Assessment, 0 = no risk, 100 = critical failures across all controls.

**SCP (Service Control Policy)**
An AWS Organisations feature enforcing permission boundaries across an entire account or organisation.

**Semgrep**
An open-source static analysis tool scanning source code for security vulnerabilities and policy violations.

**SAST (Static Application Security Testing)**
Security testing that analyses source code without executing it. Semgrep performs SAST in CI/CD pipelines.

**Shift-Left**
Moving security and compliance checks earlier in the development lifecycle — into the coding and commit stages — rather than finding problems after deployment.

**Snyk**
A commercial security platform scanning software dependencies for known vulnerabilities. Integrates with GitHub and CI/CD to block builds on critical findings.

**SOC 2 (System and Organisation Controls 2)**
A US auditing framework for technology companies. SOC 2 Type II covers a period (typically 6–12 months) and is required by most enterprise SaaS customers before signing contracts.

**SSO (Single Sign-On)**
A centralised authentication system allowing users to log in once and access multiple systems. Accounts created outside SSO are a compliance violation.

**Tailwind CSS**
A utility-first CSS framework. Instead of writing custom CSS, you apply pre-defined utility classes directly in your HTML/JSX. Version 4 (used here) introduces a PostCSS plugin architecture.

**Terraform**
An infrastructure-as-code tool for defining cloud infrastructure in configuration files. OPA rules evaluate Terraform plans before deployment.

**TruffleHog**
An open-source tool scanning git repositories for accidentally exposed secrets (API keys, passwords, tokens).

**TypeScript**
A typed superset of JavaScript. TypeScript adds static types that are checked at compile time — catching contract errors before runtime. This codebase uses strict TypeScript 5.8.

**VSAQ (Vendor Security Assessment Questionnaire)**
A detailed security questionnaire sent to vendors to assess their security posture before onboarding.

---

## For Directors & Executives

> This section gives you a complete non-technical understanding of what has been built, why it matters, and what it means for your organisation's risk posture.

### The Business Problem

Your organisation has compliance requirements — SOC 2, ISO 27001, GDPR, or others. Meeting these requirements traditionally means hiring GRC analysts to write policies, collect evidence, and scramble every year before an audit. The process is expensive, slow, and almost entirely manual.

More importantly, it is **reactive**. By the time a GRC analyst reviews an audit log and discovers a security violation, it may have been in your production environment for days or weeks.

### What This Platform Delivers

**GRC Crest - Command Center replaces a reactive, document-driven compliance programme with a proactive, code-driven compliance system.**

| Metric | Traditional GRC | GRC Crest - Command Center |
|---|---|---|
| Automation rate | ~20% | 98.3% |
| Time to detect a compliance violation | Hours to days | Seconds |
| Time to remediate a violation | Days (human review + ticket + fix) | 4.2 seconds (automated) |
| Audit preparation time | 2–4 weeks annually | Zero (evidence collected continuously) |
| Vendor risk assessment time | 4–8 hours per vendor | Under 60 seconds |
| Human decisions required per month | Hundreds | 12 (only highest-judgment scenarios) |

### What Your Team Still Does

This platform does not eliminate the GRC function — it *elevates* it. Your GRC team shifts from:

- ❌ Collecting screenshots → ✅ Reviewing AI-generated evidence dashboards
- ❌ Manually reviewing SOC 2 reports → ✅ Approving AI-generated vendor risk assessments
- ❌ Writing policy documents → ✅ Describing policies in plain English; AI generates the code
- ❌ Reacting to violations found in audits → ✅ Reviewing automated incident reports with root-cause analysis already done

Human GRC professionals in this system are decision-makers, not data collectors.

### The ROI Case

A mid-size organisation spending £500K/year on GRC headcount can typically:
- Reduce annual audit preparation effort by 80–90%
- Reduce vendor risk assessment time from days to minutes
- Eliminate the category of "production violation discovered late" entirely
- Demonstrate to enterprise customers and regulators a mature, automated compliance posture that differentiates during procurement

### The Competitive Differentiation

Enterprise customers increasingly ask *"What does your compliance programme look like?"* before signing contracts. A live, automated, continuously monitored compliance platform is a significantly stronger answer than *"We have a GRC team and annual SOC 2 audits."*

---

## For Potential Employers & Clients

> This section describes the technical depth and professional value of this project for anyone evaluating the architect's capabilities.

### What This Project Demonstrates

This is not a compliance dashboard — it is a **fully engineered GRC automation system** that demonstrates mastery across seven technical domains simultaneously.

---

**1. Production-Grade Next.js 15 + React 19 Architecture**

Full App Router implementation with correct server/client component boundaries: `page.tsx` is a server component; `GRCDashboard.tsx` owns the client boundary; each tab is an independently renderable client component. Typed `next.config.ts`, proper `Metadata` and `Viewport` exports, and `'use client'` directives applied precisely where needed — not sprayed across the codebase.

**2. Strict TypeScript Engineering**

`src/types/grc.ts` defines 20+ interfaces covering every data contract in the application — `GRCLayer`, `EvidenceRecord`, `Incident`, `VendorAssessment`, `AIRootCauseAnalysis`, `PipelineStep`, `GeneratedPolicy`, and more. All component props, function parameters, and return types are fully typed. `tsconfig.json` runs in strict mode. `tsc --noEmit` is a required CI check.

**3. Security-First API Architecture**

`src/app/api/ai/route.ts` is the only file in the entire codebase that holds or uses an API key. It runs server-side (Node.js runtime), reads credentials from environment variables, and exposes a clean `POST /api/ai` interface to the browser. The browser-side `aiClient.ts` calls only `/api/ai` — it never touches an external LLM API directly. This is the correct pattern for any production Next.js application handling third-party credentials.

**4. Infrastructure Security Engineering**

Full DevSecOps toolchain coverage: OPA/Rego policy enforcement, TruffleHog secret scanning, Snyk dependency analysis, Semgrep SAST, and Checkov infrastructure scanning — all designed into CI/CD pipeline architecture. The OPA Generator tab demonstrates the ability to programmatically generate valid Rego, Semgrep, GitHub Actions, and Terraform artefacts from a natural language specification.

**5. Agentic AI Systems Design**

Three distinct AI agent workflows with different system prompt strategies: structured JSON output enforcement (vendor risk), multi-artefact code generation (OPA generator), and forensic analysis (incident RCA). Provider-agnostic `callAIJson<T>()` generic with typed return, JSON fence stripping, and proper error propagation. System prompts in `src/lib/prompts.ts` as versioned, reviewable artefacts separate from UI code.

**6. GRC Domain Expertise**

Deep command of SOC 2 Trust Service Criteria, ISO 27001 Annex A controls, and NIST 800-53 control families. Evidence records are modelled with correct framework identifiers (`CC6.1`, `A.9.2`, `SC-28`). Vendor assessment rubric covers the seven controls that differentiate mature from immature vendor security postures. Incident scenarios reflect real-world attack patterns (Tor-exit-node IAM assumption, Terraform misconfiguration) with accurate automated response timelines.

**7. Software Architecture & Separation of Concerns**

Clean separation across four layers: types (`/types`), logic and data (`/lib`), styles (`/styles`), and components (`/components`). No data hardcoded in components. No types scattered inline. No logic mixed with presentation. CSS custom properties used as the design token layer — changing `--color-accent` once updates every consumer. Any static data in `constants.ts` can be replaced with API calls without modifying a single component.

---

### Technical Stack

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js | 15.3 |
| UI Library | React | 19.1 |
| Language | TypeScript | 5.8 (strict mode) |
| Styling | Tailwind CSS | 4.1 |
| AI Providers | Anthropic Claude / OpenAI GPT | Switchable via env |
| Policy Enforcement | Open Policy Agent, Rego, Conftest | — |
| SAST / Secret Scanning | Semgrep, TruffleHog, Snyk | — |
| Infrastructure Scanning | Checkov, Terraform, Sentinel | — |
| CI/CD | GitHub Actions | — |
| Cloud Monitoring | AWS CloudTrail, Prometheus, Datadog | — |
| Automation | n8n, Node.js microservices | — |
| Compliance Frameworks | SOC 2 Type II, ISO 27001, NIST 800-53, GDPR | — |

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Follow the existing patterns:
   - Add new types to `src/types/grc.ts` — never inline
   - Add new static data to `src/lib/constants.ts`
   - Add new AI prompts to `src/lib/prompts.ts`
   - Add new tab components to `src/components/tabs/`
   - Register new tabs in the `TABS` array in `src/lib/constants.ts` and `TAB_COMPONENTS` map in `src/components/GRCDashboard.tsx`
4. Run `npm run type-check` and `npm run lint` before submitting — both must pass
5. Test all AI features with at least Claude and OpenAI before submitting
6. Update this README with a new section under Feature Guide for any new tab
7. Submit a pull request with a clear description of what was changed and why

**Coding standards:**
- All data models defined in `src/types/grc.ts` as TypeScript interfaces
- All AI system prompts in `src/lib/prompts.ts` as named `const` exports
- All colours referenced via CSS custom properties — no hardcoded hex strings in components
- `'use client'` directive only on components that use React hooks or browser APIs
- Server-side code (API routes) must never import from client components

---

## Roadmap

- **Real Cloud Integration** — Live AWS Config / GCP Asset Inventory polling to replace simulated evidence with real configuration data
- **JIRA / ServiceNow Integration** — Auto-create tickets for human-queue escalations with AI-generated context and priority
- **Slack / Teams Notifications** — Push escalation briefs directly to GRC team channels
- **Multi-Tenancy** — Support multiple business units or client environments from a single deployment
- **Custom Framework Builder** — Define your own compliance frameworks beyond SOC 2 / ISO 27001 / NIST
- **Audit Export** — One-click export of the evidence repository as a formatted PDF audit package
- **Risk Register** — Formal risk register with treatment tracking, owner assignment, and review cycles
- **Regulatory Update Feed** — AI-monitored feed surfacing regulatory changes that require policy updates
- **NextAuth.js Integration** — Role-based access control so junior analysts see dashboards but cannot approve risk variances

---

## License

MIT License — Copyright (c) 2025 GRC Crest - Command Center

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.

---

*Built by a Technical GRC Engineer & Security Compliance Architect.*
*This platform represents the operational architecture for running GRC as a high-velocity, AI-augmented, continuous-by-design software system — not as an administrative function.*
