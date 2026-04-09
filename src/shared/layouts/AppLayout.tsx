import { useState } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser'

interface AppLayoutProps {
  children: React.ReactNode
  onCreateOrder?: () => void
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Chào buổi sáng', emoji: '☀️' }
  if (h < 18) return { text: 'Chào buổi chiều', emoji: '🌤️' }
  return { text: 'Chào buổi tối', emoji: '🌙' }
}

const navItems = [
  { label: 'Quản lý Order',  icon: '🎨', active: true },
  { label: 'Nhật ký dữ liệu', icon: '📊', active: false },
  { label: 'Công cụ',         icon: '🔧', active: false },
  { label: 'Moodboard AI',    icon: '✦',  active: false },
  { label: 'Feedback',        icon: '💬', active: false },
]

export default function AppLayout({ children, onCreateOrder }: AppLayoutProps) {
  const { data: user } = useCurrentUser()
  const [notifOpen, setNotifOpen] = useState(false)
  const { text: greetText, emoji: greetEmoji } = getGreeting()
  const firstName = user?.display_name?.split(' ').pop() ?? 'bạn'

  return (
    <div className="flex h-screen bg-[#f7f7fb] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[160px] bg-white border-r border-gray-100 flex flex-col py-6 px-3 gap-2 shrink-0 shadow-sm">
        {/* Logo + Brand */}
        <div className="flex flex-col items-center mb-5 gap-1.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B8EF7] to-[#6C6BAE] flex items-center justify-center shadow-md">
            <span className="text-white text-lg font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>N</span>
          </div>
          <span className="text-[10px] font-semibold text-[#A89EC0] tracking-wide">Design Team</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all ${
                item.active
                  ? 'bg-gradient-to-r from-[#7B8EF7] to-[#6C6BAE] text-white shadow-sm'
                  : 'text-gray-400 hover:bg-[#F5F4FC] hover:text-[#6C6BAE]'
              }`}
            >
              <span className="text-[13px]">{item.icon}</span>
              <span className="text-[11px] font-medium leading-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Performance widget — humanized */}
        <div className="bg-gradient-to-br from-[#F0EFFC] to-[#EAE9F7] rounded-xl p-3 border border-[#E4E0EF]">
          <p className="text-[9px] text-[#7B8EF7] font-bold uppercase tracking-wide mb-0.5">Team Performance</p>
          <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden mb-1">
            <div className="h-full bg-gradient-to-r from-[#7B8EF7] to-[#5BB89A] rounded-full" style={{ width: '98%' }} />
          </div>
          <p className="text-[10px] text-[#6C6BAE] font-bold">98% — Xuất sắc 🏆</p>
        </div>

        {/* User quick info */}
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-[#F5F4FC]">
          <div className="w-6 h-6 rounded-full bg-[#7B8EF7] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            {user?.display_name?.[0] ?? 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-semibold text-[#2D2D3A] truncate">{user?.display_name ?? 'Demo User'}</p>
            <p className="text-[8px] text-[#A89EC0]">Design Leader</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-[54px] bg-white border-b border-gray-100 flex items-center px-6 gap-4 shrink-0 shadow-sm">
          {/* Greeting */}
          <div className="flex flex-col justify-center">
            <p className="text-[11px] text-[#A89EC0] leading-none">{greetText} {greetEmoji}</p>
            <p className="text-[13px] font-bold text-[#2D2D3A] leading-tight">
              {firstName}, hôm nay có gì mình giúp được không?
            </p>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xs mx-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 stroke-[#A89EC0] fill-none stroke-2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Tìm dự án của bạn..."
                className="w-full pl-8 pr-4 py-1.5 text-[12px] bg-[#F5F4FC] border border-[#E4E0EF] rounded-lg
                  focus:outline-none focus:border-[#7B8EF7] focus:bg-white transition-all placeholder:text-[#C4BEDD]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Notification bell */}
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F5F4FC] transition-colors"
              title="Thông báo mới"
            >
              <svg className="w-[18px] h-[18px] stroke-[#6E6488] fill-none stroke-[1.8]" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#E07A7A] rounded-full animate-pulse" />
            </button>

            {/* Create order CTA — human & warm */}
            <button
              onClick={onCreateOrder}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold text-white transition-all
                bg-gradient-to-r from-[#7B8EF7] to-[#6C6BAE] hover:shadow-[0_4px_14px_rgba(123,142,247,0.4)]
                hover:-translate-y-[1px] active:translate-y-0 shadow-sm"
            >
              <svg className="w-3.5 h-3.5 stroke-white fill-none stroke-[2.5]" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Gửi yêu cầu thiết kế
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-5">
          {children}
        </main>
      </div>
    </div>
  )
}
