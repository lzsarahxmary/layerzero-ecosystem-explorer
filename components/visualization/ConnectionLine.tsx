'use client'

interface ConnectionLineProps {
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  thickness: number
  animated?: boolean
}

export function ConnectionLine({
  x1, y1, x2, y2,
  color,
  thickness,
  animated = true,
}: ConnectionLineProps) {
  return (
    <g>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={thickness}
        strokeOpacity={0.15}
        strokeDasharray={animated ? '8,4' : undefined}
        className={animated ? 'animate-dash' : undefined}
      />
    </g>
  )
}
