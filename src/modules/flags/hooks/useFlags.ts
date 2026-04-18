// src/modules/flags/hooks/useFlags.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { flagsApi } from '../api/flags.api'
import type { ResolveFlagPayload } from '../types'

export function useFlags(orderId: string) {
  return useQuery({
    queryKey: ['flags', orderId],
    queryFn:  () => flagsApi.list(orderId),
    enabled:  !!orderId,
  })
}

export function useResolveFlag(orderId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ flagId, payload }: { flagId: string; payload: ResolveFlagPayload }) =>
      flagsApi.resolve(orderId, flagId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['flags', orderId] })
      qc.invalidateQueries({ queryKey: ['order-detail', orderId] })
      qc.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
