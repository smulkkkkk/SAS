import type { Client, ClientHistoryEntry } from '@/types'
import { generateClients, generateClientHistory } from '@/utils'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))
const randomDelay = () => delay(400 + Math.random() * 400)
const _clients = generateClients(50)

export const clientsService = {
  async getAll(): Promise<Client[]> {
    await randomDelay()
    return _clients
  },

  async getById(id: string): Promise<Client | undefined> {
    await randomDelay()
    return _clients.find((c) => c.id === id)
  },

  async update(id: string, dto: Partial<Client>): Promise<void> {
    await randomDelay()
    const idx = _clients.findIndex((c) => c.id === id)
    if (idx !== -1) Object.assign(_clients[idx], dto)
  },

  async getHistory(clientId: string): Promise<ClientHistoryEntry[]> {
    await randomDelay()
    return generateClientHistory(clientId)
  },
}
