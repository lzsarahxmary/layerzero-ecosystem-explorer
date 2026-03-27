export type Tier = 'P0' | 'P1' | 'P2' | 'P3' | 'P4'

export interface TierConfig {
  tier: Tier
  label: string
  description: string
  color: string
  glowColor: string
  bubbleSize: { min: number; max: number }
}

export const TIER_CONFIG: Record<Tier, TierConfig> = {
  P0: {
    tier: 'P0',
    label: 'P0 — Critical',
    description: 'Highest-volume chains driving the most LayerZero messages',
    color: '#00D4FF',
    glowColor: 'rgba(0, 212, 255, 0.4)',
    bubbleSize: { min: 80, max: 120 },
  },
  P1: {
    tier: 'P1',
    label: 'P1 — High Priority',
    description: 'High-activity chains with significant cross-chain traffic',
    color: '#7C3AED',
    glowColor: 'rgba(124, 58, 237, 0.4)',
    bubbleSize: { min: 60, max: 90 },
  },
  P2: {
    tier: 'P2',
    label: 'P2 — Medium',
    description: 'Active chains with growing LayerZero adoption',
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    bubbleSize: { min: 45, max: 70 },
  },
  P3: {
    tier: 'P3',
    label: 'P3 — Growing',
    description: 'Emerging chains with early LayerZero integration',
    color: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    bubbleSize: { min: 35, max: 55 },
  },
  P4: {
    tier: 'P4',
    label: 'P4 — Early Stage',
    description: 'New chains with initial LayerZero endpoints',
    color: '#6B7280',
    glowColor: 'rgba(107, 114, 128, 0.2)',
    bubbleSize: { min: 25, max: 40 },
  },
}

export const TIER_ORDER: Tier[] = ['P0', 'P1', 'P2', 'P3', 'P4']

export function classifyChainTier(
  chain: { totalMessages: number },
  allChains: { totalMessages: number }[]
): Tier {
  const sorted = [...allChains].sort((a, b) => b.totalMessages - a.totalMessages)
  const top5 = Math.ceil(sorted.length * 0.05)
  const top15 = Math.ceil(sorted.length * 0.15)
  const top35 = Math.ceil(sorted.length * 0.35)
  const top65 = Math.ceil(sorted.length * 0.65)

  const rank = sorted.findIndex(c => c.totalMessages <= chain.totalMessages) + 1

  if (rank <= top5) return 'P0'
  if (rank <= top15) return 'P1'
  if (rank <= top35) return 'P2'
  if (rank <= top65) return 'P3'
  return 'P4'
}

export function getTierForMessages(messages: number, allMessages: number[]): Tier {
  const sorted = [...allMessages].sort((a, b) => b - a)
  const top5 = Math.ceil(sorted.length * 0.05)
  const top15 = Math.ceil(sorted.length * 0.15)
  const top35 = Math.ceil(sorted.length * 0.35)
  const top65 = Math.ceil(sorted.length * 0.65)

  const rank = sorted.findIndex(m => m <= messages) + 1

  if (rank <= top5) return 'P0'
  if (rank <= top15) return 'P1'
  if (rank <= top35) return 'P2'
  if (rank <= top65) return 'P3'
  return 'P4'
}
