// src/mocks/data/analytics.ts
// Mock data cho Analytics page — match shape AnalyticsData trong analytics.types.ts
// Date reference: 2026-05-08

const BASE_MONTH = {
  period: 'month',

  // Group 1 — Production
  total_in_progress: 11,
  soon_late_count: 3,
  late_count: 1,
  sla_rate: 88,
  done_count: 11,
  new_tasks_count: 14,
  tasks_by_priority: { HIGH: 4, MEDIUM: 12, LOW: 4 },
  late_tasks: [
    {
      id: '3',
      task_name: 'Infographic Báo cáo tài chính Q1/2026',
      designer: 'Trần Thị B',
      days_late: 6,
      priority: 'HIGH',
    },
  ],
  soon_late_tasks: [
    { id: '6',  task_name: 'Poster Workshop Design Thinking', designer: 'Chưa assign', days_remaining: 2, priority: 'HIGH'   },
    { id: '17', task_name: 'LinkedIn Post Senior Designer',   designer: 'Phạm Văn C',   days_remaining: 1, priority: 'HIGH'   },
    { id: '19', task_name: 'Báo cáo thường niên — Bìa & Layout', designer: 'Trần Thị B', days_remaining: 0, priority: 'MEDIUM' },
  ],
  high_priority_pending: [
    { id: '6',  task_name: 'Poster Workshop Design Thinking',          days_pending: 5, step: 'Chờ assign'  },
    { id: '17', task_name: 'LinkedIn Post — Tuyển dụng Senior Designer', days_pending: 1, step: 'Đã giao — chờ xác nhận' },
  ],

  // Group 2 — Quality
  avg_revision_rounds: 1.4,
  tasks_over_2_revisions: 2,
  qa_pass_rate_first_time: 64,
  revision_by_designer: [
    { name: 'Lê Văn A',     avg_revisions: 0.8, task_count: 7, done_count: 4 },
    { name: 'Trần Thị B',   avg_revisions: 2.3, task_count: 5, done_count: 2 },
    { name: 'Phạm Văn C',   avg_revisions: 1.0, task_count: 4, done_count: 2 },
    { name: 'Nguyễn Thị D', avg_revisions: 0.5, task_count: 2, done_count: 1 },
    { name: 'Hoàng E',      avg_revisions: 1.5, task_count: 1, done_count: 0 },
  ],

  // Group 3 — Brief Quality
  tasks_brief_returned: 3,
  revision_by_team: [
    { team: 'Admin Nhile', avg_revisions: 1.2, task_count: 4 },
    { team: 'Nedu',        avg_revisions: 1.0, task_count: 4 },
    { team: 'Edit',        avg_revisions: 1.5, task_count: 2 },
    { team: 'IT',          avg_revisions: 0.7, task_count: 3 },
    { team: 'Ms Nhi',      avg_revisions: 2.5, task_count: 2 },
    { team: 'Content',     avg_revisions: 0.5, task_count: 3 },
    { team: 'nlt',         avg_revisions: 1.0, task_count: 3 },
  ],
  done_by_designer_monthly: [
    {
      name: 'Lê Văn A',
      months: [
        { month: '2026-02', count: 6 },
        { month: '2026-03', count: 8 },
        { month: '2026-04', count: 5 },
        { month: '2026-05', count: 4 },
      ],
    },
    {
      name: 'Trần Thị B',
      months: [
        { month: '2026-02', count: 4 },
        { month: '2026-03', count: 5 },
        { month: '2026-04', count: 4 },
        { month: '2026-05', count: 2 },
      ],
    },
    {
      name: 'Phạm Văn C',
      months: [
        { month: '2026-02', count: 3 },
        { month: '2026-03', count: 4 },
        { month: '2026-04', count: 3 },
        { month: '2026-05', count: 2 },
      ],
    },
    {
      name: 'Nguyễn Thị D',
      months: [
        { month: '2026-02', count: 2 },
        { month: '2026-03', count: 3 },
        { month: '2026-04', count: 2 },
        { month: '2026-05', count: 1 },
      ],
    },
  ],
  tasks_by_type: [
    { type: 'Social Media', count: 8, percentage: 40 },
    { type: 'Print',        count: 5, percentage: 25 },
    { type: 'YouTube',      count: 3, percentage: 15 },
    { type: 'LinkedIn',     count: 2, percentage: 10 },
    { type: 'Email',        count: 1, percentage: 5  },
    { type: 'Custom',       count: 1, percentage: 5  },
  ],

  alerts: [
    { type: 'red',  message: '1 task quá hạn: ND-20260418-0003 (Infographic Q1) đã trễ 6 ngày, đang vòng revise thứ 3.' },
    { type: 'warn', message: '2 task sắp đến hạn trong 2 ngày tới: ND-...0006 chưa assign, ND-...0017 chờ xác nhận.' },
  ],
} as const

const BASE_WEEK = {
  ...BASE_MONTH,
  period: 'week',
  total_in_progress: 9,
  soon_late_count: 3,
  late_count: 1,
  sla_rate: 86,
  done_count: 4,
  new_tasks_count: 6,
  tasks_by_priority: { HIGH: 3, MEDIUM: 5, LOW: 1 },
  avg_revision_rounds: 1.2,
  tasks_over_2_revisions: 1,
  qa_pass_rate_first_time: 67,
  tasks_brief_returned: 1,
  alerts: [
    { type: 'red', message: '1 task quá hạn: Infographic Q1 — đã trễ 6 ngày.' },
  ],
} as const

const BASE_TODAY = {
  ...BASE_MONTH,
  period: 'today',
  total_in_progress: 9,
  soon_late_count: 2,
  late_count: 1,
  sla_rate: 89,
  done_count: 0,
  new_tasks_count: 1,
  tasks_by_priority: { HIGH: 2, MEDIUM: 6, LOW: 1 },
  avg_revision_rounds: 1.0,
  tasks_over_2_revisions: 0,
  qa_pass_rate_first_time: 75,
  tasks_brief_returned: 0,
  late_tasks: [
    {
      id: '3',
      task_name: 'Infographic Báo cáo tài chính Q1/2026',
      designer: 'Trần Thị B',
      days_late: 6,
      priority: 'HIGH',
    },
  ],
  soon_late_tasks: [
    { id: '17', task_name: 'LinkedIn Post Senior Designer', designer: 'Phạm Văn C', days_remaining: 1, priority: 'HIGH'   },
    { id: '19', task_name: 'Báo cáo thường niên — Bìa & Layout', designer: 'Trần Thị B', days_remaining: 0, priority: 'MEDIUM' },
  ],
  alerts: [
    { type: 'red',  message: 'Hôm nay deadline 2 task: ND-...0019 (Báo cáo thường niên) — đang vòng revise thứ 2.' },
    { type: 'warn', message: 'Trần Thị B đang xử lý 3 task — workload vượt mức 2.5/người.' },
  ],
} as const

export const MOCK_ANALYTICS: Record<string, object> = {
  today:  BASE_TODAY,
  week:   BASE_WEEK,
  month:  BASE_MONTH,
  custom: BASE_MONTH,
}
