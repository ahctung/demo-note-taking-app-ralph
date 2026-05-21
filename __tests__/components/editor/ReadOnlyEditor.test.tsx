import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn().mockReturnValue({ isActive: vi.fn() }),
  EditorContent: ({ editor }: { editor: unknown }) => (
    <div data-testid="readonly-editor" data-editable="false" />
  ),
}))

vi.mock('@tiptap/starter-kit', () => ({ default: {} }))
vi.mock('@tiptap/extension-code-block-lowlight', () => ({ default: { configure: vi.fn().mockReturnValue({}) } }))
vi.mock('lowlight', () => ({ createLowlight: vi.fn().mockReturnValue({}) }))

describe('ReadOnlyEditor', () => {
  it('renders content in read-only mode', async () => {
    const { default: ReadOnlyEditor } = await import('../../../components/editor/ReadOnlyEditor')
    const content = JSON.stringify({ type: 'doc', content: [] })
    render(<ReadOnlyEditor content={content} />)
    expect(screen.getByTestId('readonly-editor')).toBeInTheDocument()
    expect(screen.getByTestId('readonly-editor').dataset.editable).toBe('false')
  })
})
