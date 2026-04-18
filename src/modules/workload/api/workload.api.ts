// src/modules/workload/api/workload.api.ts
import { api } from '@shared/config/api-client'
import type { WorkloadDesigner } from '../types'

export const workloadApi = {
  getWorkload: () => api.get<WorkloadDesigner[]>('/dashboard/workload'),
}
