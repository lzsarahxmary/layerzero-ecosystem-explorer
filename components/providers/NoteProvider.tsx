'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { EntityType, Note, NoteCreate } from '@/types/note'
import { useSupabase } from './SupabaseProvider'

interface NoteContextValue {
  isPanelOpen: boolean
  currentEntity: { type: EntityType; id: string; name: string } | null
  openPanel: (type: EntityType, id: string, name: string) => void
  closePanel: () => void
  notes: Note[]
  loading: boolean
  createNote: (note: NoteCreate) => Promise<void>
  updateNote: (id: string, content: string) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  fetchNotes: (entityType: EntityType, entityId: string) => Promise<void>
  hasNotes: (entityType: EntityType, entityId: string) => boolean
  noteCountMap: Map<string, number>
}

const NoteContext = createContext<NoteContextValue | undefined>(undefined)

export function NoteProvider({ children }: { children: ReactNode }) {
  const { supabase, user } = useSupabase()
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [currentEntity, setCurrentEntity] = useState<{ type: EntityType; id: string; name: string } | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(false)
  const [noteCountMap, setNoteCountMap] = useState<Map<string, number>>(new Map())

  const fetchNotes = useCallback(async (entityType: EntityType, entityId: string) => {
    if (!user || !supabase) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false })

      if (error) throw error
      const mapped: Note[] = (data ?? []).map(d => ({
        id: d.id,
        userId: d.user_id,
        entityType: d.entity_type,
        entityId: d.entity_id,
        entityName: d.entity_name,
        content: d.content,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }))
      setNotes(mapped)
    } catch (err) {
      console.error('Failed to fetch notes:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase, user])

  const openPanel = useCallback((type: EntityType, id: string, name: string) => {
    setCurrentEntity({ type, id, name })
    setIsPanelOpen(true)
    fetchNotes(type, id)
  }, [fetchNotes])

  const closePanel = useCallback(() => {
    setIsPanelOpen(false)
    setCurrentEntity(null)
    setNotes([])
  }, [])

  const createNote = useCallback(async (note: NoteCreate) => {
    if (!user || !supabase) return
    const newNote: Note = {
      id: crypto.randomUUID(),
      userId: user.id,
      entityType: note.entityType,
      entityId: note.entityId,
      entityName: note.entityName,
      content: note.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes(prev => [newNote, ...prev])

    const key = `${note.entityType}:${note.entityId}`
    setNoteCountMap(prev => new Map(prev).set(key, (prev.get(key) ?? 0) + 1))

    try {
      const { error } = await supabase.from('notes').insert({
        user_id: user.id,
        entity_type: note.entityType,
        entity_id: note.entityId,
        entity_name: note.entityName,
        content: note.content,
      })
      if (error) throw error
    } catch (err) {
      console.error('Failed to create note:', err)
      setNotes(prev => prev.filter(n => n.id !== newNote.id))
    }
  }, [supabase, user])

  const updateNote = useCallback(async (id: string, content: string) => {
    if (!supabase) return
    setNotes(prev => prev.map(n => n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n))
    try {
      const { error } = await supabase
        .from('notes')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('Failed to update note:', err)
    }
  }, [supabase])

  const deleteNote = useCallback(async (id: string) => {
    if (!supabase) return
    const deleted = notes.find(n => n.id === id)
    setNotes(prev => prev.filter(n => n.id !== id))

    if (deleted) {
      const key = `${deleted.entityType}:${deleted.entityId}`
      setNoteCountMap(prev => {
        const next = new Map(prev)
        const count = (next.get(key) ?? 1) - 1
        if (count <= 0) next.delete(key)
        else next.set(key, count)
        return next
      })
    }

    try {
      const { error } = await supabase.from('notes').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('Failed to delete note:', err)
    }
  }, [supabase, notes])

  const hasNotes = useCallback((entityType: EntityType, entityId: string): boolean => {
    return (noteCountMap.get(`${entityType}:${entityId}`) ?? 0) > 0
  }, [noteCountMap])

  return (
    <NoteContext.Provider value={{
      isPanelOpen,
      currentEntity,
      openPanel,
      closePanel,
      notes,
      loading,
      createNote,
      updateNote,
      deleteNote,
      fetchNotes,
      hasNotes,
      noteCountMap,
    }}>
      {children}
    </NoteContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NoteContext)
  if (!context) throw new Error('useNotes must be used within NoteProvider')
  return context
}
