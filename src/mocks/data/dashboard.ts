// src/mocks/data/dashboard.ts
import { MOCK_PERSONS_IDS } from './persons'

// Tổng hợp từ 20 mock orders trong store.ts (today: 2026-05-08)
//   - 7 done trong tháng 4-5
//   - 11 đang chạy (pending/assigned/in_progress/delivered/feedback)
//   - 2 task có cờ (1 đỏ ND-...0003, 1 vàng ND-...0006 + ND-...0019)
//   - 3 task pending chưa assign

// Schema khớp với DashboardStats type:
//   total_orders, in_progress_count, done_count, urgent_count,
//   active_red_flag_orders, active_warn_flag_orders, pending_assignment,
//   avg_revision_rounds
const STATS = {
  total_orders: 20,
  in_progress_count: 11,
  done_count: 7,
  urgent_count: 3,
  active_red_flag_orders: 1,
  active_warn_flag_orders: 2,
  pending_assignment: 3,
  avg_revision_rounds: 1.4,
}

export const MOCK_DASHBOARD_STATS: Record<string, typeof STATS> = {
  [MOCK_PERSONS_IDS.design_leader]: STATS,
  [MOCK_PERSONS_IDS.co_leader]:     STATS,
}

// Schema khớp với DesignerWorkload type trong dashboard.types.ts:
//   { id, name, active_tasks, pending_tasks, done_this_week, avg_revisions,
//     has_blocked, leave: LeaveInfo | null, member_status, joined_at, training_note }
export const MOCK_WORKLOAD = [
  {
    id: 'u-de-1', name: 'Lê Văn A',
    active_tasks: 5, pending_tasks: 0, done_this_week: 2,
    avg_revisions: 0.8, has_blocked: false,
    leave: null, member_status: 'regular',
    joined_at: '2025-06-01', training_note: null,
  },
  {
    id: 'u-de-2', name: 'Trần Thị B',
    active_tasks: 4, pending_tasks: 0, done_this_week: 1,
    avg_revisions: 2.3, has_blocked: true,         // có 1 order red flag
    leave: null, member_status: 'regular',
    joined_at: '2025-03-15', training_note: null,
  },
  {
    id: 'u-de-3', name: 'Phạm Văn C',
    active_tasks: 3, pending_tasks: 0, done_this_week: 1,
    avg_revisions: 1.0, has_blocked: false,
    leave: null, member_status: 'regular',
    joined_at: '2025-08-10', training_note: null,
  },
  {
    id: 'u-de-4', name: 'Nguyễn Thị D',
    active_tasks: 1, pending_tasks: 0, done_this_week: 1,
    avg_revisions: 0.5, has_blocked: false,
    leave: null, member_status: 'regular',
    joined_at: '2026-01-12', training_note: null,
  },
  {
    id: 'u-de-5', name: 'Hoàng E',
    active_tasks: 0, pending_tasks: 0, done_this_week: 0,
    avg_revisions: 1.5, has_blocked: false,
    leave: null, member_status: 'new',
    joined_at: '2026-04-15',
    training_note: 'Vừa hoàn thành training 30/4. Cần quan sát kỹ 2 task đầu tiên. Điểm mạnh: typography. Cần cải thiện: tốc độ phản hồi feedback.',
  },
]
