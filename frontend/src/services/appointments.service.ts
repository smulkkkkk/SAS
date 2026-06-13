import { api } from './api'
import type { Appointment, CreateAppointmentDto } from '@/types'

export const appointmentsService = {
  async getAll(): Promise<Appointment[]> {
    const { data } = await api.get<Appointment[]>('/agendamentos')
    return data
  },

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const { data } = await api.post<Appointment>('/agendamentos', dto)
    return data
  },

  async cancel(id: string): Promise<void> {
    await api.delete(`/agendamentos?id=${id}`)
  },
}

export const servicesService = {
  async getAll(): Promise<string[]> {
    const { data } = await api.get<string[]>('/servicos')
    return data
  },
}
