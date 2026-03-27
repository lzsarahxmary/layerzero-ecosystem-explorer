'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import * as d3 from 'd3'
import type { BubbleState } from '@/types/api'

export interface BubbleNode {
  id: string
  label: string
  value: number
  radius: number
  color: string
  glowColor: string
  iconUrl?: string
  metricLabel?: string
  group?: string
  fixed?: boolean
  fx?: number | null
  fy?: number | null
  x?: number
  y?: number
  vx?: number
  vy?: number
}

export interface BubbleLink {
  source: string
  target: string
  value: number
  color?: string
}

interface BubbleMapProps {
  nodes: BubbleNode[]
  links?: BubbleLink[]
  onNodeClick?: (node: BubbleNode) => void
  onNodeHover?: (node: BubbleNode | null) => void
  getBubbleState?: (id: string) => BubbleState
  centerNode?: string
  className?: string
  showLabels?: boolean
  animated?: boolean
}

export function BubbleMap({
  nodes,
  links = [],
  onNodeClick,
  onNodeHover,
  getBubbleState,
  centerNode,
  className = '',
  showLabels = true,
  animated = true,
}: BubbleMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const simulationRef = useRef<d3.Simulation<BubbleNode, BubbleLink> | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  const getOpacity = useCallback((id: string) => {
    if (!getBubbleState) return 1
    const state = getBubbleState(id)
    if (state === 'dimmed') return 0.15
    if (state === 'highlighted') return 1
    return 1
  }, [getBubbleState])

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setDimensions({ width: Math.max(width, 400), height: Math.max(height, 400) })
      }
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return
    const { width, height } = dimensions

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const defs = svg.append('defs')

    defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%')
      .append('feGaussianBlur')
      .attr('stdDeviation', '6')
      .attr('result', 'blur')

    nodes.forEach(node => {
      const grad = defs.append('radialGradient')
        .attr('id', `grad-${node.id}`)
        .attr('cx', '35%').attr('cy', '35%')
      grad.append('stop').attr('offset', '0%')
        .attr('stop-color', node.color).attr('stop-opacity', 0.3)
      grad.append('stop').attr('offset', '100%')
        .attr('stop-color', node.color).attr('stop-opacity', 0.05)
    })

    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 15).attr('refY', 0)
      .attr('markerWidth', 6).attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#ffffff')
      .attr('opacity', 0.3)

    const g = svg.append('g')

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString())
      })

    svg.call(zoom)

    const maxLinkValue = Math.max(...links.map(l => l.value), 1)
    const linkScale = d3.scaleLog().domain([1, maxLinkValue]).range([1, 8]).clamp(true)

    const linkElements = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => d.color || '#ffffff')
      .attr('stroke-opacity', 0.12)
      .attr('stroke-width', d => linkScale(Math.max(d.value, 1)))
      .attr('stroke-dasharray', '8,4')

    const nodeData = nodes.map(n => ({ ...n }))

    const nodeGroup = g.append('g')
      .selectAll<SVGGElement, BubbleNode>('g')
      .data(nodeData, d => d.id)
      .join('g')
      .attr('cursor', 'pointer')
      .style('opacity', animated ? 0 : 1)

    if (animated) {
      nodeGroup.transition().duration(600).delay((_, i) => i * 30).style('opacity', 1)
    }

    nodeGroup.append('circle')
      .attr('r', d => d.radius + 20)
      .attr('fill', d => d.color)
      .attr('opacity', 0.06)
      .attr('filter', 'url(#glow)')

    nodeGroup.append('circle')
      .attr('class', 'pulse-ring')
      .attr('r', d => d.radius + 5)
      .attr('fill', 'none')
      .attr('stroke', d => d.color)
      .attr('stroke-opacity', 0)
      .attr('stroke-width', 1.5)

    nodeGroup.append('circle')
      .attr('class', 'main-bubble')
      .attr('r', d => d.radius)
      .attr('fill', d => `url(#grad-${d.id})`)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.6)

    nodeGroup.each(function (d) {
      if (d.iconUrl && d.group === 'center') {
        d3.select(this).append('image')
          .attr('href', d.iconUrl)
          .attr('x', -d.radius * 0.45)
          .attr('y', -d.radius * 0.45)
          .attr('width', d.radius * 0.9)
          .attr('height', d.radius * 0.9)
          .attr('pointer-events', 'none')
      }
    })

    if (showLabels) {
      nodeGroup.append('text')
        .attr('dy', d => d.radius + 18)
        .attr('text-anchor', 'middle')
        .attr('fill', '#FFFFFF')
        .attr('font-size', 12)
        .attr('font-weight', 600)
        .attr('font-family', 'Inter, system-ui, sans-serif')
        .text(d => d.label)

      nodeGroup.append('text')
        .attr('dy', d => d.radius + 32)
        .attr('text-anchor', 'middle')
        .attr('fill', '#888888')
        .attr('font-size', 10)
        .attr('font-family', "'JetBrains Mono', monospace")
        .text(d => d.metricLabel ?? '')
    }

    nodeGroup
      .on('mouseenter', function (event, d) {
        d3.select(this).select('.pulse-ring')
          .transition().duration(200)
          .attr('stroke-opacity', 0.4)
        d3.select(this).select('.main-bubble')
          .transition().duration(200)
          .attr('r', d.radius * 1.05)
        onNodeHover?.(d)
      })
      .on('mouseleave', function (_, d) {
        d3.select(this).select('.pulse-ring')
          .transition().duration(200)
          .attr('stroke-opacity', 0)
        d3.select(this).select('.main-bubble')
          .transition().duration(200)
          .attr('r', d.radius)
        onNodeHover?.(null)
      })
      .on('click', (_, d) => onNodeClick?.(d))

    const drag = d3.drag<SVGGElement, BubbleNode>()
      .on('start', (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on('drag', (event, d) => {
        d.fx = event.x
        d.fy = event.y
      })
      .on('end', (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0)
        if (!d.fixed) {
          d.fx = null
          d.fy = null
        }
      })

    nodeGroup.call(drag)

    const nodeMap = new Map(nodeData.map(n => [n.id, n]))
    const simLinks = links.map(l => ({
      ...l,
      source: nodeMap.get(l.source) || l.source,
      target: nodeMap.get(l.target) || l.target,
    }))

    const simulation = d3.forceSimulation(nodeData)
      .force('charge', d3.forceManyBody<BubbleNode>().strength(d => -(d.radius * 12)))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<BubbleNode>().radius(d => d.radius + 15).strength(0.8))
      .force('link', d3.forceLink(simLinks).id((d: unknown) => (d as BubbleNode).id).distance(200).strength(0.3))
      .on('tick', () => {
        linkElements
          .attr('x1', d => ((d.source as unknown as BubbleNode).x ?? 0))
          .attr('y1', d => ((d.source as unknown as BubbleNode).y ?? 0))
          .attr('x2', d => ((d.target as unknown as BubbleNode).x ?? 0))
          .attr('y2', d => ((d.target as unknown as BubbleNode).y ?? 0))

        nodeGroup.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`)
      })

    if (centerNode) {
      const center = nodeData.find(n => n.id === centerNode)
      if (center) {
        center.fx = width / 2
        center.fy = height / 2
        center.fixed = true
      }
    }

    simulationRef.current = simulation

    return () => {
      simulation.stop()
    }
  }, [nodes, links, dimensions, onNodeClick, onNodeHover, centerNode, showLabels, animated, getOpacity])

  useEffect(() => {
    if (!svgRef.current || !getBubbleState) return
    const svg = d3.select(svgRef.current)
    svg.selectAll<SVGGElement, BubbleNode>('g g g')
      .transition().duration(300)
      .style('opacity', (d) => getOpacity(d.id))
  }, [getBubbleState, getOpacity])

  return (
    <div ref={containerRef} className={`w-full h-full relative ${className}`}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
    </div>
  )
}
