import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { Card3D } from './Card3D'
import { formatCurrency, formatDelta } from '@/utils'
import { cn } from '@/utils'

interface Props {
  title: string
  value: number
  previousValue?: number
  format?: 'currency' | 'number' | 'percent'
  color?: 'blue' | 'purple' | 'green' | 'yellow'
  suffix?: string
}

const colors = {
  blue:   'text-[var(--accent-blue)]',
  purple: 'text-[var(--accent-purple)]',
  green:  'text-[var(--status-success)]',
  yellow: 'text-[var(--status-warning)]',
}

function formatValue(value: number, format: Props['format'], suffix?: string): string {
  if (format === 'currency') return formatCurrency(value)
  if (format === 'percent') return `${value}%`
  return `${value.toLocaleString('pt-BR')}${suffix ?? ''}`
}

export function KPICard({ title, value, previousValue, format = 'currency', color = 'blue', suffix }: Props) {
  const delta = previousValue !== undefined ? formatDelta(value, previousValue) : null
  const counterRef = useRef<HTMLSpanElement>(null)
  const prevValueRef = useRef(0)

  useEffect(() => {
    if (!counterRef.current) return
    const obj = { val: prevValueRef.current }
    gsap.to(obj, {
      val: value,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate() {
        if (!counterRef.current) return
        counterRef.current.textContent = formatValue(Math.round(obj.val), format, suffix)
      },
    })
    prevValueRef.current = value
  }, [value, format, suffix])

  return (
    <Card3D>
      <div className="flex items-start justify-between mb-3">
        <p className="text-[var(--text-muted)] text-xs font-medium uppercase tracking-widest">{title}</p>
        {delta && (
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-md',
            delta.positive
              ? 'bg-[var(--status-success)]/10 text-[var(--status-success)]'
              : 'bg-[var(--status-error)]/10 text-[var(--status-error)]'
          )}>
            {delta.value}
          </span>
        )}
      </div>
      <span ref={counterRef} className={cn('text-2xl font-bold tabular-nums', colors[color])}>
        {formatValue(value, format, suffix)}
      </span>
    </Card3D>
  )
}
