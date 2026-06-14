import { useAppointments } from '@/hooks'
import { Card } from '@/components/ui'
import { BarChart } from '@/components/charts'

const HOURS = ['08','09','10','11','13','14','15','16','17']
const DAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

export default function StatsPage() {
  const { data: appointments = [] } = useAppointments()

  const heatmap = DAYS.map((_, dayIdx) =>
    HOURS.map(hour =>
      appointments.filter(a => {
        const d = new Date(a.data + 'T00:00:00')
        return d.getDay() === dayIdx && a.hora.startsWith(hour)
      }).length
    )
  )

  const maxVal = Math.max(...heatmap.flat(), 1)

  const serviceStats = Object.entries(
    appointments.reduce((acc, a) => { acc[a.servico] = (acc[a.servico] || 0) + 1; return acc }, {} as Record<string, number>)
  ).map(([servico, count]) => ({ servico, count })).sort((a,b) => b.count - a.count)

  const cancelados = appointments.filter(a => a.status === 'cancelado').length
  const cancelRate = appointments.length > 0 ? Math.round((cancelados / appointments.length) * 100) : 0

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Estatísticas de Agendamentos</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total de Agendamentos', value: appointments.length, icon: '📅' },
          { label: 'Taxa de Cancelamento', value: `${cancelRate}%`, icon: '❌' },
          { label: 'Média por Dia', value: appointments.length > 0 ? (appointments.length / 30).toFixed(1) : '0', icon: '📊' },
        ].map(s => (
          <Card key={s.label} className="flex items-center gap-4">
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{s.value}</p>
              <p className="text-[var(--text-muted)] text-sm">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Heatmap */}
      <Card>
        <h2 className="text-[var(--text-primary)] font-semibold mb-4">Horários Mais Movimentados</h2>
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="grid gap-1" style={{ gridTemplateColumns: `40px repeat(${HOURS.length}, 1fr)` }}>
              <div />
              {HOURS.map(h => <p key={h} className="text-center text-[var(--text-muted)] text-[10px] mb-1">{h}h</p>)}
              {DAYS.map((day, di) => (
                <>
                  <p key={`label-${di}`} className="text-[var(--text-muted)] text-xs flex items-center">{day}</p>
                  {HOURS.map((_, hi) => {
                    const val = heatmap[di][hi]
                    const pct = val / maxVal
                    return (
                      <div
                        key={hi}
                        className="aspect-square rounded-md transition-all"
                        style={{ backgroundColor: `rgba(59,130,246,${0.05 + pct * 0.7})` }}
                        title={`${val} agendamentos`}
                      />
                    )
                  })}
                </>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Top services */}
      {serviceStats.length > 0 && (
        <Card>
          <h2 className="text-[var(--text-primary)] font-semibold mb-4">Top Serviços</h2>
          <BarChart
            data={serviceStats.slice(0,6)}
            xKey="servico"
            series={[{ key: 'count', label: 'Agendamentos', color: '#3B82F6' }]}
            currency={false}
            height={200}
          />
        </Card>
      )}
    </div>
  )
}
