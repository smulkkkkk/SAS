import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, Badge } from '@/components/ui'
import { useNotificationsStore } from '@/store'

interface Integration { id: string; name: string; desc: string; icon: string; connected: boolean }

const INTEGRATIONS: Integration[] = [
  { id: 'gcal', name: 'Google Calendar', desc: 'Sincronize agendamentos com seu Google Calendar', icon: '📅', connected: false },
  { id: 'whatsapp', name: 'WhatsApp Business', desc: 'Envie lembretes automáticos para clientes', icon: '💬', connected: false },
  { id: 'stripe', name: 'Stripe', desc: 'Processe pagamentos online com segurança', icon: '💳', connected: false },
  { id: 'smtp', name: 'Email (SMTP)', desc: 'Envio de confirmações e relatórios por email', icon: '✉️', connected: true },
]

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS)
  const { addToast } = useNotificationsStore()

  function toggle(id: string) {
    setIntegrations(prev => prev.map(i => {
      if (i.id !== id) return i
      const newConnected = !i.connected
      addToast(newConnected ? `${i.name} conectado!` : `${i.name} desconectado`, newConnected ? 'success' : 'info')
      return { ...i, connected: newConnected }
    }))
  }

  return (
    <div className="p-6 lg:p-8 max-w-[700px] mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Integrações</h1>

      <div className="space-y-3">
        {integrations.map((intg, i) => (
          <motion.div key={intg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0">{intg.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[var(--text-primary)] font-medium text-sm">{intg.name}</p>
                <p className="text-[var(--text-muted)] text-xs">{intg.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                {intg.connected && <Badge variant="success">Conectado</Badge>}
                <button
                  onClick={() => toggle(intg.id)}
                  className={`relative w-12 h-6 rounded-full transition-all ${intg.connected ? 'bg-[var(--accent-blue)]' : 'bg-white/10'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${intg.connected ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
