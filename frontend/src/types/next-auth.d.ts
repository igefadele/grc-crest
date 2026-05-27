/**
 * @file next-auth.d.ts
 * @description NextAuth v5 TypeScript module augmentation.
 *
 * NextAuth provides a default Session and JWT type. We extend them here
 * to include our custom fields (role, mfaVerified) so TypeScript
 * knows about them everywhere `auth()` or `useSession()` is called.
 *
 * Without this file, accessing `session.user.role` or
 * `session.mfaVerified` would cause TypeScript errors.
 */

import type { DefaultSession, DefaultJWT } from 'next-auth'

type UserRole = 'admin' | 'analyst' | 'viewer'

declare module 'next-auth' {
  interface Session {
    /** Whether the user has completed the MFA step in this session. */
    mfaVerified: boolean
    user: {
      id:   string
      role: UserRole
    } & DefaultSession['user']
  }

  interface User {
    role?: UserRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id:           string
    role:         UserRole
    mfaVerified:  boolean
  }
}
