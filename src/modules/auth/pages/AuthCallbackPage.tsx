'use client'

// src/modules/auth/pages/AuthCallbackPage.tsx
// Callback sau Google OAuth — Central Auth upsert persons + provision local user
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@shared/config/supabase'
import { useAuthStore } from '../stores/auth.store'

export default function AuthCallbackPage() {
  const router   = useRouter()
  const initialize = useAuthStore(s => s.initialize)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        await initialize()
        router.replace('/dashboard')
      } else {
        router.replace('/')
      }
    })
  }, [initialize, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#6C6BAE] border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
        <p className="text-sm text-gray-500">Đang xác thực...</p>
      </div>
    </div>
  )
}
