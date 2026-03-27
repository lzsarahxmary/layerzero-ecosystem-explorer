'use client'

import { StickyNote } from 'lucide-react'
import { useNotes } from '@/hooks/useNotes'

import type { EntityType } from '@/types/note'

interface BubbleNoteButtonProps {
  entityType: EntityType
  entityId: string
  entityName: string
}

export function BubbleNoteButton({ entityType, entityId, entityName }: BubbleNoteButtonProps) {
  const { openPanel, hasNotes } = useNotes()
  const has = hasNotes(entityType, entityId)

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        openPanel(entityType, entityId, entityName)
      }}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium
                 bg-[#111] border border-[#1a1a1a] text-[#888] hover:text-white hover:border-[#333]
                 transition-colors relative"
    >
      <StickyNote size={11} />
      <span>{has ? 'View Notes' : 'Add Note'}</span>
      {has && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#007FFF]" />
      )}
    </button>
  )
}
