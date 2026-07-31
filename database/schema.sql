-- Run this in Supabase SQL Editor once.

-- Profile info for each user (name, theme preference)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  theme text default 'dark',
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
on profiles for select using (auth.uid() = id);

create policy "Users can update their own profile"
on profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
on profiles for insert with check (auth.uid() = id);

-- Creates a profile row automatically the moment someone signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Calculation history
create table if not exists calculations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  expression text not null,
  result text not null,
  is_favorite boolean default false,
  created_at timestamp with time zone default now()
);

alter table calculations enable row level security;

create policy "Users can view their own calculations"
on calculations for select using (auth.uid() = user_id);

create policy "Users can insert their own calculations"
on calculations for insert with check (auth.uid() = user_id);

create policy "Users can update their own calculations"
on calculations for update using (auth.uid() = user_id);

create policy "Users can delete their own calculations"
on calculations for delete using (auth.uid() = user_id);
