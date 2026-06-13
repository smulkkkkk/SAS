export type ClientStatus = 'Prospect' | 'Ativo' | 'VIP' | 'Inativo'

export interface Client {
  id: string
  nome: string
  email: string
  telefone: string
  status: ClientStatus
  tags: string[]
  totalGasto: number
  ultimaVisita: string   // YYYY-MM-DD
  totalAgendamentos: number
  avatar?: string
  notas?: string
}

export interface ClientHistoryEntry {
  id: string
  tipo: 'agendamento' | 'pagamento' | 'nota'
  descricao: string
  valor?: number
  data: string
}
