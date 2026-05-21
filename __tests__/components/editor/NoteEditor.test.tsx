import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

const mockEditor = {
  getJSON: vi.fn().mockReturnValue({ type: 'doc', content: [] }),
  isActive: vi.fn().mockReturnValue(false),
  chain: vi.fn().mockReturnValue({
    focus: vi.fn().mockReturnThis(),
    toggleBold: vi.fn().mockReturnThis(),
    run: vi.fn(),
  }),
}

vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn().mockReturnValue(mockEditor),
  EditorContent: ({ editor }: { editor: unknown }) => (
    <div data-testid="editor-content" data-has-editor={String(!!editor)} />
  ),
}))

vi.mock('@tiptap/starter-kit', () => ({ default: { configure: vi.fn().mockReturnValue({}) } }))
vi.mock('@tiptap/extension-code-block-lowlight', () => ({ default: { configure: vi.fn().mockReturnValue({}) } }))
vi.mock('lowlight', () => ({ createLowlight: vi.fn().mockReturnValue({}) }))

describe('NoteEditor', () => {
  it('renders without crashing with empty content', async () => {
    const { default: NoteEditor } = await import('../../../components/editor/NoteEditor')
    render(<NoteEditor content="" onUpdate={vi.fn()} />)
    expect(screen.getByTestId('editor-content')).toBeInTheDocument()
  })

  it('onUpdate callback fires when content changes', async () => {
    const { useEditor } = await import('@tiptap/react')
    const { default: NoteEditor } = await import('../../../components/editor/NoteEditor')
    const onUpdate = vi.fn()
    render(<NoteEditor content="" onUpdate={onUpdate} />)

    const calls = vi.mocked(useEditor).mock.calls
    const lastCall = calls[calls.length - 1][0]
    lastCall?.onUpdate?.({ editor: mockEditor } as never)

    expect(onUpdate).toHaveBeenCalledWith(JSON.stringify({ type: 'doc', content: [] }))
  })
})
