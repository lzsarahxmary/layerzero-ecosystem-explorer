'use client'

interface LoadingSpinnerProps {
  size?: number
  className?: string
}

export function LoadingSpinner({ size = 24, className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className="rounded-full border-2 border-[#222] border-t-[#007FFF] animate-spin"
        style={{ width: size, height: size }}
      />
    </div>
  )
}

export function SkeletonBubble({ size = 60 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-[#1a1a1a] animate-pulse"
      style={{ width: size, height: size }}
    />
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] p-4 animate-pulse ${className}`}>
      <div className="h-3 bg-[#1a1a1a] rounded w-20 mb-3" />
      <div className="h-8 bg-[#1a1a1a] rounded w-32 mb-2" />
      <div className="h-3 bg-[#1a1a1a] rounded w-16" />
    </div>
  )
}
