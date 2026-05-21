import { describe, it, expect } from 'vitest'
import { auth } from '../../lib/auth'

describe('better-auth server instance (lib/auth)', () => {
  it('auth object is defined', () => {
    expect(auth).toBeDefined()
  })

  it('auth has expected shape (handler and api)', () => {
    expect(typeof auth.handler).toBe('function')
    expect(auth.api).toBeDefined()
  })
})
