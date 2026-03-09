import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import CopyButton from '@/components/CopyButton'
import SaveButton from '@/components/SaveButton'
import UpvoteButton from '@/components/UpvoteButton'
import type { Metadata } from 'next'

interface PromptPageProps {
  readonly params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PromptPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('prompts').select('title, body').eq('id', id).single()
  if (!data) return { title: 'Prompt not found' }
  return {
    title: `${data.title} — PromptPantry`,
    description: data.body.slice(0, 160),
    openGraph: {
      title: `${data.title} — PromptPantry`,
      description: data.body.slice(0, 160),
    },
  }
}

export default async function PromptPage({ params }: PromptPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: prompt } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .single()

  if (!prompt) notFound()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-2xl font-bold leading-snug">{prompt.title}</h1>
          <UpvoteButton promptId={prompt.id} upvotes={prompt.upvotes} />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {prompt.tags.map((tag: string) => (
            <Link key={tag} href={`/?tag=${tag}`}>
              <Badge variant="secondary" className="cursor-pointer">{tag}</Badge>
            </Link>
          ))}
          <Badge variant="outline" className="ml-auto">{prompt.model}</Badge>
        </div>
      </div>

      {/* Prompt body */}
      <div className="relative rounded-lg border bg-white">
        <div className="absolute top-3 right-3 flex gap-2">
          <CopyButton text={prompt.body} />
          <SaveButton promptId={prompt.id} />
        </div>
        <pre className="p-4 pt-12 text-sm font-mono whitespace-pre-wrap break-words text-foreground leading-relaxed">
          {prompt.body}
        </pre>
      </div>

      {/* CTA */}
      <div className="rounded-lg border border-dashed p-6 text-center bg-white">
        <p className="font-semibold mb-1">Have a great prompt?</p>
        <p className="text-sm text-muted-foreground mb-3">
          Share it with the community and get upvotes.
        </p>
        <Link
          href="/submit"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Submit your best prompt →
        </Link>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Submitted {new Date(prompt.created_at).toLocaleDateString()}
      </p>
    </div>
  )
}
