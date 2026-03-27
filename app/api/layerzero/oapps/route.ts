import { NextResponse } from 'next/server'
import { getLatestMessages } from '@/lib/api/layerzero'

export async function GET() {
  try {
    const result = await Promise.allSettled([getLatestMessages({ limit: 100 })])
    const messages = result[0].status === 'fulfilled' ? result[0].value.data ?? [] : []

    const oappMap = new Map<string, {
      name: string
      address: string
      chains: Set<string>
      connectedEids: Set<number>
      totalMessages: number
    }>()

    for (const msg of messages) {
      const sender = msg.pathway.sender
      const key = sender.id || sender.address

      if (!oappMap.has(key)) {
        oappMap.set(key, {
          name: sender.name || sender.address.slice(0, 10),
          address: sender.address,
          chains: new Set(),
          connectedEids: new Set(),
          totalMessages: 0,
        })
      }

      const oapp = oappMap.get(key)!
      oapp.totalMessages++
      if (sender.chain) oapp.chains.add(sender.chain)
      oapp.connectedEids.add(msg.pathway.srcEid)
      oapp.connectedEids.add(msg.pathway.dstEid)
    }

    const oapps = Array.from(oappMap.values())
      .sort((a, b) => b.totalMessages - a.totalMessages)
      .map(o => ({
        id: o.address,
        name: o.name,
        address: o.address,
        category: 'OApp',
        chains: Array.from(o.chains),
        connectedChainEids: Array.from(o.connectedEids).map(String),
        totalMessages: o.totalMessages,
        isOApp: true,
      }))

    return NextResponse.json({ data: oapps, error: null, updatedAt: new Date().toISOString() })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ data: [], error: message }, { status: 500 })
  }
}
