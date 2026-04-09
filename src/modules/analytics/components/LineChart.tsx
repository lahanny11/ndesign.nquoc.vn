interface SeriesDataPoint {
  month: string
  count: number
}

interface Series {
  name: string
  color: string
  data: SeriesDataPoint[]
}

interface LineChartProps {
  series: Series[]
  height?: number
}

const PAD_LEFT = 32
const PAD_RIGHT = 16
const PAD_TOP = 12
const PAD_BOTTOM = 24
const VIEW_W = 480
const LEGEND_ITEM_W = 110

export default function LineChart({ series, height = 140 }: LineChartProps) {
  if (!series.length || !series[0].data.length) return null

  const months = series[0].data.map(d => d.month)
  const allValues = series.flatMap(s => s.data.map(d => d.count))
  const maxVal = Math.max(...allValues, 1)

  const chartW = VIEW_W - PAD_LEFT - PAD_RIGHT
  const chartH = height - PAD_TOP - PAD_BOTTOM

  const xForIdx = (i: number) => PAD_LEFT + (i / (months.length - 1)) * chartW
  const yForVal = (v: number) => PAD_TOP + chartH - (v / maxVal) * chartH

  // Grid lines at 25%, 50%, 75%, 100%
  const gridLines = [0.25, 0.5, 0.75, 1].map(r => ({
    y: PAD_TOP + chartH - r * chartH,
    label: Math.round(maxVal * r),
  }))

  return (
    <div>
      <svg
        viewBox={`0 0 ${VIEW_W} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {/* Grid lines */}
        {gridLines.map((g, i) => (
          <g key={i}>
            <line
              x1={PAD_LEFT} y1={g.y}
              x2={VIEW_W - PAD_RIGHT} y2={g.y}
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="1"
            />
            <text
              x={PAD_LEFT - 4}
              y={g.y + 4}
              fontSize="9"
              fill="#AEAEB2"
              textAnchor="end"
            >
              {g.label}
            </text>
          </g>
        ))}

        {/* Bottom axis line */}
        <line
          x1={PAD_LEFT} y1={PAD_TOP + chartH}
          x2={VIEW_W - PAD_RIGHT} y2={PAD_TOP + chartH}
          stroke="rgba(0,0,0,0.10)"
          strokeWidth="1"
        />

        {/* X axis labels */}
        {months.map((m, i) => (
          <text
            key={i}
            x={xForIdx(i)}
            y={height - 6}
            fontSize="9"
            fill="#AEAEB2"
            textAnchor="middle"
          >
            {m}
          </text>
        ))}

        {/* Series lines + dots */}
        {series.map((s, si) => {
          const points = s.data.map((d, i) => `${xForIdx(i)},${yForVal(d.count)}`).join(' ')
          return (
            <g key={si}>
              <polyline
                points={points}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {s.data.map((d, i) => (
                <circle
                  key={i}
                  cx={xForIdx(i)}
                  cy={yForVal(d.count)}
                  r="3"
                  fill={s.color}
                />
              ))}
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: 16,
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: 8,
        paddingLeft: PAD_LEFT,
      }}>
        {series.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: LEGEND_ITEM_W }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: '#6E6E73', fontWeight: 500 }}>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
