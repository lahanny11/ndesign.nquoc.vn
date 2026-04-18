// src/modules/notifications/hooks/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '../api/notifications.api'

// Poll every 30 seconds per spec
const POLL_INTERVAL = 30_000

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn:  () => notificationsApi.list(),
    refetchInterval: POLL_INTERVAL,
  })
}

export function useUnreadCount() {
  const { data = [] } = useNotifications()
  return data.filter(n => !n.is_read).length
}

export function useMarkRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
