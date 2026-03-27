export interface OApp {
  id: string
  name: string
  slug: string
  address: string
  category: string
  logoUrl: string | null
  website: string | null
  isOApp: boolean
  endpointVersion: 'V1' | 'V2' | null
  deployedChains: string[]
  connectedChainEids: string[]
  totalMessages: number
  totalVolume: number
  messages30d: number
  volume30d: number
  tvl: number
  revenue30d: number | null
  fees30d: number | null
  activeUsers30d: number | null
  contractAddresses: Record<string, string>
}

export interface ChainProject {
  id: string
  name: string
  slug: string
  category: string
  logoUrl: string | null
  tvl: number
  chains: string[]
  revenue30d: number | null
  fees30d: number | null
  activeUsers: number | null
  isOApp: boolean
  lzMessages: number | null
  lzVolume: number | null
  connectedChains: string[]
}
