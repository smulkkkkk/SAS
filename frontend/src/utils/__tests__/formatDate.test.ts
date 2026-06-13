import { describe, it, expect } from 'vitest'
import { formatDate, formatRelative, getWeekDays, toISODate } from '../formatDate'

describe('formatDate', () => {
  it('converts YYYY-MM-DD to DD/MM/YYYY', () => {
    expect(formatDate('2026-06-13')).toBe('13/06/2026')
  })
})

describe('formatRelative', () => {
  it('returns "agora" for dates less than 1 minute ago', () => {
    const now = new Date().toISOString()
    expect(formatRelative(now)).toBe('agora')
  })
})

describe('getWeekDays', () => {
  it('returns 7 days starting from Monday', () => {
    const monday = new Date('2026-06-08') // known Monday
    const days = getWeekDays(monday)
    expect(days).toHaveLength(7)
    expect(days[0].getDay()).toBe(1) // Monday
    expect(days[6].getDay()).toBe(0) // Sunday
  })
})

describe('toISODate', () => {
  it('formats date to YYYY-MM-DD', () => {
    expect(toISODate(new Date('2026-06-13T12:00:00Z'))).toBe('2026-06-13')
  })
})
