import { useState, useMemo } from 'react'
import { useClients } from '@/hooks'
import { Skeleton, EmptyState } from '@/components/ui'
import { ClientCard } from '@/features/clients/ClientCard'
import type { Client } from '@/types'

type StatusFilter = 'Todos' | Client['status']
const STATUS_OPTS: StatusFilter[] = ['Todos', 'VIP', 'Ativo', 'Prospect', 'Inativo']

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('Todos')
  const { data: clients = [], isLoading } = useClients()

  const filtered = useMemo(() =>
    clients.filter(c => {
      const matchSearch = !search || c.nome.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
      const matchStatus = status === 'Todos' || c.status === status
      return matchSearch && matchStatus
    }),
    [clients, search, status]
  )

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Clientes</h1>
        <p className="text-[var(--text-muted)] text-sm">{filtered.length} de {clients.length}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome ou email..."
          className="flex-1 min-w-[200px] max-w-xs px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--accent-blue)]/50"
        />
        <div className="flex bg-white/5 rounded-xl p-1 gap-1">
          {STATUS_OPTS.map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${status === s ? 'bg-[var(--accent-blue)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} variant="card" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="👤" title="Nenhum cliente encontrado" description="Tente ajustar os filtros de busca" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client, i) => (
            <ClientCard key={client.id} client={client} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
