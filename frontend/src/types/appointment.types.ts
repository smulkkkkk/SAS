export type AppointmentStatus = 'confirmado' | 'pendente' | 'cancelado' | 'concluido'

export interface Appointment {
  id: string
  nome: string
  telefone: string
  servico: string
  data: string   // YYYY-MM-DD
  hora: string   // HH:MM
  status: AppointmentStatus
}

export interface CreateAppointmentDto {
  nome: string
  telefone: string
  servico: string
  data: string
  hora: string
}

export interface TimeSlot {
  hora: string
  available: boolean
  appointment?: Appointment
}
