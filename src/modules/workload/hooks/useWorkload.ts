// src/modules/workload/hooks/useWorkload.ts
import { useQuery } from '@tanstack/react-query'
import { workloadApi } from '../api/workload.api'

export function useWorkload() {
  return useQuery({
    queryKey: ['dashboard', 'workload'],
    queryFn:  workloadApi.getWorkload,
    staleTime: 1000 * 60,
  })
}
