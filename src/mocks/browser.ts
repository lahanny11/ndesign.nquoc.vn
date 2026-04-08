import { setupWorker } from 'msw/browser'
import { metaHandlers } from './handlers/meta'
import { dashboardHandlers } from './handlers/dashboard'
import { orderHandlers } from './handlers/orders'

export const worker = setupWorker(...metaHandlers, ...dashboardHandlers, ...orderHandlers)
