// src/modules/flags/api/flags.api.ts
import { api } from '@shared/config/api-client'
import type { Flag, ResolveFlagPayload } from '../types'

export const flagsApi = {
  list:    (orderId: string) =>
    api.get<Flag[]>(`/orders/${orderId}/flags`),

  resolve: (orderId: string, flagId: string, payload: ResolveFlagPayload) =>
    api.patch<Flag>(`/orders/${orderId}/flags/${flagId}/resolve`, payload),
}
