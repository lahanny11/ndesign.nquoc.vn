import { useState, useRef } from 'react'
import type { OrderFormStep3, MoodboardResult } from '../types/order-form.types'
import MoodboardPreview from './MoodboardPreview'
import { apiClient } from '../../../shared/config/api-client'

interface Props {
  data: OrderFormStep3
  onChange: (data: Partial<OrderFormStep3>) => void
  draftOrderId: string
}

const STYLE_EXAMPLES = ['Tối giản đen trắng', 'Vintage retro màu ấm', 'Hiện đại corporate', 'Pastel nhẹ nhàng', 'Bold & colorful']
const COLOR_PRESETS = ['#7B8EF7', '#E07A7A', '#5BB89A', '#E8925A', '#B89CC8', '#F4D03F', '#2D2D3A', '#FFFEFE']

const inputCls = `w-full bg-[#FAF9FC] border-[1.5px] border-[#E4E0EF] rounded-[10px] px-3 py-2.5
  text-[13px] text-[#2D2D3A] font-[inherit] outline-none transition-all
  focus:border-[#7B8EF7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(123,142,247,0.08)]`

type Tab = 'upload' | 'style' | 'color' | 'ai'

export default function Step3Brief({ data, onChange, draftOrderId }: Props) {
  const [tab, setTab] = useState<Tab>('ai')
  const [aiInput, setAiInput] = useState(data.style_description)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [moodboard, setMoodboard] = useState<MoodboardResult | null>(null)
  const [uploadedPreviews, setUploadedPreviews] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const handleAnalyze = async () => {
    if (aiInput.length < 10) return
    setAiLoading(true)
    setAiError(null)
    try {
      const res = await apiClient.post<{ data: MoodboardResult }>(`/api/v1/orders/${draftOrderId}/moodboard`, {
        style_description: aiInput,
      })
      const mb = res.data
      setMoodboard(mb)
      onChange({ moodboard_id: mb.id, style_description: aiInput })
    } catch (err: unknown) {
      const e = err as { code?: string }
      if (e?.code === 'AI_RATE_LIMIT_EXCEEDED') {
        setAiError('Bạn đã generate quá 5 lần trong 1 phút. Thử lại sau ít giây.')
      } else {
        setAiError('Dịch vụ AI đang gặp sự cố. Bạn có thể thử lại sau.')
      }
    } finally {
      setAiLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const previews = files.map(f => URL.createObjectURL(f))
    setUploadedPreviews(prev => [...prev, ...previews].slice(0, 8))
  }

  const toggleColor = (hex: string) => {
    const colors = data.primary_colors.includes(hex)
      ? data.primary_colors.filter(c => c !== hex)
      : data.primary_colors.length < 5
        ? [...data.primary_colors, hex]
        : data.primary_colors
    onChange({ primary_colors: colors })
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'ai',     label: 'AI phân tích' },
    { key: 'upload', label: 'Upload ảnh' },
    { key: 'style',  label: 'Phong cách' },
    { key: 'color',  label: 'Màu sắc' },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Brief */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0] mb-1.5">
          Brief chi tiết <span className="text-[#E07A7A]">*</span>
        </label>
        <textarea
          value={data.brief_text}
          onChange={e => onChange({ brief_text: e.target.value })}
          placeholder="Mô tả chi tiết yêu cầu: màu sắc, font, phong cách, nội dung cần có..."
          maxLength={2000}
          rows={4}
          className={`${inputCls} resize-none leading-relaxed`}
        />
        <p className="text-[10px] text-[#A89EC0] mt-1 text-right">{data.brief_text.length}/2000</p>
      </div>

      {/* Style reference */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0] mb-1.5">
          Phong cách tham khảo
        </label>
        <input
          type="text"
          value={data.style_reference}
          onChange={e => onChange({ style_reference: e.target.value })}
          placeholder="VD: Phong cách Apple, minimalist Nhật Bản..."
          maxLength={500}
          className={inputCls}
        />
      </div>

      {/* Moodboard section */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#A89EC0] mb-2">
          Moodboard tham khảo
        </label>

        {/* Tab switcher */}
        <div className="flex gap-0.5 p-[3px] bg-[#F2F0F7] rounded-[9px] mb-3">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-[5px] rounded-[7px] text-[11px] font-semibold transition-all text-center
                ${tab === t.key ? 'bg-white text-[#2D2D3A] shadow-sm' : 'text-[#A89EC0] hover:text-[#6E6488]'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* AI tab */}
        {tab === 'ai' && (
          <div className="border-[1.5px] border-[#E4E0EF] rounded-[11px] overflow-hidden">
            <div className="px-3 py-2.5 bg-[#FAF9FC] border-b border-[#E4E0EF]">
              <div className="text-[12px] font-bold text-[#2D2D3A]">✦ AI phân tích phong cách</div>
              <div className="text-[10px] text-[#A89EC0] mt-0.5">Mô tả style → palette, font & moodboard tự động</div>
            </div>

            {/* Example chips */}
            <div className="flex gap-1.5 flex-wrap px-3 py-2 border-b border-[#F2F0F7]">
              {STYLE_EXAMPLES.map(ex => (
                <button
                  key={ex}
                  onClick={() => setAiInput(ex)}
                  className="px-2.5 py-[3px] rounded-full border border-[#E4E0EF] bg-white text-[10px] font-semibold text-[#6E6488] hover:border-[#7B8EF7] hover:text-[#7B8EF7] hover:bg-[#EEF0FE] transition-all"
                >
                  {ex}
                </button>
              ))}
            </div>

            {/* Input + button */}
            <div className="flex gap-2 px-3 py-2 border-b border-[#F2F0F7]">
              <input
                type="text"
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                placeholder="VD: Tối giản đen trắng phong cách Nhật Bản..."
                className="flex-1 bg-[#FAF9FC] border-[1.5px] border-[#E4E0EF] rounded-[8px] px-2.5 py-1.5 text-[12px] text-[#2D2D3A] outline-none focus:border-[#7B8EF7]"
                maxLength={500}
              />
              <button
                onClick={handleAnalyze}
                disabled={aiLoading || aiInput.length < 10}
                className="px-3.5 h-9 bg-[#7B8EF7] text-white rounded-[7px] text-[12px] font-bold hover:opacity-85 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity shrink-0"
              >
                {aiLoading ? '...' : 'Phân tích'}
              </button>
            </div>

            {/* Output */}
            <div className="px-3 py-2.5 text-[12px] text-[#6E6488] min-h-12">
              {aiLoading && (
                <div className="flex items-center gap-2 text-[#7B8EF7]">
                  <div className="w-3 h-3 border-2 border-[#7B8EF7] border-t-transparent rounded-full animate-spin"/>
                  Đang phân tích...
                </div>
              )}
              {aiError && <p className="text-[#E07A7A]">{aiError}</p>}
              {!aiLoading && !aiError && !moodboard && (
                <span className="text-[#A89EC0]">Nhập mô tả phong cách và nhấn Phân tích.</span>
              )}
              {moodboard && !aiLoading && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#2D2D3A]">Kết quả Moodboard</span>
                    <button
                      onClick={handleAnalyze}
                      disabled={aiLoading}
                      className="text-[10px] px-2 py-0.5 border border-[#E4E0EF] rounded text-[#6E6488] hover:border-[#7B8EF7] hover:text-[#7B8EF7]"
                    >
                      Tạo lại
                    </button>
                  </div>
                  <MoodboardPreview moodboard={moodboard} />
                </>
              )}
            </div>
          </div>
        )}

        {/* Upload tab */}
        {tab === 'upload' && (
          <div>
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  onClick={() => fileRef.current?.click()}
                  className="aspect-square rounded-[7px] border-[1.5px] border-dashed border-[#CEC9E0] bg-[#FAF9FC] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#7B8EF7] hover:bg-[#EEF0FE] transition-all overflow-hidden relative"
                >
                  {uploadedPreviews[i] ? (
                    <img src={uploadedPreviews[i]} className="w-full h-full object-cover absolute inset-0"/>
                  ) : (
                    <div className="flex flex-col items-center gap-0.5 text-[#A89EC0]">
                      <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-[1.5]" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      <span className="text-[8px] font-semibold">Upload</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange}/>
            <p className="text-[10px] text-[#A89EC0] mt-1.5">Tối đa 8 ảnh · 10MB/file · jpg/png/webp/gif</p>
          </div>
        )}

        {/* Color tab */}
        {tab === 'color' && (
          <div>
            <p className="text-[10px] text-[#A89EC0] mb-2">Chọn tối đa 5 màu chủ đạo</p>
            <div className="flex gap-2.5 flex-wrap">
              {COLOR_PRESETS.map(hex => {
                const selected = data.primary_colors.includes(hex)
                return (
                  <div key={hex} className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => toggleColor(hex)}
                      className={`w-8 h-8 rounded-[8px] border-2 transition-all flex items-center justify-center
                        ${selected ? 'border-transparent shadow-[0_0_0_2px_white,0_0_0_3.5px_#7B8EF7]' : 'border-transparent'}`}
                      style={{ background: hex }}
                    >
                      {selected && (
                        <svg className="w-3 h-3 stroke-white fill-none stroke-[3]" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </button>
                    <span className="text-[8px] text-[#A89EC0] font-mono">{hex}</span>
                  </div>
                )
              })}
            </div>
            {data.primary_colors.length > 0 && (
              <div className="flex gap-1.5 mt-3">
                {data.primary_colors.map(c => (
                  <div key={c} className="w-6 h-6 rounded-md" style={{ background: c }} title={c}/>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Style tab */}
        {tab === 'style' && (
          <div className="grid grid-cols-3 gap-2">
            {STYLE_EXAMPLES.map(s => (
              <button
                key={s}
                onClick={() => { setTab('ai'); setAiInput(s) }}
                className="border-[1.5px] border-[#E4E0EF] rounded-[9px] overflow-hidden hover:border-[#7B8EF7] transition-all text-left"
              >
                <div className="h-14 bg-gradient-to-br from-[#EEF0FE] to-[#DDE0FC] flex items-center justify-center text-[11px] font-bold text-[#7B8EF7]">
                  {s.split(' ')[0]}
                </div>
                <div className="px-2 py-1.5">
                  <div className="text-[11px] font-bold text-[#2D2D3A]">{s}</div>
                  <div className="text-[9px] text-[#A89EC0] mt-0.5">Nhấn để phân tích AI</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
