'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { randomUUID } from 'crypto'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { createNoteSchema, updateNoteSchema, deleteNoteSchema, toggleShareSchema } from '@/lib/schemas/notes'

async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
}

export async function createNote(input: { title: string; content: string }) {
  const user = await getSessionUser()
  const { title, content } = createNoteSchema.parse(input)

  const note = await db.note.create({
    data: { userId: user.id, title, content },
  })

  return { id: note.id }
}

export async function updateNote(input: { id: string; title: string; content: string }) {
  const user = await getSessionUser()
  const { id, title, content } = updateNoteSchema.parse(input)

  const existing = await db.note.findUnique({ where: { id } })
  if (!existing || existing.userId !== user.id) throw new Error('Not found')

  return db.note.update({
    where: { id },
    data: { title, content, updatedAt: new Date() },
  })
}

export async function deleteNote(input: { id: string }) {
  const user = await getSessionUser()
  const { id } = deleteNoteSchema.parse(input)

  const existing = await db.note.findUnique({ where: { id } })
  if (!existing || existing.userId !== user.id) throw new Error('Not found')

  await db.note.delete({ where: { id } })
  redirect('/notes')
}

export async function toggleShare(input: { id: string }) {
  const user = await getSessionUser()
  const { id } = toggleShareSchema.parse(input)

  const existing = await db.note.findUnique({ where: { id } })
  if (!existing || existing.userId !== user.id) throw new Error('Not found')

  const isShared = !existing.isShared
  const shareToken = isShared ? (existing.shareToken ?? randomUUID()) : existing.shareToken

  return db.note.update({
    where: { id },
    data: { isShared, shareToken },
  })
}
