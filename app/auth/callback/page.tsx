'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/providers/SupabaseProvider'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { supabase } = useSupabase()

  useEffect(() => {
    if (!supabase) {
      router.push('/')
      return
    }

    const handleCallback = async () => {
      try {
        await supabase.auth.exchangeCodeForSession(
          window.location.href.split('?')[1] ?? ''
        )
        router.push('/')
      } catch {
        router.push('/auth/login')
      }
    }
    handleCallback()
  }, [supabase, router])

  return (
    <div className="flex items-center justify-center h-[calc(100vh-56px)]">
      <div className="text-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#222] border-t-[#007FFF] animate-spin mx-auto mb-4" />
        <p className="text-sm text-[#666]">Completing sign in...</p>
      </div>
    </div>
  )
}
