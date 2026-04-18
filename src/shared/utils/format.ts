// src/shared/utils/format.ts

/** Format ISO timestamp → "18/04/2026 07:00" */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

/** Format date-only YYYY-MM-DD → "18/04/2026" */
export function formatDate(date: string): string {
  const [y, m, d] = date.split('-')
  return `${d}/${m}/${y}`
}

/**
 * So sánh deadline (YYYY-MM-DD) với hôm nay.
 * Trả về: { label, color, daysLeft }
 */
export function formatDeadline(deadline: string): {
  label: string
  color: 'green' | 'red' | 'gray'
  daysLeft: number
} {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due   = new Date(deadline)
  due.setHours(0, 0, 0, 0)
  const diff  = Math.round((due.getTime() - today.getTime()) / 86_400_000)

  if (diff > 0)  return { label: `Còn ${diff} ngày`,  color: 'green', daysLeft: diff }
  if (diff === 0)return { label: 'Hôm nay',            color: 'gray',  daysLeft: 0   }
  return         { label: `Trễ ${-diff} ngày`,         color: 'red',   daysLeft: diff }
}

/** Format số với dấu phân cách nghìn */
export function formatNumber(n: number): string {
  return n.toLocaleString('vi-VN')
}
