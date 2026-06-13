import { useState } from 'react'
import { useNotificationsStore } from '@/store'
import { cn } from '@/utils'

export function Topbar() {
  const [search, setSearch] = useState('')
  const { toasts } = useNotificationsStore()
  const hasNotif = toasts.length > 0

  return (
    <header className="h-16 flex items-center gap-4 px-6 bg-[var(--bg-card)]/80 backdrop-blur-md border-b border-white/5 flex-shrink-0 z-10">
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar clientes, transações, agendamentos..."
          className={cn(
            'w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-white/5 border border-white/10',
            'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
            'focus:outline-none focus:border-[var(--accent-blue)]/50 transition-all'
          )}
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-white/5 transition-all text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          <span>🔔</span>
          {hasNotif && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10" />

        {/* Avatar */}
        <button className="flex items-center gap-2 p-1 pr-3 rounded-xl hover:bg-white/5 transition-all">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center text-white text-sm font-semibold">
            A
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[var(--text-primary)] text-sm font-medium leading-none">Admin</p>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">PulseFlow</p>
          </div>
        </button>
      </div>
    </header>
  )
}
