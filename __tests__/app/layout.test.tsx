import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AppLayout from '../../app/(app)/layout'

vi.mock('../../lib/auth-client', () => ({
  authClient: {
    signOut: vi.fn().mockResolvedValue({}),
    useSession: vi.fn().mockReturnValue({ data: { user: { name: 'Test' } } }),
  },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

describe('App shell layout', () => {
  it('renders app logo and Sign Out button', () => {
    render(
      <AppLayout>
        <div>content</div>
      </AppLayout>
    )
    expect(screen.getByText(/noteapp/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })
})
