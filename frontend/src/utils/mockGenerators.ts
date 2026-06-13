import type { Transaction, Payable, Category, MonthlyData, Client, ClientHistoryEntry } from '@/types'

const MONTH_NAMES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const SERVICOS = ['Corte de Cabelo','Manicure','Pedicure','Massagem Relaxante','Consulta Médica','Limpeza de Pele','Hidratação Capilar','Depilação']
const CATEGORIAS = ['Aluguel','Salários','Marketing','Insumos','Software','Equipamentos','Impostos','Outros']
const NOMES = ['Ana Costa','Bruno Lima','Carla Mendes','Diego Silva','Elena Ferreira','Fábio Souza','Gisele Oliveira','Henrique Santos','Isabela Ramos','João Pedro','Karen Alves','Lucas Martins','Mariana Torres','Nelson Cruz','Olivia Pereira']

export function generateMonthlyData(months = 12): MonthlyData[] {
  let baseReceita = 45_000
  let baseDespesa = 28_000
  return Array.from({ length: months }, (_, i) => {
    const idx = (new Date().getMonth() - months + 1 + i + 12) % 12
    baseReceita += (Math.random() - 0.4) * 5_000
    baseDespesa += (Math.random() - 0.5) * 3_000
    const receita = Math.max(30_000, baseReceita)
    const despesa = Math.max(18_000, baseDespesa)
    return { mes: MONTH_NAMES[idx], receita: Math.round(receita), despesa: Math.round(despesa), lucro: Math.round(receita - despesa) }
  })
}

export function generateTransactions(count = 60): Transaction[] {
  return Array.from({ length: count }, (_, i) => {
    const tipo = Math.random() > 0.35 ? 'entrada' : 'saida' as const
    const daysAgo = Math.floor(Math.random() * 90)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    return {
      id: `t${i+1}`,
      descricao: tipo === 'entrada' ? `Pgto ${SERVICOS[i % SERVICOS.length]}` : `${CATEGORIAS[i % CATEGORIAS.length]}`,
      valor: tipo === 'entrada' ? Math.round(50 + Math.random() * 500) : Math.round(200 + Math.random() * 3000),
      tipo,
      categoria: CATEGORIAS[i % CATEGORIAS.length],
      data: date.toISOString().split('T')[0],
      status: Math.random() > 0.15 ? 'pago' : 'pendente',
    }
  })
}

export function generatePayables(count = 20): Payable[] {
  const statuses: Array<'pendente'|'pago'|'vencido'> = ['pendente','pago','vencido']
  return Array.from({ length: count }, (_, i) => {
    const tipo = i % 2 === 0 ? 'pagar' : 'receber' as const
    const daysOffset = Math.floor(Math.random() * 60) - 15
    const date = new Date()
    date.setDate(date.getDate() + daysOffset)
    return {
      id: `p${i+1}`,
      descricao: `${CATEGORIAS[i % CATEGORIAS.length]} - ${NOMES[i % NOMES.length]}`,
      valor: Math.round(500 + Math.random() * 5000),
      tipo,
      vencimento: date.toISOString().split('T')[0],
      status: daysOffset < -1 && statuses[i % 3] !== 'pago' ? 'vencido' : statuses[i % 3],
      fornecedorCliente: NOMES[i % NOMES.length],
      categoria: CATEGORIAS[i % CATEGORIAS.length],
    }
  })
}

export function generateCategories(): Category[] {
  return CATEGORIAS.map((nome, i) => ({
    id: `cat${i+1}`,
    nome,
    cor: ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#EF4444','#06B6D4','#EC4899','#84CC16'][i],
    icone: ['home','users','megaphone','package','cpu','monitor','receipt','more-horizontal'][i],
    orcamento: Math.round(3000 + Math.random() * 7000),
    gasto: Math.round(1000 + Math.random() * 6000),
    tipo: i < 2 ? 'entrada' : 'saida',
  }))
}

export function generateClients(count = 50): Client[] {
  const statuses: Array<Client['status']> = ['Prospect', 'Ativo', 'VIP', 'Inativo']
  return Array.from({ length: count }, (_, i) => {
    const daysAgo = Math.floor(Math.random() * 180)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    return {
      id: `c${i+1}`,
      nome: NOMES[i % NOMES.length] + (i >= NOMES.length ? ` ${Math.ceil((i+1)/NOMES.length)}` : ''),
      email: `cliente${i+1}@email.com`,
      telefone: `(11) 9${String(Math.floor(Math.random()*90000+10000))}-${String(Math.floor(Math.random()*9000+1000))}`,
      status: statuses[i % statuses.length],
      tags: [SERVICOS[i % SERVICOS.length]],
      totalGasto: Math.round(500 + Math.random() * 8000),
      ultimaVisita: date.toISOString().split('T')[0],
      totalAgendamentos: Math.floor(1 + Math.random() * 20),
    }
  })
}

export function generateClientHistory(clientId: string): ClientHistoryEntry[] {
  return Array.from({ length: 8 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i * 15)
    const tipos: Array<ClientHistoryEntry['tipo']> = ['agendamento','pagamento','nota']
    return {
      id: `h${clientId}-${i}`,
      tipo: tipos[i % tipos.length],
      descricao: tipos[i % tipos.length] === 'agendamento'
        ? `Agendamento: ${SERVICOS[i % SERVICOS.length]}`
        : tipos[i % tipos.length] === 'pagamento'
        ? `Pagamento recebido`
        : `Nota interna adicionada`,
      valor: tipos[i % tipos.length] !== 'nota' ? Math.round(80 + Math.random() * 300) : undefined,
      data: date.toISOString().split('T')[0],
    }
  })
}
