// src/routes/public.routes.tsx
// Public route definitions (no auth required).
// In Next.js this maps to app/(public)/ — kept here as a reference/registry.

export const PUBLIC_ROUTES = {
  LOGIN:         '/',
  AUTH_CALLBACK: '/auth-callback',
} as const

export type PublicRoute = (typeof PUBLIC_ROUTES)[keyof typeof PUBLIC_ROUTES]
