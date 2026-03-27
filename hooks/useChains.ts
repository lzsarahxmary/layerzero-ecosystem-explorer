'use client'

import useSWR from 'swr'
import type { Chain } from '@/types/chain'
import { classifyChainTier } from '@/lib/utils/tier'
import { getChainColor, getChainIconUrl } from '@/lib/utils/chain-colors'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const SWR_CONFIG = {
  refreshInterval: 5 * 60 * 1000,
  revalidateOnFocus: true,
  dedupingInterval: 60 * 1000,
}

export function useChains() {
  const { data, error, isLoading } = useSWR('/api/layerzero/chains', fetcher, SWR_CONFIG)

  const chains: Chain[] = (() => {
    const raw = data?.data
    if (!raw || !Array.isArray(raw)) return []

    const mapped: Omit<Chain, 'tier'>[] = raw.map((c: Record<string, unknown>) => ({
      eid: String(c.eid ?? ''),
      name: String(c.name ?? ''),
      slug: String(c.slug ?? ''),
      nativeChainId: Number(c.nativeChainId ?? 0),
      iconUrl: getChainIconUrl(String(c.name ?? '')),
      explorerUrl: String(c.explorerUrl ?? ''),
      tier: 'P4' as const,
      color: String(c.color ?? '') || getChainColor(String(c.name ?? '')),
      totalMessages: Number(c.totalMessages ?? 0),
      totalVolume: Number(c.totalVolume ?? 0),
      activeOApps: Number(c.activeOApps ?? 0),
      connectedChains: Array.isArray(c.connectedChains) ? c.connectedChains.map(String) : [],
      messagesReceived: Number(c.messagesReceived ?? 0),
      messagesSent: Number(c.messagesSent ?? 0),
      messages24h: Number(c.messages24h ?? 0),
      messages7d: Number(c.messages7d ?? 0),
      messages30d: Number(c.messages30d ?? 0),
      volume24h: Number(c.volume24h ?? 0),
      volume7d: Number(c.volume7d ?? 0),
      volume30d: Number(c.volume30d ?? 0),
      tvl: Number(c.tvl ?? 0),
      topSendingDestination: null,
      topReceivingSource: null,
      endpointAddress: c.endpointAddress ? String(c.endpointAddress) : null,
      endpointVersion: 'V2' as const,
    }))

    return mapped.map((chain): Chain => ({
      ...chain,
      tier: classifyChainTier(chain, mapped),
    }))
  })()

  return { chains, error, isLoading }
}
