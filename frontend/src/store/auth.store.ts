// frontend/src/store/auth.store.ts
import { create } from 'zustand'
import axios from 'axios'

interface AuthUser {
  id: number
  email: string
  name: string
  role: string
}

interface AuthState {
  accessToken: string | null
  user: AuthUser | null
  isInitialized: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<boolean>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isInitialized: false,

  initialize: async () => {
    await get().refreshToken()
  },

  login: async (email, password) => {
    const res = await axios.post('/auth/login', { email, password }, { withCredentials: true })
    set({ accessToken: res.data.access_token, user: res.data.user, isInitialized: true })
  },

  logout: async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true })
    } finally {
      set({ accessToken: null, user: null })
    }
  },

  refreshToken: async () => {
    try {
      const res = await axios.post('/auth/refresh', {}, { withCredentials: true })
      set({ accessToken: res.data.access_token, user: res.data.user, isInitialized: true })
      return true
    } catch {
      set({ accessToken: null, user: null, isInitialized: true })
      return false
    }
  },
}))
