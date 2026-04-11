import { useState } from 'react'
import { useDesignerWorkload } from '../hooks/useDesignerWorkload'
import type { DesignerWorkload } from '../types/dashboard.types'

const MAX_CAPACITY = 7

function nameToColor(name: string): string {
  const COLORS = ['#2563EB', '#16A34A', '#FF9F0A', '#E11D48', '#AF52DE', '#00C7BE', '#FF6B35']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffff
  return COLORS[Math.abs(hash) % COLORS.length]
}

function DesignerCard({ designer }: { designer: DesignerWorkload }) {
  const [expanded, setExpanded] = useState(false)
  const avatarColor = nameToColor(designer.name)
  const total = designer.active_tasks + designer.pending_tasks
  const capPct = Math.min(total / MAX_CAPACITY, 1)
  const capColor = capPct >= 1 ? '#E11D48' : capPct >= 5 / MAX_CAPACITY ? '#FF9F0A' : '#16A34A'
  const reviseAlert = designer.avg_revisions > 2

  return (
    <div
      onClick={() => setExpanded(v => !v)}
      style={{
        background: '#fff',
        borderRadius: 14,
        padding: '16px',
        border: designer.has_blocked
          ? '1px solid rgba(225,29,72,0.18)'
          : '1px solid rgba(0,0,0,0.06)',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)')}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)')}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%', background: avatarColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{designer.name[0]}</span>
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', margin: 0, lineHeight: 1.2 }}>
            {designer.name}
          </p>
          <p style={{ fontSize: 11, color: '#AEAEB2', margin: '2px 0 0' }}>Designer</p>
        </div>
        {designer.has_blocked && (
          <span style={{
            fontSize: 10, fontWeight: 600,
            padding: '3px 8px', borderRadius: 6,
            background: 'rgba(225,29,72,0.09)', color: '#E11D48',
            flexShrink: 0,
          }}>
            Blocked
          </span>
        )}
      </div>

      {/* Stats grid — 3 metrics */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
        gap: 1, background: 'rgba(0,0,0,0.05)',
        borderRadius: 10, overflow: 'hidden', marginBottom: 12,
      }}>
        {[
          { label: 'Đang làm', value: designer.active_tasks, color: '#2563EB' },
          { label: 'Done/tuần', value: designer.done_this_week, color: '#16A34A' },
          {
            label: 'Revise TB',
            value: designer.avg_revisions > 0 ? designer.avg_revisions.toFixed(1) : '—',
            color: reviseAlert ? '#E11D48' : designer.avg_revisions > 0 ? '#1D1D1F' : '#AEAEB2',
          },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#fff', padding: '10px 0', textAlign: 'center' }}>
            <p style={{
              fontSize: 18, fontWeight: 700, color: stat.color,
              margin: 0, lineHeight: 1,
              letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
            }}>
              {stat.value}
            </p>
            <p style={{ fontSize: 10, color: '#AEAEB2', margin: '4px 0 0', lineHeight: 1 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Capacity bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <span style={{
            fontSize: 10, fontWeight: 600, color: '#AEAEB2',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            Capacity
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: capColor, fontVariantNumeric: 'tabular-nums' }}>
            {total}/{MAX_CAPACITY}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: MAX_CAPACITY }).map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 5, borderRadius: 99,
              background: i < total ? capColor : 'rgba(0,0,0,0.08)',
              transition: 'background 0.3s',
            }}/>
          ))}
        </div>
      </div>

      {/* Expand chevron */}
      <div style={{
        display: 'flex', justifyContent: 'center', marginTop: 10,
        color: '#AEAEB2', fontSize: 11,
      }}>
        {expanded ? '▲ Thu gọn' : '▼ Chi tiết'}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{
          marginTop: 10, paddingTop: 10,
          borderTop: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', flexDirection: 'column', gap: 5,
        }}>
          {designer.active_tasks === 0 && designer.pending_tasks === 0 ? (
            <p style={{ fontSize: 11, color: '#AEAEB2', textAlign: 'center', padding: '6px 0', margin: 0 }}>
              Không có task đang chạy
            </p>
          ) : (
            <>
              {designer.active_tasks > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 10px', borderRadius: 8,
                  background: 'rgba(37,99,235,0.04)',
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: '#2563EB' }}/>
                  <p style={{ fontSize: 11, color: '#3A3A3C', margin: 0 }}>
                    {designer.active_tasks} task đang thực hiện
                  </p>
                </div>
              )}
              {designer.pending_tasks > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 10px', borderRadius: 8,
                  background: 'rgba(255,159,10,0.04)',
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: '#FF9F0A' }}/>
                  <p style={{ fontSize: 11, color: '#3A3A3C', margin: 0 }}>
                    {designer.pending_tasks} task chưa bắt đầu
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, height: 180,
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      opacity: 0.6,
    }}/>
  )
}

export default function WorkloadPanel() {
  const { data: workload, isLoading, isError } = useDesignerWorkload()

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '18px 20px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F', margin: 0, letterSpacing: '-0.01em' }}>
            Workload Designer
          </h3>
          <p style={{ fontSize: 12, color: '#AEAEB2', margin: '2px 0 0' }}>
            Năng lực thực tế từ hệ thống — click để xem chi tiết
          </p>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 500,
          padding: '4px 10px', borderRadius: 99,
          background: 'rgba(0,0,0,0.05)', color: '#6E6E73',
        }}>
          Hôm nay
        </span>
      </div>

      {isError && (
        <p style={{ fontSize: 12, color: '#AEAEB2', textAlign: 'center', padding: '20px 0', margin: 0 }}>
          Không thể tải dữ liệu workload
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {isLoading
          ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
          : (workload ?? []).map(d => <DesignerCard key={d.id} designer={d} />)
        }
      </div>
    </div>
  )
}
