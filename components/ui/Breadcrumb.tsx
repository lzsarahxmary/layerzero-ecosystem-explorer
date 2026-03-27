'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={12} className="text-[#444]" />}
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              className="text-[#A0A0A0] hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={i === items.length - 1 ? 'text-white font-medium' : 'text-[#A0A0A0]'}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
