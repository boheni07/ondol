# WBS (Work Breakdown Structure) — OnDol 플랫폼

> ⚠️ DEPRECATED — docs/08-wbs-v1.1.md로 이관(2026-06-14). 정본은 v1.1, 본 파일은 보존용.

> 버전: v1.0 | 작성일: 2026-06-13
> 분해 원칙: 기능의 최소 단위 (CRUD 각각 C/R-단건/R-목록/U/D 별도 작업)
> 추정 단위: XS(0.5d) · S(1d) · M(2~3d) · L(5d) · XL(7d+)
> 우선순위: P0(MVP 필수) · P1(MVP 권장) · P2(차기 릴리스)

---

## 작업량 요약

> 공수(일)는 XS=0.5·S=1·M=2.5·L=5·XL=7 환산 합계이며, 엑셀(08-wbs.xlsx)·Gantt와 동일 기준이다.

| 분류 | 작업 수 | 합계 공수 (person-day) |
|------|--------|---------------|
| 0. 프로젝트 셋업 | 12 | 10.5d |
| 1. DB 스키마 + RLS | 18 | 13d |
| 2. 인증 (Auth) | 11 | 15d |
| 3. 사용자·당사자·매핑 | 24 | 23d |
| 4. 권한 관리 | 18 | 25d |
| 5. 기록 (Records) | 56 | 95.5d |
| 6. 자기표현 (Self-Expression) | 8 | 9.5d |
| 7. 파일 첨부 (Files) | 9 | 10.5d |
| 8. 이정표·타임라인 | 14 | 13.5d |
| 9. 인수인계 (Handover) | 12 | 16d |
| 10. 알림 (Notification) | 14 | 16d |
| 11. 접근 로그 (Audit) | 8 | 12.5d |
| 12. 디자인 시스템 | 21 | 22d |
| 13. 웹 UI — 보호자 | 26 | 53d |
| 14. 웹 UI — 당사자 (접근성) | 10 | 19d |
| 15. 웹 UI — 전문가 4역할 | 41 | 100d |
| 16. 모바일 앱 (RN) | 33 | 83.5d |
| 17. SEO·보안·접근성 | 15 | 23d |
| 18. QA·테스트 | 17 | 48.5d |
| 19. CI/CD·배포 | 14 | 23d |
| **합계** | **381 작업** | **632 person-day** |

> 632 person-day는 전체(P0~P2) 합계다. 7인 병렬·Gantt 기준 캘린더 약 16주. MVP(P0)만 추리면 부록 B 참조(약 280d). 담당자별 부하는 09-wbs-github.md 참조.

---

## 범례

- 🟦 **C** = Create (신규 작성)
- 🟩 **R** = Read 단건 (상세 조회)
- 🟨 **L** = List (목록 조회 + 필터/검색/페이징)
- 🟧 **U** = Update (수정)
- 🟥 **D** = Delete / Archive (삭제 또는 보관)
- 🔀 **B** = Bulk / 일괄 처리
- 🔐 **P** = Permission Check (RLS / 권한 검증)

---

# 0. 프로젝트 셋업 (Phase 0)

| ID | 작업 | 산출물 | 공수 | 우선순위 | 의존성 | 세부사항 | 담당자 |
|----|------|-------|:---:|:------:|:----:| :-------- | :----: |
| 0.1 | Git 저장소 초기화 + .gitignore + README | 빈 저장소 | XS | P0 | — | 모노레포 Git 저장소 초기화. .gitignore(node_modules·.env·빌드 산출물·.expo), README에 서비스 개요·로컬 실행법·환경 구성 명시. 참고: CLAUDE.md(하네스 정의) | PL |
| 0.2 | 기술 스택 확정 문서 작성 | docs/10-tech-stack.md | S | P0 | — | 프론트(Next.js App Router)·모바일(Expo RN)·백엔드(Supabase/bkend.ai)·DB(PostgreSQL+RLS) 스택 확정 및 근거 문서화. 참고: docs/02-data-specification.md, docs/03-erd.md, docs/10-tech-stack.md | PL |
| 0.3 | Next.js (App Router) 프로젝트 부팅 | apps/web | S | P0 | 0.2 | apps/web 에 Next.js App Router 프로젝트 부팅(라우팅·서버컴포넌트 구조). 참고: docs/06-information-architecture.md §4 반응형 웹 IA | PL |
| 0.4 | React Native (Expo) 프로젝트 부팅 | apps/mobile | S | P0 | 0.2 | apps/mobile 에 Expo 기반 RN 앱 부팅(네비게이션 스택·탭). 참고: docs/06-information-architecture.md §5 모바일 앱 IA | PL |
| 0.5 | Supabase 프로젝트 생성 + 환경 변수 분리 | .env.{dev,stg,prod} | S | P0 | 0.2 | Supabase 프로젝트 생성 후 dev/stg/prod 3환경 분리(.env.dev/.stg/.prod). 키·URL 환경변수화. 참고: docs/03-erd.md §RLS 정책 요약 | PL |
| 0.6 | bkend.ai BaaS 연동 (또는 Supabase 직접) | lib/supabase.ts | S | P0 | 0.5 | bkend.ai BaaS(또는 Supabase 직접) 클라이언트 래퍼 구현 — 인증·DB·스토리지 SDK 초기화. 참고: docs/02-data-specification.md §1 테이블 목록, bkit:bkend-quickstart 스킬 | PL |
| 0.7 | TypeScript 컨벤션 + ESLint + Prettier | .eslint.json | XS | P0 | 0.3 | TypeScript strict + ESLint + Prettier 규칙 정립(AI 협업용 코딩 컨벤션). 참고: bkit:phase-2-convention 스킬 | PL |
| 0.8 | 폴더 구조 컨벤션 문서 | docs/structure.md | XS | P0 | 0.3 | 도메인 기반 폴더 구조(features/·lib/·components/·app/) 컨벤션 문서화. | PL |
| 0.9 | 모노레포 (pnpm workspaces) | pnpm-workspace.yaml | S | P1 | 0.3, 0.4 | pnpm workspaces 로 web·mobile·shared(타입·API 클라이언트·검증 스키마) 패키지 공유 구성. | PL |
| 0.10 | Vercel/Render 배포 환경 셋업 | deploy config | S | P1 | 0.3 | Vercel(웹)·EAS/Render(모바일·서버) 배포 환경 사전 셋업. 참고: docs/08-wbs.md §19 CI/CD | PL |
| 0.11 | 에러 모니터링 (Sentry) 연동 | sentry config | S | P1 | 0.3 | Sentry 연동 — 웹·모바일·서버 런타임 에러 트래킹 및 소스맵 업로드. | PL |
| 0.12 | i18n 셋업 (한국어 기본, 추후 영어) | i18n config | S | P2 | 0.3 | i18n 셋업(한국어 기본, 영어 차기 릴리스). 참고: docs/07-design-system.md §2 타이포그래피(Pretendard) | PL |

---

# 1. DB 스키마 + RLS (Phase 1)

## 1.1 마이그레이션 — 핵심 테이블

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 1.1.1 | `users` 테이블 생성 | 🟦 | migration | XS | P0 | users 테이블 — 모든 역할(보호자·당사자·전문가)의 계정. role enum·email·phone·status. 참고: docs/02-data-specification.md §2 핵심 테이블 상세(users), docs/03-erd.md | PL |
| 1.1.2 | `persons` 테이블 생성 | 🟦 | migration | XS | P0 | persons 테이블 — 기록의 주체인 당사자. birth_date·life_stage(생애주기)·emergency_info(JSONB). 참고: docs/02 §2(persons), §4 Enum(life_stage) | PL |
| 1.1.3 | `guardian_persons` 연결 테이블 | 🟦 | migration | XS | P0 | guardian_persons — 보호자↔당사자 N:M 매핑, is_primary(주보호자)·relationship. 참고: docs/02 §2(guardian_persons), docs/03-erd.md §도메인별 서브 ERD | PL |
| 1.1.4 | `person_accounts` 테이블 | 🟦 | migration | XS | P0 | person_accounts — 당사자 선택적 로그인 계정 + 접근성 설정(ui_mode·font_scale·contrast). 참고: docs/02 §2(person_accounts), docs/07 §9 당사자 접근성 모드 | PL |
| 1.1.5 | `permissions` 테이블 | 🟦 | migration | XS | P0 | permissions — 권한 매트릭스 핵심. domain·access_level·valid_from/until. 참고: docs/02 §2(permissions), §4 Enum(domain·access_level) | PL |
| 1.1.6 | `permission_logs` 테이블 | 🟦 | migration | XS | P0 | permission_logs — 권한 부여/수정/회수 이력(감사 추적). 참고: docs/02 §2(permission_logs), docs/05-workflows-feature.md §2·§3 | PL |
| 1.1.7 | `records` 테이블 (JSONB content) | 🟦 | migration | S | P0 | records — 6도메인 기록 공통 테이블. domain·record_type·content(JSONB)·is_draft·is_milestone. 참고: docs/02 §2(records), §3 JSONB content 스키마 | PL |
| 1.1.8 | `self_expressions` 테이블 | 🟦 | migration | XS | P0 | self_expressions — 당사자 자기표현(날짜별 UNIQUE). mood·activities·content(JSONB). 참고: docs/02 §2(self_expressions), §3 JSONB | PL |
| 1.1.9 | `record_files` 테이블 | 🟦 | migration | XS | P0 | record_files — 기록·자기표현 첨부 파일 메타. storage_path·is_sensitive·mime. 참고: docs/02 §2(record_files), docs/05 §5 파일 첨부 | PL |
| 1.1.10 | `life_milestones` 테이블 | 🟦 | migration | XS | P0 | life_milestones — 생애주기 이정표(진단·입학·졸업 등). category·event_date. 참고: docs/02 §2(life_milestones), docs/05 §6 타임라인 | PL |
| 1.1.11 | `handovers` 테이블 | 🟦 | migration | XS | P0 | handovers — 전문가 인수인계. domain·summary·linked_record_ids·is_confirmed. 참고: docs/02 §2(handovers), docs/05 §7 인수인계 | PL |
| 1.1.12 | `access_logs` 테이블 (INSERT-only) | 🟦 | migration | XS | P0 | access_logs — INSERT-only 접근 로그(불변). actor·action·target. 참고: docs/02 §2(access_logs), docs/03 §RLS 정책 요약 | PL |
| 1.1.13 | `notifications` 테이블 | 🟦 | migration | XS | P0 | notifications — 알림. type·payload(JSONB)·self_expression_id FK·is_read. 참고: docs/02 §2(notifications), §3 JSONB, docs/05 §8 알림 | PL |

## 1.2 RLS 정책

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 1.2.1 | `records` SELECT RLS (보호자/당사자/권한자) | 🔐 | RLS policy | M | P0 | records SELECT RLS — 보호자(매핑)·당사자 본인·권한자(permissions 유효기간 내)만 조회. 참고: docs/03 §RLS 정책 요약, docs/02 §6 제약조건 | PL |
| 1.2.2 | `records` INSERT/UPDATE RLS | 🔐 | RLS policy | S | P0 | records INSERT/UPDATE RLS — 도메인·access_level(write 이상) 검증. 참고: docs/03 §RLS, docs/05 §4 기록 작성 공통 | PL |
| 1.2.3 | `self_expressions` 당사자 본인만 작성 | 🔐 | RLS policy | S | P0 | self_expressions RLS — 당사자 본인 계정만 작성/수정(당일). 참고: docs/03 §RLS, docs/04-workflows-user.md §2 당사자 | PL |
| 1.2.4 | `access_logs` INSERT-only 정책 | 🔐 | RLS policy | XS | P0 | access_logs INSERT-only 정책 — UPDATE/DELETE 차단으로 로그 불변성 보장. 참고: docs/03 §RLS, docs/08-wbs.md §17.2.8 | PL |
| 1.2.5 | `permissions` 보호자만 변경 가능 | 🔐 | RLS policy | S | P0 | permissions 변경 RLS — 주보호자만 권한 부여/회수 가능. 참고: docs/03 §RLS, docs/05 §2 권한 부여 | PL |

---

