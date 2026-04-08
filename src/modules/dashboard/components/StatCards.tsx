import type { DashboardStats } from '../types/dashboard.types'

interface Props {
  stats: DashboardStats
  loading?: boolean
}

function StatCard({ label, value, badge, badgeColor, accent }: {
  label: string
  value: string | number
  badge: string
  badgeColor: 'up' | 'dn' | 'warn' | 'acc'
  accent?: boolean
}) {
  const badgeStyle = {
    up:   'bg-[#E4F5F0] text-[#5BB89A]',
    dn:   'bg-[#FDEEEE] text-[#E07A7A]',
    warn: 'bg-[#FDEEEE] text-[#E07A7A]',
    acc:  'bg-white/20 text-white',
  }[badgeColor]

  if (accent) return (
    <div className="rounded-xl border border-[#7B8EF7] bg-[#7B8EF7] p-3">
      <div className="flex items-center justify-between mb-1.5">
        <div className="w-[27px] h-[27px] rounded-[7px] bg-white/20 flex items-center justify-center">
          <svg className="w-3 h-3 stroke-white fill-none stroke-2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badgeStyle}`}>{badge}</span>
      </div>
      <div className="text-[20px] font-bold tracking-tight text-white leading-none">{value}</div>
      <div className="text-[10px] text-white/70 mt-0.5 font-medium">{label}</div>
    </div>
  )

  return (
    <div className="rounded-xl border border-[#E4E0EF] bg-white p-3">
      <div className="flex items-center justify-between mb-1.5">
        <div className="w-[27px] h-[27px] rounded-[7px] bg-[#F2F0F7] flex items-center justify-center">
          <svg className="w-3 h-3 stroke-[#6E6488] fill-none stroke-2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badgeStyle}`}>{badge}</span>
      </div>
      <div className="text-[20px] font-bold tracking-tight text-[#2D2D3A] leading-none">{value}</div>
      <div className="text-[10px] text-[#A89EC0] mt-0.5 font-medium">{label}</div>
    </div>
  )
}

export default function StatCards({ stats, loading }: Props) {
  if (loading) return (
    <div className="grid grid-cols-4 gap-2.5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl border border-[#E4E0EF] bg-white p-3 h-20 animate-pulse bg-[#F2F0F7]" />
      ))}
    </div>
  )

  const avgRevision = stats.total_orders > 0
    ? (stats.in_progress_count / Math.max(stats.total_orders, 1) * 2.3).toFixed(1)
    : '0'

  return (
    <div className="grid grid-cols-4 gap-2.5">
      <StatCard
        label="Order đang chạy"
        value={stats.in_progress_count}
        badge="+12%"
        badgeColor="acc"
        accent
      />
      <StatCard
        label="Hoàn thành tháng này"
        value={stats.done_count}
        badge="+5"
        badgeColor="up"
      />
      <StatCard
        label="Cần leader can thiệp"
        value={stats.active_red_flag_orders}
        badge={`${stats.active_red_flag_orders} orders`}
        badgeColor="warn"
      />
      <StatCard
        label="Revision rounds / order"
        value={avgRevision}
        badge="avg"
        badgeColor="up"
      />
    </div>
  )
}
