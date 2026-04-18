// src/modules/notifications/api/notifications.api.ts
import { api } from '@shared/config/api-client'
import type { NotificationItem } from '../types'

export const notificationsApi = {
  list: (unreadOnly = false) =>
    api.get<NotificationItem[]>(`/notifications${unreadOnly ? '?unread_only=true' : ''}`),

  markRead: (id: string) =>
    api.patch<NotificationItem>(`/notifications/${id}/read`, {}),
}
