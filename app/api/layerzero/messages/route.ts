import { NextRequest, NextResponse } from 'next/server'
import { getLatestMessages } from '@/lib/api/layerzero'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const result = await Promise.allSettled([
    getLatestMessages({
      limit: Number(searchParams.get('limit') ?? 100),
      srcChainIds: searchParams.get('srcChainIds') ?? undefined,
      dstChainIds: searchParams.get('dstChainIds') ?? undefined,
      nextToken: searchParams.get('nextToken') ?? undefined,
    }),
  ])

  if (result[0].status === 'fulfilled') {
    return NextResponse.json({ data: result[0].value.data, nextToken: result[0].value.nextToken, error: null })
  }

  return NextResponse.json({ data: [], error: String(result[0].reason) })
}
