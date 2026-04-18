'use client'

// src/modules/auth/stores/auth.store.ts
import { create } from 'zustand'
import { supabase } from '@shared/config/supabase'
import { authApi } from '../api/auth.api'
import type { AuthUser } from '@shared/types/auth'

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isInitialized: boolean

  initialize: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  // 1. App mở → kiểm tra session → GET /api/auth/me
  initialize: async () => {
    set({ isLoading: true })
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        set({ user: null, isInitialized: true, isLoading: false })
        return
      }
      const user = await authApi.getMe()
      set({ user, isInitialized: true, isLoading: false })
    } catch {
      set({ user: null, isInitialized: true, isLoading: false })
    }
  },

  // 4. Nhấn Google → OAuth
  loginWithGoogle: async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/auth-callback`
          : undefined,
      },
    })
  },

  // Logout → clear store + supabase session
  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, isInitialized: false })
  },
}))
