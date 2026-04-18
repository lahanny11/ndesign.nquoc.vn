'use client'

// src/modules/flags/components/FlagBadge.tsx
import type { FlagType } from '../types'

interface Props {
  type: FlagType
  compact?: boolean
}

const CONFIG = {
  warn: { bg: 'rgba(255,149,0,0.12)', color: '#C97800', border: '1px solid rgba(255,149,0,0.3)', label: '⚠ Cảnh báo' },
  red:  { bg: 'rgba(255,59,48,0.1)',  color: '#D00',    border: '1px solid rgba(255,59,48,0.3)',  label: '🚩 Red flag'  },
}

export function FlagBadge({ type, compact = false }: Props) {
  const c = CONFIG[type]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: compact ? 10 : 11, fontWeight: 600,
      color: c.color, background: c.bg, border: c.border,
      borderRadius: 6, padding: compact ? '1px 6px' : '2px 8px',
      whiteSpace: 'nowrap',
    }}>
      {c.label}
    </span>
  )
}
