import { useState, useMemo } from 'react'
import { usePayables, useUpdatePayableStatus, useDeletePayable, useCreatePayable } from '@/hooks'
import { Card, Badge, Button, Modal, DataTable } from '@/components/ui'
import { formatCurrency, formatDate } from '@/utils'
import { useNotificationsStore } from '@/store'
import type { Payable } from '@/types'
import type { Column } from '@/components/ui/DataTable'

type Tab = 'todas' | 'pagar' | 'receber'
type PRow = Record<string, unknown> & Payable

export default function PayablesPage() {
  const [tab, setTab] = useState<Tab>('todas')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<Partial<Payable>>({ tipo: 'pagar', status: 'pendente' })
  const { data: payables = [], isLoading } = usePayables()
  const updateStatus = useUpdatePayableStatus()
  const deletePayable = useDeletePayable()
  const createPayable = useCreatePayable()
  const { addToast } = useNotificationsStore()

  const filtered = useMemo(
    () => payables.filter(p => tab === 'todas' ? true : p.tipo === tab),
    [payables, tab]
  ) as unknown as PRow[]
  const vencidos = payables.filter(p => p.status === 'vencido').length

  const columns: Column<PRow>[] = [
    { key: 'descricao', label: 'Descrição', sortable: true },
    { key: 'fornecedorCliente', label: 'Contato', sortable: true },
    { key: 'categoria', label: 'Categoria' },
    {
      key: 'vencimento', label: 'Vencimento', sortable: true,
      render: r => <>{formatDate(r.vencimento as string)}</>,
    },
    {
      key: 'valor', label: 'Valor', sortable: true, render: r => (
        <span className={r.tipo === 'receber' ? 'text-[var(--status-success)]' : 'text-[var(--text-primary)]'}>
          {formatCurrency(r.valor as number)}
        </span>
      ),
    },
    {
      key: 'status', label: 'Status', render: r => {
        const v: Record<string, 'success' | 'error' | 'warning'> = { pago: 'success', vencido: 'error', pendente: 'warning' }
        return <Badge variant={v[String(r.status)] ?? 'default'}>{String(r.status)}</Badge>
      },
    },
    {
      key: 'id', label: 'Ações', render: r => (
        <div className="flex gap-2">
          {r.status !== 'pago' && (
            <Button
              variant="ghost" size="sm"
              onClick={() => {
                updateStatus.mutate({ id: r.id as string, status: 'pago' })
                addToast('Marcado como pago!', 'success')
              }}
            >
              ✓ Pagar
            </Button>
          )}
          <Button
            variant="danger" size="sm"
            onClick={() => {
              if (confirm('Excluir esta conta?')) {
                deletePayable.mutate(r.id as string)
                addToast('Conta excluída', 'info')
              }
            }}
          >
            ✕
          </Button>
        </div>
      ),
    },
  ]

  async function handleCreate() {
    if (!form.descricao || !form.valor || !form.vencimento) {
      addToast('Preencha todos os campos obrigatórios', 'error')
      return
    }
    await createPayable.mutateAsync(form as Omit<Payable, 'id'>)
    addToast('Conta criada com sucesso!', 'success')
    setModalOpen(false)
    setForm({ tipo: 'pagar', status: 'pendente' })
  }

  const formFields: Array<{ key: keyof Payable; label: string; type: string; placeholder?: string }> = [
    { key: 'descricao', label: 'Descrição *', type: 'text', placeholder: 'Ex: Aluguel Julho' },
    { key: 'fornecedorCliente', label: 'Fornecedor / Cliente', type: 'text', placeholder: 'Nome' },
    { key: 'valor', label: 'Valor *', type: 'number', placeholder: '0.00' },
    { key: 'vencimento', label: 'Vencimento *', type: 'date' },
    { key: 'categoria', label: 'Categoria', type: 'text', placeholder: 'Ex: Aluguel' },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Contas a Pagar / Receber</h1>
          {vencidos > 0 && (
            <p className="text-[var(--status-error)] text-sm mt-1 flex items-center gap-1">
              <span>🚨</span> {vencidos} conta{vencidos > 1 ? 's' : ''} vencida{vencidos > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Nova Conta</Button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/5 rounded-xl p-1 gap-1 w-fit">
        {(['todas', 'pagar', 'receber'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-[var(--accent-blue)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
          >
            {t === 'todas' ? 'Todas' : t === 'pagar' ? 'A Pagar' : 'A Receber'}
          </button>
        ))}
      </div>

      <Card>
        <DataTable
          data={filtered}
          columns={columns}
          loading={isLoading}
          searchable
          pageSize={10}
        />
      </Card>

      {/* Create modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Conta" size="md">
        <div className="space-y-4">
          {formFields.map(f => (
            <div key={f.key}>
              <label className="text-[var(--text-muted)] text-xs block mb-1">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={String(form[f.key] ?? '')}
                onChange={e => setForm(prev => ({
                  ...prev,
                  [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value,
                }))}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-blue)]/50"
              />
            </div>
          ))}
          <div>
            <label className="text-[var(--text-muted)] text-xs block mb-1">Tipo *</label>
            <div className="flex gap-2">
              {(['pagar', 'receber'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setForm(prev => ({ ...prev, tipo: t }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${form.tipo === t ? 'bg-[var(--accent-blue)] border-[var(--accent-blue)] text-white' : 'border-white/10 text-[var(--text-muted)]'}`}
                >
                  {t === 'pagar' ? 'A Pagar' : 'A Receber'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button className="flex-1" onClick={handleCreate} loading={createPayable.isPending}>Criar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
