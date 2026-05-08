'use client'

import type { PerformanceInsights } from '../types/tracking.types'

// ─── Team baseline — để so sánh và compute fault ─────────────────────────────
// Hard-coded mock; production sẽ lấy từ /analytics aggregate.
export const TEAM_AVG = {
  brief_quality: 76,
  response_hours: 2.5,
  revision: 1.4,
  ontime_rate: 88,
  checkin_compliance: 85,
}

type Verdict = 'orderer_fault' | 'designer_fault' | 'both_fault' | 'on_track' | 'no_designer'

interface Diagnosis {
  verdict: Verdict
  headline: string
  reason: string
  tone: 'red' | 'warn' | 'green' | 'neutral'
  actions: { label: string; primary?: boolean; emoji: string }[]
}

// ─── Diagnosis logic ──────────────────────────────────────────────────────────
function diagnose(insights: PerformanceInsights): Diagnosis {
  const { designer, orderer } = insights

  if (!designer.name) {
    return {
      verdict: 'no_designer',
      tone: 'warn',
      headline: 'Chưa có Designer',
      reason: 'Order pending. Cần assign trong 24h, nếu không sẽ tự gắn cờ vàng.',
      actions: [
        { label: 'Assign Designer ngay', primary: true, emoji: '👤' },
      ],
    }
  }

  // Tính fault score (0-100, càng cao càng tệ)
  const briefDelta    = TEAM_AVG.brief_quality - orderer.brief_quality_score   // dương = tệ hơn team
  const ordererRespD  = orderer.response_avg_hours - TEAM_AVG.response_hours
  const ordererRevD   = orderer.revision_avg - TEAM_AVG.revision
  const ordererBad =
    briefDelta > 15 ||
    orderer.brief_returned >= 2 ||
    ordererRespD > 4

  const designerRespD = designer.response_avg_hours - TEAM_AVG.response_hours
  const designerRevD  = designer.revision_avg - TEAM_AVG.revision
  const designerCheckD = TEAM_AVG.checkin_compliance - designer.checkin_compliance
  const designerBad =
    designerRespD > 3 ||
    designerRevD > 0.7 ||
    designerCheckD > 15 ||
    designer.ontime_rate < 75

  // Both fault
  if (ordererBad && designerBad) {
    return {
      verdict: 'both_fault',
      tone: 'red',
      headline: 'Vướng cả 2 phía',
      reason: `Brief ${orderer.brief_quality_score}/100 (thấp hơn team ${briefDelta} điểm) + Designer phản hồi ${designer.response_avg_hours.toFixed(1)}h (gấp ${(designer.response_avg_hours / TEAM_AVG.response_hours).toFixed(1)}× team).`,
      actions: [
        { label: 'Họp 3 bên',  primary: true, emoji: '🤝' },
        { label: 'Escalate', emoji: '🚨' },
      ],
    }
  }

  // Orderer fault
  if (ordererBad) {
    const reasons: string[] = []
    if (briefDelta > 15)              reasons.push(`Brief ${orderer.brief_quality_score}/100 (thấp hơn team ${briefDelta} điểm)`)
    if (orderer.brief_returned >= 2)  reasons.push(`Brief bị trả lại ${orderer.brief_returned} lần`)
    if (ordererRespD > 4)              reasons.push(`Phản hồi avg ${orderer.response_avg_hours.toFixed(1)}h (chậm hơn team ${ordererRespD.toFixed(1)}h)`)
    return {
      verdict: 'orderer_fault',
      tone: 'red',
      headline: `Vướng do Orderer — ${orderer.name}`,
      reason: reasons.join(' · '),
      actions: [
        { label: 'Yêu cầu brief lại', primary: true, emoji: '📝' },
        { label: 'Gọi clarify', emoji: '📞' },
      ],
    }
  }

  // Designer fault
  if (designerBad) {
    const reasons: string[] = []
    if (designerRespD > 3)              reasons.push(`Phản hồi ${designer.response_avg_hours.toFixed(1)}h (gấp ${(designer.response_avg_hours / TEAM_AVG.response_hours).toFixed(1)}× team)`)
    if (designerRevD > 0.7)             reasons.push(`Revise ${designer.revision_avg.toFixed(1)} (cao hơn team ${designerRevD.toFixed(1)})`)
    if (designerCheckD > 15)            reasons.push(`Check-in ${designer.checkin_compliance}% (kém team ${designerCheckD}%)`)
    if (designer.ontime_rate < 75)      reasons.push(`On-time ${designer.ontime_rate}%`)
    return {
      verdict: 'designer_fault',
      tone: 'warn',
      headline: `Vướng do Designer — ${designer.name}`,
      reason: reasons.join(' · '),
      actions: [
        { label: 'Đặt 1-on-1', primary: true, emoji: '📅' },
        { label: 'Reassign', emoji: '⚖' },
      ],
    }
  }

  // On track
  return {
    verdict: 'on_track',
    tone: 'green',
    headline: 'Order on-track',
    reason: `Designer ${designer.name} và Orderer ${orderer.name} đều trong ngưỡng. Không có gì cần can thiệp.`,
    actions: [],
  }
}

// ─── UI ───────────────────────────────────────────────────────────────────────
const TONE_STYLES: Record<Diagnosis['tone'], { bg: string; border: string; fg: string; emoji: string }> = {
  red:     { bg: 'rgba(225,29,72,0.07)',  border: 'rgba(225,29,72,0.22)',  fg: '#E11D48', emoji: '🚨' },
  warn:    { bg: 'rgba(217,119,6,0.07)',  border: 'rgba(217,119,6,0.22)',  fg: '#D97706', emoji: '⚠️' },
  green:   { bg: 'rgba(22,163,74,0.06)',  border: 'rgba(22,163,74,0.22)',  fg: '#16A34A', emoji: '✓' },
  neutral: { bg: 'rgba(0,0,0,0.04)',       border: 'rgba(0,0,0,0.10)',     fg: '#1D1D1F', emoji: '·' },
}

interface Props {
  insights: PerformanceInsights
  onAction?: (label: string) => void
}

export default function VerdictBar({ insights, onAction }: Props) {
  const d = diagnose(insights)
  const t = TONE_STYLES[d.tone]

  return (
    <div style={{
      background: t.bg, border: `1px solid ${t.border}`, borderRadius: 12,
      padding: '12px 14px', marginBottom: 14,
    }}>
      {/* Headline */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: d.actions.length ? 10 : 0 }}>
        <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>{t.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 13, fontWeight: 700, color: t.fg, margin: 0, letterSpacing: '-0.01em',
          }}>{d.headline}</p>
          <p style={{
            fontSize: 11, color: '#3A3A3C', margin: '3px 0 0', lineHeight: 1.5,
          }}>{d.reason}</p>
        </div>
      </div>

      {/* Actions */}
      {d.actions.length > 0 && (
        <div style={{ display: 'flex', gap: 6, marginLeft: 26 }}>
          {d.actions.map(a => (
            <button
              key={a.label}
              onClick={() => onAction?.(a.label)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '6px 11px', borderRadius: 8, border: 'none',
                background: a.primary ? t.fg : 'rgba(0,0,0,0.06)',
                color: a.primary ? '#fff' : '#1D1D1F',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'inherit', transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <span style={{ fontSize: 12 }}>{a.emoji}</span>
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
