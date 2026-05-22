/**
 * @file auth.ts
 * @description NextAuth v5 (App Router) configuration.
 *
 * Authentication model:
 * ─────────────────────
 * There is NO registration flow. User accounts are created by
 * administrators and distributed to authorised staff. This mirrors
 * how enterprise IAM credentials are managed — accounts exist in
 * a configured store (environment variable map for simplicity;
 * replace with your database in production).
 *
 * Login flow (2 steps):
 * ─────────────────────
 * Step 1 — Credentials: email + password verified server-side.
 *           On success, a partial session is created with mfaVerified: false.
 *
 * Step 2 — MFA: user submits either:
 *   (a) TOTP code from Google Authenticator / Authy app, OR
 *   (b) 6-digit code sent to their registered email address.
 *           On success, session is upgraded to mfaVerified: true.
 *
 * Only sessions with mfaVerified: true can access the GRC dashboard.
 * The middleware enforces this on every request — not just at login.
 *
 * Replacing the user store:
 * ─────────────────────────
 * The AUTHORISED_USERS env var is a JSON array for zero-dependency
 * deployment. In production, replace the `getUserByEmail()` and
 * `verifyPassword()` calls in the authorize() callback with your
 * database queries (Prisma, Drizzle, etc.).
 */

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'
import { verifyPassword, getUserByEmail } from '@/lib/users'

/**
 * NextAuth v5 configuration object.
 * Exported as `authConfig` for use in middleware (edge-compatible subset).
 */
export const authConfig: NextAuthConfig = {
  /**
   * Custom pages — override NextAuth defaults so we control
   * the login UI completely.
   */
  pages: {
    signIn: '/login',
    error:  '/login',
  },

  /**
   * JWT session strategy — no database required for session storage.
   * The session token is stored in an httpOnly cookie.
   */
  session: {
    strategy: 'jwt',
    /**
     * Session expires after 8 hours of inactivity.
     * Appropriate for a business-hours internal tool.
     */
    maxAge: 8 * 60 * 60,
  },

  providers: [
    /**
     * Credentials provider — validates email + password.
     * MFA is NOT completed here; this is step 1 only.
     * The session is marked mfaVerified: false until the
     * /api/auth/mfa-verify endpoint upgrades it.
     */
    Credentials({
      name: 'GRC Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string
          password: string
        }

        if (!email || !password) return null

        // Look up the user in the configured user store
        const user = await getUserByEmail(email)
        if (!user) return null

        // Verify the password (bcrypt comparison in production)
        const valid = await verifyPassword(password, user.hashedPassword)
        if (!valid) return null

        // Return the user — mfaVerified starts false
        // The JWT callback below persists this onto the token
        return {
          id:    user.id,
          email: user.email,
          name:  user.name,
          role:  user.role,
        }
      },
    }),
  ],

  callbacks: {
    /**
     * jwt callback — runs every time a JWT is created or updated.
     * We persist the role and mfaVerified flag onto the token here.
     *
     * When `mfaVerified` is set to true (by the MFA verify endpoint
     * calling `updateSession`), this callback re-runs and the
     * updated value is written into the cookie.
     */
    async jwt({ token, user, trigger, session }) {
      // On initial sign-in, copy user fields onto the token
      if (user) {
        token.id          = user.id
        token.role        = (user as { role?: string }).role ?? 'viewer'
        token.mfaVerified = false   // always starts false — MFA step required
      }

      // When the client calls updateSession(), merge the new data
      if (trigger === 'update' && session?.mfaVerified === true) {
        token.mfaVerified = true
      }

      return token
    },

    /**
     * session callback — shapes the session object exposed to
     * `auth()` in server components and `useSession()` in client components.
     */
    async session({ session, token }) {
      if (token) {
        session.user.id          = token.id          as string
        session.user.role        = token.role        as string
        ;(session as { mfaVerified?: boolean }).mfaVerified = token.mfaVerified as boolean
      }
      return session
    },

    /**
     * authorized callback — called by middleware on every request.
     * Returns true only if:
     * 1. The request is for the /login page (always allow), OR
     * 2. The session exists AND mfaVerified is true.
     *
     * This means a user who completed step 1 (credentials) but NOT
     * step 2 (MFA) is redirected back to /login — not given partial access.
     */
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl
      const isLoginPage  = pathname.startsWith('/login')
      const isApiAuth    = pathname.startsWith('/api/auth')

      // Always allow the login page and NextAuth API routes
      if (isLoginPage || isApiAuth) return true

      // Require a fully-verified session for everything else
      const session = auth as { mfaVerified?: boolean } | null
      return session?.mfaVerified === true
    },
  },
}

/**
 * Named exports for use throughout the application.
 *
 * Usage:
 *   Server components / API routes:  import { auth } from '@/lib/auth'
 *   Middleware:                       import { auth } from '@/lib/auth'
 *   Login action:                     import { signIn, signOut } from '@/lib/auth'
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
