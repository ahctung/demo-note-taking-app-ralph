import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '../../../components/auth/LoginForm'

vi.mock('../../../lib/auth-client', () => ({
  authClient: {
    signIn: {
      email: vi.fn().mockResolvedValue({ data: { user: { id: '1' } }, error: null }),
      social: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
  },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

describe('LoginForm', () => {
  it('renders email, password fields and Google button', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument()
  })

  it('successful email submission calls authClient.signIn.email', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const { authClient } = await import('../../../lib/auth-client')

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    await waitFor(() => {
      expect(authClient.signIn.email).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com', password: 'password123' }),
      )
    })
  })

  it('Google button calls authClient.signIn.social', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const { authClient } = await import('../../../lib/auth-client')

    await user.click(screen.getByRole('button', { name: /google/i }))

    await waitFor(() => {
      expect(authClient.signIn.social).toHaveBeenCalledWith(
        expect.objectContaining({ provider: 'google' }),
      )
    })
  })
})
