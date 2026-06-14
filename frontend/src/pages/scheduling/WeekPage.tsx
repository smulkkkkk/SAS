import { useState } from 'react'
import { useAppointments } from '@/hooks'
import { Button } from '@/components/ui'
import { AppointmentModal } from '@/features/appointments/AppointmentModal'
import { getWeekDays, toISODate, cn } from '@/utils'
import type { Appointment } from '@/types'

const HOURS = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00']
const DAY_NAMES = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
const SERVICE_COLORS: Record<string, string> = {
  'Corte de Cabelo': '#3B82F6', 'Manicure': '#EC4899', 'Pedicure': '#8B5CF6',
  'Massagem Relaxante': '#10B981', 'Consulta Médica': '#F59E0B', 'Limpeza de Pele': '#06B6D4',
}

export default function WeekPage() {
  const [baseDate, setBaseDate] = useState(new Date())
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selected, setSelected] = useState<Appointment | undefined>()
  const { data: appointments = [] } = useAppointments()

  const weekDays = getWeekDays(baseDate)
  const today = toISODate(new Date())

  function getAppts(date: Date, hour: string) {
    const d = toISODate(date)
    return appointments.filter(a => a.data === d && a.hora.startsWith(hour.split(':')[0]))
  }

  function prevWeek() { const d = new Date(baseDate); d.setDate(d.getDate() - 7); setBaseDate(d) }
  function nextWeek() { const d = new Date(baseDate); d.setDate(d.getDate() + 7); setBaseDate(d) }

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Agenda Semanal</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={prevWeek}>‹</Button>
          <span className="text-[var(--text-muted)] text-sm px-2">
            {weekDays[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} — {weekDays[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </span>
          <Button variant="secondary" size="sm" onClick={nextWeek}>›</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div />
            {weekDays.map((d, i) => (
              <div key={i} className={cn('text-center py-2 rounded-xl text-sm', toISODate(d) === today && 'bg-[var(--accent-blue)]/10')}>
                <p className="text-[var(--text-muted)] text-xs">{DAY_NAMES[d.getDay()]}</p>
                <p className={cn('font-medium', toISODate(d) === today ? 'text-[var(--accent-blue)]' : 'text-[var(--text-primary)]')}>
                  {d.getDate()}
                </p>
              </div>
            ))}
          </div>

          {/* Grid */}
          {HOURS.map(hour => (
            <div key={hour} className="grid grid-cols-8 gap-1 mb-1">
              <div className="flex items-center justify-end pr-2">
                <span className="text-[var(--text-muted)] text-xs font-mono">{hour}</span>
              </div>
              {weekDays.map((d, di) => {
                const appts = getAppts(d, hour)
                return (
                  <div
                    key={di}
                    onClick={() => { setSelectedDate(toISODate(d)); setCreateOpen(true) }}
                    className="min-h-[48px] rounded-lg bg-white/3 hover:bg-white/6 transition-all cursor-pointer p-1 space-y-0.5"
                  >
                    {appts.slice(0,2).map(a => (
                      <div key={a.id}
                        onClick={e => { e.stopPropagation(); setSelected(a) }}
                        className="rounded-md px-1 py-0.5 text-[10px] text-white truncate cursor-pointer"
                        style={{ backgroundColor: SERVICE_COLORS[a.servico] ?? '#3B82F6' }}
                      >
                        {a.nome.split(' ')[0]}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <AppointmentModal open={!!selected} onClose={() => setSelected(undefined)} appointment={selected} />
      <AppointmentModal open={createOpen} onClose={() => setCreateOpen(false)} defaultDate={selectedDate} />
    </div>
  )
}
