import { cn } from '@/utils'
import type { ReactNode } from 'react'

type Variant = 'success' | 'error' | 'warning' | 'info' | 'default'

interface Props {
  children: ReactNode
  variant?: Variant
  pulse?: boolean
  className?: string
}

const variants: Record<Variant, string> = {
  success: 'bg-[var(--status-success)]/15 text-[var(--status-success)] border-[var(--status-success)]/20',
  error:   'bg-[var(--status-error)]/15 text-[var(--status-error)] border-[var(--status-error)]/20',
  warning: 'bg-[var(--status-warning)]/15 text-[var(--status-warning)] border-[var(--status-warning)]/20',
  info:    'bg-[#06B6D4]/15 text-[#06B6D4] border-[#06B6D4]/20',
  default: 'bg-white/10 text-[var(--text-muted)] border-white/10',
}

const dotColors: Record<Variant, string> = {
  success: 'bg-[var(--status-success)]',
  error:   'bg-[var(--status-error)]',
  warning: 'bg-[var(--status-warning)]',
  info:    'bg-[#06B6D4]',
  default: 'bg-[var(--text-muted)]',
}

export function Badge({ children, variant = 'default', pulse = false, className }: Props) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border', variants[variant], className)}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', dotColors[variant])} />
          <span className={cn('relative inline-flex rounded-full h-2 w-2', dotColors[variant])} />
        </span>
      )}
      {children}
    </span>
  )
}
