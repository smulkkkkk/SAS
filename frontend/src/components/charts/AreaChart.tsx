import { AreaChart as ReAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/utils'

interface DataPoint { [key: string]: string | number }
interface Series { key: string; label: string; color: string }

interface Props {
  data: DataPoint[]
  series: Series[]
  xKey: string
  currency?: boolean
  height?: number
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

export function AreaChart({ data, series, xKey, currency = true, height = 240 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReAreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey={xKey} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => {
          if (!currency) return String(v)
          return v >= 1000 ? `R$${(v/1000).toFixed(0)}k` : `R$${v}`
        }} />
        <Tooltip content={<CustomTooltip currency={currency} />} />
        <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            fill={`url(#grad-${s.key})`}
          />
        ))}
      </ReAreaChart>
    </ResponsiveContainer>
  )
}
