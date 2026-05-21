import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import NoteEditorClient from './NoteEditorClient'

export default async function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  const note = await db.note.findUnique({ where: { id } })
  if (!note || note.userId !== session.user.id) notFound()

  return (
    <NoteEditorClient
      note={{
        id: note.id,
        title: note.title,
        content: note.content,
        isShared: note.isShared,
        shareToken: note.shareToken,
      }}
    />
  )
}
