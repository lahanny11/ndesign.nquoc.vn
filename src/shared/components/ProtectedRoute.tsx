'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../config/supabase'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const DEV_BYPASS = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_DEV_BYPASS === 'true'

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (DEV_BYPASS) {
      setAuthenticated(true)
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(!!data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session)
      if (!session) router.replace('/')
    })

    return () => listener.subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7fb]">
        <div className="w-8 h-8 border-2 border-[#6C6BAE] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!authenticated) {
    router.replace('/')
    return null
  }

  return <>{children}</>
}
