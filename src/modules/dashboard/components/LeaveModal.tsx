'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../../shared/config/api-client'
import type { DesignerWorkload } from '../types/dashboard.types'

interface Props {
  designer: DesignerWorkload
  onClose: () => void
  onSaved: () => void
}

const LEAVE_REASONS = ['Nghỉ phép năm', 'Nghỉ bệnh', 'Nghỉ cưới', 'Việc gia đình', 'Khác']

function daysBetween(a: string, b: string) {
  return Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

export default function LeaveModal({ designer, onClose, onSaved }: Props) {
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
          {/* Khoảng thời gian */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Ngày bắt đầu nghỉ', value: startDate, set: setStartDate },
              { label: 'Ngày kết thúc nghỉ', value: endDate,   set: setEndDate },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#6E6E73', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 5 }}>{label}</label>
                <input
                  type="date" value={value} onChange={e => set(e.target.value)}
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

          {/* Lý do */}
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

          {/* Bàn giao task */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#6E6E73', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 5 }}>
              Bàn giao task
              {designer.active_tasks > 0 && (
                <span style={{ color: '#E11D48', marginLeft: 6, fontWeight: 700 }}>{designer.active_tasks} task đang chạy</span>
              )}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { value: 'standby',  label: 'Giữ nguyên — task tạm giữ đến khi trở lại', icon: '⏸' },
                { value: 'Lê Văn A', label: 'Chuyển cho Lê Văn A', icon: '→' },
                { value: 'Nguyễn C', label: 'Chuyển cho Nguyễn C', icon: '→' },
              ].map(opt => (
                <button key={opt.value} type="button" onClick={() => setHandoverTo(opt.value)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                  border: handoverTo === opt.value ? '1.5px solid #1D1D1F' : '1.5px solid rgba(0,0,0,0.1)',
                  background: handoverTo === opt.value ? 'rgba(0,0,0,0.03)' : 'transparent', transition: 'all 0.15s',
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
              flex: 2, height: 42, borderRadius: 10, border: 'none',
              cursor: startDate && endDate ? 'pointer' : 'not-allowed',
              fontSize: 13, fontWeight: 600,
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
