import type { DashboardStats } from '../types/dashboard.types'

interface Props {
  stats: DashboardStats
  loading?: boolean
}

interface CardProps {
  label: string
  value: string | number
  sub: string
  badge?: string
  badgeColor?: string
  badgeBg?: string
  accent?: boolean
  alert?: boolean
}

function StatCard({ label, value, sub, badge, badgeColor, badgeBg, accent, alert }: CardProps) {
  const valueColor = accent ? '#2563EB' : alert ? '#E11D48' : '#1D1D1F'

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '18px 20px 16px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
    }}>
      <p style={{
        fontSize: 11,
        fontWeight: 500,
        color: '#AEAEB2',
        margin: '0 0 10px',
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        lineHeight: 1,
      }}>
        {label}
      </p>

      <p style={{
        fontSize: 28,
        fontWeight: 700,
        color: valueColor,
        margin: 0,
        lineHeight: 1,
        letterSpacing: '-0.025em',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        gap: 8,
      }}>
        <p style={{ fontSize: 12, color: '#AEAEB2', margin: 0, lineHeight: 1.3, flex: 1, minWidth: 0 }}>
          {sub}
        </p>
        {badge && (
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            padding: '3px 7px',
            borderRadius: 99,
            flexShrink: 0,
            letterSpacing: '0.01em',
            color: badgeColor,
            background: badgeBg,
          }}>
            {badge}
          </span>
        )}
      </div>
    </div>
  )
}

export default function StatCards({ stats, loading }: Props) {
  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{
          background: '#fff',
          borderRadius: 16,
          height: 106,
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
          opacity: 0.6,
        }}/>
      ))}
    </div>
  )

  // avg_revision_rounds đến từ backend — thật, không tự tính
  const avg = stats.avg_revision_rounds ?? 0
  const revisionOk = avg <= 1.5
  const revisionWarn = avg > 1.5 && avg <= 2
  const revisionBad = avg > 2

  // Badge cho cần hỗ trợ
  const needsAction = stats.active_red_flag_orders > 0 || stats.pending_assignment > 0

  // Chỉ hiển thị done badge khi có data thật (> 0)
  const doneBadge = stats.done_count > 0
    ? { badge: `${stats.done_count} tháng này`, badgeColor: '#16A34A', badgeBg: 'rgba(22,163,74,0.09)' }
    : {}

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
      {/* Card 1 — Đang thực hiện */}
      <StatCard
        label="Đang thực hiện"
        value={stats.in_progress_count}
        sub={`Trên tổng ${stats.total_orders} order`}
        accent
      />

      {/* Card 2 — Hoàn thành */}
      <StatCard
        label="Hoàn thành"
        value={stats.done_count}
        sub="Bàn giao thành công"
        {...doneBadge}
      />

      {/* Card 3 — Cần hỗ trợ */}
      <StatCard
        label="Cần hỗ trợ"
        value={stats.active_red_flag_orders}
        sub={stats.pending_assignment > 0
          ? `${stats.pending_assignment} order chờ assign`
          : 'Order đang có vấn đề'
        }
        alert={needsAction}
        badge={needsAction ? 'Cần xử lý' : undefined}
        badgeColor="#E11D48"
        badgeBg="rgba(225,29,72,0.09)"
      />

      {/* Card 4 — Avg Revision — từ backend thật */}
      <StatCard
        label="Avg. Revision"
        value={`${avg.toFixed(1)}×`}
        sub="Mục tiêu ≤ 1.5 vòng"
        badge={
          revisionBad  ? 'Cần cải thiện' :
          revisionWarn ? 'Chú ý'         :
          revisionOk   ? 'On track'      : undefined
        }
        badgeColor={
          revisionBad  ? '#E11D48' :
          revisionWarn ? '#FF9F0A' : '#16A34A'
        }
        badgeBg={
          revisionBad  ? 'rgba(225,29,72,0.09)' :
          revisionWarn ? 'rgba(255,159,10,0.09)' : 'rgba(22,163,74,0.09)'
        }
        alert={revisionBad}
      />
    </div>
  )
}
