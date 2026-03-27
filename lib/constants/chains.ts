export interface ChainMeta {
  eid: string
  name: string
  slug: string
  nativeChainId: number
  explorerUrl: string
  color: string
}

export const CHAIN_METADATA: ChainMeta[] = [
  { eid: '30101', name: 'Ethereum', slug: 'ethereum', nativeChainId: 1, explorerUrl: 'https://etherscan.io', color: '#627EEA' },
  { eid: '30110', name: 'Arbitrum', slug: 'arbitrum', nativeChainId: 42161, explorerUrl: 'https://arbiscan.io', color: '#12AAFF' },
  { eid: '30111', name: 'Optimism', slug: 'optimism', nativeChainId: 10, explorerUrl: 'https://optimistic.etherscan.io', color: '#FF0420' },
  { eid: '30184', name: 'Base', slug: 'base', nativeChainId: 8453, explorerUrl: 'https://basescan.org', color: '#0052FF' },
  { eid: '30109', name: 'Polygon', slug: 'polygon', nativeChainId: 137, explorerUrl: 'https://polygonscan.com', color: '#8247E5' },
  { eid: '30102', name: 'BSC', slug: 'bsc', nativeChainId: 56, explorerUrl: 'https://bscscan.com', color: '#F3BA2F' },
  { eid: '30106', name: 'Avalanche', slug: 'avalanche', nativeChainId: 43114, explorerUrl: 'https://snowtrace.io', color: '#E84142' },
  { eid: '30168', name: 'Solana', slug: 'solana', nativeChainId: 0, explorerUrl: 'https://solscan.io', color: '#9945FF' },
  { eid: '30112', name: 'Fantom', slug: 'fantom', nativeChainId: 250, explorerUrl: 'https://ftmscan.com', color: '#1969FF' },
  { eid: '30183', name: 'Linea', slug: 'linea', nativeChainId: 59144, explorerUrl: 'https://lineascan.build', color: '#61DFFF' },
  { eid: '30165', name: 'zkSync Era', slug: 'zksync', nativeChainId: 324, explorerUrl: 'https://explorer.zksync.io', color: '#4E529A' },
  { eid: '30214', name: 'Scroll', slug: 'scroll', nativeChainId: 534352, explorerUrl: 'https://scrollscan.com', color: '#FFDBB0' },
  { eid: '30181', name: 'Mantle', slug: 'mantle', nativeChainId: 5000, explorerUrl: 'https://mantlescan.xyz', color: '#00CCCC' },
  { eid: '30243', name: 'Blast', slug: 'blast', nativeChainId: 81457, explorerUrl: 'https://blastscan.io', color: '#FCFC03' },
  { eid: '30280', name: 'Sei', slug: 'sei', nativeChainId: 1329, explorerUrl: 'https://seitrace.com', color: '#9E1F63' },
  { eid: '30145', name: 'Gnosis', slug: 'gnosis', nativeChainId: 100, explorerUrl: 'https://gnosisscan.io', color: '#04795B' },
  { eid: '30125', name: 'Celo', slug: 'celo', nativeChainId: 42220, explorerUrl: 'https://celoscan.io', color: '#FCFF52' },
  { eid: '30126', name: 'Moonbeam', slug: 'moonbeam', nativeChainId: 1284, explorerUrl: 'https://moonscan.io', color: '#53CBC8' },
  { eid: '30211', name: 'Aurora', slug: 'aurora', nativeChainId: 1313161554, explorerUrl: 'https://explorer.aurora.dev', color: '#70D44B' },
  { eid: '30151', name: 'Metis', slug: 'metis', nativeChainId: 1088, explorerUrl: 'https://andromeda-explorer.metis.io', color: '#00DACC' },
]

export function getChainMetaByEid(eid: string): ChainMeta | undefined {
  return CHAIN_METADATA.find(c => c.eid === eid)
}

export function getChainMetaBySlug(slug: string): ChainMeta | undefined {
  return CHAIN_METADATA.find(c => c.slug === slug)
}
