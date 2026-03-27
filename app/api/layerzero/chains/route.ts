import { NextResponse } from 'next/server'
import { getChains as getDLChains } from '@/lib/api/defillama'
import { getLatestMessages, aggregateMessagesByChain } from '@/lib/api/layerzero'
import { CHAIN_METADATA } from '@/lib/constants/chains'

const EID_TO_CHAIN_NAME: Record<number, string> = {
  30101: 'Ethereum', 30110: 'Arbitrum', 30111: 'Optimism',
  30184: 'Base', 30109: 'Polygon', 30102: 'BNB Chain',
  30106: 'Avalanche', 30168: 'Solana', 30112: 'Fantom',
  30183: 'Linea', 30165: 'zkSync Era', 30214: 'Scroll',
  30181: 'Mantle', 30243: 'Blast', 30280: 'Sei',
  30145: 'Gnosis', 30125: 'Celo', 30126: 'Moonbeam',
  30211: 'Aurora', 30151: 'Metis', 30177: 'Kava',
  30167: 'Canto', 30182: 'Zora', 30195: 'opBNB',
  30150: 'Klaytn', 30175: 'Aptos', 30230: 'Telos',
  30176: 'Core', 30116: 'Harmony', 30153: 'CoreDAO',
  101: 'Ethereum', 110: 'Arbitrum', 111: 'Optimism',
  184: 'Base', 109: 'Polygon', 102: 'BNB Chain',
  106: 'Avalanche', 112: 'Fantom',
}

export async function GET() {
  try {
    const [lzResponse, dlChains] = await Promise.allSettled([
      getLatestMessages({ limit: 100 }),
      getDLChains(),
    ])

    const lzMessages = lzResponse.status === 'fulfilled' ? lzResponse.value.data ?? [] : []
    const dlData = dlChains.status === 'fulfilled'
      ? (dlChains.value as Array<{ name: string; tvl: number; chainId?: number }>)
      : []

    const lzAgg = aggregateMessagesByChain(lzMessages)
    const lzMap = new Map(lzAgg.map(c => [c.eid, c]))
    const dlMap = new Map(dlData.map(c => [c.name.toLowerCase(), c]))

    const chains = CHAIN_METADATA.map(meta => {
      const eid = Number(meta.eid)
      const lz = lzMap.get(eid)
      const dlName = meta.name.toLowerCase() === 'bsc' ? 'binance' : meta.name.toLowerCase()
      const dl = dlMap.get(dlName) || dlMap.get(meta.name.toLowerCase())

      return {
        eid: meta.eid,
        name: meta.name,
        slug: meta.slug,
        nativeChainId: meta.nativeChainId,
        color: meta.color,
        explorerUrl: meta.explorerUrl,
        totalMessages: lz?.totalMessages ?? 0,
        messagesSent: lz?.messagesSent ?? 0,
        messagesReceived: lz?.messagesReceived ?? 0,
        activeOApps: lz?.oappNames.length ?? 0,
        connectedChains: (lz?.connectedEids ?? []).map(e => String(e)),
        tvl: dl?.tvl ?? 0,
      }
    })

    for (const agg of lzAgg) {
      if (!CHAIN_METADATA.find(m => Number(m.eid) === agg.eid)) {
        const name = EID_TO_CHAIN_NAME[agg.eid] ?? `Chain ${agg.eid}`
        if (!chains.find(c => c.name === name)) {
          chains.push({
            eid: String(agg.eid),
            name,
            slug: name.toLowerCase().replace(/[\s]/g, '-'),
            nativeChainId: 0,
            color: '#6B7280',
            explorerUrl: '',
            totalMessages: agg.totalMessages,
            messagesSent: agg.messagesSent,
            messagesReceived: agg.messagesReceived,
            activeOApps: agg.oappNames.length,
            connectedChains: agg.connectedEids.map(e => String(e)),
            tvl: 0,
          })
        }
      }
    }

    chains.sort((a, b) => b.totalMessages - a.totalMessages)

    return NextResponse.json({ data: chains, error: null, updatedAt: new Date().toISOString() })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ data: [], error: message }, { status: 500 })
  }
}
