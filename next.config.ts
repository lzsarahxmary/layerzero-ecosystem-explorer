import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'icons.llamao.fi' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
    ],
  },
}

export default nextConfig
