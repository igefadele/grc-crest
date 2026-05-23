/**
 * @file page.tsx
 * @description GRC Crest - Command Center login page.
 *
 * Two-step login flow:
 * ────────────────────
 * STEP 1 — Credentials
 *   User enters email + password.
 *   On success: NextAuth creates a partial session (mfaVerified: false)
 *   and the UI advances to step 2.
 *
 * STEP 2 — MFA
 *   User enters either:
 *   (a) 6-digit TOTP code from Google Authenticator / Authy, OR
 *   (b) 6-digit code sent to their email address.
 *   On success: session is upgraded (mfaVerified: true) and the user
 *   is redirected to the dashboard.
 *
 * No registration flow exists. Accounts are provisioned by administrators
 * and distributed through the organisation's IAM processes.
 *
 * Design choices:
 * ───────────────
 * - Matches the GRC Crest - Command Center dark terminal aesthetic
 * - Error messages are deliberately vague on step 1 to prevent
 *   user enumeration ("Invalid credentials" not "User not found")
 * - The MFA method toggle (authenticator app vs email) lets the user
 *   choose their preferred method if they have both configured
 */

'use client'

import { useState, useTransition } from 'react'
import { signIn, useSession }      from 'next-auth/react'
import { useRouter }               from 'next/navigation'
import { GlowButton }              from '@/components/ui/GlowButton'
import type { MFAMethod }          from '@/types/grc'

// ─── Step type ───────────────────────────────────────────────────────────────

type LoginStep = 'credentials' | 'mfa'

