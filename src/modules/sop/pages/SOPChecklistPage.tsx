'use client'

import { useState } from 'react'
import AppLayout from '@/shared/layouts/AppLayout'

const SOP_STEPS = [
  { n: 1, title: 'Người yêu cầu điền Form Order',           who: 'Người yêu cầu (từ bất kỳ team nào)', color: '#EFF6FF', border: '#BFDBFE', numBg: '#2563EB', icon: '📝' },
  { n: 2, title: 'Phân công task trên Telegram',             who: 'Bot / Co-Leader',                    color: '#F5F3FF', border: '#DDD6FE', numBg: '#7C3AED', icon: '📲' },
  { n: 3, title: 'Designer confirm & cập nhật Sheet',        who: 'Designer (Volunteer)',                color: '#FFFBEB', border: '#FDE68A', numBg: '#D97706', icon: '✅' },
  { n: 4, title: 'Thực hiện và gửi Canva lên QA',            who: 'Designer (Volunteer)',                color: '#FFF7ED', border: '#FED7AA', numBg: '#EA580C', icon: '🎨' },
  { n: 5, title: 'QA kiểm tra & Feedback (tối đa 2 vòng)',   who: 'Co-Leader (QA)',                     color: '#FFF1F2', border: '#FECDD3', numBg: '#E11D48', icon: '🔍' },
  { n: 6, title: 'Hoàn thành & trả output',                  who: 'Designer (Volunteer)',                color: '#F0FDF4', border: '#BBF7D0', numBg: '#16A34A', icon: '📤' },
  { n: 7, title: 'Người order xác nhận',                     who: 'Người yêu cầu',                      color: '#F0FDFA', border: '#99F6E4', numBg: '#0D9488', icon: '🎉' },
]

const QA_ITEMS = [
  { key: 'size',       label: 'Thiết kế đúng size và format theo yêu cầu trong Form Order' },
  { key: 'brand',      label: 'Áp dụng đúng Brand Guideline: màu sắc, font, logo NhiLe' },
  { key: 'spelling',   label: 'Không có lỗi chính tả — đúng tone of voice của NhiLe' },
  { key: 'filename',   label: 'Thiết kế được lưu đúng quy ước tên: Tên_TaskName' },
  { key: 'feedback',   label: 'Đã có ít nhất 1 vòng feedback (trừ task gấp URGENT)' },
  { key: 'brief',      label: 'Nội dung khớp với brief gốc — không tự ý thêm/bớt thông tin' },
  { key: 'sheet',      label: 'Đã cập nhật trạng thái Sheet trước khi gửi QA' },
  { key: 'canva',      label: 'File Canva share được qua link (không private)' },
]

const SLA_RULES = [
  { type: 'Bài post 1 hình (feed/story/poster)',  sla: '2–3 ngày làm việc', color: '#EFF6FF', text: '#2563EB' },
  { type: 'Carousel (3–5 ảnh)',                    sla: '3–4 ngày làm việc', color: '#F5F3FF', text: '#7C3AED' },
  { type: 'Banner / Thumbnail',                    sla: '2–3 ngày làm việc', color: '#FFFBEB', text: '#D97706' },
  { type: 'Infographic / Deck nội bộ',             sla: '4–5 ngày làm việc', color: '#FFF7ED', text: '#EA580C' },
  { type: '⚡ Task gấp URGENT',                    sla: 'Trong ngày (URGENT)', color: '#FFF1F2', text: '#E11D48' },
]

