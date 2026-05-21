import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AppLayout from '../../../app/(app)/layout'

const mockPush = vi.fn()

vi.mock('../../../lib/auth-client', () => ({
  authClient: {
    signOut: vi.fn().mockResolvedValue({}),
  },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe('Sign out functionality', () => {
  it('sign-out button calls authClient.signOut and redirects to /login', async () => {
    const user = userEvent.setup()
    render(<AppLayout><div /></AppLayout>)

    const { authClient } = await import('../../../lib/auth-client')
    await user.click(screen.getByRole('button', { name: /sign out/i }))

    await waitFor(() => {
      expect(authClient.signOut).toHaveBeenCalledOnce()
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })
})
