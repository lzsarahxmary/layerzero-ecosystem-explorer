'use client'

interface LoadingSpinnerProps {
  size?: number
  className?: string
}

export function LoadingSpinner({ size = 24, className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className="rounded-full animate-spin"
        style={{ width: size, height: size, border: '2px solid var(--line-primary)', borderTopColor: 'var(--accent-purple)' }}
      />
    </div>
  )
}

export function SkeletonBubble({ size = 60 }: { size?: number }) {
  return (
    <div
      className="rounded-full animate-pulse"
      style={{ width: size, height: size, background: 'var(--line-primary)' }}
    />
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded p-4 animate-pulse ${className}`}
         style={{ background: 'var(--bg-secondary)', border: '1px solid var(--line-primary)' }}>
      <div className="h-3 rounded w-20 mb-3" style={{ background: 'var(--line-primary)' }} />
      <div className="h-8 rounded w-32 mb-2" style={{ background: 'var(--line-primary)' }} />
      <div className="h-3 rounded w-16" style={{ background: 'var(--line-primary)' }} />
    </div>
  )
}
