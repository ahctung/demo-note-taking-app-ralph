import { describe, it, expect } from 'vitest'
import { createNoteSchema, updateNoteSchema, deleteNoteSchema } from '../../lib/schemas/notes'

describe('Note Zod schemas', () => {
  it('createNoteSchema rejects empty title', () => {
    const result = createNoteSchema.safeParse({ title: '', content: '{}' })
    expect(result.success).toBe(false)
  })

  it('createNoteSchema accepts valid input', () => {
    const result = createNoteSchema.safeParse({ title: 'My Note', content: '{}' })
    expect(result.success).toBe(true)
  })

  it('updateNoteSchema requires id', () => {
    const result = updateNoteSchema.safeParse({ title: 'My Note', content: '{}' })
    expect(result.success).toBe(false)
  })

  it('updateNoteSchema accepts valid input with id', () => {
    const result = updateNoteSchema.safeParse({ id: 'abc', title: 'My Note', content: '{}' })
    expect(result.success).toBe(true)
  })

  it('deleteNoteSchema requires id', () => {
    const result = deleteNoteSchema.safeParse({})
    expect(result.success).toBe(false)
    const ok = deleteNoteSchema.safeParse({ id: 'abc' })
    expect(ok.success).toBe(true)
  })
})
