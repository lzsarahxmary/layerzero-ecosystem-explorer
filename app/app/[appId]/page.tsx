'use client'

import { useMemo } from 'react'
import { useOApps } from '@/hooks/useOApps'
import { useChains } from '@/hooks/useChains'
import { useNotes } from '@/hooks/useNotes'
import { BubbleMap, type BubbleNode, type BubbleLink } from '@/components/visualization/BubbleMap'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { StatsCard } from '@/components/ui/StatsCard'
import { Badge } from '@/components/ui/Badge'
import { ChainIcon } from '@/components/ui/ChainIcon'
import { formatNumber, formatCurrency } from '@/lib/utils/format'
import { getChainColor } from '@/lib/utils/chain-colors'
import { ExternalLink, StickyNote } from 'lucide-react'

export default function AppDetailPage({ params }: { params: { appId: string } }) {
  const { appId } = params
  const { oapps, isLoading } = useOApps()
  const { chains } = useChains()
  const { openPanel } = useNotes()

  const app = useMemo(() =>
    oapps.find(o => o.slug === appId || o.id === appId),
    [oapps, appId]
  )

  const { nodes, links } = useMemo(() => {
    if (!app) return { nodes: [], links: [] }

    const bubbleNodes: BubbleNode[] = [{
      id: app.id,
      label: app.name,
      value: app.totalMessages,
      radius: 50,
      color: '#007FFF',
      glowColor: 'rgba(0, 127, 255, 0.4)',
      metricLabel: formatNumber(app.totalMessages) + ' msgs',
      group: 'center',
      fixed: true,
    }]

    const bubbleLinks: BubbleLink[] = []

    app.deployedChains.forEach(chainName => {
      const chain = chains.find(c => c.name.toLowerCase() === chainName.toLowerCase())
      const color = getChainColor(chainName)
      bubbleNodes.push({
        id: `chain-${chainName}`,
        label: chainName,
        value: 1,
        radius: 28,
        color,
        glowColor: `${color}40`,
        group: 'chain',
      })
      bubbleLinks.push({
        source: app.id,
        target: `chain-${chainName}`,
        value: 1,
        color,
      })
    })

    return { nodes: bubbleNodes, links: bubbleLinks }
  }, [app, chains])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)] text-sm text-[#666]">
        Loading app data...
      </div>
    )
  }

  if (!app) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">App Not Found</h1>
          <p className="text-[#666]">No app matching &ldquo;{appId}&rdquo;</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] overflow-y-auto">
      <div className="px-4 py-2 border-b border-[#1a1a1a]">
        <Breadcrumb items={[
          { label: 'LayerZero', href: '/' },
          { label: app.name },
        ]} />
      </div>

      <div className="flex items-start gap-4 p-4 border-b border-[#1a1a1a]">
        <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] overflow-hidden shrink-0">
          {app.logoUrl && <img src={app.logoUrl} alt={app.name} className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-white">{app.name}</h1>
            {app.isOApp && <Badge variant="oapp">OApp</Badge>}
            {app.endpointVersion && <Badge variant="default">{app.endpointVersion}</Badge>}
          </div>
          <div className="flex items-center gap-3 text-xs text-[#666]">
            <span>{app.category}</span>
            {app.website && (
              <a href={app.website} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-1 hover:text-white transition-colors">
                Website <ExternalLink size={10} />
              </a>
            )}
            <span className="font-mono">{app.deployedChains.length} chains</span>
          </div>
        </div>
        <button
          onClick={() => openPanel('app', app.id, app.name)}
          className="p-2 rounded-lg text-[#666] hover:text-white hover:bg-[#111] transition-colors"
        >
          <StickyNote size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4">
        <StatsCard label="TVL" value={app.tvl} format="currency" />
        <StatsCard label="Revenue (30d)" value={app.revenue30d ?? 0} format="currency" />
        <StatsCard label="Fees (30d)" value={app.fees30d ?? 0} format="currency" />
        <StatsCard label="Active Users" value={app.activeUsers30d ?? 0} />
        <StatsCard label="LZ Messages (30d)" value={app.messages30d} />
        <StatsCard label="Chains Deployed" value={app.deployedChains.length} />
      </div>

      <div className="flex flex-1 min-h-[400px] border-t border-[#1a1a1a]">
        <div className="flex-1 relative">
          <BubbleMap nodes={nodes} links={links} centerNode={app.id} />
        </div>
        <div className="w-72 border-l border-[#1a1a1a] overflow-y-auto hidden lg:block">
          <div className="p-3 border-b border-[#1a1a1a]">
            <h3 className="text-sm font-semibold text-white">Deployed Chains</h3>
          </div>
          {app.deployedChains.map(chainName => (
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
