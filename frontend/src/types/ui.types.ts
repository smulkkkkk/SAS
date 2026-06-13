export type Theme = 'dark' | 'light' | 'contrast'
export type FontFamily = 'inter' | 'lexend' | 'mono'
export type FontSize = 12 | 14 | 16 | 18 | 20
export type Density = 'compact' | 'normal' | 'comfortable'
export type AnimationLevel = 'full' | 'reduced' | 'none'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

export interface NavItem {
  label: string
  path: string
  icon: string
  children?: NavItem[]
}
