// src/mocks/data/dashboard.ts
import { MOCK_PERSONS_IDS } from './persons'

// Tổng hợp từ 20 mock orders trong store.ts (today: 2026-05-08)
//   - 7 done trong tháng 4-5
//   - 11 đang chạy (pending/assigned/in_progress/delivered/feedback)
//   - 2 task có cờ (1 đỏ ND-...0003, 1 vàng ND-...0006 + ND-...0019)
//   - 3 task pending chưa assign

export const MOCK_DASHBOARD_STATS = {
  [MOCK_PERSONS_IDS.design_leader]: {
    total_orders: 20,
    active_orders: 11,
    done_this_month: 7,
    avg_revision: 1.4,
    pending_assignment: 3,
    active_red_flag_orders: 1,
    pending_order_names: [
      'Thumbnail YouTube Kinh doanh tập 12',
      'Poster Workshop Design Thinking',
      'Animation logo intro 5s',
    ],
    red_flag_order_names: ['Infographic Báo cáo tài chính Q1/2026'],
  },
  [MOCK_PERSONS_IDS.co_leader]: {
    total_orders: 20,
    active_orders: 11,
    done_this_month: 7,
    avg_revision: 1.4,
    pending_assignment: 3,
    active_red_flag_orders: 1,
    pending_order_names: [
      'Thumbnail YouTube Kinh doanh tập 12',
      'Poster Workshop Design Thinking',
    ],
    red_flag_order_names: ['Infographic Báo cáo tài chính Q1/2026'],
  },
}

export const MOCK_WORKLOAD = [
  {
    person_id: MOCK_PERSONS_IDS.designer_01,
    full_name: 'Lê Văn A',
    member_status: 'regular',
    is_blocked: false,
    active_task_count: 5,
    pending_task_count: 0,
    done_this_week: 2,
    avg_revision: 0.8,
  },
  {
    person_id: MOCK_PERSONS_IDS.designer_02,
    full_name: 'Trần Thị B',
    member_status: 'regular',
    is_blocked: true,           // đang nhiều task — block để load balance
    active_task_count: 4,
    pending_task_count: 0,
    done_this_week: 1,
    avg_revision: 2.3,
  },
  {
    person_id: 'g7h8i9j0-k1l2-3456-mabc-789012345678',
    full_name: 'Phạm Văn C',
    member_status: 'regular',
    is_blocked: false,
    active_task_count: 3,
    pending_task_count: 0,
    done_this_week: 1,
    avg_revision: 1.0,
  },
  {
    person_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    full_name: 'Nguyễn Thị D',
    member_status: 'regular',
    is_blocked: false,
    active_task_count: 1,
    pending_task_count: 0,
    done_this_week: 1,
    avg_revision: 0.5,
  },
  {
    person_id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    full_name: 'Hoàng E',
    member_status: 'new_member',
    is_blocked: false,
    active_task_count: 0,
    pending_task_count: 0,
    done_this_week: 0,
    avg_revision: 1.5,
  },
]
