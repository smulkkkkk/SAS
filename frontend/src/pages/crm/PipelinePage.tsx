import { useState } from 'react'
import { motion } from 'framer-motion'
import { useClients, useUpdateClient } from '@/hooks'
import { formatCurrency } from '@/utils'
import { useNotificationsStore } from '@/store'
import type { Client } from '@/types'

const COLUMNS: Array<{ status: Client['status']; label: string; icon: string; color: string }> = [
  { status: 'Prospect', label: 'Prospect', icon: '🔍', color: '#F59E0B' },
  { status: 'Ativo', label: 'Ativo', icon: '✅', color: '#06B6D4' },
  { status: 'VIP', label: 'VIP', icon: '⭐', color: '#10B981' },
  { status: 'Inativo', label: 'Inativo', icon: '😴', color: '#94A3B8' },
]

export default function PipelinePage() {
  const { data: clients = [] } = useClients()
  const updateClient = useUpdateClient()
  const { addToast } = useNotificationsStore()
  const [dragging, setDragging] = useState<string | null>(null)

  function getColumnClients(status: Client['status']) {
    return clients.filter(c => c.status === status)
  }

  function handleDrop(e: React.DragEvent, targetStatus: Client['status']) {
    e.preventDefault()
    if (!dragging) return
    const client = clients.find(c => c.id === dragging)
    if (!client || client.status === targetStatus) return
    updateClient.mutate({ id: dragging, dto: { status: targetStatus } })
    addToast(`${client.nome} movido para ${targetStatus}`, 'success')
    setDragging(null)
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Pipeline de Clientes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map(col => {
          const colClients = getColumnClients(col.status)
          const total = colClients.reduce((s, c) => s + c.totalGasto, 0)

          return (
            <div
              key={col.status}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, col.status)}
              className="flex flex-col gap-3"
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span>{col.icon}</span>
                  <span className="text-[var(--text-primary)] font-medium text-sm">{col.label}</span>
                  <span className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-medium" style={{ backgroundColor: `${col.color}20`, color: col.color }}>
                    {colClients.length}
                  </span>
                </div>
                <span className="text-[var(--text-muted)] text-xs">{formatCurrency(total)}</span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 min-h-[200px] p-2 rounded-2xl bg-white/3 transition-all">
                {colClients.map((client, i) => (
                  <motion.div
                    key={client.id}
                    draggable
                    onDragStart={() => setDragging(client.id)}
                    onDragEnd={() => setDragging(null)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-[var(--bg-card)] border border-white/5 rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-white/10 transition-all ${dragging === client.id ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: `linear-gradient(135deg, var(--accent-blue), var(--accent-purple))` }}>
                        {client.nome.charAt(0)}
                      </div>
                      <p className="text-[var(--text-primary)] text-xs font-medium truncate">{client.nome}</p>
                    </div>
                    <p className="text-[var(--status-success)] text-xs font-medium">{formatCurrency(client.totalGasto)}</p>
                    <p className="text-[var(--text-muted)] text-[10px] mt-0.5 truncate">{client.tags[0]}</p>
                  </motion.div>
                ))}
                {colClients.length === 0 && (
                  <div className="flex items-center justify-center h-20">
                    <p className="text-[var(--text-muted)] text-xs">Arraste clientes aqui</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
