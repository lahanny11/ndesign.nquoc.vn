// src/shared/hooks/useCurrentUser.ts
// Returns the currently authenticated user from the auth store.
// Prefers the new AuthUser shape; also exposes a legacy UserProfile adapter
// so existing components that read `.role` / `.display_name` keep working.

import { useAuthStore } from '@modules/auth/stores/auth.store'
import type { AuthUser } from '@shared/types/auth'

export function useCurrentUser(): {
  user: AuthUser | null
  isLoading: boolean
  isInitialized: boolean
} {
  const user          = useAuthStore(s => s.user)
  const isLoading     = useAuthStore(s => s.isLoading)
  const isInitialized = useAuthStore(s => s.isInitialized)
  return { user, isLoading, isInitialized }
}

/** Convenience selector — returns the primary role or null. */
export function useCurrentRole() {
  const user = useAuthStore(s => s.user)
  return user?.primary_role ?? null
}
