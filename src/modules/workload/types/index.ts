// src/modules/workload/types/index.ts
import type { MemberStatus } from '@modules/designers/types'

export interface WorkloadDesigner {
  person_id: string
  full_name: string
  member_status: MemberStatus
  is_blocked: boolean
  active_task_count: number
  pending_task_count: number
  done_this_week: number
  avg_revision: number
  on_leave?: {
    start_date: string
    end_date: string
    reason: string
    handover_to_id: string
    handover_status: string
  }
}
