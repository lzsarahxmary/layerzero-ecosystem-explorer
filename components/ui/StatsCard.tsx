'use client'

import { Info } from 'lucide-react'
import { formatNumber, formatCurrency, formatPercent } from '@/lib/utils/format'
import { MiniSparkline } from './MiniSparkline'

interface StatsCardProps {
  label: string
  value: number
  format?: 'number' | 'currency' | 'percent'
  change?: number | null
  sparkData?: number[]
  tooltip?: string
  className?: string
}

export function StatsCard({
  label,
  value,
  format = 'number',
  change,
  sparkData,
  tooltip,
  className = '',
}: StatsCardProps) {
  const formatted = format === 'currency'
    ? formatCurrency(value)
    : format === 'percent'
    ? formatPercent(value)
    : formatNumber(value)

  return (
    <div className={`rounded p-4 ${className}`}
         style={{ background: 'var(--bg-secondary)', border: '1px solid var(--line-primary)' }}>
      <div className="flex items-center gap-1 mb-2">
        <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', letterSpacing: '0.4px', color: 'var(--text-secondary)', textTransform: 'uppercase' as const }}>
          {label}
        </span>
        {tooltip && (
          <div className="group relative">
            <Info size={11} className="cursor-help" style={{ color: 'var(--text-tertiary)' }} />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1
                           rounded text-[11px] opacity-0 group-hover:opacity-100 transition-opacity
                           whitespace-nowrap pointer-events-none"
                 style={{ background: 'var(--bg-secondary)', border: '1px solid var(--line-primary)', color: 'var(--text-secondary)', fontFamily: "'Roboto Mono', monospace" }}>
              {tooltip}
            </div>
          </div>
        )}
      </div>

      <div className="text-2xl sm:text-3xl tracking-tight"
           style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 400, letterSpacing: '-0.05em', color: 'var(--text-primary)' }}>
        {formatted}
      </div>

      <div className="flex items-center justify-between mt-2">
        {change !== null && change !== undefined ? (
          <span className="text-[12px] font-medium"
                style={{ fontFamily: "'Roboto Mono', monospace", color: change > 0 ? 'var(--accent-green)' : change < 0 ? 'var(--accent-red)' : 'var(--text-tertiary)' }}>
            {formatPercent(change)}
          </span>
        ) : (
          <span />
        )}
        {sparkData && sparkData.length > 1 && (
          <MiniSparkline data={sparkData} color={change && change > 0 ? 'var(--accent-green)' : 'var(--accent-red)'} />
        )}
      </div>
    </div>
  )
}
