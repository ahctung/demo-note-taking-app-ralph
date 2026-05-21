import { describe, it, expect } from 'vitest'
import { authClient } from '../../lib/auth-client'

describe('better-auth browser client (lib/auth-client)', () => {
  it('authClient is defined', () => {
    expect(authClient).toBeDefined()
  })

  it('authClient has signIn and signUp methods', () => {
    expect(authClient.signIn).toBeDefined()
    expect(authClient.signUp).toBeDefined()
  })
})
