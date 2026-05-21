import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import ReadOnlyEditor from '@/components/editor/ReadOnlyEditor'

export default async function SharePage({ params }: { params: Promise<{ shareToken: string }> }) {
  const { shareToken } = await params

  const note = await db.note.findFirst({
    where: { shareToken, isShared: true },
  })

  if (!note) notFound()

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{note.title}</h1>
        <ReadOnlyEditor content={note.content} />
        <footer className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-400 text-center">
          Made with NoteApp
        </footer>
      </main>
    </div>
  )
}
