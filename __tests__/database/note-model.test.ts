import { describe, it, expect, afterAll } from 'vitest'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../../app/generated/prisma/client'

const adapter = new PrismaBetterSqlite3({ url: 'file:./data/notes.db' })
const prisma = new PrismaClient({ adapter })

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Note model', () => {
  it('can be created and read via Prisma client', async () => {
    const userId = `test-user-${Date.now()}`
    await prisma.$executeRawUnsafe(
      `INSERT OR IGNORE INTO user (id, name, email, emailVerified, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`,
      userId,
      'Test User',
      `test-${Date.now()}@example.com`,
      0,
      new Date().toISOString(),
      new Date().toISOString(),
    )

    const note = await prisma.note.create({
      data: {
        userId,
        title: 'Test Note',
        content: JSON.stringify({ type: 'doc', content: [] }),
      },
    })

    expect(note.id).toBeDefined()
    expect(note.title).toBe('Test Note')
    expect(note.isShared).toBe(false)
    expect(note.shareToken).toBeNull()

    const fetched = await prisma.note.findUnique({ where: { id: note.id } })
    expect(fetched).not.toBeNull()
    expect(fetched!.title).toBe('Test Note')

    // Cleanup
    await prisma.note.delete({ where: { id: note.id } })
    await prisma.$executeRawUnsafe(`DELETE FROM user WHERE id = ?`, userId)
  })
})
