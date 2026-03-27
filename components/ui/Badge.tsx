'use client'

import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'filter' | 'oapp' | 'oft' | 'tier'
  color?: string
  onDismiss?: () => void
  className?: string
}

const variantClasses = {
  default: 'bg-[#222] border-[#333] text-[#A0A0A0]',
  filter: 'bg-[#007FFF]/10 border-[#007FFF]/30 text-[#007FFF]',
  oapp: 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]',
  oft: 'bg-[#7C3AED]/10 border-[#7C3AED]/30 text-[#7C3AED]',
  tier: 'border-current/30',
}

export function Badge({
  children,
  variant = 'default',
  color,
  onDismiss,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                  text-[11px] font-medium border ${variantClasses[variant]} ${className}`}
      style={color ? { color, borderColor: `${color}40`, backgroundColor: `${color}15` } : undefined}
    >
      {children}
      {onDismiss && (
        <button onClick={onDismiss} className="hover:opacity-70 transition-opacity">
          <X size={10} />
        </button>
      )}
    </span>
  )
}
