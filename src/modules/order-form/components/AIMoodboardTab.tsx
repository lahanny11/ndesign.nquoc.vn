'use client'

import { useState } from 'react'
import type { MoodboardResult } from '../types/order-form.types'
import MoodboardPreview from './MoodboardPreview'
import { apiClient } from '../../../shared/config/api-client'

interface Props {
  draftOrderId: string
  initialStyleDescription: string
  onChange: (update: { moodboard_id?: string; style_description?: string }) => void
}

const STYLE_EXAMPLES = [
  'Tối giản đen trắng',
  'Vintage retro màu ấm',
  'Hiện đại corporate',
  'Pastel nhẹ nhàng',
  'Bold & colorful',
]

const DEV = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_DEV_BYPASS === 'true'

export default function AIMoodboardTab({ draftOrderId, initialStyleDescription, onChange }: Props) {
  const [aiInput, setAiInput]   = useState(initialStyleDescription)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError]   = useState<string | null>(null)
  const [moodboard, setMoodboard] = useState<MoodboardResult | null>(null)
  const [aiFocused, setAiFocused] = useState(false)

  const handleAnalyze = async () => {
    if (aiInput.trim().length < 5) return
    setAiLoading(true)
    setAiError(null)
    try {
      const res = await apiClient.post<{ data: MoodboardResult }>(
        `/api/v1/orders/${draftOrderId}/moodboard`,
        { style_description: aiInput },
      )
      const mb = res.data
      setMoodboard(mb)
      onChange({ moodboard_id: mb.id, style_description: aiInput })
    } catch (err: unknown) {
      const e = err as { code?: string }
      if (e?.code === 'AI_RATE_LIMIT_EXCEEDED') {
        setAiError('Quá 5 lần trong 1 phút. Thử lại sau ít giây.')
      } else {
        setAiError('Dịch vụ AI tạm gián đoạn. Bạn có thể bỏ qua bước này.')
      }
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px', background: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#1D1D1F', margin: 0 }}>AI phân tích phong cách</p>
            <p style={{ fontSize: '11px', color: '#6E6E73', margin: 0 }}>Palette màu + font + tips tự động</p>
          </div>
        </div>
        {moodboard && (
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#34C759', background: 'rgba(52,199,89,0.1)', padding: '3px 10px', borderRadius: '20px' }}>
            Đã phân tích
          </span>
        )}
      </div>

      {/* Example chips */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <p style={{ fontSize: '11px', color: '#AEAEB2', marginBottom: '8px', fontWeight: 500 }}>Chọn nhanh</p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {STYLE_EXAMPLES.map(ex => (
            <button
              key={ex}
              type="button"
              onClick={() => setAiInput(ex)}
              style={{
                padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                border: aiInput === ex ? '1px solid #5E5CE6' : '1px solid rgba(0,0,0,0.12)',
                background: aiInput === ex ? 'rgba(0,0,0,0.06)' : 'transparent',
                color: '#1D1D1F', cursor: 'pointer', transition: 'all 0.15s ease',
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Input + analyze button */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            onFocus={() => setAiFocused(true)}
            onBlur={() => setAiFocused(false)}
            onKeyDown={e => { if (e.key === 'Enter' && aiInput.trim().length >= 5) handleAnalyze() }}
            placeholder="Mô tả phong cách bạn muốn..."
            maxLength={500}
            style={{
              flex: 1, background: 'rgba(0,0,0,0.04)',
              border: aiFocused ? '1px solid rgba(94,92,230,0.5)' : '1px solid transparent',
              borderRadius: '8px', padding: '8px 12px', fontSize: '13px',
              color: '#1D1D1F', fontFamily: 'inherit', outline: 'none',
              boxShadow: aiFocused ? '0 0 0 3px rgba(0,0,0,0.07)' : 'none',
              transition: 'all 0.15s ease',
            }}
          />
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={aiLoading || aiInput.trim().length < 5}
            style={{
              padding: '0 16px', height: '38px', borderRadius: '8px',
              fontSize: '13px', fontWeight: 600, border: 'none', flexShrink: 0,
              cursor: aiLoading || aiInput.trim().length < 5 ? 'not-allowed' : 'pointer',
              background: aiLoading || aiInput.trim().length < 5 ? 'rgba(0,0,0,0.12)' : '#000',
              color: aiLoading || aiInput.trim().length < 5 ? 'rgba(0,0,0,0.3)' : '#fff',
              transition: 'all 0.15s ease',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            {aiLoading ? (
              <>
                <div style={{
                  width: '12px', height: '12px',
                  border: '2px solid rgba(0,0,0,0.2)', borderTopColor: 'rgba(0,0,0,0.5)',
                  borderRadius: '50%', animation: 'spin 0.6s linear infinite',
                }}/>
                Đang phân tích
              </>
            ) : 'Phân tích'}
          </button>
        </div>
      </div>

      {/* Result area */}
      <div style={{ padding: '12px 16px', minHeight: '60px' }}>
        {aiLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#000' }}>
            <div style={{
              width: '14px', height: '14px',
              border: '2px solid rgba(94,92,230,0.2)', borderTopColor: '#000',
              borderRadius: '50%', animation: 'spin 0.6s linear infinite',
            }}/>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>Đang phân tích...</p>
              <p style={{ fontSize: '11px', color: '#6E6E73', margin: 0 }}>AI đang tạo palette màu và gợi ý font</p>
            </div>
          </div>
        )}

        {aiError && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: 'rgba(255,59,48,0.06)', borderRadius: '8px', padding: '10px 12px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '1px', flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#FF3B30', margin: 0 }}>Không thể phân tích</p>
              <p style={{ fontSize: '11px', color: '#6E6E73', margin: '2px 0 0' }}>{aiError}</p>
              {DEV && <p style={{ fontSize: '11px', color: '#AEAEB2', margin: '4px 0 0' }}>Dev mode: có thể bỏ qua bước này</p>}
            </div>
          </div>
        )}

        {!aiLoading && !aiError && !moodboard && (
          <p style={{ fontSize: '12px', color: '#AEAEB2', margin: 0 }}>
            Nhập mô tả và nhấn <strong style={{ color: '#000' }}>Phân tích</strong> để AI tạo moodboard
          </p>
        )}

        {moodboard && !aiLoading && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#1D1D1F', margin: 0 }}>Kết quả phân tích</p>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={aiLoading}
                style={{
                  padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                  border: '1px solid rgba(0,0,0,0.12)', background: 'transparent',
                  color: '#1D1D1F', cursor: 'pointer',
                }}
              >
                Tạo lại
              </button>
            </div>
            <MoodboardPreview moodboard={moodboard} />
          </div>
        )}
      </div>

      {DEV && !moodboard && (
        <div style={{ padding: '0 16px 12px', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#AEAEB2', margin: 0 }}>Dev mode: có thể bỏ qua moodboard</p>
        </div>
      )}
    </div>
  )
}
