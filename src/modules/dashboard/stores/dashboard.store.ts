import { create } from 'zustand'
import type { FilterTab } from '../types/dashboard.types'

interface DashboardStore {
  activeTab: FilterTab
  setActiveTab: (tab: FilterTab) => void
  panelOrderId: string | null
  openPanel: (id: string) => void
  closePanel: () => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  activeTab: 'all',
  setActiveTab: (tab) => set({ activeTab: tab }),
  panelOrderId: null,
  openPanel: (id) => set({ panelOrderId: id }),
  closePanel: () => set({ panelOrderId: null }),
}))
