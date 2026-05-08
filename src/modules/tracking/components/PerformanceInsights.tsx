'use client'

import type {
  PerformanceInsights as Insights,
  DesignerScorecard, OrdererScorecard, TimingRow, ActivityEvent,
} from '../types/tracking.types'
import { TEAM_AVG } from './VerdictBar'

interface Props {
  insights: Insights
  view?: 'full' | 'performance' | 'activity'
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtHours(h: number): string {
  if (h < 1) return `${Math.round(h * 60)}m`
  if (h < 24) return `${h.toFixed(1)}h`
  return `${Math.round(h / 24)}d`
}

function timeAgo(iso: string): string {
  const NOW = new Date('2026-05-08T09:00:00Z').getTime()
  const t = new Date(iso).getTime()
  const diffMin = Math.max(0, Math.round((NOW - t) / 60000))
  if (diffMin < 60) return `${diffMin}m trước`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}h trước`
  return `${Math.floor(diffH / 24)}d trước`
}

const ROLE_COLORS: Record<ActivityEvent['actor_role'], string> = {
  designer: '#7C3AED',
  orderer:  '#2563EB',
  leader:   '#E11D48',
  system:   '#6E6E73',
}

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

// ─── Benchmark stat — value + so với team avg ────────────────────────────────
interface BenchProps {
  label: string
  value: string
  rawValue: number
  teamValue: number
  /** Hướng "tốt" — 'lower' nghĩa là số nhỏ hơn = tốt; 'higher' = số lớn hơn tốt */
  good: 'lower' | 'higher'
  /** Format cho delta (% hoặc number) */
  unit?: string
}

function Bench({ label, value, rawValue, teamValue, good, unit = '' }: BenchProps) {
  const delta = rawValue - teamValue
  const isGood = good === 'lower' ? delta < 0 : delta > 0
  const deltaAbs = Math.abs(delta)
  const showDelta = deltaAbs >= 0.05  // ngưỡng noise
  const deltaColor = !showDelta ? '#6E6E73' : isGood ? '#16A34A' : '#E11D48'
  const arrow = !showDelta ? '·' : delta > 0 ? '↑' : '↓'

  return (
    <div style={{
      padding: '10px 12px', borderRadius: 10,
      background: 'rgba(0,0,0,0.03)',
    }}>
      <p style={{
        fontSize: 9, fontWeight: 700, color: '#AEAEB2', margin: 0,
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>{label}</p>
      <p style={{
        fontSize: 16, fontWeight: 700, color: '#1D1D1F',
        margin: '3px 0 2px', letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums',
      }}>{value}</p>
      <p style={{
        fontSize: 10, color: deltaColor, margin: 0, fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {arrow} {showDelta ? `${deltaAbs.toFixed(unit === '%' ? 0 : 1)}${unit} vs team` : `Bằng team avg`}
      </p>
    </div>
  )
}

// ─── Designer card — compact ─────────────────────────────────────────────────
function DesignerCard({ d }: { d: DesignerScorecard }) {
  if (!d.name) return null

  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: 14,
      border: '1px solid rgba(0,0,0,0.07)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg,#7C3AED,#5B21B6)',
          color: '#fff', fontSize: 12, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>{d.initial}</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#1D1D1F', margin: 0 }}>{d.name}</p>
          <p style={{ fontSize: 10, color: '#AEAEB2', margin: 0 }}>Designer</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        <Bench label="Phản hồi"
          value={fmtHours(d.response_avg_hours)} rawValue={d.response_avg_hours}
          teamValue={TEAM_AVG.response_hours} good="lower" unit="h"/>
        <Bench label="Revise"
          value={d.revision_avg.toFixed(1)} rawValue={d.revision_avg}
          teamValue={TEAM_AVG.revision} good="lower"/>
        <Bench label="On-time"
          value={`${d.ontime_rate}%`} rawValue={d.ontime_rate}
          teamValue={TEAM_AVG.ontime_rate} good="higher" unit="%"/>
      </div>
    </div>
  )
}

// ─── Orderer card — compact ──────────────────────────────────────────────────
function OrdererCard({ o }: { o: OrdererScorecard }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: 14,
      border: '1px solid rgba(0,0,0,0.07)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg,#2563EB,#1E40AF)',
          color: '#fff', fontSize: 12, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>{o.name[0]}</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#1D1D1F', margin: 0 }}>{o.name}</p>
          <p style={{ fontSize: 10, color: '#AEAEB2', margin: 0 }}>Orderer · {o.team}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        <Bench label="Brief"
          value={`${o.brief_quality_score}`} rawValue={o.brief_quality_score}
          teamValue={TEAM_AVG.brief_quality} good="higher"/>
        <Bench label="Phản hồi"
          value={fmtHours(o.response_avg_hours)} rawValue={o.response_avg_hours}
          teamValue={TEAM_AVG.response_hours} good="lower" unit="h"/>
        <Bench label="Revise"
          value={o.revision_avg.toFixed(1)} rawValue={o.revision_avg}
          teamValue={TEAM_AVG.revision} good="lower"/>
      </div>
    </div>
  )
}

// ─── Timing — chỉ highlight bottleneck ──────────────────────────────────────
function TimingHighlight({ rows }: { rows: TimingRow[] }) {
  // Tìm bottleneck = step over SLA nhiều nhất
  const overSteps = rows.filter(r => r.status === 'over')
  const bottleneck = overSteps.sort((a, b) =>
    (b.duration_hours / b.sla_hours) - (a.duration_hours / a.sla_hours)
  )[0]

  if (!bottleneck) {
    return (
      <div style={{
        padding: '10px 14px', borderRadius: 10,
        background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.18)',
      }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#16A34A', margin: 0 }}>
          ✓ Mọi mốc trong SLA
        </p>
      </div>
    )
  }

  const overPct = Math.round((bottleneck.duration_hours / bottleneck.sla_hours - 1) * 100)
  return (
    <div style={{
      padding: '10px 14px', borderRadius: 10,
      background: 'rgba(225,29,72,0.06)', border: '1px solid rgba(225,29,72,0.18)',
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#E11D48', margin: '0 0 3px',
        textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Bottleneck
      </p>
      <p style={{ fontSize: 13, color: '#1D1D1F', margin: 0, fontWeight: 600 }}>
        {bottleneck.label} — {fmtHours(bottleneck.duration_hours)}
        <span style={{ color: '#E11D48', marginLeft: 6 }}>(+{overPct}% so SLA {fmtHours(bottleneck.sla_hours)})</span>
      </p>
    </div>
  )
}

// ─── Activity log — chỉ critical events ─────────────────────────────────────
function isCritical(e: ActivityEvent): boolean {
  const a = e.action.toLowerCase()
  return (
    a.includes('feedback') ||
    a.includes('giao') ||
    a.includes('cờ') ||
    a.includes('escalate') ||
    a.includes('hoàn thành') ||
    a.includes('xác nhận') ||
    a.includes('assign') ||
    e.actor_role === 'system'
  )
}

function ActivityLog({ events, max = 5 }: { events: ActivityEvent[]; max?: number }) {
  // Filter critical first, fallback to all if too few
  const critical = events.filter(isCritical)
  const display = (critical.length >= 3 ? critical : events).slice(0, max)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {display.map((e, i) => {
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
                  fontSize: 11, color: '#3A3A3C', margin: '4px 0 0', lineHeight: 1.45,
                  padding: '6px 9px', background: 'rgba(0,0,0,0.03)', borderRadius: 6,
                  borderLeft: `2px solid ${c}`,
                }}>{e.note}</p>
              )}
              <p style={{ fontSize: 10, color: '#AEAEB2', margin: '3px 0 0' }}>{timeAgo(e.timestamp)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PerformanceInsights({ insights, view = 'full' }: Props) {
  if (view === 'activity') {
    return (
      <div>
        <SectionLabel label="Hoạt động critical"/>
        <ActivityLog events={insights.activity} max={6}/>
      </div>
    )
  }

  if (view === 'performance') {
    return (
      <div>
        <SectionLabel label="So với team average"/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          <DesignerCard d={insights.designer}/>
          <OrdererCard  o={insights.orderer}/>
        </div>

        <SectionLabel label="Bottleneck"/>
        <TimingHighlight rows={insights.timing}/>
      </div>
    )
  }

  // full (legacy)
  return (
    <div style={{ marginBottom: 20 }}>
      <SectionLabel label="So với team average"/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        <DesignerCard d={insights.designer}/>
        <OrdererCard  o={insights.orderer}/>
      </div>
      <SectionLabel label="Bottleneck"/>
      <TimingHighlight rows={insights.timing}/>
      <div style={{ height: 14 }}/>
      <SectionLabel label="Hoạt động critical"/>
      <ActivityLog events={insights.activity}/>
    </div>
  )
}
