import { NextResponse } from 'next/server'
import { getLatestMessages, aggregateMessagesByChain } from '@/lib/api/layerzero'

async function fetchLZScanPageStats(): Promise<{
  totalMessages?: number
  totalChains?: number
  totalOFTs?: number
  totalVerified?: number
} | null> {
  try {
    const res = await fetch('https://layerzeroscan.com', {
      headers: { 'User-Agent': 'LayerZero-Explorer/1.0' },
      next: { revalidate: 600 },
    })
    if (!res.ok) return null
    const html = await res.text()

    const extractNumber = (pattern: RegExp): number | undefined => {
      const match = html.match(pattern)
      if (!match) return undefined
      const raw = match[1].replace(/,/g, '')
      return parseInt(raw, 10) || undefined
    }

    return {
      totalMessages: extractNumber(/(?:total\s+)?messages[^<]*?>([\d,]+)</i) ?? undefined,
      totalChains: extractNumber(/(?:total\s+)?chains[^<]*?>([\d,]+)</i) ?? undefined,
    }
  } catch {
    return null
  }
}

export async function GET() {
  const result = await Promise.allSettled([
    getLatestMessages({ limit: 100 }),
    fetchLZScanPageStats(),
  ])
  const lzResult = result[0]
  const pageStats = result[1].status === 'fulfilled' ? result[1].value : null

  const messages = lzResult.status === 'fulfilled' ? lzResult.value.data ?? [] : []
  const chainAgg = aggregateMessagesByChain(messages)

  const uniqueChains = new Set<number>()
  const uniqueOApps = new Set<string>()

  for (const msg of messages) {
    uniqueChains.add(msg.pathway.srcEid)
    uniqueChains.add(msg.pathway.dstEid)
    if (msg.pathway.sender?.name) uniqueOApps.add(msg.pathway.sender.name)
    if (msg.pathway.receiver?.name) uniqueOApps.add(msg.pathway.receiver.name)
  }

  const stats = {
    recentMessages: messages.length,
    activeChains: uniqueChains.size,
    activeOApps: uniqueOApps.size,
    chainBreakdown: chainAgg,
    sampleMessages: messages.slice(0, 10),
    globalTotalMessages: pageStats?.totalMessages ?? null,
    globalTotalChains: pageStats?.totalChains ?? null,
  }

  const apiError = lzResult.status === 'rejected' ? String(lzResult.reason) : null

  return NextResponse.json({ data: stats, error: apiError, updatedAt: new Date().toISOString() })
}
