import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PromptPantry — Browse & share the best AI prompts',
  description: 'A curated pantry of prompts for ChatGPT, Claude, Gemini and more. Browse, upvote, save, and submit your best prompts.',
  openGraph: {
    title: 'PromptPantry — Browse & share the best AI prompts',
    description: 'A curated pantry of prompts for ChatGPT, Claude, Gemini and more.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
