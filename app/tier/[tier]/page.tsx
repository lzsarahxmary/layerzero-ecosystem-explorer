'use client'

import { useMemo } from 'react'
import { useChains } from '@/hooks/useChains'
import { TIER_CONFIG, type Tier, TIER_ORDER } from '@/lib/utils/tier'
import { TierBubbleMap } from '@/components/visualization/TierBubbleMap'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { StatsCard } from '@/components/ui/StatsCard'
import { FilterBar } from '@/components/ui/FilterBar'
import { formatNumber, formatCurrency } from '@/lib/utils/format'
import { SkeletonCard } from '@/components/ui/LoadingSpinner'

export default function TierPage({ params }: { params: { tier: string } }) {
  const { tier: tierParam } = params
  const tier = tierParam.toUpperCase() as Tier
  const { chains, isLoading } = useChains()

  const config = TIER_CONFIG[tier]
  const isValidTier = TIER_ORDER.includes(tier)

  const tierChains = useMemo(() =>
    chains.filter(c => c.tier === tier)
      .sort((a, b) => b.totalMessages - a.totalMessages),
    [chains, tier]
  )

  const totalMessages = tierChains.reduce((s, c) => s + c.totalMessages, 0)
  const totalVolume = tierChains.reduce((s, c) => s + c.totalVolume, 0)

  if (!isValidTier) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Invalid Tier</h1>
          <p className="text-[#666]">Tier &ldquo;{tierParam}&rdquo; does not exist. Valid tiers: P0, P1, P2, P3, P4</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
        <div>
          <Breadcrumb items={[
            { label: 'LayerZero', href: '/' },
            { label: config?.label ?? tier },
          ]} />
          {config && (
            <p className="text-xs text-[#666] mt-1">{config.description}</p>
          )}
        </div>
        <div className="flex gap-4 text-right">
          <div>
            <div className="text-[10px] text-[#666]">Chains</div>
            <div className="text-sm font-bold text-white font-mono">{tierChains.length}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#666]">Messages</div>
            <div className="text-sm font-bold text-white font-mono">{formatNumber(totalMessages)}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#666]">Volume</div>
            <div className="text-sm font-bold text-white font-mono">{formatCurrency(totalVolume)}</div>
          </div>
        </div>
      </div>

      <FilterBar />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-sm text-[#666]">Loading chains...</div>
          ) : (
            <TierBubbleMap tier={tier} chains={tierChains} />
          )}
        </div>

        <div className="w-80 border-l border-[#1a1a1a] overflow-y-auto hidden lg:block">
          <div className="p-3 border-b border-[#1a1a1a]">
            <h3 className="text-sm font-semibold text-white">Leaderboard</h3>
          </div>
          <div className="divide-y divide-[#0f0f0f]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} className="m-2" />)
            ) : (
              tierChains.map((chain, i) => (
                <a
                  key={chain.eid}
                  href={`/chain/${chain.slug}`}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-[#111] transition-colors"
                >
                  <span className="w-5 text-right text-[11px] text-[#444] font-mono">{i + 1}</span>
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: chain.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{chain.name}</div>
                  </div>
                  <div className="text-xs text-[#A0A0A0] font-mono">
                    {formatNumber(chain.totalMessages)}
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
