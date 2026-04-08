import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../shared/config/api-client'
import type { FilterTab, OrderCard } from '../types/dashboard.types'

interface OrdersResponse {
  data: OrderCard[]
  meta: { total: number; has_next: boolean; next_cursor: string | null }
}

function tabToParams(tab: FilterTab): string {
  if (tab === 'pending') return '?status=pending'
  if (tab === 'active')  return '?status=in_progress,assigned'
  if (tab === 'done')    return '?status=done'
  if (tab === 'flag')    return '?has_flag=true'
  return ''
}

export function useOrders(tab: FilterTab) {
  return useQuery<OrdersResponse>({
    queryKey: ['orders', tab],
    queryFn: () => apiClient.get<OrdersResponse>(`/api/v1/orders${tabToParams(tab)}`),
  })
}
