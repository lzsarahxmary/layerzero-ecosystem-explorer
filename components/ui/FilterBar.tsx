'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { useFilter } from '@/components/providers/FilterProvider'
import { useOApps } from '@/hooks/useOApps'
import { useTokens } from '@/hooks/useTokens'
import { Badge } from './Badge'

export function FilterBar() {
  const { mode, selectedName, clearFilter, setTokenFilter, setAppFilter } = useFilter()
  const { oapps } = useOApps()
  const { tokens } = useTokens()
  const [tokenSearch, setTokenSearch] = useState('')
  const [appSearch, setAppSearch] = useState('')
  const [openDropdown, setOpenDropdown] = useState<'token' | 'app' | null>(null)

  const filteredTokens = tokens.filter(t =>
    t.symbol.toLowerCase().includes(tokenSearch.toLowerCase()) ||
    t.name.toLowerCase().includes(tokenSearch.toLowerCase())
  ).slice(0, 10)

  const filteredApps = oapps.filter(o =>
    o.name.toLowerCase().includes(appSearch.toLowerCase())
  ).slice(0, 10)

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1a1a1a] bg-black/50 backdrop-blur-sm">
      <Filter size={14} className="text-[#666]" />

      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'token' ? null : 'token')}
          className="px-3 py-1 rounded-full text-xs bg-[#111] border border-[#2a2a2a]
                     text-[#A0A0A0] hover:border-[#444] transition-colors"
        >
          Filter by Token
        </button>
        {openDropdown === 'token' && (
          <div className="absolute top-full mt-1 left-0 w-64 rounded-lg bg-[#111]/95
                         border border-[#2a2a2a] backdrop-blur-lg shadow-xl z-50 overflow-hidden">
            <div className="p-2 border-b border-[#1a1a1a]">
              <input
                value={tokenSearch}
                onChange={e => setTokenSearch(e.target.value)}
                placeholder="Search tokens..."
                className="w-full px-2 py-1 text-xs bg-[#0a0a0a] border border-[#2a2a2a]
                           rounded text-white placeholder-[#666] outline-none"
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredTokens.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTokenFilter(t.id, t.symbol || t.name, t.deployedChains)
                    setOpenDropdown(null)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left
                             hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="text-white">{t.symbol || t.name}</span>
                  <span className="text-[#666] ml-auto">{t.deployedChains.length} chains</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'app' ? null : 'app')}
          className="px-3 py-1 rounded-full text-xs bg-[#111] border border-[#2a2a2a]
                     text-[#A0A0A0] hover:border-[#444] transition-colors"
        >
          Filter by App
        </button>
        {openDropdown === 'app' && (
          <div className="absolute top-full mt-1 left-0 w-64 rounded-lg bg-[#111]/95
                         border border-[#2a2a2a] backdrop-blur-lg shadow-xl z-50 overflow-hidden">
            <div className="p-2 border-b border-[#1a1a1a]">
              <input
                value={appSearch}
                onChange={e => setAppSearch(e.target.value)}
                placeholder="Search apps..."
                className="w-full px-2 py-1 text-xs bg-[#0a0a0a] border border-[#2a2a2a]
                           rounded text-white placeholder-[#666] outline-none"
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredApps.map(o => (
                <button
                  key={o.id}
                  onClick={() => {
                    setAppFilter(o.id, o.name, o.connectedChainEids)
                    setOpenDropdown(null)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left
                             hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="text-white">{o.name}</span>
                  <span className="text-[#666] ml-auto">{o.connectedChainEids.length} chains</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {mode && selectedName && (
        <>
          <Badge variant="filter" onDismiss={clearFilter}>
            {mode === 'token' ? 'Token' : 'App'}: {selectedName}
          </Badge>
          <button
            onClick={clearFilter}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px]
                       text-[#EF4444] hover:text-[#FF6666] transition-colors"
          >
            <X size={10} /> Clear
          </button>
        </>
      )}
    </div>
  )
}
