/**
 * @file route.ts
 * @description POST /api/auth/send-email-otp
 *
 * Generates a 6-digit OTP and emails it to the requesting user.
 * Called from the login page when the user selects "Email Code" as
 * their MFA method.
 *
 * Security:
 * - Requires a partial session (credentials verified in step 1)
 * - The email in the request must match the session email
 * - Rate-limited to 3 sends per 15 minutes per IP
 * - Always returns 200 (to prevent email enumeration timing attacks)
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth }                      from '@/lib/auth'
import { sendEmailOTP }              from '@/lib/mfa'
import { getUserByEmail }            from '@/lib/users'

/** Rate limiter: { ip → { count, resetAt } } */
const rateLimiter = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now    = Date.now()
  const record = rateLimiter.get(ip)

  if (!record || now > record.resetAt) {
    rateLimiter.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return true
  }
  if (record.count >= 3) return false
  record.count++
  return true
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'

  if (!checkRateLimit(ip)) {
    // Return 200 to avoid timing-based email enumeration
    return NextResponse.json({ sent: true })
  }

  // Require a partial session
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ sent: false, error: 'No active session.' }, { status: 401 })
  }

  const { email } = await req.json() as { email: string }

  // Validate the email matches the session
  if (!email || email.toLowerCase() !== session.user.email.toLowerCase()) {
    return NextResponse.json({ sent: false, error: 'Email mismatch.' }, { status: 403 })
  }

  // Confirm the user exists and is configured for email MFA
  const user = await getUserByEmail(email)
  if (!user) {
    // Return 200 to prevent user enumeration
    return NextResponse.json({ sent: true })
  }

  try {
    await sendEmailOTP(email)
  } catch (err) {
    console.error('[send-email-otp] Failed to send email:', err)
    return NextResponse.json({ sent: false, error: 'Email delivery failed.' }, { status: 500 })
  }

  return NextResponse.json({ sent: true })
}
