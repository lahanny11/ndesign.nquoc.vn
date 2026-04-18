// src/shared/types/auth.types.ts
// Re-exports from the canonical auth types file.
// Keep this shim so existing imports from auth.types continue to compile.

export type { Role as UserRole, AuthUser, TeamSlug, MemberStatus } from './auth'

// Legacy shape kept for backward compat with useCurrentUser / old components
export interface Team {
  id: string
  name: string
  slug: string
}

export interface UserProfile {
  id: string
  email: string
  display_name: string
  avatar_url: string | null
  role: import('./auth').Role
  team: Team
  is_active: boolean
}
