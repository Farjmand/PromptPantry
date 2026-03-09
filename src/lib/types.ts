export interface Prompt {
  id: string
  title: string
  body: string
  tags: string[]
  model: string
  author_id: string
  upvotes: number
  created_at: string
  author?: {
    email: string
    full_name?: string
    avatar_url?: string
  }
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}
