import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotificationsStore, useAuthStore } from '@/store'
import { cn } from '@/utils'

export function Topbar() {
  const [search, setSearch] = useState('')
  const { toasts } = useNotificationsStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const hasNotif = toasts.length > 0
  const initials = user?.name?.slice(0, 2).toUpperCase() ?? 'PF'

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="h-14 flex items-center gap-4 px-6 bg-[var(--bg-card)]/80 backdrop-blur-md border-b border-white/5 flex-shrink-0 z-10">
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="6.5" cy="6.5" r="5" />
          <path d="m10.5 10.5 3.5 3.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className={cn(
            'w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-white/5 border border-white/8',
            'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
            'focus:outline-none focus:border-[var(--accent-blue)]/40 transition-colors',
          )}
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 1.5a5 5 0 0 1 5 5v2.5l1 2H2l1-2V6.5a5 5 0 0 1 5-5Z" />
            <path d="M6 13a2 2 0 0 0 4 0" strokeLinecap="round" />
          </svg>
          {hasNotif && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--status-error)] rounded-full" />
          )}
        </button>

        <div className="w-px h-5 bg-white/8" />

        {/* Avatar + name + logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-blue)]/20 border border-[var(--accent-blue)]/30 flex items-center justify-center text-[var(--accent-blue)] text-xs font-semibold">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[var(--text-primary)] text-sm font-medium leading-none">{user?.name ?? 'Usuário'}</p>
              <p className="text-[var(--text-muted)] text-xs mt-0.5 leading-none">{user?.role ?? ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-[var(--text-muted)] hover:text-[var(--status-error)]"
            title="Sair"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M10 11l3-3-3-3M13 8H6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
