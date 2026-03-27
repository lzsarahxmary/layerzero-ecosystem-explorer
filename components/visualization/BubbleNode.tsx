'use client'

interface BubbleNodeProps {
  id: string
  label: string
  radius: number
  color: string
  glowColor: string
  metricLabel?: string
  iconUrl?: string
  onClick?: () => void
}

export function BubbleNodeSVG({
  id,
  label,
  radius,
  color,
  metricLabel,
  onClick,
}: BubbleNodeProps) {
  return (
    <g className="bubble-node cursor-pointer" data-id={id} onClick={onClick}>
      <circle r={radius + 20} fill={color} opacity={0.08} filter="url(#glow)" />
      <circle
        className="pulse-ring"
        r={radius + 5}
        fill="none"
        stroke={color}
        opacity={0}
        strokeWidth={1.5}
      />
      <circle
        className="main-bubble"
        r={radius}
        fill={`url(#grad-${id})`}
        stroke={color}
        strokeWidth={1.5}
        strokeOpacity={0.6}
      />
      <text
        dy={radius + 18}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize={12}
        fontWeight={600}
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {label}
      </text>
      {metricLabel && (
        <text
          dy={radius + 32}
          textAnchor="middle"
          fill="#888888"
          fontSize={10}
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {metricLabel}
        </text>
      )}
    </g>
  )
}
