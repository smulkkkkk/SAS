import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Skeleton } from '@/components/ui/Skeleton'

const DashboardPage         = lazy(() => import('@/pages/dashboard/DashboardPage'))
const CashflowPage          = lazy(() => import('@/pages/financial/CashflowPage'))
const PayablesPage          = lazy(() => import('@/pages/financial/PayablesPage'))
const CategoriesPage        = lazy(() => import('@/pages/financial/CategoriesPage'))
const ReportsPage           = lazy(() => import('@/pages/financial/ReportsPage'))
const HealthPage            = lazy(() => import('@/pages/financial/HealthPage'))
const DayPage               = lazy(() => import('@/pages/scheduling/DayPage'))
const WeekPage              = lazy(() => import('@/pages/scheduling/WeekPage'))
const MonthPage             = lazy(() => import('@/pages/scheduling/MonthPage'))
const StatsPage             = lazy(() => import('@/pages/scheduling/StatsPage'))
const ClientsPage           = lazy(() => import('@/pages/crm/ClientsPage'))
const ClientDetailPage      = lazy(() => import('@/pages/crm/ClientDetailPage'))
const PipelinePage          = lazy(() => import('@/pages/crm/PipelinePage'))
const AnalyticsPage         = lazy(() => import('@/pages/analytics/AnalyticsPage'))
const ProfilePage           = lazy(() => import('@/pages/settings/ProfilePage'))
const TeamPage              = lazy(() => import('@/pages/settings/TeamPage'))
const IntegrationsPage      = lazy(() => import('@/pages/settings/IntegrationsPage'))
const BillingPage           = lazy(() => import('@/pages/settings/BillingPage'))

function PageLoader() {
  return <div className="p-8"><Skeleton variant="page" /></div>
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="financial">
            <Route index element={<Navigate to="cashflow" replace />} />
            <Route path="cashflow"   element={<CashflowPage />} />
            <Route path="payables"   element={<PayablesPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="reports"    element={<ReportsPage />} />
            <Route path="health"     element={<HealthPage />} />
          </Route>
          <Route path="scheduling">
            <Route index element={<Navigate to="day" replace />} />
            <Route path="day"   element={<DayPage />} />
            <Route path="week"  element={<WeekPage />} />
            <Route path="month" element={<MonthPage />} />
            <Route path="stats" element={<StatsPage />} />
          </Route>
          <Route path="crm">
            <Route index element={<Navigate to="clients" replace />} />
            <Route path="clients"      element={<ClientsPage />} />
            <Route path="clients/:id"  element={<ClientDetailPage />} />
            <Route path="pipeline"     element={<PipelinePage />} />
          </Route>
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings">
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile"      element={<ProfilePage />} />
            <Route path="team"         element={<TeamPage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="billing"      element={<BillingPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}
