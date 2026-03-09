import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { Prompt } from '@/lib/types'
import UpvoteButton from './UpvoteButton'

export default function PromptCard({ prompt }: { prompt: Prompt }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-snug">
            <Link href={`/prompts/${prompt.id}`} className="hover:underline">
              {prompt.title}
            </Link>
          </CardTitle>
          <UpvoteButton promptId={prompt.id} upvotes={prompt.upvotes} />
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-3">{prompt.body}</p>
      </CardContent>

      <CardFooter className="flex items-center gap-2 flex-wrap pt-0">
        {prompt.tags.map((tag) => (
          <Link key={tag} href={`/?tag=${tag}`}>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              {tag}
            </Badge>
          </Link>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">{prompt.model}</span>
      </CardFooter>
    </Card>
  )
}
