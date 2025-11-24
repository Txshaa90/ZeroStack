-- ZeroStack Database Schema for Supabase
-- Run this in your Supabase SQL Editor to create all tables

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- FOLDERS TABLE
-- ============================================
create table if not exists folders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text default '#10b981',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table folders enable row level security;

-- Policies for folders
create policy "Users can view their own folders"
  on folders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own folders"
  on folders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own folders"
  on folders for update
  using (auth.uid() = user_id);

create policy "Users can delete their own folders"
  on folders for delete
  using (auth.uid() = user_id);

-- Index for faster queries
create index if not exists folders_user_id_idx on folders(user_id);

-- ============================================
-- TABLES TABLE (Datasets)
-- ============================================
create table if not exists tables (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  folder_id uuid references folders(id) on delete set null,
  name text not null,
  columns jsonb default '[]'::jsonb not null,
  rows jsonb default '[]'::jsonb not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table tables enable row level security;

-- Policies for tables
create policy "Users can view their own tables"
  on tables for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tables"
  on tables for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tables"
  on tables for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tables"
  on tables for delete
  using (auth.uid() = user_id);

-- Indexes for faster queries
create index if not exists tables_user_id_idx on tables(user_id);
create index if not exists tables_folder_id_idx on tables(folder_id);
create index if not exists tables_name_idx on tables(name);
create index if not exists tables_created_at_idx on tables(created_at);

-- GIN indexes for JSONB columns
create index if not exists tables_columns_gin_idx on tables using gin(columns);
create index if not exists tables_rows_gin_idx on tables using gin(rows);

-- ============================================
-- VIEWS TABLE (Grid, Gallery, Form, etc.)
-- ============================================
create table if not exists views (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  table_id uuid references tables(id) on delete cascade not null,
  name text not null,
  type text not null check (type in ('grid', 'gallery', 'form', 'kanban', 'calendar')),
  filters jsonb default '[]'::jsonb not null,
  sorts jsonb default '[]'::jsonb not null,
  color_rules jsonb default '[]'::jsonb not null,
  visible_columns jsonb default '[]'::jsonb not null,
  group_by text,
  rows jsonb default '[]'::jsonb not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table views enable row level security;

-- Policies for views
create policy "Users can view their own views"
  on views for select
  using (auth.uid() = user_id);

create policy "Users can insert their own views"
  on views for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own views"
  on views for update
  using (auth.uid() = user_id);

create policy "Users can delete their own views"
  on views for delete
  using (auth.uid() = user_id);

-- Indexes for faster queries
create index if not exists views_user_id_idx on views(user_id);
create index if not exists views_table_id_idx on views(table_id);
create index if not exists views_name_idx on views(name);
create index if not exists views_type_idx on views(type);
create index if not exists views_created_at_idx on views(created_at);

-- GIN indexes for JSONB columns (for filtering within rows)
create index if not exists views_rows_gin_idx on views using gin(rows);
create index if not exists views_filters_gin_idx on views using gin(filters);
create index if not exists views_sorts_gin_idx on views using gin(sorts);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_folders_updated_at
  before update on folders
  for each row
  execute function update_updated_at_column();

create trigger update_tables_updated_at
  before update on tables
  for each row
  execute function update_updated_at_column();

create trigger update_views_updated_at
  before update on views
  for each row
  execute function update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment below to insert sample data for testing
-- Note: Replace 'YOUR_USER_ID' with an actual user ID from auth.users

/*
insert into folders (user_id, name, color) values
  ('YOUR_USER_ID', 'Projects', '#10b981'),
  ('YOUR_USER_ID', 'Clients', '#3b82f6');

insert into tables (user_id, folder_id, name, columns, rows) values
  ('YOUR_USER_ID', (select id from folders where name = 'Projects' limit 1), 'Website Redesign', 
   '[{"id":"c1","name":"Task","type":"text"},{"id":"c2","name":"Status","type":"select","options":["Todo","In Progress","Done"]}]',
   '[{"id":"r1","c1":"Design mockups","c2":"Done"},{"id":"r2","c1":"Develop frontend","c2":"In Progress"}]');
*/
