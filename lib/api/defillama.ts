const DL_BASE = process.env.DEFILLAMA_API_BASE || 'https://api.llama.fi'

async function dlFetch<T>(path: string, base?: string): Promise<T> {
  const url = `${base || DL_BASE}${path}`
  const res = await fetch(url, {
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    throw new Error(`DefiLlama API error: ${res.status} ${res.statusText} - ${url}`)
  }

  return res.json()
}

export async function getProtocols() {
  return dlFetch<unknown[]>('/protocols')
}

export async function getProtocol(slug: string) {
  return dlFetch(`/protocol/${slug}`)
}

export async function getChains() {
  return dlFetch<unknown[]>('/chains')
}

export async function getHistoricalChainTvl(chain: string) {
  return dlFetch(`/v2/historicalChainTvl/${chain}`)
}

export async function getBridgeVolume(chain: string) {
  return dlFetch(`/bridgevolume/${chain}`)
}

export async function getProtocolsByChain(chainName: string): Promise<unknown[]> {
  const protocols = await getProtocols() as Array<{
    chains?: string[]
    [key: string]: unknown
  }>
  return protocols.filter(p =>
    p.chains?.some((c: string) => c.toLowerCase() === chainName.toLowerCase())
  )
}
