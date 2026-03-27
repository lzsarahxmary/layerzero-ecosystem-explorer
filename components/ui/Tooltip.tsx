'use client'

import type { ReactNode } from 'react'

interface TooltipProps {
  children: ReactNode
  x: number
  y: number
  visible: boolean
}

export function Tooltip({ children, x, y, visible }: TooltipProps) {
  if (!visible) return null

  return (
    <div
      className="fixed z-[100] px-3 py-2 rounded-lg
                 bg-[#111111]/95 border border-[#2a2a2a] backdrop-blur-lg
                 shadow-xl pointer-events-none transition-opacity duration-150"
      style={{
        left: x + 12,
        top: y - 12,
        opacity: visible ? 1 : 0,
      }}
    >
      {children}
    </div>
  )
}
