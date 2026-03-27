'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils/format'
import ReactMarkdown from 'react-markdown'
import type { Note } from '@/types/note'

interface NoteCardProps {
  note: Note
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  return (
    <div className="rounded-lg bg-[#111] border border-[#1a1a1a] p-3">
      <div className="prose prose-invert prose-sm max-w-none text-[#A0A0A0] text-sm">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1a1a1a]">
        <span className="text-[10px] text-[#666]">{formatTimeAgo(note.createdAt)}</span>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(note.id)}
            className="p-1 text-[#666] hover:text-white transition-colors"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1 text-[#666] hover:text-[#EF4444] transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
