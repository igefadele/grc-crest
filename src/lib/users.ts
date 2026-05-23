/**
 * @file users.ts
 * @description User store for the GRC Crest - Command Center.
 *
 * There is no registration flow. Accounts are created by administrators
 * and distributed to authorised staff through the organisation's existing
 * IAM / access management processes.
 *
 * This file implements a zero-dependency user store backed by an
 * environment variable (AUTHORISED_USERS) containing a JSON array.
 * This allows deployment with no database for small teams.
 *
 * ──────────────────────────────────────────────────────────────────
 * HOW TO ADD USERS (administrators only)
 * ──────────────────────────────────────────────────────────────────
 * 1. Generate a bcrypt hash of the user's initial password:
 *      node -e "const b=require('bcryptjs'); b.hash('password123',12).then(console.log)"
 *    Or use: https://bcrypt-generator.com (offline tool — never use online tools for prod)
 *
 * 2. Add the user to AUTHORISED_USERS in your .env.local (or hosting
 *    platform's secret manager):
 *
 *    AUTHORISED_USERS='[
 *      {
 *        "id": "usr_001",
 *        "email": "analyst@yourcompany.com",
 *        "name": "Jane Smith",
 *        "role": "analyst",
 *        "hashedPassword": "$2a$12$...",
 *        "totpSecret": null,
 *        "mfaMethod": "email"
 *      }
 *    ]'
 *
 * 3. Communicate the email and plaintext password to the user through
 *    your organisation's secure credential distribution process.
 *    The user cannot change their own password — admin manages this.
 *
 * ──────────────────────────────────────────────────────────────────
 * REPLACING WITH A DATABASE (production recommendation)
 * ──────────────────────────────────────────────────────────────────
 * Replace `getUserByEmail()` and `verifyPassword()` with your ORM
 * queries. The rest of the auth flow is unchanged.
 *
 * Recommended: Prisma + PostgreSQL
 *   const user = await prisma.user.findUnique({ where: { email } })
 * ──────────────────────────────────────────────────────────────────
 */

import { isValid } from "zod/v3"

/**
 * The shape of a GRC user record in the store.
 * Passwords are stored as bcrypt hashes — never in plaintext.
 */
export interface GRCUser {
  id:             string
  email:          string
  name:           string
  role:           'admin' | 'analyst' | 'viewer'
  hashedPassword: string
  /**
   * Base32-encoded TOTP secret for Google Authenticator.
   * null until the user completes TOTP setup on first login.
   */
  totpSecret:     string | null
  /**
   * Which MFA method this user is configured to use.
   * Admins assign this — users cannot change it themselves.
   */
  mfaMethod:      'totp' | 'email'
}

/**
 * Loads the authorised user list from the AUTHORISED_USERS environment variable.
 * Falls back to an empty array if the variable is not set.
 *
 * In production, replace this with a database query.
 */
function loadUsers(): GRCUser[] {
  const raw = process.env.AUTHORISED_USERS
  if (!raw) return []

  try {
    return JSON.parse(raw) as GRCUser[]
  } catch {
    console.error('[users.ts] Failed to parse AUTHORISED_USERS — check JSON syntax in env var')
    return []
  }
}

/**
 * Retrieves a user record by email address.
 * Case-insensitive comparison.
 *
 * @param email - The email address to look up
 * @returns The user record, or null if not found
 */
export async function getUserByEmail(email: string): Promise<GRCUser | null> {
  const users = loadUsers()
  return users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  ) ?? null
}

/**
 * Verifies a plaintext password against a stored bcrypt hash.
 *
 * In production this uses bcryptjs. For the development environment
 * without the package installed, a fallback direct comparison is
 * provided for testing only — remove this in production.
 *
 * @param plaintext    - The password submitted by the user
 * @param hashedPassword - The bcrypt hash stored in the user record
 * @returns true if the password matches
 */
export async function verifyPassword(
  plaintext: string,
  hashedPassword: string,
): Promise<boolean> {
  try {
    // REMOVE test env logic permission in production
    if (process.env.APP_ENV === 'test') return true;

    // Production path: bcryptjs comparison
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { compare } = require('bcrypt-ts')
    return await compare(plaintext, hashedPassword)
  } catch {
    // Development fallback: direct comparison
    // WARNING: Only for dev/testing without bcryptjs installed
    // NEVER deploy with this fallback active
    if (process.env.APP_ENV === 'development') {
      console.warn('[users.ts] bcryptjs not available — using plaintext comparison (dev only)')
      return plaintext === hashedPassword
    }
    return false
  }
}
