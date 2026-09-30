-- PATHD portfolios: PDF portfolios members share with employers, firms, clients and peers.
-- Files live in a private storage bucket. Nothing is public unless the owner shares it.

create type portfolio_visibility as enum ('private', 'link', 'connections', 'employers');
create type portfolio_status as enum ('pending', 'ready', 'rejected');

create table portfolio_items (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references profiles(id) on delete cascade,
  title        text not null check (char_length(title) between 1 and 120),
  description  text check (char_length(description) <= 500),
  storage_path text not null unique,
  size_bytes   integer not null check (size_bytes > 0 and size_bytes <= 26214400), -- 25 MB
  status       portfolio_status not null default 'pending',
  visibility   portfolio_visibility not null default 'private',
  sort_order   smallint not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index on portfolio_items(profile_id, sort_order);

create table portfolio_share_links (
  id          uuid primary key default gen_random_uuid(),
  item_id     uuid not null references portfolio_items(id) on delete cascade,
  token       text not null unique check (char_length(token) >= 32),
  created_at  timestamptz not null default now(),
  expires_at  timestamptz,
  revoked_at  timestamptz,
  view_count  integer not null default 0
);
create index on portfolio_share_links(item_id);

alter table portfolio_items enable row level security;
alter table portfolio_share_links enable row level security;

-- Owners manage their own portfolio. Share-link viewing goes through the server (service role).
create policy own_portfolio on portfolio_items for all
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy own_share_links on portfolio_share_links for all
  using (exists (select 1 from portfolio_items i where i.id = item_id and i.profile_id = auth.uid()))
  with check (exists (select 1 from portfolio_items i where i.id = item_id and i.profile_id = auth.uid()));

-- Only the server can mark a file ready (after checking it really is a PDF under 25 MB).
create function guard_portfolio_status() returns trigger language plpgsql as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    if tg_op = 'INSERT' and new.status <> 'pending' then
      raise exception 'new portfolio items start as pending';
    end if;
    if tg_op = 'UPDATE' and (new.status is distinct from old.status
        or new.storage_path is distinct from old.storage_path
        or new.size_bytes is distinct from old.size_bytes) then
      raise exception 'status, file path and size are set by PATHD';
    end if;
  end if;
  new.updated_at := now();
  return new;
end $$;
create trigger portfolio_items_guard before insert or update on portfolio_items
  for each row execute function guard_portfolio_status();

-- Keep storage use reasonable: up to 10 portfolio files per member.
create function limit_portfolio_items() returns trigger language plpgsql as $$
begin
  if (select count(*) from portfolio_items where profile_id = new.profile_id) >= 10 then
    raise exception 'portfolio limit reached (10 files)';
  end if;
  return new;
end $$;
create trigger portfolio_items_limit before insert on portfolio_items
  for each row execute function limit_portfolio_items();

-- Private bucket: PDFs only, 25 MB max. Owners can read, write and delete in their own folder.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolios', 'portfolios', false, 26214400, array['application/pdf'])
on conflict (id) do nothing;

create policy portfolios_owner_rw on storage.objects for all
  using (bucket_id = 'portfolios' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'portfolios' and (storage.foldername(name))[1] = auth.uid()::text);
