import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarCollapsed: boolean
  mobileDrawerOpen: boolean
  toggleSidebar: () => void
  setMobileDrawer: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileDrawerOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setMobileDrawer: (open) => set({ mobileDrawerOpen: open }),
    }),
    { name: 'pulseflow-ui' }
  )
)
