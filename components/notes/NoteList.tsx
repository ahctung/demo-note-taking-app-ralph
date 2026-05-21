import NoteCard from './NoteCard'

interface Note {
  id: string
  title: string
  isShared: boolean
  updatedAt: Date
}

export default function NoteList({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12">
        No notes yet.{' '}
        <a href="/notes/new" className="text-indigo-600 hover:underline">Create one</a>
      </p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  )
}
