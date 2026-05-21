'use client'

import { useState } from 'react'

interface ShareControlsProps {
  isShared: boolean
  shareToken: string | null
  noteId: string
  onToggle: () => Promise<void>
}

export default function ShareControls({ isShared, shareToken, onToggle }: ShareControlsProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = shareToken ? `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${shareToken}` : ''

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isShared) {
    return (
      <button
        onClick={onToggle}
        className="text-sm border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50"
      >
        Share
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 truncate max-w-xs">{shareUrl}</span>
      <button
        onClick={handleCopy}
        className="flex-shrink-0 text-sm border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <button
        onClick={onToggle}
        className="flex-shrink-0 text-sm text-red-600 border border-red-300 rounded px-3 py-1.5 hover:bg-red-50"
      >
        Unshare
      </button>
    </div>
  )
}