export default function SOPChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const passCount  = QA_ITEMS.filter(i => checked[i.key]).length
  const total      = QA_ITEMS.length
  const pct        = Math.round((passCount / total) * 100)
  const barColor   = pct === 100 ? '#16A34A' : pct > 50 ? '#2563EB' : '#AEAEB2'

  function toggle(key: string) {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
  }
  function reset() { setChecked({}) }

  return (
    <AppLayout activeNav="sop" title="SOP & Checklist">
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Page header */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1D1D1F', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            SOP & Checklist QA
          </h1>
          <p style={{ fontSize: 13, color: '#6E6E73', margin: 0 }}>
            NL-SOP-DESIGN-001 · v1.0 · Singapore Way
          </p>
        </div>

        {/* ── Quy trình 7 bước ── */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1px solid rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1D1D1F', margin: '0 0 18px', letterSpacing: '-0.01em' }}>
            Quy trình 7 bước
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SOP_STEPS.map((step, i) => (
              <div key={step.n} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                {/* Connector line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: step.numBg,
                    color: '#fff', fontSize: 13, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {step.n}
                  </div>
                  {i < SOP_STEPS.length - 1 && (
                    <div style={{ width: 2, height: 16, background: 'rgba(0,0,0,0.08)', marginTop: 4 }}/>
                  )}
                </div>
                <div style={{
                  flex: 1, padding: '10px 14px', borderRadius: 12,
                  background: step.color, border: `1px solid ${step.border}`,
                  marginBottom: i < SOP_STEPS.length - 1 ? 0 : 0,
                }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', margin: '0 0 3px' }}>
                    {step.icon} {step.title}
                  </p>
                  <p style={{ fontSize: 11, color: '#6E6E73', margin: 0 }}>👤 {step.who}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SLA Tiêu chuẩn ── */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1px solid rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1D1D1F', margin: '0 0 16px', letterSpacing: '-0.01em' }}>
            SLA Tiêu chuẩn theo loại task
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SLA_RULES.map(r => (
              <div key={r.type} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 16px', borderRadius: 12,
                background: r.color, gap: 12,
              }}>
                <p style={{ fontSize: 13, color: '#1D1D1F', margin: 0, fontWeight: 500 }}>{r.type}</p>
                <span style={{
                  fontSize: 12, fontWeight: 700, color: r.text,
                  background: '#fff', padding: '3px 12px', borderRadius: 20,
                  whiteSpace: 'nowrap', flexShrink: 0,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}>
                  ⏱ {r.sla}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Checklist QA Interactive ── */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1px solid rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1D1D1F', margin: 0, letterSpacing: '-0.01em' }}>
              Checklist QA
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {passCount === total && (
                <span style={{ fontSize: 12, fontWeight: 700, color: '#16A34A', background: 'rgba(22,163,74,0.08)', padding: '3px 10px', borderRadius: 20 }}>
                  ✓ Tất cả đạt
                </span>
              )}
              <button
                onClick={reset}
                style={{
                  fontSize: 12, color: '#6E6E73', border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: 8, padding: '5px 12px', background: 'transparent',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Reset
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {QA_ITEMS.map((item) => {
              const isDone = !!checked[item.key]
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggle(item.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 12, border: 'none',
                    background: isDone ? 'rgba(22,163,74,0.05)' : 'rgba(0,0,0,0.02)',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    transition: 'background 0.15s',
                    fontFamily: 'inherit',
                  }}
                >
                  {/* Checkbox */}
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                    border: isDone ? 'none' : '2px solid rgba(0,0,0,0.2)',
                    background: isDone ? '#16A34A' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                    boxShadow: isDone ? '0 1px 4px rgba(22,163,74,0.3)' : 'none',
                  }}>
                    {isDone && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                        stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <span style={{
                    fontSize: 13, color: isDone ? '#16A34A' : '#3A3A3C',
                    textDecoration: isDone ? 'line-through' : 'none',
                    lineHeight: 1.5, transition: 'all 0.15s',
                  }}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 6, background: 'rgba(0,0,0,0.07)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99, background: barColor,
                width: `${pct}%`, transition: 'width 0.3s ease, background 0.3s ease',
              }}/>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: barColor, minWidth: 60, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
              {passCount}/{total} Pass
            </span>
          </div>
        </div>

      </div>
    </AppLayout>
  )
}
