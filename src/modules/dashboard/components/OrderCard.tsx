import type { OrderCard as OrderCardType } from '../types/dashboard.types'

const STATUS_MAP: Record<string, { label: string; cls: string; dot: string }> = {
  pending:     { label: 'Chờ designer nhận', cls: 'bg-[rgba(245,244,252,0.95)] text-[#8B82C4]',  dot: '#8B82C4' },
  assigned:    { label: 'Designer đã nhận',  cls: 'bg-[rgba(235,242,255,0.95)] text-[#7B8EF7]',  dot: '#7B8EF7' },
  in_progress: { label: 'Đang thiết kế ✏️',  cls: 'bg-[rgba(235,242,255,0.95)] text-[#7B8EF7]',  dot: '#7B8EF7' },
  delivered:   { label: 'Đã giao bản đầu',   cls: 'bg-[rgba(255,243,224,0.95)] text-[#E8925A]',  dot: '#E8925A' },
  feedback:    { label: 'Đang xem feedback', cls: 'bg-[rgba(245,235,255,0.95)] text-[#7C3AED]',  dot: '#7C3AED' },
  done:        { label: 'Hoàn thành 🎉',      cls: 'bg-[rgba(232,248,239,0.95)] text-[#5BB89A]',  dot: '#5BB89A' },
}

const PROG_COLORS: Record<number, string> = {
  1: '#A0A0A0', 2: '#7B8EF7', 3: '#7B8EF7',
  4: '#F4B08A', 5: '#B8A9E8', 6: '#F4B08A', 7: '#5BB89A',
}
const PROG_LABELS = [
  'Vừa gửi yêu cầu',
  'Designer đang nhận',
  'Đang được thiết kế',
  'Đã giao bản đầu',
  'Đang xem feedback',
  'Đang chỉnh sửa',
  'Hoàn thành rồi! 🎉',
]

const THUMB_GRADIENTS = [
  ['#C4A8D4', '#B89CC8'],
  ['#F5F3EF', '#E8E4DC'],
  ['#8FAAC4', '#7A98B8'],
  ['#2D2D3A', '#1C1C2E'],
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
  const plbl = PROG_LABELS[progress - 1] ?? 'Đang xử lý'
  const [c1, c2] = THUMB_GRADIENTS[index % THUMB_GRADIENTS.length]

  const deadline = new Date(order.deadline)
  const now = new Date()
  const diffDays = Math.round((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  const isAlmostDone = pct >= 85
  const borderCls = order.has_red_flag
    ? 'border-[#E07A7A] shadow-[0_0_0_1px_rgba(224,122,122,0.15)]'
    : order.has_warn_flag
      ? 'border-[#E8C08A]'
      : 'border-[#E4E0EF]'

  return (
    <div
      className={`bg-white rounded-2xl border-[1.5px] ${borderCls} overflow-hidden cursor-pointer
        transition-all duration-200 flex flex-col
        hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(108,107,174,0.12)] hover:border-[#B8AEE0]`}
      onClick={() => onTrack(order.id)}
    >
      {/* Thumbnail */}
      <div className="h-[95px] relative overflow-hidden shrink-0">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id={`g${index}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={c1}/>
              <stop offset="100%" stopColor={c2}/>
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill={`url(#g${index})`}/>
          {/* Decorative lines */}
          <rect x="15" y="38" width="70" height="5" rx="2.5" fill="rgba(255,255,255,0.3)"/>
          <rect x="25" y="48" width="50" height="3.5" rx="1.75" fill="rgba(255,255,255,0.18)"/>
          <rect x="35" y="55" width="30" height="2.5" rx="1.25" fill="rgba(255,255,255,0.12)"/>
          {isAlmostDone && (
            <circle cx="85" cy="20" r="8" fill="rgba(91,184,154,0.35)"/>
          )}
        </svg>

        {/* Status badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-0.5">
          <div className={`inline-flex items-center gap-1 px-1.5 py-[3px] rounded-full text-[7.5px] font-bold border border-white/30 ${st.cls}`}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: st.dot }}/>
            {st.label}
          </div>
          {order.is_urgent && (
            <div className="inline-flex items-center gap-1 px-1.5 py-[3px] rounded-full text-[7.5px] font-bold bg-[rgba(224,122,122,0.88)] text-white">
              ⚡ Cần gấp
            </div>
          )}
        </div>

        {/* Almost done badge */}
        {isAlmostDone && progress < 7 && (
          <div className="absolute bottom-2 left-2 text-[7px] font-bold px-1.5 py-0.5 rounded-full bg-[rgba(91,184,154,0.9)] text-white">
            Sắp xong rồi! ✨
          </div>
        )}

        {/* Flag icon */}
        {order.has_red_flag && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#E07A7A] flex items-center justify-center shadow">
            <svg className="w-2.5 h-2.5 stroke-white fill-none stroke-[2.5]" viewBox="0 0 24 24">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            </svg>
          </div>
        )}
        {!order.has_red_flag && order.has_warn_flag && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#E8925A] flex items-center justify-center shadow">
            <svg className="w-2.5 h-2.5 stroke-white fill-none stroke-[2.5]" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
            </svg>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-3 pb-3 pt-2 flex flex-col flex-1">
        {/* Team + Orderer */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[8px] font-bold text-[#7B8EF7] uppercase tracking-[0.06em]">{order.team_name}</span>
          <span className="text-[8px] text-[#A89EC0]">{order.orderer_name}</span>
        </div>

        {/* Task name */}
        <div className="text-[11px] font-semibold leading-snug text-[#2D2D3A] mb-2
          overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: 28 }}>
          {order.task_name}
        </div>

        {/* Designer info if assigned */}
        {order.designer_name && (
          <div className="flex items-center gap-1 mb-1.5 text-[8px] text-[#6E6488]">
            <div className="w-3.5 h-3.5 rounded-full bg-[#EEF0FE] flex items-center justify-center text-[7px] font-bold text-[#7B8EF7]">
              {order.designer_name[0]}
            </div>
            <span>{order.designer_name} đang làm cho bạn</span>
          </div>
        )}

        {/* Progress */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] text-[#6E6488] font-medium">{plbl}</span>
            <span className="text-[8px] font-bold" style={{ color: pcol }}>{pct}%</span>
          </div>
          <div className="h-[3.5px] bg-[#F2F0F7] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: pcol }}/>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F2F0F7] mt-auto">
          <div>
            <div className="text-[8px] text-[#A89EC0] flex items-center gap-1">
              <svg className="w-2.5 h-2.5 stroke-current fill-none stroke-[1.8]" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {deadline.toLocaleDateString('vi-VN')}
            </div>
            {order.is_overdue || diffDays < 0 ? (
              <div className="text-[8px] font-bold text-[#E07A7A] mt-0.5">⚠ Trễ {Math.abs(diffDays)} ngày</div>
            ) : diffDays <= 2 ? (
              <div className="text-[8px] font-bold text-[#E8925A] mt-0.5">⏰ Còn {diffDays} ngày thôi!</div>
            ) : diffDays > 7 ? (
              <div className="text-[8px] font-bold text-[#5BB89A] mt-0.5">✓ Còn {diffDays} ngày</div>
            ) : null}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onTrack(order.id) }}
            className="text-[9px] font-bold px-2.5 py-1.5 rounded-[8px] border-[1.5px] border-[#7B8EF7] bg-[#EEF0FE] text-[#7B8EF7]
              hover:bg-[#7B8EF7] hover:text-white transition-all hover:shadow-sm"
          >
            Xem tiến độ →
          </button>
        </div>
      </div>
    </div>
  )
}