# 2. 인증 (Auth)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 2.1 | 이메일/비밀번호 회원가입 API | 🟦 | POST /signup | S | P0 | 이메일/비밀번호 회원가입. role 선택 분기(보호자·당사자·전문가). users insert + 이메일 인증 트리거. 참고: docs/05 §1 회원가입 & 역할별 온보딩, wireframes/web/11-signup-role.svg·12-signup-profile.svg | 개발자 A |
| 2.2 | 이메일/비밀번호 로그인 API | 🟦 | POST /login | S | P0 | 이메일/비밀번호 로그인 + JWT 발급·세션. 참고: docs/04 §7 역할별 진입점 비교, wireframes/web/01-login.svg, bkit:bkend-auth 스킬 | 개발자 A |
| 2.3 | 로그아웃 API | 🟥 | POST /logout | XS | P0 | 로그아웃 — 세션/토큰 무효화. 참고: bkit:bkend-auth 스킬 | 개발자 A |
| 2.4 | 이메일 인증 발송 API | 🟦 | POST /verify-email | S | P0 | 이메일 인증 메일 발송(토큰 생성·만료). 참고: docs/05 §1, wireframes/web/13-signup-verify.svg | 개발자 A |
| 2.5 | 이메일 인증 확인 API | 🟧 | POST /verify-email/confirm | S | P0 | 이메일 인증 토큰 확인 + users.status 활성화. 참고: docs/05 §1 온보딩, wireframes/web/13-signup-verify.svg | 개발자 A |
| 2.6 | 비밀번호 재설정 요청 API | 🟦 | POST /reset-password | S | P0 | 비밀번호 재설정 요청(재설정 토큰 메일). 참고: wireframes/web/15-reset-password.svg | 개발자 A |
| 2.7 | 비밀번호 재설정 확인 API | 🟧 | POST /reset-password/confirm | S | P0 | 비밀번호 재설정 확인 + 해시 갱신. 참고: wireframes/web/15-reset-password.svg | 개발자 A |
| 2.8 | 초대 링크 생성 API | 🟦 | POST /invites | S | P0 | 초대 링크 생성 — 보호자가 전문가/공동보호자 초대(토큰·도메인·만료). 참고: docs/05 §1 온보딩·§2 권한 부여 | 개발자 A |
| 2.9 | 초대 링크 수락 API (회원가입 분기) | 🟦 | POST /invites/:token/accept | M | P0 | 초대 링크 수락 — 토큰 검증 후 신규 가입 또는 기존 계정 연결 분기 + 권한 자동 매핑. 참고: docs/05 §1, wireframes/web/14-invite-accept.svg | 개발자 A |
| 2.10 | 카카오 소셜 로그인 OAuth | 🟦 | POST /auth/kakao | M | P1 | 카카오 OAuth 소셜 로그인(P1). 참고: docs/04 §7 진입점, bkit:bkend-auth 스킬 | 개발자 A |
| 2.11 | 네이버 소셜 로그인 OAuth | 🟦 | POST /auth/naver | M | P1 | 네이버 OAuth 소셜 로그인(P1). 참고: docs/04 §7 진입점, bkit:bkend-auth 스킬 | 개발자 A |

---

# 3. 사용자 · 당사자 · 매핑

## 3.1 사용자 (users)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 3.1.1 | 사용자 프로필 단건 조회 | 🟩 | GET /users/:id | XS | P0 | 사용자 본인/타 사용자 프로필 단건 조회(권한 범위 내). 참고: docs/02 §2(users) | 개발자 A |
| 3.1.2 | 사용자 프로필 수정 | 🟧 | PATCH /users/:id | S | P0 | 사용자 프로필 수정(이름·연락처·프로필 사진). 참고: wireframes/web/24-guardian-profile-edit.svg | 개발자 A |
| 3.1.3 | 사용자 비활성화 (soft delete) | 🟥 | PATCH /users/:id/deactivate | XS | P0 | 사용자 soft delete(status=inactive) — 데이터 보존, 로그인 차단. 참고: docs/02 §4 Enum(user status) | 개발자 A |
| 3.1.4 | 사용자 검색 (이메일·전화) | 🟨 | GET /users?q= | S | P0 | 이메일·전화번호로 사용자 검색(초대·권한 부여 시). 참고: docs/05 §2 권한 부여 Step1 | 개발자 A |
| 3.1.5 | 역할 기반 사용자 필터 | 🟨 | GET /users?role= | XS | P1 | 역할 기반 사용자 필터(전문가 유형별 등, P1). | 개발자 A |

## 3.2 당사자 (persons)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 3.2.1 | 당사자 신규 등록 API | 🟦 | POST /persons | M | P0 | 당사자 신규 등록 — 기본정보·생애주기·응급정보 입력 + guardian_persons 자동 연결. 참고: docs/02 §2(persons), docs/04 §1 보호자, wireframes/web/17-guardian-person-register.svg | 개발자 A |
| 3.2.2 | 당사자 단건 조회 | 🟩 | GET /persons/:id | S | P0 | 당사자 상세 조회(프로필·요약). 참고: wireframes/web/16-guardian-person-profile.svg | 개발자 A |
| 3.2.3 | 당사자 목록 조회 (보호자 기준) | 🟨 | GET /persons?guardian= | S | P0 | 보호자 기준 담당 당사자 목록(대시보드 진입점). 참고: docs/04 §1 보호자, wireframes/web/02-guardian-dashboard.svg | 개발자 A |
| 3.2.4 | 당사자 기본정보 수정 | 🟧 | PATCH /persons/:id | S | P0 | 당사자 기본정보 수정. 참고: wireframes/web/25-guardian-person-edit.svg | 개발자 A |
| 3.2.5 | 당사자 응급정보 수정 (별도 권한) | 🟧 | PATCH /persons/:id/emergency | M | P0 | 당사자 응급정보(혈액형·알레르기·복약·비상연락) 수정 — 추가 인증 필요. 참고: docs/02 §3 JSONB(emergency), docs/08-wbs.md §17.2.5, wireframes/web/26-guardian-emergency-edit.svg | 개발자 A |
| 3.2.6 | 당사자 사진 업로드 | 🟦 | POST /persons/:id/photo | S | P0 | 당사자 프로필 사진 업로드(presigned URL). 참고: docs/05 §5 파일 첨부 | 개발자 A |
| 3.2.7 | 당사자 사진 삭제 | 🟥 | DELETE /persons/:id/photo | XS | P0 | 당사자 프로필 사진 삭제(storage+meta). | 개발자 A |
| 3.2.8 | 당사자 비활성화 (이장) | 🟥 | PATCH /persons/:id/archive | S | P1 | 당사자 비활성화/이장(archive) — 사망·이전 등(P1). 참고: docs/05 §10 당사자 전환기 처리 | 개발자 A |
| 3.2.9 | 당사자 생애주기 자동 계산 (트리거) | 🟧 | DB trigger | S | P0 | birth_date 기반 life_stage 자동 계산 DB 트리거(영유아~노년 6단계). 참고: docs/01-record-matrix.md, docs/02 §4 Enum(life_stage) | 개발자 A |

## 3.3 보호자-당사자 매핑 (guardian_persons)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 3.3.1 | 보호자-당사자 연결 생성 | 🟦 | POST /guardian-persons | S | P0 | 보호자-당사자 연결 생성(관계·주보호자 여부). 참고: docs/02 §2(guardian_persons) | 개발자 A |
| 3.3.2 | 보호자-당사자 단건 조회 | 🟩 | GET /guardian-persons/:id | XS | P0 | 보호자-당사자 매핑 단건 조회. | 개발자 A |
| 3.3.3 | 당사자별 보호자 목록 | 🟨 | GET /persons/:id/guardians | S | P0 | 당사자별 보호자 목록(공동 양육 지원). 참고: docs/03 §도메인별 서브 ERD | 개발자 A |
| 3.3.4 | 주보호자 변경 | 🟧 | PATCH /guardian-persons/:id/primary | S | P0 | 주보호자(is_primary) 변경 — 단일 주보호자 제약. 참고: docs/02 §6 제약조건 | 개발자 A |
| 3.3.5 | 관계(부/모/후견인) 수정 | 🟧 | PATCH /guardian-persons/:id | XS | P0 | 관계(부/모/후견인 등) 수정. 참고: docs/02 §4 Enum(relationship) | 개발자 A |
| 3.3.6 | 보호자 연결 해제 | 🟥 | DELETE /guardian-persons/:id | S | P1 | 보호자 연결 해제(P1). | 개발자 A |

## 3.4 당사자 계정 (person_accounts)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 3.4.1 | 당사자 계정 생성 (선택적) | 🟦 | POST /person-accounts | S | P0 | 당사자 선택적 로그인 계정 생성(자기표현·내 기록용). 참고: docs/02 §2(person_accounts), docs/04 §2 당사자 | 개발자 A |
| 3.4.2 | 접근성 설정 조회 | 🟩 | GET /person-accounts/:id | XS | P0 | 당사자 접근성 설정 조회. 참고: wireframes/web/33-person-profile.svg | 개발자 A |
| 3.4.3 | 접근성 설정 수정 | 🟧 | PATCH /person-accounts/:id | S | P0 | 접근성 설정 수정(글씨 크기·고대비·TTS). 참고: docs/07 §9 당사자 접근성 모드, wireframes/web/32-person-accessibility.svg | 개발자 A |
| 3.4.4 | UI 모드 (아이콘/혼합) 변경 | 🟧 | PATCH /person-accounts/:id/ui-mode | XS | P0 | UI 모드(아이콘 전용/혼합) 전환. 참고: docs/07 §9, docs/06 §1 스크린 유형 | 개발자 A |

---

# 4. 권한 관리 (Permission Matrix)

## 4.1 권한 CRUD

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 4.1.1 | 권한 부여 API (도메인·수준·기간) | 🟦 | POST /permissions | M | P0 | 권한 부여 — 권한자·도메인(멀티)·수준(read/write/edit, admin은 주보호자 전용·위임 불가)·기간 UPSERT. 참고: docs/02 §2(permissions)·§4 Enum(access_level), docs/05 §2 권한 부여 | 개발자 A |
| 4.1.2 | 권한 단건 조회 | 🟩 | GET /permissions/:id | XS | P0 | 권한 단건 조회. | 개발자 A |
| 4.1.3 | 당사자별 권한 매트릭스 조회 | 🟨 | GET /persons/:id/permissions | M | P0 | 당사자별 권한 매트릭스(이해관계자×도메인 그리드). 참고: docs/05 §2, wireframes/web/07-permission-matrix.svg | 개발자 A |
| 4.1.4 | 사용자별 받은 권한 목록 | 🟨 | GET /users/:id/permissions | S | P0 | 사용자(전문가)별 받은 권한 목록. 참고: wireframes/web/20-guardian-stakeholder-detail.svg | 개발자 A |
| 4.1.5 | 권한 수정 (수준/기간 변경) | 🟧 | PATCH /permissions/:id | S | P0 | 권한 수정(수준·기간 변경) + permission_logs 기록. 참고: wireframes/web/28-guardian-permission-modals.svg | 개발자 A |
| 4.1.6 | 권한 회수 (즉시) | 🟥 | DELETE /permissions/:id | S | P0 | 권한 즉시 회수 + 캐시 무효화 + 알림. 참고: docs/05 §3 권한 회수 프로세스, wireframes/web/28-guardian-permission-modals.svg | 개발자 A |
| 4.1.7 | 기간 만료 자동 회수 (cron) | 🟧 | scheduled fn | M | P0 | valid_until 만료 권한 자동 회수 cron(scheduled fn). 참고: docs/05 §3 권한 회수 | 개발자 A |
| 4.1.8 | 만료 7일 전 알림 (cron) | 🟧 | scheduled fn | S | P1 | 권한 만료 7일 전 사전 알림 cron(P1). 참고: docs/05 §8 알림 | 개발자 A |

## 4.2 권한 위자드 플로우 (4 step)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 4.2.1 | Step1 — 대상자 검색·초대 | 🟨 | UI step | S | P0 | 권한 위자드 Step1 — 대상자 검색 또는 이메일 초대. 참고: docs/06 §6 주요 플로우(권한 부여), wireframes/web/21-guardian-grant-wizard.svg | 개발자 A |
| 4.2.2 | Step2 — 분야 선택 (멀티) | 🟦 | UI step | S | P0 | Step2 — 6개 도메인 멀티 선택. 참고: wireframes/web/21-guardian-grant-wizard.svg | 개발자 A |
| 4.2.3 | Step3 — 수준·기간 설정 | 🟦 | UI step | S | P0 | Step3 — 도메인별 접근 수준·유효 기간 설정. 참고: wireframes/web/21-guardian-grant-wizard.svg | 개발자 A |
| 4.2.4 | Step4 — 미리보기·UPSERT | 🟦 | UI step | M | P0 | Step4 — 미리보기 후 permissions UPSERT + 알림 발송. 참고: docs/05 §2, wireframes/web/21-guardian-grant-wizard.svg | 개발자 A |

