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
    <div className="bg-[#FDEEEE] border border-[#FECACA] rounded-[10px] px-3.5 py-2.5 flex items-center gap-2.5 text-[12px] text-[#E07A7A]">
      <svg className="w-3.5 h-3.5 stroke-[#E07A7A] fill-none stroke-2 shrink-0" viewBox="0 0 24 24">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <span>
        <b>{flaggedOrders.length} order cần leader can thiệp:</b>{' '}
        {shown.map((name, i) => (
          <span key={i}>"{name}"{i < shown.length - 1 ? ', ' : ''}</span>
        ))}
        {extra > 0 && <span> và +{extra} khác</span>}
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="ml-auto opacity-50 hover:opacity-100 shrink-0"
      >
        <svg className="w-3.5 h-3.5 stroke-[#E07A7A] fill-none stroke-2" viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )
}
