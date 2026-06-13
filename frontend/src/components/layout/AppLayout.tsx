import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <Outlet />
    </div>
  )
}
