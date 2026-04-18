// src/modules/notifications/index.ts
export * from './types'
export { notificationsApi } from './api/notifications.api'
export { useNotifications, useUnreadCount, useMarkRead } from './hooks/useNotifications'
export { NotificationBell } from './components/NotificationBell'
