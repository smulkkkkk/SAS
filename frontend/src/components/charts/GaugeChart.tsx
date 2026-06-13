import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface Props {
  value: number  // 0-100
  label?: string
}

export function GaugeChart({ value, label }: Props) {
  const clamp = Math.min(100, Math.max(0, value))
  const color = clamp >= 70 ? 'var(--status-success)' : clamp >= 40 ? 'var(--status-warning)' : 'var(--status-error)'

  const data = [{ value: clamp }, { value: 100 - clamp }]

  return (
    <div className="relative flex items-center justify-center">
      <ResponsiveContainer width={160} height={100}>
        <PieChart>
          <Pie data={data} startAngle={180} endAngle={0} cx="50%" cy="100%" innerRadius={50} outerRadius={70} paddingAngle={0} dataKey="value">
            <Cell fill={color} />
            <Cell fill="rgba(255,255,255,0.05)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 text-center">
        <p className="text-2xl font-bold" style={{ color }}>{clamp}</p>
        {label && <p className="text-[var(--text-muted)] text-xs">{label}</p>}
      </div>
    </div>
  )
}
