export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(1)}k`
  return formatCurrency(value)
}

export function formatDelta(current: number, previous: number): { value: string; positive: boolean } {
  if (previous === 0) return { value: '+0%', positive: true }
  const pct = ((current - previous) / Math.abs(previous)) * 100
  return { value: `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`, positive: pct >= 0 }
}
