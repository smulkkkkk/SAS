import { motion } from 'framer-motion'
import { Card, Button, Badge } from '@/components/ui'
import { useNotificationsStore } from '@/store'

const PLANS = [
  { id: 'starter', name: 'Starter', price: 0, features: ['1 usuário', '50 agendamentos/mês', 'Dashboard básico'], current: false },
  { id: 'pro', name: 'Pro', price: 97, features: ['5 usuários', 'Ilimitado', 'Dashboard completo', 'Relatórios', '3D Premium'], current: true },
  { id: 'enterprise', name: 'Enterprise', price: 297, features: ['Ilimitado', 'White-label', 'API access', 'SLA 99.9%', 'Suporte dedicado'], current: false },
]

export default function BillingPage() {
  const { addToast } = useNotificationsStore()

  return (
    <div className="p-6 lg:p-8 max-w-[900px] mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Plano e Assinatura</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan, i) => (
          <motion.div key={plan.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`relative flex flex-col h-full ${plan.current ? 'border-gradient' : ''}`}>
              {plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="success">Plano atual</Badge>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-[var(--text-primary)] font-bold text-lg">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold text-[var(--text-primary)]">Grátis</span>
                  ) : (
                    <>
                      <span className="text-[var(--text-muted)] text-sm">R$</span>
                      <span className="text-3xl font-bold text-[var(--text-primary)]">{plan.price}</span>
                      <span className="text-[var(--text-muted)] text-sm">/mês</span>
                    </>
                  )}
                </div>
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <span className="text-[var(--status-success)] text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.current ? 'secondary' : 'primary'}
                className="w-full"
                onClick={() => addToast(plan.current ? 'Este é seu plano atual' : `Upgrade para ${plan.name} em breve!`, plan.current ? 'info' : 'success')}
              >
                {plan.current ? 'Plano atual' : `Fazer upgrade`}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <h2 className="text-[var(--text-primary)] font-semibold mb-4">Próxima cobrança</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--text-primary)]">PulseFlow Pro · R$ 97,00</p>
            <p className="text-[var(--text-muted)] text-sm">Renova em 13/07/2026</p>
          </div>
          <Badge variant="success" pulse>Ativo</Badge>
        </div>
      </Card>
    </div>
  )
}
