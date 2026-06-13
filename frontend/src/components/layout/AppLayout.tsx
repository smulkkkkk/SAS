import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileDrawer } from './MobileDrawer'
import { useUIStore } from '@/store'

export function AppLayout() {
  const location = useLocation()
  const { setMobileDrawer } = useUIStore()

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">
      <Sidebar />
      <MobileDrawer />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileDrawer(true)}
          className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-xl bg-[var(--bg-card)] border border-white/10 text-[var(--text-muted)]"
        >
          ☰
        </button>

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-y-auto"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  )
}
