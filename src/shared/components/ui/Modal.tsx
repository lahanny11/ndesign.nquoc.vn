'use client'

// src/shared/components/ui/Modal.tsx
import { useEffect, type ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  maxWidth?: number
}

export function Modal({ open, onClose, title, children, maxWidth = 520 }: Props) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 16,
          width: '100%', maxWidth, boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          maxHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {title && (
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
          }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1D1D1F' }}>{title}</span>
            <button
              onClick={onClose}
              style={{
                width: 28, height: 28, borderRadius: '50%', border: 'none',
                background: 'rgba(0,0,0,0.06)', cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6E6E73',
              }}
            >
              ×
            </button>
          </div>
        )}
        <div style={{ padding: 20, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
