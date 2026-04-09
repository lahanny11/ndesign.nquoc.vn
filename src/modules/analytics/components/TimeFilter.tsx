import type { AnalyticsPeriod } from '../types/analytics.types'

interface TimeFilterProps {
  period: AnalyticsPeriod
  from?: string
  to?: string
  onChange: (period: AnalyticsPeriod, from?: string, to?: string) => void
}

const TABS: { value: AnalyticsPeriod; label: string }[] = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'week',  label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
  { value: 'custom', label: 'Tùy chỉnh' },
]

export default function TimeFilter({ period, from, to, onChange }: TimeFilterProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      {/* Segmented control */}
      <div style={{
        display: 'inline-flex',
        background: 'rgba(0,0,0,0.06)',
        borderRadius: 10,
        padding: 3,
        gap: 2,
      }}>
        {TABS.map((tab) => {
          const isActive = period === tab.value
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value, from, to)}
              style={{
                padding: '5px 14px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#1D1D1F' : '#6E6E73',
                background: isActive ? '#fff' : 'transparent',
                boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Custom date range */}
      {period === 'custom' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#6E6E73', fontWeight: 500 }}>Từ</span>
          <input
            type="date"
            value={from ?? ''}
            onChange={e => onChange('custom', e.target.value, to)}
            style={{
              padding: '5px 10px',
              borderRadius: 8,
              border: '1px solid rgba(0,0,0,0.12)',
              fontSize: 13,
              color: '#1D1D1F',
              background: '#fff',
              outline: 'none',
              cursor: 'pointer',
            }}
          />
          <span style={{ fontSize: 12, color: '#6E6E73', fontWeight: 500 }}>đến</span>
          <input
            type="date"
            value={to ?? ''}
            onChange={e => onChange('custom', from, e.target.value)}
            style={{
              padding: '5px 10px',
              borderRadius: 8,
              border: '1px solid rgba(0,0,0,0.12)',
              fontSize: 13,
              color: '#1D1D1F',
              background: '#fff',
              outline: 'none',
              cursor: 'pointer',
            }}
          />
        </div>
      )}
    </div>
  )
}
