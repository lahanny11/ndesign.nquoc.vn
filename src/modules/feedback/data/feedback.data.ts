// ─── Feedback module data & types ───────────────────────────────────────────
// Triết lý của chị Nhi: feedback phải biến thành quyết định.
// 4 categories cố định (không có "khác"), 4 statuses cố định, SLA 7 ngày.

export type FeedbackCategory = 'brief' | 'process' | 'bug' | 'idea'
export type FeedbackStatus = 'open' | 'reviewing' | 'resolved' | 'wontfix'
export type FeedbackRole = 'designer' | 'orderer' | 'leader'

export interface FeedbackReply {
  id: string
  author: string
  role: FeedbackRole
  body: string
  createdAt: string  // ISO date
}

export interface FeedbackItem {
  id: string
  category: FeedbackCategory
  title: string
  body: string
  author: string
  role: FeedbackRole
  team?: string
  relatedOrder?: string  // order_number, optional
  status: FeedbackStatus
  createdAt: string
  resolvedAt?: string
  resolutionNote?: string
  replies: FeedbackReply[]
}

// ─── Category metadata ────────────────────────────────────────────────────────
export const CATEGORY_META: Record<FeedbackCategory, {
  label: string
  short: string
  desc: string
  emoji: string
  color: string
  bg: string
  border: string
}> = {
  brief: {
    label: 'Brief Quality',
    short: 'Brief',
    desc: 'Brief từ Orderer thiếu / khó hiểu / mâu thuẫn',
    emoji: '📋',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.08)',
    border: 'rgba(217,119,6,0.22)',
  },
  process: {
    label: 'Quy trình',
    short: 'Process',
    desc: 'Quy trình SOP có chỗ vướng / chưa rõ / cần đổi',
    emoji: '🔄',
    color: '#2563EB',
    bg: 'rgba(37,99,235,0.08)',
    border: 'rgba(37,99,235,0.22)',
  },
  bug: {
    label: 'Tool & Bug',
    short: 'Bug',
    desc: 'Dashboard này lỗi / chậm / không như kỳ vọng',
    emoji: '🐛',
    color: '#E11D48',
    bg: 'rgba(225,29,72,0.08)',
    border: 'rgba(225,29,72,0.22)',
  },
  idea: {
    label: 'Đề xuất',
    short: 'Idea',
    desc: 'Ý tưởng cải tiến — feature mới hoặc cách làm khác',
    emoji: '💡',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
    border: 'rgba(124,58,237,0.22)',
  },
}

// ─── Status metadata ──────────────────────────────────────────────────────────
export const STATUS_META: Record<FeedbackStatus, {
  label: string
  color: string
  bg: string
  dot: string
}> = {
  open:      { label: 'Đang mở',     color: '#6E6E73', bg: 'rgba(110,110,115,0.10)', dot: '#AEAEB2' },
  reviewing: { label: 'Đang xem',    color: '#D97706', bg: 'rgba(217,119,6,0.10)',   dot: '#D97706' },
  resolved:  { label: 'Đã xử lý',    color: '#16A34A', bg: 'rgba(22,163,74,0.10)',   dot: '#16A34A' },
  wontfix:   { label: 'Không làm',   color: '#64748B', bg: 'rgba(100,116,139,0.10)', dot: '#64748B' },
}

