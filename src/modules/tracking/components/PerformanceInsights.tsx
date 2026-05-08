'use client'

import type {
  PerformanceInsights as Insights,
  DesignerScorecard, OrdererScorecard, TimingRow, ActivityEvent,
} from '../types/tracking.types'

interface Props { insights: Insights }

const GRADE_COLORS: Record<'A' | 'B' | 'C', { fg: string; bg: string }> = {
  A: { fg: '#16A34A', bg: 'rgba(22,163,74,0.10)' },
  B: { fg: '#D97706', bg: 'rgba(217,119,6,0.10)' },
  C: { fg: '#E11D48', bg: 'rgba(225,29,72,0.10)' },
}

const ROLE_COLORS: Record<ActivityEvent['actor_role'], string> = {
  designer: '#7C3AED',
  orderer:  '#2563EB',
  leader:   '#E11D48',
  system:   '#6E6E73',
}

function fmtHours(h: number): string {
  if (h < 1) return `${Math.round(h * 60)} phút`
  if (h < 24) return `${h.toFixed(1)} giờ`
  return `${Math.round(h / 24)} ngày`
}

function timeAgo(iso: string): string {
  const NOW = new Date('2026-05-08T09:00:00Z').getTime()
  const t = new Date(iso).getTime()
  const diffMin = Math.max(0, Math.round((NOW - t) / 60000))
  if (diffMin < 60) return `${diffMin}m trước`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}h trước`
  const diffD = Math.floor(diffH / 24)
  return `${diffD}d trước`
}

// ─── Section header ──────────────────────────────────────────────────────────
function SectionLabel({ label, accent }: { label: string; accent?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <span style={{
        fontSize: 10, fontWeight: 700, color: accent ?? '#AEAEB2',
        textTransform: 'uppercase', letterSpacing: '0.08em',
      }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }}/>
    </div>
  )
}

// ─── Designer scorecard ───────────────────────────────────────────────────────
function DesignerCard({ d }: { d: DesignerScorecard }) {
  const grade = d.grade ?? 'B'
  const gc = GRADE_COLORS[grade]

  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: 14,
      border: '1px solid rgba(0,0,0,0.07)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg,#7C3AED,#5B21B6)',
          color: '#fff', fontSize: 13, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{d.initial}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', margin: 0 }}>
            {d.name ?? 'Chưa assign'}
          </p>
          <p style={{ fontSize: 10, color: '#AEAEB2', margin: 0 }}>Designer</p>
        </div>
        {d.name && (
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: gc.bg, color: gc.fg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, flexShrink: 0,
          }}>{grade}</div>
        )}
      </div>

      {d.name && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
          <Mini label="Phản hồi" value={fmtHours(d.response_avg_hours)} hint="avg"/>
          <Mini label="Check-in"  value={`${d.checkin_compliance}%`}     hint="đúng hạn" warn={d.checkin_compliance < 80}/>
          <Mini label="Revise"   value={d.revision_avg.toFixed(1)}       hint="avg/task" warn={d.revision_avg > 2}/>
          <Mini label="On-time"  value={`${d.ontime_rate}%`}             hint="last 30d" warn={d.ontime_rate < 80}/>
          <Mini label="Done"     value={String(d.tasks_done_30d)}        hint="last 30d" full/>
        </div>
      )}
    </div>
  )
}

// ─── Orderer scorecard ────────────────────────────────────────────────────────
function OrdererCard({ o }: { o: OrdererScorecard }) {
  const briefColor = o.brief_quality_score >= 80 ? '#16A34A' : o.brief_quality_score >= 60 ? '#D97706' : '#E11D48'

  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: 14,
      border: '1px solid rgba(0,0,0,0.07)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg,#2563EB,#1E40AF)',
          color: '#fff', fontSize: 13, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{o.name[0]}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', margin: 0 }}>{o.name}</p>
          <p style={{ fontSize: 10, color: '#AEAEB2', margin: 0 }}>Orderer · {o.team}</p>
        </div>
      </div>

      {/* Brief quality bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Chất lượng brief
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: briefColor, fontVariantNumeric: 'tabular-nums' }}>
            {o.brief_quality_score}/100
          </span>
        </div>
        <div style={{ height: 5, background: 'rgba(0,0,0,0.06)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${o.brief_quality_score}%`,
            background: briefColor, transition: 'width 0.4s ease',
          }}/>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        <Mini label="Phản hồi" value={fmtHours(o.response_avg_hours)} hint="avg"/>
        <Mini label="Revise"  value={o.revision_avg.toFixed(1)} hint="avg/task" warn={o.revision_avg > 1.5}/>
        <Mini label="Hỏi lại" value={String(o.brief_returned)}  hint="brief returned" warn={o.brief_returned > 1}/>
      </div>
    </div>
  )
}

