import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store'

interface Props { children: React.ReactNode }

export function ProtectedRoute({ children }: Props) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const isInitialized = useAuthStore((s) => s.isInitialized)
  if (!isInitialized) return null // wait for initialize() to complete
  if (!accessToken) return <Navigate to="/login" replace />
  return <>{children}</>
}
