'use client'

import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react'

interface ZoomControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  onFullscreen: () => void
}

export function ZoomControls({ onZoomIn, onZoomOut, onReset, onFullscreen }: ZoomControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
      {[
        { icon: ZoomIn, onClick: onZoomIn, label: 'Zoom in' },
        { icon: ZoomOut, onClick: onZoomOut, label: 'Zoom out' },
        { icon: RotateCcw, onClick: onReset, label: 'Reset view' },
        { icon: Maximize2, onClick: onFullscreen, label: 'Fullscreen' },
      ].map(({ icon: Icon, onClick, label }) => (
        <button
          key={label}
          onClick={onClick}
          aria-label={label}
          className="w-9 h-9 flex items-center justify-center rounded-lg
                     bg-[#111111]/90 border border-[#2a2a2a] backdrop-blur-sm
                     text-[#A0A0A0] hover:text-white hover:border-[#444]
                     transition-all duration-200"
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  )
}
