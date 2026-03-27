export type EntityType = 'chain' | 'app' | 'token' | 'product' | 'custom'

export interface Note {
  id: string
  userId: string
  entityType: EntityType
  entityId: string
  entityName: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface NoteCreate {
  entityType: EntityType
  entityId: string
  entityName: string
  content: string
}
