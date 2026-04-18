// src/routes/protected.routes.tsx
// Protected route definitions (auth + role required).
// In Next.js this maps to app/(protected)/ — kept here as a reference/registry.

import type { Role } from '@shared/types/auth'

export const PROTECTED_ROUTES = {
  DASHBOARD:       '/dashboard',
  ANALYTICS:       '/analytics',
  WORKLOAD:        '/workload',
  BRAND_GUIDELINE: '/brand-guideline',
  SOP_CHECKLIST:   '/sop-checklist',
} as const

export type ProtectedRoute = (typeof PROTECTED_ROUTES)[keyof typeof PROTECTED_ROUTES]

/** Roles that may access each protected route. Empty array = all authenticated roles. */
export const ROUTE_ROLES: Record<ProtectedRoute, Role[]> = {
  [PROTECTED_ROUTES.DASHBOARD]:       [],
  [PROTECTED_ROUTES.ANALYTICS]:       ['design_leader', 'co_leader'],
  [PROTECTED_ROUTES.WORKLOAD]:        ['design_leader', 'co_leader'],
  [PROTECTED_ROUTES.BRAND_GUIDELINE]: [],
  [PROTECTED_ROUTES.SOP_CHECKLIST]:   [],
}
