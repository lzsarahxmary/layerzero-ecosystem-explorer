'use client'

import { useMemo, useState } from 'react'
import { useChains } from '@/hooks/useChains'
import { useOApps } from '@/hooks/useOApps'
import { useNotes } from '@/hooks/useNotes'
import { useTokenTerminal, type TTProject } from '@/hooks/useTokenTerminal'
import { ChainBubbleMap } from '@/components/visualization/ChainBubbleMap'
import { ChainHeader } from '@/components/chain/ChainHeader'
import { ChainStats } from '@/components/chain/ChainStats'
import { ChainProjectList } from '@/components/chain/ChainProjectList'
import { BubbleNoteButton } from '@/components/ui/BubbleNoteButton'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import {
  StickyNote, ExternalLink, Link2, TrendingUp, DollarSign,
  Users, BarChart3, Layers, ArrowUpRight, Search
} from 'lucide-react'
import type { ChainProject } from '@/types/app'
import { getEcosystemByChain } from '@/lib/constants/ecosystems'
import { formatCurrency, formatNumber } from '@/lib/utils/format'

type TabId = 'projects' | 'oapps' | 'tokens' | 'ecosystem' | 'notes'

export default function ChainDetailPage({ params }: { params: { chainId: string } }) {
  const { chainId } = params
  const { chains, isLoading } = useChains()
  const { oapps } = useOApps()
  const { openPanel } = useNotes()
  const [activeTab, setActiveTab] = useState<TabId>('projects')
  const [searchQuery, setSearchQuery] = useState('')

  const chain = useMemo(() =>
    chains.find(c => c.slug === chainId || c.eid === chainId),
    [chains, chainId]
  )

  const { projects: ttProjects, isLoading: ttLoading } = useTokenTerminal(chain?.slug)

  const connectedChains = useMemo(() => {
    if (!chain) return []
    return chains.filter(c => chain.connectedChains.includes(c.eid) && c.eid !== chain.eid)
  }, [chains, chain])

  const ecosystem = useMemo(() => {
    if (!chain) return null
    return getEcosystemByChain(chain.slug)
  }, [chain])

  const projects: ChainProject[] = useMemo(() => {
    return oapps
      .filter(o => o.deployedChains.some(dc => dc.toLowerCase() === (chain?.name ?? '').toLowerCase()))
      .map(o => ({
        id: o.id,
        name: o.name,
        slug: o.slug,
        category: o.category,
        logoUrl: o.logoUrl,
        tvl: o.tvl,
        chains: o.deployedChains,
        revenue30d: o.revenue30d,
        fees30d: o.fees30d,
        activeUsers: o.activeUsers30d,
        isOApp: true,
        lzMessages: o.totalMessages,
        lzVolume: o.totalVolume,
        connectedChains: o.connectedChainEids,
      }))
  }, [oapps, chain])

  const oftApps = useMemo(() => ecosystem?.apps.filter(a => a.category === 'OFT') ?? [], [ecosystem])

  const allProjects = useMemo(() => {
    const combined: TTProject[] = [...ttProjects]
    if (ecosystem) {
      for (const app of ecosystem.apps) {
        if (!combined.find(p => p.name.toLowerCase() === app.name.toLowerCase())) {
          combined.push({
            id: app.name.toLowerCase().replace(/\s+/g, '-'),
            name: app.name,
            symbol: '',
            category: app.category,
            chains: chain ? [chain.name] : [],
            logo: null,
            tvl: 0,
            revenue30d: null,
            fees30d: null,
            activeUsers30d: null,
            volume30d: null,
            marketCap: null,
          })
        }
      }
    }
    return combined
  }, [ttProjects, ecosystem, chain])

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return allProjects
    const q = searchQuery.toLowerCase()
    return allProjects.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.symbol.toLowerCase().includes(q)
    )
  }, [allProjects, searchQuery])

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: 'projects', label: 'Projects', count: allProjects.length },
    { id: 'oapps', label: 'OApps', count: projects.filter(p => p.isOApp).length },
    { id: 'tokens', label: 'OFTs', count: oftApps.length },
    { id: 'ecosystem', label: 'Ecosystem', count: ecosystem?.apps.length },
    { id: 'notes', label: 'Notes' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)]">
        <div className="text-sm text-[#666]">Loading chain data...</div>
      </div>
    )
  }

  if (!chain) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Chain Not Found</h1>
          <p className="text-[#666]">No chain matching &ldquo;{chainId}&rdquo;</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="px-4 py-2 border-b border-[#1a1a1a] flex items-center justify-between">
        <Breadcrumb items={[
          { label: 'LayerZero', href: '/' },
          { label: chain.tier, href: `/tier/${chain.tier}` },
          { label: chain.name },
        ]} />
        <BubbleNoteButton entityType="chain" entityId={chain.eid} entityName={chain.name} />
      </div>

      <ChainHeader chain={chain} />
      <ChainStats chain={chain} />

      <div className="flex flex-1 overflow-hidden border-t border-[#1a1a1a]">
        <div className="w-[60%] relative hidden md:block border-r border-[#1a1a1a]">
          <ChainBubbleMap
            chain={chain}
            connectedChains={connectedChains}
            connections={[]}
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center border-b border-[#1a1a1a]">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-[#666] hover:text-[#A0A0A0]'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1.5 text-[10px] text-[#444] font-mono">{tab.count}</span>
                )}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007FFF]" />
                )}
              </button>
            ))}

            <div className="flex-1" />
            <button
              onClick={() => openPanel('chain', chain.eid, chain.name)}
              className="mr-3 p-1.5 rounded text-[#666] hover:text-white hover:bg-[#111] transition-colors"
              title="Add note"
            >
              <StickyNote size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Projects Tab - Token Terminal + Ecosystem data */}
            {activeTab === 'projects' && (
              <div className="flex flex-col h-full">
                <div className="p-3 border-b border-[#1a1a1a]">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search projects, DApps, protocols..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#111] border border-[#1a1a1a]
                                 text-white text-sm placeholder-[#555] focus:border-[#333] focus:outline-none"
                    />
                  </div>
                  {ttLoading && (
                    <div className="mt-2 text-[10px] text-[#555]">Loading Token Terminal data...</div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto">
                  {filteredProjects.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-sm text-[#666]">
                      {searchQuery ? 'No projects matching your search' : 'No projects found'}
                    </div>
                  ) : (
                    <div className="divide-y divide-[#0e0e0e]">
                      {filteredProjects
                        .sort((a, b) => (b.tvl || 0) - (a.tvl || 0))
                        .map((project, i) => (
                          <ProjectRow key={project.id} project={project} rank={i + 1} chainName={chain.name} />
                        ))}
                    </div>
                  )}
                </div>

                <div className="p-2 border-t border-[#1a1a1a] text-center">
                  <a
                    href={`https://tokenterminal.com/explorer/projects/${chain.slug}/ecosystem/projects`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] text-[#555] hover:text-white transition-colors"
                  >
                    View full ecosystem on Token Terminal
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'oapps' && (
              <ChainProjectList projects={projects.filter(p => p.isOApp)} />
            )}

            {activeTab === 'tokens' && (
              <div className="p-4 space-y-3">
                {oftApps.length > 0 ? (
                  <>
                    <p className="text-xs text-[#666] mb-2">OFTs deployed on {chain.name}</p>
                    {oftApps.map(app => (
                      <div key={app.name} className="flex items-center justify-between p-3 rounded-lg bg-[#111] border border-[#1a1a1a]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[10px] font-bold text-purple-300">
                            OFT
                          </div>
                          <span className="text-sm text-white">{app.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Link2 size={10} className="text-emerald-400" />
                          <span className="text-[10px] text-emerald-400">LZ Integrated</span>
                        </div>
                      </div>
                    ))}
                    <a
                      href="https://layerzeroscan.com/oft"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 mt-2 px-3 py-2 rounded-lg
                                 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm
                                 hover:bg-purple-500/20 transition-colors"
                    >
                      View all OFTs on LZ Scan
                      <ExternalLink size={12} />
                    </a>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-32 text-sm text-[#666]">
                    No OFTs found for {chain.name}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ecosystem' && (
              <div className="p-4 space-y-2">
                {ecosystem && ecosystem.apps.length > 0 ? (
                  <>
                    <p className="text-xs text-[#666] mb-3">Applications and tools on {chain.name}</p>
                    {['DeFi', 'Bridge', 'Oracle', 'Infrastructure', 'OApp', 'OFT', 'NFT', 'Social', 'Gaming', 'Payments'].map(cat => {
                      const catApps = ecosystem.apps.filter(a => a.category === cat)
                      if (catApps.length === 0) return null
                      return (
                        <div key={cat} className="mb-3">
                          <p className="text-[10px] uppercase tracking-wider text-[#555] mb-1.5">{cat}</p>
                          <div className="space-y-1">
                            {catApps.map(app => (
                              <div key={app.name} className="flex items-center justify-between p-2.5 rounded-lg bg-[#111] border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-white">{app.name}</span>
                                  {app.isLzIntegrated && (
                                    <span className="flex items-center gap-0.5 text-[9px] px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                      <Link2 size={8} /> LZ
                                    </span>
                                  )}
                                </div>
                                {app.url && (
                                  <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-[#666] hover:text-white transition-colors">
                                    <ExternalLink size={12} />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-32 text-sm text-[#666]">
                    Ecosystem data not yet available for {chain.name}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="p-4">
                <button
                  onClick={() => openPanel('chain', chain.eid, chain.name)}
                  className="px-4 py-2 rounded-lg bg-[#007FFF]/10 border border-[#007FFF]/30
                             text-[#007FFF] text-sm hover:bg-[#007FFF]/20 transition-colors"
                >
                  Open Notes Panel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectRow({ project, rank, chainName }: { project: TTProject; rank: number; chainName: string }) {
  const ecoApp = getEcosystemByChain(chainName.toLowerCase())?.apps.find(
    a => a.name.toLowerCase() === project.name.toLowerCase()
  )
  const isLz = ecoApp?.isLzIntegrated ?? false

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#0a0a0a] transition-colors group">
      <span className="text-[10px] text-[#333] font-mono w-5 text-right shrink-0">{rank}</span>

      <div className="w-8 h-8 rounded-full bg-[#111] border border-[#1a1a1a] flex items-center justify-center shrink-0 overflow-hidden">
        {project.logo ? (
          <img src={project.logo} alt="" className="w-6 h-6 rounded-full" />
        ) : (
          <span className="text-[10px] font-bold text-[#555]">{project.name.slice(0, 2).toUpperCase()}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-white truncate">{project.name}</span>
          {project.symbol && (
            <span className="text-[10px] text-[#555] font-mono">{project.symbol}</span>
          )}
          {isLz && (
            <span className="flex items-center gap-0.5 text-[8px] px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Link2 size={7} /> LZ
            </span>
          )}
        </div>
        <span className="text-[10px] text-[#444]">{project.category}</span>
      </div>

      <div className="hidden sm:flex items-center gap-4 shrink-0">
        {project.tvl > 0 && (
          <MetricCell icon={<Layers size={10} />} label="TVL" value={formatCurrency(project.tvl)} />
        )}
        {project.fees30d != null && project.fees30d > 0 && (
          <MetricCell icon={<DollarSign size={10} />} label="Fees 30d" value={formatCurrency(project.fees30d)} />
        )}
        {project.revenue30d != null && project.revenue30d > 0 && (
          <MetricCell icon={<TrendingUp size={10} />} label="Rev 30d" value={formatCurrency(project.revenue30d)} />
        )}
        {project.activeUsers30d != null && project.activeUsers30d > 0 && (
          <MetricCell icon={<Users size={10} />} label="Users 30d" value={formatNumber(project.activeUsers30d)} />
        )}
        {project.volume30d != null && project.volume30d > 0 && (
          <MetricCell icon={<BarChart3 size={10} />} label="Vol 30d" value={formatCurrency(project.volume30d)} />
        )}
      </div>

      {(ecoApp?.url || project.id) && (
        <a
          href={ecoApp?.url || `https://tokenterminal.com/explorer/projects/${project.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#333] group-hover:text-[#666] transition-colors shrink-0"
        >
          <ArrowUpRight size={14} />
        </a>
      )}
    </div>
  )
}

function MetricCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="text-right" title={label}>
      <div className="flex items-center gap-0.5 justify-end text-[#555]">{icon}<span className="text-[8px] uppercase">{label}</span></div>
      <div className="text-[11px] font-mono text-white">{value}</div>
    </div>
  )
}
