'use client'

// src/modules/notifications/components/NotificationBell.tsx
import { useState, useRef, useEffect } from 'react'
import { useNotifications, useMarkRead } from '../hooks/useNotifications'

const TYPE_ICON: Record<string, string> = {
  order_assigned:             '📋',
  flag_triggered:             '🚩',
  status_changed:             '🔄',
  revision_exceeded:          '⚠️',
  leader_intervention_needed: '🆘',
}

function fmtAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1)  return 'vừa xong'
  if (m < 60) return `${m} phút trước`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} giờ trước`
  return `${Math.floor(h / 24)} ngày trước`
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { data: notifications = [] } = useNotifications()
  const markRead = useMarkRead()

  const unread = notifications.filter(n => !n.is_read).length

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          position: 'relative', width: 36, height: 36, borderRadius: '50%',
          border: 'none', background: open ? 'rgba(108,107,174,0.1)' : 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
        }}
        aria-label="Thông báo"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C6BAE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 16, height: 16, borderRadius: '50%',
            background: '#FF3B30', color: '#fff',
            fontSize: 9, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #fff',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 340, maxHeight: 420, overflowY: 'auto',
          background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
          border: '1px solid rgba(0,0,0,0.07)', zIndex: 999,
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1D1D1F' }}>Thông báo</span>
            {unread > 0 && (
              <span style={{ fontSize: 11, color: '#6C6BAE', fontWeight: 600 }}>
                {unread} chưa đọc
              </span>
            )}
          </div>

          {/* List */}
          {notifications.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: '#AEAEB2', fontSize: 12 }}>
              Không có thông báo
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => !n.is_read && markRead.mutate(n.id)}
                style={{
                  padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start',
                  background: n.is_read ? 'transparent' : 'rgba(108,107,174,0.04)',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                  cursor: n.is_read ? 'default' : 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1, marginTop: 1, flexShrink: 0 }}>
                  {TYPE_ICON[n.type] ?? '🔔'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: n.is_read ? 500 : 700, color: '#1D1D1F', margin: '0 0 2px', lineHeight: 1.4 }}>
                    {n.title}
                  </p>
                  <p style={{ fontSize: 11, color: '#6E6E73', margin: '0 0 4px', lineHeight: 1.4 }}>
                    {n.body}
                  </p>
                  <p style={{ fontSize: 10, color: '#AEAEB2', margin: 0 }}>
                    {fmtAgo(n.created_at)}
                    {n.order_number && ` · ${n.order_number}`}
                  </p>
                </div>
                {!n.is_read && (
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#6C6BAE', flexShrink: 0, marginTop: 4 }} />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
