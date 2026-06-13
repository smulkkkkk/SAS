import { cn } from '@/utils'

type Variant = 'card' | 'row' | 'chart' | 'page' | 'text' | 'circle'

interface Props {
  variant?: Variant
  className?: string
}

function SkeletonBase({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-lg', className)} />
  )
}

export function Skeleton({ variant = 'text', className }: Props) {
  if (variant === 'card') return (
    <div className="rounded-2xl p-5 bg-[var(--bg-card)] border border-white/5 space-y-3">
      <SkeletonBase className="h-10 w-10 rounded-xl" />
      <SkeletonBase className="h-7 w-3/4" />
      <SkeletonBase className="h-4 w-1/2" />
    </div>
  )
  if (variant === 'row') return (
    <div className="flex items-center gap-3 py-3">
      <SkeletonBase className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <SkeletonBase className="h-3.5 w-2/3" />
        <SkeletonBase className="h-3 w-1/3" />
      </div>
      <SkeletonBase className="h-6 w-16 rounded-lg" />
    </div>
  )
  if (variant === 'chart') return <SkeletonBase className={cn('h-64 w-full rounded-2xl', className)} />
  if (variant === 'page') return (
    <div className="space-y-4">
      <SkeletonBase className="h-8 w-48" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} variant="card" />)}
      </div>
      <Skeleton variant="chart" />
    </div>
  )
  if (variant === 'circle') return <SkeletonBase className={cn('rounded-full', className)} />
  return <SkeletonBase className={cn('h-4', className)} />
}
