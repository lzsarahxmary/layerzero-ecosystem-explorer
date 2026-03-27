export interface ApiResponse<T> {
  data: T
  error: string | null
  cached: boolean
  updatedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface LZMessage {
  guid: string
  srcEid: number
  dstEid: number
  srcAddress: string
  dstAddress: string
  srcTxHash: string
  dstTxHash: string | null
  status: 'INFLIGHT' | 'DELIVERED' | 'FAILED'
  created: string
  updated: string
}

export interface LZChainResponse {
  eid: number
  name: string
  nativeChainId: number
  blockExplorer: string
  endpointV2: string | null
}

export interface LZStatsResponse {
  totalMessages: number
  totalVolume: number
  messages24h: number
  messages7d: number
  messages30d: number
}

export interface DeFiLlamaProtocol {
  id: string
  name: string
  slug: string
  category: string
  chains: string[]
  tvl: number
  change_1h: number | null
  change_1d: number | null
  change_7d: number | null
  logo: string
  url: string
}

export interface DeFiLlamaChain {
  gecko_id: string | null
  tvl: number
  tokenSymbol: string
  cmcId: string | null
  name: string
  chainId: number | null
}

export interface TokenTerminalProject {
  project_id: string
  name: string
  symbol: string | null
  category: string
  logo: string | null
  chains: string[]
}

export interface TokenTerminalMetric {
  project_id: string
  metric_id: string
  value: number
  timestamp: string
}

export type FilterMode = 'token' | 'app' | null
export type BubbleState = 'highlighted' | 'dimmed' | 'normal'

export interface FilterState {
  mode: FilterMode
  selectedId: string | null
  selectedName: string | null
  highlightedChains: Set<string>
}
