'use client'

import { useState, useRef } from 'react'

interface Props {
  onUidsChange: (uids: string[]) => void
}

export default function ImageUploadGrid({ onUidsChange }: Props) {
  const [previews, setPreviews] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const newPreviews = files.map(f => URL.createObjectURL(f))
    setPreviews(prev => {
      const merged = [...prev, ...newPreviews].slice(0, 8)
      return merged
    })
    // TODO: upload to Cloudflare and call onUidsChange with real UIDs
    onUidsChange([])
    e.target.value = ''
  }

  function removePreview(index: number) {
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  function clearAll() {
    setPreviews([])
    onUidsChange([])
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ aspectRatio: '1', position: 'relative' }}>
            {previews[i] ? (
              <div style={{ width: '100%', height: '100%', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={previews[i]}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => removePreview(i)}
                  style={{
                    position: 'absolute', top: '4px', right: '4px',
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'rgba(0,0,0,0.5)', color: '#fff',
                    border: 'none', cursor: 'pointer', fontSize: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                style={{
                  width: '100%', height: '100%', borderRadius: '10px',
                  border: '1.5px dashed rgba(0,0,0,0.15)',
                  background: 'rgba(0,0,0,0.02)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '4px',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AEAEB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {i === 0 && <span style={{ fontSize: '10px', color: '#AEAEB2' }}>Thêm</span>}
              </button>
            )}
          </div>
        ))}
      </div>

      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
        <p style={{ fontSize: '11px', color: '#AEAEB2', margin: 0 }}>
          {previews.length > 0
            ? `${previews.length}/8 ảnh`
            : 'Tối đa 8 ảnh · 10MB/file · jpg/png/webp'}
        </p>
        {previews.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            style={{ fontSize: '11px', color: '#FF3B30', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Xoá tất cả
          </button>
        )}
      </div>
    </div>
  )
}
