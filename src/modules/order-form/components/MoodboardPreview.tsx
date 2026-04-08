import type { MoodboardResult } from '../types/order-form.types'

interface Props { moodboard: MoodboardResult }

export default function MoodboardPreview({ moodboard }: Props) {
  const { color_palette, font_suggestions, design_tips, layout_config, style_summary } = moodboard
  const cols = layout_config.grid_columns ?? 3

  return (
    <div className="mt-3">
      {/* Style summary */}
      <p className="text-[11px] text-[#6E6488] leading-relaxed mb-3 italic">"{style_summary}"</p>

      {/* Color palette */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {color_palette.map((c, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
              style={{ background: c.hex }}
              title={c.hex}
            />
            <span className="text-[8px] text-[#A89EC0] font-medium">{c.name}</span>
          </div>
        ))}
      </div>

      {/* Visual moodboard grid */}
      <div
        className="rounded-lg overflow-hidden mb-3"
        style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 3 }}
      >
        {Array.from({ length: cols * 2 }).map((_, i) => {
          const col = color_palette[i % color_palette.length]
          const isLarge = i === 0
          return (
            <div
              key={i}
              className="relative overflow-hidden"
              style={{
                background: col?.hex ?? layout_config.primary_color,
                height: isLarge ? 64 : 44,
                gridColumn: isLarge ? `span ${Math.min(2, cols)}` : undefined,
              }}
            >
              {isLarge && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/80 text-[11px] font-bold" style={{ fontFamily: font_suggestions[0]?.name ?? 'sans-serif' }}>
                    {font_suggestions[0]?.name ?? 'Typography'}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Fonts */}
      {font_suggestions.length > 0 && (
        <div className="mb-2">
          <p className="text-[9px] font-bold uppercase tracking-wide text-[#A89EC0] mb-1">Fonts</p>
          <div className="flex gap-2 flex-wrap">
            {font_suggestions.map((f, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 bg-[#F2F0F7] rounded text-[#6E6488] font-medium">
                {f.name} <span className="text-[#A89EC0]">({f.use})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {design_tips.length > 0 && (
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wide text-[#A89EC0] mb-1">Design tips</p>
          <ul className="flex flex-col gap-1">
            {design_tips.map((tip, i) => (
              <li key={i} className="text-[10px] text-[#6E6488] flex items-start gap-1.5">
                <span className="text-[#7B8EF7] shrink-0">✦</span>{tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
