import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileDrawer } from './MobileDrawer'
import { useUIStore } from '@/store'
import { ChatWidget } from '@/components/chat/ChatWidget'

export function AppLayout() {
  const location = useLocation()
  const { setMobileDrawer } = useUIStore()

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">
      <Sidebar />
      <MobileDrawer />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileDrawer(true)}
          className="md:hidden fixed top-3.5 left-4 z-30 p-2 rounded-lg bg-[var(--bg-card)] border border-white/8 text-[var(--text-muted)]"
          aria-label="Abrir menu"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 4h12M2 8h12M2 12h12" strokeLinecap="round" />
          </svg>
        </button>

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-y-auto"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>

      <ChatWidget />
    </div>
  )
}
