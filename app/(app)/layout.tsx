'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 inset-x-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/notes" className="font-semibold text-indigo-600 text-lg">NoteApp</a>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>
      </nav>
      <main className="pt-14 max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
