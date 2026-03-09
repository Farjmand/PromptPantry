-- ============================================================
-- PromptPantry — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Prompts table
create table if not exists public.prompts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text not null,
  tags        text[] not null default '{}',
  model       text not null default 'ChatGPT',
  author_id   uuid references auth.users(id) on delete set null,
  upvotes     integer not null default 0,
  created_at  timestamptz not null default now(),

  -- Full-text search column (auto-updated via trigger)
  fts         tsvector generated always as (
    to_tsvector('english', title || ' ' || body || ' ' || array_to_string(tags, ' '))
  ) stored
);

create index if not exists prompts_fts_idx on public.prompts using gin(fts);
create index if not exists prompts_tags_idx on public.prompts using gin(tags);
create index if not exists prompts_upvotes_idx on public.prompts (upvotes desc);

-- Saved prompts (My Pantry)
create table if not exists public.saved_prompts (
  user_id    uuid references auth.users(id) on delete cascade,
  prompt_id  uuid references public.prompts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, prompt_id)
);

-- ============================================================
-- RLS Policies
-- ============================================================

alter table public.prompts enable row level security;
alter table public.saved_prompts enable row level security;

-- Prompts: anyone can read
create policy "Public read prompts"
  on public.prompts for select
  using (true);

-- Prompts: authenticated users can insert their own
create policy "Authenticated insert prompts"
  on public.prompts for insert
  with check (auth.uid() = author_id);

-- Prompts: authors can update their own
create policy "Author update prompts"
  on public.prompts for update
  using (auth.uid() = author_id);

-- Prompts: upvotes can be updated by anyone (counter)
create policy "Anyone can increment upvotes"
  on public.prompts for update
  using (true)
  with check (true);

-- Saved prompts: users manage their own
create policy "Users manage own saved prompts"
  on public.saved_prompts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- increment_upvotes RPC (called from server action)
-- ============================================================

create or replace function public.increment_upvotes(prompt_id uuid)
returns void
language sql
security definer
as $$
  update public.prompts
  set upvotes = upvotes + 1
  where id = prompt_id;
$$;
