'use client'

// src/modules/workload/components/WorkloadCard.tsx
import type { WorkloadDesigner } from '../types'
import { DESIGNER_CAPACITY } from '@modules/orders/constants'

interface Props {
  designer: WorkloadDesigner
  onPromote?: (personId: string) => void
}

export function WorkloadCard({ designer, onPromote }: Props) {
  const capacityPct = Math.min((designer.active_task_count / DESIGNER_CAPACITY) * 100, 100)
  const isNearFull  = designer.active_task_count >= DESIGNER_CAPACITY - 1
  const isNewMember = designer.member_status === 'new_member'

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: '16px 18px',
      border: designer.is_blocked
        ? '1.5px solid #FF3B30'
        : designer.on_leave
        ? '1.5px solid #FF9500'
        : '1px solid rgba(0,0,0,0.08)',
      transition: 'box-shadow 0.15s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg,#6C6BAE,#A89FD4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>
            {designer.full_name[0]}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {designer.full_name}
            </span>
            {isNewMember && (
              <span style={{ fontSize: 10, fontWeight: 600, color: '#FF9500', background: 'rgba(255,149,0,0.1)', borderRadius: 4, padding: '1px 6px' }}>
                New
              </span>
            )}
            {designer.on_leave && (
              <span style={{ fontSize: 10, fontWeight: 600, color: '#fff', background: '#FF9500', borderRadius: 4, padding: '1px 6px' }}>
                Nghỉ phép
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: '#8E8E93', marginTop: 1 }}>
            {designer.done_this_week} task done tuần này · avg {designer.avg_revision} revision
          </div>
        </div>
        {isNewMember && onPromote && (
          <button
            onClick={() => onPromote(designer.person_id)}
            style={{
              fontSize: 11, fontWeight: 600, color: '#6C6BAE',
              border: '1px solid #6C6BAE', borderRadius: 6,
              padding: '4px 10px', background: 'transparent',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            Promote
          </button>
        )}
      </div>

      {/* Capacity bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8E8E93', marginBottom: 4 }}>
          <span>Đang active</span>
          <span style={{ color: isNearFull ? '#FF3B30' : '#1D1D1F', fontWeight: 600 }}>
            {designer.active_task_count}/{DESIGNER_CAPACITY}
          </span>
        </div>
        <div style={{ height: 4, background: 'rgba(0,0,0,0.07)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${capacityPct}%`,
            borderRadius: 4,
            background: isNearFull ? '#FF3B30' : '#34C759',
            transition: 'width 0.3s',
          }}/>
        </div>
      </div>

      {/* Pending tasks */}
      {designer.pending_task_count > 0 && (
        <div style={{ fontSize: 11, color: '#8E8E93' }}>
          <span style={{ color: '#FF9500', fontWeight: 600 }}>{designer.pending_task_count}</span> task đang chờ nhận
        </div>
      )}

      {/* On leave info */}
      {designer.on_leave && (
        <div style={{ marginTop: 8, padding: '8px 10px', background: 'rgba(255,149,0,0.08)', borderRadius: 8, fontSize: 11, color: '#8E8E93' }}>
          Nghỉ {designer.on_leave.start_date} → {designer.on_leave.end_date}
          <span style={{ marginLeft: 6, color: '#FF9500', fontWeight: 600 }}>
            ({designer.on_leave.handover_status})
          </span>
        </div>
      )}
    </div>
  )
}
