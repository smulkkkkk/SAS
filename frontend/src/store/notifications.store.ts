import { create } from 'zustand'
import type { Toast, ToastType } from '@/types'

interface NotificationsState {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType, duration?: number) => void
  removeToast: (id: string) => void
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  toasts: [],
  addToast: (message, type = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    set((s) => ({ toasts: [...s.toasts, { id, message, type, duration }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), duration)
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