// ─── Login Page ──────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter()
  const { update } = useSession()

  // Form state
  const [step,        setStep]        = useState<LoginStep>('credentials')
  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [mfaCode,     setMfaCode]     = useState('')
  const [mfaMethod,   setMfaMethod]   = useState<MFAMethod>('totp')
  const [error,       setError]       = useState<string | null>(null)
  const [emailSent,   setEmailSent]   = useState(false)
  const [isPending,   startTransition] = useTransition()

  // ── Step 1: Credentials ────────────────────────────────────────
  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,   // We handle redirect manually after MFA
      })

      if (result?.error) {
        // Deliberate vagueness — do not reveal whether the email exists
        setError('Invalid credentials. Please check your email and password.')
        return
      }

      // Step 1 succeeded — advance to MFA
      setStep('mfa')
    })
  }

  // ── Send email OTP ─────────────────────────────────────────────
  async function sendEmailCode() {
    setError(null)
    try {
      const res = await fetch('/api/auth/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setEmailSent(true)
      } else {
        setError('Failed to send email code. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    }
  }

  // ── Step 2: MFA verification ───────────────────────────────────
  async function handleMFASubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      // Send code to the MFA verification endpoint
      const res = await fetch('/api/auth/mfa-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: mfaCode, method: mfaMethod }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error ?? 'MFA verification failed. Please try again.')
        return
      }

      // MFA passed — upgrade the session to mfaVerified: true
      // NextAuth's updateSession() triggers the jwt callback which
      // writes mfaVerified: true onto the token
      await update({ mfaVerified: true })

      // Redirect to the dashboard
      router.push('/')
      router.refresh()
    })
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-md px-4">

      {/* Logo header */}
      <div className="flex items-center gap-3 mb-8 justify-center">
        <div
          className="w-10 h-10 flex items-center justify-center text-base font-bold border-2"
          style={{
            color: 'var(--color-accent)',
            borderColor: 'var(--color-accent)',
            boxShadow: '0 0 20px var(--color-accent-glow)',
          }}
        >
          ⬡
        </div>
        <div>
          <div className="text-sm font-bold tracking-widest" style={{ color: 'var(--color-text)' }}>
            GRC CREST - COMMAND CENTER
          </div>
          <div className="text-[9px] tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
            AUTHORISED ACCESS ONLY
          </div>
        </div>
      </div>

      {/* Main card */}
      <div
        className="border p-8"
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-6">
          {(['credentials', 'mfa'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-5 h-5 flex items-center justify-center text-[9px] font-bold border"
                style={{
                  borderColor: step === s || (i === 0 && step === 'mfa')
                    ? 'var(--color-accent)'
                    : 'var(--color-border)',
                  color: step === s || (i === 0 && step === 'mfa')
                    ? 'var(--color-accent)'
                    : 'var(--color-text-dim)',
                  background: step === s || (i === 0 && step === 'mfa')
                    ? 'var(--color-accent-glow)'
                    : 'transparent',
                }}
              >
                {i === 0 && step === 'mfa' ? '✓' : i + 1}
              </div>
              <span
                className="text-[9px] tracking-widest"
                style={{
                  color: step === s ? 'var(--color-text)' : 'var(--color-text-dim)',
                }}
              >
                {s === 'credentials' ? 'CREDENTIALS' : 'MFA VERIFICATION'}
              </span>
              {i === 0 && (
                <span className="text-[9px]" style={{ color: 'var(--color-border)' }}>→</span>
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Credentials form ── */}
        {step === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[9px] tracking-widest mb-1.5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@yourcompany.com"
                className="w-full px-3 py-2.5 text-[11px]"
                style={{
                  background: 'var(--color-surface-alt)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[9px] tracking-widest mb-1.5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full px-3 py-2.5 text-[11px]"
                style={{
                  background: 'var(--color-surface-alt)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            {error && (
              <div
                className="px-3 py-2 text-[10px] border"
                style={{
                  background: 'var(--color-red-glow)',
                  borderColor: 'var(--color-red)',
                  color: 'var(--color-red)',
                }}
              >
                {error}
              </div>
            )}

            <GlowButton
              type="submit"
              color={isPending ? 'var(--color-text-dim)' : 'var(--color-accent)'}
              disabled={isPending || !email || !password}
              className="w-full !py-3 mt-1"
            >
              {isPending ? '⟳  VERIFYING...' : 'CONTINUE →'}
            </GlowButton>
          </form>
        )}

        {/* ── STEP 2: MFA form ── */}
        {step === 'mfa' && (
          <form onSubmit={handleMFASubmit} className="flex flex-col gap-4">

            {/* Method selector */}
            <div>
              <div className="text-[9px] tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
                VERIFICATION METHOD
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'totp'  as MFAMethod, label: '⊞ Authenticator App', sublabel: 'Google / Microsoft / Authy' },
                  { value: 'email' as MFAMethod, label: '✉ Email Code',         sublabel: `Send to ${email}` },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setMfaMethod(opt.value)
                      setError(null)
                      if (opt.value === 'email' && !emailSent) sendEmailCode()
                    }}
                    className="p-3 text-left border transition-all duration-150"
                    style={{
                      background: mfaMethod === opt.value
                        ? 'var(--color-accent-glow)'
                        : 'var(--color-surface-alt)',
                      borderColor: mfaMethod === opt.value
                        ? 'var(--color-accent)'
                        : 'var(--color-border)',
                    }}
                  >
                    <div className="text-[10px] font-semibold mb-0.5" style={{ color: 'var(--color-text)' }}>
                      {opt.label}
                    </div>
                    <div className="text-[9px]" style={{ color: 'var(--color-text-dim)' }}>
                      {opt.sublabel}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Email sent confirmation */}
            {mfaMethod === 'email' && emailSent && (
              <div
                className="px-3 py-2 text-[10px] border"
                style={{
                  background: 'var(--color-green-glow)',
                  borderColor: 'var(--color-green)',
                  color: 'var(--color-green)',
                }}
              >
                ✓ Code sent to {email}. Check your inbox — expires in 10 minutes.
              </div>
            )}

            {/* TOTP instructions */}
            {mfaMethod === 'totp' && (
              <div
                className="px-3 py-2 text-[10px]"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Open your authenticator app and enter the 6-digit code for{' '}
                <span style={{ color: 'var(--color-accent)' }}>GRC Crest - Command Center</span>.
              </div>
            )}

            {/* Code input */}
            <div>
              <label
                htmlFor="mfaCode"
                className="block text-[9px] tracking-widest mb-1.5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                6-DIGIT VERIFICATION CODE
              </label>
              <input
                id="mfaCode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                autoComplete="one-time-code"
                placeholder="000000"
                className="w-full px-3 py-3 text-center text-2xl tracking-[0.5em]"
                style={{
                  background: 'var(--color-surface-alt)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-accent)',
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </div>

            {error && (
              <div
                className="px-3 py-2 text-[10px] border"
                style={{
                  background: 'var(--color-red-glow)',
                  borderColor: 'var(--color-red)',
                  color: 'var(--color-red)',
                }}
              >
                {error}
              </div>
            )}

            <GlowButton
              type="submit"
              color={isPending ? 'var(--color-text-dim)' : 'var(--color-green)'}
              disabled={isPending || mfaCode.length !== 6}
              className="w-full !py-3 mt-1"
            >
              {isPending ? '⟳  VERIFYING...' : '⬡  VERIFY & ACCESS DASHBOARD'}
            </GlowButton>

            <button
              type="button"
              onClick={() => { setStep('credentials'); setError(null); setMfaCode('') }}
              className="text-[9px] tracking-widest text-center w-full py-1 transition-colors"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-dim)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
              }}
            >
              ← BACK TO CREDENTIALS
            </button>
          </form>
        )}
      </div>

      {/* Legal notice */}
      <p
        className="text-center text-[9px] mt-6 leading-relaxed"
        style={{ color: 'var(--color-text-dim)' }}
      >
        This system is for authorised personnel only.<br />
        All access is logged and monitored.<br />
        Unauthorised access will be prosecuted.
      </p>
    </div>
  )
}
