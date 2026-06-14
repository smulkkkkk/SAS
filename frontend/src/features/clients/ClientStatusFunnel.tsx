import type { Client } from '@/types'

const FUNNEL_STAGES: Client['status'][] = ['Prospect', 'Ativo', 'VIP', 'Inativo']

interface Props { status: Client['status'] }

export function ClientStatusFunnel({ status }: Props) {
  const stageIdx = FUNNEL_STAGES.indexOf(status)

  return (
    <div className="flex items-center gap-1">
      {FUNNEL_STAGES.filter(s => s !== 'Inativo').map((stage, i) => {
        const active = stageIdx === FUNNEL_STAGES.indexOf(stage)
        const past = stageIdx > i
        return (
          <div key={stage} className="flex items-center flex-1">
            <div className={`flex-1 py-2 px-3 rounded-xl text-center text-xs font-medium transition-all ${active ? 'bg-[var(--accent-blue)] text-white' : past ? 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue)]' : 'bg-white/5 text-[var(--text-muted)]'}`}>
              {stage}
            </div>
            {i < 2 && <div className={`w-4 h-0.5 flex-shrink-0 ${past ? 'bg-[var(--accent-blue)]' : 'bg-white/10'}`} />}
          </div>
        )
      })}
    </div>
  )
}
