import { motion } from 'framer-motion'
import { formatRelative } from '@/utils'

interface Activity {
  id: string
  icon: string
  title: string
  subtitle: string
  date: string
  type: 'success' | 'info' | 'warning'
}

const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', icon: '💰', title: 'Pagamento recebido', subtitle: 'Ana Costa — R$ 280,00', date: new Date(Date.now() - 5 * 60000).toISOString(), type: 'success' },
  { id: '2', icon: '📅', title: 'Novo agendamento', subtitle: 'Bruno Lima — Massagem 14h', date: new Date(Date.now() - 22 * 60000).toISOString(), type: 'info' },
  { id: '3', icon: '⚠️', title: 'Conta vencendo', subtitle: 'Aluguel — R$ 3.500,00 amanhã', date: new Date(Date.now() - 60 * 60000).toISOString(), type: 'warning' },
  { id: '4', icon: '👤', title: 'Novo cliente', subtitle: 'Carla Mendes cadastrada', date: new Date(Date.now() - 2 * 3600000).toISOString(), type: 'success' },
  { id: '5', icon: '💰', title: 'Pagamento recebido', subtitle: 'Diego Silva — R$ 150,00', date: new Date(Date.now() - 3 * 3600000).toISOString(), type: 'success' },
]

export function ActivityFeed() {
  return (
    <div className="space-y-1">
      {MOCK_ACTIVITIES.map((a, i) => (
        <motion.div
          key={a.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-start gap-3 py-2.5 px-1 rounded-xl hover:bg-white/3 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-base flex-shrink-0">
            {a.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[var(--text-primary)] text-sm font-medium leading-none truncate">{a.title}</p>
            <p className="text-[var(--text-muted)] text-xs mt-0.5 truncate">{a.subtitle}</p>
          </div>
          <p className="text-[var(--text-muted)] text-xs flex-shrink-0 mt-0.5">{formatRelative(a.date)}</p>
        </motion.div>
      ))}
    </div>
  )
}
