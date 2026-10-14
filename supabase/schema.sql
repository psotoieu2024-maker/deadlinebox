-- DeadlineBox schema. Paste into Supabase dashboard → SQL Editor → New query → Run.
-- Safe to run more than once.

create table if not exists public.deadlines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  due_date date not null default (current_date + 7),
  course text not null default 'General',
  kind text not null default 'assignment' check (kind in ('assignment', 'exam', 'quiz', 'project')),
  created_at timestamptz not null default now()
);

create index if not exists deadlines_user_due_idx on public.deadlines (user_id, due_date);

-- Row Level Security: each user can only touch their own rows; anonymous visitors see nothing.
alter table public.deadlines enable row level security;

drop policy if exists "select own deadlines" on public.deadlines;
drop policy if exists "insert own deadlines" on public.deadlines;
drop policy if exists "update own deadlines" on public.deadlines;
drop policy if exists "delete own deadlines" on public.deadlines;

create policy "select own deadlines" on public.deadlines
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "insert own deadlines" on public.deadlines
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "update own deadlines" on public.deadlines
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "delete own deadlines" on public.deadlines
  for delete to authenticated using ((select auth.uid()) = user_id);
