import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useClient, useClientHistory } from '@/hooks'
import { Card, Badge, Button, Skeleton } from '@/components/ui'
import { ClientStatusFunnel } from '@/features/clients/ClientStatusFunnel'
import { formatCurrency, formatDate } from '@/utils'
import type { Client } from '@/types'

const STATUS_VARIANT: Record<Client['status'], 'success'|'info'|'warning'|'default'> = {
  VIP: 'success', Ativo: 'info', Prospect: 'warning', Inativo: 'default'
}

type Tab = 'historico' | 'agendamentos' | 'notas'

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('historico')
  const [nota, setNota] = useState('')

  const { data: client, isLoading } = useClient(id!)
  const { data: history = [] } = useClientHistory(id!)

  if (isLoading) return <div className="p-8 space-y-4"><Skeleton variant="card" className="h-40" /><div className="grid grid-cols-3 gap-4">{[...Array(3)].map((_,i) => <Skeleton key={i} variant="card" />)}</div></div>
  if (!client) return <div className="p-8 text-[var(--text-muted)]">Cliente não encontrado</div>

  return (
    <div className="p-6 lg:p-8 max-w-[1000px] mx-auto space-y-6">
      <button onClick={() => navigate('/crm/clients')} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm transition-colors">
        ‹ Voltar
      </button>

      {/* Header */}
      <Card className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {client.nome.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{client.nome}</h1>
            <Badge variant={STATUS_VARIANT[client.status]}>{client.status}</Badge>
          </div>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">{client.email} · {client.telefone}</p>
          <div className="flex gap-2 flex-wrap mt-2">
            {client.tags.map(tag => <Badge key={tag} variant="default">{tag}</Badge>)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-[var(--text-primary)] font-bold text-lg">{formatCurrency(client.totalGasto)}</p>
            <p className="text-[var(--text-muted)] text-xs">Total gasto</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-[var(--text-primary)] font-bold text-lg">{client.totalAgendamentos}</p>
            <p className="text-[var(--text-muted)] text-xs">Agendamentos</p>
          </div>
        </div>
      </Card>

      {/* Funnel */}
      <Card>
        <h2 className="text-[var(--text-primary)] font-semibold text-sm mb-4">Jornada do Cliente</h2>
        <ClientStatusFunnel status={client.status} />
      </Card>

      {/* Tabs */}
      <div>
        <div className="flex bg-white/5 rounded-xl p-1 gap-1 mb-4 w-fit">
          {(['historico', 'agendamentos', 'notas'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-[var(--accent-blue)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
              {t === 'historico' ? 'Histórico' : t === 'agendamentos' ? 'Agendamentos' : 'Notas'}
            </button>
          ))}
        </div>

        {tab === 'historico' && (
          <Card>
            <div className="space-y-1">
              {history.map((entry, i) => (
                <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm flex-shrink-0">
                    {entry.tipo === 'agendamento' ? '📅' : entry.tipo === 'pagamento' ? '💰' : '📝'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--text-primary)] text-sm">{entry.descricao}</p>
                    {entry.valor && <p className="text-[var(--status-success)] text-xs font-medium">{formatCurrency(entry.valor)}</p>}
                  </div>
                  <p className="text-[var(--text-muted)] text-xs flex-shrink-0">{formatDate(entry.data)}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {tab === 'notas' && (
          <Card className="space-y-4">
            <textarea value={nota} onChange={e => setNota(e.target.value)} rows={5}
              placeholder="Adicionar nota interna sobre este cliente..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] text-sm resize-none focus:outline-none focus:border-[var(--accent-blue)]/50" />
            <Button size="sm" onClick={() => { if (nota) { setNota(''); } }}>Salvar nota</Button>
            {client.notas && <p className="text-[var(--text-muted)] text-sm border-t border-white/5 pt-4">{client.notas}</p>}
          </Card>
        )}

        {tab === 'agendamentos' && (
          <Card>
            <p className="text-[var(--text-muted)] text-sm">
              Total de {client.totalAgendamentos} agendamentos — última visita em {formatDate(client.ultimaVisita)}
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
