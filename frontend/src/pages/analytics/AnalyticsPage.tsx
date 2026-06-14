import { useMonthlyData, useClients, useAppointments } from '@/hooks'
import { Card, Skeleton } from '@/components/ui'
import { AreaChart, BarChart, PieChart } from '@/components/charts'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/utils'

export default function AnalyticsPage() {
  const { data: monthly = [], isLoading: loadingM } = useMonthlyData()
  const { data: clients = [] } = useClients()
  const { data: appointments = [] } = useAppointments()

  const statusDist = (['VIP','Ativo','Prospect','Inativo'] as const).map(s => ({
    name: s,
    value: clients.filter(c => c.status === s).length,
    color: s === 'VIP' ? '#10B981' : s === 'Ativo' ? '#3B82F6' : s === 'Prospect' ? '#F59E0B' : '#94A3B8'
  }))

  const meses = monthly.slice(-6)

  const insights = [
    monthly.length >= 2 && monthly[monthly.length-1].receita > monthly[monthly.length-2].receita &&
      `📈 Receita cresceu ${(((monthly[monthly.length-1].receita / monthly[monthly.length-2].receita) - 1) * 100).toFixed(0)}% vs mês passado`,
    clients.filter(c => c.status === 'VIP').length > 0 &&
      `⭐ ${clients.filter(c => c.status === 'VIP').length} clientes VIP representam sua base mais valiosa`,
    appointments.length > 0 &&
      `📅 ${appointments.length} agendamentos registrados no sistema`,
    clients.length > 0 &&
      `👥 ${clients.length} clientes cadastrados — ticket médio ${formatCurrency(clients.reduce((s,c) => s + c.totalGasto, 0) / clients.length)}`,
  ].filter(Boolean) as string[]

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Analytics</h1>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-[var(--text-primary)] text-sm">{insight}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-[var(--text-primary)] font-semibold mb-4">Tendência Financeira</h2>
          {loadingM ? <Skeleton variant="chart" /> : (
            <AreaChart data={meses as unknown as Array<Record<string, string | number>>} xKey="mes" series={[
              { key: 'receita', label: 'Receita', color: '#3B82F6' },
              { key: 'lucro', label: 'Lucro', color: '#10B981' },
            ]} height={220} />
          )}
        </Card>

        <Card>
          <h2 className="text-[var(--text-primary)] font-semibold mb-4">Segmentação de Clientes</h2>
          <PieChart data={statusDist} currency={false} height={220} innerRadius={50} />
        </Card>

        <Card>
          <h2 className="text-[var(--text-primary)] font-semibold mb-4">Lucro por Mês</h2>
          {loadingM ? <Skeleton variant="chart" /> : (
            <BarChart data={monthly.slice(-6) as unknown as Array<Record<string, string | number>>} xKey="mes" series={[{ key: 'lucro', label: 'Lucro', color: '#10B981' }]} currency height={220} />
          )}
        </Card>

        <Card>
          <h2 className="text-[var(--text-primary)] font-semibold mb-4">Metas do Mês</h2>
          <div className="space-y-4">
            {[
              { label: 'Receita', current: monthly.slice(-1)[0]?.receita ?? 0, meta: 60000, color: '#3B82F6' },
              { label: 'Novos Clientes', current: 8, meta: 15, color: '#8B5CF6' },
              { label: 'Agendamentos', current: appointments.length, meta: 120, color: '#10B981' },
            ].map(m => {
              const pct = Math.min(100, Math.round((m.current / m.meta) * 100))
              return (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--text-muted)]">{m.label}</span>
                    <span className="text-[var(--text-primary)]">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full" style={{ backgroundColor: m.color }} />
                  </div>
                  <p className="text-[var(--text-muted)] text-[10px] mt-0.5">
                    {typeof m.current === 'number' && m.label === 'Receita' ? formatCurrency(m.current) : m.current} de {m.label === 'Receita' ? formatCurrency(m.meta) : m.meta}
                  </p>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
