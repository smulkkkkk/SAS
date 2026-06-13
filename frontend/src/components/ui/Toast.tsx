import { AnimatePresence, motion } from 'framer-motion'
import { useNotificationsStore } from '@/store'
import { cn } from '@/utils'
import type { ToastType } from '@/types'

const config: Record<ToastType, { icon: string; bg: string; border: string }> = {
  success: { icon: '✅', bg: 'bg-[var(--status-success)]/10', border: 'border-[var(--status-success)]/30' },
  error:   { icon: '❌', bg: 'bg-[var(--status-error)]/10',   border: 'border-[var(--status-error)]/30' },
  warning: { icon: '⚠️', bg: 'bg-[var(--status-warning)]/10', border: 'border-[var(--status-warning)]/30' },
  info:    { icon: 'ℹ️', bg: 'bg-[#06B6D4]/10',               border: 'border-[#06B6D4]/30' },
}

export function ToastContainer() {
  const { toasts, removeToast } = useNotificationsStore()

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const c = config[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 64, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 64, scale: 0.9 }}
              className={cn('pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-card max-w-sm', c.bg, c.border)}
            >
              <span>{c.icon}</span>
              <p className="text-[var(--text-primary)] text-sm flex-1">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors ml-1">✕</button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
