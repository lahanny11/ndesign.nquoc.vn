// src/modules/delivery/api/delivery.api.ts
import { api } from '@shared/config/api-client'
import type { Delivery, CreateDeliveryPayload } from '../types'

export const deliveryApi = {
  list: (orderId: string) =>
    api.get<Delivery[]>(`/orders/${orderId}/deliveries`),

  create: (orderId: string, payload: CreateDeliveryPayload) =>
    api.post<Delivery>(`/orders/${orderId}/deliveries`, payload),

  confirm: (orderId: string, deliveryId: string) =>
    api.patch<Delivery>(`/orders/${orderId}/deliveries/${deliveryId}/confirm`, {}),
}
