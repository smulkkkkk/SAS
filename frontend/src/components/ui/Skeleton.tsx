import { cn } from '@/utils'

interface SkeletonProps {
  variant?: 'line' | 'card' | 'page' | 'circle'
  className?: string
}

export function Skeleton({ variant = 'line', className }: SkeletonProps) {
  const base = 'animate-pulse rounded bg-white/10'
  const variants = {
    line: 'h-4 w-full',
    card: 'h-32 w-full',
    page: 'h-64 w-full',
    circle: 'h-10 w-10 rounded-full',
  }
  return <div className={cn(base, variants[variant], className)} />
}
