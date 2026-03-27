import type { Tier } from '@/lib/utils/tier'

export interface Chain {
  eid: string
  name: string
  slug: string
  nativeChainId: number
  iconUrl: string
  explorerUrl: string
  tier: Tier
  color: string
  totalMessages: number
  totalVolume: number
  activeOApps: number
  connectedChains: string[]
  messagesReceived: number
  messagesSent: number
  messages24h: number
  messages7d: number
  messages30d: number
  volume24h: number
  volume7d: number
  volume30d: number
  tvl: number
  topSendingDestination: string | null
  topReceivingSource: string | null
  endpointAddress: string | null
  endpointVersion: 'V1' | 'V2' | null
}

export interface ChainConnection {
  sourceEid: string
  destinationEid: string
  sourceName: string
  destinationName: string
  messageCount: number
  volumeUsd: number
}

export interface ChainStats {
  totalMessages: number
  totalVolume: number
  activeChains: number
  activeOApps: number
  connectedProtocols: number
  messages24h: number
  messages7d: number
  messages30d: number
}
