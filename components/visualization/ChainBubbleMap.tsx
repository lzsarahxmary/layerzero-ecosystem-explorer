'use client'

import { useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { BubbleMap, type BubbleNode, type BubbleLink } from './BubbleMap'
import { formatNumber } from '@/lib/utils/format'
import { getChainColor } from '@/lib/utils/chain-colors'
import type { Chain, ChainConnection } from '@/types/chain'

interface ChainBubbleMapProps {
  chain: Chain
  connectedChains: Chain[]
  connections: ChainConnection[]
}

export function ChainBubbleMap({ chain, connectedChains, connections }: ChainBubbleMapProps) {
  const router = useRouter()

  const { nodes, links } = useMemo(() => {
    const bubbleNodes: BubbleNode[] = []

    bubbleNodes.push({
      id: chain.eid,
      label: chain.name,
      value: chain.totalMessages,
      radius: 60,
      color: chain.color,
      glowColor: `${chain.color}40`,
      iconUrl: chain.iconUrl,
      metricLabel: formatNumber(chain.totalMessages) + ' msgs',
      group: 'center',
      fixed: true,
    })

    const maxVolume = Math.max(...connections.map(c => c.messageCount), 1)

    connectedChains.forEach(cc => {
      const conn = connections.find(
        c => (c.sourceEid === cc.eid || c.destinationEid === cc.eid)
      )
      const volume = conn?.messageCount ?? 0
      const scale = Math.max(0.3, Math.log10(volume + 1) / Math.log10(maxVolume + 1))
      const radius = 25 + 30 * scale

      bubbleNodes.push({
        id: cc.eid,
        label: cc.name,
        value: volume,
        radius,
        color: getChainColor(cc.name),
        glowColor: `${getChainColor(cc.name)}40`,
        iconUrl: cc.iconUrl,
        metricLabel: formatNumber(volume) + ' msgs',
        group: 'satellite',
      })
    })

    const bubbleLinks: BubbleLink[] = connections.map(c => ({
      source: c.sourceEid,
      target: c.destinationEid,
      value: c.messageCount,
      color: getChainColor(
        connectedChains.find(cc => cc.eid === c.sourceEid)?.name ?? ''
      ),
    }))

    return { nodes: bubbleNodes, links: bubbleLinks }
  }, [chain, connectedChains, connections])

  const handleNodeClick = useCallback((node: BubbleNode) => {
    if (node.id !== chain.eid) {
      const cc = connectedChains.find(c => c.eid === node.id)
      if (cc) router.push(`/chain/${cc.slug}`)
    }
  }, [chain, connectedChains, router])

  return (
    <BubbleMap
      nodes={nodes}
      links={links}
      onNodeClick={handleNodeClick}
      centerNode={chain.eid}
    />
  )
}
