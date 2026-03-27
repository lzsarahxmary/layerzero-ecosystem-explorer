'use client'

import Image from 'next/image'
import { getChainIconUrl, getChainColor } from '@/lib/utils/chain-colors'

interface ChainIconProps {
  name: string
  size?: number
  className?: string
}

export function ChainIcon({ name, size = 24, className = '' }: ChainIconProps) {
  const color = getChainColor(name)

  return (
    <div
      className={`rounded-full overflow-hidden shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        border: `1.5px solid ${color}40`,
        backgroundColor: `${color}15`,
      }}
    >
      <Image
        src={getChainIconUrl(name)}
        alt={name}
        width={size}
        height={size}
        className="object-cover"
        onError={(e) => {
          const target = e.currentTarget
          target.style.display = 'none'
        }}
      />
    </div>
  )
}
