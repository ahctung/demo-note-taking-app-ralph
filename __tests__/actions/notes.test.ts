import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockNote = {
  id: 'note-1',
  userId: 'user-1',
  title: 'Test',
  content: '{}',
  isShared: false,
  shareToken: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

vi.mock('../../lib/db', () => ({
  db: {
    note: {
      create: vi.fn().mockResolvedValue(mockNote),
      findUnique: vi.fn().mockResolvedValue(mockNote),
      update: vi.fn().mockResolvedValue({ ...mockNote, title: 'Updated' }),
      delete: vi.fn().mockResolvedValue(mockNote),
    },
  },
}))

vi.mock('../../lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({ user: { id: 'user-1' } }),
    },
  },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('Server actions: notes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('createNote inserts a note and returns the new id', async () => {
    const { db } = await import('../../lib/db')
    const { createNote } = await import('../../actions/notes')

    const result = await createNote({ title: 'Test', content: '{}' })

    expect(db.note.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ title: 'Test', userId: 'user-1' }) })
    )
    expect(result?.id).toBe('note-1')
  })

  it('updateNote rejects if userId does not match session', async () => {
    const { db } = await import('../../lib/db')
    vi.mocked(db.note.findUnique).mockResolvedValueOnce({ ...mockNote, userId: 'other-user' })

    const { updateNote } = await import('../../actions/notes')

    await expect(updateNote({ id: 'note-1', title: 'X', content: '{}' })).rejects.toThrow()
  })

  it('deleteNote removes note and redirects to /notes', async () => {
    const { db } = await import('../../lib/db')
    const { redirect } = await import('next/navigation')
    const { deleteNote } = await import('../../actions/notes')

    await deleteNote({ id: 'note-1' })

    expect(db.note.delete).toHaveBeenCalledWith({ where: { id: 'note-1' } })
    expect(redirect).toHaveBeenCalledWith('/notes')
  })

  it('toggleShare flips isShared and generates shareToken on first share', async () => {
    const { db } = await import('../../lib/db')
    const { toggleShare } = await import('../../actions/notes')

    await toggleShare({ id: 'note-1' })

    expect(db.note.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isShared: true }),
      })
    )
  })
})
