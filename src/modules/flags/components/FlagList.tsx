'use client'

// src/modules/flags/components/FlagList.tsx
import { useState } from 'react'
import { useFlags, useResolveFlag } from '../hooks/useFlags'
import { FlagBadge } from './FlagBadge'

const REASON_LABEL: Record<string, string> = {
  unassigned_24h:       'Chưa assign sau 24h',
  no_brief_check:       'Chưa check brief',
  no_checkin_5d:        'Không check-in 5 ngày',
  revision_warn:        'Revision ≥ 2 lần',
  revision_red:         'Revision ≥ 3 lần',
  checklist_item_failed:'Checklist item failed',
  manual_escalation:    'Báo Leader can thiệp',
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

interface Props {
  orderId: string
  canResolve?: boolean
}

export function FlagList({ orderId, canResolve = false }: Props) {
  const { data: flags = [], isLoading } = useFlags(orderId)
  const resolve = useResolveFlag(orderId)
  const [resolving, setResolving] = useState<string | null>(null)
  const [note, setNote] = useState('')

  if (isLoading) return <p style={{ fontSize: 12, color: '#AEAEB2' }}>Đang tải...</p>
  if (flags.length === 0) return <p style={{ fontSize: 12, color: '#AEAEB2' }}>Không có flag nào.</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {flags.map(flag => (
        <div key={flag.id} style={{
          borderRadius: 10, padding: '10px 12px',
          background: flag.flag_type === 'red' ? 'rgba(255,59,48,0.05)' : 'rgba(255,149,0,0.05)',
          border: flag.flag_type === 'red' ? '1px solid rgba(255,59,48,0.2)' : '1px solid rgba(255,149,0,0.2)',
          opacity: flag.is_active ? 1 : 0.5,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <FlagBadge type={flag.flag_type} compact />
                <span style={{ fontSize: 11, color: '#6E6E73' }}>
                  {REASON_LABEL[flag.reason] ?? flag.reason}
                </span>
              </div>
              {flag.detail && (
                <p style={{ fontSize: 11, color: '#6E6E73', margin: '0 0 4px', lineHeight: 1.4 }}>{flag.detail}</p>
              )}
              <p style={{ fontSize: 10, color: '#AEAEB2', margin: 0 }}>
                {fmtDate(flag.created_at)}
                {flag.triggered_by && ` · ${flag.triggered_by.full_name}`}
              </p>
              {!flag.is_active && flag.resolved_at && (
                <p style={{ fontSize: 10, color: '#16A34A', margin: '4px 0 0', fontWeight: 600 }}>
                  ✓ Đã giải quyết {fmtDate(flag.resolved_at)}
                  {flag.resolved_by && ` bởi ${flag.resolved_by.full_name}`}
                </p>
              )}
            </div>
            {canResolve && flag.is_active && (
              <button
                onClick={() => setResolving(resolving === flag.id ? null : flag.id)}
                style={{
                  fontSize: 10, fontWeight: 600, color: '#2563EB',
                  border: '1px solid rgba(37,99,235,0.3)', borderRadius: 6,
                  padding: '3px 8px', background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                Resolve
              </button>
            )}
          </div>

          {resolving === flag.id && (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <textarea
                placeholder="Ghi chú giải quyết..."
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={2}
                autoFocus
                style={{
                  width: '100%', boxSizing: 'border-box', fontSize: 11,
                  border: '1px solid rgba(0,0,0,0.15)', borderRadius: 6,
                  padding: '6px 8px', resize: 'none', fontFamily: 'inherit', outline: 'none',
                }}
              />
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  disabled={!note.trim() || resolve.isPending}
                  onClick={() => {
                    resolve.mutate({ flagId: flag.id, payload: { resolution_note: note } }, {
                      onSuccess: () => { setResolving(null); setNote('') },
                    })
                  }}
                  style={{
                    fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 6, border: 'none',
                    background: note.trim() ? '#16A34A' : '#E5E7EB',
                    color: note.trim() ? '#fff' : '#9CA3AF',
                    cursor: note.trim() ? 'pointer' : 'not-allowed',
                  }}
                >
                  {resolve.isPending ? '...' : 'Xác nhận'}
                </button>
                <button
                  onClick={() => { setResolving(null); setNote('') }}
                  style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.12)', background: 'transparent', cursor: 'pointer', color: '#6E6E73' }}
                >
                  Huỷ
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
