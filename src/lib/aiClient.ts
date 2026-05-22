/**
 * @file aiClient.ts
 * @description Browser-side AI client.
 *
 * This module NEVER holds or touches an API key.
 * It sends requests to /api/ai — a Next.js Route Handler that runs
 * server-side, reads the API key from environment variables, and
 * forwards the request to the configured LLM provider.
 *
 * Security model:
 *   Browser → /api/ai (Next.js server) → LLM Provider API
 *
 * The API key is only ever present in the server environment.
 * It is never sent to or readable by the browser.
 */

import type { AIRequestPayload, AIResponsePayload } from '@/types/grc'

/**
 * Sends a system prompt and user message to the server-side AI proxy.
 * The proxy selects the correct LLM provider based on environment variables.
 *
 * @param systemPrompt - Role / instructions for the AI model
 * @param userMessage  - The document or query to process
 * @returns            - Plain text response from the AI model
 * @throws             - If the network request fails or the server returns an error
 */
export async function callAI(
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  const payload: AIRequestPayload = { systemPrompt, userMessage }

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`AI proxy error ${response.status}: ${errorText}`)
  }

  const data: AIResponsePayload = await response.json()

  if (data.error) {
    throw new Error(data.error)
  }

  return data.text
}

/**
 * Calls callAI() and parses the response as JSON.
 * LLM responses are instructed to return only JSON — this helper
 * strips any accidental markdown fences before parsing.
 *
 * @param systemPrompt - Must instruct the model to return ONLY JSON
 * @param userMessage  - The document or query to process
 * @returns            - Parsed JSON object of type T
 * @throws             - If JSON parsing fails
 */
export async function callAIJson<T>(
  systemPrompt: string,
  userMessage: string,
): Promise<T> {
  const raw = await callAI(systemPrompt, userMessage)
  // Strip markdown code fences that some models add despite instructions
  const clean = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
  return JSON.parse(clean) as T
}
