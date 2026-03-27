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
    <div className={`rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] p-4 ${className}`}>
      <div className="flex items-center gap-1 mb-2">
        <span className="text-[13px] text-[#A0A0A0]">{label}</span>
        {tooltip && (
          <div className="group relative">
            <Info size={12} className="text-[#444] cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1
                           rounded bg-[#111]/95 border border-[#2a2a2a] text-[11px] text-[#A0A0A0]
                           opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                           pointer-events-none backdrop-blur-sm">
              {tooltip}
            </div>
          </div>
        )}
      </div>

      <div className="text-2xl sm:text-3xl font-black text-white tracking-tight"
           style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {formatted}
      </div>

      <div className="flex items-center justify-between mt-2">
        {change !== null && change !== undefined ? (
          <span className={`text-[13px] font-medium ${
            change > 0 ? 'text-[#22C55E]' : change < 0 ? 'text-[#EF4444]' : 'text-[#6B7280]'
          }`}>
            {formatPercent(change)}
          </span>
        ) : (
          <span />
        )}
        {sparkData && sparkData.length > 1 && (
          <MiniSparkline data={sparkData} color={change && change > 0 ? '#22C55E' : '#EF4444'} />
        )}
      </div>
    </div>
  )
}
