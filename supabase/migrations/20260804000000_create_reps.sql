-- Rep accounts for authenticated dashboard access.
create table if not exists reps (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  name text not null,
  role text not null check (role in ('rep', 'admin')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists reps_email_idx on reps (email);

-- Application code has referenced verify_sessions.rep_id (as free-text,
-- e.g. "jsmith") since before this table actually had the column — it
-- doesn't exist yet. Add it directly as a uuid FK into reps, since the
-- authenticated rep's session now supplies a real reps.id instead.
alter table verify_sessions
  add column if not exists rep_id uuid references reps (id);
