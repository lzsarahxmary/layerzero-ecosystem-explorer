'use client'

import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5" aria-label="Breadcrumb"
         style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '12px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {i > 0 && <span style={{ color: 'var(--text-tertiary)' }}>/</span>}
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              className="transition-colors hover:underline"
              style={{ color: 'var(--text-secondary)', textDecorationColor: 'var(--text-tertiary)' }}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: i === items.length - 1 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
