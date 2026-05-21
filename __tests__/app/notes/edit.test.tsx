import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockNote = {
  id: 'note-1',
  userId: 'user-1',
  title: 'Existing Title',
  content: JSON.stringify({ type: 'doc', content: [] }),
  isShared: false,
  shareToken: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

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
      findUnique: vi.fn().mockResolvedValue(mockNote),
    },
  },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => { throw new Error('NEXT_NOT_FOUND') }),
  redirect: vi.fn(),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('../../../actions/notes', () => ({
  updateNote: vi.fn().mockResolvedValue(mockNote),
  deleteNote: vi.fn().mockResolvedValue(undefined),
  toggleShare: vi.fn().mockResolvedValue({ ...mockNote, isShared: true, shareToken: 'tok' }),
}))

vi.mock('../../../components/editor/NoteEditor', () => ({
  default: ({ content }: { content: string }) => (
    <div data-testid="note-editor" data-content={content} />
  ),
}))

vi.mock('../../../components/editor/EditorToolbar', () => ({
  default: () => <div data-testid="editor-toolbar" />,
}))

vi.mock('../../../components/notes/ShareControls', () => ({
  default: ({ onToggle }: { onToggle: () => void }) => (
    <button onClick={onToggle} data-testid="share-toggle">Share</button>
  ),
}))

vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn().mockReturnValue({
    isActive: vi.fn().mockReturnValue(false),
    chain: vi.fn().mockReturnValue({ focus: vi.fn().mockReturnThis(), run: vi.fn() }),
  }),
  EditorContent: () => <div />,
}))

vi.mock('@tiptap/starter-kit', () => ({ default: { configure: vi.fn().mockReturnValue({}) } }))
vi.mock('@tiptap/extension-code-block-lowlight', () => ({ default: { configure: vi.fn().mockReturnValue({}) } }))
vi.mock('lowlight', () => ({ createLowlight: vi.fn().mockReturnValue({}) }))

describe('Edit note page', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 404 when note not found or not owned by session user', async () => {
    const { db } = await import('../../../lib/db')
    vi.mocked(db.note.findUnique).mockResolvedValueOnce(null)

    const { default: EditNotePage } = await import('../../../app/(app)/notes/[id]/page')
    await expect(EditNotePage({ params: Promise.resolve({ id: 'bad-id' }) }))
      .rejects.toThrow('NEXT_NOT_FOUND')
  })

  it('renders NoteEditor pre-populated with stored content', async () => {
    const { default: EditNotePage } = await import('../../../app/(app)/notes/[id]/page')
    render(await EditNotePage({ params: Promise.resolve({ id: 'note-1' }) }))

    const editor = screen.getByTestId('note-editor')
    expect(editor).toBeInTheDocument()
    expect(editor.dataset.content).toBe(mockNote.content)
  })

  it('Save calls updateNote', async () => {
    const user = userEvent.setup()
    const { updateNote } = await import('../../../actions/notes')
    const { default: EditNotePage } = await import('../../../app/(app)/notes/[id]/page')
    render(await EditNotePage({ params: Promise.resolve({ id: 'note-1' }) }))

    await user.click(screen.getByRole('button', { name: /save/i }))

    await vi.waitFor(() => {
      expect(updateNote).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'note-1' })
      )
    })
  })

  it('Delete calls deleteNote after confirmation', async () => {
    const user = userEvent.setup()
    const { deleteNote } = await import('../../../actions/notes')
    const { default: EditNotePage } = await import('../../../app/(app)/notes/[id]/page')
    render(await EditNotePage({ params: Promise.resolve({ id: 'note-1' }) }))

    await user.click(screen.getByRole('button', { name: /delete/i }))
    await user.click(screen.getByRole('button', { name: /confirm/i }))

    await vi.waitFor(() => {
      expect(deleteNote).toHaveBeenCalledWith({ id: 'note-1' })
    })
  })

  it('Share toggle calls toggleShare', async () => {
    const user = userEvent.setup()
    const { toggleShare } = await import('../../../actions/notes')
    const { default: EditNotePage } = await import('../../../app/(app)/notes/[id]/page')
    render(await EditNotePage({ params: Promise.resolve({ id: 'note-1' }) }))

    await user.click(screen.getByTestId('share-toggle'))

    await vi.waitFor(() => {
      expect(toggleShare).toHaveBeenCalledWith({ id: 'note-1' })
    })
  })
})
