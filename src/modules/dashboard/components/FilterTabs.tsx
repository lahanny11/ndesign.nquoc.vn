import type { FilterTab } from '../types/dashboard.types'

interface Props {
  active: FilterTab
  onChange: (tab: FilterTab) => void
  total: number
  flagCount: number
}

const TABS: { key: FilterTab; label: string; warn?: boolean }[] = [
  { key: 'all',     label: 'Tất cả' },
  { key: 'pending', label: 'Chờ nhận' },
  { key: 'active',  label: 'Đang chạy' },
  { key: 'done',    label: 'Hoàn thành' },
  { key: 'flag',    label: '⚠ Cảnh báo', warn: true },
]

export default function FilterTabs({ active, onChange, total, flagCount }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <h3 className="text-[14px] font-bold tracking-tight">
          Danh sách order{' '}
          <span className="text-[#A89EC0] font-normal text-[13px]">· {total} tasks</span>
        </h3>
        <div className="flex gap-0.5 bg-white border border-[#E4E0EF] rounded-lg p-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`px-3 py-[5px] rounded-[6px] text-[11px] font-semibold transition-all
                ${active === tab.key
                  ? 'bg-[#7B8EF7] text-white'
                  : tab.warn
                    ? 'text-[#E07A7A] hover:bg-[#FAF9FC]'
                    : 'text-[#6E6488] hover:bg-[#FAF9FC]'
                }`}
            >
              {tab.label}
              {tab.key === 'flag' && flagCount > 0 && (
                <span className={`ml-1 text-[9px] font-bold px-1 py-0.5 rounded-full
                  ${active === 'flag' ? 'bg-white/20' : 'bg-[#FDEEEE]'}`}>
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
