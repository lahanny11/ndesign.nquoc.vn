// src/modules/auth/api/auth.api.ts
import { api } from '@shared/config/api-client'
import type { AuthUser } from '@shared/types/auth'

export const authApi = {
  /** GET /api/auth/me — BE validate JWT → trả AuthUser */
  getMe: () => api.get<AuthUser>('/auth/me'),
}