// ─── Mock feedback data ──────────────────────────────────────────────────────
export const FEEDBACKS: FeedbackItem[] = [
  {
    id: 'fb-1',
    category: 'brief',
    title: 'Brief từ team Content thường thiếu mục tiêu chính',
    body: 'Mình nhận task carousel "5 Tips Quản lý thời gian" nhưng brief không nói rõ đối tượng là sinh viên hay người đi làm. Phải nhắn riêng 3 lần mới biết. Đề xuất: Form Order bắt buộc field "Đối tượng người xem" cho category Social Media.',
    author: 'Lê Văn A',
    role: 'designer',
    relatedOrder: 'ND-20260407-0007',
    status: 'reviewing',
    createdAt: '2026-05-04T09:30:00Z',
    replies: [
      {
        id: 'r1', author: 'Nguyễn Quốc', role: 'leader',
        body: 'Đã đọc. Chị nghĩ đúng — sẽ thêm field "Đối tượng" vào Step 1 form. Dự kiến deploy tuần sau. Cảm ơn em flag sớm.',
        createdAt: '2026-05-04T11:15:00Z',
      },
    ],
  },
  {
    id: 'fb-2',
    category: 'bug',
    title: 'Nút "Check-in" Tracking Panel đôi khi không response',
    body: 'Click "Check-in tiến độ" nhưng button không phản hồi gì. Phải refresh trang. Xảy ra trên Chrome, Mac M1.',
    author: 'Trần Thị B',
    role: 'designer',
    status: 'resolved',
    createdAt: '2026-05-01T14:22:00Z',
    resolvedAt: '2026-05-02T10:00:00Z',
    resolutionNote: 'Đã fix trong build 1.2 — race condition khi click 2 lần liên tiếp.',
    replies: [
      {
        id: 'r2', author: 'Nguyễn Quốc', role: 'leader',
        body: 'Bug confirmed. IT đã fix. Em thử lại nhé.',
        createdAt: '2026-05-02T10:00:00Z',
      },
      {
        id: 'r3', author: 'Trần Thị B', role: 'designer',
        body: 'Đã ổn. Cảm ơn anh.',
        createdAt: '2026-05-02T10:30:00Z',
      },
    ],
  },
  {
    id: 'fb-3',
    category: 'process',
    title: 'SLA Print 4-5 ngày quá dài cho task đơn giản',
    body: 'Một số poster đơn giản (1 background + tiêu đề) mà tính 4-5 ngày là hơi nhiều. Đề xuất chia tier: Print Simple (2-3 ngày) vs Print Complex (4-5 ngày).',
    author: 'Vũ Thanh Tùng',
    role: 'orderer',
    team: 'Edit',
    status: 'open',
    createdAt: '2026-05-06T16:45:00Z',
    replies: [],
  },
  {
    id: 'fb-4',
    category: 'idea',
    title: 'Cho Designer xem KPI cá nhân ngay trên Dashboard',
    body: 'Hiện tại tab Analytics chỉ Leader xem được. Designer muốn biết tháng này mình hoàn thành bao nhiêu task, avg revision của mình bao nhiêu — để tự cải thiện. Đề xuất: 1 widget nhỏ "KPI của tôi" trên Dashboard cho role Designer.',
    author: 'Phạm Văn C',
    role: 'designer',
    status: 'reviewing',
    createdAt: '2026-05-03T08:15:00Z',
    replies: [
      {
        id: 'r4', author: 'Nguyễn Quốc', role: 'leader',
        body: 'Idea hay. Chị suy nghĩ thêm về privacy — đang thảo luận với team. Sẽ update trong tuần.',
        createdAt: '2026-05-03T17:00:00Z',
      },
    ],
  },
  {
    id: 'fb-5',
    category: 'brief',
    title: 'Color picker tối đa 5 màu là quá ít cho infographic',
    body: 'Brief infographic Q1 cần 7-8 màu chính. Form chỉ cho chọn 5. Phải note thêm trong brief text. Đề xuất nâng lên 8.',
    author: 'Trần Thị B',
    role: 'designer',
    relatedOrder: 'ND-20260403-0003',
    status: 'wontfix',
    createdAt: '2026-04-28T11:00:00Z',
    resolvedAt: '2026-04-29T09:00:00Z',
    resolutionNote: 'Tạm chưa làm. Lý do: 5 màu là chuẩn brand consistency. Nếu vượt 5 → để Designer ghi chú trong Brief text. Sẽ review lại sau Q3.',
    replies: [
      {
        id: 'r5', author: 'Nguyễn Quốc', role: 'leader',
        body: 'Chị hiểu pain. Nhưng giới hạn 5 là intentional — ép kỷ luật màu sắc. Trước mắt em ghi chú trong Brief, chị review tổng thể sau Q3.',
        createdAt: '2026-04-29T09:00:00Z',
      },
    ],
  },
  {
    id: 'fb-6',
    category: 'bug',
    title: 'Modal "+ Tạo order" bị clip ở mobile dưới 380px',
    body: 'Trên iPhone SE, mở modal tạo order → header bị che một phần, không thấy được nút "Tiếp theo". Phải xoay ngang.',
    author: 'Đỗ Phương Thảo',
    role: 'orderer',
    team: 'Content',
    status: 'open',
    createdAt: '2026-05-06T20:10:00Z',
    replies: [],
  },
  {
    id: 'fb-7',
    category: 'idea',
    title: 'AI Moodboard nên có nút "Lưu vào thư viện" để tái sử dụng',
    body: 'Generate ra 1 moodboard tốt rồi nhưng order khác có style tương tự muốn dùng lại. Hiện phải nhập lại từ đầu. Đề xuất: lưu moodboard vào "thư viện cá nhân" để pick lại.',
    author: 'Phạm Lan Anh',
    role: 'orderer',
    team: 'Admin Nhile',
    status: 'reviewing',
    createdAt: '2026-05-05T13:30:00Z',
    replies: [],
  },
  {
    id: 'fb-8',
    category: 'process',
    title: 'Cờ đỏ no_checkin_5d nên có cảnh báo trước 1 ngày',
    body: 'Hôm nay mới biết cờ đỏ trong sáng, lúc check Dashboard. Nếu hệ thống cảnh báo "Bạn chưa check-in 4 ngày" → có thời gian react trước khi bị flag.',
    author: 'Lê Văn A',
    role: 'designer',
    status: 'resolved',
    createdAt: '2026-04-30T10:00:00Z',
    resolvedAt: '2026-05-02T15:00:00Z',
    resolutionNote: 'Đã thêm notification "warning at 4 days" — bạn sẽ nhận thông báo cảnh báo 1 ngày trước khi cờ đỏ kích hoạt.',
    replies: [
      {
        id: 'r6', author: 'Nguyễn Quốc', role: 'leader',
        body: 'Đúng. Đã thêm soft-warning vào hệ thống notification. Live tuần sau.',
        createdAt: '2026-05-02T15:00:00Z',
      },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function avatarColor(name: string): string {
  const COLORS = ['#2563EB', '#16A34A', '#EA580C', '#E11D48', '#7C3AED', '#0D9488', '#D97706']
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffff
  return COLORS[Math.abs(h) % COLORS.length]
}

export function timeAgo(iso: string): string {
  const now = new Date('2026-05-07T00:00:00Z').getTime()
  const t = new Date(iso).getTime()
  const diff = Math.max(0, now - t)
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} phút trước`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} giờ trước`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days} ngày trước`
  return new Date(iso).toLocaleDateString('vi-VN')
}

export function daysOpen(iso: string): number {
  const now = new Date('2026-05-07T00:00:00Z').getTime()
  const t = new Date(iso).getTime()
  return Math.floor((now - t) / 86400000)
}
