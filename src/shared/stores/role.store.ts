import { create } from 'zustand'

export type AppRole = 'design_leader' | 'co_leader' | 'designer' | 'orderer'

interface RoleStore {
  role: AppRole
  setRole: (role: AppRole) => void
}

// Guard SSR: window không tồn tại trên server
function getRoleFromUrl(): AppRole {
  if (typeof window === 'undefined') return 'design_leader'
  const params = new URLSearchParams(window.location.search)
  const r = params.get('role')
  if (r === 'designer' || r === 'orderer' || r === 'design_leader' || r === 'co_leader') return r
  return 'design_leader'
}

export const useRoleStore = create<RoleStore>((set) => ({
  role: getRoleFromUrl(),
  setRole: (role) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('role', role)
      window.history.replaceState({}, '', url.toString())
    }
    set({ role })
  },
}))
