'use client'

import useSWR from 'swr'
import type { ChainStats } from '@/types/chain'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const SWR_CONFIG = {
  refreshInterval: 5 * 60 * 1000,
  revalidateOnFocus: true,
  dedupingInterval: 60 * 1000,
}

export function useLayerZeroStats() {
  const { data, error, isLoading, mutate } = useSWR('/api/layerzero/stats', fetcher, SWR_CONFIG)

  const stats: ChainStats | null = data?.data ? {
    totalMessages: data.data.globalTotalMessages ?? data.data.recentMessages ?? 0,
    totalVolume: 0,
    activeChains: data.data.globalTotalChains ?? data.data.activeChains ?? 0,
    activeOApps: data.data.activeOApps ?? 0,
    connectedProtocols: 0,
    messages24h: data.data.recentMessages ?? 0,
    messages7d: 0,
    messages30d: 0,
  } : null

  return {
    stats,
    error,
    isLoading,
    mutate,
    raw: data?.data,
    globalTotalMessages: data?.data?.globalTotalMessages ?? null,
    globalTotalChains: data?.data?.globalTotalChains ?? null,
  }
}
