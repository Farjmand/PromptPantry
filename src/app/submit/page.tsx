import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { submitPrompt } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MODELS = ['ChatGPT', 'Claude', 'Gemini', 'GPT-4o', 'Llama', 'Mistral', 'Other']

export default async function SubmitPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/?login=required')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Submit a Prompt</CardTitle>
          <p className="text-sm text-muted-foreground">
            Share a prompt that&apos;s genuinely useful. Be specific.
          </p>
        </CardHeader>
        <CardContent>
          <form action={submitPrompt} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Rewrite any email to sound more professional"
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="body">Prompt</Label>
              <Textarea
                id="body"
                name="body"
                placeholder="Paste your full prompt here..."
                required
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Use [VARIABLE] placeholders for parts the user should fill in.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="model">Model</Label>
              <select
                id="model"
                name="model"
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                defaultValue="ChatGPT"
              >
                {MODELS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="writing, productivity, coding (comma-separated)"
              />
            </div>

            <Button type="submit" className="w-full">Submit Prompt</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
