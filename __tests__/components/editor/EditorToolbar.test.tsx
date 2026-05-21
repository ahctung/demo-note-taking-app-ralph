import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockRun = vi.fn()
const mockToggleBold = vi.fn().mockReturnValue({ run: mockRun })
const mockFocus = vi.fn().mockReturnValue({ toggleBold: mockToggleBold })
const mockChain = vi.fn().mockReturnValue({ focus: mockFocus })

const mockEditor = {
  isActive: vi.fn().mockReturnValue(false),
  chain: mockChain,
}

describe('EditorToolbar', () => {
  it('all toolbar buttons render', async () => {
    const { default: EditorToolbar } = await import('../../../components/editor/EditorToolbar')
    render(<EditorToolbar editor={mockEditor as never} />)
    expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /italic/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /h1/i })).toBeInTheDocument()
  })

  it('Bold button calls editor chain toggleBold', async () => {
    const user = userEvent.setup()
    const { default: EditorToolbar } = await import('../../../components/editor/EditorToolbar')
    render(<EditorToolbar editor={mockEditor as never} />)
    await user.click(screen.getByRole('button', { name: /bold/i }))
    expect(mockChain).toHaveBeenCalled()
  })
})
