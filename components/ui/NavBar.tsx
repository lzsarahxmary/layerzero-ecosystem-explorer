'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, X, LogIn, ChevronDown } from 'lucide-react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { useFilter } from '@/components/providers/FilterProvider'
import { SearchBar } from './SearchBar'
import { Badge } from './Badge'

export function NavBar() {
  const { user } = useSupabase()
  const { mode, selectedName, clearFilter } = useFilter()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-5 gap-4"
         style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line-primary)' }}>
      <Link href="/" className="flex items-center gap-3 shrink-0">
        <img src="/lz-emblem.svg" alt="LayerZero" className="h-6" />
        <span className="hidden sm:flex items-center gap-1.5"
              style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '12px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--text-tertiary)' }}>/</span>
          Explorer
        </span>
      </Link>

      <div className="flex-1 flex justify-center max-w-xl mx-auto">
        {searchOpen ? (
          <SearchBar onClose={() => setSearchOpen(false)} />
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded w-full max-w-md text-sm transition-colors"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--line-primary)', color: 'var(--text-tertiary)' }}
          >
            <Search size={14} />
            <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '12px', letterSpacing: '0.4px' }}>
              Search chains, apps, tokens...
            </span>
            <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded hidden sm:inline"
                 style={{ background: 'var(--line-primary)', color: 'var(--text-tertiary)', fontFamily: "'Roboto Mono', monospace" }}>
              /
            </kbd>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {mode && selectedName && (
          <Badge variant="filter" onDismiss={clearFilter}>
            {mode === 'token' ? 'Token' : 'App'}: {selectedName}
          </Badge>
        )}

        <button className="flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--line-primary)', color: 'var(--text-secondary)', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Mainnet <ChevronDown size={11} />
        </button>

        {user ? (
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
               style={{ background: 'rgba(167,125,255,0.15)', border: '1px solid rgba(167,125,255,0.3)', color: 'var(--accent-purple)' }}>
            {user.email?.[0]?.toUpperCase() ?? 'U'}
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors"
            style={{ background: 'rgba(167,125,255,0.08)', border: '1px solid rgba(167,125,255,0.2)', color: 'var(--accent-purple)', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            <LogIn size={13} />
            <span className="hidden sm:inline">Login</span>
          </Link>
        )}
      </div>
    </nav>
  )
}
