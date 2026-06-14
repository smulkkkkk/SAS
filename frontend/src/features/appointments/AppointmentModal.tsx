import { useState } from 'react'
import { Modal, Button } from '@/components/ui'
import { useCreateAppointment, useCancelAppointment, useServices } from '@/hooks'
import { useNotificationsStore } from '@/store'
import type { Appointment } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
  appointment?: Appointment
  defaultDate?: string
}

const HOURS = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
               '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30']

export function AppointmentModal({ open, onClose, appointment, defaultDate }: Props) {
  const [form, setForm] = useState({ nome: '', telefone: '', servico: '', data: defaultDate ?? '', hora: '' })
  const { data: services = [] } = useServices()
  const create = useCreateAppointment()
  const cancel = useCancelAppointment()
  const { addToast } = useNotificationsStore()

  const isView = !!appointment

  async function handleCreate() {
    if (!form.nome || !form.servico || !form.data || !form.hora) {
      addToast('Preencha todos os campos obrigatórios', 'error')
      return
    }
    try {
      await create.mutateAsync(form)
      addToast('Agendamento criado!', 'success')
      onClose()
    } catch {
      addToast('Erro ao criar agendamento', 'error')
    }
  }

  async function handleCancel() {
    if (!appointment) return
    if (!confirm('Cancelar este agendamento?')) return
    try {
      await cancel.mutateAsync(appointment.id)
      addToast('Agendamento cancelado', 'info')
      onClose()
    } catch {
      addToast('Erro ao cancelar agendamento', 'error')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isView ? 'Agendamento' : 'Novo Agendamento'}>
      {isView ? (
        <div className="space-y-4">
          {[
            { label: 'Cliente', value: appointment.nome },
            { label: 'Telefone', value: appointment.telefone || '—' },
            { label: 'Serviço', value: appointment.servico },
            { label: 'Data', value: appointment.data },
            { label: 'Horário', value: appointment.hora },
          ].map(f => (
            <div key={f.label}>
              <p className="text-[var(--text-muted)] text-xs">{f.label}</p>
              <p className="text-[var(--text-primary)] font-medium">{f.value}</p>
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={onClose}>Fechar</Button>
            <Button variant="danger" className="flex-1" onClick={handleCancel}>Cancelar Agendamento</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {[
            { key: 'nome', label: 'Nome completo *', type: 'text', placeholder: 'Ex: João Silva' },
            { key: 'telefone', label: 'Telefone', type: 'tel', placeholder: '(11) 99999-9999' },
            { key: 'data', label: 'Data *', type: 'date' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-[var(--text-muted)] text-xs block mb-1">{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={form[f.key as keyof typeof form]}
                min={f.type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
                onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] text-sm focus:outline-none" />
            </div>
          ))}
          <div>
            <label className="text-[var(--text-muted)] text-xs block mb-1">Serviço *</label>
            <select value={form.servico} onChange={e => setForm(p => ({...p, servico: e.target.value}))}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] text-sm focus:outline-none">
              <option value="">Selecione</option>
              {services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[var(--text-muted)] text-xs block mb-1">Horário *</label>
            <select value={form.hora} onChange={e => setForm(p => ({...p, hora: e.target.value}))}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] text-sm focus:outline-none">
              <option value="">Selecione</option>
              {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button className="flex-1" onClick={handleCreate} loading={create.isPending}>Agendar</Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
