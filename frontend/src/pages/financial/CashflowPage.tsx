import { useState, useMemo } from 'react'
import { useTransactions, useFinancialSummary } from '@/hooks'
import { Card, Badge, Skeleton, Button, DataTable } from '@/components/ui'
import { AreaChart } from '@/components/charts'
import { Timeline3D } from '@/components/three'
import { formatCurrency, formatDate } from '@/utils'
import type { Column } from '@/components/ui/DataTable'
import type { Transaction } from '@/types'

const PERIODS = ['7d', '30d', '90d', 'Tudo'] as const
type Period = typeof PERIODS[number]

function filterByPeriod(transactions: Transaction[], period: Period): Transaction[] {
  if (period === 'Tudo') return transactions
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const cutoff = new Date(Date.now() - days * 86400000).toISOString().split('T')[0]
  return transactions.filter(t => t.data >= cutoff)
}

type TRow = Record<string, unknown> & Transaction

const columns: Column<TRow>[] = [
  { key: 'data', label: 'Data', sortable: true, render: (r) => formatDate(r.data as string) },
  { key: 'descricao', label: 'Descrição', sortable: true },
  { key: 'categoria', label: 'Categoria', sortable: true },
  {
    key: 'tipo', label: 'Tipo',
    render: (r) => (
      <Badge variant={r.tipo === 'entrada' ? 'success' : 'error'}>{String(r.tipo)}</Badge>
    ),
  },
  {
    key: 'valor', label: 'Valor', sortable: true,
    render: (r) => (
      <span className={r.tipo === 'entrada' ? 'text-[var(--status-success)]' : 'text-[var(--status-error)]'}>
        {r.tipo === 'entrada' ? '+' : '-'}{formatCurrency(r.valor as number)}
      </span>
    ),
  },
  {
    key: 'status', label: 'Status',
    render: (r) => {
      const v: Record<string, 'success' | 'warning'> = { pago: 'success', pendente: 'warning', vencido: 'warning' }
      return <Badge variant={v[String(r.status)] ?? 'default'}>{String(r.status)}</Badge>
    },
  },
]

export default function CashflowPage() {
  const [period, setPeriod] = useState<Period>('30d')
  const [view3D, setView3D] = useState(false)
  const { data: transactions = [], isLoading } = useTransactions()
  const { data: _summary } = useFinancialSummary()

  const filtered = useMemo(() => filterByPeriod(transactions, period), [transactions, period])
  const totalEntradas = filtered.filter(t => t.tipo === 'entrada').reduce((s, t) => s + t.valor, 0)
  const totalSaidas = filtered.filter(t => t.tipo === 'saida').reduce((s, t) => s + t.valor, 0)

  const chartData = useMemo(() => {
    const byDate: Record<string, { data: string; entrada: number; saida: number }> = {}
    filtered.forEach(t => {
      const key = t.data
      if (!byDate[key]) byDate[key] = { data: formatDate(t.data), entrada: 0, saida: 0 }
      byDate[key][t.tipo === 'entrada' ? 'entrada' : 'saida'] += t.valor
    })
    return Object.values(byDate).sort((a, b) => a.data.localeCompare(b.data)).slice(-30)
  }, [filtered])

  const tableData = filtered as unknown as TRow[]

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Fluxo de Caixa</h1>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">Entradas e saídas do período</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 rounded-xl p-1 gap-1">
            {PERIODS.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${period === p ? 'bg-[var(--accent-blue)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" onClick={() => setView3D(v => !v)}>
            {view3D ? '📊 2D' : '🌐 3D'}
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Entradas', value: totalEntradas, color: 'text-[var(--status-success)]', icon: '📈' },
          { label: 'Total Saídas', value: totalSaidas, color: 'text-[var(--status-error)]', icon: '📉' },
          {
            label: 'Saldo do Período',
            value: totalEntradas - totalSaidas,
            color: totalEntradas >= totalSaidas ? 'text-[var(--status-success)]' : 'text-[var(--status-error)]',
            icon: '⚖️',
          },
        ].map(s => (
          <Card key={s.label}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{s.icon}</span>
              <p className="text-[var(--text-muted)] text-sm">{s.label}</p>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{formatCurrency(s.value)}</p>
          </Card>
        ))}
      </div>

      {/* Chart or 3D */}
      <Card>
        {view3D ? (
          <>
            <h2 className="text-[var(--text-primary)] font-semibold mb-4">Timeline 3D de Transações</h2>
            <Timeline3D transactions={filtered} />
          </>
        ) : (
          <>
            <h2 className="text-[var(--text-primary)] font-semibold mb-4">Movimentação por Dia</h2>
            {isLoading ? (
              <Skeleton variant="chart" />
            ) : (
              <AreaChart
                data={chartData}
                xKey="data"
                series={[
                  { key: 'entrada', label: 'Entradas', color: '#10B981' },
                  { key: 'saida', label: 'Saídas', color: '#EF4444' },
                ]}
              />
            )}
          </>
        )}
      </Card>

      {/* Table */}
      <Card>
        <h2 className="text-[var(--text-primary)] font-semibold mb-4">Transações</h2>
        <DataTable
          data={tableData}
          columns={columns}
          loading={isLoading}
          searchable
          pageSize={12}
        />
      </Card>
    </div>
  )
}
