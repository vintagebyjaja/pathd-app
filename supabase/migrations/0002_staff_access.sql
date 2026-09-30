-- PATHD staff access: founders and the PATHD Team.
-- Staff status lives in its own table that members can never write to.

create type staff_role as enum ('founder', 'team');

create table staff_members (
  profile_id  uuid primary key references profiles(id) on delete cascade,
  role        staff_role not null,
  added_by    uuid references profiles(id),
  added_at    timestamptz not null default now()
);

alter table staff_members enable row level security;

-- Security-definer helpers so policies can check staff status without exposing the table.
create function is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from staff_members where profile_id = auth.uid());
$$;

create function is_founder() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from staff_members where profile_id = auth.uid() and role = 'founder');
$$;

-- Staff can see who else is staff. Only founders can add or remove staff.
create policy staff_read on staff_members for select using (is_staff());
create policy founders_insert on staff_members for insert with check (is_founder());
create policy founders_update on staff_members for update using (is_founder()) with check (is_founder());
-- A founder can't remove themselves, so the team can never lock itself out by accident.
create policy founders_delete on staff_members for delete using (is_founder() and profile_id <> auth.uid());

-- ───────────── Security fix: members can't change their own account type ─────────────
-- The own_profile policy lets members update their row; without this guard a member
-- could set account_type = 'admin'. Only the service role (server/SQL editor) may change it.
create function guard_account_type() returns trigger
language plpgsql as $$
begin
  if new.account_type is distinct from old.account_type
     and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'account_type can only be changed by PATHD staff tools';
  end if;
  return new;
end $$;

create trigger profiles_guard_account_type
  before update on profiles
  for each row execute function guard_account_type();

-- ───────────── Build and health snapshots (staff-only) ─────────────
create table ops_snapshots (
  id          uuid primary key default gen_random_uuid(),
  taken_at    timestamptz not null default now(),
  source      text not null,          -- e.g. 'ci', 'netlify', 'manual'
  payload     jsonb not null
);
alter table ops_snapshots enable row level security;
create policy staff_read_ops on ops_snapshots for select using (is_staff());
-- Writes come only from server jobs using the service role (no insert policy for members).

-- ───────────── Bootstrap the first founder ─────────────
-- Run once in the Supabase SQL editor after signing up with your founder email:
--   insert into staff_members (profile_id, role)
--   select id, 'founder' from auth.users where email = 'you@yourdomain.com';
