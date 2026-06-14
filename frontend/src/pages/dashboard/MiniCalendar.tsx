import { useState } from 'react'
import { useAppointments } from '@/hooks'
import { toISODate, cn } from '@/utils'

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export function MiniCalendar() {
  const [, setSelectedDate] = useState(new Date())
  const { data: appointments = [] } = useAppointments()

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const apptDates = new Set(appointments.map(a => a.data))

  return (
    <div>
      <p className="text-[var(--text-muted)] text-xs mb-3">
        {today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
      </p>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {DAYS.map(d => (
          <p key={d} className="text-[var(--text-muted)] text-[10px] py-1">{d}</p>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const dateStr = toISODate(new Date(year, month, day))
          const isToday = day === today.getDate()
          const hasAppt = apptDates.has(dateStr)
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(new Date(year, month, day))}
              className={cn(
                'relative py-1 rounded-lg text-xs transition-all',
                isToday ? 'bg-[var(--accent-blue)] text-white font-semibold' : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-primary)]'
              )}
            >
              {day}
              {hasAppt && !isToday && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent-purple)]" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
