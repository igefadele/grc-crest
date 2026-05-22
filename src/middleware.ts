/**
 * @file middleware.ts
 * @description Next.js middleware — runs on every request before page rendering.
 *
 * This is the single enforcement point for authentication.
 * It ensures that:
 *
 * 1. Every route except /login and /api/auth/* requires a valid,
 *    MFA-verified session.
 *
 * 2. Users who have completed credentials (step 1) but NOT MFA (step 2)
 *    are redirected back to /login — they do NOT get partial access to
 *    the dashboard.
 *
 * 3. Authenticated users visiting /login are redirected to the dashboard.
 *
 * WHY HERE AND NOT IN EACH PAGE?
 * ───────────────────────────────
 * Checking auth in individual page components is unreliable — if a new
 * page is added without an auth check, it is publicly accessible.
 * Middleware runs before any page renders, so there is no way to forget.
 *
 * The `authorized` callback in src/lib/auth.ts contains the actual logic.
 * This file simply activates it for the correct set of routes.
 */

export { auth as middleware } from '@/lib/auth'

/**
 * Matcher configuration — controls which routes this middleware runs on.
 *
 * Excluded (middleware does NOT run on these):
 *   - _next/static/*  — Next.js static assets (JS, CSS, fonts)
 *   - _next/image/*   — Next.js image optimisation
 *   - favicon.ico     — Browser favicon
 *   - public/*        — Static files in the /public directory
 *
 * Everything else, including all pages and API routes, goes through
 * the auth check in the `authorized` callback.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
