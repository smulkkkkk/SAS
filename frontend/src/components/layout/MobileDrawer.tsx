import { AnimatePresence, motion } from 'framer-motion'
import { useUIStore } from '@/store'
import { NavItem } from './NavItem'
import type { NavItem as NavItemType } from '@/types'

const NAV_ITEMS: NavItemType[] = [
  { label: 'Dashboard', path: '/dashboard', icon: '⚡' },
  { label: 'Financeiro', path: '/financial/cashflow', icon: '💰' },
  { label: 'Agendamentos', path: '/scheduling/day', icon: '📅' },
  { label: 'Clientes', path: '/crm/clients', icon: '👥' },
  { label: 'Analytics', path: '/analytics', icon: '📡' },
  { label: 'Configurações', path: '/settings/profile', icon: '⚙️' },
]

export function MobileDrawer() {
  const { mobileDrawerOpen, setMobileDrawer } = useUIStore()

  return (
    <AnimatePresence>
      {mobileDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileDrawer(false)}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-72 bg-[var(--bg-card)] z-50 md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center">
                  <span className="text-white text-sm font-bold">P</span>
                </div>
                <span className="text-[var(--text-primary)] font-bold">PulseFlow</span>
              </div>
              <button
                onClick={() => setMobileDrawer(false)}
                className="p-2 rounded-lg hover:bg-white/5 text-[var(--text-muted)]"
              >
                ✕
              </button>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <NavItem key={item.path} item={item} collapsed={false} />
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
