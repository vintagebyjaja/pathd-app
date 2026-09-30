-- PATHD Phase 1 schema: identity, profiles, resumes, companies, jobs.
-- Find where Supabase installed each extension (it may be "extensions", "postgis",
-- or another schema), install any that are missing, and put them all on the search path.
do $$
declare
  ext text;
  sch text;
  schemas text := 'public, extensions';
begin
  create schema if not exists extensions;
  foreach ext in array array['citext', 'pg_trgm', 'postgis'] loop
    select n.nspname into sch from pg_extension e join pg_namespace n on n.oid = e.extnamespace where e.extname = ext;
    if sch is null then
      execute format('create extension %I with schema extensions', ext);
      sch := 'extensions';
    end if;
    if position(quote_ident(sch) in schemas) = 0 then
      schemas := schemas || ', ' || quote_ident(sch);
    end if;
  end loop;
  perform set_config('search_path', schemas, false);
end $$;

-- Later phases add routes, radar, network, circles, local, billing in new migrations.


-- ───────────── Enums ─────────────
create type account_type     as enum ('individual','student','employer','recruiter','local_business','admin');
create type visibility       as enum ('public','connections','private');
create type location_precision as enum ('city','region','hidden');
create type work_type        as enum ('remote','hybrid','onsite');
create type remote_scope     as enum ('usa','worldwide');
create type salary_source    as enum ('employer_listed','pathd_estimate','not_provided');
create type salary_period    as enum ('year','hour');
create type education_level  as enum ('none','high_school','associate','bachelor','master','doctorate');
create type experience_level as enum ('entry','mid','senior','lead','executive');
create type apply_method     as enum ('pathd','external');
create type skill_kind       as enum ('required','preferred');
create type requirement_kind as enum ('license','certification');

-- ───────────── Identity & profile ─────────────
create table profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  account_type      account_type not null default 'individual',
  handle            citext unique,
  full_name         text check (char_length(full_name) <= 120),
  headline          text check (char_length(headline) <= 200),
  current_title     text,
  current_company   text,
  city              text,            -- display location only; never an address
  region            text,
  career_goal       text,
  years_experience  smallint check (years_experience between 0 and 70),
  highest_education education_level,
  purposes          text[] not null default '{}',
  onboarded_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table privacy_settings (
  profile_id          uuid primary key references profiles(id) on delete cascade,
  profile             visibility not null default 'public',
  current_employer    visibility not null default 'connections',
  job_seeking_status  visibility not null default 'private',
  location_precision  location_precision not null default 'city',
  circles             visibility not null default 'connections',
  connections         visibility not null default 'connections',
  activity            visibility not null default 'connections'
);

create table career_preferences (
  profile_id           uuid primary key references profiles(id) on delete cascade,
  desired_roles        text[] not null default '{}',
  -- Minimum annual pay for the next job. Owner-only (RLS). Never exposed to employers,
  -- recruiters or other members; only pay_fit() below reads it on their behalf.
  -- PATHD never stores current or past pay.
  salary_target        integer check (salary_target > 0),
  industries           text[] not null default '{}',
  work_types           work_type[] not null default '{}',
  commute_miles        smallint check (commute_miles between 1 and 200),
  preferred_locations  text[] not null default '{}',
  willing_to_relocate  boolean not null default false,
  -- Approximate, user-approved search center (coarsened ~1 km). Owner-only via RLS.
  search_lat           double precision,
  search_lng           double precision,
  updated_at           timestamptz not null default now()
);

create table skills (
  id    bigint generated always as identity primary key,
  name  citext not null unique
);

create table profile_skills (
  profile_id uuid references profiles(id) on delete cascade,
  skill_id   bigint references skills(id) on delete cascade,
  primary key (profile_id, skill_id)
);

create table work_experience (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on delete cascade,
  title       text not null,
  company     text not null,
  start_date  text,
  end_date    text,
  is_current  boolean not null default false,
  summary     text,
  sort_order  smallint not null default 0
);
create index on work_experience(profile_id);

create table education (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references profiles(id) on delete cascade,
  school          text not null,
  degree          text,
  field           text,
  graduation_year text
);
create index on education(profile_id);

create table certifications (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on delete cascade,
  name        text not null,
  verified_at timestamptz   -- set only by a verification workflow, never by the user
);
create index on certifications(profile_id);

