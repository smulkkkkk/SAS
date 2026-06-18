import { useEffect, useRef } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useAuthStore } from '@/store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})

function AuthInitializer({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize)
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true
    initialize()
  }, [initialize])

  return <>{children}</>
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        {children}
      </AuthInitializer>
    </QueryClientProvider>
  )
}
