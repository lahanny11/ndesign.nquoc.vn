// src/modules/auth/hooks/useAuth.ts
import { useEffect } from 'react'
import { useAuthStore } from '../stores/auth.store'

/** Khởi tạo auth session khi app mount, trả về trạng thái hiện tại */
export function useAuth() {
  const { user, isLoading, isInitialized, initialize, loginWithGoogle, logout } =
    useAuthStore()

  useEffect(() => {
    if (!isInitialized) {
      initialize()
    }
  }, [isInitialized, initialize])

  return { user, isLoading, isInitialized, loginWithGoogle, logout }
}
