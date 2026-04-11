import type { MoodboardResult } from '../types/order-form.types'

interface Props { moodboard: MoodboardResult }

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function getLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

function contrastText(hex: string) {
  return getLuminance(hex) > 0.55 ? '#1D1D1F' : '#ffffff'
}

export default function MoodboardPreview({ moodboard }: Props) {
  const { color_palette, font_suggestions, design_tips, layout_config, style_summary } = moodboard
  const primary = layout_config.primary_color ?? color_palette[0]?.hex ?? '#1D1D1F'
  const accent  = layout_config.accent_color  ?? color_palette[1]?.hex ?? '#5E5CE6'
  const bg      = color_palette.find(c => c.role === 'neutral')?.hex ?? '#F5F5F7'
  const headingFont = font_suggestions.find(f => f.use === 'heading')?.name ?? font_suggestions[0]?.name ?? 'serif'
  const bodyFont    = font_suggestions.find(f => f.use === 'body')?.name    ?? 'sans-serif'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Style summary quote */}
      <div style={{
        padding: '10px 14px', borderRadius: 10,
        background: 'rgba(0,0,0,0.03)', borderLeft: `3px solid ${primary}`,
      }}>
        <p style={{ fontSize: 12, color: '#6E6E73', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
          "{style_summary}"
        </p>
      </div>

      {/* Visual mockup canvas */}
      <div style={{
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        {/* Top bar */}
        <div style={{
          background: primary, padding: '14px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              width: 80, height: 6, borderRadius: 3,
              background: `${contrastText(primary)}30`, marginBottom: 5,
            }}/>
            <p style={{
              fontFamily: headingFont, fontSize: 17, fontWeight: 700,
              color: contrastText(primary), margin: 0, letterSpacing: '-0.01em',
            }}>
              {headingFont}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[accent, bg].map((c, i) => (
              <div key={i} style={{
                width: 28, height: 28, borderRadius: '50%',
                background: c, border: `2px solid ${contrastText(primary)}20`,
              }}/>
            ))}
          </div>
        </div>

        {/* Body content mockup */}
        <div style={{ background: bg, padding: '14px 18px', display: 'flex', gap: 12 }}>
          {/* Left: text blocks */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div style={{ width: '60%', height: 5, borderRadius: 3, background: `${primary}40` }}/>
            <div style={{ width: '90%', height: 4, borderRadius: 3, background: 'rgba(0,0,0,0.1)' }}/>
            <div style={{ width: '75%', height: 4, borderRadius: 3, background: 'rgba(0,0,0,0.07)' }}/>
            <div style={{ width: '85%', height: 4, borderRadius: 3, background: 'rgba(0,0,0,0.07)' }}/>
            <div style={{ marginTop: 4, display: 'flex', gap: 6 }}>
              <div style={{
                padding: '4px 12px', borderRadius: 20,
                background: primary, fontSize: 9, fontWeight: 700,
                color: contrastText(primary), fontFamily: bodyFont,
              }}>
                Tìm hiểu thêm
              </div>
              <div style={{
                padding: '4px 12px', borderRadius: 20,
                border: `1.5px solid ${primary}`, fontSize: 9,
                color: primary, fontFamily: bodyFont,
              }}>
                Xem thêm
              </div>
            </div>
          </div>
          {/* Right: color block */}
          <div style={{
            width: 80, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
            display: 'grid', gridTemplateRows: '1fr 1fr', gap: 3,
          }}>
            <div style={{ background: accent, borderRadius: '6px 6px 0 0' }}/>
            <div style={{
              background: color_palette[2]?.hex ?? primary,
              borderRadius: '0 0 6px 6px',
            }}/>
          </div>
        </div>

        {/* Footer strip — font specimen */}
        <div style={{
          background: '#1D1D1F', padding: '8px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: bodyFont }}>
            {bodyFont} · Body text
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontFamily: headingFont }}>
            Aa Bb Cc
          </span>
        </div>
      </div>

      {/* Color palette */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#AEAEB2', marginBottom: 8 }}>
          Palette màu sắc
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {color_palette.map((c, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: c.hex,
                border: '1.5px solid rgba(0,0,0,0.08)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              }}/>
              <span style={{ fontSize: 9, color: '#6E6E73', fontWeight: 500 }}>{c.name}</span>
              <span style={{ fontSize: 8, color: '#AEAEB2', fontFamily: 'monospace' }}>{c.hex.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fonts */}
      {font_suggestions.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#AEAEB2', marginBottom: 8 }}>
            Typography
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {font_suggestions.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', borderRadius: 9,
                background: i === 0 ? `${primary}08` : 'rgba(0,0,0,0.03)',
                border: `1px solid ${i === 0 ? primary + '20' : 'rgba(0,0,0,0.06)'}`,
              }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', fontFamily: f.name }}>{f.name}</span>
                  <span style={{ fontSize: 10, color: '#AEAEB2', marginLeft: 6 }}>{f.type}</span>
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                  background: f.use === 'heading' ? `${primary}15` : 'rgba(0,0,0,0.06)',
                  color: f.use === 'heading' ? primary : '#6E6E73',
                }}>
                  {f.use === 'heading' ? 'Tiêu đề' : f.use === 'body' ? 'Nội dung' : 'Điểm nhấn'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Design tips */}
      {design_tips.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#AEAEB2', marginBottom: 8 }}>
            Gợi ý thiết kế
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {design_tips.map((tip, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '9px 12px', borderRadius: 9,
                background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: accent, flexShrink: 0, marginTop: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: contrastText(accent) }}>
                    {i + 1}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#3D3D3F', lineHeight: 1.55, margin: 0 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