create table licenses (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on delete cascade,
  name        text not null,
  jurisdiction text,
  verified_at timestamptz
);
create index on licenses(profile_id);

create table portfolio_links (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on delete cascade,
  url         text not null check (url ~* '^https?://')
);

-- ───────────── Resumes ─────────────
create table resumes (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on delete cascade,
  label       text not null default 'Main resume',
  is_default  boolean not null default true,
  created_at  timestamptz not null default now()
);
create index on resumes(profile_id);

create table resume_versions (
  id            uuid primary key default gen_random_uuid(),
  resume_id     uuid not null references resumes(id) on delete cascade,
  storage_path  text not null,          -- private bucket "resumes/<uid>/..."
  file_kind     text not null check (file_kind in ('pdf','docx')),
  parsed        jsonb,                  -- AI draft, kept for audit; profile tables hold user-approved data
  created_at    timestamptz not null default now()
);

-- ───────────── Companies & jobs ─────────────
create table companies (
  id          uuid primary key default gen_random_uuid(),
  slug        citext not null unique,
  name        text not null,
  industry    text not null,
  website     text,
  verified_at timestamptz,
  is_demo     boolean not null default false,
  created_at  timestamptz not null default now()
);

create table jobs (
  id                    uuid primary key default gen_random_uuid(),
  company_id            uuid not null references companies(id) on delete cascade,
  title                 text not null,
  description           text not null default '',
  industry              text not null,
  work_type             work_type not null,
  remote_scope          remote_scope,
  experience_level      experience_level not null,
  min_years_experience  smallint not null default 0,
  education_level       education_level not null default 'none',

  -- NO HIDDEN PAY: integrity enforced in the database, not just the UI.
  salary_source         salary_source not null,
  salary_min            integer,
  salary_max            integer,
  salary_period         salary_period not null default 'year',
  salary_estimate_basis text,
  constraint salary_integrity check (
    (salary_source = 'not_provided' and salary_min is null and salary_max is null)
    or (salary_source <> 'not_provided' and coalesce(salary_min, salary_max) is not null)
  ),
  constraint salary_order check (salary_min is null or salary_max is null or salary_min <= salary_max),
  constraint estimate_has_basis check (salary_source <> 'pathd_estimate' or salary_estimate_basis is not null),

  apply_method          apply_method not null default 'pathd',
  apply_url             text,
  -- ingestion provenance
  source                text not null,
  source_job_id         text,
  canonical_url         text,
  dedupe_hash           text,
  posted_at             timestamptz not null default now(),
  expires_at            timestamptz,
  is_active             boolean not null default true,
  is_demo               boolean not null default false,
  search_vector         tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title,'')), 'A') ||
    setweight(to_tsvector('english', coalesce(industry,'')), 'B') ||
    setweight(to_tsvector('english', coalesce(description,'')), 'C')
  ) stored,
  unique (source, source_job_id)
);
create index jobs_search_idx on jobs using gin(search_vector);
create index jobs_title_trgm on jobs using gin(title gin_trgm_ops);
create index jobs_active_posted on jobs(is_active, posted_at desc);
create index jobs_dedupe on jobs(dedupe_hash);

create table job_locations (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references jobs(id) on delete cascade,
  city        text not null,
  region      text not null,
  point       geography(point, 4326),   -- office location, public
  is_primary  boolean not null default true
);
create index job_locations_point on job_locations using gist(point);
create index on job_locations(job_id);

create table job_skills (
  job_id    uuid references jobs(id) on delete cascade,
  skill_id  bigint references skills(id) on delete cascade,
  kind      skill_kind not null,
  primary key (job_id, skill_id)
);

create table job_requirements (
  id      uuid primary key default gen_random_uuid(),
  job_id  uuid not null references jobs(id) on delete cascade,
  kind    requirement_kind not null,
  name    text not null,
  required boolean not null default true
);
create index on job_requirements(job_id);

