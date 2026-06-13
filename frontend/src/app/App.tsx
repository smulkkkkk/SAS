import { BrowserRouter } from 'react-router-dom'
import { Providers } from './providers'
import { AppRoutes } from './routes'
import { ToastContainer } from '@/components/ui/Toast'
import { AccessibilityPanel } from '@/components/ui/AccessibilityPanel'
import '@/styles/globals.css'

export function App() {
  return (
    <BrowserRouter>
      <Providers>
        <AppRoutes />
        <ToastContainer />
        <AccessibilityPanel />
      </Providers>
    </BrowserRouter>
  )
}
