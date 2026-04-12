import { useState } from 'react'
import { useDesignerWorkload } from '../hooks/useDesignerWorkload'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../../shared/config/api-client'
import type { DesignerWorkload } from '../types/dashboard.types'

const MAX_CAPACITY = 7

function nameToColor(name: string): string {
  const COLORS = ['#2563EB', '#16A34A', '#FF9F0A', '#E11D48', '#AF52DE', '#00C7BE', '#FF6B35']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffff
  return COLORS[Math.abs(hash) % COLORS.length]
}

function daysBetween(a: string, b: string) {
  return Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

function daysAgo(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

// ─── Leave Entry Modal ────────────────────────────────────────────────────────
interface LeaveModalProps {
  designer: DesignerWorkload
  onClose: () => void
  onSaved: () => void
}

const LEAVE_REASONS = ['Nghỉ phép năm', 'Nghỉ bệnh', 'Nghỉ cưới', 'Việc gia đình', 'Khác']

function LeaveModal({ designer, onClose, onSaved }: LeaveModalProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate]     = useState('')
  const [reason, setReason]       = useState(LEAVE_REASONS[0])
  const [handoverTo, setHandoverTo] = useState<string>('standby')
  const qc = useQueryClient()

  const saveMutation = useMutation({
    mutationFn: () => apiClient.post('/api/v1/leaves', {
      designer_id: designer.id,
      leave_start: startDate,
      leave_end: endDate,
      reason,
      handover_status: handoverTo === 'standby' ? 'standby' : 'pending',
      handover_to: handoverTo === 'standby' ? null : handoverTo,
    }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['designer-workload'] }); onSaved() },
  })

  const cancelMutation = useMutation({
    mutationFn: () => apiClient.delete(`/api/v1/leaves/${designer.id}`),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['designer-workload'] }); onSaved() },
  })

  const leaveDays = startDate && endDate ? daysBetween(startDate, endDate) : 0
  const isEdit = designer.leave?.is_on_leave

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 440, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#1D1D1F', margin: 0 }}>
              {isEdit ? 'Chỉnh sửa nghỉ phép' : 'Ghi nghỉ phép'}
            </p>
            <p style={{ fontSize: 12, color: '#AEAEB2', margin: '2px 0 0' }}>
              {designer.name} · từ HR hoặc Leader ghi nhận
            </p>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6E6E73', fontSize: 13 }}>×</button>
        </div>

        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Date range */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Ngày bắt đầu nghỉ', value: startDate, set: setStartDate },
              { label: 'Ngày kết thúc nghỉ', value: endDate, set: setEndDate },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#6E6E73', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 5 }}>{label}</label>
                <input
                  type="date"
                  value={value}
                  onChange={e => set(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1.5px solid rgba(0,0,0,0.12)', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>
          {leaveDays > 0 && (
            <p style={{ fontSize: 12, color: '#6E6E73', margin: '-6px 0 0', textAlign: 'center' }}>
              <strong style={{ color: '#1D1D1F' }}>{leaveDays} ngày</strong> nghỉ · quay lại làm {formatDate(endDate)}
            </p>
          )}

          {/* Reason */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#6E6E73', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 5 }}>Lý do</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {LEAVE_REASONS.map(r => (
                <button key={r} type="button" onClick={() => setReason(r)} style={{
                  padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer',
                  background: reason === r ? '#1D1D1F' : 'rgba(0,0,0,0.06)',
                  color: reason === r ? '#fff' : '#1D1D1F', transition: 'all 0.15s',
                }}>{r}</button>
              ))}
            </div>
          </div>

          {/* Handover */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#6E6E73', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 5 }}>
              Bàn giao task
              {designer.active_tasks > 0 && <span style={{ color: '#E11D48', marginLeft: 6, fontWeight: 700 }}>{designer.active_tasks} task đang chạy</span>}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { value: 'standby', label: 'Giữ nguyên — task standby đến khi trở lại', icon: '⏸' },
                { value: 'Lê Văn A', label: 'Chuyển cho Lê Văn A', icon: '→' },
                { value: 'Nguyễn C', label: 'Chuyển cho Nguyễn C', icon: '→' },
              ].map(opt => (
                <button key={opt.value} type="button" onClick={() => setHandoverTo(opt.value)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                  border: handoverTo === opt.value ? '1.5px solid #1D1D1F' : '1.5px solid rgba(0,0,0,0.1)',
                  background: handoverTo === opt.value ? 'rgba(0,0,0,0.03)' : 'transparent',
                  transition: 'all 0.15s',
                }}>
                  <span style={{ fontSize: 14 }}>{opt.icon}</span>
                  <span style={{ fontSize: 13, color: '#1D1D1F' }}>{opt.label}</span>
                  {handoverTo === opt.value && <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#1D1D1F' }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px 18px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 8 }}>
          {isEdit && (
            <button
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              style={{ flex: 1, height: 42, borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: 'rgba(225,29,72,0.08)', color: '#E11D48' }}
            >
              Huỷ nghỉ phép
            </button>
          )}
          <button
            onClick={() => { if (startDate && endDate) saveMutation.mutate() }}
            disabled={!startDate || !endDate || saveMutation.isPending}
            style={{
              flex: 2, height: 42, borderRadius: 10, border: 'none', cursor: startDate && endDate ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 600,
              background: startDate && endDate ? '#1D1D1F' : 'rgba(0,0,0,0.1)',
              color: startDate && endDate ? '#fff' : '#AEAEB2',
            }}
          >
            {saveMutation.isPending ? 'Đang lưu...' : 'Xác nhận nghỉ phép'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Designer Card ────────────────────────────────────────────────────────────
function DesignerCard({ designer, isLeader }: { designer: DesignerWorkload; isLeader: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const qc = useQueryClient()

  const avatarColor = nameToColor(designer.name)
  const isOnLeave = designer.leave?.is_on_leave === true
  const isNew = designer.member_status === 'new'
  const total = designer.active_tasks + designer.pending_tasks
  const capPct = Math.min(total / MAX_CAPACITY, 1)
  const capColor = isOnLeave ? '#AEAEB2' : capPct >= 1 ? '#E11D48' : capPct >= 5 / MAX_CAPACITY ? '#FF9F0A' : '#16A34A'
  const reviseAlert = designer.avg_revisions > 2

  const promoteMutation = useMutation({
    mutationFn: () => apiClient.patch(`/api/v1/designers/${designer.id}/member-status`, { member_status: 'regular' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['designer-workload'] }) },
  })

  const returnDate = designer.leave?.leave_end
    ? new Date(new Date(designer.leave.leave_end).getTime() + 86400000).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    : null

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
          cursor: 'pointer',
          transition: 'box-shadow 0.2s',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          opacity: isOnLeave ? 0.85 : 1,
          position: 'relative',
        }}
        onClick={() => setExpanded(v => !v)}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)' }}
      >
        {/* Header row */}
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

          {/* Status badge */}
          {isOnLeave ? (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 8,
              background: 'rgba(0,0,0,0.06)', color: '#6E6E73', flexShrink: 0,
              border: '1px solid rgba(0,0,0,0.08)',
            }}>
              Off
            </span>
          ) : designer.has_blocked ? (
            <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: 'rgba(225,29,72,0.09)', color: '#E11D48', flexShrink: 0 }}>
              Blocked
            </span>
          ) : null}
        </div>

        {/* Leave alert banner */}
        {isOnLeave && designer.leave && (
          <div style={{
            marginBottom: 12, padding: '10px 12px', borderRadius: 10,
            background: 'rgba(255,159,10,0.06)', border: '1px solid rgba(255,159,10,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
              <span style={{ fontSize: 11 }}>🗓</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#D97706' }}>
                {designer.leave.reason} · {formatDate(designer.leave.leave_start)} – {formatDate(designer.leave.leave_end)}
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
                Task standby — xử lý khi trở lại
              </p>
            )}
          </div>
        )}

        {/* New member training note */}
        {isNew && designer.training_note && isLeader && (
          <div style={{
            marginBottom: 12, padding: '9px 12px', borderRadius: 10,
            background: 'rgba(94,92,230,0.05)', border: '1px solid rgba(94,92,230,0.15)',
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#5E5CE6', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Ghi chú Training (chỉ Leader thấy)
            </p>
            <p style={{ fontSize: 11, color: '#3D3D3F', margin: 0, lineHeight: 1.55 }}>{designer.training_note}</p>
          </div>
        )}

        {/* Stats grid */}
        {!isOnLeave && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            gap: 1, background: 'rgba(0,0,0,0.05)', borderRadius: 10, overflow: 'hidden', marginBottom: 12,
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
                <p style={{ fontSize: 18, fontWeight: 700, color: stat.color, margin: 0, lineHeight: 1, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: 10, color: '#AEAEB2', margin: '4px 0 0', lineHeight: 1 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Capacity bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Capacity
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: isOnLeave ? '#AEAEB2' : capColor, fontVariantNumeric: 'tabular-nums' }}>
              {isOnLeave ? `Off · ${total} task` : `${total}/${MAX_CAPACITY}`}
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

        {/* Chevron */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10, color: '#AEAEB2', fontSize: 11 }}>
          {expanded ? '▲ Thu gọn' : '▼ Chi tiết'}
        </div>

        {/* Expanded section */}
        {expanded && (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Tasks summary */}
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

            {/* Leader actions */}
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
                    {promoteMutation.isPending ? 'Đang cập nhật...' : 'Xác nhận thử việc xong → Regular'}
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

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: 14, height: 180, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', opacity: 0.6 }}/>
  )
}

interface Props { isLeader?: boolean }

export default function WorkloadPanel({ isLeader = false }: Props) {
  const { data: workload, isLoading, isError } = useDesignerWorkload()

  const onLeaveCount = (workload ?? []).filter(d => d.leave?.is_on_leave).length
  const newMemberCount = (workload ?? []).filter(d => d.member_status === 'new').length

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: onLeaveCount > 0 || newMemberCount > 0 ? 10 : 16 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F', margin: 0, letterSpacing: '-0.01em' }}>Workload Designer</h3>
          <p style={{ fontSize: 12, color: '#AEAEB2', margin: '2px 0 0' }}>Năng lực thực tế từ hệ thống — click để xem chi tiết</p>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {onLeaveCount > 0 && (
            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: 'rgba(255,159,10,0.1)', color: '#D97706' }}>
              🏖 {onLeaveCount} off
            </span>
          )}
          {newMemberCount > 0 && (
            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: 'rgba(94,92,230,0.1)', color: '#5E5CE6' }}>
              ✦ {newMemberCount} mới
            </span>
          )}
          <span style={{ fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 99, background: 'rgba(0,0,0,0.05)', color: '#6E6E73' }}>Hôm nay</span>
        </div>
      </div>

      {/* Warning bar khi có người off với task chưa bàn giao */}
      {(workload ?? []).some(d => d.leave?.is_on_leave && (d.leave?.unhandled_tasks ?? 0) > 0) && (
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

      {isError && (
        <p style={{ fontSize: 12, color: '#AEAEB2', textAlign: 'center', padding: '20px 0', margin: 0 }}>Không thể tải dữ liệu workload</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {isLoading
          ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
          : (workload ?? []).map(d => <DesignerCard key={d.id} designer={d} isLeader={isLeader} />)
        }
      </div>
    </div>
  )
}
