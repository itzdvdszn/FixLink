-- FixLink production data model for Supabase
-- Run this in Supabase SQL Editor before enabling the production frontend.

create extension if not exists pgcrypto;

create type public.user_role as enum ('customer', 'professional', 'admin');
create type public.job_status as enum ('open', 'assigned', 'in_progress', 'completed', 'cancelled');
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'customer',
  full_name text not null,
  phone text,
  email text,
  city text,
  address text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.professional_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  trade text not null,
  experience_years integer not null default 0 check (experience_years >= 0),
  description text,
  specializations text,
  skills text,
  service_radius_km integer not null default 10 check (service_radius_km > 0),
  starting_price numeric(12,2) not null default 0 check (starting_price >= 0),
  verified boolean not null default false,
  premium_active boolean not null default false,
  premium_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  professional_id uuid references public.profiles(id),
  service text not null,
  description text not null,
  location text not null,
  preferred_date date not null,
  budget numeric(12,2) not null check (budget > 0),
  urgency text not null default 'Normal',
  status public.job_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  professional_id uuid not null references public.profiles(id),
  job_id uuid references public.jobs(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(customer_id, professional_id, job_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id),
  customer_id uuid not null references public.profiles(id),
  professional_id uuid not null references public.profiles(id),
  provider text not null default 'paystack',
  provider_reference text unique,
  service_amount numeric(12,2) not null check (service_amount > 0),
  customer_usage_fee numeric(12,2) not null default 0 check (customer_usage_fee >= 0),
  professional_platform_fee numeric(12,2) not null default 0 check (professional_platform_fee >= 0),
  professional_payout numeric(12,2) not null check (professional_payout >= 0),
  total_charged numeric(12,2) not null check (total_charged > 0),
  status public.payment_status not null default 'pending',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.premium_subscriptions (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null default 'paystack',
  provider_reference text unique,
  monthly_amount numeric(12,2) not null default 1200,
  status text not null default 'pending',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create index jobs_service_status_idx on public.jobs(service, status);
create index professional_trade_premium_idx on public.professional_profiles(trade, premium_active, verified);
create index messages_conversation_created_idx on public.messages(conversation_id, created_at);

alter table public.profiles enable row level security;
alter table public.professional_profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.payments enable row level security;
alter table public.premium_subscriptions enable row level security;

create policy "profiles are visible to signed-in users" on public.profiles
  for select to authenticated using (true);
create policy "users can update their own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "users can create their own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

create policy "professionals are publicly discoverable" on public.professional_profiles
  for select using (verified = true);
create policy "professionals manage their own profile" on public.professional_profiles
  for all to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "customers and assigned professionals can view jobs" on public.jobs
  for select to authenticated using (auth.uid() = customer_id or auth.uid() = professional_id);
create policy "customers create their own jobs" on public.jobs
  for insert to authenticated with check (auth.uid() = customer_id);
create policy "job participants can update jobs" on public.jobs
  for update to authenticated using (auth.uid() = customer_id or auth.uid() = professional_id);

create policy "conversation participants can view conversations" on public.conversations
  for select to authenticated using (auth.uid() = customer_id or auth.uid() = professional_id);
create policy "participants can create conversations" on public.conversations
  for insert to authenticated with check (auth.uid() = customer_id or auth.uid() = professional_id);

create policy "conversation participants can read messages" on public.messages
  for select to authenticated using (exists (select 1 from public.conversations c where c.id = conversation_id and (c.customer_id = auth.uid() or c.professional_id = auth.uid())));
create policy "conversation participants can send messages" on public.messages
  for insert to authenticated with check (sender_id = auth.uid() and exists (select 1 from public.conversations c where c.id = conversation_id and (c.customer_id = auth.uid() or c.professional_id = auth.uid())));

create policy "customers can view their payments" on public.payments
  for select to authenticated using (auth.uid() = customer_id or auth.uid() = professional_id);
create policy "professionals can view their subscriptions" on public.premium_subscriptions
  for select to authenticated using (auth.uid() = professional_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger professional_profiles_updated_at before update on public.professional_profiles for each row execute function public.set_updated_at();
create trigger jobs_updated_at before update on public.jobs for each row execute function public.set_updated_at();

-- Ranking query used by the professional search API.
create or replace view public.public_professional_search as
select p.id, p.full_name, p.city, p.avatar_url, pp.trade, pp.experience_years,
       pp.starting_price, pp.verified, pp.premium_active,
       case when pp.premium_active and pp.premium_expires_at > now() then 0 else 1 end as ranking_group
from public.profiles p
join public.professional_profiles pp on pp.id = p.id
where p.role = 'professional' and pp.verified = true;
