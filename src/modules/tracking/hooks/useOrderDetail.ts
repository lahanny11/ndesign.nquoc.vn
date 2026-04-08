import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../shared/config/api-client'
import type { OrderDetail } from '../types/tracking.types'

export function useOrderDetail(id: string | null) {
  return useQuery<OrderDetail>({
    queryKey: ['order-detail', id],
    queryFn: () => apiClient.get<OrderDetail>(`/api/v1/orders/${id}`),
    enabled: !!id,
  })
}
