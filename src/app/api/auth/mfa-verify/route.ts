/**
 * @file route.ts
 * @description MFA verification endpoint — POST /api/auth/mfa-verify
 *
 * Called after the user completes step 1 (credentials) and submits
 * their MFA code in step 2. Verifies the code against either:
 *   - Their TOTP secret (Google Authenticator), OR
 *   - A previously sent email OTP
 *
 * On success:
 *   - Returns { success: true }
 *   - The client calls updateSession({ mfaVerified: true })
 *   - The JWT callback in auth.ts writes this onto the token
 *   - The middleware then grants access to the dashboard
 *
 * On failure:
 *   - Returns { success: false, error: string } with HTTP 401
 *   - The session is NOT upgraded
 *   - The user remains on the MFA step of the login page
 *
 * This endpoint is rate-limited to 5 attempts per 15 minutes
 * to prevent brute-force attacks against 6-digit codes.
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { verifyTOTP, verifyEmailOTP } from '@/lib/mfa'
import { getUserByEmail } from '@/lib/users'
import type { MFAVerifyPayload } from '@/types/grc'

/** Simple in-memory rate limiter: { ip → { attempts, resetAt } } */
const rateLimiter = new Map<string, { attempts: number; resetAt: number }>()
const MAX_ATTEMPTS    = 5
const WINDOW_MS       = 15 * 60 * 1000  // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now    = Date.now()
  const record = rateLimiter.get(ip)

  if (!record || now > record.resetAt) {
    rateLimiter.set(ip, { attempts: 1, resetAt: now + WINDOW_MS })
    return true   // allowed
  }

  if (record.attempts >= MAX_ATTEMPTS) return false  // blocked

  record.attempts++
  return true   // allowed, incremented
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Rate limiting ────────────────────────────────────────────
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: 'Too many attempts. Please wait 15 minutes.' },
      { status: 429 },
    )
  }

  // ── Verify the user has a partial session (completed step 1) ─
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: 'No active session. Please sign in first.' },
      { status: 401 },
    )
  }

  // ── Parse and validate the request body ──────────────────────
  let body: MFAVerifyPayload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body.' },
      { status: 400 },
    )
  }

  const { email, code, method } = body

  // Ensure the email in the request matches the session
  if (email.toLowerCase() !== session.user.email.toLowerCase()) {
    return NextResponse.json(
      { success: false, error: 'Session mismatch.' },
      { status: 403 },
    )
  }

  // ── Look up the user ──────────────────────────────────────────
  const user = await getUserByEmail(email)
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'User not found.' },
      { status: 404 },
    )
  }

  // ── Verify the MFA code ───────────────────────────────────────
  let verified = false

  if (method === 'totp') {
    if (!user.totpSecret) {
      return NextResponse.json(
        { success: false, error: 'TOTP not configured for this account. Contact your administrator.' },
        { status: 400 },
      )
    }
    verified = verifyTOTP(code, user.totpSecret);
  } else if (method === 'email') {
    verified = verifyEmailOTP(email, code);
  } else {
    return NextResponse.json(
      { success: false, error: 'Invalid MFA method.' },
      { status: 400 },
    )
  }

  if (!verified) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired code. Please try again.' },
      { status: 401 },
    )
  }

  // ── Success — the client will call updateSession() ────────────
  // We return the user role so the client can store it if needed.
  return NextResponse.json({
    success: true,
    role: user.role,
  })
}
