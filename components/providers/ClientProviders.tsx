'use client'

import { type ReactNode } from 'react'
import { SupabaseProvider } from './SupabaseProvider'
import { FilterProvider } from './FilterProvider'
import { NoteProvider } from './NoteProvider'
import { NavBar } from '@/components/ui/NavBar'
import { NotePanel } from '@/components/ui/NotePanel'

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SupabaseProvider>
      <FilterProvider>
        <NoteProvider>
          <div className="star-field" />
          <NavBar />
          <main className="pt-14 relative z-10">
            {children}
          </main>
          <NotePanel />
        </NoteProvider>
      </FilterProvider>
    </SupabaseProvider>
  )
}
