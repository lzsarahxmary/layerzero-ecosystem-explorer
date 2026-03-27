'use client'

import Link from 'next/link'
import type { ChainProject } from '@/types/app'
import { formatCurrency, formatNumber } from '@/lib/utils/format'
import { Badge } from '@/components/ui/Badge'

interface ProjectRowProps {
  project: ChainProject
  rank: number
}

export function ProjectRow({ project, rank }: ProjectRowProps) {
  return (
    <Link
      href={`/app/${project.slug}`}
      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#111] transition-colors border-b border-[#0f0f0f]"
    >
      <span className="w-8 text-right text-xs text-[#444] font-mono shrink-0">{rank}</span>

      <div className="w-6 h-6 rounded-full bg-[#1a1a1a] shrink-0 overflow-hidden">
        {project.logoUrl && (
          <img src={project.logoUrl} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white truncate">{project.name}</span>
          {project.isOApp && <Badge variant="oapp">OApp</Badge>}
        </div>
        <span className="text-[11px] text-[#666]">{project.category}</span>
      </div>

      <div className="w-24 text-right text-sm text-white font-mono shrink-0">
        {project.tvl > 0 ? formatCurrency(project.tvl) : '—'}
      </div>

      <div className="w-20 text-right text-sm text-[#A0A0A0] font-mono shrink-0 hidden sm:block">
        {project.revenue30d ? formatCurrency(project.revenue30d) : '—'}
      </div>

      <div className="w-16 text-right text-sm text-[#A0A0A0] font-mono shrink-0 hidden md:block">
        {project.activeUsers ? formatNumber(project.activeUsers) : '—'}
      </div>

      <div className="w-20 text-right text-sm text-[#A0A0A0] font-mono shrink-0 hidden lg:block">
        {project.lzMessages ? formatNumber(project.lzMessages) : '—'}
      </div>
    </Link>
  )
}
