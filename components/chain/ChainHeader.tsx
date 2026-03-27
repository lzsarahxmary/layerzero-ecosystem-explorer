'use client'

import type { Chain } from '@/types/chain'
import { ChainIcon } from '@/components/ui/ChainIcon'
import { Badge } from '@/components/ui/Badge'
import { TIER_CONFIG } from '@/lib/utils/tier'
import { formatNumber, formatCurrency } from '@/lib/utils/format'
import { ExternalLink, Copy } from 'lucide-react'

interface ChainHeaderProps {
  chain: Chain
}

export function ChainHeader({ chain }: ChainHeaderProps) {
  const tierConfig = TIER_CONFIG[chain.tier]

  return (
    <div className="flex items-start gap-4 p-4">
      <ChainIcon name={chain.name} size={48} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-white">{chain.name}</h1>
          <Badge variant="tier" color={tierConfig.color}>{chain.tier}</Badge>
          {chain.endpointVersion && (
            <Badge variant="oapp">{chain.endpointVersion}</Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-[#666]">
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>EID {chain.eid}</span>
          {chain.endpointAddress && (
            <span className="flex items-center gap-1">
              <span className="truncate max-w-[120px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {chain.endpointAddress}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(chain.endpointAddress!)}
                className="hover:text-white transition-colors"
              >
                <Copy size={10} />
              </button>
            </span>
          )}
          {chain.explorerUrl && (
            <a
              href={chain.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              Explorer <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
      <div className="flex gap-6 text-right shrink-0">
        <div>
          <div className="text-[11px] text-[#666] mb-0.5">Total Messages</div>
          <div className="text-lg font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {formatNumber(chain.totalMessages)}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-[#666] mb-0.5">Volume</div>
          <div className="text-lg font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {formatCurrency(chain.totalVolume)}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-[#666] mb-0.5">TVL</div>
          <div className="text-lg font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {formatCurrency(chain.tvl)}
          </div>
        </div>
      </div>
    </div>
  )
}
