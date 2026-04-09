import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from '../modules/dashboard/pages/DashboardPage'
import AnalyticsPage from '../modules/analytics/pages/AnalyticsPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