-- Flattened read model used by the app.
create view jobs_public with (security_invoker = true) as
select
  j.id, j.title, j.description, j.industry, j.work_type, j.remote_scope,
  j.experience_level, j.min_years_experience, j.education_level,
  j.salary_source, j.salary_min, j.salary_max, j.salary_period, j.salary_estimate_basis,
  case when j.salary_period = 'hour' then coalesce(j.salary_max, j.salary_min) * 2080
       else coalesce(j.salary_max, j.salary_min) end as salary_max_annual,
  j.apply_method, j.apply_url, j.source, j.posted_at, j.is_demo, j.search_vector,
  c.id as company_id, c.slug as company_slug, c.name as company_name,
  l.city, l.region,
  st_y(l.point::geometry) as lat, st_x(l.point::geometry) as lng,
  coalesce(array(select s.name::text from job_skills js join skills s on s.id = js.skill_id where js.job_id = j.id and js.kind = 'required'), '{}') as required_skills,
  coalesce(array(select s.name::text from job_skills js join skills s on s.id = js.skill_id where js.job_id = j.id and js.kind = 'preferred'), '{}') as preferred_skills,
  coalesce(array(select r.name from job_requirements r where r.job_id = j.id and r.kind = 'license' and r.required), '{}') as required_licenses,
  coalesce(array(select r.name from job_requirements r where r.job_id = j.id and r.kind = 'certification' and not r.required), '{}') as preferred_certifications
from jobs j
join companies c on c.id = j.company_id
left join job_locations l on l.job_id = j.id and l.is_primary
where j.is_active and (j.expires_at is null or j.expires_at > now());

-- ───────────── Row-level security ─────────────
alter table profiles            enable row level security;
alter table privacy_settings    enable row level security;
alter table career_preferences  enable row level security;
alter table profile_skills      enable row level security;
alter table work_experience     enable row level security;
alter table education           enable row level security;
alter table certifications      enable row level security;
alter table licenses            enable row level security;
alter table portfolio_links     enable row level security;
alter table resumes             enable row level security;
alter table resume_versions     enable row level security;
alter table skills              enable row level security;
alter table companies           enable row level security;
alter table jobs                enable row level security;
alter table job_locations       enable row level security;
alter table job_skills          enable row level security;
alter table job_requirements    enable row level security;

-- Owners manage their own rows.
create policy own_profile on profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy public_profiles_read on profiles for select using (
  exists (select 1 from privacy_settings ps where ps.profile_id = profiles.id and ps.profile = 'public')
);
-- Connection-level visibility is added with the connections table in phase 4.

create policy own_privacy on privacy_settings for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy own_prefs   on career_preferences for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy own_pskills on profile_skills for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy own_work    on work_experience for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy own_edu     on education for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy own_links   on portfolio_links for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy own_resumes on resumes for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy own_resume_versions on resume_versions for all
  using (exists (select 1 from resumes r where r.id = resume_id and r.profile_id = auth.uid()))
  with check (exists (select 1 from resumes r where r.id = resume_id and r.profile_id = auth.uid()));

-- Users may add credentials but never mark them verified.
create policy own_certs_read on certifications for select using (profile_id = auth.uid());
create policy own_certs_write on certifications for insert with check (profile_id = auth.uid() and verified_at is null);
create policy own_certs_delete on certifications for delete using (profile_id = auth.uid());
create policy own_lic_read on licenses for select using (profile_id = auth.uid());
create policy own_lic_write on licenses for insert with check (profile_id = auth.uid() and verified_at is null);
create policy own_lic_delete on licenses for delete using (profile_id = auth.uid());

-- Job catalog is readable by everyone; writes go through service-role ingestion or the employer portal (phase 6).
create policy read_skills    on skills for select using (true);
create policy read_companies on companies for select using (true);
create policy read_jobs      on jobs for select using (is_active);
create policy read_job_locs  on job_locations for select using (true);
create policy read_job_skill on job_skills for select using (true);
create policy read_job_reqs  on job_requirements for select using (true);

-- ───────────── Storage: private resume bucket ─────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resumes', 'resumes', false, 5242880,
        array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;

create policy resumes_owner_rw on storage.objects for all
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

