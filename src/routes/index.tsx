import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../modules/auth/pages/LoginPage'
import DashboardPage from '../modules/dashboard/pages/DashboardPage'
import ProtectedRoute from '../shared/components/ProtectedRoute'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
