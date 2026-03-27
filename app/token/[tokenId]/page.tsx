'use client'

import { useMemo } from 'react'
import { useTokens } from '@/hooks/useTokens'
import { useChains } from '@/hooks/useChains'
import { useNotes } from '@/hooks/useNotes'
import { BubbleMap, type BubbleNode, type BubbleLink } from '@/components/visualization/BubbleMap'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { StatsCard } from '@/components/ui/StatsCard'
import { Badge } from '@/components/ui/Badge'
import { ChainIcon } from '@/components/ui/ChainIcon'
import { formatCurrency, formatPercent } from '@/lib/utils/format'
import { getChainColor } from '@/lib/utils/chain-colors'
import { StickyNote } from 'lucide-react'

export default function TokenDetailPage({ params }: { params: { tokenId: string } }) {
  const { tokenId } = params
  const { tokens, isLoading } = useTokens()
  const { chains } = useChains()
  const { openPanel } = useNotes()

  const token = useMemo(() =>
    tokens.find(t => t.id === tokenId || t.symbol.toLowerCase() === tokenId.toLowerCase()),
    [tokens, tokenId]
  )

  const { nodes, links } = useMemo(() => {
    if (!token) return { nodes: [], links: [] }

    const bubbleNodes: BubbleNode[] = [{
      id: token.id,
      label: token.symbol || token.name,
      value: 0,
      radius: 45,
      color: '#7C3AED',
      glowColor: 'rgba(124, 58, 237, 0.4)',
      metricLabel: token.isOft ? 'OFT' : 'Token',
      group: 'center',
      fixed: true,
    }]

    const bubbleLinks: BubbleLink[] = []

    token.deployedChains.forEach(chainName => {
      const color = getChainColor(chainName)
      bubbleNodes.push({
        id: `chain-${chainName}`,
        label: chainName,
        value: 1,
        radius: 25,
        color,
        glowColor: `${color}40`,
        group: 'chain',
      })
      bubbleLinks.push({
        source: token.id,
        target: `chain-${chainName}`,
        value: 1,
        color,
      })
    })

    return { nodes: bubbleNodes, links: bubbleLinks }
  }, [token, chains])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)] text-sm text-[#666]">
        Loading token data...
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Token Not Found</h1>
          <p className="text-[#666]">No token matching &ldquo;{tokenId}&rdquo;</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] overflow-y-auto">
      <div className="px-4 py-2 border-b border-[#1a1a1a]">
        <Breadcrumb items={[
          { label: 'LayerZero', href: '/' },
          { label: token.symbol || token.name },
        ]} />
      </div>

      <div className="flex items-start gap-4 p-4 border-b border-[#1a1a1a]">
        <div className="w-12 h-12 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40
                       flex items-center justify-center text-[#7C3AED] font-bold text-lg shrink-0">
          {token.symbol?.[0] ?? 'T'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-white">{token.name}</h1>
            <span className="text-[#A0A0A0] font-mono">{token.symbol}</span>
            {token.isOft && <Badge variant="oft">OFT</Badge>}
          </div>
          <div className="flex items-center gap-3 text-xs text-[#666]">
            <span>{token.deployedChains.length} chains</span>
            {token.bridgeMechanism && <span>{token.bridgeMechanism}</span>}
          </div>
        </div>
        <button
          onClick={() => openPanel('token', token.id, token.symbol || token.name)}
          className="p-2 rounded-lg text-[#666] hover:text-white hover:bg-[#111] transition-colors"
        >
          <StickyNote size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
        <StatsCard label="Price" value={token.priceUsd ?? 0} format="currency" />
        <StatsCard
          label="Market Cap"
          value={token.marketCapUsd ?? 0}
          format="currency"
        />
        <StatsCard label="Volume (24h)" value={token.volume24hUsd ?? 0} format="currency" />
        <StatsCard
          label="Price Change (24h)"
          value={token.priceChange24h ?? 0}
          format="percent"
          change={token.priceChange24h}
        />
      </div>

      <div className="flex flex-1 min-h-[400px] border-t border-[#1a1a1a]">
        <div className="flex-1 relative">
          <BubbleMap nodes={nodes} links={links} centerNode={token.id} />
        </div>
        <div className="w-72 border-l border-[#1a1a1a] overflow-y-auto hidden lg:block">
          <div className="p-3 border-b border-[#1a1a1a]">
            <h3 className="text-sm font-semibold text-white">Deployed Chains</h3>
          </div>
          {token.deployedChains.map(chainName => (
            <a
              key={chainName}
              href={`/chain/${chainName.toLowerCase().replace(/\s/g, '-')}`}
              className="flex items-center gap-2 px-3 py-2 hover:bg-[#111] transition-colors"
            >
              <ChainIcon name={chainName} size={20} />
              <span className="text-sm text-white">{chainName}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
