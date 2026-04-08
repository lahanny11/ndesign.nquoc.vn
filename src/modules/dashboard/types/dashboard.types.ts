export type OrderStatus = 'pending' | 'assigned' | 'in_progress' | 'delivered' | 'feedback' | 'done'
export type FlagType = 'warn' | 'red' | null

export interface OrderCard {
  id: string
  order_number: string
  task_name: string
  status: OrderStatus
  deadline: string
  is_urgent: boolean
  is_overdue: boolean
  has_warn_flag: boolean
  has_red_flag: boolean
  revision_rounds: number
  team_name: string
  orderer_name: string
  orderer_avatar: string | null
  designer_name: string | null
  designer_avatar: string | null
  product_type_name: string
  product_size_name: string
  created_at: string
  done_at: string | null
  progress: number        // 1-7
}

export interface DashboardStats {
  total_orders: number
  in_progress_count: number
  done_count: number
  urgent_count: number
  active_red_flag_orders: number
  active_warn_flag_orders: number
  pending_assignment: number
}

export type FilterTab = 'all' | 'pending' | 'active' | 'done' | 'flag'
