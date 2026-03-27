'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Pencil, Trash2 } from 'lucide-react'
import { useNotes } from '@/components/providers/NoteProvider'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { formatTimeAgo } from '@/lib/utils/format'
import ReactMarkdown from 'react-markdown'
import { Badge } from './Badge'

export function NotePanel() {
  const { isPanelOpen, currentEntity, closePanel, notes, loading, createNote, updateNote, deleteNote } = useNotes()
  const { user } = useSupabase()
  const [newContent, setNewContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  const handleSubmit = async () => {
    if (!newContent.trim() || !currentEntity) return
    await createNote({
      entityType: currentEntity.type,
      entityId: currentEntity.id,
      entityName: currentEntity.name,
      content: newContent.trim(),
    })
    setNewContent('')
  }

  const handleUpdate = async (id: string) => {
    if (!editContent.trim()) return
    await updateNote(id, editContent.trim())
    setEditingId(null)
    setEditContent('')
  }

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closePanel}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[380px] z-50
                       bg-[#0a0a0a] border-l border-[#1a1a1a] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a]">
              <div>
                <h3 className="text-white font-semibold text-sm">{currentEntity?.name}</h3>
                <Badge variant={currentEntity?.type === 'chain' ? 'default' : currentEntity?.type === 'app' ? 'oapp' : 'oft'}>
                  {currentEntity?.type}
                </Badge>
              </div>
              <button onClick={closePanel} className="text-[#666] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading && <div className="text-[#666] text-sm text-center py-4">Loading notes...</div>}
              {!loading && notes.length === 0 && (
                <div className="text-[#666] text-sm text-center py-8">No notes yet</div>
              )}
              {notes.map(note => (
                <div key={note.id} className="rounded-lg bg-[#111] border border-[#1a1a1a] p-3">
                  {editingId === note.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        className="w-full p-2 text-sm bg-[#0a0a0a] border border-[#2a2a2a]
                                   rounded text-white placeholder-[#666] outline-none resize-none"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(note.id)}
                          className="px-2 py-1 text-xs bg-[#007FFF] text-white rounded hover:bg-[#0066CC]"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 text-xs text-[#666] hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="prose prose-invert prose-sm max-w-none text-[#A0A0A0] text-sm">
                        <ReactMarkdown>{note.content}</ReactMarkdown>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1a1a1a]">
                        <span className="text-[10px] text-[#666]">{formatTimeAgo(note.createdAt)}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => { setEditingId(note.id); setEditContent(note.content) }}
                            className="p-1 text-[#666] hover:text-white transition-colors"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="p-1 text-[#666] hover:text-[#EF4444] transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {user ? (
              <div className="p-4 border-t border-[#1a1a1a]">
                <div className="flex gap-2">
                  <textarea
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    placeholder="Add a note (supports **markdown**)..."
                    className="flex-1 p-2 text-sm bg-[#111] border border-[#2a2a2a]
                               rounded-lg text-white placeholder-[#666] outline-none
                               focus:border-[#007FFF]/50 resize-none transition-colors"
                    rows={2}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
                    }}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!newContent.trim()}
                    className="self-end p-2 rounded-lg bg-[#007FFF] text-white
                               hover:bg-[#0066CC] disabled:opacity-30 disabled:cursor-not-allowed
                               transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 border-t border-[#1a1a1a] text-center text-sm text-[#666]">
                Log in to add notes
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
