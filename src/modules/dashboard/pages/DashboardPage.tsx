import { useState } from 'react'
import AppLayout from '../../../shared/layouts/AppLayout'
import StatCards from '../components/StatCards'
import AlertBanner from '../components/AlertBanner'
import FilterTabs from '../components/FilterTabs'
import OrderGrid from '../components/OrderGrid'
import TrackingPanel from '../../tracking/components/TrackingPanel'
import OrderFormModal from '../../order-form/components/OrderFormModal'
import { useDashboardStore } from '../stores/dashboard.store'
import { useOrders } from '../hooks/useOrders'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { useOrderDetail } from '../../tracking/hooks/useOrderDetail'

export default function DashboardPage() {
  const { activeTab, setActiveTab, panelOrderId, openPanel, closePanel } = useDashboardStore()
  const [formOpen, setFormOpen] = useState(false)

  const { data: ordersData, isLoading: ordersLoading } = useOrders(activeTab)
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: orderDetail } = useOrderDetail(panelOrderId)

  const orders = ordersData?.data ?? []
  const flaggedOrders = orders.filter(o => o.has_red_flag).map(o => o.task_name)

  return (
    <>
      <AppLayout onCreateOrder={() => setFormOpen(true)}>
        <div className="flex flex-col gap-3.5">
          <StatCards
            stats={stats ?? {
              total_orders: 0, in_progress_count: 0, done_count: 0,
              urgent_count: 0, active_red_flag_orders: 0,
              active_warn_flag_orders: 0, pending_assignment: 0,
            }}
            loading={statsLoading}
          />
          <AlertBanner flaggedOrders={flaggedOrders} />
          <FilterTabs
            active={activeTab}
            onChange={setActiveTab}
            total={ordersData?.meta.total ?? 0}
            flagCount={(stats?.active_red_flag_orders ?? 0) + (stats?.active_warn_flag_orders ?? 0)}
          />
          <OrderGrid orders={orders} loading={ordersLoading} onTrack={openPanel} />
        </div>
        <TrackingPanel order={orderDetail ?? null} open={!!panelOrderId} onClose={closePanel} />
      </AppLayout>

      <OrderFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </>
  )
}
