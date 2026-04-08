import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'
import { useCurrentUser } from '../hooks/useCurrentUser'

interface AppLayoutProps {
  children: React.ReactNode
  onCreateOrder?: () => void
}

const navItems = [
  { label: 'Quản lý Order', icon: '📋', active: true },
  { label: 'Nhật ký dữ liệu', icon: '📊', active: false },
  { label: 'Công cụ', icon: '🔧', active: false },
  { label: 'Moodboard AI', icon: '✦', active: false },
  { label: 'Feedback', icon: '💬', active: false },
]

export default function AppLayout({ children, onCreateOrder }: AppLayoutProps) {
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const [notifOpen, setNotifOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/', { replace: true })
  }

  return (
    <div className="flex h-screen bg-[#f7f7fb] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[155px] bg-white border-r border-gray-100 flex flex-col py-6 px-3 gap-2 shrink-0 shadow-sm">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-10 h-10 rounded-full bg-[#6C6BAE] flex items-center justify-center shadow">
            <span className="text-white text-lg font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>N</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all ${
                item.active
                  ? 'bg-[#6C6BAE] text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-[11px] font-medium leading-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Performance widget */}
        <div className="bg-[#f5f5fb] rounded-xl p-3">
          <p className="text-[10px] text-gray-500 mb-1 font-medium">Performance</p>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#6C6BAE] rounded-full" style={{ width: '98%' }} />
          </div>
          <p className="text-[10px] text-[#6C6BAE] font-semibold mt-1">98%</p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all text-[11px]"
        >
          <span>🚪</span>
          <span>Đăng xuất</span>
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-[50px] bg-white border-b border-gray-100 flex items-center px-6 gap-4 shrink-0 shadow-sm">
          {/* Search */}
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6C6BAE] transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Notification bell */}
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User avatar */}
            <div className="flex items-center gap-2">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.display_name} className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#6C6BAE] flex items-center justify-center text-white text-xs font-semibold">
                  {user?.display_name?.[0] ?? 'U'}
                </div>
              )}
              <span className="text-xs text-gray-600 font-medium hidden sm:block">{user?.display_name}</span>
            </div>

            {/* Create order button */}
            <button
              onClick={onCreateOrder}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#6C6BAE] hover:bg-[#5857a0] text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <span className="text-base leading-none">+</span>
              Tạo order mới
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
