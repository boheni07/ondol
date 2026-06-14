-- =====================================================================
-- 0001_auth_users_sync.sql
-- auth.users → public.users 동기화 트리거 (가정 A-2 확정 구현)
-- 근거: requirements FR-06 / NFR-S5, docs/02 §2.2(users), docs/13 §1(RLS 토대)
--
-- 결정: "DB 트리거(AFTER INSERT)" 채택.
--   - users.id = auth.users.id 일치를 DB 레벨에서 강제 → RLS auth.uid() 신뢰 기반(NFR-S5).
--   - 가입 폼 데이터(role/name/phone/org)는 signUp options.data 로
--     auth.users.raw_user_meta_data 에 실려오므로 트리거가 이를 읽어 채운다.
--   - SECURITY DEFINER 로 실행해 public.users 의 RLS 와 무관하게 시스템이 행을 생성.
-- =====================================================================

-- public.users 스키마 (docs/02 §2.2). 이미 존재하면 본 블록은 생략 가능.
create table if not exists public.users (
  id                uuid primary key references auth.users (id) on delete cascade,
  name              text not null,
  role              text not null,
  phone             text,
  organization      text,
  organization_type text,
  profile_photo_url text,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now()
);

-- user_role 값 무결성 (docs/02 §4 Enum 6값) — CHECK 제약으로 강제.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'users_role_check'
  ) then
    alter table public.users
      add constraint users_role_check
      check (role in (
        'guardian','person','supporter','teacher','social_worker','therapist'
      ));
  end if;
end $$;

-- 동기화 함수: auth.users INSERT 시 메타데이터로 public.users 행 생성.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, role, phone, organization, organization_type, is_active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'guardian'),
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'organization',
    new.raw_user_meta_data ->> 'organization_type',
    true
  )
  on conflict (id) do nothing;  -- 재시도/중복 INSERT 안전.
  return new;
end;
$$;

-- 트리거 등록 (재실행 안전).
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS 활성화 (정책 자체는 docs/13 §2에서 🟡 TBD — 본 마이그레이션은 행 생성 무결성까지만 책임).
alter table public.users enable row level security;

-- 본인 프로필 SELECT 최소 정책(로그인 후 role/is_active 조회 경로 보장).
-- docs/13 의 users SELECT/UPDATE 전체 정책 확정은 후속 분리 과제(NFR-S5 단서).
drop policy if exists users_select_self on public.users;
create policy users_select_self
  on public.users for select
  using (id = auth.uid());
