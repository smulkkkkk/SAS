import { motion } from 'framer-motion'
import { useUIStore } from '@/store'
import { NavItem } from './NavItem'
import type { NavItem as NavItemType } from '@/types'

const NAV_ITEMS: NavItemType[] = [
  { label: 'Dashboard',     path: '/dashboard',  icon: '⚡' },
  {
    label: 'Financeiro', path: '/financial', icon: '💰',
    children: [
      { label: 'Fluxo de Caixa', path: '/financial/cashflow',   icon: '📈' },
      { label: 'Contas',         path: '/financial/payables',   icon: '📋' },
      { label: 'Categorias',     path: '/financial/categories', icon: '🏷️' },
      { label: 'Relatórios',     path: '/financial/reports',    icon: '📊' },
      { label: 'Saúde',          path: '/financial/health',     icon: '❤️' },
    ],
  },
  {
    label: 'Agendamentos', path: '/scheduling', icon: '📅',
    children: [
      { label: 'Dia',            path: '/scheduling/day',   icon: '🕐' },
      { label: 'Semana',         path: '/scheduling/week',  icon: '📆' },
      { label: 'Mês',            path: '/scheduling/month', icon: '🗓️' },
      { label: 'Estatísticas',   path: '/scheduling/stats', icon: '📉' },
    ],
  },
  {
    label: 'Clientes', path: '/crm', icon: '👥',
    children: [
      { label: 'Lista',    path: '/crm/clients',   icon: '👤' },
      { label: 'Pipeline', path: '/crm/pipeline',  icon: '🔄' },
    ],
  },
  { label: 'Analytics',      path: '/analytics', icon: '📡' },
  {
    label: 'Configurações', path: '/settings', icon: '⚙️',
    children: [
      { label: 'Perfil',       path: '/settings/profile',      icon: '👤' },
      { label: 'Equipe',       path: '/settings/team',         icon: '👥' },
      { label: 'Integrações',  path: '/settings/integrations', icon: '🔌' },
      { label: 'Plano',        path: '/settings/billing',      icon: '💳' },
    ],
  },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="hidden md:flex flex-col h-full bg-[var(--bg-card)] border-r border-white/5 overflow-hidden flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">P</span>
        </div>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-[var(--text-primary)] font-bold text-sm leading-none">PulseFlow</p>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">Business Suite</p>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.path} item={item} collapsed={sidebarCollapsed} />
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-white/5">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all"
          title={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <motion.span animate={{ rotate: sidebarCollapsed ? 0 : 180 }} transition={{ duration: 0.25 }}>
            ›
          </motion.span>
        </button>
      </div>
    </motion.aside>
  )
}
