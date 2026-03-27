'use client'

import useSWR from 'swr'
import type { Token } from '@/types/token'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const SWR_CONFIG = {
  refreshInterval: 5 * 60 * 1000,
  revalidateOnFocus: true,
  dedupingInterval: 60 * 1000,
}

export function useTokens() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/defillama/protocols',
    fetcher,
    SWR_CONFIG
  )

  const tokens: Token[] = (() => {
    if (!data?.data) return []
    const raw = Array.isArray(data.data) ? data.data : []
    return raw
      .filter((p: Record<string, unknown>) => p.category === 'Bridge' || p.category === 'Cross Chain')
      .slice(0, 100)
      .map((p: Record<string, unknown>) => ({
        id: String(p.slug ?? p.id ?? ''),
        symbol: String(p.symbol ?? ''),
        name: String(p.name ?? ''),
        isOft: false,
        deployedChains: (p.chains as string[]) ?? [],
        marketCapUsd: p.mcap ? Number(p.mcap) : null,
        priceUsd: null,
        volume24hUsd: null,
        priceChange24h: p.change_1d ? Number(p.change_1d) : null,
        contractAddresses: {},
        transferVolume30d: null,
        bridgeMechanism: null,
      }))
  })()

  return { tokens, error, isLoading, mutate }
}
