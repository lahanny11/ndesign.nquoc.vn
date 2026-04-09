import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../shared/config/api-client'
import type { AnalyticsPeriod, AnalyticsData } from '../types/analytics.types'

export function useAnalytics(period: AnalyticsPeriod, from?: string, to?: string) {
  return useQuery({
    queryKey: ['analytics', period, from, to],
    queryFn: () => {
      let url = `/api/v1/analytics?period=${period}`
      if (from) url += `&from=${from}`
      if (to) url += `&to=${to}`
      return apiClient.get<AnalyticsData>(url)
    },
    staleTime: 60_000,
  })
}
