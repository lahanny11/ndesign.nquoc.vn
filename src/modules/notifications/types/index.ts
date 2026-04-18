// src/modules/notifications/types/index.ts

export type NotificationType =
  | 'order_assigned'
  | 'flag_triggered'
  | 'status_changed'
  | 'revision_exceeded'
  | 'leader_intervention_needed'

export interface NotificationItem {
  id: string
  order_id: string | null
  order_number: string | null
  type: NotificationType
  title: string
  body: string
  is_read: boolean
  created_at: string
  metadata: Record<string, unknown> | null
}
