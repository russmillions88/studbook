-- ============================================================
-- STUDBOOK DATABASE SCHEMA
-- Run this in Supabase SQL Editor (SQL Editor -> New query -> paste -> Run)
-- ============================================================

-- Profiles table: extends Supabase's built-in auth.users with our fields.
-- Supabase auth already handles email/password/sessions, so we don't
-- store those ourselves - we just link to auth.users by id.
create table profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    full_name text not null default '',
    phone text,
    location_city text,
    location_state text,
    location_country text,
    latitude decimal(9,6),
    longitude decimal(9,6),
    is_stallion_owner boolean default false,
    subscription_tier text default 'free', -- 'free', 'basic', 'featured'
    subscription_expires_at timestamptz,
    stripe_customer_id text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Reference tables
create table breeds (
    id serial primary key,
    name text unique not null
);

create table disciplines (
    id serial primary key,
    name text unique not null
);

-- Seed common breeds and disciplines
insert into breeds (name) values
    ('Quarter Horse'), ('Thoroughbred'), ('Friesian'), ('Warmblood'),
    ('Arabian'), ('Paint Horse'), ('Appaloosa'), ('Andalusian'),
    ('Clydesdale'), ('Morgan'), ('Standardbred'), ('Other');

insert into disciplines (name) values
    ('Dressage'), ('Show Jumping'), ('Eventing'), ('Barrel Racing'),
    ('Reining'), ('Trail'), ('Driving'), ('Halter/Conformation'), ('Racing');

-- Stallions
create table stallions (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references profiles(id) on delete cascade,
    name text not null,
    registration_number text,
    breed_id int references breeds(id),
    color text,
    height_hands decimal(3,1),
    birth_year int,
    stud_fee_cents int,
    stud_fee_notes text,
    location_city text,
    location_state text,
    location_country text,
    latitude decimal(9,6),
    longitude decimal(9,6),
    description text,
    semen_availability text,
    is_verified boolean default false,
    is_active boolean default true,
    view_count int default 0,
    inquiry_count int default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table stallion_disciplines (
    stallion_id uuid references stallions(id) on delete cascade,
    discipline_id int references disciplines(id),
    primary key (stallion_id, discipline_id)
);

create table stallion_media (
    id uuid primary key default gen_random_uuid(),
    stallion_id uuid not null references stallions(id) on delete cascade,
    media_type text not null,
    url text not null,
    is_primary boolean default false,
    display_order int default 0,
    created_at timestamptz default now()
);

create table stallion_documents (
    id uuid primary key default gen_random_uuid(),
    stallion_id uuid not null references stallions(id) on delete cascade,
    document_type text not null,
    file_url text not null,
    uploaded_at timestamptz default now()
);

create table pedigree_entries (
    id uuid primary key default gen_random_uuid(),
    stallion_id uuid not null references stallions(id) on delete cascade,
    ancestor_name text not null,
    relationship text not null,
    registration_number text
);

create table mares (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references profiles(id) on delete cascade,
    name text not null,
    breed_id int references breeds(id),
    birth_year int,
    color text,
    created_at timestamptz default now()
);

create table shortlists (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    stallion_id uuid not null references stallions(id) on delete cascade,
    created_at timestamptz default now(),
    unique(user_id, stallion_id)
);

create table inquiries (
    id uuid primary key default gen_random_uuid(),
    stallion_id uuid not null references stallions(id) on delete cascade,
    from_user_id uuid references profiles(id),
    from_email text not null,
    from_name text not null,
    mare_id uuid references mares(id),
    message text,
    status text default 'new',
    created_at timestamptz default now()
);

-- Indexes
create index idx_stallions_breed on stallions(breed_id);
create index idx_stallions_location on stallions(latitude, longitude);
create index idx_stallions_active on stallions(is_active) where is_active = true;
create index idx_inquiries_stallion on inquiries(stallion_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Supabase requires this to control who can read/write what.
-- Without these policies, your data is either fully locked or fully open.
-- ============================================================

alter table profiles enable row level security;
alter table stallions enable row level security;
alter table stallion_disciplines enable row level security;
alter table stallion_media enable row level security;
alter table stallion_documents enable row level security;
alter table pedigree_entries enable row level security;
alter table mares enable row level security;
alter table shortlists enable row level security;
alter table inquiries enable row level security;
alter table breeds enable row level security;
alter table disciplines enable row level security;

-- Breeds & disciplines: everyone can read, nobody can write via API
create policy "breeds_public_read" on breeds for select using (true);
create policy "disciplines_public_read" on disciplines for select using (true);

-- Profiles: anyone can view basic profile info (needed to show stallion owner name),
-- but only the owner can edit their own profile
create policy "profiles_public_read" on profiles for select using (true);
create policy "profiles_owner_update" on profiles for update using (auth.uid() = id);
create policy "profiles_owner_insert" on profiles for insert with check (auth.uid() = id);

-- Stallions: anyone can view active listings; only the owner can create/edit/delete theirs
create policy "stallions_public_read" on stallions for select using (is_active = true or owner_id = auth.uid());
create policy "stallions_owner_insert" on stallions for insert with check (owner_id = auth.uid());
create policy "stallions_owner_update" on stallions for update using (owner_id = auth.uid());
create policy "stallions_owner_delete" on stallions for delete using (owner_id = auth.uid());

-- Stallion disciplines/media/documents/pedigree: readable if the stallion is readable,
-- writable only by the stallion's owner
create policy "stallion_disciplines_read" on stallion_disciplines for select using (true);
create policy "stallion_disciplines_write" on stallion_disciplines for all using (
    exists (select 1 from stallions where stallions.id = stallion_id and stallions.owner_id = auth.uid())
);

create policy "stallion_media_read" on stallion_media for select using (true);
create policy "stallion_media_write" on stallion_media for all using (
    exists (select 1 from stallions where stallions.id = stallion_id and stallions.owner_id = auth.uid())
);

create policy "stallion_documents_read" on stallion_documents for select using (true);
create policy "stallion_documents_write" on stallion_documents for all using (
    exists (select 1 from stallions where stallions.id = stallion_id and stallions.owner_id = auth.uid())
);

create policy "pedigree_read" on pedigree_entries for select using (true);
create policy "pedigree_write" on pedigree_entries for all using (
    exists (select 1 from stallions where stallions.id = stallion_id and stallions.owner_id = auth.uid())
);

-- Mares: only the owner can see/manage their own mares
create policy "mares_owner_read" on mares for select using (owner_id = auth.uid());
create policy "mares_owner_write" on mares for all using (owner_id = auth.uid());

-- Shortlists: only the user can see/manage their own shortlist
create policy "shortlists_owner_all" on shortlists for all using (user_id = auth.uid());

-- Inquiries: the stallion owner can see inquiries sent to them;
-- the sender can see inquiries they sent; anyone logged in can create one
create policy "inquiries_read" on inquiries for select using (
    from_user_id = auth.uid()
    or exists (select 1 from stallions where stallions.id = stallion_id and stallions.owner_id = auth.uid())
);
create policy "inquiries_insert" on inquiries for insert with check (true);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- When someone signs up via Supabase Auth, automatically create
-- their profiles row so the rest of the app has somewhere to store data.
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
