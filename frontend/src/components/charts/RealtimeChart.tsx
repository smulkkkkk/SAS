import { useEffect, useRef } from 'react'
import { createChart, LineSeries, LineStyle, ColorType } from 'lightweight-charts'
import type { IChartApi, ISeriesApi, LineSeriesPartialOptions, UTCTimestamp } from 'lightweight-charts'
import type { ChartPoint } from '@/hooks'
import { formatCurrency } from '@/utils'

interface Props {
  data: ChartPoint[]
  trend: 'up' | 'down'
  delta: number
  currentValue: number
}

export function RealtimeChart({ data, trend, delta, currentValue }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seriesRef = useRef<ISeriesApi<any> | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#94A3B8' },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.05)', style: LineStyle.Dotted },
        horzLines: { color: 'rgba(255,255,255,0.05)', style: LineStyle.Dotted },
      },
      rightPriceScale: { borderColor: 'transparent', scaleMargins: { top: 0.1, bottom: 0.1 } },
      timeScale: { borderColor: 'transparent', timeVisible: true, secondsVisible: false },
      crosshair: {
        horzLine: { color: 'rgba(59,130,246,0.4)' },
        vertLine: { color: 'rgba(59,130,246,0.4)' },
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
      handleScale: { mouseWheel: true, pinch: true },
    })

    const options: LineSeriesPartialOptions = {
      color: '#3B82F6',
      lineWidth: 2,
      crosshairMarkerRadius: 4,
      lastValueVisible: false,
      priceLineVisible: false,
    }
    const series = chart.addSeries(LineSeries, options)

    chartRef.current = chart
    seriesRef.current = series

    const ro = new ResizeObserver(() => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth })
    })
    ro.observe(containerRef.current)

    return () => {
      ro.disconnect()
      chart.remove()
    }
  }, [])

  useEffect(() => {
    if (!seriesRef.current || !data.length) return
    const mapped = data.map((p) => ({ time: p.time as UTCTimestamp, value: p.value }))
    seriesRef.current.setData(mapped)
    chartRef.current?.timeScale().scrollToRealTime()
  }, [data])

  const isUp = trend === 'up'

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[var(--text-muted)] text-xs">Receita em tempo real</p>
          <p className="text-[var(--text-primary)] text-xl font-bold">{formatCurrency(currentValue)}</p>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium ${
            isUp
              ? 'bg-[var(--status-success)]/15 text-[var(--status-success)]'
              : 'bg-[var(--status-error)]/15 text-[var(--status-error)]'
          }`}
        >
          <span>{isUp ? '▲' : '▼'}</span>
          <span>{Math.abs(delta).toFixed(2)}%</span>
        </div>
      </div>
      <div ref={containerRef} className="h-64 w-full" />
    </div>
  )
}
