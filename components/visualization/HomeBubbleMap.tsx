'use client'

import { useMemo, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ExternalLink, ArrowUpRight, ArrowDownLeft, Globe, Layers,
  Link2, ChevronRight, Filter, Eye, EyeOff, Plus, StickyNote
} from 'lucide-react'
import { BubbleMap, type BubbleNode, type BubbleLink } from './BubbleMap'
import { TIER_CONFIG, TIER_ORDER, type Tier } from '@/lib/utils/tier'
import { LZ_PRODUCTS } from '@/lib/constants/products'
import { COMPETITORS } from '@/lib/constants/ecosystems'
import { getEcosystemByChain } from '@/lib/constants/ecosystems'
import { formatNumber, formatCurrency } from '@/lib/utils/format'
import type { Chain } from '@/types/chain'
import type { EcosystemApp } from '@/lib/constants/ecosystems'
import OAppExplainer from '@/components/ui/OAppExplainer'
import { AddBubbleModal, type CustomBubble } from '@/components/ui/AddBubbleModal'
import { BubbleNoteButton } from '@/components/ui/BubbleNoteButton'

interface HomeBubbleMapProps {
  chains: Chain[]
}

const TIER_MAX_CHAINS: Record<Tier, number> = {
  P0: 10,
  P1: 7,
  P2: 5,
  P3: 3,
  P4: 2,
}

const TIER_BUBBLE_SCALE: Record<Tier, number> = {
  P0: 1.0,
  P1: 0.85,
  P2: 0.65,
  P3: 0.5,
  P4: 0.35,
}

