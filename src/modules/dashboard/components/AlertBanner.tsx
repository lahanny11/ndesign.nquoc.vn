import { useState } from 'react'

interface Props {
  flaggedOrders: string[]
}

export default function AlertBanner({ flaggedOrders }: Props) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed || flaggedOrders.length === 0) return null

  const shown = flaggedOrders.slice(0, 2)
  const extra = flaggedOrders.length - 2

  return (
    <div className="rounded-xl overflow-hidden border border-[#FDE8C8]"
      style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FFF3E0 100%)' }}>
      <div className="flex items-center gap-3 px-4 py-2.5">
        {/* Icon */}
        <div className="w-7 h-7 rounded-full bg-[#FDE8C8] flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 stroke-[#E8925A] fill-none stroke-2" viewBox="0 0 24 24">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>

        {/* Copy — warm & reassuring */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-[#C4782A]">
            Có {flaggedOrders.length} dự án cần thêm sự hỗ trợ
          </p>
          <p className="text-[10px] text-[#D4934A] mt-0.5">
            {shown.map((name, i) => (
              <span key={i}>
                <span className="font-semibold">"{name}"</span>
                {i < shown.length - 1 ? ', ' : ''}
              </span>
            ))}
            {extra > 0 && <span> và {extra} dự án khác</span>}
            {' '}— Design Leader đang theo dõi sát nhé 💪
          </p>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 w-6 h-6 rounded-full hover:bg-[#FDE8C8] flex items-center justify-center transition-colors"
          title="Đóng thông báo"
        >
          <svg className="w-3 h-3 stroke-[#E8925A] fill-none stroke-2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
