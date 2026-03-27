import { NextRequest, NextResponse } from 'next/server'
import { getProjectMetrics } from '@/lib/api/tokenterminal'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    if (!projectId) {
      return NextResponse.json({ data: null, error: 'projectId required' }, { status: 400 })
    }

    const data = await getProjectMetrics(projectId, {
      metric_ids: searchParams.get('metric_ids') ?? undefined,
      granularity: (searchParams.get('granularity') as 'daily' | 'weekly' | 'monthly') ?? undefined,
    })

    return NextResponse.json({ data, error: null, cached: false, updatedAt: new Date().toISOString() })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
