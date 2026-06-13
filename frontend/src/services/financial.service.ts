import type { Transaction, Payable, Category, FinancialSummary, MonthlyData, FinancialHealth } from '@/types'
import { generateTransactions, generatePayables, generateCategories, generateMonthlyData } from '@/utils'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))
const randomDelay = () => delay(400 + Math.random() * 400)

const _transactions = generateTransactions(80)
const _payables = generatePayables(24)
const _categories = generateCategories()
const _monthly = generateMonthlyData(12)

export const financialService = {
  async getSummary(): Promise<FinancialSummary> {
    await randomDelay()
    const receita = _monthly.slice(-1)[0].receita
    const despesa = _monthly.slice(-1)[0].despesa
    const hoje = new Date().toISOString().split('T')[0]
    return {
      receita,
      despesa,
      lucro: receita - despesa,
      fluxoCaixa: receita - despesa * 0.8,
      contasVencendoHoje: _payables.filter((p) => p.vencimento === hoje && p.status === 'pendente').length,
      ticketMedio: Math.round(receita / 120),
    }
  },

  async getTransactions(): Promise<Transaction[]> {
    await randomDelay()
    return [..._transactions].sort((a, b) => b.data.localeCompare(a.data))
  },

  async getPayables(): Promise<Payable[]> {
    await randomDelay()
    return [..._payables].sort((a, b) => a.vencimento.localeCompare(b.vencimento))
  },

  async createPayable(dto: Omit<Payable, 'id'>): Promise<Payable> {
    await randomDelay()
    const p: Payable = { ...dto, id: `p${Date.now()}` }
    _payables.push(p)
    return p
  },

  async updatePayableStatus(id: string, status: Payable['status']): Promise<void> {
    await randomDelay()
    const p = _payables.find((x) => x.id === id)
    if (p) p.status = status
  },

  async deletePayable(id: string): Promise<void> {
    await randomDelay()
    const idx = _payables.findIndex((x) => x.id === id)
    if (idx !== -1) _payables.splice(idx, 1)
  },

  async getCategories(): Promise<Category[]> {
    await randomDelay()
    return _categories
  },

  async createCategory(dto: Omit<Category, 'id' | 'gasto'>): Promise<Category> {
    await randomDelay()
    const c: Category = { ...dto, id: `cat${Date.now()}`, gasto: 0 }
    _categories.push(c)
    return c
  },

  async updateCategory(id: string, dto: Partial<Category>): Promise<void> {
    await randomDelay()
    const idx = _categories.findIndex((x) => x.id === id)
    if (idx !== -1) Object.assign(_categories[idx], dto)
  },

  async deleteCategory(id: string): Promise<void> {
    await randomDelay()
    const idx = _categories.findIndex((x) => x.id === id)
    if (idx !== -1) _categories.splice(idx, 1)
  },

  async getMonthlyData(): Promise<MonthlyData[]> {
    await randomDelay()
    return _monthly
  },

  async getHealth(): Promise<FinancialHealth> {
    await randomDelay()
    const last = _monthly[_monthly.length - 1]
    const prev = _monthly[_monthly.length - 2]
    const burnRate = last.despesa / last.receita
    const runway = last.lucro > 0 ? Math.min(24, Math.round(last.lucro * 6 / last.despesa)) : 0
    const insights: string[] = []
    if (last.despesa > prev.despesa * 1.1) insights.push(`Despesas cresceram ${(((last.despesa/prev.despesa)-1)*100).toFixed(0)}% vs mês passado`)
    if (burnRate > 0.7) insights.push('Burn rate elevado — despesas representam mais de 70% da receita')
    if (runway < 3) insights.push('Runway abaixo de 3 meses — atenção ao fluxo de caixa')
    if (last.receita > prev.receita * 1.05) insights.push(`Receita cresceu ${(((last.receita/prev.receita)-1)*100).toFixed(0)}% este mês`)
    return {
      score: Math.min(100, Math.round(60 + (last.lucro / last.receita) * 40 * (1 - burnRate * 0.5))),
      liquidez: Math.round((last.receita / last.despesa) * 100) / 100,
      burnRate: Math.round(burnRate * 100),
      runway,
      insights,
    }
  },
}
