import { http, HttpResponse } from 'msw'
import type { AnalyticsData } from '../../modules/analytics/types/analytics.types'

const BASE = 'http://localhost:3000'

function buildData(period: string): AnalyticsData {
  const scale = period === 'today' ? 0.3 : period === 'week' ? 0.65 : 1

  const totalInProgress = Math.round(8 * scale) || 3
  const soonLate = Math.round(2 * scale) || 1
  const late = period === 'today' ? 0 : Math.round(1 * scale) || 1

  return {
    period,
    total_in_progress: totalInProgress,
    soon_late_count: soonLate,
    late_count: late,
    sla_rate: period === 'today' ? 95 : period === 'week' ? 88.5 : 87.5,
    done_count: Math.round(12 * scale) || 4,
    new_tasks_count: Math.round(15 * scale) || 5,
    tasks_by_priority: {
      HIGH: Math.round(3 * scale) || 1,
      MEDIUM: Math.round(8 * scale) || 3,
      LOW: Math.round(4 * scale) || 1,
    },
    late_tasks: period === 'today'
      ? []
      : [
          { id: '3', task_name: 'Slide bài giảng tháng 4', designer: 'Trần Thị B', days_late: 3, priority: 'HIGH' },
        ],
    soon_late_tasks: [
      { id: '6', task_name: 'Thumbnail Youtube Series mới', designer: 'Chưa assign', days_remaining: 1, priority: 'HIGH' },
      { id: '1', task_name: 'Banner Mạng xã hội Xuân 2025', designer: 'Lê Văn A', days_remaining: 2, priority: 'MEDIUM' },
    ],
    high_priority_pending: [
      { id: '6', task_name: 'Thumbnail Youtube Series mới', days_pending: 3, step: 'Chờ assign' },
    ],
    avg_revision_rounds: period === 'today' ? 1.0 : period === 'week' ? 1.2 : 1.4,
    tasks_over_2_revisions: period === 'today' ? 0 : Math.round(3 * scale) || 1,
    qa_pass_rate_first_time: period === 'today' ? 80 : period === 'week' ? 72 : 68,
    revision_by_designer: [
      { name: 'Lê Văn A',   avg_revisions: 1.1, task_count: Math.round(12 * scale) || 4, done_count: Math.round(10 * scale) || 3 },
      { name: 'Trần Thị B', avg_revisions: 2.1, task_count: Math.round(9 * scale)  || 3, done_count: Math.round(7 * scale)  || 2 },
      { name: 'Nguyễn C',   avg_revisions: 1.3, task_count: Math.round(7 * scale)  || 2, done_count: Math.round(6 * scale)  || 2 },
    ],
    tasks_brief_returned: period === 'today' ? 0 : Math.round(2 * scale) || 1,
    revision_by_team: [
      { team: 'Social Content', avg_revisions: 2.2, task_count: Math.round(8 * scale) || 3 },
      { team: 'Edit',           avg_revisions: 1.9, task_count: Math.round(5 * scale) || 2 },
      { team: 'Academy',        avg_revisions: 1.5, task_count: Math.round(6 * scale) || 2 },
      { team: 'Admin',          avg_revisions: 0.9, task_count: Math.round(9 * scale) || 3 },
      { team: 'HR',             avg_revisions: 0.8, task_count: Math.round(4 * scale) || 1 },
      { team: 'IT',             avg_revisions: 1.1, task_count: Math.round(3 * scale) || 1 },
    ],
    done_by_designer_monthly: [
      {
        name: 'Lê Văn A',
        months: [
          { month: 'T11', count: 18 },
          { month: 'T12', count: 22 },
          { month: 'T1',  count: 19 },
          { month: 'T2',  count: 24 },
          { month: 'T3',  count: 21 },
          { month: 'T4',  count: 12 },
        ],
      },
      {
        name: 'Trần Thị B',
        months: [
          { month: 'T11', count: 14 },
          { month: 'T12', count: 17 },
          { month: 'T1',  count: 15 },
          { month: 'T2',  count: 13 },
          { month: 'T3',  count: 16 },
          { month: 'T4',  count: 9  },
        ],
      },
      {
        name: 'Nguyễn C',
        months: [
          { month: 'T11', count: 10 },
          { month: 'T12', count: 12 },
          { month: 'T1',  count: 14 },
          { month: 'T2',  count: 15 },
          { month: 'T3',  count: 18 },
          { month: 'T4',  count: 8  },
        ],
      },
    ],
    tasks_by_type: [
      { type: 'Post/Feed',   count: Math.round(45 * scale) || 14, percentage: 38 },
      { type: 'Banner',      count: Math.round(28 * scale) || 9,  percentage: 24 },
      { type: 'Carousel',    count: Math.round(22 * scale) || 7,  percentage: 19 },
      { type: 'Story/Reels', count: Math.round(15 * scale) || 5,  percentage: 13 },
      { type: 'Print/Khác',  count: Math.round(7  * scale) || 2,  percentage: 6  },
    ],
    alerts: [
      ...(period !== 'today'
        ? [{ type: 'red'  as const, message: `SLA Rate: ${period === 'week' ? '88.5' : '87.5'}% — dưới mục tiêu 90%` }]
        : []
      ),
      { type: 'warn' as const, message: '2 task sắp trễ deadline — cần xử lý hôm nay' },
      ...(period !== 'today'
        ? [{ type: 'warn' as const, message: '1 task HIGH pending > 2 ngày chưa assign' }]
        : []
      ),
    ],
  }
}

export const analyticsHandlers = [
  http.get(`${BASE}/api/v1/analytics`, ({ request }) => {
    const url = new URL(request.url)
    const period = url.searchParams.get('period') ?? 'month'
    const data = buildData(period)
    return HttpResponse.json(data)
  }),
]
