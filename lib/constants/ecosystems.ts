export interface EcosystemApp {
  name: string
  category: 'DeFi' | 'Bridge' | 'Oracle' | 'Infrastructure' | 'NFT' | 'Gaming' | 'Social' | 'Payments' | 'OFT' | 'OApp'
  isLzIntegrated: boolean
  url?: string
}

export interface ChainEcosystem {
  chainSlug: string
  apps: EcosystemApp[]
}

export interface Competitor {
  id: string
  name: string
  description: string
  color: string
  url: string
  messageVolume?: string
  category: string
}

export const CHAIN_ECOSYSTEMS: ChainEcosystem[] = [
  {
    chainSlug: 'ethereum',
    apps: [
      { name: 'Stargate', category: 'Bridge', isLzIntegrated: true, url: 'https://stargate.finance' },
      { name: 'Uniswap', category: 'DeFi', isLzIntegrated: false, url: 'https://uniswap.org' },
      { name: 'Aave', category: 'DeFi', isLzIntegrated: false, url: 'https://aave.com' },
      { name: 'Lido', category: 'DeFi', isLzIntegrated: false, url: 'https://lido.fi' },
      { name: 'Pendle', category: 'DeFi', isLzIntegrated: true, url: 'https://pendle.finance' },
      { name: 'Radiant Capital', category: 'DeFi', isLzIntegrated: true, url: 'https://radiant.capital' },
      { name: 'Chainlink', category: 'Oracle', isLzIntegrated: false, url: 'https://chain.link' },
      { name: 'Tapioca', category: 'OApp', isLzIntegrated: true, url: 'https://tapioca.xyz' },
      { name: 'OFT USDC (Stargate)', category: 'OFT', isLzIntegrated: true },
      { name: 'The Graph', category: 'Infrastructure', isLzIntegrated: false, url: 'https://thegraph.com' },
      { name: 'EigenLayer', category: 'Infrastructure', isLzIntegrated: false, url: 'https://eigenlayer.xyz' },
      { name: 'Ethena', category: 'DeFi', isLzIntegrated: true, url: 'https://ethena.fi' },
    ],
  },
  {
    chainSlug: 'arbitrum',
    apps: [
      { name: 'Stargate', category: 'Bridge', isLzIntegrated: true, url: 'https://stargate.finance' },
      { name: 'GMX', category: 'DeFi', isLzIntegrated: false, url: 'https://gmx.io' },
      { name: 'Camelot', category: 'DeFi', isLzIntegrated: false, url: 'https://camelot.exchange' },
      { name: 'Radiant Capital', category: 'DeFi', isLzIntegrated: true, url: 'https://radiant.capital' },
      { name: 'Pendle', category: 'DeFi', isLzIntegrated: true, url: 'https://pendle.finance' },
      { name: 'Trader Joe', category: 'DeFi', isLzIntegrated: true, url: 'https://traderjoexyz.com' },
      { name: 'Aave', category: 'DeFi', isLzIntegrated: false, url: 'https://aave.com' },
      { name: 'Chainlink', category: 'Oracle', isLzIntegrated: false, url: 'https://chain.link' },
      { name: 'OFT JOE', category: 'OFT', isLzIntegrated: true },
      { name: 'Rage Trade', category: 'DeFi', isLzIntegrated: false, url: 'https://rage.trade' },
      { name: 'Silo Finance', category: 'DeFi', isLzIntegrated: false, url: 'https://silo.finance' },
      { name: 'Tapioca', category: 'OApp', isLzIntegrated: true, url: 'https://tapioca.xyz' },
    ],
  },
  {
    chainSlug: 'optimism',
    apps: [
      { name: 'Stargate', category: 'Bridge', isLzIntegrated: true, url: 'https://stargate.finance' },
      { name: 'Velodrome', category: 'DeFi', isLzIntegrated: false, url: 'https://velodrome.finance' },
      { name: 'Synthetix', category: 'DeFi', isLzIntegrated: false, url: 'https://synthetix.io' },
      { name: 'Aave', category: 'DeFi', isLzIntegrated: false, url: 'https://aave.com' },
      { name: 'Sonne Finance', category: 'DeFi', isLzIntegrated: false, url: 'https://sonne.finance' },
      { name: 'Pendle', category: 'DeFi', isLzIntegrated: true, url: 'https://pendle.finance' },
      { name: 'Chainlink', category: 'Oracle', isLzIntegrated: false, url: 'https://chain.link' },
      { name: 'Exactly Protocol', category: 'DeFi', isLzIntegrated: false, url: 'https://exact.ly' },
      { name: 'OFT STG', category: 'OFT', isLzIntegrated: true },
      { name: 'Beethoven X', category: 'DeFi', isLzIntegrated: false, url: 'https://beets.fi' },
    ],
  },
  {
    chainSlug: 'base',
    apps: [
      { name: 'Stargate', category: 'Bridge', isLzIntegrated: true, url: 'https://stargate.finance' },
      { name: 'Aerodrome', category: 'DeFi', isLzIntegrated: false, url: 'https://aerodrome.finance' },
      { name: 'Uniswap', category: 'DeFi', isLzIntegrated: false, url: 'https://uniswap.org' },
      { name: 'Aave', category: 'DeFi', isLzIntegrated: false, url: 'https://aave.com' },
      { name: 'Moonwell', category: 'DeFi', isLzIntegrated: false, url: 'https://moonwell.fi' },
      { name: 'Extra Finance', category: 'DeFi', isLzIntegrated: false, url: 'https://extra.finance' },
      { name: 'Pendle', category: 'DeFi', isLzIntegrated: true, url: 'https://pendle.finance' },
      { name: 'Chainlink', category: 'Oracle', isLzIntegrated: false, url: 'https://chain.link' },
      { name: 'Friend.tech', category: 'Social', isLzIntegrated: false, url: 'https://friend.tech' },
      { name: 'OFT USDC (Stargate)', category: 'OFT', isLzIntegrated: true },
      { name: 'Seamless Protocol', category: 'DeFi', isLzIntegrated: false, url: 'https://seamlessprotocol.com' },
    ],
  },
  {
    chainSlug: 'polygon',
    apps: [
      { name: 'Stargate', category: 'Bridge', isLzIntegrated: true, url: 'https://stargate.finance' },
      { name: 'QuickSwap', category: 'DeFi', isLzIntegrated: false, url: 'https://quickswap.exchange' },
      { name: 'Aave', category: 'DeFi', isLzIntegrated: false, url: 'https://aave.com' },
      { name: 'Uniswap', category: 'DeFi', isLzIntegrated: false, url: 'https://uniswap.org' },
      { name: 'Chainlink', category: 'Oracle', isLzIntegrated: false, url: 'https://chain.link' },
      { name: 'Pendle', category: 'DeFi', isLzIntegrated: true, url: 'https://pendle.finance' },
      { name: 'Balancer', category: 'DeFi', isLzIntegrated: false, url: 'https://balancer.fi' },
      { name: 'Gains Network', category: 'DeFi', isLzIntegrated: false, url: 'https://gains.trade' },
      { name: 'OFT STG', category: 'OFT', isLzIntegrated: true },
      { name: 'Lens Protocol', category: 'Social', isLzIntegrated: false, url: 'https://lens.xyz' },
      { name: 'Polymarket', category: 'DeFi', isLzIntegrated: false, url: 'https://polymarket.com' },
    ],
  },
  {
    chainSlug: 'bsc',
    apps: [
      { name: 'Stargate', category: 'Bridge', isLzIntegrated: true, url: 'https://stargate.finance' },
      { name: 'PancakeSwap', category: 'DeFi', isLzIntegrated: true, url: 'https://pancakeswap.finance' },
      { name: 'Venus', category: 'DeFi', isLzIntegrated: false, url: 'https://venus.io' },
      { name: 'Trader Joe', category: 'DeFi', isLzIntegrated: true, url: 'https://traderjoexyz.com' },
      { name: 'Radiant Capital', category: 'DeFi', isLzIntegrated: true, url: 'https://radiant.capital' },
      { name: 'Alpaca Finance', category: 'DeFi', isLzIntegrated: false, url: 'https://alpacafinance.org' },
      { name: 'Chainlink', category: 'Oracle', isLzIntegrated: false, url: 'https://chain.link' },
      { name: 'Biswap', category: 'DeFi', isLzIntegrated: false, url: 'https://biswap.org' },
      { name: 'OFT CAKE', category: 'OFT', isLzIntegrated: true },
      { name: 'Thena', category: 'DeFi', isLzIntegrated: false, url: 'https://thena.fi' },
      { name: 'Wombat Exchange', category: 'DeFi', isLzIntegrated: true, url: 'https://wombat.exchange' },
      { name: 'OFT WOM', category: 'OFT', isLzIntegrated: true },
    ],
  },
  {
    chainSlug: 'avalanche',
    apps: [
      { name: 'Stargate', category: 'Bridge', isLzIntegrated: true, url: 'https://stargate.finance' },
      { name: 'Trader Joe', category: 'DeFi', isLzIntegrated: true, url: 'https://traderjoexyz.com' },
      { name: 'Aave', category: 'DeFi', isLzIntegrated: false, url: 'https://aave.com' },
      { name: 'Benqi', category: 'DeFi', isLzIntegrated: false, url: 'https://benqi.fi' },
      { name: 'Platypus Finance', category: 'DeFi', isLzIntegrated: false, url: 'https://platypus.finance' },
      { name: 'Chainlink', category: 'Oracle', isLzIntegrated: false, url: 'https://chain.link' },
      { name: 'Pendle', category: 'DeFi', isLzIntegrated: true, url: 'https://pendle.finance' },
      { name: 'GMX', category: 'DeFi', isLzIntegrated: false, url: 'https://gmx.io' },
      { name: 'OFT JOE', category: 'OFT', isLzIntegrated: true },
      { name: 'Pangolin', category: 'DeFi', isLzIntegrated: false, url: 'https://pangolin.exchange' },
      { name: 'OFT BTC.b', category: 'OFT', isLzIntegrated: true },
    ],
  },
  {
    chainSlug: 'solana',
    apps: [
      { name: 'Stargate', category: 'Bridge', isLzIntegrated: true, url: 'https://stargate.finance' },
      { name: 'Jupiter', category: 'DeFi', isLzIntegrated: false, url: 'https://jup.ag' },
      { name: 'Raydium', category: 'DeFi', isLzIntegrated: false, url: 'https://raydium.io' },
      { name: 'Marinade Finance', category: 'DeFi', isLzIntegrated: false, url: 'https://marinade.finance' },
      { name: 'Orca', category: 'DeFi', isLzIntegrated: false, url: 'https://orca.so' },
      { name: 'Drift Protocol', category: 'DeFi', isLzIntegrated: false, url: 'https://drift.trade' },
      { name: 'Pyth Network', category: 'Oracle', isLzIntegrated: false, url: 'https://pyth.network' },
      { name: 'Tensor', category: 'NFT', isLzIntegrated: false, url: 'https://tensor.trade' },
      { name: 'Kamino Finance', category: 'DeFi', isLzIntegrated: false, url: 'https://kamino.finance' },
      { name: 'Jito', category: 'Infrastructure', isLzIntegrated: false, url: 'https://jito.network' },
      { name: 'OFT (Solana OFTs)', category: 'OFT', isLzIntegrated: true },
    ],
  },
  {
    chainSlug: 'linea',
    apps: [
      { name: 'Stargate', category: 'Bridge', isLzIntegrated: true, url: 'https://stargate.finance' },
      { name: 'SyncSwap', category: 'DeFi', isLzIntegrated: false, url: 'https://syncswap.xyz' },
      { name: 'Nile Exchange', category: 'DeFi', isLzIntegrated: false, url: 'https://nile.build' },
      { name: 'Mendi Finance', category: 'DeFi', isLzIntegrated: false, url: 'https://mendi.finance' },
      { name: 'LineaBank', category: 'DeFi', isLzIntegrated: false, url: 'https://lineabank.finance' },
      { name: 'iZUMi Finance', category: 'DeFi', isLzIntegrated: false, url: 'https://izumi.finance' },
      { name: 'Chainlink', category: 'Oracle', isLzIntegrated: false, url: 'https://chain.link' },
      { name: 'OFT STG', category: 'OFT', isLzIntegrated: true },
      { name: 'EchoDEX', category: 'DeFi', isLzIntegrated: false, url: 'https://echodex.io' },
    ],
  },
  {
    chainSlug: 'zksync',
    apps: [
      { name: 'Stargate', category: 'Bridge', isLzIntegrated: true, url: 'https://stargate.finance' },
      { name: 'SyncSwap', category: 'DeFi', isLzIntegrated: false, url: 'https://syncswap.xyz' },
      { name: 'Mute.io', category: 'DeFi', isLzIntegrated: false, url: 'https://mute.io' },
      { name: 'SpaceFi', category: 'DeFi', isLzIntegrated: false, url: 'https://spacefi.io' },
      { name: 'Maverick Protocol', category: 'DeFi', isLzIntegrated: false, url: 'https://mav.xyz' },
      { name: 'Velocore', category: 'DeFi', isLzIntegrated: false, url: 'https://velocore.xyz' },
      { name: 'Chainlink', category: 'Oracle', isLzIntegrated: false, url: 'https://chain.link' },
      { name: 'OFT STG', category: 'OFT', isLzIntegrated: true },
      { name: 'Holdstation', category: 'DeFi', isLzIntegrated: false, url: 'https://holdstation.com' },
      { name: 'ReactorFusion', category: 'DeFi', isLzIntegrated: false, url: 'https://reactorfusion.xyz' },
    ],
  },
  {
    chainSlug: 'scroll',
    apps: [
      { name: 'Stargate', category: 'Bridge', isLzIntegrated: true, url: 'https://stargate.finance' },
      { name: 'Ambient Finance', category: 'DeFi', isLzIntegrated: false, url: 'https://ambient.finance' },
      { name: 'Aave', category: 'DeFi', isLzIntegrated: false, url: 'https://aave.com' },
      { name: 'SyncSwap', category: 'DeFi', isLzIntegrated: false, url: 'https://syncswap.xyz' },
      { name: 'Pendle', category: 'DeFi', isLzIntegrated: true, url: 'https://pendle.finance' },
      { name: 'Chainlink', category: 'Oracle', isLzIntegrated: false, url: 'https://chain.link' },
      { name: 'Nuri Exchange', category: 'DeFi', isLzIntegrated: false, url: 'https://nuri.exchange' },
      { name: 'OFT STG', category: 'OFT', isLzIntegrated: true },
      { name: 'Layerbank', category: 'DeFi', isLzIntegrated: false, url: 'https://layerbank.finance' },
    ],
  },
  {
    chainSlug: 'mantle',
    apps: [
      { name: 'Stargate', category: 'Bridge', isLzIntegrated: true, url: 'https://stargate.finance' },
      { name: 'Agni Finance', category: 'DeFi', isLzIntegrated: false, url: 'https://agni.finance' },
      { name: 'FusionX', category: 'DeFi', isLzIntegrated: false, url: 'https://fusionx.finance' },
      { name: 'Lendle', category: 'DeFi', isLzIntegrated: false, url: 'https://lendle.xyz' },
      { name: 'Pendle', category: 'DeFi', isLzIntegrated: true, url: 'https://pendle.finance' },
      { name: 'Merchant Moe', category: 'DeFi', isLzIntegrated: true, url: 'https://merchantmoe.com' },
      { name: 'Chainlink', category: 'Oracle', isLzIntegrated: false, url: 'https://chain.link' },
      { name: 'OFT STG', category: 'OFT', isLzIntegrated: true },
      { name: 'Aurelius Finance', category: 'DeFi', isLzIntegrated: false, url: 'https://aurelius.finance' },
      { name: 'iZUMi Finance', category: 'DeFi', isLzIntegrated: false, url: 'https://izumi.finance' },
    ],
  },
  {
    chainSlug: 'blast',
    apps: [
      { name: 'Stargate', category: 'Bridge', isLzIntegrated: true, url: 'https://stargate.finance' },
      { name: 'Thruster', category: 'DeFi', isLzIntegrated: false, url: 'https://thruster.finance' },
      { name: 'Hyperlock Finance', category: 'DeFi', isLzIntegrated: false, url: 'https://hyperlock.finance' },
      { name: 'Juice Finance', category: 'DeFi', isLzIntegrated: false, url: 'https://juice.finance' },
      { name: 'Particle Trade', category: 'DeFi', isLzIntegrated: false, url: 'https://particle.trade' },
      { name: 'Orbit Protocol', category: 'DeFi', isLzIntegrated: false, url: 'https://orbitlending.io' },
      { name: 'Fenix Finance', category: 'DeFi', isLzIntegrated: false, url: 'https://fenix.finance' },
      { name: 'OFT STG', category: 'OFT', isLzIntegrated: true },
      { name: 'Chainlink', category: 'Oracle', isLzIntegrated: false, url: 'https://chain.link' },
    ],
  },
  {
    chainSlug: 'sei',
    apps: [
      { name: 'Stargate', category: 'Bridge', isLzIntegrated: true, url: 'https://stargate.finance' },
      { name: 'DragonSwap', category: 'DeFi', isLzIntegrated: false, url: 'https://dragonswap.app' },
      { name: 'Yei Finance', category: 'DeFi', isLzIntegrated: false, url: 'https://yei.finance' },
      { name: 'Jellyverse', category: 'DeFi', isLzIntegrated: false, url: 'https://jellyverse.org' },
      { name: 'Pyth Network', category: 'Oracle', isLzIntegrated: false, url: 'https://pyth.network' },
      { name: 'Silo Finance', category: 'DeFi', isLzIntegrated: false, url: 'https://silo.finance' },
      { name: 'OFT STG', category: 'OFT', isLzIntegrated: true },
      { name: 'Kryptonite', category: 'DeFi', isLzIntegrated: false, url: 'https://kryptonite.finance' },
    ],
  },
]

