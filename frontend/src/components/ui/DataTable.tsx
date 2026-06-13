import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Button } from './Button'
import { Skeleton } from './Skeleton'
import { EmptyState } from './EmptyState'
import { cn } from '@/utils'

export interface Column<T> {
  key: keyof T | string
  label: string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

interface Props<T extends Record<string, unknown>> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  pageSize?: number
  searchable?: boolean
  onRowClick?: (row: T) => void
}

export function DataTable<T extends Record<string, unknown>>({ data, columns, loading, pageSize = 10, searchable, onRowClick }: Props<T>) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null)

  const filtered = useMemo(() => {
    let rows = [...data]
    if (search) rows = rows.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(search.toLowerCase())))
    if (sort) rows.sort((a, b) => {
      const av = String(a[sort.key] ?? '')
      const bv = String(b[sort.key] ?? '')
      return sort.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
    return rows
  }, [data, search, sort])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  function toggleSort(key: string) {
    setSort((s) => s?.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' })
    setPage(1)
  }

  if (loading) return <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} variant="row" />)}</div>
  if (!data.length) return <EmptyState icon="📋" title="Nenhum dado encontrado" />

  return (
    <div className="space-y-4">
      {searchable && (
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Buscar..."
          className="w-full max-w-xs px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--accent-blue)]/50"
        />
      )}
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => col.sortable && toggleSort(String(col.key))}
                  style={{ width: col.width }}
                  className={cn('px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider', col.sortable && 'cursor-pointer hover:text-[var(--text-primary)] transition-colors select-none')}
                >
                  {col.label}
                  {sort?.key === String(col.key) && <span className="ml-1">{sort.dir === 'asc' ? '↑' : '↓'}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => onRowClick?.(row)}
                className={cn('border-b border-white/[0.03] transition-colors', onRowClick && 'cursor-pointer hover:bg-white/5')}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-sm text-[var(--text-primary)]">
                    {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '-')}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[var(--text-muted)] text-xs">
            {filtered.length} resultados · página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹</Button>
            <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>›</Button>
          </div>
        </div>
      )}
    </div>
  )
}
