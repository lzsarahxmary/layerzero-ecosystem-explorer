import { NextRequest, NextResponse } from 'next/server'
import { getProtocols, getProtocolsByChain } from '@/lib/api/defillama'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chain = searchParams.get('chain')

    const data = chain ? await getProtocolsByChain(chain) : await getProtocols()

    return NextResponse.json({ data, error: null, cached: false, updatedAt: new Date().toISOString() })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
