import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterForm from '../../../components/auth/RegisterForm'

vi.mock('../../../lib/auth-client', () => ({
  authClient: {
    signUp: {
      email: vi.fn().mockResolvedValue({ data: { user: { id: '1' } }, error: null }),
    },
  },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

describe('RegisterForm', () => {
  it('renders email, password fields and submit button', () => {
    render(<RegisterForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up|register/i })).toBeInTheDocument()
  })

  it('successful submission calls authClient.signUp.email', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    const { authClient } = await import('../../../lib/auth-client')

    await user.type(screen.getByLabelText(/name/i), 'Test User')
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign up|register/i }))

    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com', password: 'password123' }),
      )
    })
  })
})
