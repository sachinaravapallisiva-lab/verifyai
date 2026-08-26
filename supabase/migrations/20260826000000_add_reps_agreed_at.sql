-- First-login Terms agreement timestamp. Null means the rep has not agreed.
alter table reps
  add column if not exists agreed_at timestamptz;
