'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { FilterMode, BubbleState } from '@/types/api'

interface FilterContextValue {
  mode: FilterMode
  selectedId: string | null
  selectedName: string | null
  highlightedChains: Set<string>
  setTokenFilter: (id: string, name: string, chainEids: string[]) => void
  setAppFilter: (id: string, name: string, chainEids: string[]) => void
  clearFilter: () => void
  getBubbleState: (chainEid: string) => BubbleState
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<FilterMode>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [highlightedChains, setHighlightedChains] = useState<Set<string>>(new Set())

  const setTokenFilter = useCallback((id: string, name: string, chainEids: string[]) => {
    setMode('token')
    setSelectedId(id)
    setSelectedName(name)
    setHighlightedChains(new Set(chainEids))
  }, [])

  const setAppFilter = useCallback((id: string, name: string, chainEids: string[]) => {
    setMode('app')
    setSelectedId(id)
    setSelectedName(name)
    setHighlightedChains(new Set(chainEids))
  }, [])

  const clearFilter = useCallback(() => {
    setMode(null)
    setSelectedId(null)
    setSelectedName(null)
    setHighlightedChains(new Set())
  }, [])

  const getBubbleState = useCallback((chainEid: string): BubbleState => {
    if (!mode) return 'normal'
    return highlightedChains.has(chainEid) ? 'highlighted' : 'dimmed'
  }, [mode, highlightedChains])

  return (
    <FilterContext.Provider value={{
      mode,
      selectedId,
      selectedName,
      highlightedChains,
      setTokenFilter,
      setAppFilter,
      clearFilter,
      getBubbleState,
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (!context) throw new Error('useFilter must be used within FilterProvider')
  return context
}
