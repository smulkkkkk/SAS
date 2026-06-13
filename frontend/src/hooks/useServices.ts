import { useQuery } from '@tanstack/react-query'
import { servicesService } from '@/services'

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: servicesService.getAll,
    staleTime: 5 * 60_000,
  })
}
