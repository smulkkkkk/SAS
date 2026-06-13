import { describe, it, expect } from 'vitest'
import { formatCurrency, formatCompact, formatDelta } from '../formatCurrency'

describe('formatCurrency', () => {
  it('formats BRL correctly', () => {
    expect(formatCurrency(1234.56).replace(/\s/g, ' ')).toBe('R$ 1.234,56')
  })
  it('formats zero', () => {
    expect(formatCurrency(0).replace(/\s/g, ' ')).toBe('R$ 0,00')
  })
})

describe('formatCompact', () => {
  it('formats thousands with k', () => {
    expect(formatCompact(15000)).toBe('R$ 15.0k')
  })
  it('formats millions with M', () => {
    expect(formatCompact(2_500_000)).toBe('R$ 2.5M')
  })
})

describe('formatDelta', () => {
  it('calculates positive delta', () => {
    const result = formatDelta(110, 100)
    expect(result.value).toBe('+10.0%')
    expect(result.positive).toBe(true)
  })
  it('calculates negative delta', () => {
    const result = formatDelta(90, 100)
    expect(result.value).toBe('-10.0%')
    expect(result.positive).toBe(false)
  })
  it('handles previous zero', () => {
    expect(formatDelta(100, 0).value).toBe('+0%')
  })
})
