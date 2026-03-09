import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PromptCard from '@/components/PromptCard'
import type { Prompt } from '@/lib/types'

export default async function PantryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/?login=required')

  const { data: saved } = await supabase
    .from('saved_prompts')
    .select('prompt_id, prompts(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const prompts: Prompt[] = (saved?.flatMap((s) => s.prompts ?? []) ?? []) as unknown as Prompt[]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">My Pantry</h1>
      <p className="text-muted-foreground mb-6">Prompts you&apos;ve saved for quick access.</p>

      {prompts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg mb-2">Your pantry is empty.</p>
          <a href="/" className="underline">Browse prompts to save some →</a>
        </div>
      )}
    </div>
  )
}
