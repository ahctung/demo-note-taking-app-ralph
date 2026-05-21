'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import NoteEditor from '@/components/editor/NoteEditor'
import EditorToolbar from '@/components/editor/EditorToolbar'
import { createNote } from '@/actions/notes'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'

const lowlight = createLowlight()

export default function NewNotePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] }, codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: '',
    onUpdate: ({ editor }) => setContent(JSON.stringify(editor.getJSON())),
    immediatelyRender: false,
  })

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    try {
      const result = await createNote({ title, content: content || JSON.stringify({ type: 'doc', content: [] }) })
      if (result?.id) router.push(`/notes/${result.id}`)
    } finally {
      setSaving(false)
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
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Untitled"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 text-2xl font-semibold border-none outline-none bg-transparent"
          autoFocus
        />
        <button
          onClick={handleSave}
          disabled={saving || !title.trim()}
          className="bg-indigo-600 text-white rounded px-4 py-2 text-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      <EditorToolbar editor={editor} />
      {editor && (
        <div className="border rounded-lg p-4 min-h-64">
          <NoteEditor content="" onUpdate={setContent} />
        </div>
      )}
    </div>
  )
}