export const COMPETITORS: Competitor[] = [
  {
    id: 'chainlink-ccip',
    name: 'Chainlink CCIP',
    description: 'Cross-Chain Interoperability Protocol powered by Chainlink oracle networks',
    color: '#EF4444',
    url: 'https://chain.link/cross-chain',
    messageVolume: '~2M messages',
    category: 'Cross-Chain Messaging',
  },
  {
    id: 'wormhole',
    name: 'Wormhole',
    description: 'Generic message-passing protocol connecting 30+ blockchains with guardian-based verification',
    color: '#DC2626',
    url: 'https://wormhole.com',
    messageVolume: '~1B messages',
    category: 'Cross-Chain Messaging',
  },
  {
    id: 'axelar',
    name: 'Axelar',
    description: 'Universal overlay network for cross-chain communication using proof-of-stake consensus',
    color: '#B91C1C',
    url: 'https://axelar.network',
    messageVolume: '~50M messages',
    category: 'Cross-Chain Messaging',
  },
  {
    id: 'hyperlane',
    name: 'Hyperlane',
    description: 'Permissionless interoperability layer with modular security via Interchain Security Modules',
    color: '#991B1B',
    url: 'https://hyperlane.xyz',
    messageVolume: '~10M messages',
    category: 'Cross-Chain Messaging',
  },
  {
    id: 'debridge',
    name: 'deBridge',
    description: 'High-performance cross-chain trading infrastructure with deferred liquidity model',
    color: '#F87171',
    url: 'https://debridge.finance',
    messageVolume: '~15M messages',
    category: 'Cross-Chain Messaging',
  },
]

export function getEcosystemByChain(chainSlug: string): ChainEcosystem | undefined {
  return CHAIN_ECOSYSTEMS.find(e => e.chainSlug === chainSlug)
}

export function getLzIntegratedApps(chainSlug: string): EcosystemApp[] {
  const ecosystem = getEcosystemByChain(chainSlug)
  return ecosystem?.apps.filter(a => a.isLzIntegrated) ?? []
}

export function getAppsByCategory(chainSlug: string, category: EcosystemApp['category']): EcosystemApp[] {
  const ecosystem = getEcosystemByChain(chainSlug)
  return ecosystem?.apps.filter(a => a.category === category) ?? []
}
