'use client'

import type { Editor } from '@tiptap/react'

interface EditorToolbarProps {
  editor: Editor | null
}

interface ToolbarButton {
  label: string
  ariaLabel: string
  action: () => void
  isActive: boolean
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null

  const buttons: ToolbarButton[] = [
    {
      label: 'B',
      ariaLabel: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      label: 'I',
      ariaLabel: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      label: 'H1',
      ariaLabel: 'H1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      label: 'H2',
      ariaLabel: 'H2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      label: 'H3',
      ariaLabel: 'H3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
    },
    {
      label: '¶',
      ariaLabel: 'Normal text',
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive('paragraph'),
    },
    {
      label: '`',
      ariaLabel: 'Inline Code',
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
    },
    {
      label: '```',
      ariaLabel: 'Code Block',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
    },
    {
      label: '•',
      ariaLabel: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      label: '—',
      ariaLabel: 'Horizontal Rule',
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: false,
    },
  ]

  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200 pb-2 mb-2">
      {buttons.map(({ label, ariaLabel, action, isActive }) => (
        <button
          key={ariaLabel}
          type="button"
          aria-label={ariaLabel}
          onClick={action}
          className={`px-2 py-1 text-sm rounded border ${
            isActive
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
