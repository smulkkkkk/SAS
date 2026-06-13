export type TransactionType = 'entrada' | 'saida'
export type PayableStatus = 'pendente' | 'pago' | 'vencido'
export type PayableType = 'pagar' | 'receber'

export interface Transaction {
  id: string
  descricao: string
  valor: number
  tipo: TransactionType
  categoria: string
  data: string   // YYYY-MM-DD
  status: PayableStatus
}

export interface Payable {
  id: string
  descricao: string
  valor: number
  tipo: PayableType
  vencimento: string
  status: PayableStatus
  parcelas?: number
  parcelaAtual?: number
  fornecedorCliente: string
  categoria: string
}

export interface Category {
  id: string
  nome: string
  cor: string
  icone: string
  orcamento: number
  gasto: number
  tipo: TransactionType
}

export interface FinancialSummary {
  receita: number
  despesa: number
  lucro: number
  fluxoCaixa: number
  contasVencendoHoje: number
  ticketMedio: number
}

export interface MonthlyData {
  mes: string   // 'Jan', 'Fev', etc.
  receita: number
  despesa: number
  lucro: number
}

export interface FinancialHealth {
  score: number          // 0–100
  liquidez: number
  burnRate: number
  runway: number         // meses
  insights: string[]
}
