-- Queries to run in the Supabase SQL editor to see how everyone is doing.
-- The dashboard uses the service role, so it sees every row.

-- Who is using the app, and how much
select
  p.display_name,
  p.level,
  count(a.id)                                          as answers,
  round(100.0 * count(*) filter (where a.grade <> 'wrong') / nullif(count(a.id), 0)) as accuracy_pct,
  max(a.answered_at)                                   as last_seen
from public.profiles p
left join public.answers a on a.user_id = p.id
group by p.id, p.display_name, p.level
order by answers desc;

-- Which topics people get wrong most often, across all users
select tag, count(*) as misses
from public.answers a, unnest(a.error_tags) as tag
where a.grade = 'wrong'
group by tag
order by misses desc
limit 20;

-- The hardest cards: the ones most people fail
select
  card_id,
  unit_id,
  count(*)                                        as attempts,
  count(*) filter (where grade = 'wrong')         as wrong,
  round(100.0 * count(*) filter (where grade = 'wrong') / count(*)) as wrong_pct
from public.answers
group by card_id, unit_id
having count(*) >= 3
order by wrong_pct desc, attempts desc
limit 30;

-- All the feedback people have left
select s.created_at, s.author, s.body, p.display_name
from public.suggestions s
left join public.profiles p on p.id = s.user_id
order by s.created_at desc;
