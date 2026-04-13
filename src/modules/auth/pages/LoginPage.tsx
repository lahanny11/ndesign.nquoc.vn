'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../shared/config/supabase'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/dashboard')
    })
  }, [router])

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f0f8] to-[#e8e8f4]">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-[#6C6BAE] flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>N</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#1a1a2e]" style={{ fontFamily: 'Playfair Display, serif' }}>
              N-Design
            </h1>
            <p className="text-sm text-gray-500 mt-1">Order Management · NhiLe Holdings</p>
          </div>
        </div>

        {/* Login button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-gray-200 hover:border-[#6C6BAE] hover:bg-[#f5f5fb] transition-all text-sm font-medium text-gray-700 shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
            <path d="M47.532 24.552c0-1.636-.132-3.2-.388-4.692H24.48v9.022h12.988c-.572 2.98-2.276 5.504-4.832 7.196v5.992h7.816c4.572-4.204 7.08-10.4 7.08-17.518z" fill="#4285F4"/>
            <path d="M24.48 48c6.52 0 11.988-2.16 15.984-5.868l-7.816-5.992c-2.16 1.448-4.924 2.304-8.168 2.304-6.284 0-11.608-4.244-13.516-9.944H2.9v6.192C6.88 42.896 15.12 48 24.48 48z" fill="#34A853"/>
            <path d="M10.964 28.5A14.72 14.72 0 0110.42 24c0-1.56.268-3.08.544-4.5V13.308H2.9A23.976 23.976 0 000 24c0 3.864.932 7.524 2.9 10.692L10.964 28.5z" fill="#FBBC05"/>
            <path d="M24.48 9.556c3.54 0 6.716 1.216 9.208 3.604l6.904-6.904C36.46 2.38 30.996 0 24.48 0 15.12 0 6.88 5.104 2.9 13.308l8.064 6.192c1.908-5.7 7.232-9.944 13.516-9.944z" fill="#EA4335"/>
          </svg>
          Đăng nhập với Google
        </button>

        <p className="text-xs text-gray-400 text-center">
          Chỉ dành cho thành viên nội bộ NhiLe Holdings
        </p>
      </div>
    </div>
  )
}
