import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import NoteList from '@/components/notes/NoteList'

export default async function NotesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  const notes = await db.note.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Notes</h1>
        <a
          href="/notes/new"
          className="bg-indigo-600 text-white rounded px-4 py-2 text-sm hover:bg-indigo-700"
        >
          New Note
        </a>
      </div>
      <NoteList notes={notes.map(n => ({ ...n, updatedAt: new Date(n.updatedAt) }))} />
    </div>
  )
}
