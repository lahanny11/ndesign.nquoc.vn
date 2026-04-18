// src/modules/flags/types/index.ts

export type FlagType = 'warn' | 'red'

export type FlagReason =
  | 'unassigned_24h'
  | 'no_brief_check'
  | 'no_checkin_5d'
  | 'revision_warn'
  | 'revision_red'
  | 'checklist_item_failed'
  | 'manual_escalation'

export interface Flag {
  id: string
  order_id: string
  flag_type: FlagType
  reason: FlagReason
  detail: string | null
  is_active: boolean
  triggered_by: { person_id: string; full_name: string } | null
  created_at: string
  resolved_at: string | null
  resolved_by: { person_id: string; full_name: string } | null
  resolution_note: string | null
}

export interface ResolveFlagPayload {
  resolution_note: string
}
