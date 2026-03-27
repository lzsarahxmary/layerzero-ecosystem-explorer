'use client'

import useSWR from 'swr'
import type { OApp } from '@/types/app'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const SWR_CONFIG = {
  refreshInterval: 5 * 60 * 1000,
  revalidateOnFocus: true,
  dedupingInterval: 60 * 1000,
}

export function useOApps() {
  const { data, error, isLoading, mutate } = useSWR('/api/layerzero/oapps', fetcher, SWR_CONFIG)

  const oapps: OApp[] = (() => {
    const raw = data?.data
    if (!raw || !Array.isArray(raw)) return []
    return raw.map((o: Record<string, unknown>) => ({
      id: String(o.id ?? o.address ?? ''),
      name: String(o.name ?? 'Unknown'),
      slug: String(o.name ?? '').toLowerCase().replace(/[\s]/g, '-'),
      address: String(o.address ?? ''),
      category: String(o.category ?? 'OApp'),
      logoUrl: null,
      website: null,
      isOApp: true,
      endpointVersion: 'V2' as const,
      deployedChains: Array.isArray(o.chains) ? o.chains.map(String) : [],
      connectedChainEids: Array.isArray(o.connectedChainEids) ? o.connectedChainEids.map(String) : [],
      totalMessages: Number(o.totalMessages ?? 0),
      totalVolume: 0,
      messages30d: Number(o.totalMessages ?? 0),
      volume30d: 0,
      tvl: 0,
      revenue30d: null,
      fees30d: null,
      activeUsers30d: null,
      contractAddresses: {},
    }))
  })()

  return { oapps, error, isLoading, mutate }
}
