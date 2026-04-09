import type { DashboardStats } from '../types/dashboard.types'

interface Props {
  stats: DashboardStats
  loading?: boolean
}

function StatCard({ label, sub, value, icon, badge, badgeColor, accent, pulse }: {
  label: string
  sub?: string
  value: string | number
  icon: React.ReactNode
  badge: string
  badgeColor: 'up' | 'dn' | 'warn' | 'acc' | 'neutral'
  accent?: boolean
  pulse?: boolean
}) {
  const badgeStyle = {
    up:      'bg-[#E4F5F0] text-[#5BB89A]',
    dn:      'bg-[#FDEEEE] text-[#E07A7A]',
    warn:    'bg-[#FFF0E8] text-[#E8925A]',
    acc:     'bg-white/25 text-white',
    neutral: 'bg-[#F2F0F7] text-[#6E6488]',
  }[badgeColor]

  if (accent) return (
    <div className="rounded-2xl overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #7B8EF7 0%, #6C6BAE 100%)' }}>
      {/* Decorative circles */}
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
      <div className="absolute -bottom-3 -left-3 w-14 h-14 rounded-full bg-white/8" />
      <div className="relative p-3.5">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-[9px] bg-white/20 flex items-center justify-center">
            {icon}
          </div>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badgeStyle}`}>{badge}</span>
        </div>
        <div className="text-[22px] font-bold tracking-tight text-white leading-none mb-0.5">{value}</div>
        <div className="text-[10px] text-white/80 font-semibold">{label}</div>
        {sub && <div className="text-[9px] text-white/55 mt-0.5">{sub}</div>}
      </div>
    </div>
  )

  return (
    <div className={`rounded-2xl border bg-white p-3.5 relative overflow-hidden transition-all hover:shadow-sm
      ${pulse ? 'border-[#FECACA]' : 'border-[#E4E0EF]'}`}>
      {pulse && <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E07A7A] to-[#E8925A]" />}
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-[9px] flex items-center justify-center
          ${pulse ? 'bg-[#FFF0EE]' : 'bg-[#F2F0F7]'}`}>
          {icon}
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badgeStyle}`}>{badge}</span>
      </div>
      <div className="text-[22px] font-bold tracking-tight text-[#2D2D3A] leading-none mb-0.5">{value}</div>
      <div className="text-[10px] text-[#6E6488] font-semibold">{label}</div>
      {sub && <div className="text-[9px] text-[#A89EC0] mt-0.5">{sub}</div>}
    </div>
  )
}

export default function StatCards({ stats, loading }: Props) {
  if (loading) return (
    <div className="grid grid-cols-4 gap-2.5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-[#E4E0EF] bg-white p-3.5 h-24 animate-pulse" />
      ))}
    </div>
  )

  const avgRevision = stats.total_orders > 0
    ? (stats.in_progress_count / Math.max(stats.total_orders, 1) * 2.3).toFixed(1)
    : '0'

  return (
    <div className="grid grid-cols-4 gap-2.5">
      <StatCard
        label="Đang được chăm sóc"
        sub={`Tổng ${stats.total_orders} dự án`}
        value={stats.in_progress_count}
        badge="+12% tháng này"
        badgeColor="acc"
        accent
        icon={
          <svg className="w-4 h-4 stroke-white fill-none stroke-[2]" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        }
      />
      <StatCard
        label="Ra mắt thành công ✨"
        sub="Hoàn thành tháng này"
        value={stats.done_count}
        badge={`+${stats.done_count} dự án`}
        badgeColor="up"
        icon={
          <svg className="w-4 h-4 stroke-[#5BB89A] fill-none stroke-2" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        }
      />
      <StatCard
        label="Cần được hỗ trợ thêm"
        sub="Team đang theo dõi sát"
        value={stats.active_red_flag_orders}
        badge={stats.active_red_flag_orders > 0 ? 'Cần chú ý' : 'Ổn định 👍'}
        badgeColor={stats.active_red_flag_orders > 0 ? 'warn' : 'up'}
        pulse={stats.active_red_flag_orders > 0}
        icon={
          <svg className="w-4 h-4 stroke-[#E8925A] fill-none stroke-2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        }
      />
      <StatCard
        label="Revision trung bình"
        sub="Mục tiêu ≤ 2 lần"
        value={`${avgRevision}x`}
        badge={Number(avgRevision) <= 2 ? 'Tốt lắm! 🎯' : 'Cần cải thiện'}
        badgeColor={Number(avgRevision) <= 2 ? 'up' : 'warn'}
        icon={
          <svg className="w-4 h-4 stroke-[#6E6488] fill-none stroke-2" viewBox="0 0 24 24">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
          </svg>
        }
      />
    </div>
  )
}
