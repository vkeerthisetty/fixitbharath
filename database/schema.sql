-- FixItBharat production database baseline.
-- Target: PostgreSQL 15+ with PostGIS enabled.

create extension if not exists postgis;
create extension if not exists pgcrypto;

create table citizens (
  id uuid primary key default gen_random_uuid(),
  aadhaar_ref text unique,
  mobile_hash text unique not null,
  mobile_masked text not null,
  consent_version text not null,
  consented_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table departments (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  ministry_name text not null,
  jurisdiction geometry(MultiPolygon, 4326),
  created_at timestamptz not null default now()
);

create table issues (
  id uuid primary key default gen_random_uuid(),
  public_id text unique not null,
  reporter_id uuid not null references citizens(id),
  department_id uuid references departments(id),
  type text not null check (type in ('pothole', 'sewage', 'garbage', 'streetlight', 'waterlog')),
  title text not null check (char_length(title) between 8 and 140),
  description text not null check (char_length(description) between 20 and 4000),
  address_text text not null,
  location geography(Point, 4326),
  status text not null default 'reported' check (status in (
    'reported',
    'under_review',
    'verified_on_site',
    'ministry_notified',
    'work_order_issued',
    'repair_in_progress',
    'resolved',
    'rejected'
  )),
  moderation_status text not null default 'pending_review' check (moderation_status in ('pending_review', 'approved', 'rejected')),
  priority_score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table issue_votes (
  issue_id uuid not null references issues(id) on delete cascade,
  citizen_id uuid not null references citizens(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (issue_id, citizen_id)
);

create table issue_photos (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references issues(id) on delete cascade,
  uploader_id uuid not null references citizens(id),
  object_key text not null,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  byte_size integer not null check (byte_size > 0 and byte_size <= 10485760),
  moderation_status text not null default 'pending_review',
  created_at timestamptz not null default now()
);

create table issue_status_history (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references issues(id) on delete cascade,
  actor_id uuid,
  actor_type text not null check (actor_type in ('citizen', 'moderator', 'department', 'system')),
  from_status text,
  to_status text not null,
  note text,
  evidence_photo_id uuid references issue_photos(id),
  created_at timestamptz not null default now()
);

create table issue_comments (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references issues(id) on delete cascade,
  author_id uuid not null references citizens(id),
  body text not null check (char_length(body) between 1 and 2000),
  moderation_status text not null default 'pending_review',
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text not null,
  target_type text not null,
  target_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index issues_location_idx on issues using gist(location);
create index issues_status_idx on issues(status, moderation_status);
create index issues_type_idx on issues(type);
create index issue_votes_citizen_idx on issue_votes(citizen_id);
create index audit_logs_action_idx on audit_logs(action, created_at desc);
