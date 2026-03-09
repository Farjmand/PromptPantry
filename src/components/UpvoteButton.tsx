'use client'

import { useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { upvotePrompt } from '@/lib/actions'

export default function UpvoteButton({ promptId, upvotes }: { promptId: string; upvotes: number }) {
  const [count, setCount] = useState(upvotes)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleUpvote() {
    if (voted || loading) return
    setVoted(true)
    setCount((c) => c + 1)
    setLoading(true)
    try {
      await upvotePrompt(promptId)
    } catch {
      setVoted(false)
      setCount((c) => c - 1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpvote}
      disabled={voted || loading}
      className={`flex flex-col items-center gap-0.5 rounded-md border px-2 py-1 text-xs font-semibold transition-colors min-w-[40px] ${
        voted
          ? 'border-orange-400 bg-orange-50 text-orange-600'
          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 text-gray-500'
      }`}
      aria-label="Upvote"
    >
      <ArrowUp className="h-3.5 w-3.5" />
      {count}
    </button>
  )
}
