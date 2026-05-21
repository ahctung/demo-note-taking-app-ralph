interface Note {
  id: string
  title: string
  isShared: boolean
  updatedAt: Date
}

export default function NoteCard({ note }: { note: Note }) {
  return (
    <a
      href={`/notes/${note.id}`}
      className="block border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-medium text-gray-900 truncate">{note.title}</h2>
        {note.isShared && (
          <span className="flex-shrink-0 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
            Shared
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-gray-500">
        {note.updatedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </a>
  )
}
