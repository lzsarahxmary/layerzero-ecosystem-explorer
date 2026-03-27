import { NextRequest, NextResponse } from 'next/server'
import { getProjects } from '@/lib/api/tokenterminal'

const CHAIN_NAME_MAP: Record<string, string[]> = {
  ethereum: ['ethereum'],
  arbitrum: ['arbitrum'],
  optimism: ['optimism'],
  base: ['base'],
  polygon: ['polygon'],
  bsc: ['binance', 'bsc', 'bnb'],
  avalanche: ['avalanche'],
  solana: ['solana'],
  linea: ['linea'],
  zksync: ['zksync', 'zksync_era'],
  scroll: ['scroll'],
  mantle: ['mantle'],
  blast: ['blast'],
  sei: ['sei'],
  fantom: ['fantom'],
  gnosis: ['gnosis'],
  celo: ['celo'],
}

export async function GET(request: NextRequest) {
  const chainSlug = request.nextUrl.searchParams.get('chain')

  try {
    const result = await Promise.allSettled([getProjects()])

    if (result[0].status === 'rejected') {
      return NextResponse.json({
        data: [],
        error: String(result[0].reason),
        updatedAt: new Date().toISOString(),
      })
    }

    let projects = (result[0].value as any)?.data ?? []

    if (chainSlug && CHAIN_NAME_MAP[chainSlug]) {
      const aliases = CHAIN_NAME_MAP[chainSlug]
      projects = projects.filter((p: any) => {
        const pChains = Array.isArray(p.chains) ? p.chains.map((c: string) => c.toLowerCase()) : []
        return aliases.some(alias => pChains.some((pc: string) => pc.includes(alias)))
      })
    }

    const mapped = projects.map((p: any) => ({
      id: p.project_id ?? p.id ?? '',
      name: p.project_name ?? p.name ?? '',
      symbol: p.symbol ?? '',
      category: p.category ?? p.market_sector ?? 'Other',
      chains: Array.isArray(p.chains) ? p.chains : [],
      logo: p.logo ?? null,
      tvl: p.tvl ?? p.market_cap_fully_diluted ?? 0,
      revenue30d: p.revenue_30d ?? null,
      fees30d: p.fees_30d ?? null,
      activeUsers30d: p.active_users_30d ?? p.monthly_active_users ?? null,
      volume30d: p.volume_30d ?? null,
      marketCap: p.market_cap ?? null,
    }))

    return NextResponse.json({
      data: mapped,
      total: mapped.length,
      chain: chainSlug,
      error: null,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      updatedAt: new Date().toISOString(),
    })
  }
}
