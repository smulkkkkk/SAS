import { motion } from 'framer-motion'
import { Card3D } from './Card3D'
import { formatCurrency, formatDelta } from '@/utils'
import { cn } from '@/utils'

interface Props {
  title: string
  value: number
  previousValue?: number
  format?: 'currency' | 'number' | 'percent'
  icon: string
  color?: 'blue' | 'purple' | 'green' | 'yellow'
  suffix?: string
}

const colors = {
  blue:   { bg: 'bg-[var(--accent-blue)]/10',           text: 'text-[var(--accent-blue)]' },
  purple: { bg: 'bg-[var(--accent-purple)]/10',         text: 'text-[var(--accent-purple)]' },
  green:  { bg: 'bg-[var(--status-success)]/10',        text: 'text-[var(--status-success)]' },
  yellow: { bg: 'bg-[var(--status-warning)]/10',        text: 'text-[var(--status-warning)]' },
}

function formatValue(value: number, format: Props['format'], suffix?: string): string {
  if (format === 'currency') return formatCurrency(value)
  if (format === 'percent') return `${value}%`
  return `${value.toLocaleString('pt-BR')}${suffix ?? ''}`
}

export function KPICard({ title, value, previousValue, format = 'currency', icon, color = 'blue', suffix }: Props) {
  const c = colors[color]
  const delta = previousValue !== undefined ? formatDelta(value, previousValue) : null

  return (
    <Card3D>
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-xl', c.bg)}>
          {icon}
        </div>
        {delta && (
          <span className={cn('text-xs font-medium px-2 py-1 rounded-lg', delta.positive ? 'bg-[var(--status-success)]/10 text-[var(--status-success)]' : 'bg-[var(--status-error)]/10 text-[var(--status-error)]')}>
            {delta.value}
          </span>
        )}
      </div>
      <motion.p
        key={value}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('text-2xl font-bold', c.text)}
      >
        {formatValue(value, format, suffix)}
      </motion.p>
      <p className="text-[var(--text-muted)] text-sm mt-1">{title}</p>
    </Card3D>
  )
}
