// src/modules/orders/hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi, type OrdersQuery, type CreateOrderPayload } from '../api/orders.api'

export function useOrders(query: OrdersQuery = {}) {
  return useQuery({
    queryKey: ['orders', query],
    queryFn:  () => ordersApi.list(query),
    staleTime: 1000 * 30,
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn:  () => ordersApi.getOne(id),
    enabled:  !!id,
    staleTime: 1000 * 30,
  })
}

export function useCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => ordersApi.create(payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}

export function useSelfAssign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ordersApi.selfAssign(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}

export function useAssignDesigner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, designer_person_id }: { id: string; designer_person_id: string }) =>
      ordersApi.assign(id, designer_person_id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}

export function useConfirmDone() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ordersApi.confirmDone(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}

export function useEscalate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      ordersApi.escalate(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}

export function useCheckin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ordersApi.checkin(id),
    onSuccess:  (_data, id) => qc.invalidateQueries({ queryKey: ['orders', id] }),
  })
}
