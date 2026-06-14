import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui'
import { formatCurrency, formatDate } from '@/utils'
import type { Client } from '@/types'

const STATUS_VARIANT: Record<Client['status'], 'success'|'info'|'warning'|'default'> = {
  VIP: 'success', Ativo: 'info', Prospect: 'warning', Inativo: 'default'
}

interface Props { client: Client; index: number }

export function ClientCard({ client, index }: Props) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => navigate(`/crm/clients/${client.id}`)}
      className="bg-[var(--bg-card)] border border-white/5 rounded-2xl p-5 hover:border-white/10 hover:bg-[var(--bg-elevated)] cursor-pointer transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center text-white font-semibold">
            {client.nome.charAt(0)}
          </div>
          <div>
            <p className="text-[var(--text-primary)] font-medium text-sm">{client.nome}</p>
            <p className="text-[var(--text-muted)] text-xs">{client.email}</p>
          </div>
        </div>
        <Badge variant={STATUS_VARIANT[client.status]}>{client.status}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-[var(--text-muted)]">Total gasto</p>
          <p className="text-[var(--text-primary)] font-medium">{formatCurrency(client.totalGasto)}</p>
        </div>
        <div>
          <p className="text-[var(--text-muted)]">Agendamentos</p>
          <p className="text-[var(--text-primary)] font-medium">{client.totalAgendamentos}</p>
        </div>
        <div>
          <p className="text-[var(--text-muted)]">Última visita</p>
          <p className="text-[var(--text-primary)] font-medium">{formatDate(client.ultimaVisita)}</p>
        </div>
        <div>
          <p className="text-[var(--text-muted)]">Serviço</p>
          <p className="text-[var(--text-primary)] font-medium truncate">{client.tags[0] ?? '—'}</p>
        </div>
      </div>
    </motion.div>
  )
}
