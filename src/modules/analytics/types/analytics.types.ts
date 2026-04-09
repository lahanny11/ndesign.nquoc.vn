export type AnalyticsPeriod = 'today' | 'week' | 'month' | 'custom'

export interface LateTask {
  id: string
  task_name: string
  designer: string
  days_late: number
  priority: string
}

export interface SoonLateTask {
  id: string
  task_name: string
  designer: string
  days_remaining: number
  priority: string
}

export interface HighPriorityTask {
  id: string
  task_name: string
  days_pending: number
  step: string
}

export interface DesignerMetric {
  name: string
  avg_revisions: number
  task_count: number
  done_count: number
}

export interface TeamMetric {
  team: string
  avg_revisions: number
  task_count: number
}

export interface MonthCount {
  month: string
  count: number
}

export interface DesignerMonthly {
  name: string
  months: MonthCount[]
}

export interface TaskTypeMetric {
  type: string
  count: number
  percentage: number
}

export interface AnalyticsAlert {
  type: 'red' | 'warn'
  message: string
}

export interface AnalyticsData {
  period: string

  // Group 1 — Production
  total_in_progress: number
  soon_late_count: number
  late_count: number
  sla_rate: number
  done_count: number
  new_tasks_count: number
  tasks_by_priority: {
    HIGH: number
    MEDIUM: number
    LOW: number
  }
  late_tasks: LateTask[]
  soon_late_tasks: SoonLateTask[]
  high_priority_pending: HighPriorityTask[]

  // Group 2 — Quality
  avg_revision_rounds: number
  tasks_over_2_revisions: number
  qa_pass_rate_first_time: number
  revision_by_designer: DesignerMetric[]

  // Group 3 — Brief Quality
  tasks_brief_returned: number
  revision_by_team: TeamMetric[]
  done_by_designer_monthly: DesignerMonthly[]
  tasks_by_type: TaskTypeMetric[]

  alerts: AnalyticsAlert[]
}
