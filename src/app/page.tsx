import { createClient } from '@/lib/supabase/server'
import PromptCard from '@/components/PromptCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Prompt } from '@/lib/types'

const POPULAR_TAGS = [
  'writing', 'coding', 'marketing', 'productivity',
  'research', 'creative', 'chatgpt', 'claude', 'business',
]

interface HomePageProps {
  readonly searchParams: Promise<{ tag?: string; q?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { tag, q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('prompts')
    .select('*')
    .order('upvotes', { ascending: false })
    .limit(50)

  if (tag) {
    query = query.contains('tags', [tag])
  }

  if (q) {
    query = query.textSearch('fts', q, { type: 'websearch' })
  }

  const { data: prompts } = await query

  return (
    <div>
      {/* Hero */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          The best AI prompts, all in one place.
        </h1>
        <p className="text-muted-foreground mb-4">
          Browse, upvote, and save prompts for ChatGPT, Claude, Gemini, and more.
        </p>
        <Link href="/submit">
          <Button size="lg">Submit your best prompt →</Button>
        </Link>
      </div>

      {/* Search */}
      <form method="GET" className="mb-6 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search prompts..."
          className="flex-1 rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" variant="outline">Search</Button>
      </form>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/">
          <Badge variant={tag ? 'outline' : 'default'} className="cursor-pointer">
            All
          </Badge>
        </Link>
        {POPULAR_TAGS.map((t) => (
          <Link key={t} href={`/?tag=${t}`}>
            <Badge variant={tag === t ? 'default' : 'outline'} className="cursor-pointer">
              {t}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Prompt grid */}
      {prompts && prompts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {(prompts as Prompt[]).map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg mb-2">No prompts yet{tag ? ` for #${tag}` : ''}.</p>
          <Link href="/submit">
            <Button variant="outline">Be the first to submit one →</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
