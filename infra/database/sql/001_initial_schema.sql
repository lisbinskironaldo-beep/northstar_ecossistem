-- Northstar initial relational baseline

create table if not exists users (
  id uuid primary key,
  email text unique,
  account_status text not null,
  country text,
  preferred_language text,
  created_at timestamptz not null,
  last_active_at timestamptz,
  trust_level text not null
);

create table if not exists creator_profiles (
  id uuid primary key,
  user_id uuid not null references users(id),
  display_name text not null,
  handle text not null unique,
  bio text,
  creator_status text not null,
  creator_tier text not null,
  primary_front text not null,
  follower_count_cached integer not null default 0,
  published_content_count_cached integer not null default 0,
  created_at timestamptz not null
);

create table if not exists categories (
  id uuid primary key,
  product_surface text not null,
  slug text not null unique,
  display_name text not null,
  active_flag boolean not null default true,
  rank_order integer not null default 0
);

create table if not exists content_items (
  id uuid primary key,
  creator_id uuid not null references creator_profiles(id),
  product_surface text not null,
  content_type text not null,
  content_state text not null,
  visibility_state text not null,
  trust_state text not null,
  title text not null,
  description text,
  primary_category_id uuid references categories(id),
  created_at timestamptz not null,
  published_at timestamptz,
  archived_at timestamptz
);

create table if not exists content_assets (
  id uuid primary key,
  content_id uuid not null references content_items(id),
  asset_role text not null,
  storage_provider text not null,
  storage_key text not null,
  mime_type text not null,
  duration_ms integer,
  file_size_bytes bigint,
  checksum text,
  transcoded_state text not null,
  created_at timestamptz not null
);

create table if not exists tracks (
  id uuid primary key,
  content_id uuid not null unique references content_items(id),
  artist_name_display text not null,
  explicit_flag boolean not null default false,
  release_type text,
  ai_declaration boolean not null,
  source_tool_optional text
);

create table if not exists saves (
  id uuid primary key,
  user_id uuid not null references users(id),
  content_id uuid not null references content_items(id),
  created_at timestamptz not null
);

create table if not exists follows (
  id uuid primary key,
  user_id uuid not null references users(id),
  creator_id uuid not null references creator_profiles(id),
  created_at timestamptz not null
);

create table if not exists playback_sessions (
  id uuid primary key,
  user_id uuid references users(id),
  content_id uuid not null references content_items(id),
  product_surface text not null,
  started_at timestamptz not null,
  ended_at timestamptz,
  listened_ms integer not null default 0,
  completion_ratio numeric(5,4) not null default 0,
  replay_count_in_session integer not null default 0,
  source_context text
);

create table if not exists reports (
  id uuid primary key,
  reporter_user_id uuid references users(id),
  content_id uuid references content_items(id),
  creator_id uuid references creator_profiles(id),
  report_reason text not null,
  report_source text not null,
  report_status text not null,
  created_at timestamptz not null,
  resolved_at timestamptz
);

create table if not exists moderation_actions (
  id uuid primary key,
  report_id uuid references reports(id),
  target_type text not null,
  target_id text not null,
  action_type text not null,
  action_reason text not null,
  created_at timestamptz not null,
  created_by text,
  expires_at timestamptz
);

create table if not exists trust_scores (
  id uuid primary key,
  user_id uuid not null references users(id),
  creator_id uuid references creator_profiles(id),
  score_value integer not null,
  score_band text not null,
  updated_at timestamptz not null
);

create table if not exists alerts (
  id uuid primary key,
  alert_type text not null,
  severity text not null,
  product_surface text,
  target_reference text,
  triggered_at timestamptz not null,
  resolved_at timestamptz,
  details_json jsonb
);

create table if not exists event_log (
  id uuid primary key,
  event_name text not null,
  actor_user_id uuid references users(id),
  actor_creator_id uuid references creator_profiles(id),
  content_id uuid references content_items(id),
  product_surface text not null,
  occurred_at_utc timestamptz not null,
  payload_json jsonb
);

create table if not exists change_ledger (
  id uuid primary key,
  change_type text not null,
  target_scope text not null,
  approved_by text,
  created_at timestamptz not null,
  summary text not null,
  expected_effect text,
  observed_effect text
);

insert into categories (id, product_surface, slug, display_name, active_flag, rank_order)
values
  ('10000000-0000-0000-0000-000000000001', 'echo', 'lo-fi', 'Lo-Fi', true, 1),
  ('10000000-0000-0000-0000-000000000002', 'echo', 'trap', 'Trap', true, 2),
  ('10000000-0000-0000-0000-000000000003', 'echo', 'electronic', 'Electronic', true, 3),
  ('10000000-0000-0000-0000-000000000004', 'echo', 'ambient', 'Ambient', true, 4),
  ('10000000-0000-0000-0000-000000000005', 'echo', 'dark', 'Dark', true, 5),
  ('10000000-0000-0000-0000-000000000006', 'echo', 'pop-ia', 'Pop IA', true, 6),
  ('10000000-0000-0000-0000-000000000007', 'echo', 'instrumental', 'Instrumental', true, 7),
  ('10000000-0000-0000-0000-000000000008', 'echo', 'experimental', 'Experimental', true, 8)
on conflict (slug) do nothing;
