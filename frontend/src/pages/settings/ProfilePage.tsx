import { useState } from 'react'
import { Card, Button } from '@/components/ui'
import { useNotificationsStore } from '@/store'

export default function ProfilePage() {
  const [form, setForm] = useState({ nome: 'Admin', email: 'admin@pulseflow.com', telefone: '(11) 99999-0000', timezone: 'America/Sao_Paulo' })
  const [avatar, setAvatar] = useState<string | null>(null)
  const { addToast } = useNotificationsStore()

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = ev => setAvatar(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-[700px] mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Perfil</h1>

      <Card className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {avatar ? <img src={avatar} className="w-full h-full object-cover" alt="avatar" /> : 'A'}
          </div>
          <div>
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <span className="text-[var(--accent-blue)] text-sm font-medium hover:underline">Trocar foto</span>
            </label>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">PNG, JPG até 2MB</p>
          </div>
        </div>

        {/* Fields */}
        {[
          { key: 'nome', label: 'Nome completo', type: 'text' },
          { key: 'email', label: 'Email', type: 'email' },
          { key: 'telefone', label: 'Telefone', type: 'tel' },
        ].map(f => (
          <div key={f.key}>
            <label className="text-[var(--text-muted)] text-xs block mb-1.5">{f.label}</label>
            <input type={f.type} value={form[f.key as keyof typeof form]}
              onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-blue)]/50" />
          </div>
        ))}

        <div>
          <label className="text-[var(--text-muted)] text-xs block mb-1.5">Fuso horário</label>
          <select value={form.timezone} onChange={e => setForm(p => ({...p, timezone: e.target.value}))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] text-sm focus:outline-none">
            <option value="America/Sao_Paulo">América/São Paulo (GMT-3)</option>
            <option value="America/Manaus">América/Manaus (GMT-4)</option>
            <option value="America/Belem">América/Belém (GMT-3)</option>
          </select>
        </div>

        <Button onClick={() => addToast('Perfil salvo com sucesso!', 'success')}>Salvar alterações</Button>
      </Card>
    </div>
  )
}
