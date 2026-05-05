'use client'

import { useState } from 'react'
import AppLayout from '@/shared/layouts/AppLayout'

// ─── Roles ────────────────────────────────────────────────────────────────────
type Role = 'orderer' | 'designer' | 'leader'

const ROLES: Record<Role, { emoji: string; label: string; sub: string; color: string; bg: string; soft: string }> = {
  orderer:  { emoji: '👤', label: 'Orderer',       sub: 'Người yêu cầu',  color: '#2563EB', bg: 'rgba(37,99,235,0.08)',  soft: 'rgba(37,99,235,0.04)'  },
  designer: { emoji: '🎨', label: 'Designer',      sub: 'Người thực hiện', color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', soft: 'rgba(124,58,237,0.04)' },
  leader:   { emoji: '🔍', label: 'Design Leader', sub: 'Quản lý & QA',   color: '#E11D48', bg: 'rgba(225,29,72,0.08)',  soft: 'rgba(225,29,72,0.04)'  },
}

// ─── 6 milestones — chỉ map ai làm bước nào ──────────────────────────────────
const FLOW: { n: number; icon: string; title: string; owner: Role }[] = [
  { n: 1, icon: '📝', title: 'Tạo order',   owner: 'orderer'  },
  { n: 2, icon: '👤', title: 'Assign',      owner: 'leader'   },
  { n: 3, icon: '🎨', title: 'Bắt đầu làm', owner: 'designer' },
  { n: 4, icon: '📤', title: 'Giao bản đầu', owner: 'designer' },
  { n: 5, icon: '🔍', title: 'QA & Revise', owner: 'leader'   },
  { n: 6, icon: '✅', title: 'Hoàn tất',    owner: 'orderer'  },
]

// ─── Việc của từng vai trò — cô đọng tối đa ──────────────────────────────────
const ROLE_TODOS: Record<Role, { step: string; action: string; tip?: string }[]> = {
  orderer: [
    { step: 'Trước khi tạo',   action: 'Brief rõ: mục đích · đối tượng · thông điệp',                tip: 'Brief tốt = ít revise' },
    { step: 'Tạo order',       action: 'Topbar → "+ Tạo order mới" → 4 bước form',                  tip: 'Đừng skip Moodboard AI' },
    { step: 'Sau khi gửi',     action: 'Theo dõi trên Dashboard, vào Tracking Panel xem chi tiết' },
    { step: 'Nhận sản phẩm',   action: 'Review kỹ → feedback ngắn gọn, có ví dụ',                   tip: 'Tối đa 2 vòng revise' },
    { step: 'Khi đã ưng',      action: 'Tracking Panel → "Xác nhận hoàn thành"' },
  ],
  designer: [
    { step: 'Khi nhận task',   action: 'Mở Tracking Panel — đọc Brief + Moodboard + Color' },
    { step: 'Bắt đầu',         action: 'Nhấn "Bắt đầu làm" → status In Progress' },
    { step: 'Trong lúc làm',   action: 'Check-in mỗi 5 ngày trên Tracking Panel',                   tip: 'Quá 5 ngày → cờ đỏ tự động' },
    { step: 'Trước khi giao',  action: 'Tick đủ 8 items QA Checklist' },
    { step: 'Khi nhận feedback', action: 'Đọc kỹ → hỏi nếu chưa rõ → revise',                       tip: 'Đừng tự đoán ý Orderer' },
    { step: 'Hoàn tất',        action: 'Đính kèm source files → tick "final_handoff"' },
  ],
  leader: [
    { step: 'Sáng mỗi ngày',   action: 'Dashboard → check tab "Chờ nhận" + Alert Banner' },
    { step: 'Order mới vào',   action: 'Assign Designer trong vòng 24h',                            tip: 'Quá 24h → cờ vàng' },
    { step: 'Khi có cờ đỏ',    action: 'Mở order → quyết định can thiệp / escalate' },
    { step: 'QA bản giao',     action: 'Feedback chi tiết, có ví dụ — không chung chung' },
    { step: 'Vòng revise ≥ 3', action: 'Họp 1-on-1 với Designer, không chỉ comment',                tip: 'Vấn đề là sự hiểu, không phải skill' },
    { step: 'Cuối tuần',       action: 'Tab Analytics → review KPI + resolve flags' },
  ],
}

const QA_ITEMS = [
  { key: 'size',      label: 'Đúng size & format theo Form Order' },
  { key: 'brand',     label: 'Đúng Brand Guideline (màu, font, logo)' },
  { key: 'spelling',  label: 'Không lỗi chính tả, đúng tone NhiLe' },
  { key: 'brief',     label: 'Khớp 100% brief gốc — không thêm/bớt' },
  { key: 'moodboard', label: 'Nhất quán với Moodboard AI đã chọn' },
  { key: 'canva',     label: 'File Canva share public (không private)' },
  { key: 'status',    label: 'Đã update status trên Tracking Panel' },
  { key: 'handoff',   label: 'Source file & export đầy đủ' },
]

const SLA_RULES = [
  { type: 'Social Feed/Story',   sla: '2–3 ngày' },
  { type: 'Social Carousel',     sla: '3–4 ngày' },
  { type: 'LinkedIn',            sla: '2–3 ngày' },
  { type: 'YouTube Thumb',       sla: '1–2 ngày' },
  { type: 'Email',               sla: '3–4 ngày' },
  { type: 'Print',               sla: '4–5 ngày' },
  { type: '⚡ URGENT',            sla: 'Trong ngày' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SOPChecklistPage() {
  const [role, setRole] = useState<Role>('designer')
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [showFlags, setShowFlags] = useState(false)

  const passCount = QA_ITEMS.filter(i => checked[i.key]).length
  const total = QA_ITEMS.length
  const pct = Math.round((passCount / total) * 100)
  const r = ROLES[role]
  const todos = ROLE_TODOS[role]

  return (
    <AppLayout activeNav="sop" title="SOP & Checklist">
      <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── Header ── */}
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1D1D1F', margin: '0 0 6px', letterSpacing: '-0.025em' }}>
            Đây là việc của bạn.
          </h1>
          <p style={{ fontSize: 14, color: '#6E6E73', margin: 0 }}>
            Chọn vai trò để xem quy trình của mình
          </p>
        </div>

        {/* ── Role Tabs (segmented control) ── */}
        <div style={{
          display: 'inline-flex', alignSelf: 'flex-start',
          padding: 4, borderRadius: 14, background: 'rgba(0,0,0,0.05)',
          gap: 2,
        }}>
          {(Object.keys(ROLES) as Role[]).map(k => {
            const cfg = ROLES[k]
            const active = role === k
            return (
              <button
                key={k}
                onClick={() => setRole(k)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px', borderRadius: 10, border: 'none',
                  background: active ? '#fff' : 'transparent',
                  color: active ? cfg.color : '#6E6E73',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.18s ease',
                }}
              >
                <span style={{ fontSize: 15 }}>{cfg.emoji}</span>
                {cfg.label}
              </button>
            )
          })}
        </div>

        {/* ── Workflow Map (highlight bước của role) ── */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: '20px 24px',
          border: '1px solid rgba(0,0,0,0.07)',
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px' }}>
            Workflow · 6 bước
          </p>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
            {FLOW.map((step, i) => {
              const isMine = step.owner === role
              const ownerCfg = ROLES[step.owner]
              return (
                <div key={step.n} style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
                  <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 6, padding: '0 4px',
                    opacity: isMine ? 1 : 0.35,
                    transition: 'opacity 0.25s ease',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: isMine ? ownerCfg.color : '#F5F5F7',
                      color: isMine ? '#fff' : '#AEAEB2',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700,
                      boxShadow: isMine ? `0 4px 12px ${ownerCfg.bg}` : 'none',
                      transition: 'all 0.25s ease',
                    }}>
                      {step.n}
                    </div>
                    <p style={{
                      fontSize: 11, fontWeight: 600, margin: 0, textAlign: 'center',
                      color: isMine ? '#1D1D1F' : '#AEAEB2',
                      lineHeight: 1.3, whiteSpace: 'nowrap',
                    }}>{step.title}</p>
                  </div>
                  {i < FLOW.length - 1 && (
                    <div style={{
                      width: 16, height: 2, background: 'rgba(0,0,0,0.08)',
                      flexShrink: 0,
                    }}/>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Role TODO List (the hero) ── */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: 28,
          border: `1px solid ${r.bg}`,
          boxShadow: `0 1px 3px rgba(0,0,0,0.04), 0 0 0 4px ${r.soft}`,
          transition: 'all 0.25s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: r.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>{r.emoji}</div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1D1D1F', margin: 0, letterSpacing: '-0.015em' }}>
                Việc của {r.label}
              </h2>
              <p style={{ fontSize: 12, color: '#6E6E73', margin: 0 }}>{r.sub} · {todos.length} việc cần nhớ</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 18 }}>
            {todos.map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '14px 4px',
                borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.05)',
              }}>
                <div style={{
                  flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
                  background: r.bg, color: r.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: r.color, margin: '2px 0 3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {t.step}
                  </p>
                  <p style={{ fontSize: 14, color: '#1D1D1F', margin: 0, fontWeight: 500, lineHeight: 1.45 }}>
                    {t.action}
                  </p>
                  {t.tip && (
                    <p style={{ fontSize: 12, color: '#6E6E73', margin: '4px 0 0', fontStyle: 'italic' }}>
                      → {t.tip}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── QA Checklist (only for designer, but always visible as reference) ── */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: 24,
          border: '1px solid rgba(0,0,0,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1D1D1F', margin: 0, letterSpacing: '-0.015em' }}>
              Checklist QA
            </h2>
            {passCount > 0 && (
              <button
                onClick={() => setChecked({})}
                style={{
                  fontSize: 12, color: '#6E6E73', border: 'none',
                  background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
                  padding: '4px 8px', borderRadius: 6,
                }}
              >Reset</button>
            )}
          </div>
          <p style={{ fontSize: 12, color: '#6E6E73', margin: '0 0 16px' }}>
            Designer tick đủ 8 trước khi nhấn &quot;Giao sản phẩm&quot;
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {QA_ITEMS.map((item) => {
              const done = !!checked[item.key]
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setChecked(p => ({ ...p, [item.key]: !p[item.key] }))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 4px', border: 'none',
                    background: 'transparent', cursor: 'pointer',
                    textAlign: 'left', width: '100%', fontFamily: 'inherit',
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                    border: done ? 'none' : '1.8px solid rgba(0,0,0,0.18)',
                    background: done ? '#16A34A' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.18s',
                    boxShadow: done ? '0 2px 6px rgba(22,163,74,0.25)' : 'none',
                  }}>
                    {done && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <span style={{
                    fontSize: 14, color: done ? '#AEAEB2' : '#1D1D1F',
                    textDecoration: done ? 'line-through' : 'none',
                    lineHeight: 1.4, transition: 'all 0.18s',
                    fontWeight: 500,
                  }}>{item.label}</span>
                </button>
              )
            })}
          </div>

          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 6, background: 'rgba(0,0,0,0.06)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99,
                background: pct === 100 ? '#16A34A' : '#1D1D1F',
                width: `${pct}%`, transition: 'width 0.4s ease, background 0.3s ease',
              }}/>
            </div>
            <span style={{
              fontSize: 13, fontWeight: 700,
              color: pct === 100 ? '#16A34A' : '#1D1D1F',
              minWidth: 56, textAlign: 'right', fontVariantNumeric: 'tabular-nums',
            }}>{passCount}/{total}</span>
          </div>
        </div>

        {/* ── Reference: SLA + Flags (compact, secondary) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          {/* SLA — horizontal pill list */}
          <div style={{
            background: '#fff', borderRadius: 16, padding: '18px 20px',
            border: '1px solid rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                SLA tham khảo
              </span>
              <span style={{ fontSize: 11, color: '#AEAEB2' }}>· tính từ assign → giao bản đầu</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SLA_RULES.map(r => (
                <div key={r.type} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '6px 12px', borderRadius: 99,
                  background: 'rgba(0,0,0,0.04)',
                  fontSize: 12,
                }}>
                  <span style={{ color: '#1D1D1F', fontWeight: 500 }}>{r.type}</span>
                  <span style={{ color: '#6E6E73', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{r.sla}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Flag system — collapsed by default */}
          <div style={{
            background: '#fff', borderRadius: 16,
            border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden',
          }}>
            <button
              onClick={() => setShowFlags(s => !s)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Hệ thống cờ tự động
                </span>
                <span style={{ fontSize: 11, color: '#AEAEB2' }}>· khi nào cảnh báo bật</span>
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AEAEB2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showFlags ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {showFlags && (
              <div style={{ padding: '4px 20px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ padding: 12, background: 'rgba(255,159,10,0.06)', borderRadius: 10 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#CC7A00', margin: '0 0 6px' }}>⚠ Cờ vàng</p>
                  <p style={{ fontSize: 11, color: '#3A3A3C', margin: 0, lineHeight: 1.6 }}>
                    Pending &gt; 24h chưa assign · Vòng revise thứ 2 · Brief thiếu thông tin
                  </p>
                </div>
                <div style={{ padding: 12, background: 'rgba(225,29,72,0.06)', borderRadius: 10 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#E11D48', margin: '0 0 6px' }}>🚨 Cờ đỏ</p>
                  <p style={{ fontSize: 11, color: '#3A3A3C', margin: 0, lineHeight: 1.6 }}>
                    Vòng revise ≥ 3 · Không check-in &gt; 5 ngày · Quá deadline · Manual escalation
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </AppLayout>
  )
}
