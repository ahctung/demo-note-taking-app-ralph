import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

const mockNote = {
  id: '1',
  userId: 'user-1',
  title: 'Shared Note',
  content: JSON.stringify({ type: 'doc', content: [] }),
  isShared: true,
  shareToken: 'valid-token',
  createdAt: new Date(),
  updatedAt: new Date(),
}

vi.mock('../../../lib/db', () => ({
  db: {
    note: {
      findFirst: vi.fn().mockResolvedValue(mockNote),
    },
  },
}))

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => { throw new Error('NEXT_NOT_FOUND') }),
}))

vi.mock('../../../components/editor/ReadOnlyEditor', () => ({
  default: ({ content }: { content: string }) => (
    <div data-testid="readonly-editor" data-content={content} />
  ),
}))

describe('Public share page', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 404 when shareToken not found or isShared is false', async () => {
    const { db } = await import('../../../lib/db')
    vi.mocked(db.note.findFirst).mockResolvedValueOnce(null)

    const { default: SharePage } = await import('../../../app/share/[shareToken]/page')
    await expect(SharePage({ params: Promise.resolve({ shareToken: 'bad-token' }) }))
      .rejects.toThrow('NEXT_NOT_FOUND')
  })

  it('renders ReadOnlyEditor with note title and content', async () => {
    const { default: SharePage } = await import('../../../app/share/[shareToken]/page')
    render(await SharePage({ params: Promise.resolve({ shareToken: 'valid-token' }) }))

    expect(screen.getByRole('heading', { name: 'Shared Note' })).toBeInTheDocument()
    const editor = screen.getByTestId('readonly-editor')
    expect(editor).toBeInTheDocument()
    expect(editor.dataset.content).toBe(mockNote.content)
    expect(screen.getByText(/made with noteapp/i)).toBeInTheDocument()
  })
})
