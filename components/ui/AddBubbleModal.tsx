'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Palette, Globe, FileText, Tag } from 'lucide-react'

export interface CustomBubble {
  id: string
  type: 'chain' | 'dapp' | 'infrastructure' | 'protocol'
  name: string
  color: string
  url?: string
  notes?: string
  createdAt: string
}

interface AddBubbleModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (bubble: CustomBubble) => void
}

const BUBBLE_TYPES = ['chain', 'dapp', 'infrastructure', 'protocol'] as const

const inputClass =
  'w-full px-3 py-2 rounded-lg bg-[#111] border border-[#1a1a1a] text-white text-sm placeholder-[#555] focus:border-[#333] focus:outline-none'
const labelClass = 'text-[11px] uppercase tracking-wider text-[#555] mb-1.5 block'

export function AddBubbleModal({ isOpen, onClose, onAdd }: AddBubbleModalProps) {
  const [type, setType] = useState<CustomBubble['type']>('chain')
  const [name, setName] = useState('')
  const [color, setColor] = useState('#007FFF')
  const [url, setUrl] = useState('')
  const [notes, setNotes] = useState('')

  function reset() {
    setType('chain')
    setName('')
    setColor('#007FFF')
    setUrl('')
    setNotes('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    onAdd({
      id: crypto.randomUUID(),
      type,
      name: name.trim(),
      color,
      url: url.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    })

    reset()
    onClose()
  }

  function handleClose() {
    reset()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg p-4 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="rounded-2xl border border-[#1a1a1a] bg-[#0A0A0A] shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#1a1a1a] px-5 py-4">
                <div className="flex items-center gap-2">
                  <Plus size={16} className="text-[#555]" />
                  <h2 className="text-sm font-semibold text-white">Add Bubble</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="rounded-lg p-1.5 text-[#555] transition-colors hover:bg-[#111] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-5">
                <div>
                  <label className={labelClass}>
                    <Tag size={10} className="mr-1 inline" />
                    Type
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {BUBBLE_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`rounded-lg px-2 py-1.5 text-xs capitalize transition-colors ${
                          type === t
                            ? 'bg-white text-black font-medium'
                            : 'bg-[#111] border border-[#1a1a1a] text-[#888] hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arbitrum, Stargate..."
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <Palette size={10} className="mr-1 inline" />
                    Color
                  </label>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 shrink-0 rounded-full border border-[#1a1a1a]"
                      style={{ backgroundColor: color }}
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="#007FFF"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    <Globe size={10} className="mr-1 inline" />
                    URL <span className="normal-case text-[#333]">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <FileText size={10} className="mr-1 inline" />
                    Notes <span className="normal-case text-[#333]">(optional)</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional context..."
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg px-4 py-2 text-xs font-medium text-[#888] transition-colors hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition-opacity hover:opacity-90"
                  >
                    <Plus size={14} />
                    Add Bubble
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
