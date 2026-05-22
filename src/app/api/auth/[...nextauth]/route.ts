/**
 * @file route.ts
 * @description NextAuth v5 catch-all route handler for the App Router.
 *
 * This single file handles all NextAuth endpoints:
 *   GET  /api/auth/session
 *   POST /api/auth/signin
 *   POST /api/auth/signout
 *   GET  /api/auth/csrf
 *   GET  /api/auth/providers
 *
 * In NextAuth v5 (beta), the handlers are exported directly from
 * the auth() call in src/lib/auth.ts.
 */

export { handlers as GET, handlers as POST } from '@/lib/auth'

// Re-export so Next.js recognises the named exports
import { handlers } from '@/lib/auth'
export { handlers }