## 4.3 권한 변경 이력 (permission_logs)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 4.3.1 | 권한 변경 시 자동 로그 (트리거) | 🟦 | DB trigger | S | P0 | permissions 변경 시 permission_logs 자동 기록 트리거. 참고: docs/02 §2(permission_logs) | 개발자 A |
| 4.3.2 | 당사자별 권한 이력 조회 | 🟨 | GET /persons/:id/permission-logs | S | P0 | 당사자별 권한 변경 이력 조회. 참고: docs/05 §9 접근 로그 | 개발자 A |
| 4.3.3 | 사용자별 권한 변동 이력 | 🟨 | GET /users/:id/permission-logs | S | P0 | 사용자별 권한 변동 이력 조회. | 개발자 A |

## 4.4 RLS 권한 검증

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 4.4.1 | 권한 외 접근 시도 감지 (트리거) | 🔐 | DB trigger | M | P0 | 권한 외 리소스 접근 시도 감지 트리거(RLS 위반 로깅). 참고: docs/03 §RLS, docs/05 §11 시스템 보안 흐름 | 개발자 A |
| 4.4.2 | 이상 접근 알림 발송 | 🔐 | notification fn | S | P0 | 이상 접근 감지 시 보호자 알림 발송. 참고: docs/05 §8·§11 | 개발자 A |
| 4.4.3 | 권한 캐시 무효화 | 🔐 | redis invalidator | S | P1 | 권한 변경 시 Redis 권한 캐시 무효화(P1). | 개발자 A |

---

# 5. 기록 관리 (Records — 6 도메인 × N 유형)

## 5.0 기록 공통 CRUD

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 5.0.1 | 기록 생성 API (도메인 무관) | 🟦 | POST /records | M | P0 | 도메인 무관 기록 생성 API — content(JSONB)는 record_type별 스키마 검증. 참고: docs/02 §3 JSONB content 스키마, docs/05 §4 기록 작성 공통, wireframes/web/06-record-form.svg | 개발자 B |
| 5.0.2 | 기록 단건 조회 | 🟩 | GET /records/:id | S | P0 | 기록 단건 조회(권한 검증). 참고: wireframes/web/05-record-detail.svg | 개발자 B |
| 5.0.3 | 당사자별 기록 목록 (페이징·필터) | 🟨 | GET /persons/:id/records | M | P0 | 당사자별 전체 기록 목록(페이징·필터·정렬). 참고: docs/02 §5 인덱스 전략, wireframes/web/04-record-list.svg | 개발자 B |
| 5.0.4 | 분야별 기록 목록 | 🟨 | GET /persons/:id/records?domain= | S | P0 | 도메인별 기록 목록. 참고: wireframes/web/18-guardian-records-domain.svg | 개발자 B |
| 5.0.5 | 기록 수정 | 🟧 | PATCH /records/:id | S | P0 | 기록 수정(작성자/권한자). 참고: wireframes/web/19-guardian-record-edit.svg | 개발자 B |
| 5.0.6 | 기록 삭제 (보호자 권한) | 🟥 | DELETE /records/:id | S | P0 | 기록 삭제(보호자 권한). 참고: docs/03 §RLS | 개발자 B |
| 5.0.7 | 기록 임시저장 (is_draft) | 🟧 | PATCH /records/:id/draft | S | P0 | 기록 임시저장(is_draft) — 위자드 중간 저장. 참고: docs/05 §4 기록 작성 공통 | 개발자 B |
| 5.0.8 | 기록 이정표 표시 | 🟧 | PATCH /records/:id/milestone | XS | P0 | 기록을 이정표(is_milestone)로 표시 → 타임라인 강조. 참고: docs/05 §6 타임라인 | 개발자 B |
| 5.0.9 | 기록 고정/해제 | 🟧 | PATCH /records/:id/pin | XS | P0 | 기록 고정/해제(상단 핀). 참고: docs/02 §2(records) | 개발자 B |
| 5.0.10 | 기록 태그 추가/제거 | 🟧 | PATCH /records/:id/tags | S | P1 | 기록 태그 추가/제거(P1). | 개발자 B |
| 5.0.11 | 기록 검색 (전문 검색) | 🟨 | GET /records?q= | M | P1 | 전문 검색(content 텍스트, P1). 참고: docs/02 §5 인덱스 전략(GIN) | 개발자 B |
| 5.0.12 | 기록 일괄 내보내기 (PDF/CSV) | 🔀 | POST /records/export | M | P1 | 기록 일괄 PDF/CSV 내보내기(P1). 참고: docs/05 §6 타임라인 PDF | 개발자 B |
| 5.0.13 | 기록 작성자별 카운트 | 🟨 | GET /records/stats?by=author | S | P2 | 작성자별 기록 통계 카운트(P2). | 개발자 B |

## 5.A 의료 기록 (MED-001 ~ MED-010)

