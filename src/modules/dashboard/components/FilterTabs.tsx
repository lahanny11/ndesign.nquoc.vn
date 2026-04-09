import type { FilterTab } from '../types/dashboard.types'

interface Props {
  active: FilterTab
  onChange: (tab: FilterTab) => void
  total: number
  flagCount: number
}

const TABS: { key: FilterTab; label: string; warn?: boolean }[] = [
  { key: 'all',     label: 'Tất cả dự án' },
  { key: 'pending', label: 'Chờ designer nhận' },
  { key: 'active',  label: 'Đang được thiết kế' },
  { key: 'done',    label: 'Đã hoàn thành ✓' },
  { key: 'flag',    label: 'Cần chú ý', warn: true },
]

export default function FilterTabs({ active, onChange, total, flagCount }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-wrap">
        <div>
          <h3 className="text-[14px] font-bold tracking-tight text-[#2D2D3A]">Dự án của bạn</h3>
          <p className="text-[10px] text-[#A89EC0] mt-0.5">
            {total > 0 ? `${total} dự án · Team đang xử lý` : 'Chưa có dự án nào'}
          </p>
        </div>
        <div className="flex gap-0.5 bg-white border border-[#E4E0EF] rounded-xl p-1 shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`px-3 py-1.5 rounded-[8px] text-[11px] font-semibold transition-all whitespace-nowrap
                ${active === tab.key
                  ? 'bg-gradient-to-r from-[#7B8EF7] to-[#6C6BAE] text-white shadow-sm'
                  : tab.warn
                    ? 'text-[#E8925A] hover:bg-[#FFF7ED]'
                    : 'text-[#6E6488] hover:bg-[#F5F4FC] hover:text-[#2D2D3A]'
                }`}
            >
              {tab.label}
              {tab.key === 'flag' && flagCount > 0 && (
                <span className={`ml-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full
                  ${active === 'flag' ? 'bg-white/25 text-white' : 'bg-[#FDE8C8] text-[#E8925A]'}`}>
                  {flagCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
