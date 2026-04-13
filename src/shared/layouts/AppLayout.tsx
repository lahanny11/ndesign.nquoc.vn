'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useRoleStore, type AppRole } from '../stores/role.store'

interface AppLayoutProps {
  children: React.ReactNode
  onCreateOrder?: () => void
  activeNav?: string
  title?: string
}

// Apple-style SVG icons — không dùng emoji
const Icons = {
  orders: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  brand: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  sop: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  moodboard: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  feedback: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" className="w-[14px] h-[14px]">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 12, height: 12 }}>
      <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  hamburger: (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 20, height: 20 }}>
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

interface NavItem {
  label: string
  key: string
  icon: React.ReactNode
  route: string
}

const navItems: NavItem[] = [
  { label: 'Order',            key: 'orders',    icon: Icons.orders,    route: '/dashboard' },
  { label: 'Phân tích',        key: 'analytics', icon: Icons.analytics, route: '/analytics' },
  { label: 'Brand Guideline',  key: 'brand',     icon: Icons.brand,     route: '/brand' },
  { label: 'SOP & Checklist',  key: 'sop',       icon: Icons.sop,       route: '/sop' },
  { label: 'Phản hồi',         key: 'feedback',  icon: Icons.feedback,  route: '/feedback' },
]

const CoLeaderIcon = (
  <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="9 12 11 14 15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

interface RoleOption {
  value: AppRole
  label: string
  icon: React.ReactNode
}

const ROLE_OPTIONS: RoleOption[] = [
  { value: 'design_leader', label: 'Design Leader', icon: Icons.star },
  { value: 'co_leader',     label: 'Co-Leader',     icon: CoLeaderIcon },
  { value: 'designer',      label: 'Designer',      icon: Icons.pen },
  { value: 'orderer',       label: 'Người order',   icon: Icons.user },
]

function RoleSwitcher() {
  const { role, setRole } = useRoleStore()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const current = ROLE_OPTIONS.find(r => r.value === role) ?? ROLE_OPTIONS[0]

  function handleSelect(r: AppRole) {
    setRole(r)
    setOpen(false)
    // Cập nhật URL param không reload trang
    const params = new URLSearchParams(window.location.search)
    params.set('role', r)
    router.replace(pathname + '?' + params.toString())
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 20, padding: '4px 12px 4px 8px',
          fontSize: 12, fontWeight: 600, color: '#1D1D1F',
          cursor: 'pointer', whiteSpace: 'nowrap',
        }}
      >
        <span style={{ color: '#1D1D1F', display: 'flex', alignItems: 'center' }}>{current.icon}</span>
        {current.label}
        <span style={{ color: '#AEAEB2', display: 'flex', alignItems: 'center' }}>{Icons.chevronDown}</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: 'white', borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          minWidth: 160, padding: 6, zIndex: 100,
        }}>
          {ROLE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '10px 14px', borderRadius: 8,
                fontSize: 13, cursor: 'pointer', border: 'none', textAlign: 'left',
                background: role === opt.value ? 'rgba(0,0,0,0.07)' : 'transparent',
                color: role === opt.value ? '#000' : '#1D1D1F',
                fontWeight: role === opt.value ? 600 : 400,
              }}
              onMouseEnter={e => { if (role !== opt.value) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = role === opt.value ? 'rgba(0,0,0,0.07)' : 'transparent' }}
            >
              <span style={{ color: role === opt.value ? '#000' : '#6E6E73', display: 'flex', alignItems: 'center' }}>{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AppLayout({ children, onCreateOrder, activeNav, title }: AppLayoutProps) {
  const { data: user } = useCurrentUser()
  const [notifOpen, setNotifOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Detect active nav from pathname
  const currentNav = activeNav ?? (() => {
    if (pathname.startsWith('/analytics')) return 'analytics'
    if (pathname.startsWith('/brand'))     return 'brand'
    if (pathname.startsWith('/sop'))       return 'sop'
    if (pathname.startsWith('/moodboard')) return 'moodboard'
    if (pathname.startsWith('/feedback'))  return 'feedback'
    return 'orders'
  })()

  const pageTitle = title ?? 'Quản lý Order'

  return (
    <div className="app-root flex h-screen overflow-hidden" style={{ background: '#F5F5F7' }}>

      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'sidebar-open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`app-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
        style={{
          width: 64, background: '#fff', flexShrink: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          paddingTop: 16, paddingBottom: 16,
          borderRight: '1px solid rgba(0,0,0,0.07)',
        }}
      >
        {/* Logo */}
        <div style={{
          width: 32, height: 32, borderRadius: 9, background: '#1D1D1F',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20, flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'Georgia, serif', letterSpacing: '-0.5px' }}>N</span>
        </div>

        {/* Nav icons */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, width: '100%', padding: '0 8px' }}>
          {navItems.map((item) => {
            const isActive = currentNav === item.key
            return (
              <div key={item.label} style={{ position: 'relative' }} className="group">
                <button
                  onClick={() => { router.push(item.route); setSidebarOpen(false) }}
                  style={{
                    width: '100%', height: 42, borderRadius: 9,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', cursor: 'pointer',
                    background: isActive ? '#1D1D1F' : 'transparent',
                    color: isActive ? '#fff' : '#C7C7CC',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = '#3A3A3C' } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C7C7CC' } }}
                >
                  {item.icon}
                </button>
                {isActive && (
                  <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 16, borderRadius: '0 3px 3px 0', background: '#1D1D1F' }}/>
                )}
                {/* Tooltip */}
                <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#1D1D1F] text-white
                  text-[11px] font-semibold rounded-[8px] whitespace-nowrap opacity-0 group-hover:opacity-100
                  pointer-events-none transition-opacity z-50 desktop-only"
                  style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.18)' }}>
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent border-r-[#1D1D1F]"/>
                </div>
              </div>
            )
          })}
        </nav>

        {/* Divider */}
        <div style={{ width: 32, height: 1, background: 'rgba(0,0,0,0.07)', margin: '8px 0' }}/>

        {/* Avatar */}
        <div style={{ position: 'relative' }} className="group">
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>
              {user?.display_name?.[0] ?? 'U'}
            </span>
          </div>
          <div className="absolute left-full ml-2.5 bottom-0 px-2.5 py-1.5 bg-[#1D1D1F] text-white
            text-[11px] font-semibold rounded-[8px] whitespace-nowrap opacity-0 group-hover:opacity-100
            pointer-events-none transition-opacity z-50"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.18)' }}>
            {user?.display_name ?? 'Demo User'}
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="app-main flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-[50px] flex items-center px-4 gap-3 shrink-0"
          style={{
            background: 'rgba(255,255,255,0.85)',
            borderBottom: '1px solid rgba(0,0,0,0.07)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}>

          {/* Hamburger — chỉ hiện trên mobile */}
          <button
            className="mobile-only"
            onClick={() => setSidebarOpen(v => !v)}
            style={{
              width: 36, height: 36, borderRadius: 9, border: 'none',
              background: 'transparent', cursor: 'pointer',
              color: '#6E6E73', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {Icons.hamburger}
          </button>

          {/* Tiêu đề trang */}
          <h1 style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.02em', flexShrink: 0, margin: 0 }}>
            {pageTitle}
          </h1>

          {/* Tìm kiếm */}
          <div style={{ flex: 1, maxWidth: 280, margin: '0 8px' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#AEAEB2', display: 'flex', alignItems: 'center' }}>
                {Icons.search}
              </span>
              <input type="text" placeholder="Tìm kiếm..."
                style={{
                  width: '100%', paddingLeft: 30, paddingRight: 10, paddingTop: 6, paddingBottom: 6,
                  fontSize: 12, borderRadius: 8, border: '1px solid transparent',
                  background: 'rgba(0,0,0,0.05)', color: '#1D1D1F', outline: 'none',
                  transition: 'all 0.15s', fontFamily: 'inherit',
                }}
                onFocus={e => { e.target.style.background = '#fff'; e.target.style.border = '1px solid rgba(0,0,0,0.25)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.05)' }}
                onBlur={e => { e.target.style.background = 'rgba(0,0,0,0.05)'; e.target.style.border = '1px solid transparent'; e.target.style.boxShadow = 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <RoleSwitcher />

            {/* Chuông thông báo */}
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              style={{
                position: 'relative', width: 36, height: 36, borderRadius: 9,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', background: 'transparent', cursor: 'pointer',
                color: '#6E6E73', transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {Icons.bell}
              <span style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: '#E11D48' }}/>
            </button>

            {/* Tạo order */}
            {onCreateOrder && (
              <button
                onClick={onCreateOrder}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  height: 34, paddingLeft: 14, paddingRight: 14, borderRadius: 9,
                  fontSize: 12, fontWeight: 600, color: '#fff',
                  border: 'none', background: '#000', cursor: 'pointer',
                  transition: 'opacity 0.15s', letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {Icons.plus}
                Tạo order
              </button>
            )}
          </div>
        </header>

        {/* Nội dung */}
        <main className="flex-1 overflow-auto" style={{ padding: 20 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
