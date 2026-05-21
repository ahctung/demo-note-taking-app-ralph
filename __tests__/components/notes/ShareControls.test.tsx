import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShareControls from '../../../components/notes/ShareControls'

describe('ShareControls', () => {
  it('shows Share button when isShared is false', () => {
    render(<ShareControls isShared={false} shareToken={null} onToggle={vi.fn()} noteId="1" />)
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()
  })

  it('shows share URL and copy button when isShared is true', () => {
    render(<ShareControls isShared={true} shareToken="abc123" onToggle={vi.fn()} noteId="1" />)
    expect(screen.getByText(/abc123/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
  })

  it('copy button writes URL to clipboard', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })

    render(<ShareControls isShared={true} shareToken="abc123" onToggle={vi.fn()} noteId="1" />)
    await user.click(screen.getByRole('button', { name: /copy/i }))

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(expect.stringContaining('abc123'))
    })
  })
})
