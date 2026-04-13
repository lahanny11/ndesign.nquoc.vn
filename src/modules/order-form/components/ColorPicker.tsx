'use client'

import { useState } from 'react'

interface Props {
  colors: string[]
  onChange: (colors: string[]) => void
}

const COLOR_PRESETS = [
  { hex: '#FF3B30', name: 'Red' },
  { hex: '#FF2D55', name: 'Pink' },
  { hex: '#1D1D1F', name: 'Black' },
  { hex: '#F5F5F7', name: 'Silver' },
  { hex: '#007AFF', name: 'Blue' },
  { hex: '#34C759', name: 'Green' },
  { hex: '#FF9F0A', name: 'Orange' },
  { hex: '#6C47FF', name: 'Purple' },
]

function isValidHex(val: string) {
  return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val.trim())
}

function normalizeHex(val: string): string {
  const h = val.trim().replace(/^#/, '')
  const full = h.length === 3 ? h.split('').map(x => x + x).join('') : h
  return '#' + full.toUpperCase()
}

export default function ColorPicker({ colors, onChange }: Props) {
  const [hexInput, setHexInput] = useState('')
  const [hexError, setHexError] = useState(false)

  function toggleColor(hex: string) {
    const next = colors.includes(hex)
      ? colors.filter(c => c !== hex)
      : colors.length < 5 ? [...colors, hex] : colors
    onChange(next)
  }

  function commitHex() {
    if (!isValidHex(hexInput)) {
      setHexError(hexInput.replace(/^#/, '').length > 0)
      return
    }
    const normalized = normalizeHex(hexInput)
    if (!colors.includes(normalized) && colors.length < 5) {
      onChange([...colors, normalized])
    }
    setHexInput('')
    setHexError(false)
  }

  return (
    <div>
      {/* Selected colors row */}
      {colors.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#6E6E73', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Màu đã chọn · {colors.length}/5
            </span>
            <button
              type="button"
              onClick={() => onChange([])}
              style={{ fontSize: 11, color: '#FF3B30', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Xoá tất cả
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {colors.map(hex => (
              <button
                key={hex}
                type="button"
                onClick={() => toggleColor(hex)}
                title={`Bỏ chọn ${hex}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 10px 5px 6px', borderRadius: 20,
                  border: '1.5px solid rgba(0,0,0,0.12)', background: '#fff',
                  cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: hex, border: '1px solid rgba(0,0,0,0.1)' }}/>
                <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'monospace', color: '#1D1D1F' }}>
                  {hex.toUpperCase()}
                </span>
                <span style={{ fontSize: 10, color: '#AEAEB2' }}>×</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preset grid */}
      <p style={{ fontSize: 11, color: '#AEAEB2', marginBottom: 10, fontWeight: 500 }}>Màu có sẵn</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        {COLOR_PRESETS.map(({ hex, name }) => {
          const normalized = hex.toUpperCase()
          const isSelected = colors.some(c => c.toUpperCase() === normalized)
          return (
            <button
              key={hex}
              type="button"
              onClick={() => toggleColor(hex)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                padding: '10px 8px', borderRadius: 12,
                border: isSelected ? '1.5px solid #5E5CE6' : '1.5px solid transparent',
                background: isSelected ? 'rgba(94,92,230,0.06)' : 'rgba(0,0,0,0.03)',
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: hex, border: '1px solid rgba(0,0,0,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              }}>
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    stroke={hex === '#F5F5F7' ? '#1D1D1F' : '#fff'}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <span style={{ fontSize: 10, color: '#6E6E73', fontWeight: 500 }}>{name}</span>
            </button>
          )
        })}
      </div>

      {/* Hex input */}
      <div>
        <p style={{ fontSize: 11, color: '#AEAEB2', marginBottom: 8, fontWeight: 500 }}>Nhập mã màu HEX</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10, flexShrink: 0,
            background: isValidHex(hexInput) ? normalizeHex(hexInput) : '#E5E5EA',
            border: '1.5px solid rgba(0,0,0,0.1)', transition: 'background 0.1s',
          }}/>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center',
            border: hexError ? '1.5px solid #FF3B30' : '1.5px solid rgba(0,0,0,0.15)',
            borderRadius: 10, background: '#fff', padding: '0 12px', gap: 4,
            boxShadow: hexError ? '0 0 0 3px rgba(255,59,48,0.08)' : 'none',
            transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#AEAEB2', fontFamily: 'monospace' }}>#</span>
            <input
              type="text"
              value={hexInput.replace(/^#/, '')}
              onChange={e => {
                const val = '#' + e.target.value
                setHexInput(val)
                setHexError(e.target.value.length > 0 && !isValidHex(val))
              }}
              onKeyDown={e => { if (e.key === 'Enter') commitHex() }}
              placeholder="FF3B30"
              maxLength={7}
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 14, fontWeight: 600, color: '#1D1D1F', fontFamily: 'monospace',
                letterSpacing: '0.05em', textTransform: 'uppercase',
              }}
            />
            {hexError && <span style={{ fontSize: 10, color: '#FF3B30', flexShrink: 0 }}>Không hợp lệ</span>}
          </div>
          <button
            type="button"
            onClick={commitHex}
            disabled={!isValidHex(hexInput) || colors.length >= 5}
            style={{
              width: 42, height: 42, borderRadius: 10, border: 'none', flexShrink: 0,
              background: isValidHex(hexInput) && colors.length < 5 ? '#1D1D1F' : 'rgba(0,0,0,0.08)',
              color: isValidHex(hexInput) && colors.length < 5 ? '#fff' : '#AEAEB2',
              cursor: isValidHex(hexInput) && colors.length < 5 ? 'pointer' : 'not-allowed',
              fontSize: 18, fontWeight: 300,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            +
          </button>
        </div>
        <p style={{ fontSize: 10, color: '#AEAEB2', marginTop: 6 }}>
          Nhập 3 hoặc 6 ký tự hex · Nhấn Enter hoặc + để thêm
        </p>
      </div>
    </div>
  )
}
