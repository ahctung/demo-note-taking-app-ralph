import { describe, it, expect } from 'vitest'
import { GET, POST } from '../../../app/api/auth/[...all]/route'

describe('better-auth API route handler', () => {
  it('GET and POST handlers are exported', () => {
    expect(typeof GET).toBe('function')
    expect(typeof POST).toBe('function')
  })
})
