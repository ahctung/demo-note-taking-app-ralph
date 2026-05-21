'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import NoteEditor from '@/components/editor/NoteEditor'
import EditorToolbar from '@/components/editor/EditorToolbar'
import ShareControls from '@/components/notes/ShareControls'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { updateNote, deleteNote, toggleShare } from '@/actions/notes'

interface NoteEditorClientProps {
  note: {
    id: string
    title: string
    content: string
    isShared: boolean
    shareToken: string | null
  }
}

const lowlight = createLowlight()

export default function NoteEditorClient({ note }: NoteEditorClientProps) {
  const router = useRouter()
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [isShared, setIsShared] = useState(note.isShared)
  const [shareToken, setShareToken] = useState(note.shareToken)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [saving, setSaving] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] }, codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: note.content ? JSON.parse(note.content) : '',
    onUpdate: ({ editor }) => setContent(JSON.stringify(editor.getJSON())),
    immediatelyRender: false,
  })

  async function handleSave() {
    setSaving(true)
    try {
      await updateNote({ id: note.id, title, content })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    await deleteNote({ id: note.id })
  }

  async function handleToggleShare() {
    const updated = await toggleShare({ id: note.id })
    if (updated) {
      setIsShared(updated.isShared)
      setShareToken(updated.shareToken)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div onKeyDown={handleKeyDown}>
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 text-2xl font-semibold border-none outline-none bg-transparent min-w-0"
        />
        <div className="flex items-center gap-2">
          <ShareControls
            isShared={isShared}
            shareToken={shareToken}
            noteId={note.id}
            onToggle={handleToggleShare}
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 text-white rounded px-4 py-2 text-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="border border-red-300 text-red-600 rounded px-4 py-2 text-sm hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <EditorToolbar editor={editor} />

      <div className="border rounded-lg p-4 min-h-64">
        <NoteEditor content={note.content} onUpdate={setContent} />
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete note?"
        message="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  )
}
