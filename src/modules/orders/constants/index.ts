// src/modules/orders/constants/index.ts
import type { OrderStatus } from '../types'

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending:   'Chờ nhận',
  assigned:  'Đã assign',
  active:    'Đang làm',
  delivered: 'Đã giao',
  feedback:  'Feedback',
  done:      'Hoàn thành',
}

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  pending:   '#8E8E93',
  assigned:  '#007AFF',
  active:    '#34C759',
  delivered: '#FF9500',
  feedback:  '#AF52DE',
  done:      '#30D158',
}

export const ORDER_STATUS_BG: Record<OrderStatus, string> = {
  pending:   'rgba(142,142,147,0.12)',
  assigned:  'rgba(0,122,255,0.10)',
  active:    'rgba(52,199,89,0.10)',
  delivered: 'rgba(255,149,0,0.10)',
  feedback:  'rgba(175,82,222,0.10)',
  done:      'rgba(48,209,88,0.10)',
}

export const PRIORITY_LABEL = {
  normal: 'Bình thường',
  high:   'Ưu tiên cao',
  urgent: 'Gấp',
} as const

/** Số task active tối đa cho designer */
export const DESIGNER_CAPACITY = 7
