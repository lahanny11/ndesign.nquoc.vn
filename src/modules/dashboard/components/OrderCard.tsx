import type { OrderCard as OrderCardType } from '../types/dashboard.types'

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending:     { label: 'Chờ nhận',    cls: 'bg-[rgba(245,245,245,0.92)] text-[#606060]' },
  assigned:    { label: 'Đang làm',    cls: 'bg-[rgba(235,242,255,0.95)] text-[#7B8EF7]' },
  in_progress: { label: 'Đang làm',    cls: 'bg-[rgba(235,242,255,0.95)] text-[#7B8EF7]' },
  delivered:   { label: 'Đã giao',     cls: 'bg-[rgba(255,243,224,0.95)] text-[#E8925A]' },
  feedback:    { label: 'Feedback',    cls: 'bg-[rgba(245,235,255,0.95)] text-[#7C3AED]' },
  done:        { label: 'Hoàn thành',  cls: 'bg-[rgba(232,248,239,0.95)] text-[#5BB89A]' },
}

const PROG_COLORS: Record<number, string> = {
  1: '#A0A0A0', 2: '#7B8EF7', 3: '#7B8EF7',
  4: '#F4B08A', 5: '#B8A9E8', 6: '#F4B08A', 7: '#5BB89A',
}
const PROG_LABELS = ['Order gửi', 'Nhận task', 'Đang làm', 'Giao lần 1', 'Feedback', 'Chỉnh sửa', 'Hoàn thành']

// SVG thumbnail gradient based on index
const THUMB_GRADIENTS = [
  ['#C4A8D4', '#B89CC8'],
  ['#F5F3EF', '#E8E4DC'],
  ['#8FAAC4', '#7A98B8'],
  ['#111',    '#1C1C1C'],
  ['#FFE4F0', '#FFD6EC'],
  ['#A8B8F4', '#8FA6EF'],
  ['#F5E6C8', '#D4A853'],
]

interface Props {
  order: OrderCardType
  onTrack: (id: string) => void
  index: number
}

export default function OrderCard({ order, onTrack, index }: Props) {
  const st = STATUS_MAP[order.status] ?? STATUS_MAP.pending
  const progress = order.progress ?? 1
  const pct = Math.round((progress / 7) * 100)
  const pcol = PROG_COLORS[progress] ?? '#A0A0A0'
  const plbl = PROG_LABELS[progress - 1] ?? 'Chờ gửi'
  const [c1, c2] = THUMB_GRADIENTS[index % THUMB_GRADIENTS.length]

  const deadline = new Date(order.deadline)
  const now = new Date()
  const diffDays = Math.round((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  const borderCls = order.has_red_flag
    ? 'border-[#E07A7A]'
    : order.has_warn_flag
      ? 'border-[#E8925A]'
      : 'border-[#E4E0EF]'

  return (
    <div
      className={`bg-white rounded-xl border-[1.5px] ${borderCls} overflow-hidden cursor-pointer
        transition-all duration-180 flex flex-col hover:-translate-y-0.5 hover:shadow-[0_5px_16px_rgba(0,0,0,0.08)] hover:border-[#CEC9E0]`}
      onClick={() => onTrack(order.id)}
    >
      {/* Thumbnail */}
      <div className="h-[95px] relative overflow-hidden bg-[#F2F0F7] shrink-0">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id={`g${index}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={c1}/>
              <stop offset="100%" stopColor={c2}/>
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill={`url(#g${index})`}/>
          <rect x="20" y="40" width="60" height="4" rx="2" fill="rgba(255,255,255,0.35)"/>
          <rect x="30" y="48" width="40" height="3" rx="1.5" fill="rgba(255,255,255,0.22)"/>
        </svg>

        {/* Badges */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5">
          <div className={`inline-flex items-center gap-[3px] px-1.5 py-0.5 rounded-full text-[8px] font-bold border border-white/30 leading-snug ${st.cls}`}>
            <span className="w-1 h-1 rounded-full bg-current opacity-70 shrink-0"/>
            {st.label}
          </div>
          {order.is_urgent && (
            <div className="inline-flex items-center gap-[3px] px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-[rgba(224,122,122,0.88)] text-white leading-snug">
              GẤP
            </div>
          )}
        </div>

        {/* Flag icon */}
        {order.has_red_flag && (
          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#E07A7A] flex items-center justify-center">
            <svg className="w-2.5 h-2.5 stroke-white fill-none stroke-[2.5]" viewBox="0 0 24 24">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
            </svg>
          </div>
        )}
        {!order.has_red_flag && order.has_warn_flag && (
          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#E8925A] flex items-center justify-center">
            <svg className="w-2.5 h-2.5 stroke-white fill-none stroke-[2.5]" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-2.5 pb-2.5 pt-2 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[8px] font-bold text-[#7B8EF7] uppercase tracking-[0.04em]">{order.team_name}</span>
          <span className="text-[8px] text-[#A89EC0]">{order.orderer_name}</span>
        </div>

        <div className="text-[11px] font-semibold leading-snug text-[#2D2D3A] mb-1.5
          overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: 28 }}>
          {order.task_name}
        </div>

        {/* Progress */}
        <div className="mb-1.5">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[8px] font-semibold text-[#6E6488]">{plbl}</span>
            <span className="text-[8px] font-bold" style={{ color: pcol }}>{pct}%</span>
          </div>
          <div className="h-[3px] bg-[#F2F0F7] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pcol }}/>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1.5 border-t border-[#F2F0F7] mt-auto">
          <div>
            <div className="text-[8px] text-[#A89EC0] flex items-center gap-0.5">
              <svg className="w-2 h-2 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {deadline.toLocaleDateString('vi-VN')}
            </div>
            {order.is_overdue || diffDays < 0 ? (
              <div className="text-[8px] font-bold text-[#E07A7A]">⚠ Trễ {Math.abs(diffDays)} ngày</div>
            ) : diffDays <= 3 ? (
              <div className="text-[8px] font-bold text-[#E8925A]">Còn {diffDays} ngày</div>
            ) : diffDays > 7 ? (
              <div className="text-[8px] font-bold text-[#5BB89A]">✓ Sớm {diffDays} ngày</div>
            ) : null}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onTrack(order.id) }}
            className="text-[9px] font-bold px-2 py-1 rounded-[6px] border-[1.5px] border-[#7B8EF7] bg-[#EEF0FE] text-[#7B8EF7]
              hover:bg-[#7B8EF7] hover:text-white transition-all"
          >
            Tracking →
          </button>
        </div>
      </div>
    </div>
  )
}
