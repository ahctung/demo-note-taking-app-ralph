import { describe, it, expect, afterAll } from 'vitest'
import { db } from '@/lib/db'

afterAll(async () => {
  await db.$disconnect()
})

describe('db singleton', () => {
  it('is defined', () => {
    expect(db).toBeDefined()
  })

  it('is a PrismaClient instance (has expected Prisma methods)', () => {
    expect(typeof db.$connect).toBe('function')
    expect(typeof db.$disconnect).toBe('function')
    expect(db.note).toBeDefined()
  })
})
