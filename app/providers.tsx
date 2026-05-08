'use client'

import { useEffect, useRef } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/shared/config/query-client'

export default function Providers({ children }: { children: React.ReactNode }) {
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    // Backend N-Design chưa build — luôn dùng MSW để demo/preview, kể cả trên Vercel.
    // Khi nào backend thật sẵn sàng → set NEXT_PUBLIC_DISABLE_MOCKING=true để tắt.
    const isDisabled = process.env.NEXT_PUBLIC_DISABLE_MOCKING === 'true'
    if (isDisabled) {
      console.log('[MSW] Mocking disabled via env var.')
      return
    }

    import('@/mocks/browser')
      .then(({ worker }) => {
        worker.start({ onUnhandledRequest: 'bypass' }).then(() => {
          console.log('[MSW] Mocking enabled.', worker.listHandlers().length, 'handlers')
        })
      })
      .catch(err => console.error('[MSW] Failed to load browser mock:', err))
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
