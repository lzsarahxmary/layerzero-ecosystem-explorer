'use client'

import { useChains } from '@/hooks/useChains'
import { useLayerZeroStats } from '@/hooks/useLayerZeroStats'
import { HomeBubbleMap } from '@/components/visualization/HomeBubbleMap'
import { StatsCard } from '@/components/ui/StatsCard'
import { FilterBar } from '@/components/ui/FilterBar'
import { SkeletonCard } from '@/components/ui/LoadingSpinner'

export default function HomePage() {
  const { chains, isLoading: chainsLoading } = useChains()
  const { stats, isLoading: statsLoading, globalTotalMessages, globalTotalChains } = useLayerZeroStats()

  const isLoading = chainsLoading && statsLoading

  const totalMessages = chains.reduce((s, c) => s + c.totalMessages, 0)
  const totalTVL = chains.reduce((s, c) => s + c.tvl, 0)

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <FilterBar />

      <div className="flex-1 relative overflow-hidden">
        {chainsLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4">
              <img src="/logo-lz-icon.svg" alt="Loading" className="w-20 h-20 animate-pulse opacity-30" />
              <div className="text-sm text-[#666]">Loading ecosystem data...</div>
            </div>
          </div>
        ) : (
          <HomeBubbleMap chains={chains} />
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--line-primary)', background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-3 max-w-7xl mx-auto">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <StatsCard
                label="Total Messages"
                value={globalTotalMessages ?? stats?.totalMessages ?? totalMessages}
                tooltip="Total cross-chain messages (LayerZero Scan)"
              />
              <StatsCard
                label="Total TVL"
                value={totalTVL}
                format="currency"
                tooltip="Combined TVL of all connected chains (DefiLlama)"
              />
              <StatsCard
                label="Supported Chains"
                value={globalTotalChains ?? stats?.activeChains ?? chains.length}
                tooltip="Chains with LayerZero endpoints"
              />
              <StatsCard
                label="Active OApps"
                value={stats?.activeOApps ?? 0}
                tooltip="Unique OApps observed in recent messages"
              />
              <StatsCard
                label="Recent Messages"
                value={stats?.messages24h ?? 0}
                tooltip="Messages in latest API batch"
              />
              <StatsCard
                label="Active Chains"
                value={chains.filter(c => c.totalMessages > 0).length}
                tooltip="Chains with cross-chain message activity"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
