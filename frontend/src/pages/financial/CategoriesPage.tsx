import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCategories, useCreateCategory, useDeleteCategory } from '@/hooks'
import { Card, Button, Modal, Badge, Skeleton } from '@/components/ui'
import { formatCurrency } from '@/utils'
import { useNotificationsStore } from '@/store'
import type { Category } from '@/types'

const ICON_OPTIONS = ['🏠', '👥', '📢', '📦', '💻', '🖥', '🧾', '📌', '🚗', '✈️', '📱', '💡', '🎯', '🔧', '📝']
const COLOR_OPTIONS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#84CC16', '#F97316', '#6366F1']

export default function CategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<Partial<Omit<Category, 'id' | 'gasto'>>>({
    cor: '#3B82F6',
    icone: '📌',
    tipo: 'saida',
    orcamento: 0,
  })
  const { data: categories = [], isLoading } = useCategories()
  const createCategory = useCreateCategory()
  const deleteCategory = useDeleteCategory()
  const { addToast } = useNotificationsStore()

  async function handleCreate() {
    if (!form.nome) { addToast('Nome é obrigatório', 'error'); return }
    await createCategory.mutateAsync(form as Omit<Category, 'id' | 'gasto'>)
    addToast('Categoria criada!', 'success')
    setModalOpen(false)
    setForm({ cor: '#3B82F6', icone: '📌', tipo: 'saida', orcamento: 0 })
  }

  if (isLoading) {
    return (
      <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <Skeleton key={i} variant="card" />)}
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Categorias</h1>
        <Button onClick={() => setModalOpen(true)}>+ Nova Categoria</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, i) => {
          const pct = cat.orcamento > 0 ? Math.min(100, Math.round((cat.gasto / cat.orcamento) * 100)) : 0
          const over = pct >= 100
          return (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${cat.cor}20` }}
                    >
                      {cat.icone}
                    </div>
                    <div>
                      <p className="text-[var(--text-primary)] font-medium">{cat.nome}</p>
                      <Badge variant={cat.tipo === 'entrada' ? 'success' : 'default'} className="text-[10px]">{cat.tipo}</Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => { deleteCategory.mutate(cat.id); addToast('Categoria removida', 'info') }}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--text-muted)] text-xs transition-all"
                  >
                    ✕
                  </button>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--text-muted)]">Gasto: {formatCurrency(cat.gasto)}</span>
                    <span className={over ? 'text-[var(--status-error)]' : 'text-[var(--text-muted)]'}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: over ? '#EF4444' : cat.cor }}
                    />
                  </div>
                  <p className="text-[var(--text-muted)] text-[10px] mt-1">Orçamento: {formatCurrency(cat.orcamento)}</p>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Categoria">
        <div className="space-y-4">
          <div>
            <label className="text-[var(--text-muted)] text-xs block mb-1">Nome *</label>
            <input
              type="text"
              value={form.nome ?? ''}
              onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
              placeholder="Ex: Marketing"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[var(--text-muted)] text-xs block mb-1">Orçamento mensal</label>
            <input
              type="number"
              value={form.orcamento ?? 0}
              onChange={e => setForm(p => ({ ...p, orcamento: Number(e.target.value) }))}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[var(--text-muted)] text-xs block mb-2">Ícone</label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map(ic => (
                <button
                  key={ic}
                  onClick={() => setForm(p => ({ ...p, icone: ic }))}
                  className={`w-9 h-9 rounded-lg text-lg transition-all ${form.icone === ic ? 'bg-[var(--accent-blue)] ring-2 ring-[var(--accent-blue)]' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[var(--text-muted)] text-xs block mb-2">Cor</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c}
                  onClick={() => setForm(p => ({ ...p, cor: c }))}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full transition-all ${form.cor === c ? 'ring-2 ring-white scale-110' : ''}`}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-[var(--text-muted)] text-xs block mb-1">Tipo</label>
            <div className="flex gap-2">
              {(['entrada', 'saida'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setForm(p => ({ ...p, tipo: t }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${form.tipo === t ? 'bg-[var(--accent-blue)] border-[var(--accent-blue)] text-white' : 'border-white/10 text-[var(--text-muted)]'}`}
                >
                  {t === 'entrada' ? 'Entrada' : 'Saída'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button className="flex-1" onClick={handleCreate} loading={createCategory.isPending}>Criar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
