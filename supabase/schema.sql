-- Inglesiamo: schema of the Supabase project (already applied on 2026-09-20).
-- Kept in the repo so the database can be rebuilt from scratch, and so any
-- change to it is reviewed like code.

-- profiles: one row per learner, written by the app after signing in
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null default '',
  level text not null default 'B2',
  daily_goal integer not null default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- answers: one row per card answered, the same shape as AnswerRecord in the app
create table if not exists public.answers (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  card_id text not null,
  unit_id text not null default '',
  grade text not null check (grade in ('correct', 'almost', 'wrong')),
  error_tags text[] not null default '{}',
  answered_at timestamptz not null default now()
);
create index if not exists answers_user_idx on public.answers (user_id, answered_at desc);
create index if not exists answers_card_idx on public.answers (card_id);

-- suggestions: feedback left by whoever is trying the app
create table if not exists public.suggestions (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete set null,
  author text not null default 'Anonymous',
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.answers enable row level security;
alter table public.suggestions enable row level security;

-- Each learner reads and writes only their own rows. The owner reads everything
-- from the dashboard, where the service role bypasses these policies.
create policy "profiles are private" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "read own answers" on public.answers
  for select using (auth.uid() = user_id);
create policy "insert own answers" on public.answers
  for insert with check (auth.uid() = user_id);

create policy "read own suggestions" on public.suggestions
  for select using (auth.uid() = user_id);
create policy "insert own suggestions" on public.suggestions
  for insert with check (auth.uid() = user_id);
