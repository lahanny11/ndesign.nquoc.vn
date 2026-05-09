'use client'

import { useState, useMemo } from 'react'
import AppLayout from '@/shared/layouts/AppLayout'
import {
  FEEDBACKS, CATEGORY_META, STATUS_META,
  avatarColor, timeAgo, daysOpen,
  type FeedbackItem, type FeedbackCategory,
} from '../data/feedback.data'

type FilterTab = 'all' | 'open' | 'resolved' | 'mine'

export default function FeedbackPage() {
  const [items, setItems] = useState<FeedbackItem[]>(FEEDBACKS)
  const [tab, setTab] = useState<FilterTab>('all')
  const [activeCat, setActiveCat] = useState<FeedbackCategory | 'all'>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  // ─── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const open = items.filter(i => i.status === 'open' || i.status === 'reviewing').length
    const resolved = items.filter(i => i.status === 'resolved').length
    const overdue = items.filter(i => (i.status === 'open' || i.status === 'reviewing') && daysOpen(i.createdAt) > 7).length
    const resolvedItems = items.filter(i => i.resolvedAt)
    const avgDays = resolvedItems.length === 0 ? 0 : resolvedItems.reduce((sum, i) => {
      const dur = (new Date(i.resolvedAt!).getTime() - new Date(i.createdAt).getTime()) / 86400000
      return sum + dur
    }, 0) / resolvedItems.length
    return { open, resolved, overdue, avgDays: avgDays.toFixed(1) }
  }, [items])

  // ─── Filter ─────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = items
    if (tab === 'open')     list = list.filter(i => i.status === 'open' || i.status === 'reviewing')
    if (tab === 'resolved') list = list.filter(i => i.status === 'resolved' || i.status === 'wontfix')
    if (tab === 'mine')     list = list.filter(i => i.author === 'Lê Văn A') // mock current user
    if (activeCat !== 'all') list = list.filter(i => i.category === activeCat)
    return list
  }, [items, tab, activeCat])

  // ─── Submit new feedback ────────────────────────────────────────────────────
  function handleSubmit(newFb: Omit<FeedbackItem, 'id' | 'createdAt' | 'status' | 'replies'>) {
    const fb: FeedbackItem = {
      ...newFb,
      id: 'fb-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'open',
      replies: [],
    }
    setItems([fb, ...items])
    setShowForm(false)
  }

  return (
    <AppLayout activeNav="feedback" title="Phản hồi">
      <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1D1D1F', margin: '0 0 6px', letterSpacing: '-0.025em' }}>
              Tiếng nói của bạn.
            </h1>
            <p style={{ fontSize: 14, color: '#6E6E73', margin: 0 }}>
              Mọi phản hồi đều có người trả lời trong 7 ngày.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 10,
              fontSize: 13, fontWeight: 600, color: '#fff',
              background: '#1D1D1F', border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
              transition: 'opacity 0.15s', fontFamily: 'inherit',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
            </svg>
            Gửi phản hồi
          </button>
        </div>

        {/* ── Stats row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          <StatCard label="Đang mở"        value={stats.open}      hint="cần xử lý"  color="#D97706"/>
          <StatCard label="Đã xử lý"       value={stats.resolved}  hint="tổng tới giờ" color="#16A34A"/>
          <StatCard label="Quá hạn 7 ngày" value={stats.overdue}   hint={stats.overdue > 0 ? 'cần urgent' : 'on track'} color={stats.overdue > 0 ? '#E11D48' : '#16A34A'}/>
          <StatCard label="Avg thời gian"  value={`${stats.avgDays}d`} hint="từ gửi đến resolve" color="#1D1D1F"/>
        </div>

        {/* ── Tabs + Category filter ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {/* Tabs */}
          <div style={{
            display: 'inline-flex', padding: 4, borderRadius: 12,
            background: 'rgba(0,0,0,0.05)', gap: 2,
          }}>
            {([
              { k: 'all', label: 'Tất cả' },
              { k: 'open', label: 'Đang mở' },
              { k: 'resolved', label: 'Đã xử lý' },
              { k: 'mine', label: 'Của tôi' },
            ] as { k: FilterTab; label: string }[]).map(t => {
              const active = tab === t.k
              return (
                <button
                  key={t.k}
                  onClick={() => setTab(t.k)}
                  style={{
                    padding: '7px 14px', borderRadius: 9, border: 'none',
                    background: active ? '#fff' : 'transparent',
                    color: active ? '#1D1D1F' : '#6E6E73',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.18s ease',
                  }}
                >{t.label}</button>
              )
            })}
          </div>

          {/* Category chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginLeft: 'auto' }}>
            <button
              onClick={() => setActiveCat('all')}
              style={catChipStyle(activeCat === 'all', '#1D1D1F', 'rgba(0,0,0,0.05)')}
            >Mọi loại</button>
            {(Object.keys(CATEGORY_META) as FeedbackCategory[]).map(k => {
              const m = CATEGORY_META[k]
              const active = activeCat === k
              return (
                <button
                  key={k}
                  onClick={() => setActiveCat(k)}
                  style={catChipStyle(active, m.color, m.bg)}
                >
                  <span style={{ fontSize: 13 }}>{m.emoji}</span> {m.short}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Feedback list ── */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(fb => (
              <FeedbackCard
                key={fb.id}
                fb={fb}
                expanded={openId === fb.id}
                onToggle={() => setOpenId(openId === fb.id ? null : fb.id)}
              />
            ))}
          </div>
        )}

        {/* ── Footer note ── */}
        <div style={{
          textAlign: 'center', fontSize: 12, color: '#AEAEB2',
          padding: '12px 0', borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: 8,
        }}>
          Phản hồi quá 7 ngày chưa có verdict → tự động flag cho Design Leader.
        </div>
      </div>

      {/* ── New feedback modal ── */}
      {showForm && <NewFeedbackModal onClose={() => setShowForm(false)} onSubmit={handleSubmit}/>}
    </AppLayout>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, hint, color }: { label: string; value: string | number; hint: string; color: string }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '14px 16px',
      border: '1px solid rgba(0,0,0,0.06)',
    }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 6px' }}>
        {label}
      </p>
      <p style={{ fontSize: 24, fontWeight: 700, color, margin: 0, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </p>
      <p style={{ fontSize: 11, color: '#AEAEB2', margin: '4px 0 0' }}>{hint}</p>
    </div>
  )
}

