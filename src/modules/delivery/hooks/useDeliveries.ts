// src/modules/delivery/hooks/useDeliveries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deliveryApi } from '../api/delivery.api'
import type { CreateDeliveryPayload } from '../types'

export function useDeliveries(orderId: string) {
  return useQuery({
    queryKey: ['deliveries', orderId],
    queryFn:  () => deliveryApi.list(orderId),
    enabled:  !!orderId,
  })
}

export function useCreateDelivery(orderId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateDeliveryPayload) => deliveryApi.create(orderId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deliveries', orderId] })
      qc.invalidateQueries({ queryKey: ['order-detail', orderId] })
      qc.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useConfirmDelivery(orderId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (deliveryId: string) => deliveryApi.confirm(orderId, deliveryId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deliveries', orderId] })
      qc.invalidateQueries({ queryKey: ['order-detail', orderId] })
      qc.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
