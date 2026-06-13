import { PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/utils'

interface DataPoint { name: string; value: number; color: string }

interface Props {
  data: DataPoint[]
  currency?: boolean
  height?: number
  innerRadius?: number
}

function CustomTooltip({ active, payload, currency }: { active?: boolean; payload?: Array<{payload: DataPoint; value: number}>; currency?: boolean }) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <div className="bg-[var(--bg-elevated)] border border-white/10 rounded-xl px-4 py-3 shadow-card">
      <p className="text-[var(--text-primary)] text-sm font-medium">{p.payload.name}</p>
      <p className="text-[var(--text-muted)] text-xs">{currency ? formatCurrency(p.value) : p.value}</p>
    </div>
  )
}

export function PieChart({ data, currency = true, height = 240, innerRadius = 60 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RePieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={innerRadius + 40} paddingAngle={4} dataKey="value">
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip currency={currency} />} />
        <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
      </RePieChart>
    </ResponsiveContainer>
  )
}
