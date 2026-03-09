-- Recreated and cleaned up from application usage in this repository.
-- This v2 schema removes the old user/users mismatch, replaces hardcoded
-- relation UUIDs with stable text codes, and stores canonical relationships.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  surname text,
  email text not null unique,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, surname, email)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'name', ''),
      split_part(coalesce(new.email, 'user'), '@', 1)
    ),
    nullif(new.raw_user_meta_data ->> 'surname', ''),
    coalesce(new.email, '')
  )
  on conflict (id) do update
  set
    name = excluded.name,
    surname = coalesce(excluded.surname, public.profiles.surname),
    email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  surname text,
  birth_date date,
  gender smallint not null default 1 check (gender in (1, 2, 3)),
  life smallint not null default 1 check (life in (1, 2, 3)),
  marital_status smallint not null default 1 check (marital_status in (1, 2, 3)),
  notes text,
  initials text generated always as (
    upper(left(name, 1) || coalesce(left(surname, 1), ''))
  ) stored,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  constraint people_id_profile_unique unique (id, profile_id)
);

create table if not exists public.relationships (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  source_person_id uuid not null,
  target_person_id uuid not null,
  relationship_kind text not null check (relationship_kind in ('parent', 'spouse', 'sibling')),
  is_blood_relation boolean not null default true,
  created_at timestamptz not null default now(),
  constraint relationships_people_must_differ check (source_person_id <> target_person_id),
  constraint relationships_source_person_fk
    foreign key (source_person_id, profile_id)
    references public.people (id, profile_id)
    on delete cascade,
  constraint relationships_target_person_fk
    foreign key (target_person_id, profile_id)
    references public.people (id, profile_id)
    on delete cascade
);

create index if not exists people_profile_created_idx
  on public.people (profile_id, created_at desc);

create index if not exists people_profile_favorite_idx
  on public.people (profile_id, is_favorite);

create index if not exists relationships_profile_source_idx
  on public.relationships (profile_id, source_person_id);

create index if not exists relationships_profile_target_idx
  on public.relationships (profile_id, target_person_id);

create unique index if not exists relationships_parent_unique_idx
  on public.relationships (profile_id, source_person_id, target_person_id)
  where relationship_kind = 'parent';

create unique index if not exists relationships_pair_unique_idx
  on public.relationships (
    profile_id,
    least(source_person_id, target_person_id),
    greatest(source_person_id, target_person_id),
    relationship_kind
  )
  where relationship_kind in ('spouse', 'sibling');

create or replace view public.profile_overview
with (security_invoker = true) as
select
  profiles.id,
  profiles.name,
  profiles.surname,
  profiles.email,
  profiles.created_at,
  coalesce(people_counts.people_count, 0) as people_count,
  coalesce(relationship_counts.relationship_count, 0) as relationship_count
from public.profiles
left join (
  select
    people.profile_id,
    count(*)::integer as people_count
  from public.people
  group by people.profile_id
) as people_counts on people_counts.profile_id = profiles.id
left join (
  select
    relationships.profile_id,
    count(*)::integer as relationship_count
  from public.relationships
  group by relationships.profile_id
) as relationship_counts on relationship_counts.profile_id = profiles.id;

create or replace function public.get_person_relationships(target_person_id uuid)
returns table (
  id uuid,
  created_at timestamptz,
  gender smallint,
  initials text,
  name text,
  person_id uuid,
  relationship_code text,
  relationship_kind text,
  surname text,
  is_blood_relation boolean
)
language sql
stable
as $$
  with matched_relationships as (
    select
      relationships.id,
      relationships.relationship_kind,
      relationships.is_blood_relation,
      case
        when relationships.relationship_kind = 'parent'
          and relationships.target_person_id = target_person_id then 'parent'
        when relationships.relationship_kind = 'parent'
          and relationships.source_person_id = target_person_id then 'child'
        else relationships.relationship_kind
      end as relationship_code,
      case
        when relationships.relationship_kind = 'parent'
          and relationships.target_person_id = target_person_id then relationships.source_person_id
        when relationships.relationship_kind = 'parent'
          and relationships.source_person_id = target_person_id then relationships.target_person_id
        when relationships.source_person_id = target_person_id then relationships.target_person_id
        else relationships.source_person_id
      end as related_person_id
    from public.relationships
    where relationships.profile_id = auth.uid()
      and (
        relationships.source_person_id = target_person_id
        or relationships.target_person_id = target_person_id
      )
  )
  select
    matched_relationships.id,
    people.created_at,
    people.gender,
    people.initials,
    people.name,
    people.id as person_id,
    matched_relationships.relationship_code,
    matched_relationships.relationship_kind,
    people.surname,
    matched_relationships.is_blood_relation
  from matched_relationships
  join public.people on people.id = matched_relationships.related_person_id
  order by people.created_at desc;
$$;

grant usage on schema public to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.people to authenticated;
grant select, insert, update, delete on public.relationships to authenticated;
grant select on public.profile_overview to authenticated;
grant execute on function public.get_person_relationships(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.people enable row level security;
alter table public.relationships enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists people_select_own on public.people;
create policy people_select_own
on public.people
for select
to authenticated
using (profile_id = auth.uid());

drop policy if exists people_insert_own on public.people;
create policy people_insert_own
on public.people
for insert
to authenticated
with check (profile_id = auth.uid());

drop policy if exists people_update_own on public.people;
create policy people_update_own
on public.people
for update
to authenticated
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

drop policy if exists people_delete_own on public.people;
create policy people_delete_own
on public.people
for delete
to authenticated
using (profile_id = auth.uid());

drop policy if exists relationships_select_own on public.relationships;
create policy relationships_select_own
on public.relationships
for select
to authenticated
using (profile_id = auth.uid());

drop policy if exists relationships_insert_own on public.relationships;
create policy relationships_insert_own
on public.relationships
for insert
to authenticated
with check (
  profile_id = auth.uid()
  and exists (
    select 1
    from public.people
    where people.id = relationships.source_person_id
      and people.profile_id = auth.uid()
  )
  and exists (
    select 1
    from public.people
    where people.id = relationships.target_person_id
      and people.profile_id = auth.uid()
  )
);

drop policy if exists relationships_update_own on public.relationships;
create policy relationships_update_own
on public.relationships
for update
to authenticated
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

drop policy if exists relationships_delete_own on public.relationships;
create policy relationships_delete_own
on public.relationships
for delete
to authenticated
using (profile_id = auth.uid());
