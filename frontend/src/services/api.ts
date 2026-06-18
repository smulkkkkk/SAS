// frontend/src/services/api.ts
import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'

export const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Inject Bearer token on every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Refresh on 401
let isRefreshing = false
let queue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status !== 401 || original._retry) {
      console.error('[API Error]', err.response?.data ?? err.message)
      return Promise.reject(err)
    }
    original._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`
            resolve(api(original))
          },
          reject,
        })
      })
    }

    isRefreshing = true
    const ok = await useAuthStore.getState().refreshToken()
    isRefreshing = false

    if (!ok) {
      queue.forEach(({ reject }) => reject(new Error('Session expired')))
      queue = []
      window.location.href = '/login'
      return Promise.reject(err)
    }

    const newToken = useAuthStore.getState().accessToken!
    queue.forEach(({ resolve }) => resolve(newToken))
    queue = []
    original.headers.Authorization = `Bearer ${newToken}`
    return api(original)
  }
)
