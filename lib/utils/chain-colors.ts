export const CHAIN_COLORS: Record<string, string> = {
  ethereum: '#627EEA',
  arbitrum: '#12AAFF',
  optimism: '#FF0420',
  base: '#0052FF',
  polygon: '#8247E5',
  bsc: '#F3BA2F',
  avalanche: '#E84142',
  solana: '#9945FF',
  fantom: '#1969FF',
  linea: '#61DFFF',
  zksync: '#4E529A',
  scroll: '#FFDBB0',
  mantle: '#00CCCC',
  blast: '#FCFC03',
  sei: '#9E1F63',
  gnosis: '#04795B',
  celo: '#FCFF52',
  moonbeam: '#53CBC8',
  aurora: '#70D44B',
  metis: '#00DACC',
  kava: '#FF564F',
  harmony: '#00ADE8',
  cronos: '#002D74',
  klaytn: '#FF5C00',
  aptos: '#2DD8A3',
  sui: '#6FBCF0',
  ton: '#0098EA',
  tron: '#FF0013',
  near: '#00C08B',
  cosmos: '#6F7390',
  polkadot: '#E6007A',
}

export function getChainColor(chainName: string): string {
  const key = chainName.toLowerCase().replace(/[\s-_]/g, '')
  return CHAIN_COLORS[key] ?? '#6B7280'
}

export function getChainIconUrl(chainName: string): string {
  const slug = chainName.toLowerCase().replace(/[\s]/g, '_')
  return `https://icons.llamao.fi/icons/chains/rsz_${slug}.jpg`
}
