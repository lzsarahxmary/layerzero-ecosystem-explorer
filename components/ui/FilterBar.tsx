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

  const btnStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--line-primary)',
    color: 'var(--text-secondary)',
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '11px',
    letterSpacing: '0.4px',
  } as const

  const dropdownStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--line-primary)',
  } as const

  const inputStyle = {
    background: 'var(--bg-primary)',
    border: '1px solid var(--line-primary)',
    color: 'var(--text-primary)',
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '12px',
  } as const

  return (
    <div className="flex items-center gap-2 px-5 py-2"
         style={{ borderBottom: '1px solid var(--line-primary)', background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(8px)' }}>
      <Filter size={13} style={{ color: 'var(--text-tertiary)' }} />

      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'token' ? null : 'token')}
          className="px-3 py-1 rounded transition-colors"
          style={btnStyle}
        >
          / Token
        </button>
        {openDropdown === 'token' && (
          <div className="absolute top-full mt-1 left-0 w-64 rounded shadow-xl z-50 overflow-hidden"
               style={dropdownStyle}>
            <div className="p-2" style={{ borderBottom: '1px solid var(--line-primary)' }}>
              <input
                value={tokenSearch}
                onChange={e => setTokenSearch(e.target.value)}
                placeholder="Search tokens..."
                className="w-full px-2 py-1 rounded outline-none placeholder-[#525252]"
                style={inputStyle}
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
                  className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors"
                  style={{ fontSize: '12px', fontFamily: "'Roboto Mono', monospace" }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--line-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ color: 'var(--text-primary)' }}>{t.symbol || t.name}</span>
                  <span className="ml-auto" style={{ color: 'var(--text-tertiary)' }}>{t.deployedChains.length} chains</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'app' ? null : 'app')}
          className="px-3 py-1 rounded transition-colors"
          style={btnStyle}
        >
          / App
        </button>
        {openDropdown === 'app' && (
          <div className="absolute top-full mt-1 left-0 w-64 rounded shadow-xl z-50 overflow-hidden"
               style={dropdownStyle}>
            <div className="p-2" style={{ borderBottom: '1px solid var(--line-primary)' }}>
              <input
                value={appSearch}
                onChange={e => setAppSearch(e.target.value)}
                placeholder="Search apps..."
                className="w-full px-2 py-1 rounded outline-none placeholder-[#525252]"
                style={inputStyle}
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
                  className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors"
                  style={{ fontSize: '12px', fontFamily: "'Roboto Mono', monospace" }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--line-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ color: 'var(--text-primary)' }}>{o.name}</span>
                  <span className="ml-auto" style={{ color: 'var(--text-tertiary)' }}>{o.connectedChainEids.length} chains</span>
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
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-colors"
            style={{ color: 'var(--accent-red)', fontFamily: "'Roboto Mono', monospace" }}
          >
            <X size={10} /> Clear
          </button>
        </>
      )}
    </div>
  )
}
