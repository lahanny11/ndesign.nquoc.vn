// src/modules/orders/stores/orders.store.ts
// Client state: order hiện đang mở trong TrackingPanel
import { create } from 'zustand'

interface OrdersUIState {
  activeOrderId: string | null
  isTrackingOpen: boolean

  openTracking:  (orderId: string) => void
  closeTracking: () => void
}

export const useOrdersStore = create<OrdersUIState>((set) => ({
  activeOrderId:  null,
  isTrackingOpen: false,

  openTracking:  (orderId) => set({ activeOrderId: orderId, isTrackingOpen: true }),
  closeTracking: ()        => set({ activeOrderId: null,    isTrackingOpen: false }),
}))
