import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HeroScene } from '@/components/three'
import { DataCube3D } from '@/components/three'
import { Globe3D } from '@/components/three'
import { RealtimeChart } from '@/components/charts'
import { AreaChart } from '@/components/charts'
import { KPICard, Card, Skeleton } from '@/components/ui'
import { useFinancialSummary, useMonthlyData, useRealTimeChart, useAppointments } from '@/hooks'
import { ActivityFeed } from './ActivityFeed'
import { AlertsWidget } from './AlertsWidget'
import { MiniCalendar } from './MiniCalendar'
import { toISODate } from '@/utils'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function DashboardPage() {
  const [heroShown, setHeroShown] = useState(() => !sessionStorage.getItem('hero-shown'))
  const { data: summary, isLoading: loadingSummary } = useFinancialSummary()
  const { data: monthly = [] } = useMonthlyData()
  const { data: appointments = [] } = useAppointments()
  const { data: chartData, trend: trendRaw, delta, currentValue } = useRealTimeChart()
  const trend = trendRaw === 'up' ? 'up' : 'down'

  useEffect(() => {
    if (!heroShown) return
    sessionStorage.setItem('hero-shown', '1')
  }, [heroShown])

  const today = toISODate(new Date())
  const todayAppts = appointments.filter(a => a.data === today)

  const kpis = [
    { title: 'Receita do Mês', value: summary?.receita ?? 0, prev: monthly.slice(-2)[0]?.receita, color: 'blue' as const },
    { title: 'Despesas', value: summary?.despesa ?? 0, prev: monthly.slice(-2)[0]?.despesa, color: 'purple' as const },
    { title: 'Lucro Líquido', value: summary?.lucro ?? 0, prev: monthly.slice(-2)[0]?.lucro, color: 'green' as const },
    { title: 'Fluxo de Caixa', value: summary?.fluxoCaixa ?? 0, color: 'yellow' as const },
  ]

  return (
    <>
      {heroShown && <HeroScene onComplete={() => setHeroShown(false)} />}

      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-[var(--text-muted)] text-sm">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
          </p>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mt-1">
            Bom dia, Admin
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
          {/* Main content */}
          <div className="space-y-6">
            {/* Cube + KPIs */}
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-center">
              <div className="flex justify-center">
                <DataCube3D />
              </div>
              <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-4">
                {kpis.map((kpi) => (
                  <motion.div key={kpi.title} variants={item}>
                    {loadingSummary ? <Skeleton variant="card" /> : (
                      <KPICard
                        title={kpi.title}
                        value={kpi.value}
                        previousValue={kpi.prev}
                        color={kpi.color}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Quick stats row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Contas hoje', value: summary?.contasVencendoHoje ?? 0 },
                { label: 'Agendamentos hoje', value: todayAppts.length },
                { label: 'Ticket médio', value: summary?.ticketMedio ?? 0 },
              ].map((s) => (
                <Card key={s.label} className="flex items-center gap-3">
                  <div>
                    <p className="text-[var(--text-primary)] font-bold text-lg tabular-nums">{s.value}</p>
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest">{s.label}</p>
                  </div>
                </Card>
              ))}
            </motion.div>

            {/* Real-time chart */}
            <Card>
              <RealtimeChart data={chartData} trend={trend} delta={delta} currentValue={currentValue} />
            </Card>

            {/* Revenue vs Expenses */}
            <Card>
              <h2 className="text-[var(--text-primary)] font-semibold mb-4">Receitas vs Despesas</h2>
              <AreaChart
                data={monthly as unknown as Array<{ [key: string]: string | number }>}
                xKey="mes"
                series={[
                  { key: 'receita', label: 'Receita', color: '#3B82F6' },
                  { key: 'despesa', label: 'Despesa', color: '#8B5CF6' },
                ]}
              />
            </Card>

            {/* Activity */}
            <Card>
              <h2 className="text-[var(--text-primary)] font-semibold mb-4">Atividade Recente</h2>
              <ActivityFeed />
            </Card>
          </div>

          {/* Sidebar right */}
          <div className="space-y-4">
            {/* Globe */}
            <Card className="overflow-hidden">
              <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-2">Presença Global</h3>
              <div className="h-52">
                <Globe3D />
              </div>
            </Card>

            {/* Alerts */}
            <Card>
              <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-3">Alertas</h3>
              <AlertsWidget />
            </Card>

            {/* Calendar */}
            <Card>
              <MiniCalendar />
            </Card>

            {/* Today appointments */}
            <Card>
              <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-3">
                Hoje · {todayAppts.length} agendamentos
              </h3>
              {todayAppts.length === 0 ? (
                <p className="text-[var(--text-muted)] text-sm">Nenhum agendamento hoje</p>
              ) : (
                <div className="space-y-2">
                  {todayAppts.slice(0, 5).map((a) => (
                    <div key={a.id} className="flex items-center gap-2">
                      <span className="text-[var(--accent-blue)] text-xs font-mono w-10">{a.hora}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[var(--text-primary)] text-xs font-medium truncate">{a.nome}</p>
                        <p className="text-[var(--text-muted)] text-[10px] truncate">{a.servico}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
