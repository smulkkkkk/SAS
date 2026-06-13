import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/utils'

interface DataPoint { [key: string]: string | number }
interface Series { key: string; label: string; color: string }

interface Props {
  data: DataPoint[]
  series: Series[]
  xKey: string
  currency?: boolean
  height?: number
  stacked?: boolean
}

function CustomTooltip({ active, payload, label, currency }: { active?: boolean; payload?: Array<{color: string; name: string; value: number}>; label?: string; currency?: boolean }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--bg-elevated)] border border-white/10 rounded-xl px-4 py-3 shadow-card">
      <p className="text-[var(--text-muted)] text-xs mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-medium" style={{ color: p.color }}>
          {p.name}: {currency ? formatCurrency(p.value) : p.value.toLocaleString('pt-BR')}
        </p>
      ))}
    </div>
  )
}

export function BarChart({ data, series, xKey, currency = false, height = 240, stacked }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey={xKey} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => {
          if (!currency) return String(v)
          return v >= 1000 ? `R$${(v/1000).toFixed(0)}k` : `R$${v}`
        }} />
        <Tooltip content={<CustomTooltip currency={currency} />} />
        <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[4, 4, 0, 0]} stackId={stacked ? 'stack' : undefined} />
        ))}
      </ReBarChart>
    </ResponsiveContainer>
  )
}
