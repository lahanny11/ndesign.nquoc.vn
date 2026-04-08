import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../config/supabase'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    // Dev bypass: skip auth khi VITE_DEV_BYPASS=true
    if (import.meta.env.VITE_DEV_BYPASS === 'true') {
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
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7fb]">
        <div className="w-8 h-8 border-2 border-[#6C6BAE] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!authenticated) return <Navigate to="/" replace />

  return <>{children}</>
}
