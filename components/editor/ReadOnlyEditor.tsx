'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'

interface ReadOnlyEditorProps {
  content: string
}

const lowlight = createLowlight()

export default function ReadOnlyEditor({ content }: ReadOnlyEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: content ? JSON.parse(content) : '',
    editable: false,
    immediatelyRender: false,
  })

  return <EditorContent editor={editor} className="prose max-w-none" />
}
