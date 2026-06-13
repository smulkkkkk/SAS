import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientsService } from '@/services'
import type { Client } from '@/types'

export function useClients() {
  return useQuery({ queryKey: ['clients'], queryFn: clientsService.getAll, staleTime: 60_000 })
}

export function useClient(id: string) {
  return useQuery({ queryKey: ['clients', id], queryFn: () => clientsService.getById(id), staleTime: 60_000 })
}

export function useClientHistory(clientId: string) {
  return useQuery({ queryKey: ['clients', clientId, 'history'], queryFn: () => clientsService.getHistory(clientId), staleTime: 60_000 })
}

export function useUpdateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<Client> }) => clientsService.update(id, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['clients'] })
      qc.invalidateQueries({ queryKey: ['clients', id] })
    },
  })
}
