-- ============================================================
-- DATABASE SETUP FOR THE MULTI-USER CALCULATOR APP
-- ============================================================
-- Run this once inside your Supabase project:
-- Supabase Dashboard -> SQL Editor -> paste this -> Run
-- ============================================================

-- 1. Create a table to store every calculation a user makes.
-- Supabase Auth already has its own "users" table (auth.users),
-- so we don't need to build our own login table. We just link
-- every row here to the id of the user who created it.
create table if not exists calculations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  expression text not null,      -- example: "12 + 4"
  result text not null,          -- example: "16"
  created_at timestamp with time zone default now()
);

-- 2. Turn on Row Level Security (RLS).
-- Without this, ANY logged-in user could read ANY other user's rows.
alter table calculations enable row level security;

-- 3. Add rules that only let a user see and manage their OWN rows.

-- Rule: a user can only SEE calculations where user_id matches their own id.
create policy "Users can view their own calculations"
on calculations for select
using (auth.uid() = user_id);

-- Rule: a user can only INSERT a calculation if they attach their own id to it.
create policy "Users can insert their own calculations"
on calculations for insert
with check (auth.uid() = user_id);

-- Rule: a user can only DELETE their own calculations.
create policy "Users can delete their own calculations"
on calculations for delete
using (auth.uid() = user_id);

-- That's it. Because of these policies, even if someone got the
-- database URL and key, they still could not read another user's
-- history — Supabase checks auth.uid() on every request.
