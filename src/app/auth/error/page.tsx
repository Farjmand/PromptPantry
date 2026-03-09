export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
        <p className="mt-2 text-muted-foreground">Something went wrong. Please try again.</p>
        <a href="/" className="mt-4 inline-block underline">Go home</a>
      </div>
    </div>
  )
}
