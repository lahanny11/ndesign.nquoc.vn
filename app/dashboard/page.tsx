'use client'

import DashboardPage from '@/modules/dashboard/pages/DashboardPage'

// Dashboard relies on client-side auth — skip static prerender
export const dynamic = 'force-dynamic'

export default function Page() {
  return <DashboardPage />
}
