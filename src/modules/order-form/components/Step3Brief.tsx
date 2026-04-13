'use client'

import { useState } from 'react'
import type { OrderFormStep3 } from '../types/order-form.types'
import AIMoodboardTab from './AIMoodboardTab'
import ImageUploadGrid from './ImageUploadGrid'
import ColorPicker from './ColorPicker'

interface Props {
  data: OrderFormStep3
  onChange: (data: Partial<OrderFormStep3>) => void
  draftOrderId: string
}

type Tab = 'ai' | 'upload' | 'color'

const TABS: { key: Tab; label: string }[] = [
  { key: 'ai',     label: 'AI Moodboard' },
  { key: 'upload', label: 'Ảnh tham khảo' },
  { key: 'color',  label: 'Màu sắc' },
]

const inputBase: React.CSSProperties = {
  width: '100%',
  background: '#fff',
  border: '1px solid rgba(0,0,0,0.15)',
  borderRadius: 11,
  padding: '10px 14px',
  fontSize: 14,
  color: '#1D1D1F',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'all 0.15s ease',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
}
const inputFocusStyle: React.CSSProperties = {
  background: '#fff',
  border: '1.5px solid #1D1D1F',
  boxShadow: '0 0 0 3px rgba(0,0,0,0.06)',
}
const inputDoneStyle: React.CSSProperties = {
  background: 'rgba(22,163,74,0.03)',
  border: '1.5px solid rgba(22,163,74,0.4)',
  boxShadow: '0 1px 2px rgba(22,163,74,0.06)',
}

export default function Step3Brief({ data, onChange, draftOrderId }: Props) {
  const [tab, setTab] = useState<Tab>('ai')
  const [briefFocused, setBriefFocused] = useState(false)
  const [styleFocused, setStyleFocused] = useState(false)

  const briefOk    = data.brief_text.length >= 10
  const briefCount = data.brief_text.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Brief textarea */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#6E6E73', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Brief chi tiết <span style={{ color: '#E11D48' }}>*</span>
          </label>
          <span style={{
            fontSize: 10, fontWeight: 500, fontVariantNumeric: 'tabular-nums',
            color: briefOk ? '#16A34A' : '#AEAEB2', transition: 'color 0.2s',
          }}>
            {briefCount}/2000
          </span>
        </div>
        <textarea
          value={data.brief_text}
          onChange={e => onChange({ brief_text: e.target.value })}
          onFocus={() => setBriefFocused(true)}
          onBlur={() => setBriefFocused(false)}
          placeholder="Mô tả mục đích, đối tượng mục tiêu, phong cách, nội dung cần có...&#10;Càng chi tiết, designer hiểu đúng ngay từ đầu."
          maxLength={2000}
          rows={5}
          style={{
            ...inputBase,
            resize: 'none',
            lineHeight: '1.6',
            ...(briefFocused ? inputFocusStyle : briefOk ? inputDoneStyle : {}),
          }}
        />
        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          <div style={{ flex: 1, height: '2px', background: 'rgba(0,0,0,0.06)', borderRadius: '1px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '1px',
              background: briefOk ? '#34C759' : '#000',
              width: `${Math.min((briefCount / 10) * 100, 100)}%`,
              transition: 'width 0.3s ease, background 0.3s ease',
            }} />
          </div>
          {briefOk && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>
      </div>

      {/* Style reference */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#6E6E73', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Phong cách tham khảo
          </label>
          <span style={{ fontSize: 10, color: '#AEAEB2' }}>tuỳ chọn</span>
        </div>
        <input
          type="text"
          value={data.style_reference}
          onChange={e => onChange({ style_reference: e.target.value })}
          onFocus={() => setStyleFocused(true)}
          onBlur={() => setStyleFocused(false)}
          placeholder="VD: Phong cách Apple, minimalist Nhật Bản, vintage 90s..."
          maxLength={500}
          style={{ ...inputBase, ...(styleFocused ? inputFocusStyle : {}) }}
        />
      </div>

      {/* Tab section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#6E6E73', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Tham khảo thêm
          </span>
          <span style={{ fontSize: 10, color: '#AEAEB2' }}>tuỳ chọn</span>
        </div>

        {/* Segmented control */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.06)', borderRadius: '9px', padding: '2px', marginBottom: '16px' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: '6px 0', borderRadius: '7px',
                fontSize: '12px', fontWeight: tab === t.key ? 600 : 500,
                color: tab === t.key ? '#1D1D1F' : '#6E6E73',
                background: tab === t.key ? '#fff' : 'transparent',
                border: 'none', cursor: 'pointer',
                boxShadow: tab === t.key ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'ai' && (
          <AIMoodboardTab
            draftOrderId={draftOrderId}
            initialStyleDescription={data.style_description}
            onChange={onChange}
          />
        )}
        {tab === 'upload' && (
          <ImageUploadGrid
            onUidsChange={uids => onChange({ media_cloudflare_uids: uids })}
          />
        )}
        {tab === 'color' && (
          <ColorPicker
            colors={data.primary_colors}
            onChange={colors => onChange({ primary_colors: colors })}
          />
        )}
      </div>
    </div>
  )
}
