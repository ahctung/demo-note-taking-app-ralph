import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))

const { middleware } = await import('@/middleware')
const { auth } = await import('@/lib/auth')

const mockGetSession = auth.api.getSession as ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.clearAllMocks()
})

describe('middleware', () => {
  it('redirects unauthenticated request to /notes to /login', async () => {
    mockGetSession.mockResolvedValue(null)

    const req = new NextRequest('http://localhost:3000/notes')
    const res = await middleware(req)

    expect(res?.status).toBe(307)
    expect(res?.headers.get('location')).toContain('/login')
  })

  it('allows authenticated request to /notes', async () => {
    mockGetSession.mockResolvedValue({ user: { id: '1' } })

    const req = new NextRequest('http://localhost:3000/notes')
    const res = await middleware(req)

    expect(res?.status).not.toBe(307)
  })

  it('redirects authenticated user away from /login', async () => {
    mockGetSession.mockResolvedValue({ user: { id: '1' } })

    const req = new NextRequest('http://localhost:3000/login')
    const res = await middleware(req)

    expect(res?.status).toBe(307)
    expect(res?.headers.get('location')).toContain('/notes')
  })
})