-- ───────────── New user bootstrap ─────────────
create function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id) values (new.id);
  insert into privacy_settings (profile_id) values (new.id);
  insert into career_preferences (profile_id) values (new.id);
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- ───────────── Onboarding save (atomic) ─────────────
create function complete_onboarding(p_user_id uuid, p_payload jsonb)
returns void language plpgsql security invoker set search_path = public, extensions as $$
declare s text;
begin
  if p_user_id <> auth.uid() then raise exception 'forbidden'; end if;

  update profiles set
    full_name = p_payload->'profile'->>'full_name',
    headline  = p_payload->'profile'->>'headline',
    city      = p_payload->'profile'->>'city',
    purposes  = array(select jsonb_array_elements_text(p_payload->'purposes')),
    onboarded_at = coalesce(onboarded_at, now()),
    updated_at = now()
  where id = p_user_id;

  update privacy_settings set
    profile = (p_payload->'privacy'->>'profile')::visibility,
    current_employer = (p_payload->'privacy'->>'current_employer')::visibility,
    job_seeking_status = (p_payload->'privacy'->>'job_seeking_status')::visibility,
    location_precision = (p_payload->'privacy'->>'location_precision')::location_precision,
    circles = (p_payload->'privacy'->>'circles')::visibility,
    connections = (p_payload->'privacy'->>'connections')::visibility,
    activity = (p_payload->'privacy'->>'activity')::visibility
  where profile_id = p_user_id;

  update career_preferences set
    desired_roles = array(select jsonb_array_elements_text(p_payload->'preferences'->'desired_roles')),
    salary_target = nullif(p_payload->'preferences'->>'salary_target','')::integer,
    industries = array(select jsonb_array_elements_text(p_payload->'preferences'->'industries')),
    work_types = array(select jsonb_array_elements_text(p_payload->'preferences'->'work_types'))::work_type[],
    commute_miles = nullif(p_payload->'preferences'->>'commute_miles','')::smallint,
    preferred_locations = array(select jsonb_array_elements_text(p_payload->'preferences'->'preferred_locations')),
    willing_to_relocate = coalesce((p_payload->'preferences'->>'willing_to_relocate')::boolean, false),
    updated_at = now()
  where profile_id = p_user_id;

  -- Replace user-entered lists with the reviewed versions.
  delete from work_experience where profile_id = p_user_id;
  insert into work_experience (profile_id, title, company, start_date, end_date, is_current, summary, sort_order)
  select p_user_id, w->>'title', w->>'company', w->>'startDate', w->>'endDate', coalesce((w->>'current')::boolean,false), w->>'summary', ord::smallint
  from jsonb_array_elements(p_payload->'work') with ordinality as t(w, ord)
  where coalesce(w->>'title','') <> '';

  delete from education where profile_id = p_user_id;
  insert into education (profile_id, school, degree, field, graduation_year)
  select p_user_id, e->>'school', e->>'degree', e->>'field', e->>'graduationYear'
  from jsonb_array_elements(p_payload->'education') e
  where coalesce(e->>'school','') <> '';

  delete from profile_skills where profile_id = p_user_id;
  for s in select distinct trim(x) from jsonb_array_elements_text(p_payload->'skills') x where trim(x) <> '' loop
    insert into skills(name) values (s) on conflict (name) do nothing;
    insert into profile_skills(profile_id, skill_id) select p_user_id, id from skills where lower(name::text) = lower(s) on conflict do nothing;
  end loop;

  delete from certifications where profile_id = p_user_id and verified_at is null;
  insert into certifications(profile_id, name)
  select p_user_id, trim(x) from jsonb_array_elements_text(p_payload->'certifications') x where trim(x) <> '';

  delete from licenses where profile_id = p_user_id and verified_at is null;
  insert into licenses(profile_id, name)
  select p_user_id, trim(x) from jsonb_array_elements_text(p_payload->'licenses') x where trim(x) <> '';
end $$;

-- ───────────── Pay fit (employer-facing, number never revealed) ─────────────
-- Returns only whether a candidate's private minimum fits a job's posted range.
-- Execution stays revoked until the Phase 6 employer portal adds an ownership check
-- (caller must own the job and the candidate must have applied or be discoverable).
create function pay_fit(p_job_id uuid, p_candidate_id uuid)
returns text language sql stable security definer set search_path = public as $$
  select case
    when cp.salary_target is null then 'not_set'
    when j.salary_source = 'not_provided' then 'unknown'
    when (case when j.salary_period = 'hour' then coalesce(j.salary_max, j.salary_min) * 2080
               else coalesce(j.salary_max, j.salary_min) end) >= cp.salary_target then 'fits'
    else 'outside_range'
  end
  from jobs j, career_preferences cp
  where j.id = p_job_id and cp.profile_id = p_candidate_id
$$;
revoke execute on function pay_fit(uuid, uuid) from public, anon, authenticated;
