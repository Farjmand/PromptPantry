import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signInWithGoogle, signOut } from '@/lib/actions'
import { Button } from '@/components/ui/button'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          🍱 PromptPantry
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Browse
          </Link>
          {user && (
            <>
              <Link href="/submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Submit
              </Link>
              <Link href="/pantry" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                My Pantry
              </Link>
            </>
          )}

          {user ? (
            <form action={signOut}>
              <Button variant="outline" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          ) : (
            <form action={signInWithGoogle}>
              <Button size="sm" type="submit">
                Sign in with Google
              </Button>
            </form>
          )}
        </nav>
      </div>
    </header>
  )
}
