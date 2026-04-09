import type { ReactNode } from 'react'

type StatStatus = 'good' | 'warn' | 'bad' | 'neutral'

interface KPIStatProps {
  label: string
  value: string | number
  unit?: string
  status?: StatStatus
  hint?: string
  icon?: ReactNode
}

const STATUS_COLORS: Record<StatStatus, string> = {
  good:    '#34C759',
  warn:    '#FF9F0A',
  bad:     '#FF3B30',
  neutral: '#1D1D1F',
}

const STATUS_BG: Record<StatStatus, string> = {
  good:    'rgba(52,199,89,0.08)',
  warn:    'rgba(255,159,10,0.08)',
  bad:     'rgba(255,59,48,0.08)',
  neutral: 'rgba(0,0,0,0.04)',
}

export default function KPIStat({ label, value, unit, status = 'neutral', hint, icon }: KPIStatProps) {
  const color = STATUS_COLORS[status]
  const bg = STATUS_BG[status]

  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      padding: 18,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: '#6E6E73', fontWeight: 500, lineHeight: 1.4 }}>
          {label}
        </span>
        {icon && (
          <div style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1, letterSpacing: '-0.5px' }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: 13, color: '#6E6E73', fontWeight: 500 }}>
            {unit}
          </span>
        )}
      </div>

      {hint && (
        <span style={{ fontSize: 11, color: '#AEAEB2', lineHeight: 1.4 }}>
          {hint}
        </span>
      )}
    </div>
  )
}
