import { useMemo } from 'react'
import { useMonthlyData, useCategories } from '@/hooks'
import { Card, Skeleton } from '@/components/ui'
import { AreaChart, BarChart, PieChart } from '@/components/charts'
import { formatCurrency } from '@/utils'
import type { MonthlyData } from '@/types'

type ChartPoint = Record<string, string | number>

function toChartPoints(data: MonthlyData[]): ChartPoint[] {
  return data as unknown as ChartPoint[]
}

export default function ReportsPage() {
  const { data: monthly = [], isLoading: loadingM } = useMonthlyData()
  const { data: categories = [], isLoading: loadingC } = useCategories()

  const pieData = useMemo(
    () => categories.filter(c => c.tipo === 'saida').map(c => ({ name: c.nome, value: c.gasto, color: c.cor })),
    [categories]
  )

  const topExpenseCategories = useMemo(
    () => [...categories].filter(c => c.tipo === 'saida').sort((a, b) => b.gasto - a.gasto).slice(0, 6),
    [categories]
  )

  const maxGasto = useMemo(
    () => categories.filter(c => c.tipo === 'saida').reduce((m, c) => Math.max(m, c.gasto), 0),
    [categories]
  )

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Relatórios Financeiros</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-[var(--text-primary)] font-semibold mb-4">Evolução Mensal (12 meses)</h2>
          {loadingM ? (
            <Skeleton variant="chart" />
          ) : (
            <AreaChart
              data={toChartPoints(monthly)}
              xKey="mes"
              series={[
                { key: 'receita', label: 'Receita', color: '#3B82F6' },
                { key: 'despesa', label: 'Despesa', color: '#8B5CF6' },
                { key: 'lucro', label: 'Lucro', color: '#10B981' },
              ]}
              height={260}
            />
          )}
        </Card>

        <Card>
          <h2 className="text-[var(--text-primary)] font-semibold mb-4">Distribuição de Gastos</h2>
          {loadingC ? <Skeleton variant="chart" /> : <PieChart data={pieData} height={260} />}
        </Card>

        <Card>
          <h2 className="text-[var(--text-primary)] font-semibold mb-4">Comparativo Receita vs Despesa</h2>
          {loadingM ? (
            <Skeleton variant="chart" />
          ) : (
            <BarChart
              data={toChartPoints(monthly.slice(-6))}
              xKey="mes"
              series={[
                { key: 'receita', label: 'Receita', color: '#3B82F6' },
                { key: 'despesa', label: 'Despesa', color: '#EF4444' },
              ]}
              currency
              height={260}
            />
          )}
        </Card>

        <Card>
          <h2 className="text-[var(--text-primary)] font-semibold mb-4">Top Categorias de Gasto</h2>
          {loadingC ? (
            <Skeleton variant="chart" />
          ) : (
            <div className="space-y-3">
              {topExpenseCategories.map((cat, i) => {
                const pct = maxGasto > 0 ? Math.round((cat.gasto / maxGasto) * 100) : 0
                return (
                  <div key={cat.id} className="flex items-center gap-3">
                    <span className="w-4 text-center text-xs text-[var(--text-muted)]">{i + 1}</span>
                    <span>{cat.icone}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-[var(--text-primary)] text-xs">{cat.nome}</span>
                        <span className="text-[var(--text-muted)] text-xs">{formatCurrency(cat.gasto)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: cat.cor }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
