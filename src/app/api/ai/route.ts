/**
 * @file route.ts
 * @description AI completion endpoint — POST /api/ai
 *
 * WHY VERCEL AI SDK INSTEAD OF RAW FETCH?
 * ────────────────────────────────────────
 * The previous version used manual fetch() calls to each provider's API.
 * That required:
 *  - Writing separate request/response parsers for Anthropic and OpenAI
 *  - Manual JSON fence stripping from model responses
 *  - No streaming support
 *  - Manual error handling for each provider's error format
 *  - No type safety on model responses
 *
 * The Vercel AI SDK (`ai` package) solves all of this:
 *  - `generateText()` — single function, works with any registered provider
 *  - `streamText()`   — streaming responses with minimal code
 *  - Built-in error types and normalised error messages
 *  - Provider switching via a model factory — no if/else chains
 *  - Full TypeScript support throughout
 *
 * PROVIDER SWITCHING
 * ──────────────────
 * Change AI_PROVIDER in .env.local — no code changes needed anywhere.
 * The `getModel()` factory below maps the env var to the correct SDK provider.
 *
 * SECURITY
 * ────────
 * This route runs server-side (Node.js runtime).
 * API keys are read from process.env — never sent to the browser.
 * All requests are authenticated: a valid, MFA-verified session is
 * required before any AI call is processed.
 */

import { NextRequest, NextResponse }    from 'next/server'
import { generateText, LanguageModel }  from 'ai'
import { createAnthropic }              from '@ai-sdk/anthropic'
import { createOpenAI }                 from '@ai-sdk/openai'
import { auth }                         from '@/lib/auth'
import type { AIRequestPayload, AIResponsePayload } from '@/types/grc'

/** Force Node.js runtime for environment variable access */
export const runtime = 'nodejs'

// ─── Model Factory ─────────────────────────────────────────────────────────--

/**
 * Returns the correct Vercel AI SDK LanguageModel instance based on
 * the AI_PROVIDER and AI_MODEL environment variables.
 *
 * Adding a new provider:
 *   1. Install its SDK: npm install @ai-sdk/your-provider
 *   2. Add a case below
 *   3. Update .env.example with the new provider key
 */
function getModel(): LanguageModel {
  const provider = process.env.AI_PROVIDER ?? 'claude'
  const model    = process.env.AI_MODEL    ?? 'claude-sonnet-4-20250514'

  switch (provider) {
    case 'claude': {
      const apiKey = process.env.ANTHROPIC_API_KEY
      if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set.')
      const anthropic = createAnthropic({ apiKey })
      return anthropic(model)
    }

    case 'openai': {
      const apiKey = process.env.OPENAI_API_KEY
      if (!apiKey) throw new Error('OPENAI_API_KEY is not set.')
      const openai = createOpenAI({ apiKey })
      return openai(model)
    }

    case 'custom': {
      // Any OpenAI-compatible endpoint (Ollama, Azure OpenAI, vLLM, etc.)
      const apiKey   = process.env.OPENAI_API_KEY ?? 'not-needed'
      const baseURL  = process.env.CUSTOM_LLM_ENDPOINT
      if (!baseURL) throw new Error('CUSTOM_LLM_ENDPOINT is not set for custom provider.')
      const openai = createOpenAI({ apiKey, baseURL })
      return openai(model)
    }

    default:
      throw new Error(
        `Unknown AI_PROVIDER: "${provider}". Valid values: "claude", "openai", "custom".`
      )
  }
}

// ─── Route Handler ──────────────────────────────────────────────────────────

/**
 * POST /api/ai
 *
 * Accepts: { systemPrompt: string, userMessage: string }
 * Returns: { text: string } | { text: '', error: string }
 *
 * Requires: valid NextAuth session with mfaVerified: true
 */
export async function POST(
  req: NextRequest,
): Promise<NextResponse<AIResponsePayload>> {
  // ── Auth guard — must have a fully verified session ──────────
  const session = await auth() as { mfaVerified?: boolean } | null
  if (!session || !session.mfaVerified) {
    return NextResponse.json(
      { text: '', error: 'Unauthorised. Please sign in and complete MFA.' },
      { status: 401 },
    )
  }

  // ── Parse request ─────────────────────────────────────────────
  let body: AIRequestPayload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { text: '', error: 'Invalid JSON in request body.' },
      { status: 400 },
    )
  }

  if (!body.systemPrompt || !body.userMessage) {
    return NextResponse.json(
      { text: '', error: 'Missing required fields: systemPrompt, userMessage.' },
      { status: 400 },
    )
  }

  // ── Call the AI model via Vercel AI SDK ───────────────────────
  try {
    const model = getModel()

    const { text } = await generateText({
      model,
      system:      body.systemPrompt,
      prompt:      body.userMessage,
      maxTokens:   parseInt(process.env.AI_MAX_TOKENS ?? '1000', 10),
      temperature: 0.2,   // Lower temperature = more consistent JSON output
    })

    return NextResponse.json({ text })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown AI error'
    console.error('[/api/ai] AI call failed:', message)
    return NextResponse.json(
      { text: '', error: message },
      { status: 500 },
    )
  }
}
