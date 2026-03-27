export interface LZProduct {
  id: string
  name: string
  description: string
  color: string
  icon: string
  url?: string
  externalUrl?: string
  category: string
  action?: 'oapp-explainer' | 'external'
}

export const LZ_PRODUCTS: LZProduct[] = [
  {
    id: 'stargate',
    name: 'Stargate',
    description: 'The omnichain liquidity protocol — native asset bridge',
    color: '#00A0FF',
    icon: '/product-icons/stargate.svg',
    url: 'https://stargate.finance',
    externalUrl: 'https://stargate.finance',
    category: 'Bridge',
    action: 'external',
  },
  {
    id: 'oft-standard',
    name: 'OFT Standard',
    description: 'Omnichain Fungible Token — the cross-chain token standard',
    color: '#7C3AED',
    icon: '/product-icons/oft.svg',
    externalUrl: 'https://layerzeroscan.com/oft',
    category: 'Token Standard',
    action: 'external',
  },
  {
    id: 'oapp',
    name: 'OApp Framework',
    description: 'Omnichain Application framework for building cross-chain apps',
    color: '#10B981',
    icon: '/product-icons/oapp.svg',
    externalUrl: 'https://docs.layerzero.network/v2/developers/evm/oft/quickstart',
    category: 'Developer Framework',
    action: 'oapp-explainer',
  },
  {
    id: 'value-transfer-api',
    name: 'Value Transfer API',
    description: 'Programmable cross-chain value transfer via REST API',
    color: '#F59E0B',
    icon: '/product-icons/api.svg',
    externalUrl: 'https://product-operations.vercel.app/value-transfer/revenue',
    category: 'API Product',
    action: 'external',
  },
  {
    id: 'console',
    name: 'LZ Console',
    description: 'LayerZero developer dashboard for managing deployments',
    color: '#EF4444',
    icon: '/product-icons/console.svg',
    externalUrl: 'https://layerzero.network/interop',
    category: 'Developer Tool',
    action: 'external',
  },
  {
    id: 'scan',
    name: 'LZ Scan',
    description: 'Cross-chain message explorer and analytics',
    color: '#06B6D4',
    icon: '/product-icons/scan.svg',
    externalUrl: 'https://layerzeroscan.com',
    category: 'Explorer',
    action: 'external',
  },
]