export function HomeBubbleMap({ chains }: HomeBubbleMapProps) {
  const router = useRouter()
  const [selectedNode, setSelectedNode] = useState<BubbleNode | null>(null)
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<(typeof LZ_PRODUCTS)[number] | null>(null)
  const [selectedCompetitor, setSelectedCompetitor] = useState<(typeof COMPETITORS)[number] | null>(null)
  const [showOAppExplainer, setShowOAppExplainer] = useState(false)
  const [selectedCustom, setSelectedCustom] = useState<CustomBubble | null>(null)
  const [tierFilter, setTierFilter] = useState<Tier | 'all'>('all')
  const [showCompetitors, setShowCompetitors] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [customBubbles, setCustomBubbles] = useState<CustomBubble[]>([])

  const handleAddBubble = useCallback((bubble: CustomBubble) => {
    setCustomBubbles(prev => [...prev, bubble])
    setShowAddModal(false)
  }, [])

  const chainBySlug = useMemo(() => {
    const map = new Map<string, Chain>()
    chains.forEach(c => {
      map.set(c.slug, c)
      map.set(c.name.toLowerCase(), c)
    })
    return map
  }, [chains])

  const { nodes, links } = useMemo(() => {
    const tierCounts: Record<Tier, { count: number; messages: number; volume: number; tvl: number }> = {
      P0: { count: 0, messages: 0, volume: 0, tvl: 0 },
      P1: { count: 0, messages: 0, volume: 0, tvl: 0 },
      P2: { count: 0, messages: 0, volume: 0, tvl: 0 },
      P3: { count: 0, messages: 0, volume: 0, tvl: 0 },
      P4: { count: 0, messages: 0, volume: 0, tvl: 0 },
    }

    chains.forEach(c => {
      tierCounts[c.tier].count++
      tierCounts[c.tier].messages += c.totalMessages
      tierCounts[c.tier].volume += c.totalVolume
      tierCounts[c.tier].tvl += c.tvl
    })

    const bubbleNodes: BubbleNode[] = []
    const bubbleLinks: BubbleLink[] = []

    bubbleNodes.push({
      id: 'lz-center',
      label: 'LayerZero',
      value: 0,
      radius: 70,
      color: '#FFFFFF',
      glowColor: 'rgba(255, 255, 255, 0.4)',
      metricLabel: 'Omnichain Protocol',
      group: 'center',
      fixed: true,
      iconUrl: '/logo-lz-icon.svg',
    })

    TIER_ORDER.forEach(tier => {
      const config = TIER_CONFIG[tier]
      const data = tierCounts[tier]
      if (data.count === 0) return

      const isFiltered = tierFilter !== 'all' && tier !== tierFilter
      const opacity = isFiltered ? 0.15 : 1

      const maxMessages = Math.max(...Object.values(tierCounts).map(t => t.messages), 1)
      const scale = Math.max(0.3, Math.log10(data.messages + 1) / Math.log10(maxMessages + 1))
      const tierScale = TIER_BUBBLE_SCALE[tier]
      const radius = (config.bubbleSize.min + (config.bubbleSize.max - config.bubbleSize.min) * scale) * tierScale

      bubbleNodes.push({
        id: `tier-${tier}`,
        label: config.label,
        value: data.messages,
        radius: Math.max(radius, 30),
        color: config.color,
        glowColor: isFiltered ? 'transparent' : config.glowColor,
        metricLabel: `${data.count} chains · ${formatNumber(data.messages)} msgs`,
        group: 'tier',
      })

      bubbleLinks.push({
        source: 'lz-center',
        target: `tier-${tier}`,
        value: data.messages,
        color: isFiltered ? `${config.color}20` : config.color,
      })

      const tierChains = chains.filter(c => c.tier === tier).sort((a, b) => b.totalMessages - a.totalMessages)
      const maxChains = TIER_MAX_CHAINS[tier]

      tierChains.slice(0, maxChains).forEach(chain => {
        const baseSize = 18 + tierScale * 30
        const msgFactor = maxMessages > 0 ? (chain.totalMessages / maxMessages) : 0
        const chainRadius = Math.max(14, Math.min(55, baseSize + msgFactor * 20))

        bubbleNodes.push({
          id: `chain-${chain.slug}`,
          label: chain.name,
          value: chain.totalMessages,
          radius: isFiltered ? chainRadius * 0.5 : chainRadius,
          color: chain.color || config.color,
          glowColor: isFiltered ? 'transparent' : `${chain.color || config.color}40`,
          metricLabel: `${formatNumber(chain.totalMessages)} msgs`,
          group: 'chain',
          iconUrl: chain.iconUrl || undefined,
        })

        bubbleLinks.push({
          source: `tier-${tier}`,
          target: `chain-${chain.slug}`,
          value: chain.totalMessages,
          color: isFiltered ? `${chain.color || config.color}10` : chain.color || config.color,
        })
      })
    })

    LZ_PRODUCTS.forEach(product => {
      bubbleNodes.push({
        id: `product-${product.id}`,
        label: product.name,
        value: 0,
        radius: 30,
        color: product.color,
        glowColor: `${product.color}40`,
        metricLabel: product.category,
        group: 'product',
      })

      bubbleLinks.push({
        source: 'lz-center',
        target: `product-${product.id}`,
        value: 1,
        color: product.color,
      })
    })

    if (showCompetitors) {
      COMPETITORS.forEach(competitor => {
        bubbleNodes.push({
          id: `competitor-${competitor.id}`,
          label: competitor.name,
          value: 0,
          radius: 22,
          color: competitor.color,
          glowColor: `${competitor.color}30`,
          metricLabel: competitor.messageVolume || competitor.category,
          group: 'competitor',
        })
      })
    }

    customBubbles.forEach(cb => {
      bubbleNodes.push({
        id: `custom-${cb.id}`,
        label: cb.name,
        value: 0,
        radius: 22,
        color: cb.color,
        glowColor: `${cb.color}30`,
        metricLabel: cb.type,
        group: 'custom',
      })

      bubbleLinks.push({
        source: 'lz-center',
        target: `custom-${cb.id}`,
        value: 1,
        color: cb.color + '60',
      })
    })

    return { nodes: bubbleNodes, links: bubbleLinks }
  }, [chains, tierFilter, showCompetitors, customBubbles])

  const handleNodeClick = useCallback((node: BubbleNode) => {
    if (node.id === 'lz-center') return

    if (node.id.startsWith('tier-')) {
      const tier = node.id.replace('tier-', '')
      router.push(`/tier/${tier}`)
      return
    }

    if (node.id.startsWith('chain-')) {
      const slug = node.id.replace('chain-', '')
      const chain = chainBySlug.get(slug)
      setSelectedNode(node)
      setSelectedChain(chain ?? null)
      setSelectedProduct(null)
      setSelectedCompetitor(null)
      return
    }

    if (node.id.startsWith('product-')) {
      const productId = node.id.replace('product-', '')
      const product = LZ_PRODUCTS.find(p => p.id === productId)
      if (product) {
        if (product.action === 'oapp-explainer') {
          setShowOAppExplainer(true)
          return
        }
        setSelectedNode(node)
        setSelectedProduct(product)
        setSelectedChain(null)
        setSelectedCompetitor(null)
      }
      return
    }

    if (node.id.startsWith('competitor-')) {
      const compId = node.id.replace('competitor-', '')
      const comp = COMPETITORS.find(c => c.id === compId)
      setSelectedNode(node)
      setSelectedCompetitor(comp ?? null)
      setSelectedChain(null)
      setSelectedProduct(null)
      return
    }

    if (node.id.startsWith('custom-')) {
      const cbId = node.id.replace('custom-', '')
      const cb = customBubbles.find(b => b.id === cbId)
      setSelectedNode(node)
      setSelectedChain(null)
      setSelectedProduct(null)
      setSelectedCompetitor(null)
      setSelectedCustom(cb ?? null)
      return
    }

    setSelectedNode(node)
    setSelectedChain(null)
    setSelectedProduct(null)
    setSelectedCompetitor(null)
  }, [router, chainBySlug, customBubbles])

  const dismissPanel = useCallback(() => {
    setSelectedNode(null)
    setSelectedChain(null)
    setSelectedProduct(null)
    setSelectedCompetitor(null)
    setSelectedCustom(null)
  }, [])

  const ecosystemApps = useMemo(() => {
    if (!selectedChain) return []
    const eco = getEcosystemByChain(selectedChain.slug)
    return eco?.apps ?? []
  }, [selectedChain])

  const lzApps = useMemo(() => ecosystemApps.filter(a => a.isLzIntegrated), [ecosystemApps])
  const ofts = useMemo(() => ecosystemApps.filter(a => a.category === 'OFT'), [ecosystemApps])

  return (
    <div className="relative w-full h-full">
      <BubbleMap
        nodes={nodes}
        links={links}
        onNodeClick={handleNodeClick}
        centerNode="lz-center"
      />

      {/* Tier filter controls */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded"
             style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(8px)', border: '1px solid var(--line-primary)' }}>
          <Filter size={12} style={{ color: 'var(--text-tertiary)' }} />
          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--text-tertiary)' }}>Tier</span>
        </div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setTierFilter('all')}
            className="px-2.5 py-1 rounded transition-all"
            style={{
              fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: 500, letterSpacing: '0.05em',
              background: tierFilter === 'all' ? 'rgba(242,242,242,0.1)' : 'rgba(10,10,10,0.7)',
              border: `1px solid ${tierFilter === 'all' ? 'rgba(242,242,242,0.2)' : 'var(--line-primary)'}`,
              color: tierFilter === 'all' ? 'var(--text-primary)' : 'var(--text-tertiary)',
            }}
          >
            ALL
          </button>
          {TIER_ORDER.map(tier => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier === tierFilter ? 'all' : tier)}
              className="px-2.5 py-1 rounded transition-all"
              style={{
                fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: 500,
                background: tierFilter === tier ? TIER_CONFIG[tier].color + '15' : 'rgba(10,10,10,0.7)',
                border: `1px solid ${tierFilter === tier ? TIER_CONFIG[tier].color + '50' : 'var(--line-primary)'}`,
                color: tierFilter === tier ? TIER_CONFIG[tier].color : 'var(--text-tertiary)',
              }}
            >
              {tier}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCompetitors(!showCompetitors)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-all"
          style={{
            fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: 500,
            background: showCompetitors ? 'rgba(245,104,104,0.08)' : 'rgba(10,10,10,0.7)',
            border: `1px solid ${showCompetitors ? 'rgba(245,104,104,0.25)' : 'var(--line-primary)'}`,
            color: showCompetitors ? 'var(--accent-red)' : 'var(--text-tertiary)',
          }}
        >
          {showCompetitors ? <Eye size={10} /> : <EyeOff size={10} />}
          Competitors
        </button>
      </div>

      {/* Add Bubble button */}
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded transition-colors"
          style={{
            background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(8px)',
            border: '1px solid var(--line-primary)',
            color: 'var(--text-secondary)',
            fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' as const,
          }}
        >
          <Plus size={12} />
          / Add
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-20 flex flex-col gap-1 px-3 py-2 rounded"
           style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(8px)', border: '1px solid var(--line-primary)' }}>
        <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--text-tertiary)', marginBottom: '2px' }}>Legend</span>
        {TIER_ORDER.map(tier => (
          <div key={tier} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: TIER_CONFIG[tier].color }} />
            <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: 'var(--text-secondary)' }}>
              {tier} — {TIER_CONFIG[tier].description.split(' ').slice(0, 4).join(' ')}
            </span>
          </div>
        ))}
        {showCompetitors && (
          <div className="flex items-center gap-2 mt-1 pt-1" style={{ borderTop: '1px solid var(--line-primary)' }}>
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-red)' }} />
            <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: 'var(--text-secondary)' }}>Competitors</span>
          </div>
        )}
      </div>

      <OAppExplainer isOpen={showOAppExplainer} onClose={() => setShowOAppExplainer(false)} />
      <AddBubbleModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddBubble} />

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 w-80 max-h-[calc(100%-2rem)] rounded shadow-2xl overflow-hidden z-30 flex flex-col"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--line-primary)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 shrink-0"
              style={{ borderBottom: `1px solid ${selectedNode.color}25` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded flex items-center justify-center text-sm"
                  style={{ backgroundColor: selectedNode.color + '15', border: `1px solid ${selectedNode.color}30`, color: selectedNode.color, fontFamily: "'Roboto Mono', monospace", fontWeight: 500 }}
                >
                  {selectedNode.label.slice(0, 2)}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 400, letterSpacing: '-0.03em', color: 'var(--text-primary)', fontSize: '15px' }}>{selectedNode.label}</h3>
                  <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '0.4px' }}>{selectedNode.metricLabel}</p>
                </div>
              </div>
              <button onClick={dismissPanel} className="p-1 rounded transition-colors"
                      style={{ color: 'var(--text-tertiary)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--line-primary)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1">
              {/* Chain detail panel */}
              {selectedChain && (
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <StatItem icon={<ArrowUpRight size={14} />} label="Sent" value={formatNumber(selectedChain.messagesSent)} color="#10B981" />
                    <StatItem icon={<ArrowDownLeft size={14} />} label="Received" value={formatNumber(selectedChain.messagesReceived)} color="#3B82F6" />
                    <StatItem icon={<Globe size={14} />} label="TVL" value={selectedChain.tvl > 0 ? formatCurrency(selectedChain.tvl) : '--'} color="#A855F7" />
                    <StatItem icon={<Layers size={14} />} label="OApps" value={String(selectedChain.activeOApps)} color="#F59E0B" />
                  </div>

                  {/* LZ Integrated Apps */}
                  {lzApps.length > 0 && (
                    <div className="pt-2 border-t border-[#1a1a1a]">
                      <p className="text-[10px] uppercase tracking-wider text-[#555] mb-1.5">
                        <Link2 size={10} className="inline mr-1" />
                        LayerZero Integrated ({lzApps.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {lzApps.map(app => (
                          <AppBadge key={app.name} app={app} integrated />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* OFTs on this chain */}
                  {ofts.length > 0 && (
                    <div className="pt-2 border-t border-[#1a1a1a]">
                      <p className="text-[10px] uppercase tracking-wider text-[#555] mb-1.5">
                        OFTs Deployed ({ofts.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {ofts.map(app => (
                          <span key={app.name} className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            {app.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ecosystem apps */}
                  {ecosystemApps.length > 0 && (
                    <div className="pt-2 border-t border-[#1a1a1a]">
                      <p className="text-[10px] uppercase tracking-wider text-[#555] mb-1.5">
                        Ecosystem ({ecosystemApps.length} apps)
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {ecosystemApps.filter(a => !a.isLzIntegrated).slice(0, 12).map(app => (
                          <AppBadge key={app.name} app={app} />
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedChain.connectedChains.length > 0 && (
                    <div className="pt-2 border-t border-[#1a1a1a]">
                      <p className="text-[10px] uppercase tracking-wider text-[#555] mb-1.5">
                        Connected Chains ({selectedChain.connectedChains.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selectedChain.connectedChains.slice(0, 8).map(eid => (
                          <span key={eid} className="text-[10px] px-1.5 py-0.5 rounded bg-[#111] text-[#888] border border-[#222]">
                            EID {eid}
                          </span>
                        ))}
                        {selectedChain.connectedChains.length > 8 && (
                          <span className="text-[10px] px-1.5 py-0.5 text-[#555]">
                            +{selectedChain.connectedChains.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/chain/${selectedChain.slug}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2
                                 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-sm text-white
                                 transition-colors border border-[#2a2a2a]"
                    >
                      View Chain Details
                      <ChevronRight size={13} />
                    </button>
                    <BubbleNoteButton entityType="chain" entityId={selectedChain.eid} entityName={selectedChain.name} />
                  </div>
                </div>
              )}

              {/* Product detail panel */}
              {selectedProduct && (
                <div className="p-4 space-y-3">
                  <p className="text-sm text-[#aaa]">{selectedProduct.description}</p>
                  {selectedProduct.externalUrl && (
                    <a
                      href={selectedProduct.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-3 py-2
                                 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-sm text-white
                                 transition-colors border border-[#2a2a2a]"
                    >
                      Open {selectedProduct.name}
                      <ExternalLink size={13} />
                    </a>
                  )}
                  <BubbleNoteButton entityType="product" entityId={selectedProduct.id} entityName={selectedProduct.name} />
                </div>
              )}

              {/* Competitor detail panel */}
              {selectedCompetitor && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-red-500/10 border border-red-500/20">
                    <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    <span className="text-[11px] text-red-300 font-medium">Competitor Protocol</span>
                  </div>
                  <p className="text-sm text-[#aaa]">{selectedCompetitor.description}</p>
                  {selectedCompetitor.messageVolume && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#111] border border-[#1a1a1a]">
                      <div className="shrink-0 text-red-400"><Layers size={14} /></div>
                      <div>
                        <p className="text-[10px] text-[#555] uppercase tracking-wider">Est. Volume</p>
                        <p className="text-sm font-mono font-semibold text-white">{selectedCompetitor.messageVolume}</p>
                      </div>
                    </div>
                  )}
                  <a
                    href={selectedCompetitor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2
                               rounded-lg bg-red-500/10 hover:bg-red-500/20 text-sm text-red-300
                               transition-colors border border-red-500/20"
                  >
                    Visit {selectedCompetitor.name}
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}

              {/* Custom bubble detail panel */}
              {selectedCustom && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#111] border border-[#1a1a1a]">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: selectedCustom.color }} />
                    <span className="text-[11px] text-[#aaa] font-medium capitalize">{selectedCustom.type}</span>
                  </div>
                  {selectedCustom.notes && (
                    <p className="text-sm text-[#aaa]">{selectedCustom.notes}</p>
                  )}
                  {selectedCustom.url && (
                    <a
                      href={selectedCustom.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-3 py-2
                                 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-sm text-white
                                 transition-colors border border-[#2a2a2a]"
                    >
                      Visit Website
                      <ExternalLink size={13} />
                    </a>
                  )}
                  <BubbleNoteButton entityType="custom" entityId={selectedCustom.id} entityName={selectedCustom.name} />
                  <button
                    onClick={() => {
                      setCustomBubbles(prev => prev.filter(b => b.id !== selectedCustom.id))
                      dismissPanel()
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2
                               rounded-lg bg-red-500/10 hover:bg-red-500/20 text-sm text-red-400
                               transition-colors border border-red-500/20"
                  >
                    Remove Bubble
                    <X size={13} />
                  </button>
                </div>
              )}

              {/* Generic fallback */}
              {!selectedChain && !selectedProduct && !selectedCompetitor && !selectedCustom && (
                <div className="p-4">
                  <div className="text-sm text-[#888]">
                    Total messages: {formatNumber(selectedNode.value)}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatItem({ icon, label, value, color }: {
  icon: React.ReactNode; label: string; value: string; color: string
}) {
  return (
    <div className="flex items-center gap-2 p-2 rounded"
         style={{ background: 'var(--bg-primary)', border: '1px solid var(--line-primary)' }}>
      <div className="shrink-0" style={{ color }}>{icon}</div>
      <div>
        <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--text-tertiary)' }}>{label}</p>
        <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{value}</p>
      </div>
    </div>
  )
}

function AppBadge({ app, integrated }: { app: EcosystemApp; integrated?: boolean }) {
  const inner = (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
      integrated
        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
        : 'bg-[#111] text-[#888] border-[#222] hover:text-white'
    } ${app.url ? 'cursor-pointer hover:border-[#444]' : ''}`}>
      {app.name}
    </span>
  )

  if (app.url) {
    return (
      <a href={app.url} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }
  return inner
}
