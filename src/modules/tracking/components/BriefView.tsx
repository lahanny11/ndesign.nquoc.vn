'use client'

import { useState } from 'react'
import type { BriefStructured, BriefAttachment, BriefSlide } from '../types/tracking.types'

interface Props {
  brief: BriefStructured
  productType?: string
  productSize?: string
  quantity?: number
  ordererName?: string
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <span style={{
        fontSize: 10, fontWeight: 700, color: '#AEAEB2',
        textTransform: 'uppercase', letterSpacing: '0.08em',
      }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }}/>
    </div>
  )
}

// Section card — header với emoji + label, body text
function SectionCard({ icon, label, accent, children }: {
  icon: string; label: string; accent: string; children: React.ReactNode
}) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '12px 14px',
      border: '1px solid rgba(0,0,0,0.07)',
      marginBottom: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6, background: `${accent}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, flexShrink: 0,
        }}>{icon}</div>
        <p style={{
          fontSize: 11, fontWeight: 700, color: accent, margin: 0,
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>{label}</p>
      </div>
      {children}
    </div>
  )
}

// ─── Slide card — collapsible ────────────────────────────────────────────────
function SlideCard({ slide }: { slide: BriefSlide }) {
  const [open, setOpen] = useState(false)

  return (
    <button
      onClick={() => setOpen(o => !o)}
      style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        background: '#fff', borderRadius: 10, padding: '10px 12px',
        border: '1px solid rgba(0,0,0,0.07)', fontFamily: 'inherit',
        transition: 'all 0.15s', marginBottom: 6,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')}
      onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Slide number badge */}
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'linear-gradient(135deg,#6C6BAE,#4A4990)',
          color: '#fff', fontSize: 12, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {slide.n}
        </div>

        {/* Title + timing */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 12, fontWeight: 700, color: '#1D1D1F', margin: 0,
            letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {slide.title}
          </p>
          {slide.timing && (
            <p style={{
              fontSize: 10, color: '#6E6E73', margin: '2px 0 0',
              fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums',
            }}>
              ⏱ {slide.timing}
            </p>
          )}
        </div>

        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="#AEAEB2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {/* Expanded */}
      {open && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(0,0,0,0.05)', paddingLeft: 38 }}>
          {slide.quote && (
            <p style={{
              fontSize: 12, color: '#1D1D1F', margin: '0 0 6px', lineHeight: 1.5,
              fontStyle: 'italic', borderLeft: '2px solid #6C6BAE', paddingLeft: 10,
            }}>
              &ldquo;{slide.quote}&rdquo;
            </p>
          )}
          {slide.caption && (
            <p style={{ fontSize: 11, color: '#6E6E73', margin: '0 0 4px', lineHeight: 1.5 }}>
              <b style={{ color: '#3A3A3C' }}>Caption:</b> {slide.caption}
            </p>
          )}
          {slide.note && (
            <p style={{ fontSize: 11, color: '#6E6E73', margin: 0, lineHeight: 1.5 }}>
              {slide.note}
            </p>
          )}
        </div>
      )}
    </button>
  )
}

// ─── Attachments ─────────────────────────────────────────────────────────────
const FILE_ICONS: Record<BriefAttachment['type'], { emoji: string; color: string }> = {
  pdf:   { emoji: '📄', color: '#E11D48' },
  doc:   { emoji: '📝', color: '#2563EB' },
  image: { emoji: '🖼️', color: '#16A34A' },
  link:  { emoji: '🔗', color: '#7C3AED' },
}

function AttachmentList({ items }: { items: BriefAttachment[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((a, i) => {
        const f = FILE_ICONS[a.type]
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 10,
            background: '#fff', border: '1px solid rgba(0,0,0,0.07)',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, background: `${f.color}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontSize: 14 }}>{f.emoji}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 12, fontWeight: 600, color: '#1D1D1F', margin: 0,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{a.name}</p>
              <p style={{ fontSize: 10, color: '#AEAEB2', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {a.type}
              </p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: '#AEAEB2', flexShrink: 0 }}>
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BriefView({ brief, productType, productSize, quantity, ordererName }: Props) {
  const hasStructured = brief.purpose || brief.audience || brief.style || brief.slides?.length

  return (
    <div style={{ marginBottom: 20 }}>
      <SectionLabel label="Brief chi tiết"/>

      {/* Product info pill */}
      {(productType || productSize || ordererName) && (
        <div style={{
          background: 'rgba(108,107,174,0.05)', border: '1px solid rgba(108,107,174,0.18)',
          borderRadius: 12, padding: '10px 14px', marginBottom: 10,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {ordererName && (
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg,#6C6BAE,#4A4990)',
              color: '#fff', fontSize: 12, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>{ordererName[0]}</div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            {ordererName && (
              <p style={{ fontSize: 12, fontWeight: 700, color: '#1D1D1F', margin: 0 }}>
                {ordererName}
                <span style={{ color: '#AEAEB2', fontWeight: 500, marginLeft: 6 }}>· Orderer</span>
              </p>
            )}
            {(productType || productSize) && (
              <p style={{ fontSize: 11, color: '#6E6E73', margin: '2px 0 0' }}>
                {productType}{productSize && <span style={{ marginLeft: 6, fontFamily: 'monospace', color: '#1D1D1F', fontWeight: 600 }}>{productSize}</span>}
                {quantity && quantity > 1 && (
                  <span style={{
                    marginLeft: 8, fontWeight: 700, color: '#D97706',
                    padding: '1px 7px', borderRadius: 5,
                    background: 'rgba(217,119,6,0.12)', fontSize: 10, letterSpacing: '0.02em',
                  }}>× {quantity} sản phẩm</span>
                )}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Structured sections */}
      {hasStructured && (
        <>
          {brief.purpose && (
            <SectionCard icon="🎯" label="Mục đích" accent="#E11D48">
              <p style={{ fontSize: 12, color: '#1D1D1F', margin: 0, lineHeight: 1.55 }}>{brief.purpose}</p>
            </SectionCard>
          )}
          {brief.audience && (
            <SectionCard icon="👥" label="Đối tượng" accent="#2563EB">
              <p style={{ fontSize: 12, color: '#1D1D1F', margin: 0, lineHeight: 1.55 }}>{brief.audience}</p>
            </SectionCard>
          )}
          {brief.style && (
            <SectionCard icon="🎨" label="Phong cách" accent="#7C3AED">
              <p style={{ fontSize: 12, color: '#1D1D1F', margin: 0, lineHeight: 1.55 }}>{brief.style}</p>
            </SectionCard>
          )}

          {brief.slides && brief.slides.length > 0 && (
            <div style={{ marginTop: 14, marginBottom: 8 }}>
              <SectionLabel label={`Nội dung — ${brief.slides.length} slide`}/>
              {brief.slides.map(s => <SlideCard key={s.n} slide={s}/>)}
            </div>
          )}

          {brief.extras && brief.extras.length > 0 && (
            <div style={{ marginTop: 10 }}>
              {brief.extras.map((ex, i) => (
                <div key={i} style={{
                  background: '#fff', borderRadius: 10, padding: '10px 14px',
                  border: '1px solid rgba(0,0,0,0.07)', marginBottom: 6,
                }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#AEAEB2', margin: 0,
                    textTransform: 'uppercase', letterSpacing: '0.05em' }}>{ex.label}</p>
                  <p style={{ fontSize: 12, color: '#1D1D1F', margin: '3px 0 0', lineHeight: 1.5 }}>{ex.value}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Fallback raw text */}
      {!hasStructured && brief.raw_text && (
        <div style={{
          background: '#fff', borderRadius: 12, padding: 14,
          border: '1px solid rgba(0,0,0,0.07)',
        }}>
          <p style={{
            fontSize: 12, color: '#1D1D1F', margin: 0, lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
          }}>{brief.raw_text}</p>
        </div>
      )}

      {/* Attachments */}
      {brief.attachments && brief.attachments.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <SectionLabel label={`Đính kèm — ${brief.attachments.length} file`}/>
          <AttachmentList items={brief.attachments}/>
        </div>
      )}
    </div>
  )
}
