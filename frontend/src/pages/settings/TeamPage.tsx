import { useState } from 'react'
import { Card, Button, Badge, Modal } from '@/components/ui'
import { useNotificationsStore } from '@/store'

interface Member { id: string; nome: string; email: string; role: 'Admin' | 'Editor' | 'Viewer'; status: 'ativo' | 'pendente' }

const MOCK_TEAM: Member[] = [
  { id: '1', nome: 'Admin Principal', email: 'admin@pulseflow.com', role: 'Admin', status: 'ativo' },
  { id: '2', nome: 'João Silva', email: 'joao@empresa.com', role: 'Editor', status: 'ativo' },
  { id: '3', nome: 'Maria Santos', email: 'maria@empresa.com', role: 'Viewer', status: 'pendente' },
]

export default function TeamPage() {
  const [team, setTeam] = useState(MOCK_TEAM)
  const [modalOpen, setModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'Editor'|'Viewer'>('Viewer')
  const { addToast } = useNotificationsStore()

  function handleInvite() {
    if (!inviteEmail) { addToast('Informe o email', 'error'); return }
    const newMember: Member = { id: Date.now().toString(), nome: inviteEmail.split('@')[0], email: inviteEmail, role: inviteRole, status: 'pendente' }
    setTeam(t => [...t, newMember])
    addToast(`Convite enviado para ${inviteEmail}`, 'success')
    setModalOpen(false)
    setInviteEmail('')
  }

  function removeById(id: string) {
    setTeam(t => t.filter(m => m.id !== id))
    addToast('Membro removido', 'info')
  }

  return (
    <div className="p-6 lg:p-8 max-w-[700px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Equipe</h1>
        <Button size="sm" onClick={() => setModalOpen(true)}>+ Convidar</Button>
      </div>

      <Card className="divide-y divide-white/5">
        {team.map(m => (
          <div key={m.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center text-white font-semibold flex-shrink-0">
              {m.nome.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[var(--text-primary)] text-sm font-medium">{m.nome}</p>
              <p className="text-[var(--text-muted)] text-xs">{m.email}</p>
            </div>
            <Badge variant={m.status === 'ativo' ? 'success' : 'warning'}>{m.status}</Badge>
            <Badge variant="default">{m.role}</Badge>
            {m.role !== 'Admin' && (
              <button onClick={() => removeById(m.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--text-muted)] text-xs">✕</button>
            )}
          </div>
        ))}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Convidar membro" size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-[var(--text-muted)] text-xs block mb-1">Email *</label>
            <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="email@empresa.com"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] text-sm focus:outline-none" />
          </div>
          <div>
            <label className="text-[var(--text-muted)] text-xs block mb-1">Permissão</label>
            <div className="flex gap-2">
              {(['Editor','Viewer'] as const).map(r => (
                <button key={r} onClick={() => setInviteRole(r)}
                  className={`flex-1 py-2 rounded-xl text-sm border transition-all ${inviteRole === r ? 'bg-[var(--accent-blue)] border-[var(--accent-blue)] text-white' : 'border-white/10 text-[var(--text-muted)]'}`}>{r}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button className="flex-1" onClick={handleInvite}>Convidar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
