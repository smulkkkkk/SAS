import { useState } from 'react'
import { useAppointments } from '@/hooks'
import { AppointmentModal } from '@/features/appointments/AppointmentModal'
import { Button } from '@/components/ui'
import { toISODate, cn } from '@/utils'
import type { Appointment } from '@/types'

const DAY_NAMES = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

export default function MonthPage() {
  const [date, setDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [selected, setSelected] = useState<Appointment | undefined>()
  const { data: appointments = [] } = useAppointments()

  const year = date.getFullYear()
  const month = date.getMonth()
  const today = toISODate(new Date())

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({length: daysInMonth}, (_, i) => i + 1)]

  function getAppts(day: number) {
    const d = toISODate(new Date(year, month, day))
    return appointments.filter(a => a.data === d)
  }

  const intensity = (count: number) => {
    if (count === 0) return 'bg-white/3'
    if (count <= 2) return 'bg-[var(--accent-blue)]/10'
    if (count <= 5) return 'bg-[var(--accent-blue)]/25'
    return 'bg-[var(--accent-blue)]/40'
  }

  function prev() { setDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)) }
  function next() { setDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)) }

  const selectedDayAppts = selectedDate ? appointments.filter(a => a.data === selectedDate) : []

  return (
    <div className="p-6 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Agenda Mensal</h1>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="p-2 rounded-lg hover:bg-white/5 text-[var(--text-muted)]">‹</button>
          <span className="text-[var(--text-primary)] font-medium px-2">
            {date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={next} className="p-2 rounded-lg hover:bg-white/5 text-[var(--text-muted)]">›</button>
          <Button onClick={() => setCreateOpen(true)}>+ Novo</Button>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-7 mb-2">
          {DAY_NAMES.map(d => <p key={d} className="text-center text-[var(--text-muted)] text-xs py-2">{d}</p>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />
            const d = toISODate(new Date(year, month, day))
            const appts = getAppts(day)
            const isToday = d === today
            const isSelected = d === selectedDate
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(prev => prev === d ? '' : d)}
                className={cn(
                  'aspect-square rounded-xl p-1 transition-all flex flex-col items-center justify-start pt-1.5',
                  intensity(appts.length),
                  isToday && 'ring-2 ring-[var(--accent-blue)]',
                  isSelected && 'ring-2 ring-[var(--accent-purple)]'
                )}
              >
                <span className={cn('text-sm font-medium', isToday ? 'text-[var(--accent-blue)]' : 'text-[var(--text-primary)]')}>{day}</span>
                {appts.length > 0 && <span className="text-[9px] text-[var(--text-muted)] mt-0.5">{appts.length}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && selectedDayAppts.length > 0 && (
        <div className="space-y-2">
          <p className="text-[var(--text-muted)] text-sm">{selectedDayAppts.length} agendamento{selectedDayAppts.length > 1 ? 's' : ''}</p>
          {selectedDayAppts.map(a => (
            <div key={a.id} onClick={() => setSelected(a)}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 cursor-pointer transition-all">
              <span className="text-[var(--accent-blue)] font-mono text-sm">{a.hora}</span>
              <div>
                <p className="text-[var(--text-primary)] text-sm font-medium">{a.nome}</p>
                <p className="text-[var(--text-muted)] text-xs">{a.servico}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AppointmentModal open={!!selected} onClose={() => setSelected(undefined)} appointment={selected} />
      <AppointmentModal open={createOpen} onClose={() => setCreateOpen(false)} defaultDate={selectedDate} />
    </div>
  )
}
