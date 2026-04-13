'use client'

import { useDesignerWorkload } from '../hooks/useDesignerWorkload'
import DesignerCard from './DesignerCard'

function SkeletonCard() {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      height: 180,
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      opacity: 0.6,
    }}/>
  )
}

interface Props { isLeader?: boolean }

export default function WorkloadPanel({ isLeader = false }: Props) {
  const { data: workload, isLoading, isError } = useDesignerWorkload()

  const onLeaveCount   = (workload ?? []).filter(d => d.leave?.is_on_leave).length
  const newMemberCount = (workload ?? []).filter(d => d.member_status === 'new').length
  const hasUnhandled   = (workload ?? []).some(
    d => d.leave?.is_on_leave && (d.leave?.unhandled_tasks ?? 0) > 0,
  )

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '18px 20px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
    }}>
      {/* Panel header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: onLeaveCount > 0 || newMemberCount > 0 ? 10 : 16,
      }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F', margin: 0, letterSpacing: '-0.01em' }}>
            Tải việc Designer
          </h3>
          <p style={{ fontSize: 12, color: '#AEAEB2', margin: '2px 0 0' }}>
            Năng lực thực tế từ hệ thống — click để xem chi tiết
          </p>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {onLeaveCount > 0 && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
              background: 'rgba(255,159,10,0.1)', color: '#D97706',
            }}>
              🏖 {onLeaveCount} đang nghỉ
            </span>
          )}
          {newMemberCount > 0 && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
              background: 'rgba(94,92,230,0.1)', color: '#5E5CE6',
            }}>
              ✦ {newMemberCount} mới
            </span>
          )}
          <span style={{
            fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 99,
            background: 'rgba(0,0,0,0.05)', color: '#6E6E73',
          }}>
            Hôm nay
          </span>
        </div>
      </div>

      {/* Unhandled-task warning */}
      {hasUnhandled && (
        <div style={{
          marginBottom: 14, padding: '10px 14px', borderRadius: 10,
          background: 'rgba(255,59,48,0.05)', border: '1px solid rgba(255,59,48,0.15)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 13 }}>⚠️</span>
          <p style={{ fontSize: 12, color: '#E11D48', margin: 0, fontWeight: 500 }}>
            Có designer đang nghỉ với task chưa được bàn giao — cần xử lý trước khi họ nghỉ.
          </p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <p style={{ fontSize: 12, color: '#AEAEB2', textAlign: 'center', padding: '20px 0', margin: 0 }}>
          Không thể tải dữ liệu workload
        </p>
      )}

      {/* Designer cards grid */}
      <div className="workload-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {isLoading
          ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
          : (workload ?? []).map(d => (
              <DesignerCard key={d.id} designer={d} isLeader={isLeader} />
            ))
        }
      </div>
    </div>
  )
}
