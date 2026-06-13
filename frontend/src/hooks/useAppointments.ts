import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentsService } from '@/services'
import type { CreateAppointmentDto } from '@/types'

export function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentsService.getAll,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  })
}

export function useCreateAppointment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateAppointmentDto) => appointmentsService.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  })
}

export function useCancelAppointment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => appointmentsService.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  })
}
