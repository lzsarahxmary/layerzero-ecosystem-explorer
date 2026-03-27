'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export interface TTProject {
  id: string
  name: string
  symbol: string
  category: string
  chains: string[]
  logo: string | null
  tvl: number
  revenue30d: number | null
  fees30d: number | null
  activeUsers30d: number | null
  volume30d: number | null
  marketCap: number | null
}

export function useTokenTerminal(chainSlug?: string) {
  const url = chainSlug
    ? `/api/tokenterminal/projects?chain=${chainSlug}`
    : '/api/tokenterminal/projects'

  const { data, error, isLoading } = useSWR(url, fetcher, {
    refreshInterval: 10 * 60 * 1000,
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000,
  })

  const projects: TTProject[] = data?.data ?? []
  const apiError = data?.error ?? null

  return { projects, error: error || apiError, isLoading, total: data?.total ?? 0 }
}
