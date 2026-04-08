import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../shared/config/api-client'
import type { DashboardStats } from '../types/dashboard.types'

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiClient.get<DashboardStats>('/api/v1/dashboard/stats'),
  })
}
