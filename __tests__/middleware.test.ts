import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('../lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

describe('Route protection middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('unauthenticated request to /notes redirects to /login', async () => {
    const { auth } = await import('../lib/auth')
    vi.mocked(auth.api.getSession).mockResolvedValue(null)

    const { middleware } = await import('../middleware')
    const request = new NextRequest('http://localhost:3000/notes')
    const response = await middleware(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/login')
  })

  it('authenticated request to /login redirects to /notes', async () => {
    const { auth } = await import('../lib/auth')
    vi.mocked(auth.api.getSession).mockResolvedValue({ user: { id: '1' } } as never)

    const { middleware } = await import('../middleware')
    const request = new NextRequest('http://localhost:3000/login')
    const response = await middleware(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/notes')
  })
})
