import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../shared/config/api-client'
import type { DesignerWorkload } from '../types/dashboard.types'

export function useDesignerWorkload() {
  return useQuery<DesignerWorkload[]>({
    queryKey: ['designer-workload'],
    queryFn: () => apiClient.get<DesignerWorkload[]>('/api/v1/dashboard/workload'),
    staleTime: 1000 * 60 * 2, // refresh mỗi 2 phút
  })
}
