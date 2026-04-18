// src/modules/orders/api/orders.api.ts
import { api } from '@shared/config/api-client'
import type { Order } from '../types'

export interface OrdersQuery {
  status?: string
  page?: number
  limit?: number
}

export interface CreateOrderPayload {
  task_name: string
  team_id: string
  product_type_id: string
  product_size_label: string
  brief: string
  deadline: string
  is_urgent?: boolean
  color_palette?: string[]
  reference_image_urls?: string[]
  style_description?: string
}

export const ordersApi = {
  list:       (query: OrdersQuery = {}) => {
    const params = new URLSearchParams()
    if (query.status) params.set('status', query.status)
    if (query.page)   params.set('page',   String(query.page))
    if (query.limit)  params.set('limit',  String(query.limit))
    const qs = params.toString()
    return api.get<Order[]>(`/orders${qs ? '?' + qs : ''}`)
  },
  getOne:     (id: string)                          => api.get<Order>(`/orders/${id}`),
  create:     (payload: CreateOrderPayload)         => api.post<Order>('/orders', payload),
  start:      (id: string)                          => api.post<Order>(`/orders/${id}/start`),
  selfAssign: (id: string)                          => api.post<Order>(`/orders/${id}/self-assign`),
  assign:     (id: string, designer_person_id: string) =>
    api.post<Order>(`/orders/${id}/assignments`, { designer_person_id }),
  confirmDone:(id: string)                          => api.post(`/orders/${id}/confirm-done`),
  escalate:   (id: string, reason: string)          => api.post(`/orders/${id}/escalate`, { reason }),
  checkin:    (id: string)                          => api.post(`/orders/${id}/checkin`),
}
