-- Run after social.sql. It exposes only the current user's friend requests,
-- with public nicknames (never email addresses).
create or replace function public.my_friendships()
returns table(id bigint, nickname text, status text, incoming boolean)
language sql security definer set search_path = public
as $$
  select f.id, p.nickname, f.status, f.addressee_id = auth.uid()
  from public.friendships f
  join public.profiles p on p.id = case when f.requester_id = auth.uid() then f.addressee_id else f.requester_id end
  where auth.uid() in (f.requester_id, f.addressee_id)
  order by f.created_at desc;
$$;
grant execute on function public.my_friendships() to authenticated;
