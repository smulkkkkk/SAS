import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/utils'
import type { NavItem as NavItemType } from '@/types'

interface Props {
  item: NavItemType
  collapsed: boolean
}

export function NavItem({ item, collapsed }: Props) {
  const [open, setOpen] = useState(false)

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen((o) => !o)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
            'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5',
            collapsed && 'justify-center'
          )}
        >
          <span className="text-lg flex-shrink-0">{item.icon}</span>
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
                ›
              </motion.span>
            </>
          )}
        </button>
        <AnimatePresence>
          {open && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pl-4 mt-1 space-y-0.5"
            >
              {item.children.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                      isActive
                        ? 'text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 font-medium'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5'
                    )
                  }
                >
                  <span className="text-base">{child.icon}</span>
                  <span>{child.label}</span>
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
          isActive
            ? 'text-[var(--accent-blue)] bg-[var(--accent-blue)]/10'
            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5',
          collapsed && 'justify-center'
        )
      }
      title={collapsed ? item.label : undefined}
    >
      <span className="text-lg flex-shrink-0">{item.icon}</span>
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  )
}