// ─── Category chip helper ────────────────────────────────────────────────────
function catChipStyle(active: boolean, color: string, bg: string): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '6px 12px', borderRadius: 99,
    border: active ? `1.5px solid ${color}` : '1.5px solid transparent',
    background: active ? bg : 'rgba(0,0,0,0.04)',
    color: active ? color : '#6E6E73',
    fontSize: 12, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'inherit', transition: 'all 0.18s ease',
  }
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{
      padding: '60px 20px', textAlign: 'center',
      background: '#fff', borderRadius: 16, border: '1px dashed rgba(0,0,0,0.12)',
    }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>💭</div>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#1D1D1F', margin: '0 0 4px' }}>
        Chưa có phản hồi nào ở đây
      </p>
      <p style={{ fontSize: 12, color: '#6E6E73', margin: 0 }}>
        Im lặng cũng là một loại feedback — nhưng kém hữu ích nhất.
      </p>
    </div>
  )
}

// ─── Feedback card ────────────────────────────────────────────────────────────
function FeedbackCard({ fb, expanded, onToggle }: {
  fb: FeedbackItem; expanded: boolean; onToggle: () => void
}) {
  const cat = CATEGORY_META[fb.category]
  const st = STATUS_META[fb.status]
  const days = daysOpen(fb.createdAt)
  const isOverdue = (fb.status === 'open' || fb.status === 'reviewing') && days > 7

  return (
    <div style={{
      background: '#fff', borderRadius: 14,
      border: `1px solid ${isOverdue ? 'rgba(225,29,72,0.35)' : 'rgba(0,0,0,0.06)'}`,
      transition: 'all 0.2s ease', overflow: 'hidden',
      boxShadow: expanded ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
    }}>
      {/* Top row */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', padding: '16px 18px', border: 'none',
          background: 'transparent', cursor: 'pointer',
          textAlign: 'left', fontFamily: 'inherit',
        }}
      >
        {/* Meta line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 6,
            background: cat.bg, color: cat.color,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase',
          }}>
            <span style={{ fontSize: 11 }}>{cat.emoji}</span> {cat.label}
          </span>
          {fb.relatedOrder && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: '#6E6E73',
              padding: '3px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.04)',
              fontFamily: 'monospace',
            }}>↳ {fb.relatedOrder}</span>
          )}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 6,
            background: st.bg, color: st.color,
            fontSize: 10, fontWeight: 700, marginLeft: 'auto',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: st.dot }}/>
            {st.label}
          </span>
          {isOverdue && (
            <span style={{
              fontSize: 10, fontWeight: 700, color: '#E11D48',
              padding: '3px 8px', borderRadius: 6, background: 'rgba(225,29,72,0.08)',
            }}>⚠ Quá {days - 7}d</span>
          )}
        </div>

        {/* Title */}
        <p style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F', margin: '0 0 6px', lineHeight: 1.4 }}>
          {fb.title}
        </p>

        {/* Body preview (truncated when collapsed) */}
        <p style={{
          fontSize: 13, color: '#3A3A3C', margin: '0 0 12px', lineHeight: 1.55,
          display: expanded ? 'block' : '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {fb.body}
        </p>

        {/* Author + footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6E6E73' }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: avatarColor(fb.author),
            color: '#fff', fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>{fb.author[0]}</div>
          <span style={{ fontWeight: 600, color: '#1D1D1F' }}>{fb.author}</span>
          <span style={{ color: '#AEAEB2' }}>·</span>
          <span>{roleLabel(fb.role)}{fb.team ? ` · ${fb.team}` : ''}</span>
          <span style={{ color: '#AEAEB2' }}>·</span>
          <span>{timeAgo(fb.createdAt)}</span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
            💬 {fb.replies.length}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#AEAEB2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </div>
      </button>

      {/* Expanded thread */}
      {expanded && (
        <div style={{ padding: '0 18px 18px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          {/* Resolution note (if any) */}
          {fb.resolutionNote && (
            <div style={{
              marginTop: 14, padding: '12px 14px',
              background: fb.status === 'wontfix' ? 'rgba(100,116,139,0.06)' : 'rgba(22,163,74,0.06)',
              border: `1px solid ${fb.status === 'wontfix' ? 'rgba(100,116,139,0.18)' : 'rgba(22,163,74,0.18)'}`,
              borderRadius: 10,
            }}>
              <p style={{
                fontSize: 11, fontWeight: 700, margin: '0 0 4px',
                color: fb.status === 'wontfix' ? '#475569' : '#16A34A',
                textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>
                {fb.status === 'wontfix' ? '◆ Verdict: Không làm' : '✓ Verdict: Đã xử lý'}
              </p>
              <p style={{ fontSize: 13, color: '#1D1D1F', margin: 0, lineHeight: 1.5 }}>
                {fb.resolutionNote}
              </p>
            </div>
          )}

          {/* Replies */}
          {fb.replies.length > 0 && (
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {fb.replies.map(reply => (
                <div key={reply.id} style={{ display: 'flex', gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: reply.role === 'leader' ? 'linear-gradient(135deg,#6C6BAE,#4A4990)' : avatarColor(reply.author),
                    color: '#fff', fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>{reply.author[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1D1D1F' }}>{reply.author}</span>
                      {reply.role === 'leader' && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                          background: 'linear-gradient(135deg,rgba(108,107,174,0.15),rgba(74,73,144,0.15))',
                          color: '#6C6BAE',
                        }}>LEADER</span>
                      )}
                      <span style={{ fontSize: 11, color: '#AEAEB2' }}>· {timeAgo(reply.createdAt)}</span>
                    </div>
                    <p style={{
                      fontSize: 13, color: '#3A3A3C', margin: 0, lineHeight: 1.55,
                      padding: '10px 12px', background: 'rgba(0,0,0,0.03)', borderRadius: 10,
                    }}>{reply.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply box (UI mock — chưa wire backend) */}
          <div style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              placeholder="Trả lời ngắn gọn — đi thẳng vào vấn đề..."
              rows={2}
              style={{
                flex: 1, padding: '10px 12px',
                border: '1px solid rgba(0,0,0,0.12)', borderRadius: 10,
                fontSize: 13, color: '#1D1D1F', resize: 'none',
                outline: 'none', fontFamily: 'inherit',
              }}
            />
            <button style={{
              padding: '10px 16px', borderRadius: 10, border: 'none',
              background: '#1D1D1F', color: '#fff',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              whiteSpace: 'nowrap', alignSelf: 'stretch',
              fontFamily: 'inherit',
            }}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  )
}

function roleLabel(r: 'designer' | 'orderer' | 'leader'): string {
  return r === 'designer' ? 'Designer' : r === 'orderer' ? 'Orderer' : 'Design Leader'
}

// ─── New feedback modal ──────────────────────────────────────────────────────
function NewFeedbackModal({
  onClose, onSubmit,
}: {
  onClose: () => void
  onSubmit: (fb: Omit<FeedbackItem, 'id' | 'createdAt' | 'status' | 'replies'>) => void
}) {
  const [cat, setCat] = useState<FeedbackCategory | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [order, setOrder] = useState('')

  const canSubmit = !!cat && title.trim().length >= 10 && body.trim().length >= 30

  function submit() {
    if (!canSubmit || !cat) return
    onSubmit({
      category: cat,
      title: title.trim(),
      body: body.trim(),
      author: 'Lê Văn A',  // mock current user
      role: 'designer',
      relatedOrder: order.trim() || undefined,
    })
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)', padding: 20,
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 20, width: 560, maxWidth: '100%',
        maxHeight: '90vh', overflow: 'auto',
        boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1D1D1F', margin: 0, letterSpacing: '-0.02em' }}>
              Gửi phản hồi
            </h2>
            <p style={{ fontSize: 12, color: '#6E6E73', margin: '2px 0 0' }}>
              Nói thẳng. Sẽ có verdict trong 7 ngày.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 8, border: 'none',
              background: 'rgba(0,0,0,0.06)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" stroke="#1D1D1F" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="#1D1D1F" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Category — bắt buộc */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#3A3A3C', marginBottom: 8, display: 'block' }}>
              Loại phản hồi <span style={{ color: '#E11D48' }}>*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {(Object.keys(CATEGORY_META) as FeedbackCategory[]).map(k => {
                const m = CATEGORY_META[k]
                const sel = cat === k
                return (
                  <button
                    key={k}
                    onClick={() => setCat(k)}
                    style={{
                      padding: '12px 14px', borderRadius: 10,
                      border: sel ? `1.5px solid ${m.color}` : '1.5px solid rgba(0,0,0,0.08)',
                      background: sel ? m.bg : '#fff',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.18s ease', fontFamily: 'inherit',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 16 }}>{m.emoji}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: sel ? m.color : '#1D1D1F' }}>{m.label}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#6E6E73', margin: 0, lineHeight: 1.4 }}>{m.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#3A3A3C', marginBottom: 6, display: 'block' }}>
              Tóm tắt 1 câu <span style={{ color: '#E11D48' }}>*</span>
              <span style={{ float: 'right', color: title.length < 10 ? '#AEAEB2' : '#16A34A', fontWeight: 500 }}>
                {title.length}/100
              </span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value.slice(0, 100))}
              placeholder="VD: Brief từ team Content thường thiếu mục tiêu chính"
              style={{
                width: '100%', padding: '10px 12px',
                border: '1px solid rgba(0,0,0,0.12)', borderRadius: 10,
                fontSize: 13, color: '#1D1D1F', outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Body */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#3A3A3C', marginBottom: 6, display: 'block' }}>
              Mô tả chi tiết <span style={{ color: '#E11D48' }}>*</span>
              <span style={{ float: 'right', color: body.length < 30 ? '#AEAEB2' : '#16A34A', fontWeight: 500 }}>
                {body.length}/1000
              </span>
            </label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value.slice(0, 1000))}
              rows={5}
              placeholder="Nói rõ: vấn đề là gì, xảy ra khi nào, đề xuất cụ thể (nếu có). Đừng chung chung — feedback chung chung không dẫn đến quyết định."
              style={{
                width: '100%', padding: '10px 12px',
                border: '1px solid rgba(0,0,0,0.12)', borderRadius: 10,
                fontSize: 13, color: '#1D1D1F', outline: 'none', resize: 'vertical',
                minHeight: 100, fontFamily: 'inherit', lineHeight: 1.5,
              }}
            />
          </div>

          {/* Related order (optional) */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#3A3A3C', marginBottom: 6, display: 'block' }}>
              Order liên quan <span style={{ color: '#AEAEB2', fontWeight: 400 }}>(tuỳ chọn)</span>
            </label>
            <input
              type="text"
              value={order}
              onChange={e => setOrder(e.target.value)}
              placeholder="VD: ND-20260407-0007"
              style={{
                width: '100%', padding: '10px 12px',
                border: '1px solid rgba(0,0,0,0.12)', borderRadius: 10,
                fontSize: 13, color: '#1D1D1F', outline: 'none',
                fontFamily: 'monospace',
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 11, color: '#AEAEB2', margin: 0 }}>
            Gửi với danh xưng <b>Lê Văn A</b> (Designer)
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                padding: '9px 18px', borderRadius: 10,
                border: '1px solid rgba(0,0,0,0.12)', background: '#fff',
                fontSize: 13, fontWeight: 600, color: '#1D1D1F',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >Huỷ</button>
            <button
              onClick={submit}
              disabled={!canSubmit}
              style={{
                padding: '9px 18px', borderRadius: 10, border: 'none',
                background: canSubmit ? '#1D1D1F' : 'rgba(0,0,0,0.15)',
                color: '#fff', fontSize: 13, fontWeight: 600,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit', transition: 'opacity 0.15s',
              }}
            >Gửi phản hồi</button>
          </div>
        </div>
      </div>
    </div>
  )
}
