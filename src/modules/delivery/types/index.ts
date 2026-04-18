// src/modules/delivery/types/index.ts

export type DeliveryLinkType = 'google_drive' | 'canva' | 'figma' | 'other'

export interface Delivery {
  id: string
  order_id: string
  round: number
  link_url: string
  link_type: DeliveryLinkType
  link_label: string
  note: string | null
  delivered_by: string
  delivered_at: string
  is_confirmed: boolean
  confirmed_at: string | null
}

export interface CreateDeliveryPayload {
  link_url: string
  note?: string | null
}
