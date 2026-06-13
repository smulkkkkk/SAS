import { generateMonthlyData } from '@/utils'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const analyticsService = {
  async getOccupancyHeatmap(): Promise<number[][]> {
    await delay(500)
    return Array.from({ length: 7 }, () =>
      Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))
    )
  },

  async getTopServices(): Promise<Array<{ servico: string; count: number; receita: number }>> {
    await delay(400)
    const servicos = ['Corte de Cabelo','Manicure','Pedicure','Massagem Relaxante','Limpeza de Pele']
    return servicos.map((servico) => ({
      servico,
      count: Math.floor(20 + Math.random() * 80),
      receita: Math.floor(2000 + Math.random() * 8000),
    }))
  },

  async getCancellationRate(): Promise<number> {
    await delay(300)
    return Math.round(5 + Math.random() * 15)
  },

  async getTrends(): Promise<ReturnType<typeof generateMonthlyData>> {
    await delay(500)
    return generateMonthlyData(12)
  },
}
