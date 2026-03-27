'use client'

import type { Chain } from '@/types/chain'
import { StatsCard } from '@/components/ui/StatsCard'

interface ChainStatsProps {
  chain: Chain
}

export function ChainStats({ chain }: ChainStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4">
      <StatsCard label="Messages Sent" value={chain.messagesSent} tooltip="All-time messages sent from this chain" />
      <StatsCard label="Messages Received" value={chain.messagesReceived} tooltip="All-time messages received on this chain" />
      <StatsCard label="Connected Chains" value={chain.connectedChains.length} tooltip="Chains actively exchanging messages" />
      <StatsCard label="Active OApps" value={chain.activeOApps} tooltip="OApps with LZ integration on this chain" />
      <StatsCard label="Volume (30d)" value={chain.volume30d} format="currency" tooltip="Cross-chain volume in last 30 days" />
    </div>
  )
}
