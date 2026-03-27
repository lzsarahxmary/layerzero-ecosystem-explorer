'use client'

import { useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { BubbleMap, type BubbleNode, type BubbleLink } from './BubbleMap'
import { TIER_CONFIG, type Tier } from '@/lib/utils/tier'
import { formatNumber } from '@/lib/utils/format'
import { useFilter } from '@/components/providers/FilterProvider'
import type { Chain, ChainConnection } from '@/types/chain'

interface TierBubbleMapProps {
  tier: Tier
  chains: Chain[]
  connections?: ChainConnection[]
}

export function TierBubbleMap({ tier, chains, connections = [] }: TierBubbleMapProps) {
  const router = useRouter()
  const { getBubbleState } = useFilter()
  const config = TIER_CONFIG[tier]

  const { nodes, links } = useMemo(() => {
    const maxMessages = Math.max(...chains.map(c => c.totalMessages), 1)

    const bubbleNodes: BubbleNode[] = chains.map(chain => {
      const scale = Math.max(0.3, Math.log10(chain.totalMessages + 1) / Math.log10(maxMessages + 1))
      const radius = config.bubbleSize.min + (config.bubbleSize.max - config.bubbleSize.min) * scale

      return {
        id: chain.eid,
        label: chain.name,
        value: chain.totalMessages,
        radius,
        color: chain.color || config.color,
        glowColor: `${chain.color || config.color}40`,
        iconUrl: chain.iconUrl,
        metricLabel: formatNumber(chain.totalMessages) + ' msgs',
        group: tier,
      }
    })

    const chainEids = new Set(chains.map(c => c.eid))
    const bubbleLinks: BubbleLink[] = connections
      .filter(c => chainEids.has(c.sourceEid) && chainEids.has(c.destinationEid))
      .map(c => ({
        source: c.sourceEid,
        target: c.destinationEid,
        value: c.messageCount,
        color: chains.find(ch => ch.eid === c.sourceEid)?.color,
      }))

    return { nodes: bubbleNodes, links: bubbleLinks }
  }, [chains, connections, tier, config])

  const handleNodeClick = useCallback((node: BubbleNode) => {
    const chain = chains.find(c => c.eid === node.id)
    if (chain) router.push(`/chain/${chain.slug}`)
  }, [chains, router])

  return (
    <BubbleMap
      nodes={nodes}
      links={links}
      onNodeClick={handleNodeClick}
      getBubbleState={getBubbleState}
    />
  )
}
