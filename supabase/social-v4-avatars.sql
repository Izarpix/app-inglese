-- Profile avatars: only a catalogue id is stored, never an uploaded personal image.
alter table public.profiles add column if not exists avatar_id text;

-- Replace the narrow friend-list function so friends see nickname and avatar,
-- but never email address or any other profile information.
create or replace function public.my_friendships()
returns table(id bigint, nickname text, avatar_id text, status text, incoming boolean)
language sql security definer set search_path = public
as $$
  select f.id, p.nickname, p.avatar_id, f.status, f.addressee_id = auth.uid()
  from public.friendships f
  join public.profiles p on p.id = case when f.requester_id = auth.uid() then f.addressee_id else f.requester_id end
  where auth.uid() in (f.requester_id, f.addressee_id)
  order by f.created_at desc;
$$;

grant execute on function public.my_friendships() to authenticated;
