'use client'

// src/shared/layouts/PublicLayout.tsx
// Wrapper cho các trang công khai (login, auth-callback)
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f0f8] to-[#e8e8f4]">
      {children}
    </div>
  )
}
