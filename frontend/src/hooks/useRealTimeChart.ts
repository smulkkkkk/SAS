import { useState, useEffect, useRef } from 'react'

export interface ChartPoint {
  time: number   // Unix timestamp em segundos
  value: number
}

export function useRealTimeChart(initialValue = 48_000, intervalMs = 3000) {
  const [data, setData] = useState<ChartPoint[]>(() => {
    const now = Math.floor(Date.now() / 1000)
    let val = initialValue
    return Array.from({ length: 60 }, (_, i) => {
      val += (Math.random() - 0.48) * 800
      val = Math.max(30_000, val)
      return { time: now - (60 - i) * 60, value: Math.round(val) }
    })
  })

  const lastValueRef = useRef(data[data.length - 1].value)

  useEffect(() => {
    const id = setInterval(() => {
      const now = Math.floor(Date.now() / 1000)
      const delta = (Math.random() - 0.48) * 800
      lastValueRef.current = Math.max(30_000, lastValueRef.current + delta)
      const newPoint: ChartPoint = { time: now, value: Math.round(lastValueRef.current) }
      setData((prev) => [...prev.slice(-119), newPoint])
    }, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  const last = data[data.length - 1]
  const prev = data[data.length - 2]
  const trend = last && prev ? (last.value >= prev.value ? 'up' : 'down') : 'up'
  const delta = last && prev ? ((last.value - prev.value) / prev.value) * 100 : 0

  return { data, trend, delta, currentValue: last?.value ?? initialValue }
}
