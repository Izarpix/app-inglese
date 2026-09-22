-- Run once in the Supabase SQL Editor after schema.sql.
-- Social layer: a public nickname is opt-in; email addresses are never exposed.
alter table public.profiles add column if not exists nickname text;
create unique index if not exists profiles_nickname_unique on public.profiles (lower(nickname)) where nickname is not null;

create table if not exists public.friendships (
  id bigint generated always as identity primary key,
  requester_id uuid not null references auth.users on delete cascade,
  addressee_id uuid not null references auth.users on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  unique (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);
alter table public.friendships enable row level security;
create policy "friends see own requests" on public.friendships for select using (auth.uid() in (requester_id, addressee_id));
create policy "users send requests" on public.friendships for insert with check (auth.uid() = requester_id);
create policy "users answer requests" on public.friendships for update using (auth.uid() = addressee_id) with check (auth.uid() = addressee_id);

-- A narrow, safe friend-search API. It returns no email and only exact nickname matches.
create or replace function public.find_friend_by_nickname(query text)
returns table(id uuid, nickname text)
language sql security definer set search_path = public
as $$ select id, nickname from public.profiles where lower(nickname) = lower(trim(query)) limit 1; $$;
grant execute on function public.find_friend_by_nickname(text) to authenticated;

-- Challenges can be asynchronous: each friend records their result separately.
create table if not exists public.challenges (
  id bigint generated always as identity primary key,
  creator_id uuid not null references auth.users on delete cascade,
  opponent_id uuid not null references auth.users on delete cascade,
  title text not null,
  score_creator integer,
  score_opponent integer,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
alter table public.challenges enable row level security;
create policy "players see challenges" on public.challenges for select using (auth.uid() in (creator_id, opponent_id));
create policy "players create challenges" on public.challenges for insert with check (auth.uid() = creator_id);
create policy "players update own challenge" on public.challenges for update using (auth.uid() in (creator_id, opponent_id));
