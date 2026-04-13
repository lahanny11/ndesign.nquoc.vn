'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../../shared/config/api-client'
import type { DesignerWorkload } from '../types/dashboard.types'
import LeaveModal from './LeaveModal'

const MAX_CAPACITY = 7

const AVATAR_COLORS = ['#2563EB', '#16A34A', '#FF9F0A', '#E11D48', '#AF52DE', '#00C7BE', '#FF6B35']
function nameToColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffff
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}
const fmt = (iso: string) => new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
const daysAgo = (iso: string) => Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)

interface Props {
  designer: DesignerWorkload
  isLeader: boolean
}

export default function DesignerCard({ designer, isLeader }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const qc = useQueryClient()

  const avatarColor = nameToColor(designer.name)
  const isOnLeave = designer.leave?.is_on_leave === true
  const isNew = designer.member_status === 'new'
  const total = designer.active_tasks + designer.pending_tasks
  const capPct = Math.min(total / MAX_CAPACITY, 1)
  const capColor = isOnLeave
    ? '#AEAEB2'
    : capPct >= 1
      ? '#E11D48'
      : capPct >= 5 / MAX_CAPACITY
        ? '#FF9F0A'
        : '#16A34A'
  const reviseAlert = designer.avg_revisions > 2

  const promoteMutation = useMutation({
    mutationFn: () => apiClient.patch(`/api/v1/designers/${designer.id}/member-status`, { member_status: 'regular' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['designer-workload'] }) },
  })

  const returnDate = designer.leave?.leave_end
    ? fmt(new Date(new Date(designer.leave.leave_end).getTime() + 86400000).toISOString()) : null
  const daysJoined = daysAgo(designer.joined_at)

  return (
    <>
      {showLeaveModal && (
        <LeaveModal
          designer={designer}
          onClose={() => setShowLeaveModal(false)}
          onSaved={() => setShowLeaveModal(false)}
        />
      )}

      <div
        style={{
          background: isOnLeave ? '#FAFAFA' : '#fff',
          borderRadius: 14, padding: '16px',
          border: isOnLeave
            ? '1.5px solid rgba(0,0,0,0.1)'
            : isNew
              ? '1.5px solid rgba(94,92,230,0.3)'
              : designer.has_blocked
                ? '1px solid rgba(225,29,72,0.18)'
                : '1px solid rgba(0,0,0,0.06)',
          cursor: 'pointer', transition: 'box-shadow 0.2s',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          opacity: isOnLeave ? 0.85 : 1,
          position: 'relative',
        }}
        onClick={() => setExpanded(v => !v)}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)' }}
      >
        {/* Dòng header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: isOnLeave ? '#D1D1D6' : avatarColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff',
            }}>
              {isOnLeave ? '🏖' : designer.name[0]}
            </div>
            {isNew && (
              <div style={{
                position: 'absolute', bottom: -2, right: -2,
                width: 14, height: 14, borderRadius: '50%', background: '#5E5CE6',
                border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 7, color: '#fff', fontWeight: 700 }}>N</span>
              </div>
            )}
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: isOnLeave ? '#6E6E73' : '#1D1D1F', margin: 0, lineHeight: 1.2 }}>
                {designer.name}
              </p>
              {isNew && (
                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: 'rgba(94,92,230,0.12)', color: '#5E5CE6', letterSpacing: '0.03em' }}>
                  THÀNH VIÊN MỚI
                </span>
              )}
            </div>
            <p style={{ fontSize: 11, color: '#AEAEB2', margin: '2px 0 0' }}>
              {isOnLeave
                ? `Nghỉ đến ${returnDate}`
                : isNew
                  ? `Gia nhập ${daysJoined} ngày trước`
                  : 'Designer'
              }
            </p>
          </div>

          {/* Badge trạng thái */}
          {isOnLeave ? (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 8,
              background: 'rgba(0,0,0,0.06)', color: '#6E6E73', flexShrink: 0,
              border: '1px solid rgba(0,0,0,0.08)',
            }}>
              Nghỉ phép
            </span>
          ) : designer.has_blocked ? (
            <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: 'rgba(225,29,72,0.09)', color: '#E11D48', flexShrink: 0 }}>
              Bị chặn
            </span>
          ) : null}
        </div>

        {/* Banner nghỉ phép */}
        {isOnLeave && designer.leave && (
          <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,159,10,0.06)', border: '1px solid rgba(255,159,10,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
              <span style={{ fontSize: 11 }}>🗓</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#D97706' }}>
                {designer.leave.reason} · {fmt(designer.leave.leave_start)} – {fmt(designer.leave.leave_end)}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#6E6E73' }}>
              <span>Duyệt bởi: <strong style={{ color: '#1D1D1F' }}>{designer.leave.approved_by}</strong></span>
              {designer.leave.unhandled_tasks > 0 && (
                <span style={{ color: '#E11D48', fontWeight: 600 }}>
                  ⚠ {designer.leave.unhandled_tasks} task chưa bàn giao
                </span>
              )}
            </div>
            {designer.leave.handover_to && (
              <p style={{ fontSize: 11, color: '#6E6E73', margin: '4px 0 0' }}>
                Bàn giao cho: <strong style={{ color: '#1D1D1F' }}>{designer.leave.handover_to}</strong>
                {' · '}
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 20,
                  background: designer.leave.handover_status === 'complete' ? 'rgba(22,163,74,0.1)' : 'rgba(255,159,10,0.12)',
                  color: designer.leave.handover_status === 'complete' ? '#16A34A' : '#D97706',
                }}>
                  {designer.leave.handover_status === 'complete' ? 'Hoàn tất' : designer.leave.handover_status === 'partial' ? 'Một phần' : 'Chờ bàn giao'}
                </span>
              </p>
            )}
            {designer.leave.handover_status === 'standby' && (
              <p style={{ fontSize: 11, color: '#6E6E73', margin: '4px 0 0' }}>
                Task tạm giữ — xử lý khi trở lại
              </p>
            )}
          </div>
        )}

        {/* Ghi chú thành viên mới — chỉ Leader thấy */}
        {isNew && designer.training_note && isLeader && (
          <div style={{ marginBottom: 12, padding: '9px 12px', borderRadius: 10, background: 'rgba(94,92,230,0.05)', border: '1px solid rgba(94,92,230,0.15)' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#5E5CE6', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Ghi chú Training (chỉ Leader thấy)
            </p>
            <p style={{ fontSize: 11, color: '#3D3D3F', margin: 0, lineHeight: 1.55 }}>{designer.training_note}</p>
          </div>
        )}

        {/* Thống kê */}
        {!isOnLeave && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(0,0,0,0.05)', borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
            {[
              { label: 'Đang làm',  value: designer.active_tasks, color: '#2563EB' },
              { label: 'Xong/tuần', value: designer.done_this_week, color: '#16A34A' },
              {
                label: 'Sửa TB',
                value: designer.avg_revisions > 0 ? designer.avg_revisions.toFixed(1) : '—',
                color: reviseAlert ? '#E11D48' : designer.avg_revisions > 0 ? '#1D1D1F' : '#AEAEB2',
              },
            ].map((stat, i) => (
              <div key={i} style={{ background: '#fff', padding: '10px 0', textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: stat.color, margin: 0, lineHeight: 1, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: 10, color: '#AEAEB2', margin: '4px 0 0', lineHeight: 1 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Thanh năng lực */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Năng lực
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: isOnLeave ? '#AEAEB2' : capColor, fontVariantNumeric: 'tabular-nums' }}>
              {isOnLeave ? `Nghỉ phép · ${total} task` : `${total}/${MAX_CAPACITY}`}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: MAX_CAPACITY }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 5, borderRadius: 99,
                background: isOnLeave
                  ? (i < total ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.05)')
                  : (i < total ? capColor : 'rgba(0,0,0,0.08)'),
                transition: 'background 0.3s',
              }}/>
            ))}
          </div>
        </div>

        {/* Toggle mở rộng */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10, color: '#AEAEB2', fontSize: 11 }}>
          {expanded ? '▲ Thu gọn' : '▼ Xem thêm'}
        </div>

        {/* Phần mở rộng */}
        {expanded && (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {total === 0 && !isOnLeave && (
              <p style={{ fontSize: 11, color: '#AEAEB2', textAlign: 'center', padding: '4px 0', margin: 0 }}>Không có task đang chạy</p>
            )}
            {designer.active_tasks > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, background: 'rgba(37,99,235,0.04)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: '#2563EB' }}/>
                <p style={{ fontSize: 11, color: '#3A3A3C', margin: 0 }}>{designer.active_tasks} task đang thực hiện</p>
              </div>
            )}
            {designer.pending_tasks > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, background: 'rgba(255,159,10,0.04)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: '#FF9F0A' }}/>
                <p style={{ fontSize: 11, color: '#3A3A3C', margin: 0 }}>{designer.pending_tasks} task chưa bắt đầu</p>
              </div>
            )}

            {/* Hành động của Leader */}
            {isLeader && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                <button
                  onClick={e => { e.stopPropagation(); setShowLeaveModal(true) }}
                  style={{
                    width: '100%', padding: '8px', borderRadius: 9, border: 'none', cursor: 'pointer',
                    fontSize: 12, fontWeight: 600,
                    background: isOnLeave ? 'rgba(255,59,48,0.07)' : 'rgba(0,0,0,0.05)',
                    color: isOnLeave ? '#E11D48' : '#1D1D1F',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  <span>{isOnLeave ? '✕' : '🗓'}</span>
                  {isOnLeave ? 'Chỉnh sửa / Huỷ nghỉ phép' : 'Ghi nghỉ phép'}
                </button>

                {isNew && (
                  <button
                    onClick={e => { e.stopPropagation(); promoteMutation.mutate() }}
                    disabled={promoteMutation.isPending}
                    style={{
                      width: '100%', padding: '8px', borderRadius: 9, border: 'none', cursor: 'pointer',
                      fontSize: 12, fontWeight: 600,
                      background: 'rgba(94,92,230,0.08)', color: '#5E5CE6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <span>★</span>
                    {promoteMutation.isPending ? 'Đang cập nhật...' : 'Xác nhận thử việc xong → Chính thức'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
