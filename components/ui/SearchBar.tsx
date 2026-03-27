'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Link as LinkIcon, Coins, Globe } from 'lucide-react'
import { useChains } from '@/hooks/useChains'
import { useOApps } from '@/hooks/useOApps'

interface SearchResult {
  type: 'chain' | 'app' | 'token'
  id: string
  name: string
  href: string
  meta?: string
}

interface SearchBarProps {
  onClose: () => void
}

export function SearchBar({ onClose }: SearchBarProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { chains } = useChains()
  const { oapps } = useOApps()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const q = query.toLowerCase()
    const matched: SearchResult[] = []

    chains
      .filter(c => c.name.toLowerCase().includes(q) || c.eid.includes(q))
      .slice(0, 5)
      .forEach(c => matched.push({
        type: 'chain',
        id: c.eid,
        name: c.name,
        href: `/chain/${c.slug}`,
        meta: `EID ${c.eid} · ${c.tier}`,
      }))

    oapps
      .filter(o => o.name.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach(o => matched.push({
        type: 'app',
        id: o.id,
        name: o.name,
        href: `/app/${o.slug}`,
        meta: o.category,
      }))

    setResults(matched)
    setSelectedIndex(0)
  }, [query, chains, oapps])

  const navigate = useCallback((result: SearchResult) => {
    router.push(result.href)
    onClose()
  }, [router, onClose])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        navigate(results[selectedIndex])
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, results, selectedIndex, navigate])

  const typeIcons = {
    chain: Globe,
    app: LinkIcon,
    token: Coins,
  }

  return (
    <div className="relative w-full max-w-lg">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                      bg-[#111111] border border-[#007FFF]/50 text-white">
        <Search size={14} className="text-[#007FFF]" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search chains, apps, tokens..."
          className="bg-transparent outline-none flex-1 text-sm placeholder-[#666]"
        />
        <button onClick={onClose} className="text-[#666] hover:text-white">
          <X size={14} />
        </button>
      </div>

      {results.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-lg overflow-hidden
                        bg-[#111111]/95 border border-[#2a2a2a] backdrop-blur-lg shadow-xl">
          {results.map((r, i) => {
            const Icon = typeIcons[r.type]
            return (
              <button
                key={`${r.type}-${r.id}`}
                onClick={() => navigate(r)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm
                           transition-colors ${i === selectedIndex ? 'bg-[#1a1a1a]' : 'hover:bg-[#1a1a1a]/50'}`}
              >
                <Icon size={14} className="text-[#666] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-white truncate">{r.name}</div>
                  {r.meta && <div className="text-[#666] text-xs truncate">{r.meta}</div>}
                </div>
                <span className="text-[10px] uppercase text-[#444] font-mono shrink-0">{r.type}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
