import { NextResponse } from 'next/server'
import { getChains } from '@/lib/api/defillama'

export async function GET() {
  try {
    const data = await getChains()
    return NextResponse.json({ data, error: null, cached: false, updatedAt: new Date().toISOString() })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
