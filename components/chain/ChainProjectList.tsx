'use client'

import { useState, useMemo, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Search, ArrowUpDown } from 'lucide-react'
import type { ChainProject } from '@/types/app'
import { ProjectRow } from './ProjectRow'

interface ChainProjectListProps {
  projects: ChainProject[]
  isLoading?: boolean
}

type SortKey = 'tvl' | 'revenue30d' | 'activeUsers' | 'lzMessages' | 'name'

export function ChainProjectList({ projects, isLoading }: ChainProjectListProps) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('tvl')
  const [sortAsc, setSortAsc] = useState(false)
  const parentRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    let result = projects.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    )

    result.sort((a, b) => {
      const aVal = a[sortKey] ?? 0
      const bVal = b[sortKey] ?? 0
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortAsc ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal)
    })

    return result
  }, [projects, search, sortKey, sortAsc])

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 20,
  })

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(false) }
  }

  const SortHeader = ({ label, sortKeyVal, className }: { label: string; sortKeyVal: SortKey; className?: string }) => (
    <button
      onClick={() => handleSort(sortKeyVal)}
      className={`flex items-center gap-1 text-[11px] text-[#666] hover:text-white transition-colors ${className}`}
    >
      {label}
      {sortKey === sortKeyVal && <ArrowUpDown size={10} />}
    </button>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1a1a1a]">
        <Search size={12} className="text-[#666]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${projects.length} projects...`}
          className="flex-1 bg-transparent text-sm text-white placeholder-[#666] outline-none"
        />
        <span className="text-[11px] text-[#444] font-mono">{filtered.length}</span>
      </div>

      <div className="flex items-center gap-3 px-4 py-1.5 border-b border-[#0f0f0f] bg-[#050505]">
        <span className="w-8" />
        <span className="w-6" />
        <SortHeader label="Name" sortKeyVal="name" className="flex-1" />
        <SortHeader label="TVL" sortKeyVal="tvl" className="w-24 justify-end" />
        <SortHeader label="Revenue 30d" sortKeyVal="revenue30d" className="w-20 justify-end hidden sm:flex" />
        <SortHeader label="Users" sortKeyVal="activeUsers" className="w-16 justify-end hidden md:flex" />
        <SortHeader label="LZ Msgs" sortKeyVal="lzMessages" className="w-20 justify-end hidden lg:flex" />
      </div>

      <div ref={parentRef} className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-sm text-[#666]">
            Loading projects...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-sm text-[#666]">
            No projects found
          </div>
        ) : (
          <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
            {virtualizer.getVirtualItems().map(virtualRow => (
              <div
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: virtualRow.size,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <ProjectRow project={filtered[virtualRow.index]} rank={virtualRow.index + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
