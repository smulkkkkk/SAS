import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppointments } from '@/hooks'
import { Button, Badge, Skeleton } from '@/components/ui'
import { AppointmentModal } from '@/features/appointments/AppointmentModal'
import { toISODate, cn } from '@/utils'
import type { Appointment } from '@/types'

const HOURS = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
               '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30']

const SERVICE_COLORS: Record<string, string> = {
  'Corte de Cabelo': '#3B82F6', 'Manicure': '#EC4899', 'Pedicure': '#8B5CF6',
  'Massagem Relaxante': '#10B981', 'Consulta Médica': '#F59E0B', 'Limpeza de Pele': '#06B6D4',
  'Hidratação Capilar': '#F97316', 'Depilação': '#6366F1',
}

export default function DayPage() {
  const [date, setDate] = useState(toISODate(new Date()))
  const [selected, setSelected] = useState<Appointment | undefined>()
  const [createOpen, setCreateOpen] = useState(false)
  const { data: appointments = [], isLoading } = useAppointments()

  const dayAppts = appointments.filter(a => a.data === date)

  function getAppt(hour: string) {
    return dayAppts.find(a => a.hora === hour)
  }

  return (
    <div className="p-6 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Agenda do Dia</h1>
          <p className="text-[var(--text-muted)] text-sm">{dayAppts.length} agendamentos</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] text-sm focus:outline-none" />
          <Button onClick={() => setCreateOpen(true)}>+ Novo</Button>
        </div>
      </div>

      <div className="space-y-1.5">
        {isLoading ? [...Array(8)].map((_, i) => <Skeleton key={i} variant="row" />) :
          HOURS.map((hour) => {
            const appt = getAppt(hour)
            const color = appt ? SERVICE_COLORS[appt.servico] ?? '#3B82F6' : null

            return (
              <motion.div
                key={hour}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer',
                  appt ? 'bg-white/5 hover:bg-white/8' : 'hover:bg-white/3'
                )}
                onClick={() => {
                  if (appt) setSelected(appt)
                  else setCreateOpen(true)
                }}
              >
                <span className="text-[var(--text-muted)] text-sm font-mono w-12 flex-shrink-0">{hour}</span>
                {appt ? (
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: color ?? '#3B82F6' }} />
                    <div>
                      <p className="text-[var(--text-primary)] text-sm font-medium">{appt.nome}</p>
                      <p className="text-[var(--text-muted)] text-xs">{appt.servico}</p>
                    </div>
                    <div className="ml-auto">
                      <Badge variant={appt.status === 'confirmado' ? 'success' : appt.status === 'cancelado' ? 'error' : 'warning'}>{appt.status}</Badge>
                    </div>
                  </div>
                ) : (
                  <p className="text-[var(--text-muted)] text-xs">— disponível</p>
                )}
              </motion.div>
            )
          })
        }
      </div>

      <AppointmentModal open={!!selected} onClose={() => setSelected(undefined)} appointment={selected} />
      <AppointmentModal open={createOpen} onClose={() => setCreateOpen(false)} defaultDate={date} />
    </div>
  )
}
