'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, X, StickyNote, LogIn, ChevronDown } from 'lucide-react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { useFilter } from '@/components/providers/FilterProvider'
import { SearchBar } from './SearchBar'
import { Badge } from './Badge'

export function NavBar() {
  const { user } = useSupabase()
  const { mode, selectedName, clearFilter } = useFilter()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 gap-4
                    bg-black/90 backdrop-blur-md border-b border-[#1a1a1a]">
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <img src="/logo-lz-icon.svg" alt="LayerZero" className="w-7 h-7" />
        <span className="text-white font-semibold text-sm hidden sm:block">Explorer</span>
      </Link>

      <div className="flex-1 flex justify-center max-w-xl mx-auto">
        {searchOpen ? (
          <SearchBar onClose={() => setSearchOpen(false)} />
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                       bg-[#111111] border border-[#2a2a2a] text-[#666]
                       hover:border-[#444] transition-colors w-full max-w-md text-sm"
          >
            <Search size={14} />
            <span>Search chains, apps, tokens...</span>
            <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-[#222] text-[#666] font-mono hidden sm:inline">
              Ctrl+K
            </kbd>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {mode && selectedName && (
          <Badge variant="filter" onDismiss={clearFilter}>
            {mode === 'token' ? 'Token' : 'App'}: {selectedName}
          </Badge>
        )}

        <button className="flex items-center gap-1 px-2 py-1 rounded-md
                           bg-[#111] border border-[#2a2a2a] text-xs text-[#A0A0A0]
                           hover:border-[#444] transition-colors">
          MAINNET <ChevronDown size={12} />
        </button>

        {user ? (
          <div className="w-8 h-8 rounded-full bg-[#007FFF]/20 border border-[#007FFF]/40
                         flex items-center justify-center text-[#007FFF] text-xs font-bold">
            {user.email?.[0]?.toUpperCase() ?? 'U'}
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                       bg-[#007FFF]/10 border border-[#007FFF]/30 text-[#007FFF]
                       hover:bg-[#007FFF]/20 transition-colors text-sm"
          >
            <LogIn size={14} />
            <span className="hidden sm:inline">Login</span>
          </Link>
        )}
      </div>
    </nav>
  )
}
