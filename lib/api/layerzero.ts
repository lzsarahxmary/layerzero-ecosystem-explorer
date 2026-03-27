const LZ_BASE = process.env.LAYERZERO_API_BASE || 'https://scan.layerzero-api.com/v1'

async function lzFetch<T>(path: string): Promise<T> {
  const url = `${LZ_BASE}${path}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    throw new Error(`LZ Scan API ${res.status}: ${url}`)
  }

  return res.json()
}

export interface LZScanMessage {
  pathway: {
    srcEid: number
    dstEid: number
    sender: { address: string; id?: string; name?: string; chain?: string }
    receiver: { address: string; id?: string; name?: string; chain?: string }
    id: string
    nonce: number
  }
  source: {
    status: string
    tx?: { txHash: string; blockTimestamp: number; from: string; value?: string }
  }
  destination?: {
    status: string
    tx?: { txHash: string; blockTimestamp: number }
  }
  guid: string
  status: { name: string; message?: string }
  created: string
  updated: string
}

export interface LZScanResponse {
  data: LZScanMessage[]
  nextToken?: string
}

export async function getLatestMessages(params?: {
  limit?: number
  srcChainIds?: string
  dstChainIds?: string
  nextToken?: string
}): Promise<LZScanResponse> {
  const search = new URLSearchParams()
  if (params?.limit) search.set('limit', String(params.limit))
  if (params?.srcChainIds) search.set('srcChainIds', params.srcChainIds)
  if (params?.dstChainIds) search.set('dstChainIds', params.dstChainIds)
  if (params?.nextToken) search.set('nextToken', params.nextToken)
  const qs = search.toString()
  return lzFetch(`/messages/latest${qs ? `?${qs}` : ''}`)
}

export async function getMessagesByTx(txHash: string): Promise<LZScanResponse> {
  return lzFetch(`/messages/tx/${txHash}`)
}

export async function getMessagesByGuid(guid: string): Promise<LZScanResponse> {
  return lzFetch(`/messages/guid/${guid}`)
}

export async function getMessagesByStatus(
  status: 'INFLIGHT' | 'CONFIRMING' | 'FAILED' | 'DELIVERED',
  params?: { limit?: number; nextToken?: string }
): Promise<LZScanResponse> {
  const search = new URLSearchParams()
  if (params?.limit) search.set('limit', String(params.limit))
  if (params?.nextToken) search.set('nextToken', params.nextToken)
  const qs = search.toString()
  return lzFetch(`/messages/status/${status}${qs ? `?${qs}` : ''}`)
}

export async function getMessagesByOApp(
  eid: number,
  address: string,
  params?: { limit?: number; nextToken?: string }
): Promise<LZScanResponse> {
  const search = new URLSearchParams()
  if (params?.limit) search.set('limit', String(params.limit))
  if (params?.nextToken) search.set('nextToken', params.nextToken)
  const qs = search.toString()
  return lzFetch(`/messages/oapp/${eid}/${address}${qs ? `?${qs}` : ''}`)
}

export async function getMessagesByWallet(
  srcAddress: string,
  params?: { limit?: number; nextToken?: string }
): Promise<LZScanResponse> {
  const search = new URLSearchParams()
  if (params?.limit) search.set('limit', String(params.limit))
  if (params?.nextToken) search.set('nextToken', params.nextToken)
  const qs = search.toString()
  return lzFetch(`/messages/wallet/${srcAddress}${qs ? `?${qs}` : ''}`)
}

export async function getMessagesByPathway(
  pathwayId: string,
  params?: { limit?: number; nextToken?: string }
): Promise<LZScanResponse> {
  const search = new URLSearchParams()
  if (params?.limit) search.set('limit', String(params.limit))
  if (params?.nextToken) search.set('nextToken', params.nextToken)
  const qs = search.toString()
  return lzFetch(`/messages/pathway/${pathwayId}${qs ? `?${qs}` : ''}`)
}

export function aggregateMessagesByChain(messages: LZScanMessage[]) {
  const chains = new Map<number, {
    eid: number
    messagesSent: number
    messagesReceived: number
    totalMessages: number
    connectedEids: Set<number>
    oappNames: Set<string>
  }>()

  for (const msg of messages) {
    const { srcEid, dstEid, sender, receiver } = msg.pathway

    if (!chains.has(srcEid)) {
      chains.set(srcEid, { eid: srcEid, messagesSent: 0, messagesReceived: 0, totalMessages: 0, connectedEids: new Set(), oappNames: new Set() })
    }
    if (!chains.has(dstEid)) {
      chains.set(dstEid, { eid: dstEid, messagesSent: 0, messagesReceived: 0, totalMessages: 0, connectedEids: new Set(), oappNames: new Set() })
    }

    const src = chains.get(srcEid)!
    src.messagesSent++
    src.totalMessages++
    src.connectedEids.add(dstEid)
    if (sender.name) src.oappNames.add(sender.name)

    const dst = chains.get(dstEid)!
    dst.messagesReceived++
    dst.totalMessages++
    dst.connectedEids.add(srcEid)
    if (receiver.name) dst.oappNames.add(receiver.name)
  }

  return Array.from(chains.values()).map(c => ({
    ...c,
    connectedEids: Array.from(c.connectedEids),
    oappNames: Array.from(c.oappNames),
  }))
}
