'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signInWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
    },
  })
  if (error) throw error
  if (data.url) redirect(data.url)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
  redirect('/')
}

export async function submitPrompt(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Must be logged in to submit a prompt')

  const title = formData.get('title') as string
  const body = formData.get('body') as string
  const model = formData.get('model') as string
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)

  const { data, error } = await supabase
    .from('prompts')
    .insert({ title, body, tags, model, author_id: user.id })
    .select('id')
    .single()

  if (error) throw error

  revalidatePath('/')
  redirect(`/prompts/${data.id}`)
}

export async function upvotePrompt(promptId: string) {
  const supabase = await createClient()

  // Simple increment — idempotency handled in UI
  const { error } = await supabase.rpc('increment_upvotes', { prompt_id: promptId })
  if (error) throw error

  revalidatePath(`/prompts/${promptId}`)
  revalidatePath('/')
}

export async function saveToMyPantry(promptId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'auth_required' }

  const { error } = await supabase
    .from('saved_prompts')
    .upsert({ user_id: user.id, prompt_id: promptId }, { onConflict: 'user_id,prompt_id' })

  if (error) throw error
  revalidatePath('/pantry')
  return { success: true }
}
