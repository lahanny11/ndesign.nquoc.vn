'use client'

// src/shared/components/ui/Badge.tsx
import type { ReactNode } from 'react'

type Color = 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple'

interface Props {
  color?: Color
  children: ReactNode
}

const COLORS: Record<Color, React.CSSProperties> = {
  gray:   { background: 'rgba(100,116,139,0.09)', color: '#64748B' },
  blue:   { background: 'rgba(37,99,235,0.09)',   color: '#2563EB' },
  green:  { background: 'rgba(22,163,74,0.09)',   color: '#16A34A' },
  yellow: { background: 'rgba(255,149,0,0.12)',   color: '#C97800' },
  red:    { background: 'rgba(255,59,48,0.1)',    color: '#D00'    },
  purple: { background: 'rgba(108,107,174,0.12)', color: '#6C6BAE' },
}

export function Badge({ color = 'gray', children }: Props) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: 11, fontWeight: 600, borderRadius: 6,
      padding: '2px 8px', whiteSpace: 'nowrap',
      ...COLORS[color],
    }}>
      {children}
    </span>
  )
}
