import { forwardRef, type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon'
type Size = 'sm' | 'md' | 'lg'

interface Props extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  children?: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white hover:opacity-90 shadow-glow',
  secondary: 'bg-white/10 text-[var(--text-primary)] hover:bg-white/15 border border-white/10',
  ghost: 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5',
  danger: 'bg-[var(--status-error)]/20 text-[var(--status-error)] hover:bg-[var(--status-error)]/30 border border-[var(--status-error)]/30',
  icon: 'p-2 bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/10',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-6 text-base rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', size = 'md', loading, icon, children, className, disabled, ...props }, ref) => (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed',
        variant !== 'icon' && sizes[size],
        variants[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : icon}
      {children}
    </motion.button>
  )
)
Button.displayName = 'Button'
