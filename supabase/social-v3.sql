-- Run after social-v2.sql. Keep one relationship for each pair of learners,
-- regardless of who sent the request first.
delete from public.friendships older
using public.friendships newer
where older.id < newer.id
  and least(older.requester_id::text, older.addressee_id::text) = least(newer.requester_id::text, newer.addressee_id::text)
  and greatest(older.requester_id::text, older.addressee_id::text) = greatest(newer.requester_id::text, newer.addressee_id::text);

create unique index if not exists friendships_unique_pair
on public.friendships (least(requester_id::text, addressee_id::text), greatest(requester_id::text, addressee_id::text));
