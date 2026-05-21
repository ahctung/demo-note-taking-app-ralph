'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'

interface NoteEditorProps {
  content: string
  onUpdate: (json: string) => void
}

const lowlight = createLowlight()

export default function NoteEditor({ content, onUpdate }: NoteEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: content ? JSON.parse(content) : '',
    onUpdate: ({ editor }) => onUpdate(JSON.stringify(editor.getJSON())),
    immediatelyRender: false,
  })

  return <EditorContent editor={editor} className="prose max-w-none" />
}
