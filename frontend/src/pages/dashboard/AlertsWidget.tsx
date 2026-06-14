import { motion } from 'framer-motion'
import { usePayables } from '@/hooks'
import { Badge } from '@/components/ui'

export function AlertsWidget() {
  const { data: payables = [] } = usePayables()

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const vencendoHoje = payables.filter(p => p.vencimento === today && p.status === 'pendente').length
  const vencendoAmanha = payables.filter(p => p.vencimento === tomorrow && p.status === 'pendente').length
  const vencidos = payables.filter(p => p.status === 'vencido').length

  const alerts = [
    vencidos > 0 && { icon: '🚨', text: `${vencidos} conta${vencidos > 1 ? 's' : ''} vencida${vencidos > 1 ? 's' : ''}`, type: 'error' as const },
    vencendoHoje > 0 && { icon: '⏰', text: `${vencendoHoje} vence${vencendoHoje > 1 ? 'm' : ''} hoje`, type: 'warning' as const },
    vencendoAmanha > 0 && { icon: '📋', text: `${vencendoAmanha} vence${vencendoAmanha > 1 ? 'm' : ''} amanhã`, type: 'info' as const },
  ].filter(Boolean) as Array<{ icon: string; text: string; type: 'error' | 'warning' | 'info' }>

  if (!alerts.length) return (
    <div className="flex items-center gap-2 py-2">
      <span>✅</span>
      <p className="text-[var(--text-muted)] text-sm">Nenhum alerta pendente</p>
    </div>
  )

  return (
    <div className="space-y-2">
      {alerts.map((a, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-2"
        >
          <span>{a.icon}</span>
          <Badge variant={a.type} pulse={a.type === 'error'}>{a.text}</Badge>
        </motion.div>
      ))}
    </div>
  )
}