| ID | 기록 유형 | C | R | L | U | D | 공수 | P | 세부사항 | 담당자 |
|----|---------|:-:|:-:|:-:|:-:|:-:|:---:|:-:| :-------- | :----: |
| 5.A.1 | MED-001 초기 진단 요약 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | MED-001 초기 진단 요약(보호자 작성). content JSONB: 진단명·진단일·기관. 참고: docs/01-record-matrix.md §1 영유아기, docs/02 §3 JSONB(MED-001) | 개발자 B |
| 5.A.2 | MED-002 발달 검사 결과 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | MED-002 발달 검사 결과(보호자). 검사도구·점수·해석. 참고: docs/01 §1·§2, docs/02 §3 JSONB(MED-002) | 개발자 B |
| 5.A.3 | MED-003 복약 기록 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | MED-003 복약 기록(보호자). 약물·용량·주기·부작용. 참고: docs/02 §3 JSONB(MED-003) | 개발자 B |
| 5.A.4 | MED-004 응급 대응 정보 (보호자 · 핀고정) | 🟦 | 🟩 | 🟨 | 🟧 | — | S | P0 | MED-004 응급 대응 정보(보호자·핀고정·삭제불가). 발작·알레르기·대처. 참고: docs/02 §3 JSONB(MED-004), docs/08-wbs.md §17.2.5 | 개발자 B |
| 5.A.5 | MED-005 치료계획서 (치료사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | MED-005 치료계획서(치료사). 목표·회기 계획·평가지표. 참고: docs/01 §2·§3, docs/02 §3 JSONB(MED-005), wireframes/web/59-therapist-plan.svg | 개발자 B |
| 5.A.6 | MED-006 치료 회기 일지 (치료사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | MED-006 치료 회기 일지(치료사). 회기 활동·반응·과제. 참고: docs/02 §3 JSONB(MED-006), wireframes/web/60-therapist-session-form.svg | 개발자 B |
| 5.A.7 | MED-007 치료 평가 보고서 (치료사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | MED-007 치료 평가 보고서(치료사). 기간 성과·재평가. 참고: docs/02 §3 JSONB(MED-007), wireframes/web/61-therapist-evaluation.svg | 개발자 B |
| 5.A.8 | MED-008 정기 검진 요약 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | MED-008 정기 검진 요약(보호자). 참고: docs/02 §3 JSONB(MED-008) | 개발자 B |
| 5.A.9 | MED-009 치료 종결 평가 (치료사) | 🟦 | 🟩 | 🟨 | 🟧 | — | S | P1 | MED-009 치료 종결 평가(치료사·삭제불가, P1). 참고: docs/02 §3 JSONB(MED-009) | 개발자 B |
| 5.A.10 | MED-010 만성질환 관리 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P1 | MED-010 만성질환 관리(보호자, P1·중장년). 참고: docs/01 §6 중장년/노년기, docs/02 §3 JSONB(MED-010) | 개발자 B |

## 5.B 교육 기록 (EDU-001 ~ EDU-009)

| ID | 기록 유형 | C | R | L | U | D | 공수 | P | 세부사항 | 담당자 |
|----|---------|:-:|:-:|:-:|:-:|:-:|:---:|:-:| :-------- | :----: |
| 5.B.1 | EDU-001 IEP (특수교사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | L | P0 | EDU-001 IEP 개별화교육계획(특수교사·최대 공수). 현행수준·연간/단기목표·평가. 참고: docs/01 §2 아동기, docs/02 §3 JSONB(EDU-001), wireframes/web/45-teacher-iep-form.svg | 개발자 B |
| 5.B.2 | EDU-002 유아 특수교육 관찰 (교사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P1 | EDU-002 유아 특수교육 관찰(교사, P1·영유아). 참고: docs/01 §1, docs/02 §3 JSONB(EDU-002) | 개발자 B |
| 5.B.3 | EDU-003 IEP 중간 점검 (교사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | EDU-003 IEP 중간 점검(교사). 목표 달성도 평가. 참고: docs/02 §3 JSONB(EDU-003), wireframes/web/46-teacher-iep-review.svg | 개발자 B |
| 5.B.4 | EDU-004 학교생활 관찰 (교사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | EDU-004 학교생활 관찰(교사). 참고: docs/02 §3 JSONB(EDU-004), wireframes/web/47-teacher-observation.svg | 개발자 B |
| 5.B.5 | EDU-005 통합교육 참여 (교사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P1 | EDU-005 통합교육 참여(교사, P1). 참고: docs/02 §3 JSONB(EDU-005) | 개발자 B |
| 5.B.6 | EDU-006 학교 치료지원 (교사+치료사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P1 | EDU-006 학교 치료지원(교사+치료사, P1). 참고: docs/02 §3 JSONB(EDU-006) | 개발자 B |
| 5.B.7 | EDU-007 전환교육 계획 (교사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | EDU-007 전환교육 계획(교사·청소년). 진로·자립 준비. 참고: docs/01 §3 청소년기, docs/02 §3 JSONB(EDU-007), wireframes/web/48-teacher-transition.svg | 개발자 B |
| 5.B.8 | EDU-008 직업교육 참여 (교사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P1 | EDU-008 직업교육 참여(교사, P1). 참고: docs/02 §3 JSONB(EDU-008) | 개발자 B |
| 5.B.9 | EDU-009 졸업/수료 (교사) | 🟦 | 🟩 | 🟨 | 🟧 | — | S | P0 | EDU-009 졸업/수료(교사·삭제불가). 참고: docs/02 §3 JSONB(EDU-009) | 개발자 B |

## 5.C 복지 기록 (WEL-001 ~ WEL-007)

| ID | 기록 유형 | C | R | L | U | D | 공수 | P | 세부사항 | 담당자 |
|----|---------|:-:|:-:|:-:|:-:|:-:|:---:|:-:| :-------- | :----: |
| 5.C.1 | WEL-001 장애 등록 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | — | S | P0 | WEL-001 장애 등록(보호자·삭제불가). 장애유형·정도·등록일. 참고: docs/01 §1, docs/02 §3 JSONB(WEL-001) | 개발자 B |
| 5.C.2 | WEL-002 초기 복지 연계 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | WEL-002 초기 복지 연계(복지사). 참고: docs/02 §3 JSONB(WEL-002) | 개발자 B |
| 5.C.3 | WEL-003 활동지원 계획서 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | WEL-003 활동지원 계획서(복지사). 참고: docs/02 §3 JSONB(WEL-003) | 개발자 B |
| 5.C.4 | WEL-004 ISP (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | L | P0 | WEL-004 ISP 개별지원계획(복지사·최대 공수). 욕구·목표·서비스 매핑. 참고: docs/01 §5 성인기, docs/02 §3 JSONB(WEL-004), wireframes/web/53-worker-isp-form.svg | 개발자 B |
| 5.C.5 | WEL-005 ISP 중간 점검 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | WEL-005 ISP 중간 점검(복지사). 참고: docs/02 §3 JSONB(WEL-005), wireframes/web/52-worker-isp.svg | 개발자 B |
| 5.C.6 | WEL-006 서비스 이용 현황 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | WEL-006 서비스 이용 현황(복지사·매트릭스). 참고: docs/02 §3 JSONB(WEL-006), wireframes/web/55-worker-service-matrix.svg | 개발자 B |
| 5.C.7 | WEL-007 노인복지 연계 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P2 | WEL-007 노인복지 연계(복지사, P2·노년). 참고: docs/01 §6, docs/02 §3 JSONB(WEL-007) | 개발자 B |

## 5.D 일상/돌봄 기록 (DAI-001 ~ DAI-005)

| ID | 기록 유형 | C | R | L | U | D | 공수 | P | 세부사항 | 담당자 |
|----|---------|:-:|:-:|:-:|:-:|:-:|:---:|:-:| :-------- | :----: |
| 5.D.1 | DAI-001 영유아 돌봄 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P1 | DAI-001 영유아 돌봄(보호자, P1). 참고: docs/01 §1, docs/02 §3 JSONB(DAI-001) | 개발자 B |
| 5.D.2 | DAI-002 활동지원 일지 (지원사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | DAI-002 활동지원 일지(활동지원사·핵심). 활동·식사·특이사항. 참고: docs/04 §3 활동지원사, docs/02 §3 JSONB(DAI-002), wireframes/web/38-supporter-journal-form.svg | 개발자 B |
| 5.D.3 | DAI-003 행동 관찰 (지원사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | DAI-003 행동 관찰(지원사). 참고: docs/02 §3 JSONB(DAI-003) | 개발자 B |
| 5.D.4 | DAI-004 식이 기록 (지원사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P1 | DAI-004 식이 기록(지원사, P1). 참고: docs/02 §3 JSONB(DAI-004) | 개발자 B |
| 5.D.5 | DAI-005 수면 기록 (지원사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P1 | DAI-005 수면 기록(지원사, P1). 참고: docs/02 §3 JSONB(DAI-005) | 개발자 B |

## 5.E 전환/자립 기록 (TRA-001 ~ TRA-007)

| ID | 기록 유형 | C | R | L | U | D | 공수 | P | 세부사항 | 담당자 |
|----|---------|:-:|:-:|:-:|:-:|:-:|:---:|:-:| :-------- | :----: |
| 5.E.1 | TRA-001 전환계획서 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | L | P0 | TRA-001 전환계획서(복지사·성인전환기). 교육→자립 종합 계획. 참고: docs/01 §4 성인전환기, docs/02 §3 JSONB(TRA-001), wireframes/web/54-worker-transition.svg | 개발자 B |
| 5.E.2 | TRA-002 직업 역량 평가 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | TRA-002 직업 역량 평가(복지사). 참고: docs/02 §3 JSONB(TRA-002) | 개발자 B |
| 5.E.3 | TRA-003 직업훈련/취업 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | TRA-003 직업훈련/취업(복지사). 참고: docs/02 §3 JSONB(TRA-003) | 개발자 B |
| 5.E.4 | TRA-004 자립생활 계획 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P1 | TRA-004 자립생활 계획(복지사, P1). 참고: docs/02 §3 JSONB(TRA-004) | 개발자 B |
| 5.E.5 | TRA-005 자립생활 경과 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P1 | TRA-005 자립생활 경과(복지사, P1). 참고: docs/02 §3 JSONB(TRA-005) | 개발자 B |
| 5.E.6 | TRA-006 의사결정 지원 (복지사+당사자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P1 | TRA-006 의사결정 지원(복지사+당사자, P1). 참고: docs/01 §5, docs/02 §3 JSONB(TRA-006) | 개발자 B |
| 5.E.7 | TRA-007 돌봄 전환 계획 (복지사+보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P2 | TRA-007 돌봄 전환 계획(복지사+보호자, P2·노년 대비). 참고: docs/01 §6, docs/02 §3 JSONB(TRA-007) | 개발자 B |

## 5.F 법적/행정 기록 (LEG-001 ~ LEG-005)

| ID | 기록 유형 | C | R | L | U | D | 공수 | P | 세부사항 | 담당자 |
|----|---------|:-:|:-:|:-:|:-:|:-:|:---:|:-:| :-------- | :----: |
| 5.F.1 | LEG-001 장애인 증명서 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | LEG-001 장애인 증명서(보호자). 참고: docs/02 §3 JSONB(LEG-001) | 개발자 B |
| 5.F.2 | LEG-002 수급 기록 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | LEG-002 수급 기록(보호자). 참고: docs/02 §3 JSONB(LEG-002) | 개발자 B |
| 5.F.3 | LEG-003 후견 문서 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | LEG-003 후견 문서(보호자). 후견 유형·범위·기간. 참고: docs/01 §4·§5, docs/02 §3 JSONB(LEG-003) | 개발자 B |
| 5.F.4 | LEG-004 의사결정 지원 계약 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P1 | LEG-004 의사결정 지원 계약(보호자, P1). 참고: docs/02 §3 JSONB(LEG-004) | 개발자 B |
| 5.F.5 | LEG-005 노후 돌봄 문서 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P2 | LEG-005 노후 돌봄 문서(보호자, P2). 참고: docs/01 §6, docs/02 §3 JSONB(LEG-005) | 개발자 B |

---

# 6. 자기표현 (Self-Expression)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 6.1 | 자기표현 입력 API (Flow-1 5스텝) | 🟦 | POST /self-expressions | M | P0 | 당사자 자기표현 입력 5스텝(기분·활동·사진·메모). 날짜별 1건. 참고: docs/06 §6 Flow-1 자기표현, docs/04 §2 당사자, docs/02 §3 JSONB(self_expression), wireframes/web/09-self-expression.svg | 개발자 B |
| 6.2 | 자기표현 단건 조회 (날짜별 UNIQUE) | 🟩 | GET /self-expressions/:date | S | P0 | 특정 날짜 자기표현 단건 조회(오늘 기록 홈). 참고: wireframes/web/08-person-home.svg | 개발자 B |
| 6.3 | 자기표현 목록 (월·주 단위) | 🟨 | GET /self-expressions?month= | S | P0 | 월·주 단위 자기표현 목록(캘린더/리스트). 참고: docs/02 §5 인덱스(date) | 개발자 B |
| 6.4 | 자기표현 수정 (당일만) | 🟧 | PATCH /self-expressions/:id | S | P0 | 자기표현 수정(작성 당일만 허용). 참고: docs/03 §RLS(self_expressions) | 개발자 B |
| 6.5 | 자기표현 사진 업로드 | 🟦 | POST /self-expressions/:id/photo | S | P0 | 자기표현 사진 업로드(presigned URL). 참고: docs/05 §5 파일 첨부 | 개발자 B |
| 6.6 | 자기표현 음성 메모 업로드 | 🟦 | POST /self-expressions/:id/voice | S | P1 | 자기표현 음성 메모 업로드(P1). 참고: docs/08-wbs.md §16.6.3 | 개발자 B |
| 6.7 | 자기표현 보호자 요약 발송 | 🟦 | notification fn | S | P0 | 자기표현 작성 시 보호자 요약 알림 발송. 참고: docs/05 §8 알림, notifications.self_expression_id FK | 개발자 B |
| 6.8 | 자기표현 통계 (연속 일수 등) | 🟨 | GET /self-expressions/stats | S | P1 | 연속 입력 일수 등 자기표현 통계(P1). | 개발자 B |

---

# 7. 파일 첨부 (Record Files)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 7.1 | Presigned URL 발급 | 🟦 | POST /files/presign | S | P0 | Presigned URL 발급(업로드용). 참고: docs/05 §5 파일 첨부 프로세스, bkit:bkend-storage 스킬 | 개발자 B |
| 7.2 | 파일 메타데이터 등록 | 🟦 | POST /files | S | P0 | 업로드 완료 후 record_files 메타데이터 등록. 참고: docs/02 §2(record_files) | 개발자 B |
| 7.3 | 파일 단건 조회 (다운로드 URL) | 🟩 | GET /files/:id | S | P0 | 파일 단건 조회 + 다운로드 URL(CDN/presigned). 참고: bkit:bkend-storage 스킬 | 개발자 B |
| 7.4 | 기록별 파일 목록 | 🟨 | GET /records/:id/files | XS | P0 | 특정 기록의 첨부 파일 목록. | 개발자 B |
| 7.5 | 자기표현별 파일 목록 | 🟨 | GET /self-expressions/:id/files | XS | P0 | 특정 자기표현의 첨부 파일 목록. | 개발자 B |
| 7.6 | 파일 메타 수정 (제목/민감도) | 🟧 | PATCH /files/:id | XS | P0 | 파일 메타 수정(제목·민감 여부 is_sensitive BOOLEAN). 참고: docs/02 §2(record_files) | 개발자 B |
| 7.7 | 파일 삭제 (storage + meta) | 🟥 | DELETE /files/:id | S | P0 | 파일 삭제(스토리지 객체 + 메타 동시). | 개발자 B |
| 7.8 | 민감 파일 추가 인증 (응급 정보) | 🔐 | middleware | M | P0 | 민감 파일(응급정보 등) 다운로드 시 추가 인증 미들웨어. 참고: docs/05 §11 보안 흐름, docs/08-wbs.md §17.2.5 | 개발자 B |
| 7.9 | 파일 바이러스 스캔 (옵션) | 🔐 | edge function | M | P2 | 업로드 파일 바이러스 스캔 edge function(P2). | 개발자 B |

---

# 8. 이정표 · 타임라인 (Life Milestones)

## 8.1 이정표 CRUD

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 8.1.1 | 이정표 추가 | 🟦 | POST /milestones | S | P0 | 이정표 추가(진단·입학·졸업·취업 등). category·event_date. 참고: docs/02 §2(life_milestones), docs/01-record-matrix.md | 개발자 A |
| 8.1.2 | 이정표 단건 조회 | 🟩 | GET /milestones/:id | XS | P0 | 이정표 단건 조회. | 개발자 A |
| 8.1.3 | 당사자별 이정표 목록 | 🟨 | GET /persons/:id/milestones | S | P0 | 당사자별 이정표 목록. | 개발자 A |
| 8.1.4 | 이정표 수정 | 🟧 | PATCH /milestones/:id | XS | P0 | 이정표 수정. | 개발자 A |
| 8.1.5 | 이정표 삭제 | 🟥 | DELETE /milestones/:id | XS | P0 | 이정표 삭제. | 개발자 A |
| 8.1.6 | 카테고리별 이정표 필터 | 🟨 | GET /milestones?category= | XS | P0 | 카테고리별 이정표 필터. | 개발자 A |

## 8.2 타임라인 (records + milestones + self_expressions 통합)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 8.2.1 | 통합 타임라인 조회 (시간 역순) | 🟨 | GET /persons/:id/timeline | M | P0 | records+milestones+self_expressions 통합 타임라인(시간 역순). 참고: docs/05 §6 생애주기 타임라인 조회, wireframes/web/03-timeline.svg | 개발자 A |
| 8.2.2 | 분야별 필터 | 🟨 | ?domain= | S | P0 | 타임라인 도메인 필터. 참고: docs/07 §1 도메인 컬러 | 개발자 A |
| 8.2.3 | 생애주기별 필터 | 🟨 | ?life_stage= | S | P0 | 생애주기(life_stage)별 필터. 참고: docs/02 §4 Enum(life_stage) | 개발자 A |
| 8.2.4 | 날짜 범위 필터 | 🟨 | ?from=&to= | XS | P0 | 날짜 범위 필터. | 개발자 A |
| 8.2.5 | 이정표만 보기 | 🟨 | ?milestones_only=true | XS | P0 | 이정표만 필터링. | 개발자 A |
| 8.2.6 | 작성자별 필터 | 🟨 | ?author= | XS | P1 | 작성자별 필터(P1). | 개발자 A |
| 8.2.7 | 타임라인 PDF 내보내기 | 🔀 | POST /timeline/export | M | P1 | 타임라인 PDF 내보내기(P1). 참고: docs/05 §6 | 개발자 A |
| 8.2.8 | 생애주기 자동 마커 (트리거) | 🟧 | DB trigger | S | P0 | 생애주기 전환 시 자동 마커 삽입 트리거. 참고: docs/05 §10 당사자 전환기 처리 | 개발자 A |

---

# 9. 인수인계 (Handover)

## 9.1 인수인계 CRUD

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 9.1.1 | 인수인계 생성 (Flow-6 4스텝) | 🟦 | POST /handovers | M | P0 | 인수인계 생성 4스텝(분야·기간·요약·연계 기록). 참고: docs/06 §6 Flow-6 인수인계, docs/05 §7 인수인계, docs/02 §2(handovers), wireframes/web/56-worker-handover-create.svg | 개발자 A |
| 9.1.2 | 인수인계 단건 조회 | 🟩 | GET /handovers/:id | S | P0 | 인수인계 상세 조회(연계 기록 포함). 참고: wireframes/web/40-supporter-handover-detail.svg | 개발자 A |
| 9.1.3 | 받은 인계 목록 | 🟨 | GET /handovers/received | S | P0 | 받은 인계 목록. 참고: wireframes/web/39-supporter-handover-list.svg | 개발자 A |
| 9.1.4 | 전달한 인계 목록 | 🟨 | GET /handovers/sent | S | P0 | 전달한 인계 목록. | 개발자 A |
| 9.1.5 | 인계 수정 (미확인 상태에서만) | 🟧 | PATCH /handovers/:id | S | P0 | 인계 수정(미확인 상태에서만). 참고: docs/03 §RLS | 개발자 A |
| 9.1.6 | 인계 삭제 (취소) | 🟥 | DELETE /handovers/:id | XS | P1 | 인계 삭제/취소(P1). | 개발자 A |

## 9.2 인계 플로우

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 9.2.1 | Step1 — 기본 설정 (분야·기간·후임자) | 🟦 | UI step | S | P0 | Step1 — 분야·인계 기간·후임자 지정. 참고: docs/06 §6 Flow-6, wireframes/web/56-worker-handover-create.svg | 개발자 A |
| 9.2.2 | Step2 — 핵심 요약·특이사항 태그 | 🟦 | UI step | S | P0 | Step2 — 핵심 요약·특이사항 태그 작성. | 개발자 A |
| 9.2.3 | Step3 — 중요 기록 다중 선택 | 🟦 | UI step | M | P0 | Step3 — 중요 기록 다중 선택(linked_record_ids). | 개발자 A |
| 9.2.4 | Step4 — 미리보기·발송·알림 | 🟦 | UI step + notification | S | P0 | Step4 — 미리보기·발송 + 후임자 알림. 참고: docs/05 §8 알림 | 개발자 A |
| 9.2.5 | 인계 확인 처리 (is_confirmed) | 🟧 | PATCH /handovers/:id/confirm | S | P0 | 후임자 인계 확인 처리(is_confirmed). 참고: docs/04 §3 활동지원사 | 개발자 A |
| 9.2.6 | 인계 확인 시 권한 자동 이양 (옵션) | 🟧 | trigger | M | P1 | 인계 확인 시 권한 자동 이양 트리거(옵션, P1). 참고: docs/05 §7·§2 | 개발자 A |

---

# 10. 알림 (Notification)

## 10.1 알림 인프라

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 10.1.1 | 알림 생성 (이벤트별 자동) | 🟦 | trigger fn | M | P0 | 이벤트별 알림 자동 생성 트리거(기록 작성·권한 변경·인계 등). 참고: docs/05 §8 알림 발송/수신, docs/02 §3 JSONB(notification payload) | 개발자 A |
| 10.1.2 | 알림 단건 조회 | 🟩 | GET /notifications/:id | XS | P0 | 알림 단건 조회. | 개발자 A |
| 10.1.3 | 사용자별 알림 목록 (페이징) | 🟨 | GET /notifications | S | P0 | 사용자별 알림 목록(페이징). 참고: wireframes/web/23-guardian-notifications.svg | 개발자 A |
| 10.1.4 | 알림 읽음 처리 | 🟧 | PATCH /notifications/:id/read | XS | P0 | 알림 읽음 처리. | 개발자 A |
| 10.1.5 | 알림 일괄 읽음 처리 | 🔀 | PATCH /notifications/read-all | XS | P0 | 알림 일괄 읽음 처리. | 개발자 A |
| 10.1.6 | 알림 삭제 | 🟥 | DELETE /notifications/:id | XS | P1 | 알림 삭제(P1). | 개발자 A |

## 10.2 알림 채널

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 10.2.1 | FCM (앱 푸시) 발송 | 🟦 | edge function | M | P0 | FCM 앱 푸시 발송 edge function. 참고: docs/05 §8, docs/08-wbs.md §16.6.1 | 개발자 A |
| 10.2.2 | 이메일 발송 (SendGrid/Resend) | 🟦 | edge function | S | P0 | 이메일 발송(SendGrid/Resend) edge function. 참고: docs/05 §8 | 개발자 A |
| 10.2.3 | SMS 발송 (응급용) | 🟦 | edge function | M | P1 | SMS 발송(응급용, P1). | 개발자 A |
| 10.2.4 | 사용자별 채널 설정 조회 | 🟩 | GET /notification-settings | XS | P0 | 사용자별 알림 채널 설정 조회. 참고: wireframes/web/27-guardian-notification-settings.svg | 개발자 A |
| 10.2.5 | 사용자별 채널 설정 수정 | 🟧 | PATCH /notification-settings | S | P0 | 알림 채널 설정 수정. | 개발자 A |
| 10.2.6 | 알림 유형별 토글 (매트릭스) | 🟧 | PATCH /notification-settings/types | S | P0 | 알림 유형별 on/off 토글 매트릭스. 참고: wireframes/web/27-guardian-notification-settings.svg | 개발자 A |
| 10.2.7 | 방해 금지 시간대 설정 | 🟧 | PATCH /notification-settings/quiet-hours | S | P1 | 방해 금지 시간대 설정(P1). | 개발자 A |
| 10.2.8 | 푸시 토큰 등록 (앱 설치) | 🟦 | POST /push-tokens | S | P0 | 앱 설치 시 푸시 토큰 등록. 참고: docs/08-wbs.md §16.6.1 | 개발자 A |

---

# 11. 접근 로그 (Audit)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :----: |
| 11.1 | 모든 read 자동 로깅 (트리거) | 🟦 | DB trigger | M | P0 | 모든 read 자동 로깅 트리거(누가 무엇을 열람). 참고: docs/02 §2(access_logs), docs/05 §9 접근 로그 조회 | PL |
| 11.2 | 모든 write 자동 로깅 (트리거) | 🟦 | DB trigger | S | P0 | 모든 write 자동 로깅 트리거. 참고: docs/03 §RLS | PL |
| 11.3 | 권한 외 시도 별도 로깅 | 🟦 | trigger | S | P0 | 권한 외 접근 시도 별도 로깅. 참고: docs/05 §11 보안 흐름 | PL |
| 11.4 | 당사자별 접근 로그 조회 | 🟨 | GET /persons/:id/access-logs | M | P0 | 당사자별 접근 로그 조회(보호자 투명성). 참고: docs/05 §9, wireframes/web/22-guardian-access-log.svg | PL |
| 11.5 | 접근 로그 필터 (날짜·접근자·동작) | 🟨 | ?filter= | S | P0 | 접근 로그 필터(날짜·접근자·동작). | PL |
| 11.6 | 이상 활동 자동 감지 (rule engine) | 🔐 | edge function | M | P1 | 이상 활동 자동 감지 rule engine(P1). 참고: docs/05 §11 | PL |
| 11.7 | 로그 CSV 내보내기 | 🔀 | POST /access-logs/export | S | P0 | 접근 로그 CSV 내보내기. | PL |
| 11.8 | 월간 보고서 자동 발송 (cron) | 🔀 | scheduled fn | S | P1 | 월간 접근 보고서 자동 발송 cron(P1). | PL |

---

# 12. 디자인 시스템 (Phase 5)

## 12.1 토큰 (07-design-system.md 기반)

| ID | 작업 | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|------|:---:|:-:| :-------- | :----: |
| 12.1.1 | 컬러 토큰 (Primary·Domain×6·Status) | tokens.ts | S | P0 | 컬러 토큰(Primary·6 도메인 컬러·Status). 참고: docs/07-design-system.md §1 컬러 시스템, §10 Tailwind 설정 | 개발자 C |
| 12.1.2 | 타이포 토큰 (Pretendard 스케일) | tokens.ts | XS | P0 | 타이포 토큰(Pretendard 스케일). 참고: docs/07 §2 타이포그래피 | 개발자 C |
| 12.1.3 | 스페이싱·반경·그림자 토큰 | tokens.ts | XS | P0 | 스페이싱·보더 레디어스·엘리베이션 토큰. 참고: docs/07 §3·§4·§5 | 개발자 C |
| 12.1.4 | 접근성 토큰 (당사자 모드: 큰글씨·고대비) | tokens-a11y.ts | S | P0 | 당사자 접근성 토큰(큰 글씨·고대비). 참고: docs/07 §9 당사자 접근성 모드 | 개발자 C |

## 12.2 Primitives

| ID | 작업 | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|------|:---:|:-:| :-------- | :----: |
| 12.2.1 | Button (variant: primary/secondary/destructive) | Button.tsx | S | P0 | Button(primary/secondary/destructive). 참고: docs/07 §8 컴포넌트 라이브러리(Button) | 개발자 C |
| 12.2.2 | Input (text/email/password/number) | Input.tsx | S | P0 | Input(text/email/password/number). 참고: docs/07 §8(Input) | 개발자 C |
| 12.2.3 | TextArea | TextArea.tsx | XS | P0 | TextArea. 참고: docs/07 §8 | 개발자 C |
| 12.2.4 | Select / Dropdown | Select.tsx | S | P0 | Select/Dropdown. 참고: docs/07 §8 | 개발자 C |
| 12.2.5 | Checkbox / Radio | Checkbox.tsx | XS | P0 | Checkbox/Radio. 참고: docs/07 §8 | 개발자 C |
| 12.2.6 | Toggle / Switch | Toggle.tsx | XS | P0 | Toggle/Switch. 참고: docs/07 §8 | 개발자 C |
| 12.2.7 | Badge (도메인 컬러 6 variant) | Badge.tsx | XS | P0 | Badge(도메인 6 컬러 variant). 참고: docs/07 §1 도메인 컬러·§8 | 개발자 C |
| 12.2.8 | Avatar | Avatar.tsx | XS | P0 | Avatar. 참고: docs/07 §8 | 개발자 C |

## 12.3 Composite Components

| ID | 작업 | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|------|:---:|:-:| :-------- | :----: |
| 12.3.1 | RecordCard (도메인별 컬러 + 첨부 미리보기) | RecordCard.tsx | S | P0 | RecordCard(도메인 컬러+첨부 미리보기). 참고: docs/07 §8 컴포넌트 라이브러리(RecordCard) | 개발자 C |
| 12.3.2 | PersonCard (당사자 카드) | PersonCard.tsx | S | P0 | PersonCard(당사자 카드). 참고: docs/07 §8 | 개발자 C |
| 12.3.3 | NotificationCard (3 type variant) | NotificationCard.tsx | S | P0 | NotificationCard(3 type variant). 참고: docs/07 §8 | 개발자 C |
| 12.3.4 | IconSelectorCard (ST-08, 자기표현 전용) | IconSelectorCard.tsx | M | P0 | IconSelectorCard(자기표현 전용, 큰 아이콘). 참고: docs/07 §6 아이콘·§9, docs/06 §6 Flow-1 | 개발자 C |
| 12.3.5 | StepIndicator (위자드 진행) | StepIndicator.tsx | S | P0 | StepIndicator(위자드 진행 표시). 참고: docs/07 §8, docs/06 §6 플로우 | 개발자 C |

## 12.4 레이아웃 셀

| ID | 작업 | 산출물 | 공수 | P | 세부사항 | 담당자 |
|----|------|------|:---:|:-:| :-------- | :----: |
| 12.4.1 | 웹 Sidebar (240px ↔ 64px 접힘) | Sidebar.tsx | M | P0 | 웹 Sidebar(240px↔64px 접힘). 참고: docs/06 §2 내비게이션 패턴, docs/07 §8 | 개발자 C |
| 12.4.2 | 웹 GlobalHeader (검색·알림·프로필) | Header.tsx | S | P0 | 웹 GlobalHeader(검색·알림·프로필). 참고: docs/06 §4 반응형 웹 IA | 개발자 C |
| 12.4.3 | 모바일 BottomTabBar (역할별 variant) | TabBar.tsx | M | P0 | 모바일 BottomTabBar(역할별 variant). 참고: docs/06 §5 모바일 앱 IA, §2 내비게이션 | 개발자 C |
| 12.4.4 | 모바일 NavigationBar (Push 스택용) | NavBar.tsx | S | P0 | 모바일 NavigationBar(Push 스택용). 참고: docs/06 §5 | 개발자 C |

---

# 13. 웹 UI — 보호자 (Guardian, 19 screens)

## 13.1 인증 화면

| ID | 화면 | API 연동 | 공수 | P | 세부사항 | 담당자 |
|----|------|--------|:---:|:-:| :-------- | :----: |
| 13.1.1 | A-01 로그인 | 2.2, 2.10, 2.11 | S | P0 | 보호자 로그인 화면(이메일·소셜). 참고: docs/06 §4 반응형 웹 IA, wireframes/web/01-login.svg | 개발자 C |
| 13.1.2 | A-03 회원가입·역할 선택 | 2.1 | S | P0 | 회원가입 역할 선택. 참고: docs/05 §1 온보딩, wireframes/web/11-signup-role.svg | 개발자 C |
| 13.1.3 | A-04 회원가입·기본정보 | 2.1, 2.4 | S | P0 | 회원가입 기본정보 입력. 참고: wireframes/web/12-signup-profile.svg | 개발자 C |
| 13.1.4 | A-05 이메일 인증 | 2.5 | S | P0 | 이메일 인증 화면. 참고: wireframes/web/13-signup-verify.svg | 개발자 C |
| 13.1.5 | A-06 초대 링크 수락 | 2.9 | M | P0 | 초대 링크 수락 화면. 참고: docs/05 §1, wireframes/web/14-invite-accept.svg | 개발자 C |
| 13.1.6 | A-07 비밀번호 재설정 | 2.6, 2.7 | S | P0 | 비밀번호 재설정 화면. 참고: wireframes/web/15-reset-password.svg | 개발자 C |

## 13.2 메인 화면

| ID | 화면 | API 연동 | 공수 | P | 세부사항 | 담당자 |
|----|------|--------|:---:|:-:| :-------- | :----: |
| 13.2.1 | G-01 대시보드 | 3.2.3, 8.2.1 | M | P0 | 보호자 대시보드(당사자 목록·최근 활동·알림). 참고: docs/04 §1 보호자, wireframes/web/02-guardian-dashboard.svg | 개발자 C |
| 13.2.2 | G-02 당사자 프로필 | 3.2.2, 4.1.3 | M | P0 | 당사자 프로필(요약·권한 현황). 참고: wireframes/web/16-guardian-person-profile.svg | 개발자 C |
| 13.2.3 | G-03 당사자 등록 위자드 (5 step) | 3.2.1 | L | P0 | 당사자 등록 위자드 5스텝. 참고: docs/04 §1, wireframes/web/17-guardian-person-register.svg | 개발자 C |
| 13.2.4 | G-10 타임라인 | 8.2.* | M | P0 | 생애주기 타임라인. 참고: docs/05 §6, wireframes/web/03-timeline.svg | 개발자 C |
| 13.2.5 | G-20 기록 관리 (전체) | 5.0.3 | M | P0 | 전체 기록 관리. 참고: wireframes/web/04-record-list.svg | 개발자 C |
| 13.2.6 | G-21 분야별 기록 목록 | 5.0.4 | S | P0 | 도메인별 기록 목록. 참고: wireframes/web/18-guardian-records-domain.svg | 개발자 C |
| 13.2.7 | G-22 기록 상세 (Split) | 5.0.2 | M | P0 | 기록 상세(Split 뷰). 참고: wireframes/web/05-record-detail.svg | 개발자 C |
| 13.2.8 | G-23 기록 작성 (5 step) | 5.0.1 (도메인별 분기) | L | P0 | 기록 작성 위자드 5스텝(도메인별 분기). 참고: docs/05 §4 기록 작성 공통, wireframes/web/06-record-form.svg | 개발자 C |
| 13.2.9 | G-24 기록 수정 | 5.0.5 | S | P0 | 기록 수정. 참고: wireframes/web/19-guardian-record-edit.svg | 개발자 C |
| 13.2.10 | G-30 권한 매트릭스 | 4.1.3 | M | P0 | 권한 매트릭스(이해관계자×도메인). 참고: wireframes/web/07-permission-matrix.svg | 개발자 C |
| 13.2.11 | G-31 이해관계자 상세 | 4.1.4 | S | P0 | 이해관계자 상세(받은 권한·이력). 참고: wireframes/web/20-guardian-stakeholder-detail.svg | 개발자 C |
| 13.2.12 | G-32 권한 부여 위자드 (4 step) | 4.2.* | L | P0 | 권한 부여 위자드 4스텝. 참고: docs/06 §6, wireframes/web/21-guardian-grant-wizard.svg | 개발자 C |
| 13.2.13 | G-33/34 권한 수정·회수 모달 | 4.1.5, 4.1.6 | S | P0 | 권한 수정·회수 모달. 참고: wireframes/web/28-guardian-permission-modals.svg | 개발자 C |
| 13.2.14 | G-40 접근 로그 | 11.4, 11.5 | M | P0 | 접근 로그 화면. 참고: docs/05 §9, wireframes/web/22-guardian-access-log.svg | 개발자 C |
| 13.2.15 | G-50 알림 | 10.1.3 | S | P0 | 알림 목록. 참고: wireframes/web/23-guardian-notifications.svg | 개발자 C |

## 13.3 설정 화면

| ID | 화면 | API 연동 | 공수 | P | 세부사항 | 담당자 |
|----|------|--------|:---:|:-:| :-------- | :----: |
| 13.3.1 | G-60 설정 허브 | — | S | P0 | 설정 허브. 참고: wireframes/web/10-settings.svg | 개발자 C |
| 13.3.2 | G-61 프로필 편집 | 3.1.2 | S | P0 | 프로필 편집. 참고: wireframes/web/24-guardian-profile-edit.svg | 개발자 C |
| 13.3.3 | G-62 당사자 정보 편집 | 3.2.4 | M | P0 | 당사자 정보 편집. 참고: wireframes/web/25-guardian-person-edit.svg | 개발자 C |
| 13.3.4 | G-63 응급 정보 편집 | 3.2.5 | M | P0 | 응급 정보 편집(추가 인증). 참고: wireframes/web/26-guardian-emergency-edit.svg | 개발자 C |
| 13.3.5 | G-64 알림 설정 | 10.2.4~7 | S | P0 | 알림 설정. 참고: wireframes/web/27-guardian-notification-settings.svg | 개발자 C |

---

# 14. 웹 UI — 당사자 (Person, 접근성 모드, 10 screens)

| ID | 화면 | API 연동 | 공수 | P | 세부사항 | 담당자 |
|----|------|--------|:---:|:-:| :-------- | :----: |
| 14.1 | P-01 오늘 기록 홈 | 6.2 | M | P0 | 당사자 오늘 기록 홈(큰 CTA). 참고: docs/04 §2 당사자, docs/07 §9, wireframes/web/08-person-home.svg | 개발자 C |
| 14.2 | P-02 자기표현 위자드 (Flow-1) | 6.1 | L | P0 | 자기표현 위자드(Flow-1, 아이콘 기반). 참고: docs/06 §6 Flow-1, wireframes/web/09-self-expression.svg | 개발자 C |
| 14.3 | P-03 자기표현 완료 애니메이션 | — | XS | P0 | 자기표현 완료 애니메이션(긍정 피드백). 참고: docs/07 §7 모션 & 애니메이션 | 개발자 C |
| 14.4 | P-10 내 기록 (분야 그리드) | 5.0.3 | S | P0 | 내 기록 분야 그리드. 참고: wireframes/web/29-person-records.svg | 개발자 C |
| 14.5 | P-11 기록 상세 (쉬운 요약) | 5.0.2 (summary 필드) | M | P0 | 기록 상세(쉬운 요약 summary 필드). 참고: wireframes/web/30-person-record-detail.svg | 개발자 C |
| 14.6 | P-20 설정 허브 (큰 카드) | — | XS | P0 | 설정 허브(큰 카드). 참고: wireframes/web/31-person-settings.svg | 개발자 C |
| 14.7 | P-21 접근성 설정 | 3.4.3 | M | P0 | 접근성 설정(글씨·대비·TTS). 참고: docs/07 §9, wireframes/web/32-person-accessibility.svg | 개발자 C |
| 14.8 | P-22 내 정보 | 3.4.2 | S | P0 | 내 정보. 참고: wireframes/web/33-person-profile.svg | 개발자 C |
| 14.9 | P-30 알림 (큰 카드) | 10.1.3 | S | P0 | 알림(큰 카드). 참고: wireframes/web/34-person-notifications.svg | 개발자 C |
| 14.10 | 접근성 모드 자동 적용 (theme switch) | tokens-a11y | M | P0 | 접근성 모드 자동 적용(theme switch). 참고: docs/07 §9 당사자 접근성 모드, tokens-a11y | 개발자 C |

---

# 15. 웹 UI — 전문가 (4 역할, 36 screens)

## 15.1 활동지원사 (S)

| ID | 화면 | API 연동 | 공수 | P | 세부사항 | 담당자 |
|----|------|--------|:---:|:-:| :-------- | :----: |
| 15.1.1 | S-01 홈 | 5.D.2 list | S | P0 | 활동지원사 홈. 참고: docs/04 §3 활동지원사, wireframes/web/35-supporter-home.svg | 개발자 D |
| 15.1.2 | S-10 일지 목록 | 5.D.2 L | S | P0 | 일지 목록. 참고: wireframes/web/36-supporter-journal-list.svg | 개발자 D |
| 15.1.3 | S-11 일지 상세 | 5.D.2 R | S | P0 | 일지 상세. 참고: wireframes/web/37-supporter-journal-detail.svg | 개발자 D |
| 15.1.4 | S-12 일지 작성 위자드 (5 step, Flow-4) | 5.D.2 C | L | P0 | 일지 작성 위자드 5스텝(Flow-4). 참고: docs/06 §6 Flow-4, wireframes/web/38-supporter-journal-form.svg | 개발자 D |
| 15.1.5 | S-13 일지 수정 | 5.D.2 U | S | P0 | 일지 수정. 참고: wireframes/web/38-supporter-journal-form.svg | 개발자 D |
| 15.1.6 | S-20 인수인계 목록 | 9.1.3, 9.1.4 | S | P0 | 인수인계 목록. 참고: wireframes/web/39-supporter-handover-list.svg | 개발자 D |
| 15.1.7 | S-21 인수인계 상세 | 9.1.2, 9.2.5 | M | P0 | 인수인계 상세(확인 처리). 참고: docs/05 §7, wireframes/web/40-supporter-handover-detail.svg | 개발자 D |
| 15.1.8 | S-30/40 알림+설정 통합 | 10.1.3, 10.2.5 | S | P0 | 알림+설정 통합. 참고: wireframes/web/41-supporter-notifications-settings.svg | 개발자 D |

## 15.2 특수교사 (T)

| ID | 화면 | API 연동 | 공수 | P | 세부사항 | 담당자 |
|----|------|--------|:---:|:-:| :-------- | :----: |
| 15.2.1 | T-01 홈 (담당 학생) | 5.B list | M | P0 | 교사 홈(담당 학생). 참고: docs/04 §4 특수교사, wireframes/web/42-teacher-home.svg | 개발자 D |
| 15.2.2 | T-11 IEP 목록 | 5.B.1 L | S | P0 | IEP 목록. 참고: wireframes/web/43-teacher-iep-list.svg | 개발자 D |
| 15.2.3 | T-12 IEP 상세 | 5.B.1 R | M | P0 | IEP 상세. 참고: wireframes/web/44-teacher-iep-detail.svg | 개발자 D |
| 15.2.4 | T-13 IEP 작성 위자드 (6 step, Flow-5) | 5.B.1 C | XL | P0 | IEP 작성 위자드 6스텝(Flow-5·최대 공수). 참고: docs/06 §6 Flow-5, docs/02 §3 JSONB(EDU-001), wireframes/web/45-teacher-iep-form.svg | 개발자 D |
| 15.2.5 | T-14 IEP 점검 | 5.B.3 | M | P0 | IEP 중간 점검. 참고: wireframes/web/46-teacher-iep-review.svg | 개발자 D |
| 15.2.6 | T-15 관찰 기록 목록 | 5.B.4 L | S | P0 | 관찰 기록 목록. 참고: wireframes/web/47-teacher-observation.svg | 개발자 D |
| 15.2.7 | T-16 관찰 기록 작성 | 5.B.4 C | M | P0 | 관찰 기록 작성. 참고: wireframes/web/47-teacher-observation.svg | 개발자 D |
| 15.2.8 | T-17 전환교육 목록 | 5.B.7 L | S | P0 | 전환교육 목록. 참고: wireframes/web/48-teacher-transition.svg | 개발자 D |
| 15.2.9 | T-18 전환교육 작성 (4 step) | 5.B.7 C | L | P0 | 전환교육 작성 4스텝. 참고: wireframes/web/48-teacher-transition.svg | 개발자 D |
| 15.2.10 | T-20 교육 타임라인 | 8.2 (filter) | S | P0 | 교육 타임라인(도메인 필터). 참고: wireframes/web/49-teacher-timeline.svg | 개발자 D |
| 15.2.11 | T-30/40 알림+설정 | 10.* | S | P0 | 알림+설정. 참고: wireframes/web/50-teacher-notifications-settings.svg | 개발자 D |

## 15.3 사회복지사 (W)

| ID | 화면 | API 연동 | 공수 | P | 세부사항 | 담당자 |
|----|------|--------|:---:|:-:| :-------- | :----: |
| 15.3.1 | W-01 홈 | 5.C, 5.E list | M | P0 | 복지사 홈. 참고: docs/04 §5 사회복지사, wireframes/web/51-worker-home.svg | 개발자 D |
| 15.3.2 | W-11 ISP 목록 | 5.C.4 L | S | P0 | ISP 목록. 참고: wireframes/web/52-worker-isp.svg | 개발자 D |
| 15.3.3 | W-12 ISP 상세 | 5.C.4 R | M | P0 | ISP 상세. 참고: wireframes/web/52-worker-isp.svg | 개발자 D |
| 15.3.4 | W-13 ISP 작성 (5 step) | 5.C.4 C | XL | P0 | ISP 작성 위자드 5스텝(최대 공수). 참고: docs/02 §3 JSONB(WEL-004), wireframes/web/53-worker-isp-form.svg | 개발자 D |
| 15.3.5 | W-14 ISP 점검 | 5.C.5 | M | P0 | ISP 중간 점검. 참고: wireframes/web/52-worker-isp.svg | 개발자 D |
| 15.3.6 | W-15 전환계획 목록 | 5.E.1 L | S | P0 | 전환계획 목록. 참고: wireframes/web/54-worker-transition.svg | 개발자 D |
| 15.3.7 | W-16 전환계획 작성 (5 step) | 5.E.1 C | XL | P0 | 전환계획 작성 5스텝(최대 공수). 참고: docs/02 §3 JSONB(TRA-001), wireframes/web/54-worker-transition.svg | 개발자 D |
| 15.3.8 | W-17 서비스 이용 현황 (매트릭스) | 5.C.6 R | M | P0 | 서비스 이용 현황 매트릭스. 참고: wireframes/web/55-worker-service-matrix.svg | 개발자 D |
| 15.3.9 | W-20 복지+전환 타임라인 | 8.2 | M | P0 | 복지+전환 타임라인. | 개발자 D |
| 15.3.10 | W-30 인수인계 목록 | 9.1.3, 9.1.4 | S | P0 | 인수인계 목록. | 개발자 D |
| 15.3.11 | W-31 인수인계 생성 (4 step, Flow-6) | 9.1.1 | L | P0 | 인수인계 생성 4스텝(Flow-6). 참고: docs/06 §6 Flow-6, wireframes/web/56-worker-handover-create.svg | 개발자 D |
| 15.3.12 | W-40/50 알림+설정 | 10.* | S | P0 | 알림+설정. 참고: wireframes/web/57-worker-notifications-settings.svg | 개발자 D |

## 15.4 치료사 (TH)

| ID | 화면 | API 연동 | 공수 | P | 세부사항 | 담당자 |
|----|------|--------|:---:|:-:| :-------- | :----: |
| 15.4.1 | TH-01 홈 (오늘 회기) | 5.A.6 (date filter) | M | P0 | 치료사 홈(오늘 회기). 참고: docs/04 §6 치료사, wireframes/web/58-therapist-home.svg | 개발자 D |
| 15.4.2 | TH-11 치료계획서 목록 | 5.A.5 L | S | P0 | 치료계획서 목록. 참고: wireframes/web/59-therapist-plan.svg | 개발자 D |
| 15.4.3 | TH-12 치료계획서 상세 | 5.A.5 R | M | P0 | 치료계획서 상세. 참고: wireframes/web/59-therapist-plan.svg | 개발자 D |
| 15.4.4 | TH-13 치료계획서 작성 (5 step) | 5.A.5 C | L | P0 | 치료계획서 작성 5스텝. 참고: docs/02 §3 JSONB(MED-005), wireframes/web/59-therapist-plan.svg | 개발자 D |
| 15.4.5 | TH-14 회기 일지 목록 | 5.A.6 L | S | P0 | 회기 일지 목록. 참고: wireframes/web/60-therapist-session-form.svg | 개발자 D |
| 15.4.6 | TH-15 회기 일지 작성 | 5.A.6 C | M | P0 | 회기 일지 작성. 참고: docs/02 §3 JSONB(MED-006), wireframes/web/60-therapist-session-form.svg | 개발자 D |
| 15.4.7 | TH-16 평가 보고서 목록 | 5.A.7 L | S | P0 | 평가 보고서 목록. 참고: wireframes/web/61-therapist-evaluation.svg | 개발자 D |
| 15.4.8 | TH-17 평가 보고서 작성 (4 step) | 5.A.7 C | L | P0 | 평가 보고서 작성 4스텝. 참고: docs/02 §3 JSONB(MED-007), wireframes/web/61-therapist-evaluation.svg | 개발자 D |
| 15.4.9 | TH-20 의료 타임라인 | 8.2 | M | P0 | 의료 타임라인. 참고: wireframes/web/62-therapist-timeline-settings.svg | 개발자 D |
| 15.4.10 | TH-30/40 알림+설정 | 10.* | S | P0 | 알림+설정. 참고: wireframes/web/62-therapist-timeline-settings.svg | 개발자 D |

---

# 16. 모바일 앱 (React Native, 24+ screens)

> 웹과 동일한 API 사용 / 모바일 전용 패턴: BottomSheet · FAB · Push 스택

## 16.1 인증

| ID | 화면 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|:-:| :-------- | :----: |
| 16.1.1 | A-01 로그인 (모바일) | S | P0 | 모바일 로그인. 참고: docs/06 §5 모바일 앱 IA, wireframes/mobile/01-m-login.svg | 개발자 E |
| 16.1.2 | A-03 회원가입 역할 선택 | S | P0 | 회원가입 역할 선택. 참고: wireframes/mobile/06-m-signup-role.svg | 개발자 E |
| 16.1.3 | A-02/04/05/07 회원가입·인증·재설정 통합 | M | P0 | 회원가입·이메일 인증·재설정 통합 플로우. 참고: docs/05 §1 온보딩 | 개발자 E |
| 16.1.4 | A-06 초대 수락 (Deep Link) | M | P0 | 초대 수락(Deep Link 처리). 참고: docs/08-wbs.md §16.6.6 | 개발자 E |

## 16.2 보호자

| ID | 화면 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|:-:| :-------- | :----: |
| 16.2.1 | G-01 홈 (Bottom Tab) | M | P0 | 보호자 홈(Bottom Tab). 참고: wireframes/mobile/02-m-guardian-home.svg | 개발자 E |
| 16.2.2 | G-10 타임라인 | M | P0 | 타임라인. 참고: wireframes/mobile/03-m-timeline.svg | 개발자 E |
| 16.2.3 | G-22 기록 상세 (Push) | S | P0 | 기록 상세(Push). 참고: wireframes/mobile/07-m-record-detail.svg | 개발자 E |
| 16.2.4 | G-23 기록 작성 (Full-screen Flow) | L | P0 | 기록 작성(Full-screen Flow). 참고: wireframes/mobile/08-m-record-form.svg | 개발자 E |
| 16.2.5 | G-30 권한 매트릭스 (카드 리스트) | M | P0 | 권한 매트릭스(카드 리스트). 참고: wireframes/mobile/09-m-permissions.svg | 개발자 E |
| 16.2.6 | G-32 권한 부여 위자드 | L | P0 | 권한 부여 위자드. 참고: wireframes/mobile/10-m-grant-wizard.svg | 개발자 E |
| 16.2.7 | G-50 알림 (인라인 액션) | S | P0 | 알림(인라인 액션). 참고: wireframes/mobile/11-m-notifications.svg | 개발자 E |
| 16.2.8 | G-60 설정 (당사자별 진입) | S | P0 | 설정(당사자별 진입). 참고: wireframes/mobile/12-m-settings.svg | 개발자 E |

## 16.3 당사자 (접근성)

| ID | 화면 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|:-:| :-------- | :----: |
| 16.3.1 | P-01 오늘 기록 홈 (큰 CTA) | M | P0 | 당사자 오늘 기록 홈(큰 CTA). 참고: docs/07 §9 접근성, wireframes/mobile/04-m-person-home.svg | 개발자 E |
| 16.3.2 | P-02 자기표현 위자드 (4 step, 풀스크린) | L | P0 | 자기표현 위자드 4스텝(풀스크린). 참고: docs/06 §6 Flow-1, wireframes/mobile/05-m-self-expression.svg | 개발자 E |
| 16.3.3 | P-10 내 기록 (분야 그리드) | S | P0 | 내 기록(분야 그리드). 참고: wireframes/mobile/13-m-person-records.svg | 개발자 E |
| 16.3.4 | P-11 기록 상세 (쉬운 요약) | M | P0 | 기록 상세(쉬운 요약). 참고: wireframes/mobile/14-m-person-record-detail.svg | 개발자 E |
| 16.3.5 | P-20 설정 (큰 카드) | S | P0 | 설정(큰 카드). 참고: wireframes/mobile/15-m-person-settings.svg | 개발자 E |

## 16.4 활동지원사

| ID | 화면 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|:-:| :-------- | :----: |
| 16.4.1 | S-01 홈 (대형 일지 CTA) | M | P0 | 활동지원사 홈(대형 일지 CTA). 참고: wireframes/mobile/16-m-supporter-home.svg | 개발자 E |
| 16.4.2 | S-12 일지 작성 위자드 (5 step) | XL | P0 | 일지 작성 위자드 5스텝. 참고: wireframes/mobile/17-m-supporter-journal-form.svg | 개발자 E |
| 16.4.3 | S-20 인수인계 목록 | S | P0 | 인수인계 목록. 참고: wireframes/mobile/18-m-supporter-handover.svg | 개발자 E |

## 16.5 전문가 4역할 통합 패턴

| ID | 화면 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|:-:| :-------- | :----: |
| 16.5.1 | T-01 교사 홈 | M | P0 | 교사 홈. 참고: wireframes/mobile/19-m-teacher-home.svg | 개발자 E |
| 16.5.2 | T-12 IEP 상세 | M | P0 | IEP 상세. 참고: wireframes/mobile/20-m-teacher-iep-detail.svg | 개발자 E |
| 16.5.3 | W-01 복지사 홈 | M | P0 | 복지사 홈. 참고: wireframes/mobile/21-m-worker-home.svg | 개발자 E |
| 16.5.4 | W-12 ISP 상세 | M | P0 | ISP 상세. 참고: wireframes/mobile/22-m-worker-isp-detail.svg | 개발자 E |
| 16.5.5 | TH-01 치료사 홈 | M | P0 | 치료사 홈. 참고: wireframes/mobile/23-m-therapist-home.svg | 개발자 E |
| 16.5.6 | TH-15 회기 일지 작성 | M | P0 | 회기 일지 작성. 참고: wireframes/mobile/24-m-therapist-session.svg | 개발자 E |

## 16.6 모바일 전용 기능

| ID | 작업 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|:-:| :-------- | :----: |
| 16.6.1 | FCM 푸시 알림 통합 | M | P0 | FCM 푸시 알림 통합(토큰 등록·수신). 참고: docs/05 §8 알림, docs/08-wbs.md §10.2.1·§10.2.8 | 개발자 E |
| 16.6.2 | 카메라/갤러리 (사진 첨부) | M | P0 | 카메라/갤러리 사진 첨부. 참고: docs/05 §5 파일 첨부 | 개발자 E |
| 16.6.3 | 음성 메모 녹음 | M | P1 | 음성 메모 녹음(P1). 참고: docs/08-wbs.md §6.6 | 개발자 E |
| 16.6.4 | 일지 오프라인 임시저장 (AsyncStorage) | L | P0 | 일지 오프라인 임시저장(AsyncStorage) 후 동기화. 참고: docs/04 §3 활동지원사 | 개발자 E |
| 16.6.5 | 생체 인증 (Face ID / 지문) | M | P0 | 생체 인증(Face ID/지문) — 민감정보 보호. 참고: docs/08-wbs.md §17.2.5 | 개발자 E |
| 16.6.6 | Deep Link 라우팅 (초대 등) | M | P0 | Deep Link 라우팅(초대·알림 진입). 참고: docs/08-wbs.md §16.1.4 | 개발자 E |
| 16.6.7 | OTA 업데이트 (Expo Updates) | S | P1 | OTA 업데이트(Expo Updates, P1). | 개발자 E |

---

# 17. SEO · 보안 · 접근성 (Phase 7)

## 17.1 SEO (웹만)

| ID | 작업 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|:-:| :-------- | :----: |
| 17.1.1 | 메타 태그 (랜딩 페이지) | XS | P1 | 랜딩 페이지 메타 태그(P1). | PL |
| 17.1.2 | Sitemap·robots.txt | XS | P1 | Sitemap·robots.txt(P1). | PL |
| 17.1.3 | OG 이미지·소셜 미리보기 | S | P2 | OG 이미지·소셜 미리보기(P2). | PL |

## 17.2 보안

| ID | 작업 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|:-:| :-------- | :----: |
| 17.2.1 | OWASP Top 10 자체 점검 | M | P0 | OWASP Top 10 자체 점검. 참고: docs/05 §11 시스템 보안 흐름, bkit:phase-7-seo-security 스킬 | PL |
| 17.2.2 | XSS 필터 (입력값 sanitize) | S | P0 | XSS 방어 — 입력값 sanitize. | PL |
| 17.2.3 | CSRF 토큰 | S | P0 | CSRF 토큰 적용. | PL |
| 17.2.4 | SQL Injection 방어 검증 (RLS + Prisma) | S | P0 | SQL Injection 방어 검증(RLS + Prisma 파라미터화). 참고: docs/03 §RLS | PL |
| 17.2.5 | 응급정보 추가 인증 (PIN 또는 생체) | M | P0 | 응급정보 접근 시 PIN/생체 추가 인증. 참고: docs/05 §11, docs/02 §3 JSONB(emergency) | PL |
| 17.2.6 | 민감 파일 다운로드 워터마킹 | M | P1 | 민감 파일 다운로드 워터마킹(P1). | PL |
| 17.2.7 | Rate Limiting (API) | S | P0 | API Rate Limiting. | PL |
| 17.2.8 | Audit log immutability (PostgreSQL) | S | P0 | Audit log 불변성(PostgreSQL append-only). 참고: docs/02 §2(access_logs), docs/03 §RLS | PL |

## 17.3 접근성 (WCAG 2.1 AA)

| ID | 작업 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|:-:| :-------- | :----: |
| 17.3.1 | 키보드 네비게이션 | M | P0 | 키보드 네비게이션(WCAG 2.1 AA). 참고: docs/07 §9 접근성 | PL |
| 17.3.2 | 스크린 리더 호환 (ARIA) | M | P0 | 스크린 리더 호환(ARIA 레이블). 참고: docs/07 §9 | PL |
| 17.3.3 | 컬러 대비 4.5:1 검증 | S | P0 | 컬러 대비 4.5:1 검증. 참고: docs/07 §1 컬러 시스템·§9 | PL |
| 17.3.4 | 당사자 모드 — TTS 통합 | M | P0 | 당사자 모드 TTS 통합. 참고: docs/07 §9 당사자 접근성 모드 | PL |

---

# 18. QA · 테스트 (Phase 8)

## 18.1 자동화 테스트

| ID | 작업 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|:-:| :-------- | :----: |
| 18.1.1 | 단위 테스트 (Vitest, 핵심 로직 70%) | L | P0 | 단위 테스트(Vitest, 핵심 로직 70%). | PM |
| 18.1.2 | API 통합 테스트 (Supertest) | L | P0 | API 통합 테스트(Supertest). 참고: docs/05 워크플로우 | PM |
| 18.1.3 | E2E 테스트 (Playwright, 5개 핵심 플로우) | XL | P0 | E2E 테스트(Playwright, 5개 핵심 플로우). 참고: docs/06 §6 주요 플로우 | PM |
| 18.1.4 | RLS 정책 자동 검증 (pgTAP) | L | P0 | RLS 정책 자동 검증(pgTAP). 참고: docs/03 §RLS 정책 요약 | PM |
| 18.1.5 | 시각 회귀 (Chromatic) | M | P1 | 시각 회귀 테스트(Chromatic, P1). 참고: docs/07 디자인 시스템 | PM |

## 18.2 Zero Script QA (역할별 시나리오)

| ID | 시나리오 | 공수 | P | 세부사항 | 담당자 |
|----|---------|:---:|:-:| :-------- | :----: |
| 18.2.1 | 보호자 — 회원가입~당사자 등록~권한 부여 | M | P0 | 보호자 시나리오 — 가입~당사자 등록~권한 부여. 참고: docs/04 §1 보호자, bkit:zero-script-qa 스킬 | PM |
| 18.2.2 | 당사자 — 자기표현 5일 연속 입력 | S | P0 | 당사자 시나리오 — 자기표현 5일 연속. 참고: docs/04 §2 당사자 | PM |
| 18.2.3 | 활동지원사 — 일지 작성 + 인계 확인 | M | P0 | 활동지원사 시나리오 — 일지+인계 확인. 참고: docs/04 §3 | PM |
| 18.2.4 | 특수교사 — IEP 작성 + 점검 | M | P0 | 특수교사 시나리오 — IEP 작성+점검. 참고: docs/04 §4 | PM |
| 18.2.5 | 사회복지사 — ISP·전환계획 작성 | M | P0 | 사회복지사 시나리오 — ISP·전환계획. 참고: docs/04 §5 | PM |
| 18.2.6 | 치료사 — 계획서 + 회기 + 평가 사이클 | M | P0 | 치료사 시나리오 — 계획서+회기+평가 사이클. 참고: docs/04 §6 | PM |
| 18.2.7 | 권한 외 접근 시도 차단 검증 | M | P0 | 권한 외 접근 차단 검증. 참고: docs/05 §11 보안 흐름 | PM |
| 18.2.8 | 인수인계 권한 이양 검증 | S | P0 | 인수인계 권한 이양 검증. 참고: docs/05 §7 | PM |

## 18.3 성능

| ID | 작업 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|:-:| :-------- | :----: |
| 18.3.1 | 타임라인 응답 시간 (10k 기록, p95 < 500ms) | M | P0 | 타임라인 응답 성능(10k 기록, p95<500ms). 참고: docs/02 §5 인덱스 전략 | PM |
| 18.3.2 | 권한 매트릭스 응답 (20명 권한자, p95 < 300ms) | S | P0 | 권한 매트릭스 응답(20명, p95<300ms). | PM |
| 18.3.3 | 모바일 첫 화면 로드 (LCP < 2.5s) | S | P0 | 모바일 첫 화면 로드(LCP<2.5s). | PM |
| 18.3.4 | 부하 테스트 (100 동시 일지 작성) | M | P1 | 부하 테스트(100 동시 일지 작성, P1). | PM |

---

# 19. CI/CD · 배포 (Phase 9)

## 19.1 CI

| ID | 작업 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|:-:| :-------- | :----: |
| 19.1.1 | GitHub Actions — Lint·Type·Test | S | P0 | GitHub Actions — Lint·Type·Test 파이프라인. 참고: bkit:phase-9-deployment 스킬 | PL |
| 19.1.2 | PR 미리보기 환경 (Vercel Preview) | S | P0 | PR 미리보기 환경(Vercel Preview). | PL |
| 19.1.3 | DB 마이그레이션 검증 (스테이징) | S | P0 | DB 마이그레이션 검증(스테이징). | PL |
| 19.1.4 | 모바일 EAS Build (iOS·Android) | M | P0 | 모바일 EAS Build(iOS·Android). | PL |

## 19.2 CD

| ID | 작업 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|:-:| :-------- | :----: |
| 19.2.1 | dev 환경 자동 배포 | S | P0 | dev 환경 자동 배포. | PL |
| 19.2.2 | staging 환경 (manual trigger) | S | P0 | staging 환경 수동 배포 트리거. | PL |
| 19.2.3 | production 배포 (승인 게이트) | M | P0 | production 배포(승인 게이트). | PL |
| 19.2.4 | DB 백업 자동화 (일 1회) | S | P0 | DB 백업 자동화(일 1회). | PL |
| 19.2.5 | 롤백 시나리오 문서 | S | P0 | 롤백 시나리오 문서. 참고: bkit:rollback 스킬 | PL |

## 19.3 운영

| ID | 작업 | 공수 | P | 세부사항 | 담당자 |
|----|------|:---:|:-:| :-------- | :----: |
| 19.3.1 | 모니터링 대시보드 (Grafana) | M | P1 | 모니터링 대시보드(Grafana, P1). | PL |
| 19.3.2 | 알림 인프라 (PagerDuty/Slack) | S | P1 | 알림 인프라(PagerDuty/Slack, P1). | PL |
| 19.3.3 | 로그 통합 (Loki / Datadog) | M | P1 | 로그 통합(Loki/Datadog, P1). | PL |
| 19.3.4 | 보안 감사 분기별 (외부) | M | P1 | 분기별 외부 보안 감사(P1). | PL |
| 19.3.5 | 사용자 데이터 GDPR/개인정보보호법 응대 워크플로우 | M | P0 | GDPR/개인정보보호법 응대 워크플로우(데이터 열람·삭제 요청). | PL |

---

# 부록 A. 의존성 차트

```
0. 프로젝트 셋업
  ↓
1. DB 스키마 + RLS
  ↓
2. 인증 ── 12. 디자인 시스템
  ↓                ↓
3. 사용자/당사자 ── 13. 보호자 웹 UI
  ↓                ↓
4. 권한          14. 당사자 웹 UI
  ↓                ↓
5. 기록 ── 6. 자기표현 ── 7. 파일
  ↓                ↓
8. 이정표/타임라인  15. 전문가 웹 UI
  ↓                ↓
9. 인수인계 ── 10. 알림 ── 11. 감사
  ↓                ↓
16. 모바일 앱
  ↓
17. SEO/보안 → 18. QA → 19. 배포
```

---

# 부록 B. MVP vs 차기 릴리스

## MVP (P0 합계: ~280d, 5명 팀 약 12주)

- 인증·사용자·당사자·권한 매트릭스 (전체)
- 기록 6도메인 핵심 유형 (MED-001~008, EDU-001/003/004/007/009, WEL-001~006, DAI-002/003, TRA-001/002/003, LEG-001/002/003)
- 자기표현 (전체)
- 파일 첨부 (전체)
- 이정표·타임라인 (전체)
- 인수인계 핵심 4-step
- 알림 (앱 푸시 + 이메일)
- 접근 로그
- 디자인 시스템 + 웹 UI (역할 7개 핵심 화면) + 모바일 핵심 화면
- 보안·접근성 필수
- CI/CD + 프로덕션 배포

## 차기 릴리스 (P1, P2)

- 영유아·노년기 전용 기록 (DAI-001, MED-010, WEL-007, TRA-007 등)
- SMS 채널·음성 메모
- 시각 회귀·부하 테스트 고도화
- i18n (영어)
- OG 이미지·소셜 미리보기
- 시각 분석 대시보드 (보호자용 통계)

---

# 부록 C. 역할별 작업 비중 (MVP 기준)

| 역할 | 작업 일수 |
|------|--------|
| 백엔드 엔지니어 (DB·RLS·API) | ~120d |
| 프론트엔드 엔지니어 (웹) | ~80d |
| 모바일 엔지니어 (RN) | ~50d |
| 디자인 시스템 / 디자이너 | ~30d |
| QA / 인프라 | ~30d |
| **합계** | **~310d** |

> 5명 동시 진행 시 12~14주 예상 (병렬 작업 가능 영역 고려)

---

> 본 WBS는 IA(06-information-architecture.md), 데이터 명세(02-data-specification.md), ERD(03-erd.md), 워크플로우(04, 05)를 기반으로 작성되었습니다. 우선순위·공수는 팀 역량과 프로젝트 일정에 따라 조정 가능합니다.
