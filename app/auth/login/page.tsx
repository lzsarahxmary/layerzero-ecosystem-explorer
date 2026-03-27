'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup' | 'magic'>('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (!supabase) {
        throw new Error('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local')
      }
      if (mode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({ email })
        if (error) throw error
        setMessage('Check your email for the magic link!')
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage('Check your email to confirm your account!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-[#2a2a2a]
                         flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-black text-white">LZ</span>
          </div>
          <h1 className="text-xl font-bold text-white">LayerZero Explorer</h1>
          <p className="text-sm text-[#666] mt-1">Sign in to save notes and preferences</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a]
                         text-white text-sm placeholder-[#666] outline-none
                         focus:border-[#007FFF]/50 transition-colors"
            />
          </div>

          {mode !== 'magic' && (
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a]
                           text-white text-sm placeholder-[#666] outline-none
                           focus:border-[#007FFF]/50 transition-colors"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
                       bg-[#007FFF] text-white text-sm font-medium
                       hover:bg-[#0066CC] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Processing...' : (
              <>
                {mode === 'magic' ? <Sparkles size={14} /> : <ArrowRight size={14} />}
                {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Magic Link'}
              </>
            )}
          </button>

          {error && <p className="text-xs text-[#EF4444] text-center">{error}</p>}
          {message && <p className="text-xs text-[#22C55E] text-center">{message}</p>}

          <div className="flex items-center gap-2 text-xs text-[#666]">
            <div className="flex-1 h-px bg-[#1a1a1a]" />
            <span>or</span>
            <div className="flex-1 h-px bg-[#1a1a1a]" />
          </div>

          <div className="flex gap-2 text-xs">
            {mode !== 'login' && (
              <button type="button" onClick={() => setMode('login')}
                className="flex-1 py-2 rounded-lg bg-[#111] border border-[#2a2a2a] text-[#A0A0A0]
                           hover:text-white hover:border-[#444] transition-colors">
                Sign In
              </button>
            )}
            {mode !== 'signup' && (
              <button type="button" onClick={() => setMode('signup')}
                className="flex-1 py-2 rounded-lg bg-[#111] border border-[#2a2a2a] text-[#A0A0A0]
                           hover:text-white hover:border-[#444] transition-colors">
                Create Account
              </button>
            )}
            {mode !== 'magic' && (
              <button type="button" onClick={() => setMode('magic')}
                className="flex-1 py-2 rounded-lg bg-[#111] border border-[#2a2a2a] text-[#A0A0A0]
                           hover:text-white hover:border-[#444] transition-colors">
                Magic Link
              </button>
            )}
          </div>
        </form>

        <p className="text-center mt-6">
          <Link href="/" className="text-xs text-[#666] hover:text-white transition-colors">
            Continue without signing in
          </Link>
        </p>
      </div>
    </div>
  )
}
