-- ============================================
-- PROFILES TABLE
-- ============================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  theme text default 'dark',
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;


-- Remove old policies if they exist
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;


-- Create profile policies
create policy "Users can view their own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id);

create policy "Users can insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);



-- ============================================
-- AUTO CREATE PROFILE AFTER SIGNUP
-- ============================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    split_part(new.email, '@', 1)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;


drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();



-- ============================================
-- CALCULATION HISTORY TABLE
-- ============================================

create table if not exists public.calculations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  expression text not null,
  result text not null,
  is_favorite boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.calculations enable row level security;


-- Remove old calculation policies if they exist
drop policy if exists "Users can view their own calculations" on public.calculations;
drop policy if exists "Users can insert their own calculations" on public.calculations;
drop policy if exists "Users can update their own calculations" on public.calculations;
drop policy if exists "Users can delete their own calculations" on public.calculations;


-- Create calculation policies
create policy "Users can view their own calculations"
on public.calculations
for select
using (auth.uid() = user_id);

create policy "Users can insert their own calculations"
on public.calculations
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own calculations"
on public.calculations
for update
using (auth.uid() = user_id);

create policy "Users can delete their own calculations"
on public.calculations
for delete
using (auth.uid() = user_id);
-- Run this AFTER schema.sql. Only new stuff, nothing repeated.

-- Lets users have a profile picture
alter table profiles add column if not exists avatar_url text;

-- Storage bucket for avatar images
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Anyone can view avatars (they're public profile pictures)
create policy "Avatar images are publicly accessible"
on storage.objects for select
using (bucket_id = 'avatars');

-- A user can only upload/replace a file inside their own folder
-- (files are stored as avatars/<user_id>/filename)
create policy "Users can upload their own avatar"
on storage.objects for insert
with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can update their own avatar"
on storage.objects for update
using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- Notes feature
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table notes enable row level security;

create policy "Users can view their own notes"
on notes for select using (auth.uid() = user_id);

create policy "Users can insert their own notes"
on notes for insert with check (auth.uid() = user_id);

create policy "Users can update their own notes"
on notes for update using (auth.uid() = user_id);

create policy "Users can delete their own notes"
on notes for delete using (auth.uid() = user_id);