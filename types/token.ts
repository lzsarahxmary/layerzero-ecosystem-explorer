export interface Token {
  id: string
  symbol: string
  name: string
  isOft: boolean
  deployedChains: string[]
  marketCapUsd: number | null
  priceUsd: number | null
  volume24hUsd: number | null
  priceChange24h: number | null
  contractAddresses: Record<string, string>
  transferVolume30d: number | null
  bridgeMechanism: 'lock-mint' | 'burn-mint' | null
}
