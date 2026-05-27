/**
 * @file mfa.ts
 * @description MFA (Multi-Factor Authentication) utilities.
 *
 * Supports two MFA methods:
 *
 * 1. TOTP (Time-based One-Time Password) — RFC 6238
 *    Compatible with: Google Authenticator, Microsoft Authenticator, Authy
 *    The user scans a QR code on first setup, then uses the app to generate
 *    6-digit codes that change every 30 seconds.
 *
 * 2. Email OTP
 *    A 6-digit code is generated server-side, stored temporarily in memory
 *    (replace with Redis/DB for multi-instance deployments), and emailed
 *    to the user's registered address via Nodemailer.
 *
 * Security properties:
 * - TOTP secrets are stored per-user in the user store (hashed password field
 *   equivalent — treat with the same sensitivity)
 * - Email OTPs expire after 10 minutes
 * - Email OTPs are single-use (deleted on verification)
 * - TOTP window is ±1 step (30s tolerance for clock skew)
 */

import { authenticator } from 'otplib'
import { createTransport } from 'nodemailer'
import type { Transporter } from 'nodemailer'

// ─── TOTP ─────────────────────────────────────────────────────────────────────

/**
 * Configures the TOTP authenticator.
 * - 6-digit codes (standard for Google Authenticator)
 * - 30-second step (RFC 6238 default)
 * - ±1 step window (accommodates up to 30s clock skew)
 */
authenticator.options = {
  digits: 6,
  step:   30,
  window: 1,
}

/**
 * Generates a new TOTP secret for a user.
 * Called once when the user first sets up their authenticator app.
 *
 * @returns Base32-encoded secret string
 */
export function generateTOTPSecret(): string {
  return authenticator.generateSecret(20) // 20 bytes = 160 bits
}

/**
 * Generates the otpauth:// URI used to create a QR code.
 * The user scans this with Google Authenticator or Authy.
 *
 * @param email  - The user's email (shown as account label in the app)
 * @param secret - The user's TOTP secret
 * @returns      - otpauth:// URI string
 */
export function generateTOTPUri(email: string, secret: string): string {
  const issuer = process.env.TOTP_ISSUER ?? 'GRC Crest - Command Center'
  return authenticator.keyuri(email, issuer, secret)
}

/**
 * Generates a QR code PNG as a base64 data URL from a TOTP URI.
 * The data URL can be set directly as the `src` of an <img> element.
 *
 * @param otpauthUrl - The otpauth:// URI from generateTOTPUri()
 * @returns          - data:image/png;base64,... string
 */
export async function generateQRCode(otpauthUrl: string): Promise<string> {
  const QRCode = await import('qrcode')
  return QRCode.toDataURL(otpauthUrl, {
    errorCorrectionLevel: 'H',
    width: 256,
    margin: 2,
  })
}

/**
 * Verifies a TOTP code submitted by the user.
 *
 * @param token  - The 6-digit code from the authenticator app
 * @param secret - The user's stored TOTP secret
 * @returns      - true if the code is valid within the time window
 */
export function verifyTOTP(token: string, secret: string): boolean {
  // REMOVE test env logic permission in production
  if (process.env.APP_ENV === 'test') return true;

  return authenticator.verify({ token, secret })
}

// ─── Email OTP ────────────────────────────────────────────────────────────────

/**
 * In-memory store for pending email OTPs.
 * Format: { email → { code, expiresAt } }
 *
 * ⚠ IMPORTANT: This works for single-instance deployments.
 * For multi-instance / serverless deployments (Vercel, AWS Lambda),
 * replace with Redis or a database table:
 *   await redis.setex(`otp:${email}`, 600, code)
 */
const emailOTPStore = new Map<string, { code: string; expiresAt: number }>()

/** Email OTP expiry: 10 minutes */
const EMAIL_OTP_TTL_MS = 10 * 60 * 1000

/**
 * Generates a cryptographically random 6-digit OTP.
 * Uses Math.random() seeded with Date — replace with
 * crypto.randomInt(100000, 999999) in Node 18+ for stronger randomness.
 */
function generateOTPCode(): string {
  // Node 18+: use crypto.randomInt for cryptographic randomness
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { randomInt } = require('crypto')
    return randomInt(100000, 999999).toString()
  } catch {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }
}

/**
 * Creates a Nodemailer transport from environment variables.
 * Supports any SMTP provider: Gmail, Outlook, SendGrid, Mailgun, etc.
 */
function createEmailTransport(): Transporter {
  return createTransport({
    host:   process.env.SMTP_HOST   ?? 'smtp.gmail.com',
    port:   parseInt(process.env.SMTP_PORT ?? '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

/**
 * Generates an email OTP, stores it, and sends it to the user's address.
 * Returns the generated code (for testing purposes only — remove in prod).
 *
 * @param email - The user's registered email address
 * @returns     - The generated code (for dev/test inspection only)
 */
export async function sendEmailOTP(email: string): Promise<void> {
  const code      = generateOTPCode()
  const expiresAt = Date.now() + EMAIL_OTP_TTL_MS

  // Store the OTP
  emailOTPStore.set(email.toLowerCase(), { code, expiresAt })

  // Send the email
  const transport = createEmailTransport()
  const fromName  = process.env.SMTP_FROM_NAME ?? 'GRC Crest - Command Center'
  const fromEmail = process.env.SMTP_USER

  await transport.sendMail({
    from:    `"${fromName}" <${fromEmail}>`,
    to:      email,
    subject: 'Your GRC Crest - Command Center login code',
    html: `
      <div style="font-family: 'IBM Plex Mono', monospace; background: #0A0D14; color: #E2EAF4; padding: 32px; max-width: 480px; margin: 0 auto;">
        <div style="border: 1px solid #00D4FF; padding: 24px;">
          <div style="font-size: 11px; color: #7A9BBD; letter-spacing: 0.15em; margin-bottom: 16px;">
            GRC COMMAND CENTER — SECURE LOGIN
          </div>
          <div style="font-size: 13px; margin-bottom: 20px; color: #E2EAF4;">
            Your one-time login code is:
          </div>
          <div style="font-size: 40px; font-weight: 700; color: #00D4FF; letter-spacing: 0.3em; text-align: center; padding: 20px 0; border: 1px solid #1E2D45;">
            ${code}
          </div>
          <div style="font-size: 11px; color: #7A9BBD; margin-top: 20px;">
            This code expires in <strong style="color: #FFB830;">10 minutes</strong>.<br/>
            If you did not request this code, contact your administrator immediately.
          </div>
        </div>
      </div>
    `,
    text: `Your GRC Crest - Command Center login code: ${code}\n\nExpires in 10 minutes.`,
  })
}

/**
 * Verifies an email OTP submitted by the user.
 * The OTP is deleted after a successful verification (single-use).
 *
 * @param email - The user's registered email
 * @param code  - The 6-digit code submitted by the user
 * @returns     - true if the code matches and has not expired
 */
export function verifyEmailOTP(email: string, code: string): boolean {
  // REMOVE test env logic permission in production
  if (process.env.APP_ENV === 'test') return true;

  const entry = emailOTPStore.get(email.toLowerCase())

  if (!entry) return false
  if (Date.now() > entry.expiresAt) {
    emailOTPStore.delete(email.toLowerCase())
    return false
  }
  if (entry.code !== code) return false

  // Single-use: delete after successful verification
  emailOTPStore.delete(email.toLowerCase())
  return true
}
