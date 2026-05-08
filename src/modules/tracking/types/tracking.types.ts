import type { Delivery } from './delivery.types'
export type { Delivery }

export type StepState = 'done' | 'active' | 'flagged' | 'pending'

export interface CheckItem {
  ok: boolean | null
  text: string
}

export interface TimelineStep {
  id: string
  name: string
  state: StepState
  time: string
  timeClass?: 'late' | 'early'
  desc: string
  checks: CheckItem[]
  actions?: string[]
}

export interface OrderMetrics {
  rounds: number
  ontime: string
  comms: number
  briefCheck: boolean
}

// ─── Performance insights — đo hiệu quả Designer ↔ Orderer ──────────────────
export interface DesignerScorecard {
  name: string | null
  initial: string
  grade: 'A' | 'B' | 'C' | null
  response_avg_hours: number      // avg thời gian phản hồi Orderer
  checkin_compliance: number      // % check-in đúng hạn (5d)
  revision_avg: number            // avg revision per task (last 30d)
  ontime_rate: number             // % giao đúng hạn
  tasks_done_30d: number          // throughput 30 ngày qua
}

export interface OrdererScorecard {
  name: string
  team: string
  brief_quality_score: number     // 0–100
  response_avg_hours: number      // avg thời gian feedback
  revision_avg: number            // avg revision per task của Orderer này
  brief_returned: number          // số lần brief bị trả về để hỏi thêm
}

export interface TimingRow {
  label: string                    // 'Order → Assign' / 'Assign → Bắt đầu'
  duration_hours: number
  sla_hours: number
  status: 'under' | 'on_track' | 'over'
}

export interface ActivityEvent {
  timestamp: string                // ISO
  actor: string
  actor_role: 'designer' | 'orderer' | 'leader' | 'system'
  action: string
  note?: string
}

export interface PerformanceInsights {
  designer: DesignerScorecard
  orderer: OrdererScorecard
  timing: TimingRow[]
  activity: ActivityEvent[]
}

export interface OrderDetail {
  id: string
  title: string
  type: string
  team: string
  designer: string | null
  deadline: string
  status: string
  flag: 'red' | 'warn' | null
  metrics: OrderMetrics
  redFlags?: string[]
  steps: TimelineStep[]
  deliveries?: Delivery[]
  insights?: PerformanceInsights   // mới: chi tiết hiệu suất
}
