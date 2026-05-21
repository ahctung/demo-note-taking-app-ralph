import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('../../../actions/notes', () => ({
  createNote: vi.fn().mockResolvedValue({ id: 'new-note-id' }),
}))

vi.mock('../../../components/editor/NoteEditor', () => ({
  default: ({ onUpdate }: { onUpdate: (v: string) => void }) => (
    <div data-testid="note-editor" />
  ),
}))

vi.mock('../../../components/editor/EditorToolbar', () => ({
  default: () => <div data-testid="editor-toolbar" />,
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

describe('New note page', () => {
  it('renders NoteEditor with empty content and empty title input', async () => {
    const { default: NewNotePage } = await import('../../../app/(app)/notes/new/page')
    render(<NewNotePage />)
    expect(screen.getByPlaceholderText(/untitled/i)).toHaveValue('')
    expect(screen.getByTestId('note-editor')).toBeInTheDocument()
  })

  it('save calls createNote action and redirects to /notes/[id]', async () => {
    const user = userEvent.setup()
    const { createNote } = await import('../../../actions/notes')
    const { default: NewNotePage } = await import('../../../app/(app)/notes/new/page')
    render(<NewNotePage />)

    await user.type(screen.getByPlaceholderText(/untitled/i), 'My Title')
    await user.click(screen.getByRole('button', { name: /save/i }))

    await vi.waitFor(() => {
      expect(createNote).toHaveBeenCalledWith(expect.objectContaining({ title: 'My Title' }))
      expect(mockPush).toHaveBeenCalledWith('/notes/new-note-id')
    })
  })
})