// ─── Mini stat ────────────────────────────────────────────────────────────────
function Mini({ label, value, hint, warn, full }: { label: string; value: string; hint?: string; warn?: boolean; full?: boolean }) {
  return (
    <div style={{
      padding: '8px 10px', borderRadius: 8,
      background: warn ? 'rgba(225,29,72,0.05)' : 'rgba(0,0,0,0.03)',
      border: warn ? '1px solid rgba(225,29,72,0.15)' : '1px solid transparent',
      gridColumn: full ? 'span 2' : undefined,
    }}>
      <p style={{ fontSize: 9, fontWeight: 600, color: '#AEAEB2', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </p>
      <p style={{ fontSize: 14, fontWeight: 700, color: warn ? '#E11D48' : '#1D1D1F', margin: '2px 0 0', letterSpacing: '-0.02em' }}>
        {value}
      </p>
      {hint && <p style={{ fontSize: 9, color: '#AEAEB2', margin: 0 }}>{hint}</p>}
    </div>
  )
}

// ─── Timing breakdown ─────────────────────────────────────────────────────────
function TimingTable({ rows }: { rows: TimingRow[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {rows.map(r => {
        const pct = Math.min(100, Math.round((r.duration_hours / Math.max(r.sla_hours, 1)) * 100))
        const color =
          r.status === 'over'     ? '#E11D48' :
          r.status === 'under'    ? '#16A34A' :
                                    '#2563EB'
        return (
          <div key={r.label} style={{
            display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 10,
            alignItems: 'center', padding: '8px 10px', borderRadius: 8,
            background: 'rgba(0,0,0,0.02)',
          }}>
            <span style={{ fontSize: 11, color: '#3A3A3C', fontWeight: 500 }}>{r.label}</span>
            <div style={{ height: 4, background: 'rgba(0,0,0,0.06)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: color, transition: 'width 0.3s' }}/>
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color, fontVariantNumeric: 'tabular-nums', minWidth: 90, textAlign: 'right' }}>
              {fmtHours(r.duration_hours)} <span style={{ color: '#AEAEB2', fontWeight: 500 }}>/ {fmtHours(r.sla_hours)}</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Activity log ─────────────────────────────────────────────────────────────
function ActivityLog({ events }: { events: ActivityEvent[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {events.map((e, i) => {
        const c = ROLE_COLORS[e.actor_role]
        return (
          <div key={i} style={{ display: 'flex', gap: 10 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%', background: c,
              marginTop: 7, flexShrink: 0,
            }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, color: '#1D1D1F', margin: 0, lineHeight: 1.45 }}>
                <span style={{ fontWeight: 600 }}>{e.actor}</span>
                <span style={{ color: '#6E6E73' }}> {e.action}</span>
              </p>
              {e.note && (
                <p style={{
                  fontSize: 11, color: '#6E6E73', margin: '3px 0 0', lineHeight: 1.45,
                  padding: '6px 9px', background: 'rgba(0,0,0,0.03)', borderRadius: 6,
                  borderLeft: `2px solid ${c}`,
                }}>{e.note}</p>
              )}
              <p style={{ fontSize: 10, color: '#AEAEB2', margin: '2px 0 0' }}>{timeAgo(e.timestamp)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PerformanceInsights({ insights }: Props) {
  return (
    <div style={{ marginBottom: 20 }}>
      <SectionLabel label="Hiệu suất — Designer × Orderer"/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        <DesignerCard d={insights.designer}/>
        <OrdererCard  o={insights.orderer}/>
      </div>

      <SectionLabel label="Thời gian từng bước"/>
      <TimingTable rows={insights.timing}/>

      <div style={{ height: 14 }}/>

      <SectionLabel label="Hoạt động gần đây"/>
      <ActivityLog events={insights.activity}/>
    </div>
  )
}
