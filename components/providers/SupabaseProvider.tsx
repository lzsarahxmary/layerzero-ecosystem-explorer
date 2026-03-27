'use client'

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { SupabaseClient, User } from '@supabase/supabase-js'

interface SupabaseContext {
  supabase: SupabaseClient | null
  user: User | null
  loading: boolean
  isConfigured: boolean
}

const Context = createContext<SupabaseContext>({
  supabase: null,
  user: null,
  loading: false,
  isConfigured: false,
})

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const initialized = useRef(false)

  const isConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  useEffect(() => {
    if (initialized.current || !isConfigured) {
      setLoading(false)
      return
    }
    initialized.current = true

    let subscription: { unsubscribe: () => void } | undefined

    async function init() {
      try {
        const { createBrowserClient } = await import('@supabase/ssr')
        const client = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        setSupabase(client)

        const { data } = client.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null)
          setLoading(false)
        })
        subscription = data.subscription

        const { data: { user: currentUser } } = await client.auth.getUser()
        setUser(currentUser)
      } catch (e) {
        console.warn('Supabase init failed:', e)
      } finally {
        setLoading(false)
      }
    }

    init()

    return () => {
      subscription?.unsubscribe()
    }
  }, [isConfigured])

  return (
    <Context.Provider value={{ supabase, user, loading, isConfigured }}>
      {children}
    </Context.Provider>
  )
}

export function useSupabase() {
  return useContext(Context)
}
