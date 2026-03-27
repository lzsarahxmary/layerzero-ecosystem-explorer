const TT_BASE = process.env.TOKENTERMINAL_API_BASE || 'https://api.tokenterminal.com/v2'
const TT_KEY = process.env.TOKENTERMINAL_API_KEY || ''

async function ttFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${TT_BASE}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${TT_KEY}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    throw new Error(`TokenTerminal API error: ${res.status} ${res.statusText} - ${url}`)
  }

  return res.json()
}

export async function getProjects() {
  return ttFetch<{ data: unknown[] }>('/projects')
}

export async function getProject(projectId: string) {
  return ttFetch(`/projects/${projectId}`)
}

export async function getProjectMetrics(projectId: string, params?: {
  metric_ids?: string
  granularity?: 'daily' | 'weekly' | 'monthly'
  start_date?: string
  end_date?: string
}) {
  const search = new URLSearchParams()
  if (params?.metric_ids) search.set('metric_ids', params.metric_ids)
  if (params?.granularity) search.set('granularity', params.granularity)
  if (params?.start_date) search.set('start_date', params.start_date)
  if (params?.end_date) search.set('end_date', params.end_date)
  const qs = search.toString()
  return ttFetch(`/projects/${projectId}/metrics${qs ? `?${qs}` : ''}`)
}

export async function getMetricDefinitions() {
  return ttFetch('/metrics')
}
