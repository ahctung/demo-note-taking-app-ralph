import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

const mockNotes = [
  {
    id: '1',
    title: 'Note One',
    content: '{}',
    isShared: false,
    shareToken: null,
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date('2026-05-21'),
  },
  {
    id: '2',
    title: 'Note Two',
    content: '{}',
    isShared: true,
    shareToken: 'abc',
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date('2026-05-20'),
  },
]

vi.mock('../../../lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({ user: { id: 'user-1' } }),
    },
  },
}))

vi.mock('../../../lib/db', () => ({
  db: {
    note: {
      findMany: vi.fn().mockResolvedValue(mockNotes),
    },
  },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('../../../components/notes/NoteList', () => ({
  default: ({ notes }: { notes: { id: string; title: string }[] }) => (
    <ul data-testid="note-list">
      {notes.map(n => <li key={n.id}>{n.title}</li>)}
    </ul>
  ),
}))

describe('Notes list page', () => {
  it('fetches notes for current user ordered by updatedAt DESC', async () => {
    const { db } = await import('../../../lib/db')
    const { default: NotesPage } = await import('../../../app/(app)/notes/page')
    render(await NotesPage())
    expect(db.note.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'user-1' },
        orderBy: { updatedAt: 'desc' },
      })
    )
  })

  it('renders NoteList with fetched notes', async () => {
    const { default: NotesPage } = await import('../../../app/(app)/notes/page')
    render(await NotesPage())
    expect(screen.getByTestId('note-list')).toBeInTheDocument()
    expect(screen.getByText('Note One')).toBeInTheDocument()
    expect(screen.getByText('Note Two')).toBeInTheDocument()
  })
})
