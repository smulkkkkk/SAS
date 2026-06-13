import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { cn } from '@/utils'
import type { ReactNode } from 'react'

type Size = 'sm' | 'md' | 'lg'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: Size
}

const sizes: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({ open, onClose, title, children, size = 'md' }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
      window.addEventListener('keydown', handler)
      return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = '' }
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className={cn('relative w-full bg-[var(--bg-elevated)] rounded-2xl border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden', sizes[size])}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <h2 className="text-[var(--text-primary)] font-semibold">{title}</h2>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--text-muted)] transition-all">✕</button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
