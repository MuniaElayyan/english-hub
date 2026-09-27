-- ═════════════════════════════════════════════════════════════
--  English Hub — cloud library (run ONCE in Supabase → SQL Editor)
--  Creates: table "library", public storage bucket "materials",
--  and the rules: everyone can read · only the signed-in teacher
--  can add or delete.
-- ═════════════════════════════════════════════════════════════

create table if not exists public.library (
  id          uuid primary key,
  kind        text not null check (kind in ('item', 'folder', 'grade')),
  folder_key  text not null,
  data        jsonb not null default '{}'::jsonb,
  file_path   text,
  thumb_path  text,
  created_at  timestamptz not null default now()
);
create index if not exists library_folder_idx on public.library (folder_key);

alter table public.library enable row level security;

drop policy if exists "library read"   on public.library;
drop policy if exists "library insert" on public.library;
drop policy if exists "library delete" on public.library;
create policy "library read"   on public.library for select using (true);
create policy "library insert" on public.library for insert to authenticated with check (true);
create policy "library delete" on public.library for delete to authenticated using (true);

-- Storage bucket (public = students can open the files without an account)
insert into storage.buckets (id, name, public)
values ('materials', 'materials', true)
on conflict (id) do update set public = true;

drop policy if exists "materials read"   on storage.objects;
drop policy if exists "materials insert" on storage.objects;
drop policy if exists "materials delete" on storage.objects;
create policy "materials read"   on storage.objects for select using (bucket_id = 'materials');
create policy "materials insert" on storage.objects for insert to authenticated with check (bucket_id = 'materials');
create policy "materials delete" on storage.objects for delete to authenticated using (bucket_id = 'materials');

-- IMPORTANT: in Authentication → Sign In / Providers → turn OFF "Allow new users to sign up",
-- then add the teacher by hand in Authentication → Users → "Add user".
-- Otherwise anyone could register and would count as "authenticated".
