// frontend/src/services/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Injeta token Bearer em cada request
api.interceptors.request.use((config) => {
  // Importação dinâmica evita circular dependency
  const { useAuthStore } = require('@/store')
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Refresh automático em 401
let isRefreshing = false
let queue: Array<(token: string) => void> = []

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
      return new Promise((resolve) => {
        queue.push((token) => {
          original.headers.Authorization = `Bearer ${token}`
          resolve(api(original))
        })
      })
    }

    isRefreshing = true
    const { useAuthStore } = require('@/store')
    const ok = await useAuthStore.getState().refreshToken()
    isRefreshing = false

    if (!ok) {
      queue = []
      window.location.href = '/login'
      return Promise.reject(err)
    }

    const newToken = useAuthStore.getState().accessToken!
    queue.forEach((cb) => cb(newToken))
    queue = []
    original.headers.Authorization = `Bearer ${newToken}`
    return api(original)
  }
)
