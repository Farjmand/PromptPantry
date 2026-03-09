'use client'

import { useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { saveToMyPantry } from '@/lib/actions'

export default function SaveButton({ promptId }: { promptId: string }) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    if (saved || loading) return
    setLoading(true)
    try {
      const result = await saveToMyPantry(promptId)
      if (result?.error === 'auth_required') {
        window.location.href = '/?login=required'
        return
      }
      setSaved(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSave} disabled={loading || saved}>
      {saved ? (
        <>
          <BookmarkCheck className="h-4 w-4 mr-1.5 text-blue-600" />
          Saved to Pantry
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4 mr-1.5" />
          Save to My Pantry
        </>
      )}
    </Button>
  )
}
