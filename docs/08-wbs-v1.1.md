# WBS (Work Breakdown Structure) — OnDol 플랫폼

> 버전: v1.1 (정본 SSOT) | 작성일: 2026-06-14 (개정: 2026-06-14 — 개인정보 거버넌스 정합)
> 분해 원칙: 기능의 최소 단위 (CRUD 각각 C/R-단건/R-목록/U/D 별도 작업)
> 추정 단위: XS(0.5d) · S(1d) · M(2~3d) · L(5d) · XL(7d+)
> 우선순위: P0(MVP 필수) · P1(MVP 권장) · P2(차기 릴리스)
> **본 파일이 WBS 정본(SSOT)이다.** v1.0(`docs/08-wbs.md`)은 DEPRECATED 보존용이며, xlsx·csv·09-github 파생자산은 본 md를 단일 원천으로 재생성한다.

> **v1.1 변경 요약**
> 1. 모든 작업 테이블의 `세부사항` 열 다음에 **`AI 프롬프트`** 열 추가 — Claude Code에 바로 사용 가능한 한국어 프롬프트(200자 이내).
> 2. **구현 순서 재정렬** — 단위→통합→E2E 테스트가 내재화되도록 Phase 헤더에 `🧪 테스트 전략` 노트 추가, 신규 작업(0.13·0.14·11.5.x) 삽입, Phase 11.5 백엔드 통합 테스트 체크포인트 신설.
> 3. ✨ NEW = v1.1에서 새로 추가된 작업.
> 4. **개인정보 거버넌스 정합(2026-06-14, docs/02 §2.14·§2.15·deleted_at·§5 / docs/05 §1-3·§10 / docs/13 §3.5·§4.1·§4.2 / docs/16 §2·§3·§4·§5·§7 / docs/18 에러규약)** — `secure_identifiers`·`consents` 테이블·soft-delete·복호화 통제 RLS·동의 수집/판정/재취득 API·고유식별정보 암호화 서비스·로그/soft-delete 파기 배치·동의·약관·처리방침·권리관리 화면·Sentry PII 스크러빙 등 **신규 작업패키지 16개** 추가. WEL-001·LEG-001은 `secure_identifier_id` 참조로 갱신. 본문의 자기참조(`docs/08-wbs.md §…`)를 `§…`(자체)로 교정. ✨ NEW로 표기.

---

## 작업량 요약

> 공수(일)는 XS=0.5·S=1·M=2.5·L=5·XL=7 환산 합계이며, 엑셀(08-wbs.xlsx)·Gantt와 동일 기준이다.

| 분류 | 작업 수 | 합계 공수 (person-day) |
|------|--------|---------------|
| 0. 프로젝트 셋업 + CI 기초 | 14 (✨+2) | 14d |
| 1. DB 스키마 + RLS | 23 (✨+5) | 17d |
| 2. 인증 (Auth) | 13 (✨+2) | 18.5d |
| 3. 사용자·당사자·매핑 | 25 (✨+1) | 25.5d |
| 4. 권한 관리 | 18 | 25d |
| 5. 기록 (Records) | 57 (✨+1) | 98d |
| 6. 자기표현 (Self-Expression) | 8 | 9.5d |
| 7. 파일 첨부 (Files) | 9 | 10.5d |
| 8. 이정표·타임라인 | 14 | 13.5d |
| 9. 인수인계 (Handover) | 12 | 16d |
| 10. 알림 (Notification) | 14 | 16d |
| 11. 접근 로그 (Audit) | 10 (✨+2) | 14.5d |
| 11.5 백엔드 통합 테스트 체크포인트 | 3 (✨+3) | 7.5d |
| 12. 디자인 시스템 | 21 | 22d |
| 13. 웹 UI — 보호자 | 29 (✨+3) | 59d |
| 14. 웹 UI — 당사자 (접근성) | 10 | 19d |
| 15. 웹 UI — 전문가 4역할 | 41 | 100d |
| 16. 모바일 앱 (RN) | 33 | 83.5d |
| 17. SEO·보안·접근성 | 17 (✨+2) | 25d |
| 18. QA·테스트 | 17 | 48.5d |
| 19. CI/CD·배포 | 14 | 23d |
| **합계** | **402 작업 (✨+21)** | **665.5 person-day** |

> 기존 381개 작업 전부 유지 + v1.1 테스트 신규 5개(0.13·0.14·11.5.1·11.5.2·11.5.3) + v1.1 거버넌스 신규 16개(1.1.14·1.1.15·1.1.16·1.2.6·1.2.7·2.12·2.13·3.2.10·5.G.1·11.9·11.10·13.1.7·13.1.8·13.3.6·17.2.9·17.4.1) = **402 작업**. 거버넌스 16개로 +22.5 person-day(643.0→665.5). (※ 공수 합계는 전 작업 행 실측 기준 — `scripts/gen-wbs-assets.py` 파싱과 일치) 7인 병렬·Gantt 기준 캘린더 약 16주. MVP(P0)만 추리면 부록 B 참조(약 295d). 담당자별 부하는 09-wbs-github.md 참조(파생자산은 본 md 기준 재생성 대상).
>
> **거버넌스 신규 16개 우선순위:** P0 = 1.1.14·1.1.15·1.1.16·1.2.6·1.2.7·2.12·2.13·5.G.1·11.9·13.1.7·17.2.9 (11개), P1 = 3.2.10·11.10·13.1.8·13.3.6·17.4.1 (5개).

---

## 범례

- 🟦 **C** = Create (신규 작성)
- 🟩 **R** = Read 단건 (상세 조회)
- 🟨 **L** = List (목록 조회 + 필터/검색/페이징)
- 🟧 **U** = Update (수정)
- 🟥 **D** = Delete / Archive (삭제 또는 보관)
- 🔀 **B** = Bulk / 일괄 처리
- 🔐 **P** = Permission Check (RLS / 권한 검증 / 동의·고유식별정보 통제)
- ✨ **NEW** = v1.1 신규 작업 (테스트 내재화 5개 + 개인정보 거버넌스 16개)

---

## V1.1 구현 순서 (단위→통합→E2E 테스트 내재화)

```
Phase 0   프로젝트 셋업 + CI 기초     → 테스트 환경·CI 파이프라인 우선 구축
Phase 1   DB 스키마 + RLS            → pgTAP 즉시 검증
Phase 2   인증 (Auth)               → Vitest 단위 + Supertest 통합
Phase 3   사용자·당사자·매핑          → 단위 + 실 Supabase DB 통합
Phase 4   권한 관리                  → RLS pgTAP + API 통합
Phase 5~11 기록·자기표현·파일·이정표·인수인계·알림·감사 → 각 Phase 단위·통합 동시
Phase 11.5 백엔드 통합 테스트 체크포인트 [✨ 신규]
Phase 12  디자인 시스템              → Storybook + 스냅샷
Phase 13  웹 UI 보호자               → Playwright E2E 동시
Phase 14  웹 UI 당사자               → WCAG 2.1 AA + E2E
Phase 15  웹 UI 전문가 4역할          → 역할별 E2E
Phase 16  모바일 앱 (RN)            → Detox E2E + Jest
Phase 17  SEO·보안·접근성           → axe-core + OWASP ZAP
Phase 18  QA·테스트                 → Zero Script QA + 성능
Phase 19  CI/CD·배포                → Phase 0 파이프라인 완성
```

---

# 0. 프로젝트 셋업 + CI 기초 (Phase 0)

> 🧪 **테스트 전략:** 코드 작성 전에 테스트 인프라(Vitest·Playwright·pgTAP)와 CI 파이프라인(lint+type+test)을 먼저 구축한다. 이후 **모든 Phase에서 단위 테스트를 구현과 함께 작성**하는 것을 팀 원칙으로 수립한다. 0.13·0.14가 이 원칙의 토대다.

| ID | 작업 | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|-------|:---:|:---:| :-------- | :-------- | :----: |
| 0.1 | Git 저장소 초기화 + .gitignore + README | 빈 저장소 | XS | P0 | 모노레포 Git 저장소 초기화. .gitignore(node_modules·.env·빌드 산출물·.expo), README에 서비스 개요·로컬 실행법·환경 구성 명시. 참고: CLAUDE.md(하네스 정의) | `프로젝트 루트에 모노레포 Git 저장소를 초기화하세요. .gitignore에 node_modules·.env*·빌드 산출물·.expo를 추가하고, README.md에 OnDol 서비스 개요·로컬 실행법·환경 구성을 작성하세요. CLAUDE.md 하네스 정의를 참고하세요.` | PL |
| 0.2 | 기술 스택 확정 문서 작성 | docs/10-tech-stack.md | S | P0 | 프론트(Next.js App Router)·모바일(Expo RN)·백엔드(Supabase/bkend.ai)·DB(PostgreSQL+RLS) 스택 확정 및 근거 문서화. 참고: docs/02-data-specification.md, docs/03-erd.md, docs/10-tech-stack.md | `docs/10-tech-stack.md에 기술 스택 확정 문서를 작성/갱신하세요. 프론트 Next.js App Router·모바일 Expo RN·백엔드 Supabase·DB PostgreSQL+RLS·서버상태 TanStack Query·폼 RHF+Zod·이메일 Resend를 근거와 함께 정리하세요. docs/02·03을 참고하세요.` | PL |
| 0.3 | Next.js (App Router) 프로젝트 부팅 | apps/web | S | P0 | apps/web 에 Next.js App Router 프로젝트 부팅(라우팅·서버컴포넌트 구조). 참고: docs/06-information-architecture.md §4 반응형 웹 IA | `apps/web에 Next.js App Router 프로젝트를 부팅하세요. 라우팅·서버컴포넌트 구조를 docs/06-information-architecture.md §4 반응형 웹 IA에 맞춰 구성하고, 루트 레이아웃 렌더 스모크 테스트를 Vitest로 작성하세요.` | PL |
| 0.4 | React Native (Expo) 프로젝트 부팅 | apps/mobile | S | P0 | apps/mobile 에 Expo 기반 RN 앱 부팅(네비게이션 스택·탭). 참고: docs/06-information-architecture.md §5 모바일 앱 IA | `apps/mobile에 Expo 기반 RN 앱을 부팅하세요. 네비게이션 스택·탭 구조를 docs/06-information-architecture.md §5 모바일 앱 IA에 맞춰 구성하고, 루트 컴포넌트 렌더 Jest 테스트를 작성하세요.` | PL |
| 0.5 | Supabase 프로젝트 생성 + 환경 변수 분리 | .env.{dev,stg,prod} | S | P0 | Supabase 프로젝트 생성 후 dev/stg/prod 3환경 분리(.env.dev/.stg/.prod). 키·URL 환경변수화. 참고: docs/03-erd.md §RLS 정책 요약 | `Supabase 프로젝트를 생성하고 .env.dev/.env.stg/.env.prod 3환경으로 분리하세요. SUPABASE_URL·ANON_KEY·SERVICE_ROLE_KEY를 환경변수화하고 .env.example을 추가하세요. 키 누락 시 부팅 실패하는 env 검증 유틸과 단위 테스트를 작성하세요.` | PL |
| 0.6 | bkend.ai BaaS 연동 (또는 Supabase 직접) | lib/supabase.ts | S | P0 | bkend.ai BaaS(또는 Supabase 직접) 클라이언트 래퍼 구현 — 인증·DB·스토리지 SDK 초기화. 참고: docs/02-data-specification.md §1 테이블 목록, bkit:bkend-quickstart 스킬 | `packages/shared/lib/supabase.ts에 Supabase 클라이언트 래퍼를 구현하세요. 인증·DB·스토리지 SDK를 초기화하고 서버/브라우저 클라이언트를 분리하세요. 클라이언트 생성·env 주입을 Vitest로 모킹 테스트하세요. docs/02 §1 테이블 목록 참고.` | PL |
| 0.7 | TypeScript 컨벤션 + ESLint + Prettier | .eslint.json | XS | P0 | TypeScript strict + ESLint + Prettier 규칙 정립(AI 협업용 코딩 컨벤션). 참고: bkit:phase-2-convention 스킬 | `루트에 TypeScript strict tsconfig·ESLint·Prettier 설정을 추가하세요. import 정렬·미사용 변수 금지·any 경고 규칙을 포함하고, lint·format npm 스크립트를 정의하세요. CI에서 호출되도록 구성하세요.` | PL |
| 0.8 | 폴더 구조 컨벤션 문서 | docs/structure.md | XS | P0 | 도메인 기반 폴더 구조(features/·lib/·components/·app/) 컨벤션 문서화. | `docs/structure.md에 도메인 기반 폴더 구조 컨벤션을 작성하세요. features/·lib/·components/·app/ 레이어 책임과 import 방향 규칙을 명시하고, web·mobile·shared 패키지 매핑을 표로 정리하세요.` | PL |
| 0.9 | 모노레포 (pnpm workspaces) | pnpm-workspace.yaml | S | P1 | pnpm workspaces 로 web·mobile·shared(타입·API 클라이언트·검증 스키마) 패키지 공유 구성. | `pnpm-workspace.yaml로 모노레포를 구성하세요. apps/web·apps/mobile·packages/shared(타입·API 클라이언트·Zod 스키마) 패키지를 등록하고, shared 패키지 import가 web/mobile에서 동작하는지 검증 테스트를 작성하세요.` | PL |
| 0.10 | Vercel/Render 배포 환경 셋업 | deploy config | S | P1 | Vercel(웹)·EAS/Render(모바일·서버) 배포 환경 사전 셋업. 참고: §19 CI/CD | `Vercel(웹)·EAS/Render(모바일·서버) 배포 설정 파일을 추가하세요. 환경별 빌드 커맨드·env 매핑을 정의하세요. Phase 19에서 완성할 기반이므로 최소 구성만 두세요. §19 CI/CD 참고.` | PL |
| 0.11 | 에러 모니터링 (Sentry) 연동 | sentry config | S | P1 | Sentry 연동 — 웹·모바일·서버 런타임 에러 트래킹 및 소스맵 업로드. | `웹·모바일·서버에 Sentry를 연동하세요. DSN을 env로 주입하고 소스맵 업로드를 CI에 연결하세요. 의도적 에러를 던져 캡처되는지 확인하는 통합 테스트를 작성하세요.` | PL |
| 0.12 | i18n 셋업 (한국어 기본, 추후 영어) | i18n config | S | P2 | i18n 셋업(한국어 기본, 영어 차기 릴리스). 참고: docs/07-design-system.md §2 타이포그래피(Pretendard) | `i18n을 셋업하세요. 한국어를 기본 로케일로, 영어를 차기 릴리스 placeholder로 구성하세요. 번역 키 누락 감지 유틸과 단위 테스트를 작성하세요. docs/07 §2 Pretendard 타이포 참고.` | PL |
| 0.13 ✨ NEW | Vitest + Playwright + pgTAP 테스트 환경 셋업 | test config | M | P0 | 단위(Vitest)·E2E(Playwright)·DB(pgTAP) 3계층 테스트 환경 셋업. 테스트 디렉터리 컨벤션·실행 스크립트·커버리지 리포트·CI 연동 준비. 이후 모든 Phase가 이 인프라 위에서 테스트를 작성한다. | `루트에 3계층 테스트 환경을 셋업하세요. (1) Vitest 단위 테스트 설정+커버리지(c8), (2) Playwright E2E 설정(브라우저·baseURL), (3) Supabase pgTAP 마이그레이션 테스트 러너. 각 계층 npm 스크립트(test:unit·test:e2e·test:db)와 샘플 통과 테스트 1개씩, 테스트 디렉터리 컨벤션을 docs/structure.md에 추가하세요.` | PL |
| 0.14 ✨ NEW | GitHub Actions 기본 파이프라인 (lint+type+test) | .github/workflows/ci.yml | S | P0 | PR마다 lint·typecheck·단위/통합 테스트를 실행하는 GitHub Actions 기본 파이프라인. Phase 19에서 PR 프리뷰·배포까지 확장한다. | `.github/workflows/ci.yml에 GitHub Actions 기본 파이프라인을 작성하세요. PR·push 트리거로 pnpm install→lint→typecheck→test:unit→test:db(pgTAP)를 순차 실행하고, Supabase 로컬 컨테이너를 띄워 DB 테스트를 돌리세요. 실패 시 머지 차단되도록 status check를 설정하세요.` | PL |

---

# 1. DB 스키마 + RLS (Phase 1)

> 🧪 **테스트 전략:** 각 마이그레이션 작성 직후 **pgTAP로 스키마(컬럼·타입·제약·FK)와 RLS 정책을 즉시 검증**한다. 테스트 없는 마이그레이션은 머지 금지.

## 1.1 마이그레이션 — 핵심 테이블

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 1.1.1 | `users` 테이블 생성 | 🟦 | migration | XS | P0 | users 테이블 — 모든 역할(보호자·당사자·전문가)의 계정. role enum·email·phone·status. 참고: docs/02-data-specification.md §2 핵심 테이블 상세(users), docs/03-erd.md | `supabase/migrations/에 users 테이블 마이그레이션을 작성하세요. role(guardian/person/expert/admin) enum, email unique, phone, status(active/inactive/pending) 컬럼 포함. docs/02 §2 users 상세 스키마를 정확히 따르세요. pgTAP로 컬럼 존재·타입·unique 제약을 검증하세요.` | PL |
| 1.1.2 | `persons` 테이블 생성 | 🟦 | migration | XS | P0 | persons 테이블 — 기록의 주체인 당사자. birth_date·life_stage(생애주기)·emergency_info(JSONB). 참고: docs/02 §2(persons), §4 Enum(life_stage) | `supabase/migrations/에 persons 테이블 마이그레이션을 작성하세요. birth_date, life_stage enum(영유아~노년 6단계), emergency_info JSONB 컬럼 포함. docs/02 §2(persons)·§4 Enum(life_stage)을 따르세요. pgTAP로 컬럼·enum 값·JSONB 타입을 검증하세요.` | PL |
| 1.1.3 | `guardian_persons` 연결 테이블 | 🟦 | migration | XS | P0 | guardian_persons — 보호자↔당사자 N:M 매핑, is_primary(주보호자)·relationship. 참고: docs/02 §2(guardian_persons), docs/03-erd.md §도메인별 서브 ERD | `supabase/migrations/에 guardian_persons N:M 매핑 테이블을 작성하세요. guardian_id·person_id FK, is_primary boolean, relationship enum 포함. docs/02 §2를 따르세요. pgTAP로 복합 unique·FK·당사자별 단일 주보호자 제약을 검증하세요.` | PL |
| 1.1.4 | `person_accounts` 테이블 | 🟦 | migration | XS | P0 | person_accounts — 당사자 선택적 로그인 계정 + 접근성 설정(ui_mode·font_scale·contrast). 참고: docs/02 §2(person_accounts), docs/07 §9 당사자 접근성 모드 | `supabase/migrations/에 person_accounts 테이블을 작성하세요. person_id FK, ui_mode·font_scale·contrast 접근성 설정 컬럼 포함. docs/02 §2(person_accounts)·docs/07 §9를 따르세요. pgTAP로 컬럼·기본값·FK를 검증하세요.` | PL |
| 1.1.5 | `permissions` 테이블 | 🟦 | migration | XS | P0 | permissions — 권한 매트릭스 핵심. domain·access_level·valid_from/until. 참고: docs/02 §2(permissions), §4 Enum(domain·access_level) | `supabase/migrations/에 permissions 테이블을 작성하세요. user_id·person_id, domain enum(6종), access_level enum(read/write/edit/admin), valid_from·valid_until 포함. docs/02 §2·§4 Enum을 따르세요. pgTAP로 enum 값·기간 컬럼을 검증하세요.` | PL |
| 1.1.6 | `permission_logs` 테이블 | 🟦 | migration | XS | P0 | permission_logs — 권한 부여/수정/회수 이력(감사 추적). 참고: docs/02 §2(permission_logs), docs/05-workflows-feature.md §2·§3 | `supabase/migrations/에 permission_logs 테이블을 작성하세요. permission_id·action(grant/update/revoke)·actor·before/after JSONB·created_at 포함. docs/02 §2·docs/05 §2·§3을 따르세요. pgTAP로 컬럼·action enum을 검증하세요.` | PL |
| 1.1.7 | `records` 테이블 (JSONB content) | 🟦 | migration | S | P0 | records — 6도메인 기록 공통 테이블. domain·record_type·content(JSONB)·is_draft·is_milestone. 참고: docs/02 §2(records), §3 JSONB content 스키마 | `supabase/migrations/에 records 공통 테이블을 작성하세요. person_id·domain enum·record_type·content JSONB·is_draft·is_milestone·is_pinned·author_id 포함. docs/02 §2(records)를 따르세요. pgTAP로 컬럼·enum·JSONB·기본값을 검증하세요.` | 개발자 B |
| 1.1.8 | `self_expressions` 테이블 | 🟦 | migration | XS | P0 | self_expressions — 당사자 자기표현(날짜별 UNIQUE). mood·activities·content(JSONB). 참고: docs/02 §2(self_expressions), §3 JSONB | `supabase/migrations/에 self_expressions 테이블을 작성하세요. person_id·date(person_id+date UNIQUE)·mood·activities·content JSONB 포함. docs/02 §2·§3을 따르세요. pgTAP로 날짜별 unique 제약·JSONB 타입을 검증하세요.` | 개발자 B |
| 1.1.9 | `record_files` 테이블 | 🟦 | migration | XS | P0 | record_files — 기록·자기표현 첨부 파일 메타. storage_path·is_sensitive·mime. 참고: docs/02 §2(record_files), docs/05 §5 파일 첨부 | `supabase/migrations/에 record_files 테이블을 작성하세요. record_id·self_expression_id(nullable FK)·storage_path·mime·is_sensitive boolean 포함. docs/02 §2를 따르세요. pgTAP로 컬럼·FK·is_sensitive 기본값을 검증하세요.` | 개발자 B |
| 1.1.10 | `life_milestones` 테이블 | 🟦 | migration | XS | P0 | life_milestones — 생애주기 이정표(진단·입학·졸업 등). category·event_date. 참고: docs/02 §2(life_milestones), docs/05 §6 타임라인 | `supabase/migrations/에 life_milestones 테이블을 작성하세요. person_id·category enum·event_date·title·description 포함. docs/02 §2(life_milestones)를 따르세요. pgTAP로 컬럼·category enum·FK를 검증하세요.` | 개발자 A |
| 1.1.11 | `handovers` 테이블 | 🟦 | migration | XS | P0 | handovers — 전문가 인수인계. domain·summary·linked_record_ids·is_confirmed. 참고: docs/02 §2(handovers), docs/05 §7 인수인계 | `supabase/migrations/에 handovers 테이블을 작성하세요. person_id·domain·from_user·to_user·summary·linked_record_ids(uuid[])·is_confirmed 포함. docs/02 §2·docs/05 §7을 따르세요. pgTAP로 컬럼·배열 타입·is_confirmed 기본값을 검증하세요.` | 개발자 A |
| 1.1.12 | `access_logs` 테이블 (INSERT-only) | 🟦 | migration | XS | P0 | access_logs — INSERT-only 접근 로그(불변). actor·action·target. 참고: docs/02 §2(access_logs), docs/03 §RLS 정책 요약 | `supabase/migrations/에 access_logs 테이블을 작성하세요. actor·action(read/write)·target_table·target_id·created_at 포함. docs/02 §2·docs/03 §RLS를 따르세요. pgTAP로 컬럼과 INSERT-only(UPDATE/DELETE 차단) 정책을 검증하세요.` | PL |
| 1.1.13 | `notifications` 테이블 | 🟦 | migration | XS | P0 | notifications — 알림. type·payload(JSONB)·self_expression_id FK·is_read. 참고: docs/02 §2(notifications), §3 JSONB, docs/05 §8 알림 | `supabase/migrations/에 notifications 테이블을 작성하세요. user_id·type·payload JSONB·self_expression_id(nullable FK)·is_read 포함. docs/02 §2·§3·docs/05 §8을 따르세요. pgTAP로 컬럼·FK·is_read 기본값을 검증하세요.` | 개발자 A |
| 1.1.14 ✨ NEW | `secure_identifiers` 테이블 (고유식별정보 암호화 저장) | 🟦 | migration | XS | P0 | secure_identifiers — 고유식별정보(장애 등록번호·증명서 문서번호)를 records.content 평문에서 분리해 암호화 저장(PIPA §24). person_id·identifier_type enum·encrypted_value(BYTEA)·value_masked·encryption_ref·deleted_at. 참고: docs/02 §2.14, docs/16 §3.2 | `supabase/migrations/에 secure_identifiers 테이블을 작성하세요. person_id FK, identifier_type enum(secure_identifier_type), encrypted_value BYTEA(평문 저장 금지), value_masked·encryption_ref·deleted_at 포함. docs/02 §2.14·docs/16 §3.2를 따르세요. pgTAP로 컬럼·enum·BYTEA 타입·평문 컬럼 부재를 검증하세요.` | PL |
| 1.1.15 ✨ NEW | `consents` 테이블 (동의 이력) | 🟦 | migration | XS | P0 | consents — 필수/선택·민감·고유식별 별도 동의 이력(PIPA §22~24). consent_type enum·subject_user_id XOR person_id·is_required·granted·consented_by·on_behalf·legal_basis·policy_version·consented_at·revoked_at·deleted_at. 참고: docs/02 §2.15, docs/16 §2 | `supabase/migrations/에 consents 테이블을 작성하세요. consent_type enum(consent_type), subject_user_id XOR person_id(CHECK), is_required·granted·consented_by·on_behalf·legal_basis·policy_version·consented_at·revoked_at·deleted_at 포함. docs/02 §2.15·docs/16 §2를 따르세요. pgTAP로 컬럼·enum·XOR CHECK 제약을 검증하세요.` | PL |
| 1.1.16 ✨ NEW | `deleted_at` 컬럼 + soft-delete 부분 인덱스 | 🟧 | migration | S | P0 | 사용자 대면 엔티티(persons·records·self_expressions·record_files·guardian_persons·person_accounts·secure_identifiers·consents)에 deleted_at TIMESTAMPTZ NULL 추가 + `WHERE deleted_at IS NULL` 부분 인덱스·부분 유니크 인덱스. append-only 로그(access_logs·permission_logs)는 제외. 참고: docs/02 §5 인덱스 전략·deleted_at, docs/16 §4.3 | `supabase/migrations/에 사용자 대면 테이블(persons·records·self_expressions·record_files·guardian_persons·person_accounts·secure_identifiers·consents)에 deleted_at TIMESTAMPTZ NULL 컬럼과 docs/02 §5의 부분 인덱스(idx_*_active)·부분 유니크 인덱스를 추가하세요. access_logs·permission_logs는 제외. docs/16 §4.3을 따르세요. pgTAP로 컬럼 존재·부분 유니크(파기 후 재연결 허용)를 검증하세요.` | PL |

## 1.2 RLS 정책

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 1.2.1 | `records` SELECT RLS (보호자/당사자/권한자) | 🔐 | RLS policy | M | P0 | records SELECT RLS — 보호자(매핑)·당사자 본인·권한자(permissions 유효기간 내)만 조회. 참고: docs/03 §RLS 정책 요약, docs/02 §6 제약조건 | `supabase/migrations/에 records SELECT RLS 정책을 작성하세요. 보호자(guardian_persons 매핑)·당사자 본인·권한자(permissions valid 기간 내)만 조회 가능하게 하세요. docs/03 §RLS를 따르세요. pgTAP로 3역할 허용·무권한 차단·만료 권한 차단 시나리오를 검증하세요.` | PL |
| 1.2.2 | `records` INSERT/UPDATE RLS | 🔐 | RLS policy | S | P0 | records INSERT/UPDATE RLS — 도메인·access_level(write 이상) 검증. 참고: docs/03 §RLS, docs/05 §4 기록 작성 공통 | `supabase/migrations/에 records INSERT/UPDATE RLS 정책을 작성하세요. 해당 도메인에 write 이상 access_level을 가진 사용자만 작성/수정 가능하게 하세요. docs/03 §RLS·docs/05 §4를 따르세요. pgTAP로 write 허용·read 차단을 검증하세요.` | PL |
| 1.2.3 | `self_expressions` 당사자 본인만 작성 | 🔐 | RLS policy | S | P0 | self_expressions RLS — 당사자 본인 계정만 작성/수정(당일). 참고: docs/03 §RLS, docs/04-workflows-user.md §2 당사자 | `supabase/migrations/에 self_expressions RLS 정책을 작성하세요. 당사자 본인 person_account만 작성·당일 수정 가능, 타인 작성 차단. docs/03 §RLS·docs/04 §2를 따르세요. pgTAP로 본인 작성 허용·타인 차단·익일 수정 차단을 검증하세요.` | PL |
| 1.2.4 | `access_logs` INSERT-only 정책 | 🔐 | RLS policy | XS | P0 | access_logs INSERT-only 정책 — UPDATE/DELETE 차단으로 로그 불변성 보장. 참고: docs/03 §RLS, §17.2.8 | `supabase/migrations/에 access_logs INSERT-only RLS 정책을 작성하세요. INSERT만 허용하고 UPDATE·DELETE를 전면 차단해 불변성을 보장하세요. docs/03 §RLS·§17.2.8을 따르세요. pgTAP로 INSERT 허용·UPDATE/DELETE 차단을 검증하세요.` | PL |
| 1.2.5 | `permissions` 보호자만 변경 가능 | 🔐 | RLS policy | S | P0 | permissions 변경 RLS — 주보호자만 권한 부여/회수 가능. 참고: docs/03 §RLS, docs/05 §2 권한 부여 | `supabase/migrations/에 permissions 변경 RLS 정책을 작성하세요. 해당 당사자의 주보호자(is_primary)만 INSERT/UPDATE/DELETE 가능하게 하세요. docs/03 §RLS·docs/05 §2를 따르세요. pgTAP로 주보호자 허용·일반 보호자 차단을 검증하세요.` | PL |
| 1.2.6 ✨ NEW | soft-delete 가시성 RLS (`deleted_at IS NULL` 게이트) | 🔐 | RLS policy | S | P0 | 사용자 대면 테이블 SELECT 정책 USING 절에 `deleted_at IS NULL`을 AND 결합해 파기 행을 권한자에게도 미노출. 기존 접근 주체 조건(보호자/본인/권한자)은 유지하고 가시성 게이트만 덧댐. 참고: docs/13 §4.2, docs/16 §4.3 | `supabase/migrations/에 soft-delete 가시성 RLS를 적용하세요. records·self_expressions·record_files·persons·secure_identifiers·consents·매핑 테이블의 SELECT 정책 USING 절에 deleted_at IS NULL을 AND로 결합해 파기 행을 모든 권한자에게 미노출하세요. docs/13 §4.2를 따르세요. pgTAP로 파기 행이 보호자·본인·권한자 SELECT 모두에서 제외됨을 검증하세요.` | PL |
| 1.2.7 ✨ NEW | `secure_identifiers`/`consents` RLS + 복호화 통제 | 🔐 | RLS policy | S | P0 | secure_identifiers는 records와 동일 주체 매핑으로 행 접근하되 SELECT는 value_masked만 노출(원문 비노출), encrypted_value 복호화는 service_role/Edge Function 권한 재검증 후에만. consents는 동의 주체 본인·법정대리인·주보호자 접근, 철회는 행 삭제가 아닌 granted=false 신규 행. 참고: docs/13 §3.5, docs/16 §3.2·§2 | `supabase/migrations/에 secure_identifiers·consents RLS 정책을 작성하세요. secure_identifiers: records와 동일 주체 매핑 SELECT(value_masked만), INSERT/UPDATE는 write 이상·보호자, 물리 DELETE는 service_role, 복호화 함수 EXECUTE는 보호자·권한자 한정(authenticated 제외). consents: 동의 주체·법정대리인·주보호자 SELECT/INSERT, 철회는 granted=false 신규 행. docs/13 §3.5·docs/16 §3.2를 따르세요. pgTAP로 원문 비노출·복호화 EXECUTE 제한·동의 주체 접근을 검증하세요.` | PL |

---

# 2. 인증 (Auth)

> 🧪 **테스트 전략:** 각 API 구현 즉시 **Vitest 단위 테스트(검증·분기 로직) + Supertest 통합 테스트(엔드포인트 요청/응답)**를 함께 작성한다.

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 2.1 | 이메일/비밀번호 회원가입 API | 🟦 | POST /signup | S | P0 | 이메일/비밀번호 회원가입. role 선택 분기(보호자·당사자·전문가). users insert + 이메일 인증 트리거. 참고: docs/05 §1 회원가입 & 역할별 온보딩, wireframes/web/11-signup-role.svg | `POST /signup 핸들러를 apps/web/app/api에 구현하세요. role 분기(guardian/person/expert), email/password 가입, users insert, 이메일 인증 트리거 포함. Zod로 입력 검증하세요. docs/05 §1을 따르고, Vitest 단위(검증)+Supertest 통합 테스트를 작성하세요.` | 개발자 A |
| 2.2 | 이메일/비밀번호 로그인 API | 🟦 | POST /login | S | P0 | 이메일/비밀번호 로그인 + JWT 발급·세션. 참고: docs/04 §7 역할별 진입점 비교, wireframes/web/01-login.svg | `POST /login 핸들러를 구현하세요. Supabase Auth로 이메일/비밀번호 검증·JWT·세션 발급. Zod 입력 검증, 실패 시 401. bkit:bkend-auth 스킬 참고. Vitest 단위+Supertest 통합(성공·실패) 테스트를 작성하세요.` | 개발자 A |
| 2.3 | 로그아웃 API | 🟥 | POST /logout | XS | P0 | 로그아웃 — 세션/토큰 무효화. 참고: bkit:bkend-auth 스킬 | `POST /logout 핸들러를 구현하세요. 현재 세션/토큰을 무효화하고 쿠키를 정리하세요. bkit:bkend-auth 스킬 참고. Supertest로 로그아웃 후 보호 라우트 접근이 401인지 통합 테스트하세요.` | 개발자 A |
| 2.4 | 이메일 인증 발송 API | 🟦 | POST /verify-email | S | P0 | 이메일 인증 메일 발송(토큰 생성·만료). 참고: docs/05 §1, wireframes/web/13-signup-verify.svg | `POST /verify-email 핸들러를 구현하세요. 인증 토큰 생성·만료시간 설정·Resend로 메일 발송. docs/05 §1을 따르세요. Resend를 모킹해 Vitest 단위(토큰 생성)+Supertest 통합 테스트를 작성하세요.` | 개발자 A |
| 2.5 | 이메일 인증 확인 API | 🟧 | POST /verify-email/confirm | S | P0 | 이메일 인증 토큰 확인 + users.status 활성화. 참고: docs/05 §1 온보딩, wireframes/web/13-signup-verify.svg | `POST /verify-email/confirm 핸들러를 구현하세요. 토큰 검증·만료 확인 후 users.status를 active로 변경. docs/05 §1을 따르세요. Supertest로 유효·만료·위조 토큰 케이스를 통합 테스트하세요.` | 개발자 A |
| 2.6 | 비밀번호 재설정 요청 API | 🟦 | POST /reset-password | S | P0 | 비밀번호 재설정 요청(재설정 토큰 메일). 참고: wireframes/web/15-reset-password.svg | `POST /reset-password 핸들러를 구현하세요. 이메일로 재설정 토큰 메일 발송(Resend), 미존재 계정도 동일 응답(열거 방지). Vitest 단위+Supertest 통합 테스트를 작성하세요.` | 개발자 A |
| 2.7 | 비밀번호 재설정 확인 API | 🟧 | POST /reset-password/confirm | S | P0 | 비밀번호 재설정 확인 + 해시 갱신. 참고: wireframes/web/15-reset-password.svg | `POST /reset-password/confirm 핸들러를 구현하세요. 토큰 검증 후 새 비밀번호 해시 갱신·기존 세션 무효화. Zod로 비밀번호 정책 검증. Supertest로 유효·만료 토큰 통합 테스트를 작성하세요.` | 개발자 A |
| 2.8 | 초대 링크 생성 API | 🟦 | POST /invites | S | P0 | 초대 링크 생성 — 보호자가 전문가/공동보호자 초대(토큰·도메인·만료). 참고: docs/05 §1 온보딩·§2 권한 부여 | `POST /invites 핸들러를 구현하세요. 보호자가 전문가/공동보호자를 초대 — 토큰·도메인·만료시간 생성 후 초대 메일 발송. docs/05 §1·§2를 따르세요. Vitest 단위+Supertest 통합 테스트를 작성하세요.` | 개발자 A |
| 2.9 | 초대 링크 수락 API (회원가입 분기) | 🟦 | POST /invites/:token/accept | M | P0 | 초대 링크 수락 — 토큰 검증 후 신규 가입 또는 기존 계정 연결 분기 + 권한 자동 매핑. 참고: docs/05 §1, wireframes/web/14-invite-accept.svg | `POST /invites/:token/accept 핸들러를 구현하세요. 토큰 검증 후 신규 가입/기존 계정 연결 분기, permissions 자동 매핑. docs/05 §1을 따르세요. Supertest로 신규·기존·만료·위조 토큰 4케이스를 통합 테스트하세요.` | 개발자 A |
| 2.10 | 카카오 소셜 로그인 OAuth | 🟦 | POST /auth/kakao | M | P1 | 카카오 OAuth 소셜 로그인(P1). 참고: docs/04 §7 진입점, bkit:bkend-auth 스킬 | `POST /auth/kakao 카카오 OAuth 로그인을 구현하세요. 콜백에서 프로필 매핑·users upsert·세션 발급. bkit:bkend-auth 스킬 참고. OAuth 응답을 모킹해 Supertest 통합 테스트를 작성하세요.` | 개발자 A |
| 2.11 | 네이버 소셜 로그인 OAuth | 🟦 | POST /auth/naver | M | P1 | 네이버 OAuth 소셜 로그인(P1). 참고: docs/04 §7 진입점, bkit:bkend-auth 스킬 | `POST /auth/naver 네이버 OAuth 로그인을 구현하세요. 콜백에서 프로필 매핑·users upsert·세션 발급. bkit:bkend-auth 스킬 참고. OAuth 응답을 모킹해 Supertest 통합 테스트를 작성하세요.` | 개발자 A |
| 2.12 ✨ NEW | 동의 수집 API (필수/선택·민감·고유식별 분리 INSERT) | 🟦 | POST /consents | M | P0 | 동의 수집 — 회원가입·당사자 등록 시 유형별 분리 레코드 INSERT(PIPA §22⑤ 일괄동의 금지). consent_type별·필수/선택 분리, policy_version 기록, 철회는 granted=false 신규 행. docs/18 준수(에러봉투·Idempotency-Key). 참고: docs/05 §1-3 동의 수집 단계, docs/02 §2.15, docs/16 §2·§3 | `POST /consents 핸들러를 구현하세요. consent_type별 동의를 분리 레코드로 INSERT(필수/선택 일괄동의 금지), subject_user_id XOR person_id·policy_version 기록, 철회 시 granted=false 신규 행. Zod 검증, docs/05 §1-3·docs/02 §2.15·docs/16 §2 따르기. docs/18 준수(data/error 봉투·POST에 Idempotency-Key·422 fields). Supertest로 분리 INSERT·필수 누락 거부·철회 이력 보존을 통합 테스트하세요.` | 개발자 A |
| 2.13 ✨ NEW | 동의 주체 판정 (연령·후견 분기) | 🔐 | service fn | S | P0 | 동의 주체 판정 — 당사자 정보 입력 시 성인 본인 / 만 14세 미만·피후견인 법정대리인 대리동의(on_behalf=true) / 만 14세 이상 미성년자 분기. legal_basis(친권자/성년후견인) 결정. 참고: docs/05 §1-3, docs/16 §2.2 | `동의 주체 판정 서비스 함수를 구현하세요. persons.birth_date·후견 상태(LEG-003)로 성인 본인 / 만 14세 미만·피후견인(법정대리인 on_behalf=true) / 만 14세 이상 미성년자를 분기하고 consented_by·legal_basis를 결정하세요. docs/05 §1-3·docs/16 §2.2 따르기. 각 연령·후견 경계값의 주체 판정을 Vitest 단위 테스트하세요.` | 개발자 A |

---

# 3. 사용자 · 당사자 · 매핑

> 🧪 **테스트 전략:** 단위 테스트 + **실제 Supabase 연동 DB 통합 테스트**. CRUD가 RLS와 함께 올바르게 동작하는지 실 DB에서 검증한다.

## 3.1 사용자 (users)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 3.1.1 | 사용자 프로필 단건 조회 | 🟩 | GET /users/:id | XS | P0 | 사용자 본인/타 사용자 프로필 단건 조회(권한 범위 내). 참고: docs/02 §2(users) | `GET /users/:id 핸들러를 구현하세요. 본인/권한 범위 내 사용자 프로필을 조회하고 민감 필드는 제외하세요. docs/02 §2(users) 참고. Supertest로 본인 조회·범위 외 차단을 실 Supabase 연동 통합 테스트하세요.` | 개발자 A |
| 3.1.2 | 사용자 프로필 수정 | 🟧 | PATCH /users/:id | S | P0 | 사용자 프로필 수정(이름·연락처·프로필 사진). 참고: wireframes/web/24-guardian-profile-edit.svg | `PATCH /users/:id 핸들러를 구현하세요. 본인만 이름·연락처·프로필 사진 수정 가능. Zod 검증. wireframes/web/24 참고. Vitest 단위+Supertest 통합(본인 허용·타인 차단) 테스트를 작성하세요.` | 개발자 A |
| 3.1.3 | 사용자 비활성화 (soft delete) | 🟥 | PATCH /users/:id/deactivate | XS | P0 | 사용자 soft delete(status=inactive) — 데이터 보존, 로그인 차단. 참고: docs/02 §4 Enum(user status) | `PATCH /users/:id/deactivate 핸들러를 구현하세요. status를 inactive로 변경(soft delete)하고 로그인을 차단하되 데이터는 보존하세요. docs/02 §4 참고. Supertest로 비활성 후 로그인 차단을 통합 테스트하세요.` | 개발자 A |
| 3.1.4 | 사용자 검색 (이메일·전화) | 🟨 | GET /users?q= | S | P0 | 이메일·전화번호로 사용자 검색(초대·권한 부여 시). 참고: docs/05 §2 권한 부여 Step1 | `GET /users?q= 검색 핸들러를 구현하세요. 이메일·전화 정확/부분 일치 검색, 결과 최소 정보만 노출. docs/05 §2 권한 부여 Step1 참고. Vitest 단위+Supertest 통합 테스트를 작성하세요.` | 개발자 A |
| 3.1.5 | 역할 기반 사용자 필터 | 🟨 | GET /users?role= | XS | P1 | 역할 기반 사용자 필터(전문가 유형별 등, P1). | `GET /users?role= 역할 필터 핸들러를 구현하세요(P1). role enum별 페이징 목록. Supertest로 role별 필터링 결과를 통합 테스트하세요.` | 개발자 A |

## 3.2 당사자 (persons)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 3.2.1 | 당사자 신규 등록 API | 🟦 | POST /persons | M | P0 | 당사자 신규 등록 — 기본정보·생애주기·응급정보 입력 + guardian_persons 자동 연결. 참고: docs/02 §2(persons), docs/04 §1 보호자, wireframes/web/17-guardian-person-register.svg | `POST /persons 핸들러를 구현하세요. 기본정보·생애주기·응급정보 입력 후 persons insert + guardian_persons 주보호자 자동 연결을 트랜잭션으로 처리하세요. Zod 검증, docs/02 §2 따르기. Supertest로 등록·연결 일관성을 실 DB 통합 테스트하세요.` | 개발자 A |
| 3.2.2 | 당사자 단건 조회 | 🟩 | GET /persons/:id | S | P0 | 당사자 상세 조회(프로필·요약). 참고: wireframes/web/16-guardian-person-profile.svg | `GET /persons/:id 핸들러를 구현하세요. 당사자 프로필·요약을 권한 범위 내 조회. wireframes/web/16 참고. Supertest로 권한자 조회·무권한 차단을 통합 테스트하세요.` | 개발자 A |
| 3.2.3 | 당사자 목록 조회 (보호자 기준) | 🟨 | GET /persons?guardian= | S | P0 | 보호자 기준 담당 당사자 목록(대시보드 진입점). 참고: docs/04 §1 보호자, wireframes/web/02-guardian-dashboard.svg | `GET /persons?guardian= 핸들러를 구현하세요. 보호자 기준 담당 당사자 목록(대시보드용)을 guardian_persons 조인으로 반환. docs/04 §1 참고. Supertest로 본인 매핑 당사자만 반환되는지 통합 테스트하세요.` | 개발자 A |
| 3.2.4 | 당사자 기본정보 수정 | 🟧 | PATCH /persons/:id | S | P0 | 당사자 기본정보 수정. 참고: wireframes/web/25-guardian-person-edit.svg | `PATCH /persons/:id 핸들러를 구현하세요. 당사자 기본정보를 권한자만 수정. Zod 검증. wireframes/web/25 참고. Supertest로 권한자 수정·무권한 차단을 통합 테스트하세요.` | 개발자 A |
| 3.2.5 | 당사자 응급정보 수정 (별도 권한) | 🟧 | PATCH /persons/:id/emergency | M | P0 | 당사자 응급정보(혈액형·알레르기·복약·비상연락) 수정 — 추가 인증 필요. 참고: docs/02 §3 JSONB(emergency), §17.2.5, wireframes/web/26-guardian-emergency-edit.svg | `PATCH /persons/:id/emergency 핸들러를 구현하세요. emergency_info JSONB(혈액형·알레르기·복약·비상연락) 수정 시 PIN/생체 추가 인증을 요구하세요. docs/02 §3·§17.2.5 따르기. Supertest로 인증 통과·미통과 케이스를 통합 테스트하세요.` | 개발자 A |
| 3.2.6 | 당사자 사진 업로드 | 🟦 | POST /persons/:id/photo | S | P0 | 당사자 프로필 사진 업로드(presigned URL). 참고: docs/05 §5 파일 첨부 | `POST /persons/:id/photo 핸들러를 구현하세요. presigned URL 발급 후 업로드 완료 시 persons.photo_path 갱신. docs/05 §5 참고. Supertest로 presign 발급·메타 갱신을 통합 테스트하세요.` | 개발자 A |
| 3.2.7 | 당사자 사진 삭제 | 🟥 | DELETE /persons/:id/photo | XS | P0 | 당사자 프로필 사진 삭제(storage+meta). | `DELETE /persons/:id/photo 핸들러를 구현하세요. 스토리지 객체와 persons.photo_path를 동시 삭제하세요. Supertest로 삭제 후 객체·메타 부재를 통합 테스트하세요.` | 개발자 A |
| 3.2.8 | 당사자 비활성화 (이장) | 🟥 | PATCH /persons/:id/archive | S | P1 | 당사자 비활성화/이장(archive) — 사망·이전 등(P1). 참고: docs/05 §10 당사자 전환기 처리 | `PATCH /persons/:id/archive 핸들러를 구현하세요(P1). 당사자를 archive 상태로 전환(사망·이전), 데이터 보존·신규 기록 차단. docs/05 §10 참고. Supertest로 archive 후 쓰기 차단을 통합 테스트하세요.` | 개발자 A |
| 3.2.9 | 당사자 생애주기 자동 계산 (트리거) | 🟧 | DB trigger | S | P0 | birth_date 기반 life_stage 자동 계산 DB 트리거(영유아~노년 6단계). 참고: docs/01-record-matrix.md, docs/02 §4 Enum(life_stage) | `supabase/migrations/에 birth_date 기반 life_stage 자동 계산 트리거를 작성하세요. 영유아~노년 6단계로 분류. docs/01·docs/02 §4 Enum 따르기. pgTAP로 각 연령 경계값이 올바른 life_stage로 계산되는지 검증하세요.` | 개발자 A |
| 3.2.10 ✨ NEW | 성년 도달 본인 동의 재취득 | 🟧 | POST /persons/:id/consent-renewal | M | P1 | 성년 전환기(19세) 후견 미개시 당사자의 본인 명의 동의 재취득(docs/05 §10 흐름). 기존 대리동의(on_behalf=true) 유지하되 본인 명의 신규 consents INSERT(subject_user_id=당사자 계정·on_behalf=false), person_accounts.user_id 연결. 참고: docs/05 §10, docs/16 §2.3 | `POST /persons/:id/consent-renewal 핸들러를 구현하세요(P1). 성년 도달·후견 미개시 당사자에 대해 1-3 동의 단계를 재실행해 본인 명의 신규 consents(subject_user_id=당사자 계정·on_behalf=false)를 INSERT하고 person_accounts.user_id를 연결, 기존 대리동의 행은 보존하세요. docs/05 §10·docs/16 §2.3 따르기. docs/18 준수(에러봉투·Idempotency-Key). Supertest로 후견 미개시 분기 재취득·성년후견 개시 시 미실행을 통합 테스트하세요.` | 개발자 A |

## 3.3 보호자-당사자 매핑 (guardian_persons)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 3.3.1 | 보호자-당사자 연결 생성 | 🟦 | POST /guardian-persons | S | P0 | 보호자-당사자 연결 생성(관계·주보호자 여부). 참고: docs/02 §2(guardian_persons) | `POST /guardian-persons 핸들러를 구현하세요. 보호자-당사자 연결을 관계·주보호자 여부와 함께 생성, 중복 매핑 방지. docs/02 §2 따르기. Supertest로 생성·중복 차단을 통합 테스트하세요.` | 개발자 A |
| 3.3.2 | 보호자-당사자 단건 조회 | 🟩 | GET /guardian-persons/:id | XS | P0 | 보호자-당사자 매핑 단건 조회. | `GET /guardian-persons/:id 핸들러를 구현하세요. 매핑 단건을 권한 범위 내 조회. Supertest로 조회·무권한 차단을 통합 테스트하세요.` | 개발자 A |
| 3.3.3 | 당사자별 보호자 목록 | 🟨 | GET /persons/:id/guardians | S | P0 | 당사자별 보호자 목록(공동 양육 지원). 참고: docs/03 §도메인별 서브 ERD | `GET /persons/:id/guardians 핸들러를 구현하세요. 당사자별 보호자 목록(공동 양육)을 관계·주보호자 표시와 함께 반환. docs/03 서브 ERD 참고. Supertest로 목록·정렬을 통합 테스트하세요.` | 개발자 A |
| 3.3.4 | 주보호자 변경 | 🟧 | PATCH /guardian-persons/:id/primary | S | P0 | 주보호자(is_primary) 변경 — 단일 주보호자 제약. 참고: docs/02 §6 제약조건 | `PATCH /guardian-persons/:id/primary 핸들러를 구현하세요. is_primary 이전을 트랜잭션으로 처리해 당사자별 단일 주보호자 제약을 보장하세요. docs/02 §6 따르기. Supertest로 변경 후 기존 주보호자 해제를 통합 테스트하세요.` | 개발자 A |
| 3.3.5 | 관계(부/모/후견인) 수정 | 🟧 | PATCH /guardian-persons/:id | XS | P0 | 관계(부/모/후견인 등) 수정. 참고: docs/02 §4 Enum(relationship) | `PATCH /guardian-persons/:id 핸들러를 구현하세요. relationship enum(부/모/후견인 등)을 수정. docs/02 §4 Enum 따르기. Supertest로 enum 검증·수정을 통합 테스트하세요.` | 개발자 A |
| 3.3.6 | 보호자 연결 해제 | 🟥 | DELETE /guardian-persons/:id | S | P1 | 보호자 연결 해제(P1). | `DELETE /guardian-persons/:id 핸들러를 구현하세요(P1). 연결 해제 시 마지막 주보호자 삭제를 차단하세요. Supertest로 해제·주보호자 보호를 통합 테스트하세요.` | 개발자 A |

## 3.4 당사자 계정 (person_accounts)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 3.4.1 | 당사자 계정 생성 (선택적) | 🟦 | POST /person-accounts | S | P0 | 당사자 선택적 로그인 계정 생성(자기표현·내 기록용). 참고: docs/02 §2(person_accounts), docs/04 §2 당사자 | `POST /person-accounts 핸들러를 구현하세요. 당사자 선택적 로그인 계정(자기표현·내 기록용)을 기본 접근성 설정과 함께 생성하세요. docs/02 §2·docs/04 §2 따르기. Supertest로 생성·기본값을 통합 테스트하세요.` | 개발자 A |
| 3.4.2 | 접근성 설정 조회 | 🟩 | GET /person-accounts/:id | XS | P0 | 당사자 접근성 설정 조회. 참고: wireframes/web/33-person-profile.svg | `GET /person-accounts/:id 핸들러를 구현하세요. 당사자 접근성 설정(ui_mode·font_scale·contrast)을 조회. wireframes/web/33 참고. Supertest로 본인 조회를 통합 테스트하세요.` | 개발자 A |
| 3.4.3 | 접근성 설정 수정 | 🟧 | PATCH /person-accounts/:id | S | P0 | 접근성 설정 수정(글씨 크기·고대비·TTS). 참고: docs/07 §9 당사자 접근성 모드, wireframes/web/32-person-accessibility.svg | `PATCH /person-accounts/:id 핸들러를 구현하세요. font_scale·contrast·TTS 설정을 본인만 수정. Zod로 범위 검증. docs/07 §9 따르기. Supertest로 수정·범위 검증을 통합 테스트하세요.` | 개발자 A |
| 3.4.4 | UI 모드 (아이콘/혼합) 변경 | 🟧 | PATCH /person-accounts/:id/ui-mode | XS | P0 | UI 모드(아이콘 전용/혼합) 전환. 참고: docs/07 §9, docs/06 §1 스크린 유형 | `PATCH /person-accounts/:id/ui-mode 핸들러를 구현하세요. ui_mode(아이콘 전용/혼합) 전환. docs/07 §9·docs/06 §1 따르기. Supertest로 enum 검증·전환을 통합 테스트하세요.` | 개발자 A |

---

# 4. 권한 관리 (Permission Matrix)

> 🧪 **테스트 전략:** **RLS 권한 검증은 pgTAP**(정책 레벨), **API 권한 흐름은 Supertest 통합 테스트**(엔드포인트 레벨)로 이중 검증한다. 권한 부여→회수→만료 시나리오를 반드시 포함한다.

## 4.1 권한 CRUD

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 4.1.1 | 권한 부여 API (도메인·수준·기간) | 🟦 | POST /permissions | M | P0 | 권한 부여 — 권한자·도메인(멀티)·수준(read/write/edit, admin은 주보호자 전용·위임 불가)·기간 UPSERT. 참고: docs/02 §2(permissions)·§4 Enum(access_level), docs/05 §2 권한 부여 | `POST /permissions 핸들러를 구현하세요. 권한자·도메인(멀티)·access_level(read/write/edit, admin은 주보호자 전용·위임 불가)·기간을 UPSERT하세요. docs/02 §2·§4·docs/05 §2 따르기. Supertest로 부여·admin 위임 차단·중복 UPSERT를 통합 테스트하세요.` | 개발자 A |
| 4.1.2 | 권한 단건 조회 | 🟩 | GET /permissions/:id | XS | P0 | 권한 단건 조회. | `GET /permissions/:id 핸들러를 구현하세요. 권한 단건을 권한 범위 내 조회. Supertest로 조회·무권한 차단을 통합 테스트하세요.` | 개발자 A |
| 4.1.3 | 당사자별 권한 매트릭스 조회 | 🟨 | GET /persons/:id/permissions | M | P0 | 당사자별 권한 매트릭스(이해관계자×도메인 그리드). 참고: docs/05 §2, wireframes/web/07-permission-matrix.svg | `GET /persons/:id/permissions 핸들러를 구현하세요. 당사자별 권한을 이해관계자×도메인 그리드 구조로 집계 반환. docs/05 §2·wireframes/web/07 참고. Supertest로 그리드 형태·유효기간 반영을 통합 테스트하세요.` | 개발자 A |
| 4.1.4 | 사용자별 받은 권한 목록 | 🟨 | GET /users/:id/permissions | S | P0 | 사용자(전문가)별 받은 권한 목록. 참고: wireframes/web/20-guardian-stakeholder-detail.svg | `GET /users/:id/permissions 핸들러를 구현하세요. 전문가가 받은 권한 목록을 당사자·도메인·수준과 함께 반환. wireframes/web/20 참고. Supertest로 목록·유효기간 필터를 통합 테스트하세요.` | 개발자 A |
| 4.1.5 | 권한 수정 (수준/기간 변경) | 🟧 | PATCH /permissions/:id | S | P0 | 권한 수정(수준·기간 변경) + permission_logs 기록. 참고: wireframes/web/28-guardian-permission-modals.svg | `PATCH /permissions/:id 핸들러를 구현하세요. access_level·기간 수정 시 permission_logs를 자동 기록하세요. wireframes/web/28 참고. Supertest로 수정·로그 생성·캐시 무효화를 통합 테스트하세요.` | 개발자 A |
| 4.1.6 | 권한 회수 (즉시) | 🟥 | DELETE /permissions/:id | S | P0 | 권한 즉시 회수 + 캐시 무효화 + 알림. 참고: docs/05 §3 권한 회수 프로세스, wireframes/web/28-guardian-permission-modals.svg | `DELETE /permissions/:id 핸들러를 구현하세요. 권한 즉시 회수 + 캐시 무효화 + 대상자 알림 발송. docs/05 §3 따르기. Supertest로 회수 후 즉시 접근 차단·알림 발송을 통합 테스트하세요.` | 개발자 A |
| 4.1.7 | 기간 만료 자동 회수 (cron) | 🟧 | scheduled fn | M | P0 | valid_until 만료 권한 자동 회수 cron(scheduled fn). 참고: docs/05 §3 권한 회수 | `valid_until 만료 권한을 자동 회수하는 scheduled function을 supabase/functions에 구현하세요. docs/05 §3 따르기. 시간을 모킹해 Vitest로 만료 권한만 회수되는지 단위 테스트하세요.` | 개발자 A |
| 4.1.8 | 만료 7일 전 알림 (cron) | 🟧 | scheduled fn | S | P1 | 권한 만료 7일 전 사전 알림 cron(P1). 참고: docs/05 §8 알림 | `권한 만료 7일 전 사전 알림 scheduled function을 구현하세요(P1). docs/05 §8 따르기. 시간을 모킹해 7일 전 대상만 선별·알림되는지 Vitest 단위 테스트하세요.` | 개발자 A |

## 4.2 권한 위자드 플로우 (4 step)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 4.2.1 | Step1 — 대상자 검색·초대 | 🟨 | UI step | S | P0 | 권한 위자드 Step1 — 대상자 검색 또는 이메일 초대. 참고: docs/06 §6 주요 플로우(권한 부여), wireframes/web/21-guardian-grant-wizard.svg | `권한 위자드 Step1 컴포넌트를 features/permissions에 구현하세요. 사용자 검색(3.1.4) 또는 이메일 초대(2.8) 분기, TanStack Query로 데이터 페치. wireframes/web/21 참고. 검색·선택 상태 전이를 단위 테스트하세요.` | 개발자 A |
| 4.2.2 | Step2 — 분야 선택 (멀티) | 🟦 | UI step | S | P0 | Step2 — 6개 도메인 멀티 선택. 참고: wireframes/web/21-guardian-grant-wizard.svg | `권한 위자드 Step2 컴포넌트를 구현하세요. 6개 도메인 멀티 선택 UI, 도메인 컬러 배지. wireframes/web/21 참고. 멀티 선택·해제 상태와 최소 1개 선택 검증을 단위 테스트하세요.` | 개발자 A |
| 4.2.3 | Step3 — 수준·기간 설정 | 🟦 | UI step | S | P0 | Step3 — 도메인별 접근 수준·유효 기간 설정. 참고: wireframes/web/21-guardian-grant-wizard.svg | `권한 위자드 Step3 컴포넌트를 구현하세요. 도메인별 access_level·유효기간 설정, admin은 비활성. wireframes/web/21 참고. Zod로 기간 검증, 도메인별 설정 상태를 단위 테스트하세요.` | 개발자 A |
| 4.2.4 | Step4 — 미리보기·UPSERT | 🟦 | UI step | M | P0 | Step4 — 미리보기 후 permissions UPSERT + 알림 발송. 참고: docs/05 §2, wireframes/web/21-guardian-grant-wizard.svg | `권한 위자드 Step4 컴포넌트를 구현하세요. 설정 미리보기 후 POST /permissions(4.1.1)를 TanStack mutation으로 호출·알림 발송·성공 처리. docs/05 §2 따르기. mutation 모킹으로 제출·에러 처리를 단위 테스트하세요.` | 개발자 A |

## 4.3 권한 변경 이력 (permission_logs)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 4.3.1 | 권한 변경 시 자동 로그 (트리거) | 🟦 | DB trigger | S | P0 | permissions 변경 시 permission_logs 자동 기록 트리거. 참고: docs/02 §2(permission_logs) | `supabase/migrations/에 permissions 변경 시 permission_logs를 자동 기록하는 트리거를 작성하세요. INSERT/UPDATE/DELETE별 before/after JSONB·actor 기록. docs/02 §2 따르기. pgTAP로 각 동작이 로그를 남기는지 검증하세요.` | 개발자 A |
| 4.3.2 | 당사자별 권한 이력 조회 | 🟨 | GET /persons/:id/permission-logs | S | P0 | 당사자별 권한 변경 이력 조회. 참고: docs/05 §9 접근 로그 | `GET /persons/:id/permission-logs 핸들러를 구현하세요. 당사자별 권한 변경 이력을 시간 역순·페이징 반환. docs/05 §9 참고. Supertest로 이력 정렬·권한 범위를 통합 테스트하세요.` | 개발자 A |
| 4.3.3 | 사용자별 권한 변동 이력 | 🟨 | GET /users/:id/permission-logs | S | P0 | 사용자별 권한 변동 이력 조회. | `GET /users/:id/permission-logs 핸들러를 구현하세요. 사용자별 권한 변동 이력을 시간 역순 반환. Supertest로 이력·권한 범위를 통합 테스트하세요.` | 개발자 A |

## 4.4 RLS 권한 검증

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 4.4.1 | 권한 외 접근 시도 감지 (트리거) | 🔐 | DB trigger | M | P0 | 권한 외 리소스 접근 시도 감지 트리거(RLS 위반 로깅). 참고: docs/03 §RLS, docs/05 §11 시스템 보안 흐름 | `supabase/migrations/에 권한 외 접근 시도를 감지·로깅하는 트리거/함수를 작성하세요. RLS 위반 시 access_logs에 위반 기록을 남기세요. docs/03 §RLS·docs/05 §11 따르기. pgTAP로 무권한 접근 시 위반 로그 생성을 검증하세요.` | 개발자 A |
| 4.4.2 | 이상 접근 알림 발송 | 🔐 | notification fn | S | P0 | 이상 접근 감지 시 보호자 알림 발송. 참고: docs/05 §8·§11 | `이상 접근 감지 시 보호자에게 알림을 발송하는 함수를 구현하세요. 4.4.1 위반 로그를 트리거로 notifications insert. docs/05 §8·§11 따르기. Vitest로 위반 입력→알림 생성을 단위 테스트하세요.` | 개발자 A |
| 4.4.3 | 권한 캐시 무효화 | 🔐 | redis invalidator | S | P1 | 권한 변경 시 Redis 권한 캐시 무효화(P1). | `권한 변경 시 Redis 권한 캐시를 무효화하는 invalidator를 구현하세요(P1). permissions 변경 이벤트 구독→해당 키 삭제. Redis를 모킹해 Vitest로 키 무효화를 단위 테스트하세요.` | 개발자 A |

---

# 5. 기록 관리 (Records — 6 도메인 × N 유형)

> 🧪 **테스트 전략:** 공통 CRUD는 Vitest 단위 + Supertest 통합. 각 record_type은 **content(JSONB) 스키마 검증을 Zod 단위 테스트**로, 도메인 RLS는 pgTAP로 검증한다.

## 5.0 기록 공통 CRUD

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 5.0.1 | 기록 생성 API (도메인 무관) | 🟦 | POST /records | M | P0 | 도메인 무관 기록 생성 API — content(JSONB)는 record_type별 스키마 검증. 참고: docs/02 §3 JSONB content 스키마, docs/05 §4 기록 작성 공통, wireframes/web/06-record-form.svg | `POST /records 핸들러를 구현하세요. domain·record_type별 content(JSONB)를 Zod 디스크리미네이티드 유니온으로 검증 후 insert. RLS write 권한 확인. docs/02 §3·docs/05 §4 따르기. record_type별 스키마 검증을 Vitest 단위 + Supertest 통합 테스트하세요.` | 개발자 B |
| 5.0.2 | 기록 단건 조회 | 🟩 | GET /records/:id | S | P0 | 기록 단건 조회(권한 검증). 참고: wireframes/web/05-record-detail.svg | `GET /records/:id 핸들러를 구현하세요. RLS 권한 범위 내 기록 단건 조회·첨부 포함. wireframes/web/05 참고. Supertest로 권한자 조회·무권한 차단을 통합 테스트하세요.` | 개발자 B |
| 5.0.3 | 당사자별 기록 목록 (페이징·필터) | 🟨 | GET /persons/:id/records | M | P0 | 당사자별 전체 기록 목록(페이징·필터·정렬). 참고: docs/02 §5 인덱스 전략, wireframes/web/04-record-list.svg | `GET /persons/:id/records 핸들러를 구현하세요. 페이징·필터(도메인·기간)·정렬 지원, docs/02 §5 인덱스 전략 활용. wireframes/web/04 참고. Supertest로 페이징·필터·권한 범위를 통합 테스트하세요.` | 개발자 B |
| 5.0.4 | 분야별 기록 목록 | 🟨 | GET /persons/:id/records?domain= | S | P0 | 도메인별 기록 목록. 참고: wireframes/web/18-guardian-records-domain.svg | `GET /persons/:id/records?domain= 핸들러를 구현하세요. 도메인별 기록 목록을 페이징 반환. wireframes/web/18 참고. Supertest로 도메인 필터·권한 범위를 통합 테스트하세요.` | 개발자 B |
| 5.0.5 | 기록 수정 | 🟧 | PATCH /records/:id | S | P0 | 기록 수정(작성자/권한자). 참고: wireframes/web/19-guardian-record-edit.svg | `PATCH /records/:id 핸들러를 구현하세요. 작성자/권한자만 수정, content는 record_type별 Zod 재검증. wireframes/web/19 참고. Supertest로 수정 허용·무권한 차단을 통합 테스트하세요.` | 개발자 B |
| 5.0.6 | 기록 삭제 (보호자 권한) | 🟥 | DELETE /records/:id | S | P0 | 기록 삭제(보호자 권한). 참고: docs/03 §RLS | `DELETE /records/:id 핸들러를 구현하세요. 보호자/admin 권한만 삭제, 삭제불가 record_type은 차단. docs/03 §RLS 따르기. Supertest로 권한 삭제·삭제불가 유형 차단을 통합 테스트하세요.` | 개발자 B |
| 5.0.7 | 기록 임시저장 (is_draft) | 🟧 | PATCH /records/:id/draft | S | P0 | 기록 임시저장(is_draft) — 위자드 중간 저장. 참고: docs/05 §4 기록 작성 공통 | `PATCH /records/:id/draft 핸들러를 구현하세요. is_draft 토글로 위자드 중간 저장, draft는 부분 검증만. docs/05 §4 따르기. Supertest로 draft 저장·발행 전환을 통합 테스트하세요.` | 개발자 B |
| 5.0.8 | 기록 이정표 표시 | 🟧 | PATCH /records/:id/milestone | XS | P0 | 기록을 이정표(is_milestone)로 표시 → 타임라인 강조. 참고: docs/05 §6 타임라인 | `PATCH /records/:id/milestone 핸들러를 구현하세요. is_milestone 토글로 타임라인 강조 표시. docs/05 §6 따르기. Supertest로 토글·타임라인 반영을 통합 테스트하세요.` | 개발자 B |
| 5.0.9 | 기록 고정/해제 | 🟧 | PATCH /records/:id/pin | XS | P0 | 기록 고정/해제(상단 핀). 참고: docs/02 §2(records) | `PATCH /records/:id/pin 핸들러를 구현하세요. is_pinned 토글로 상단 고정. docs/02 §2 따르기. Supertest로 고정/해제·목록 우선 정렬을 통합 테스트하세요.` | 개발자 B |
| 5.0.10 | 기록 태그 추가/제거 | 🟧 | PATCH /records/:id/tags | S | P1 | 기록 태그 추가/제거(P1). | `PATCH /records/:id/tags 핸들러를 구현하세요(P1). 태그 배열 추가/제거·중복 제거. Vitest 단위+Supertest 통합으로 태그 병합·중복 제거를 테스트하세요.` | 개발자 B |
| 5.0.11 | 기록 검색 (전문 검색) | 🟨 | GET /records?q= | M | P1 | 전문 검색(content 텍스트, P1). 참고: docs/02 §5 인덱스 전략(GIN) | `GET /records?q= 전문 검색 핸들러를 구현하세요(P1). content JSONB에 GIN 인덱스 기반 텍스트 검색·권한 범위 필터. docs/02 §5 따르기. Supertest로 매칭·권한 필터를 통합 테스트하세요.` | 개발자 B |
| 5.0.12 | 기록 일괄 내보내기 (PDF/CSV) | 🔀 | POST /records/export | M | P1 | 기록 일괄 PDF/CSV 내보내기(P1). 참고: docs/05 §6 타임라인 PDF | `POST /records/export 핸들러를 구현하세요(P1). 선택 기록을 PDF/CSV로 일괄 내보내기·권한 범위 필터. docs/05 §6 참고. Vitest로 포맷 생성·필드 매핑을 단위 테스트하세요.` | 개발자 B |
| 5.0.13 | 기록 작성자별 카운트 | 🟨 | GET /records/stats?by=author | S | P2 | 작성자별 기록 통계 카운트(P2). | `GET /records/stats?by=author 핸들러를 구현하세요(P2). 작성자별 기록 수를 집계 반환. Supertest로 집계 정확성을 통합 테스트하세요.` | 개발자 B |

> **5.A~5.F 기록 유형 프롬프트 패턴:** 각 record_type은 동일 패턴을 따른다 —
> `POST/GET/PATCH/DELETE /records의 공통 CRUD(5.0)를 재사용하되, record_type='{코드}' 의 content(JSONB) 스키마를 docs/02 §3 JSONB({코드})에 맞춰 Zod 스키마로 정의하고, 해당 도메인 RLS({작성 역할}) 하에 검증하세요. 작성 폼/상세는 {와이어프레임}을 참고하세요. content 필수 필드·타입·삭제가능 여부를 Vitest 단위 + pgTAP RLS 테스트로 검증하세요.`
> 아래 표의 AI 프롬프트는 이 패턴에 record_type과 참조 문서만 치환한 것이다.

## 5.A 의료 기록 (MED-001 ~ MED-010)

| ID | 기록 유형 | C | R | L | U | D | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|---------|:-:|:-:|:-:|:-:|:-:|:---:|:-:| :-------- | :-------- | :----: |
| 5.A.1 | MED-001 초기 진단 요약 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | MED-001 초기 진단 요약(보호자 작성). content JSONB: 진단명·진단일·기관. 참고: docs/01-record-matrix.md §1 영유아기, docs/02 §3 JSONB(MED-001) | `공통 records CRUD(5.0)를 재사용해 record_type='MED-001' 초기 진단 요약(보호자)을 구현하세요. content(진단명·진단일·기관)를 docs/02 §3 JSONB(MED-001) 기준 Zod 스키마로 정의하고 의료 도메인 RLS로 검증하세요. content 필수 필드·타입을 Vitest 단위 + pgTAP RLS 테스트로 검증하세요.` | 개발자 B |
| 5.A.2 | MED-002 발달 검사 결과 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | MED-002 발달 검사 결과(보호자). 검사도구·점수·해석. 참고: docs/01 §1·§2, docs/02 §3 JSONB(MED-002) | `5.0 공통 CRUD로 record_type='MED-002' 발달 검사 결과(보호자)를 구현하세요. content(검사도구·점수·해석)를 docs/02 §3 JSONB(MED-002) 기준 Zod로 정의·의료 RLS 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.A.3 | MED-003 복약 기록 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | MED-003 복약 기록(보호자). 약물·용량·주기·부작용. 참고: docs/02 §3 JSONB(MED-003) | `5.0 공통 CRUD로 record_type='MED-003' 복약 기록(보호자)을 구현하세요. content(약물·용량·주기·부작용)를 docs/02 §3 JSONB(MED-003) 기준 Zod로 정의·의료 RLS 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.A.4 | MED-004 응급 대응 정보 (보호자 · 핀고정) | 🟦 | 🟩 | 🟨 | 🟧 | — | S | P0 | MED-004 응급 대응 정보(보호자·핀고정·삭제불가). 발작·알레르기·대처. 참고: docs/02 §3 JSONB(MED-004), §17.2.5 | `5.0 공통 CRUD로 record_type='MED-004' 응급 대응 정보(보호자·핀고정·삭제불가)를 구현하세요. content(발작·알레르기·대처)를 docs/02 §3 JSONB(MED-004) 기준 Zod로 정의, DELETE 차단·자동 핀고정. §17.2.5 추가 인증 참고. Vitest 단위 + pgTAP(삭제 차단) 테스트를 작성하세요.` | 개발자 B |
| 5.A.5 | MED-005 치료계획서 (치료사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | MED-005 치료계획서(치료사). 목표·회기 계획·평가지표. 참고: docs/01 §2·§3, docs/02 §3 JSONB(MED-005), wireframes/web/59-therapist-plan.svg | `5.0 공통 CRUD로 record_type='MED-005' 치료계획서(치료사)를 구현하세요. content(목표·회기 계획·평가지표)를 docs/02 §3 JSONB(MED-005) 기준 Zod로 정의·의료 RLS(치료사) 검증. wireframes/web/59 참고. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.A.6 | MED-006 치료 회기 일지 (치료사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | MED-006 치료 회기 일지(치료사). 회기 활동·반응·과제. 참고: docs/02 §3 JSONB(MED-006), wireframes/web/60-therapist-session-form.svg | `5.0 공통 CRUD로 record_type='MED-006' 치료 회기 일지(치료사)를 구현하세요. content(회기 활동·반응·과제)를 docs/02 §3 JSONB(MED-006) 기준 Zod로 정의·의료 RLS(치료사) 검증. wireframes/web/60 참고. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.A.7 | MED-007 치료 평가 보고서 (치료사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | MED-007 치료 평가 보고서(치료사). 기간 성과·재평가. 참고: docs/02 §3 JSONB(MED-007), wireframes/web/61-therapist-evaluation.svg | `5.0 공통 CRUD로 record_type='MED-007' 치료 평가 보고서(치료사)를 구현하세요. content(기간 성과·재평가)를 docs/02 §3 JSONB(MED-007) 기준 Zod로 정의·의료 RLS(치료사) 검증. wireframes/web/61 참고. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.A.8 | MED-008 정기 검진 요약 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | MED-008 정기 검진 요약(보호자). 참고: docs/02 §3 JSONB(MED-008) | `5.0 공통 CRUD로 record_type='MED-008' 정기 검진 요약(보호자)을 구현하세요. content를 docs/02 §3 JSONB(MED-008) 기준 Zod로 정의·의료 RLS 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.A.9 | MED-009 치료 종결 평가 (치료사) | 🟦 | 🟩 | 🟨 | 🟧 | — | S | P1 | MED-009 치료 종결 평가(치료사·삭제불가, P1). 참고: docs/02 §3 JSONB(MED-009) | `5.0 공통 CRUD로 record_type='MED-009' 치료 종결 평가(치료사·삭제불가, P1)를 구현하세요. content를 docs/02 §3 JSONB(MED-009) 기준 Zod로 정의·DELETE 차단·의료 RLS(치료사) 검증. Vitest 단위 + pgTAP(삭제 차단) 테스트를 작성하세요.` | 개발자 B |
| 5.A.10 | MED-010 만성질환 관리 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P1 | MED-010 만성질환 관리(보호자, P1·중장년). 참고: docs/01 §6 중장년/노년기, docs/02 §3 JSONB(MED-010) | `5.0 공통 CRUD로 record_type='MED-010' 만성질환 관리(보호자, P1·중장년)를 구현하세요. content를 docs/02 §3 JSONB(MED-010) 기준 Zod로 정의·의료 RLS 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |

## 5.B 교육 기록 (EDU-001 ~ EDU-009)

| ID | 기록 유형 | C | R | L | U | D | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|---------|:-:|:-:|:-:|:-:|:-:|:---:|:-:| :-------- | :-------- | :----: |
| 5.B.1 | EDU-001 IEP (특수교사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | L | P0 | EDU-001 IEP 개별화교육계획(특수교사·최대 공수). 현행수준·연간/단기목표·평가. 참고: docs/01 §2 아동기, docs/02 §3 JSONB(EDU-001), wireframes/web/45-teacher-iep-form.svg | `5.0 공통 CRUD로 record_type='EDU-001' IEP(특수교사·최대 공수)를 구현하세요. content(현행수준·연간/단기목표·평가)를 docs/02 §3 JSONB(EDU-001) 기준 Zod로 정의·교육 RLS(특수교사) 검증. wireframes/web/45 참고. 중첩 목표 배열 검증을 Vitest 단위 + pgTAP RLS 테스트로 작성하세요.` | 개발자 B |
| 5.B.2 | EDU-002 유아 특수교육 관찰 (교사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P1 | EDU-002 유아 특수교육 관찰(교사, P1·영유아). 참고: docs/01 §1, docs/02 §3 JSONB(EDU-002) | `5.0 공통 CRUD로 record_type='EDU-002' 유아 특수교육 관찰(교사, P1)을 구현하세요. content를 docs/02 §3 JSONB(EDU-002) 기준 Zod로 정의·교육 RLS 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.B.3 | EDU-003 IEP 중간 점검 (교사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | EDU-003 IEP 중간 점검(교사). 목표 달성도 평가. 참고: docs/02 §3 JSONB(EDU-003), wireframes/web/46-teacher-iep-review.svg | `5.0 공통 CRUD로 record_type='EDU-003' IEP 중간 점검(교사)을 구현하세요. content(목표 달성도)를 docs/02 §3 JSONB(EDU-003) 기준 Zod로 정의·교육 RLS 검증. wireframes/web/46 참고. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.B.4 | EDU-004 학교생활 관찰 (교사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | EDU-004 학교생활 관찰(교사). 참고: docs/02 §3 JSONB(EDU-004), wireframes/web/47-teacher-observation.svg | `5.0 공통 CRUD로 record_type='EDU-004' 학교생활 관찰(교사)을 구현하세요. content를 docs/02 §3 JSONB(EDU-004) 기준 Zod로 정의·교육 RLS 검증. wireframes/web/47 참고. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.B.5 | EDU-005 통합교육 참여 (교사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P1 | EDU-005 통합교육 참여(교사, P1). 참고: docs/02 §3 JSONB(EDU-005) | `5.0 공통 CRUD로 record_type='EDU-005' 통합교육 참여(교사, P1)를 구현하세요. content를 docs/02 §3 JSONB(EDU-005) 기준 Zod로 정의·교육 RLS 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.B.6 | EDU-006 학교 치료지원 (교사+치료사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P1 | EDU-006 학교 치료지원(교사+치료사, P1). 참고: docs/02 §3 JSONB(EDU-006) | `5.0 공통 CRUD로 record_type='EDU-006' 학교 치료지원(교사+치료사, P1)을 구현하세요. content를 docs/02 §3 JSONB(EDU-006) 기준 Zod로 정의·교육 RLS(교사+치료사) 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.B.7 | EDU-007 전환교육 계획 (교사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | EDU-007 전환교육 계획(교사·청소년). 진로·자립 준비. 참고: docs/01 §3 청소년기, docs/02 §3 JSONB(EDU-007), wireframes/web/48-teacher-transition.svg | `5.0 공통 CRUD로 record_type='EDU-007' 전환교육 계획(교사·청소년)을 구현하세요. content(진로·자립 준비)를 docs/02 §3 JSONB(EDU-007) 기준 Zod로 정의·교육 RLS 검증. wireframes/web/48 참고. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.B.8 | EDU-008 직업교육 참여 (교사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P1 | EDU-008 직업교육 참여(교사, P1). 참고: docs/02 §3 JSONB(EDU-008) | `5.0 공통 CRUD로 record_type='EDU-008' 직업교육 참여(교사, P1)를 구현하세요. content를 docs/02 §3 JSONB(EDU-008) 기준 Zod로 정의·교육 RLS 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.B.9 | EDU-009 졸업/수료 (교사) | 🟦 | 🟩 | 🟨 | 🟧 | — | S | P0 | EDU-009 졸업/수료(교사·삭제불가). 참고: docs/02 §3 JSONB(EDU-009) | `5.0 공통 CRUD로 record_type='EDU-009' 졸업/수료(교사·삭제불가)를 구현하세요. content를 docs/02 §3 JSONB(EDU-009) 기준 Zod로 정의·DELETE 차단·교육 RLS 검증. Vitest 단위 + pgTAP(삭제 차단) 테스트를 작성하세요.` | 개발자 B |

## 5.C 복지 기록 (WEL-001 ~ WEL-007)

| ID | 기록 유형 | C | R | L | U | D | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|---------|:-:|:-:|:-:|:-:|:-:|:---:|:-:| :-------- | :-------- | :----: |
| 5.C.1 | WEL-001 장애 등록 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | — | S | P0 | WEL-001 장애 등록(보호자·삭제불가). 장애유형·정도·등록일. **고유식별정보 분리:** `registration_number`(장애 등록번호)는 content 평문 금지 — 5.G.1 암호화 서비스로 secure_identifiers에 저장하고 content에는 `secure_identifier_id`(참조)·`value_masked`(표시용 마스킹)만 둠(unique_identifier 동의 전제, 2.12). 참고: docs/01 §1, docs/02 §3 JSONB(WEL-001), docs/16 §3.2 | `5.0 공통 CRUD로 record_type='WEL-001' 장애 등록(보호자·삭제불가)을 구현하세요. content(장애유형·정도·등록일)를 docs/02 §3 JSONB(WEL-001) 기준 Zod로 정의·DELETE 차단·복지 RLS 검증. registration_number는 평문 저장 금지 — 5.G.1 서비스로 secure_identifiers(identifier_type='disability_registration_number')에 암호화 저장하고 content엔 secure_identifier_id·마스킹값만 두세요(unique_identifier 동의 확인). docs/16 §3.2 따르기. Vitest 단위 + pgTAP(삭제 차단·평문 부재) 테스트를 작성하세요.` | 개발자 B |
| 5.C.2 | WEL-002 초기 복지 연계 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | WEL-002 초기 복지 연계(복지사). 참고: docs/02 §3 JSONB(WEL-002) | `5.0 공통 CRUD로 record_type='WEL-002' 초기 복지 연계(복지사)를 구현하세요. content를 docs/02 §3 JSONB(WEL-002) 기준 Zod로 정의·복지 RLS(복지사) 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.C.3 | WEL-003 활동지원 계획서 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | WEL-003 활동지원 계획서(복지사). 참고: docs/02 §3 JSONB(WEL-003) | `5.0 공통 CRUD로 record_type='WEL-003' 활동지원 계획서(복지사)를 구현하세요. content를 docs/02 §3 JSONB(WEL-003) 기준 Zod로 정의·복지 RLS(복지사) 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.C.4 | WEL-004 ISP (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | L | P0 | WEL-004 ISP 개별지원계획(복지사·최대 공수). 욕구·목표·서비스 매핑. 참고: docs/01 §5 성인기, docs/02 §3 JSONB(WEL-004), wireframes/web/53-worker-isp-form.svg | `5.0 공통 CRUD로 record_type='WEL-004' ISP 개별지원계획(복지사·최대 공수)을 구현하세요. content(욕구·목표·서비스 매핑)를 docs/02 §3 JSONB(WEL-004) 기준 Zod로 정의·복지 RLS(복지사) 검증. wireframes/web/53 참고. 중첩 매핑 검증을 Vitest 단위 + pgTAP RLS 테스트로 작성하세요.` | 개발자 B |
| 5.C.5 | WEL-005 ISP 중간 점검 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | WEL-005 ISP 중간 점검(복지사). 참고: docs/02 §3 JSONB(WEL-005), wireframes/web/52-worker-isp.svg | `5.0 공통 CRUD로 record_type='WEL-005' ISP 중간 점검(복지사)을 구현하세요. content를 docs/02 §3 JSONB(WEL-005) 기준 Zod로 정의·복지 RLS(복지사) 검증. wireframes/web/52 참고. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.C.6 | WEL-006 서비스 이용 현황 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | WEL-006 서비스 이용 현황(복지사·매트릭스). 참고: docs/02 §3 JSONB(WEL-006), wireframes/web/55-worker-service-matrix.svg | `5.0 공통 CRUD로 record_type='WEL-006' 서비스 이용 현황(복지사·매트릭스)을 구현하세요. content(서비스×기간 매트릭스)를 docs/02 §3 JSONB(WEL-006) 기준 Zod로 정의·복지 RLS(복지사) 검증. wireframes/web/55 참고. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.C.7 | WEL-007 노인복지 연계 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P2 | WEL-007 노인복지 연계(복지사, P2·노년). 참고: docs/01 §6, docs/02 §3 JSONB(WEL-007) | `5.0 공통 CRUD로 record_type='WEL-007' 노인복지 연계(복지사, P2)를 구현하세요. content를 docs/02 §3 JSONB(WEL-007) 기준 Zod로 정의·복지 RLS(복지사) 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |

## 5.D 일상/돌봄 기록 (DAI-001 ~ DAI-005)

| ID | 기록 유형 | C | R | L | U | D | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|---------|:-:|:-:|:-:|:-:|:-:|:---:|:-:| :-------- | :-------- | :----: |
| 5.D.1 | DAI-001 영유아 돌봄 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P1 | DAI-001 영유아 돌봄(보호자, P1). 참고: docs/01 §1, docs/02 §3 JSONB(DAI-001) | `5.0 공통 CRUD로 record_type='DAI-001' 영유아 돌봄(보호자, P1)을 구현하세요. content를 docs/02 §3 JSONB(DAI-001) 기준 Zod로 정의·일상 RLS 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.D.2 | DAI-002 활동지원 일지 (지원사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | DAI-002 활동지원 일지(활동지원사·핵심). 활동·식사·특이사항. 참고: docs/04 §3 활동지원사, docs/02 §3 JSONB(DAI-002), wireframes/web/38-supporter-journal-form.svg | `5.0 공통 CRUD로 record_type='DAI-002' 활동지원 일지(지원사·핵심)를 구현하세요. content(활동·식사·특이사항)를 docs/02 §3 JSONB(DAI-002) 기준 Zod로 정의·일상 RLS(지원사) 검증. wireframes/web/38·docs/04 §3 참고. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.D.3 | DAI-003 행동 관찰 (지원사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | DAI-003 행동 관찰(지원사). 참고: docs/02 §3 JSONB(DAI-003) | `5.0 공통 CRUD로 record_type='DAI-003' 행동 관찰(지원사)을 구현하세요. content를 docs/02 §3 JSONB(DAI-003) 기준 Zod로 정의·일상 RLS(지원사) 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.D.4 | DAI-004 식이 기록 (지원사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P1 | DAI-004 식이 기록(지원사, P1). 참고: docs/02 §3 JSONB(DAI-004) | `5.0 공통 CRUD로 record_type='DAI-004' 식이 기록(지원사, P1)을 구현하세요. content를 docs/02 §3 JSONB(DAI-004) 기준 Zod로 정의·일상 RLS(지원사) 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.D.5 | DAI-005 수면 기록 (지원사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P1 | DAI-005 수면 기록(지원사, P1). 참고: docs/02 §3 JSONB(DAI-005) | `5.0 공통 CRUD로 record_type='DAI-005' 수면 기록(지원사, P1)을 구현하세요. content를 docs/02 §3 JSONB(DAI-005) 기준 Zod로 정의·일상 RLS(지원사) 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |

## 5.E 전환/자립 기록 (TRA-001 ~ TRA-007)

| ID | 기록 유형 | C | R | L | U | D | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|---------|:-:|:-:|:-:|:-:|:-:|:---:|:-:| :-------- | :-------- | :----: |
| 5.E.1 | TRA-001 전환계획서 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | L | P0 | TRA-001 전환계획서(복지사·성인전환기). 교육→자립 종합 계획. 참고: docs/01 §4 성인전환기, docs/02 §3 JSONB(TRA-001), wireframes/web/54-worker-transition.svg | `5.0 공통 CRUD로 record_type='TRA-001' 전환계획서(복지사·성인전환기)를 구현하세요. content(교육→자립 종합 계획)를 docs/02 §3 JSONB(TRA-001) 기준 Zod로 정의·전환 RLS(복지사) 검증. wireframes/web/54 참고. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.E.2 | TRA-002 직업 역량 평가 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | TRA-002 직업 역량 평가(복지사). 참고: docs/02 §3 JSONB(TRA-002) | `5.0 공통 CRUD로 record_type='TRA-002' 직업 역량 평가(복지사)를 구현하세요. content를 docs/02 §3 JSONB(TRA-002) 기준 Zod로 정의·전환 RLS(복지사) 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.E.3 | TRA-003 직업훈련/취업 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | TRA-003 직업훈련/취업(복지사). 참고: docs/02 §3 JSONB(TRA-003) | `5.0 공통 CRUD로 record_type='TRA-003' 직업훈련/취업(복지사)을 구현하세요. content를 docs/02 §3 JSONB(TRA-003) 기준 Zod로 정의·전환 RLS(복지사) 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.E.4 | TRA-004 자립생활 계획 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P1 | TRA-004 자립생활 계획(복지사, P1). 참고: docs/02 §3 JSONB(TRA-004) | `5.0 공통 CRUD로 record_type='TRA-004' 자립생활 계획(복지사, P1)을 구현하세요. content를 docs/02 §3 JSONB(TRA-004) 기준 Zod로 정의·전환 RLS(복지사) 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.E.5 | TRA-005 자립생활 경과 (복지사) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P1 | TRA-005 자립생활 경과(복지사, P1). 참고: docs/02 §3 JSONB(TRA-005) | `5.0 공통 CRUD로 record_type='TRA-005' 자립생활 경과(복지사, P1)를 구현하세요. content를 docs/02 §3 JSONB(TRA-005) 기준 Zod로 정의·전환 RLS(복지사) 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.E.6 | TRA-006 의사결정 지원 (복지사+당사자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P1 | TRA-006 의사결정 지원(복지사+당사자, P1). 참고: docs/01 §5, docs/02 §3 JSONB(TRA-006) | `5.0 공통 CRUD로 record_type='TRA-006' 의사결정 지원(복지사+당사자, P1)을 구현하세요. content를 docs/02 §3 JSONB(TRA-006) 기준 Zod로 정의·전환 RLS(복지사+당사자) 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.E.7 | TRA-007 돌봄 전환 계획 (복지사+보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P2 | TRA-007 돌봄 전환 계획(복지사+보호자, P2·노년 대비). 참고: docs/01 §6, docs/02 §3 JSONB(TRA-007) | `5.0 공통 CRUD로 record_type='TRA-007' 돌봄 전환 계획(복지사+보호자, P2)을 구현하세요. content를 docs/02 §3 JSONB(TRA-007) 기준 Zod로 정의·전환 RLS(복지사+보호자) 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |

## 5.F 법적/행정 기록 (LEG-001 ~ LEG-005)

| ID | 기록 유형 | C | R | L | U | D | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|---------|:-:|:-:|:-:|:-:|:-:|:---:|:-:| :-------- | :-------- | :----: |
| 5.F.1 | LEG-001 장애인 증명서 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | LEG-001 장애인 증명서(보호자). **고유식별정보 분리:** `document_number`(증명서 문서번호)는 content 평문 금지 — 5.G.1 암호화 서비스로 secure_identifiers에 저장하고 content에는 `secure_identifier_id`(참조)·`value_masked`만 둠(unique_identifier 동의 전제, 2.12). 참고: docs/02 §3 JSONB(LEG-001), docs/16 §3.2 | `5.0 공통 CRUD로 record_type='LEG-001' 장애인 증명서(보호자)를 구현하세요. content를 docs/02 §3 JSONB(LEG-001) 기준 Zod로 정의·법적 RLS 검증. document_number는 평문 저장 금지 — 5.G.1 서비스로 secure_identifiers(identifier_type='disability_certificate_number')에 암호화 저장하고 content엔 secure_identifier_id·마스킹값만 두세요(unique_identifier 동의 확인). docs/16 §3.2 따르기. Vitest 단위 + pgTAP(평문 부재) 테스트를 작성하세요.` | 개발자 B |
| 5.F.2 | LEG-002 수급 기록 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P0 | LEG-002 수급 기록(보호자). 참고: docs/02 §3 JSONB(LEG-002) | `5.0 공통 CRUD로 record_type='LEG-002' 수급 기록(보호자)을 구현하세요. content를 docs/02 §3 JSONB(LEG-002) 기준 Zod로 정의·법적 RLS 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.F.3 | LEG-003 후견 문서 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P0 | LEG-003 후견 문서(보호자). 후견 유형·범위·기간. 참고: docs/01 §4·§5, docs/02 §3 JSONB(LEG-003) | `5.0 공통 CRUD로 record_type='LEG-003' 후견 문서(보호자)를 구현하세요. content(후견 유형·범위·기간)를 docs/02 §3 JSONB(LEG-003) 기준 Zod로 정의·법적 RLS 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.F.4 | LEG-004 의사결정 지원 계약 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | M | P1 | LEG-004 의사결정 지원 계약(보호자, P1). 참고: docs/02 §3 JSONB(LEG-004) | `5.0 공통 CRUD로 record_type='LEG-004' 의사결정 지원 계약(보호자, P1)을 구현하세요. content를 docs/02 §3 JSONB(LEG-004) 기준 Zod로 정의·법적 RLS 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |
| 5.F.5 | LEG-005 노후 돌봄 문서 (보호자) | 🟦 | 🟩 | 🟨 | 🟧 | 🟥 | S | P2 | LEG-005 노후 돌봄 문서(보호자, P2). 참고: docs/01 §6, docs/02 §3 JSONB(LEG-005) | `5.0 공통 CRUD로 record_type='LEG-005' 노후 돌봄 문서(보호자, P2)를 구현하세요. content를 docs/02 §3 JSONB(LEG-005) 기준 Zod로 정의·법적 RLS 검증. Vitest 단위 + pgTAP RLS 테스트를 작성하세요.` | 개발자 B |

## 5.G 고유식별정보 암호화 서비스 (PIPA §24)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 5.G.1 ✨ NEW | 고유식별정보 암호화/복호화 서비스 | 🔐 | service / edge fn | M | P0 | secure_identifiers 입출력 서비스 — 저장 시 평문을 암호화(encrypted_value BYTEA)·표시용 마스킹(value_masked) 생성, 조회 시 마스킹값만 반환, 원문 복호화는 service_role/Edge Function에서 권한 재검증 후에만(1.2.7 EXECUTE 제한과 연계). WEL-001(5.C.1)·LEG-001(5.F.1)이 호출. 암호화 도구·키관리(Vault vs pgcrypto+KMS)는 docs/16 §9 #2 확정 후 채움 🟡. 참고: docs/02 §2.14, docs/13 §3.5, docs/16 §3.2 | `고유식별정보 암호화/복호화 서비스를 구현하세요. (1)저장: 평문을 암호화해 secure_identifiers.encrypted_value(BYTEA)에 저장하고 value_masked(부분 노출)·encryption_ref를 생성, (2)조회: 마스킹값만 반환, (3)복호화: service_role/Edge Function에서 보호자·권한자 재검증 후에만 원문 반환(authenticated 직접 호출 금지). docs/02 §2.14·docs/13 §3.5·docs/16 §3.2 따르기. 암호화 도구는 §9 #2 확정 전 인터페이스만 고정(🟡). 마스킹·복호화 권한 분기를 Vitest 단위 + pgTAP(EXECUTE 제한)로 검증하세요.` | 개발자 B |

---

# 6. 자기표현 (Self-Expression)

> 🧪 **테스트 전략:** 날짜별 UNIQUE·당일 수정 제약을 pgTAP로, 5스텝 입력 로직을 Vitest 단위 + Supertest 통합으로 검증한다.

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 6.1 | 자기표현 입력 API (Flow-1 5스텝) | 🟦 | POST /self-expressions | M | P0 | 당사자 자기표현 입력 5스텝(기분·활동·사진·메모). 날짜별 1건. 참고: docs/06 §6 Flow-1 자기표현, docs/04 §2 당사자, docs/02 §3 JSONB(self_expression), wireframes/web/09-self-expression.svg | `POST /self-expressions 핸들러를 구현하세요. 기분·활동·사진·메모 content(JSONB)를 Zod 검증 후 날짜별 1건 upsert, 당사자 본인 RLS. docs/06 §6 Flow-1·docs/02 §3 따르기. Supertest로 신규·당일 중복 케이스를 통합 테스트하세요.` | 개발자 B |
| 6.2 | 자기표현 단건 조회 (날짜별 UNIQUE) | 🟩 | GET /self-expressions/:date | S | P0 | 특정 날짜 자기표현 단건 조회(오늘 기록 홈). 참고: wireframes/web/08-person-home.svg | `GET /self-expressions/:date 핸들러를 구현하세요. 특정 날짜 자기표현 단건을 조회, 미작성 시 빈 응답. wireframes/web/08 참고. Supertest로 작성/미작성 케이스를 통합 테스트하세요.` | 개발자 B |
| 6.3 | 자기표현 목록 (월·주 단위) | 🟨 | GET /self-expressions?month= | S | P0 | 월·주 단위 자기표현 목록(캘린더/리스트). 참고: docs/02 §5 인덱스(date) | `GET /self-expressions?month= 핸들러를 구현하세요. 월·주 단위 목록을 date 인덱스 기반 반환(캘린더용). docs/02 §5 참고. Supertest로 기간 필터·정렬을 통합 테스트하세요.` | 개발자 B |
| 6.4 | 자기표현 수정 (당일만) | 🟧 | PATCH /self-expressions/:id | S | P0 | 자기표현 수정(작성 당일만 허용). 참고: docs/03 §RLS(self_expressions) | `PATCH /self-expressions/:id 핸들러를 구현하세요. 작성 당일만 수정 허용, 익일 차단. docs/03 §RLS 따르기. Supertest로 당일 수정 허용·익일 차단을 통합 테스트하세요.` | 개발자 B |
| 6.5 | 자기표현 사진 업로드 | 🟦 | POST /self-expressions/:id/photo | S | P0 | 자기표현 사진 업로드(presigned URL). 참고: docs/05 §5 파일 첨부 | `POST /self-expressions/:id/photo 핸들러를 구현하세요. presigned URL 발급 후 record_files 메타 등록. docs/05 §5 참고. Supertest로 presign·메타 등록을 통합 테스트하세요.` | 개발자 B |
| 6.6 | 자기표현 음성 메모 업로드 | 🟦 | POST /self-expressions/:id/voice | S | P1 | 자기표현 음성 메모 업로드(P1). 참고: §16.6.3 | `POST /self-expressions/:id/voice 핸들러를 구현하세요(P1). 음성 파일 presigned URL 발급·메타 등록. §16.6.3 참고. Supertest로 업로드·메타 등록을 통합 테스트하세요.` | 개발자 B |
| 6.7 | 자기표현 보호자 요약 발송 | 🟦 | notification fn | S | P0 | 자기표현 작성 시 보호자 요약 알림 발송. 참고: docs/05 §8 알림, notifications.self_expression_id FK | `자기표현 작성 시 보호자에게 요약 알림을 발송하는 함수를 구현하세요. notifications에 self_expression_id FK로 연결. docs/05 §8 따르기. Vitest로 작성 이벤트→알림 생성을 단위 테스트하세요.` | 개발자 B |
| 6.8 | 자기표현 통계 (연속 일수 등) | 🟨 | GET /self-expressions/stats | S | P1 | 연속 입력 일수 등 자기표현 통계(P1). | `GET /self-expressions/stats 핸들러를 구현하세요(P1). 연속 입력 일수·월별 빈도 집계. Vitest로 연속 일수 계산 로직을 단위 테스트하세요.` | 개발자 B |

---

# 7. 파일 첨부 (Record Files)

> 🧪 **테스트 전략:** presign 발급·메타 등록은 Supertest 통합, 민감 파일 추가 인증 미들웨어는 Vitest 단위 테스트로 검증한다.

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 7.1 | Presigned URL 발급 | 🟦 | POST /files/presign | S | P0 | Presigned URL 발급(업로드용). 참고: docs/05 §5 파일 첨부 프로세스, bkit:bkend-storage 스킬 | `POST /files/presign 핸들러를 구현하세요. 업로드용 presigned URL 발급·mime/크기 제한 검증. docs/05 §5·bkit:bkend-storage 참고. Supertest로 발급·제한 초과 거부를 통합 테스트하세요.` | 개발자 B |
| 7.2 | 파일 메타데이터 등록 | 🟦 | POST /files | S | P0 | 업로드 완료 후 record_files 메타데이터 등록. 참고: docs/02 §2(record_files) | `POST /files 핸들러를 구현하세요. 업로드 완료 후 record_files 메타(storage_path·mime·is_sensitive)를 등록. docs/02 §2 따르기. Supertest로 메타 등록·FK 연결을 통합 테스트하세요.` | 개발자 B |
| 7.3 | 파일 단건 조회 (다운로드 URL) | 🟩 | GET /files/:id | S | P0 | 파일 단건 조회 + 다운로드 URL(CDN/presigned). 참고: bkit:bkend-storage 스킬 | `GET /files/:id 핸들러를 구현하세요. 권한 범위 내 파일 메타와 다운로드 presigned URL 반환. bkit:bkend-storage 참고. Supertest로 권한자 다운로드·무권한 차단을 통합 테스트하세요.` | 개발자 B |
| 7.4 | 기록별 파일 목록 | 🟨 | GET /records/:id/files | XS | P0 | 특정 기록의 첨부 파일 목록. | `GET /records/:id/files 핸들러를 구현하세요. 특정 기록의 첨부 파일 목록을 권한 범위 내 반환. Supertest로 목록·권한 범위를 통합 테스트하세요.` | 개발자 B |
| 7.5 | 자기표현별 파일 목록 | 🟨 | GET /self-expressions/:id/files | XS | P0 | 특정 자기표현의 첨부 파일 목록. | `GET /self-expressions/:id/files 핸들러를 구현하세요. 특정 자기표현의 첨부 파일 목록을 반환. Supertest로 목록·권한 범위를 통합 테스트하세요.` | 개발자 B |
| 7.6 | 파일 메타 수정 (제목/민감도) | 🟧 | PATCH /files/:id | XS | P0 | 파일 메타 수정(제목·민감 여부 is_sensitive BOOLEAN). 참고: docs/02 §2(record_files) | `PATCH /files/:id 핸들러를 구현하세요. 제목·is_sensitive 메타를 권한자만 수정. docs/02 §2 따르기. Supertest로 수정·권한 차단을 통합 테스트하세요.` | 개발자 B |
| 7.7 | 파일 삭제 (storage + meta) | 🟥 | DELETE /files/:id | S | P0 | 파일 삭제(스토리지 객체 + 메타 동시). | `DELETE /files/:id 핸들러를 구현하세요. 스토리지 객체와 record_files 메타를 동시 삭제(트랜잭션). Supertest로 삭제 후 객체·메타 부재를 통합 테스트하세요.` | 개발자 B |
| 7.8 | 민감 파일 추가 인증 (응급 정보) | 🔐 | middleware | M | P0 | 민감 파일(응급정보 등) 다운로드 시 추가 인증 미들웨어. 참고: docs/05 §11 보안 흐름, §17.2.5 | `민감 파일(is_sensitive) 다운로드 시 PIN/생체 추가 인증을 요구하는 미들웨어를 구현하세요. docs/05 §11·§17.2.5 따르기. Vitest 단위로 민감/비민감 분기·인증 통과/실패를 테스트하세요.` | 개발자 B |
| 7.9 | 파일 바이러스 스캔 (옵션) | 🔐 | edge function | M | P2 | 업로드 파일 바이러스 스캔 edge function(P2). | `업로드 파일 바이러스 스캔 edge function을 구현하세요(P2). 감염 시 격리·메타 플래그. 스캐너를 모킹해 Vitest로 정상/감염 처리 분기를 단위 테스트하세요.` | 개발자 B |

---

# 8. 이정표 · 타임라인 (Life Milestones)

> 🧪 **테스트 전략:** 통합 타임라인(records+milestones+self_expressions) 병합·정렬 로직을 Vitest 단위로, 필터 API를 Supertest 통합으로, 생애주기 자동 마커 트리거를 pgTAP로 검증한다.

## 8.1 이정표 CRUD

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 8.1.1 | 이정표 추가 | 🟦 | POST /milestones | S | P0 | 이정표 추가(진단·입학·졸업·취업 등). category·event_date. 참고: docs/02 §2(life_milestones), docs/01-record-matrix.md | `POST /milestones 핸들러를 구현하세요. category·event_date·title로 이정표 추가, 권한자 RLS. docs/02 §2·docs/01 참고. Vitest 단위(검증)+Supertest 통합 테스트를 작성하세요.` | 개발자 A |
| 8.1.2 | 이정표 단건 조회 | 🟩 | GET /milestones/:id | XS | P0 | 이정표 단건 조회. | `GET /milestones/:id 핸들러를 구현하세요. 이정표 단건을 권한 범위 내 조회. Supertest로 조회·권한 차단을 통합 테스트하세요.` | 개발자 A |
| 8.1.3 | 당사자별 이정표 목록 | 🟨 | GET /persons/:id/milestones | S | P0 | 당사자별 이정표 목록. | `GET /persons/:id/milestones 핸들러를 구현하세요. 당사자별 이정표를 event_date 정렬 반환. Supertest로 정렬·권한 범위를 통합 테스트하세요.` | 개발자 A |
| 8.1.4 | 이정표 수정 | 🟧 | PATCH /milestones/:id | XS | P0 | 이정표 수정. | `PATCH /milestones/:id 핸들러를 구현하세요. 권한자만 이정표 수정. Supertest로 수정·권한 차단을 통합 테스트하세요.` | 개발자 A |
| 8.1.5 | 이정표 삭제 | 🟥 | DELETE /milestones/:id | XS | P0 | 이정표 삭제. | `DELETE /milestones/:id 핸들러를 구현하세요. 권한자만 삭제. Supertest로 삭제·권한 차단을 통합 테스트하세요.` | 개발자 A |
| 8.1.6 | 카테고리별 이정표 필터 | 🟨 | GET /milestones?category= | XS | P0 | 카테고리별 이정표 필터. | `GET /milestones?category= 핸들러를 구현하세요. category enum별 필터링. Supertest로 카테고리 필터를 통합 테스트하세요.` | 개발자 A |

## 8.2 타임라인 (records + milestones + self_expressions 통합)

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 8.2.1 | 통합 타임라인 조회 (시간 역순) | 🟨 | GET /persons/:id/timeline | M | P0 | records+milestones+self_expressions 통합 타임라인(시간 역순). 참고: docs/05 §6 생애주기 타임라인 조회, wireframes/web/03-timeline.svg | `GET /persons/:id/timeline 핸들러를 구현하세요. records+milestones+self_expressions를 시간 역순으로 병합·페이징·권한 범위 필터. docs/05 §6·wireframes/web/03 참고. 병합 정렬 로직을 Vitest 단위 + Supertest 통합 테스트하세요.` | 개발자 A |
| 8.2.2 | 분야별 필터 | 🟨 | ?domain= | S | P0 | 타임라인 도메인 필터. 참고: docs/07 §1 도메인 컬러 | `타임라인에 ?domain= 도메인 필터를 추가하세요. docs/07 §1 도메인 컬러 참고. Supertest로 도메인 필터 결과를 통합 테스트하세요.` | 개발자 A |
| 8.2.3 | 생애주기별 필터 | 🟨 | ?life_stage= | S | P0 | 생애주기(life_stage)별 필터. 참고: docs/02 §4 Enum(life_stage) | `타임라인에 ?life_stage= 필터를 추가하세요. docs/02 §4 Enum 참고. Supertest로 생애주기 필터 결과를 통합 테스트하세요.` | 개발자 A |
| 8.2.4 | 날짜 범위 필터 | 🟨 | ?from=&to= | XS | P0 | 날짜 범위 필터. | `타임라인에 ?from=&to= 날짜 범위 필터를 추가하세요. Supertest로 경계값 포함/제외를 통합 테스트하세요.` | 개발자 A |
| 8.2.5 | 이정표만 보기 | 🟨 | ?milestones_only=true | XS | P0 | 이정표만 필터링. | `타임라인에 ?milestones_only=true 필터를 추가하세요. Supertest로 이정표만 반환됨을 통합 테스트하세요.` | 개발자 A |
| 8.2.6 | 작성자별 필터 | 🟨 | ?author= | XS | P1 | 작성자별 필터(P1). | `타임라인에 ?author= 작성자 필터를 추가하세요(P1). Supertest로 작성자 필터 결과를 통합 테스트하세요.` | 개발자 A |
| 8.2.7 | 타임라인 PDF 내보내기 | 🔀 | POST /timeline/export | M | P1 | 타임라인 PDF 내보내기(P1). 참고: docs/05 §6 | `POST /timeline/export 핸들러를 구현하세요(P1). 필터 적용된 타임라인을 PDF로 내보내기. docs/05 §6 참고. Vitest로 PDF 생성·필드 매핑을 단위 테스트하세요.` | 개발자 A |
| 8.2.8 | 생애주기 자동 마커 (트리거) | 🟧 | DB trigger | S | P0 | 생애주기 전환 시 자동 마커 삽입 트리거. 참고: docs/05 §10 당사자 전환기 처리 | `supabase/migrations/에 생애주기 전환 시 life_milestones에 자동 마커를 삽입하는 트리거를 작성하세요. docs/05 §10 따르기. pgTAP로 life_stage 변경 시 마커 생성을 검증하세요.` | 개발자 A |

---

# 9. 인수인계 (Handover)

> 🧪 **테스트 전략:** 4스텝 생성·확인 흐름을 Supertest 통합으로, 미확인 상태에서만 수정 가능·권한 자동 이양 트리거를 pgTAP로 검증한다.

## 9.1 인수인계 CRUD

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 9.1.1 | 인수인계 생성 (Flow-6 4스텝) | 🟦 | POST /handovers | M | P0 | 인수인계 생성 4스텝(분야·기간·요약·연계 기록). 참고: docs/06 §6 Flow-6 인수인계, docs/05 §7 인수인계, docs/02 §2(handovers), wireframes/web/56-worker-handover-create.svg | `POST /handovers 핸들러를 구현하세요. 분야·기간·요약·linked_record_ids로 인수인계 생성·후임자 알림. Zod 검증, docs/05 §7·docs/02 §2 따르기. Supertest로 생성·연계 기록 검증·알림을 통합 테스트하세요.` | 개발자 A |
| 9.1.2 | 인수인계 단건 조회 | 🟩 | GET /handovers/:id | S | P0 | 인수인계 상세 조회(연계 기록 포함). 참고: wireframes/web/40-supporter-handover-detail.svg | `GET /handovers/:id 핸들러를 구현하세요. 연계 기록 포함 인수인계 상세를 권한 범위 내 조회. wireframes/web/40 참고. Supertest로 조회·권한 차단을 통합 테스트하세요.` | 개발자 A |
| 9.1.3 | 받은 인계 목록 | 🟨 | GET /handovers/received | S | P0 | 받은 인계 목록. 참고: wireframes/web/39-supporter-handover-list.svg | `GET /handovers/received 핸들러를 구현하세요. 본인이 받은 인계 목록을 시간 역순 반환. wireframes/web/39 참고. Supertest로 수신자 범위·정렬을 통합 테스트하세요.` | 개발자 A |
| 9.1.4 | 전달한 인계 목록 | 🟨 | GET /handovers/sent | S | P0 | 전달한 인계 목록. | `GET /handovers/sent 핸들러를 구현하세요. 본인이 전달한 인계 목록을 반환. Supertest로 발신자 범위·정렬을 통합 테스트하세요.` | 개발자 A |
| 9.1.5 | 인계 수정 (미확인 상태에서만) | 🟧 | PATCH /handovers/:id | S | P0 | 인계 수정(미확인 상태에서만). 참고: docs/03 §RLS | `PATCH /handovers/:id 핸들러를 구현하세요. is_confirmed=false인 미확인 인계만 수정 허용. docs/03 §RLS 따르기. Supertest로 미확인 수정 허용·확인 후 차단을 통합 테스트하세요.` | 개발자 A |
| 9.1.6 | 인계 삭제 (취소) | 🟥 | DELETE /handovers/:id | XS | P1 | 인계 삭제/취소(P1). | `DELETE /handovers/:id 핸들러를 구현하세요(P1). 미확인 인계만 삭제/취소. Supertest로 삭제·확인 후 차단을 통합 테스트하세요.` | 개발자 A |

## 9.2 인계 플로우

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 9.2.1 | Step1 — 기본 설정 (분야·기간·후임자) | 🟦 | UI step | S | P0 | Step1 — 분야·인계 기간·후임자 지정. 참고: docs/06 §6 Flow-6, wireframes/web/56-worker-handover-create.svg | `인계 위자드 Step1 컴포넌트를 features/handover에 구현하세요. 분야·기간·후임자 검색·지정. wireframes/web/56 참고. 입력 상태·검증을 Vitest 단위 테스트하세요.` | 개발자 A |
| 9.2.2 | Step2 — 핵심 요약·특이사항 태그 | 🟦 | UI step | S | P0 | Step2 — 핵심 요약·특이사항 태그 작성. | `인계 위자드 Step2 컴포넌트를 구현하세요. 핵심 요약·특이사항 태그 입력. 태그 추가/제거·필수 검증을 Vitest 단위 테스트하세요.` | 개발자 A |
| 9.2.3 | Step3 — 중요 기록 다중 선택 | 🟦 | UI step | M | P0 | Step3 — 중요 기록 다중 선택(linked_record_ids). | `인계 위자드 Step3 컴포넌트를 구현하세요. 권한 범위 내 기록을 TanStack Query로 페치·다중 선택(linked_record_ids). 선택 상태·해제를 Vitest 단위 테스트하세요.` | 개발자 A |
| 9.2.4 | Step4 — 미리보기·발송·알림 | 🟦 | UI step + notification | S | P0 | Step4 — 미리보기·발송 + 후임자 알림. 참고: docs/05 §8 알림 | `인계 위자드 Step4 컴포넌트를 구현하세요. 미리보기 후 POST /handovers(9.1.1) mutation 호출·후임자 알림·성공 처리. docs/05 §8 따르기. mutation 모킹으로 제출·에러를 단위 테스트하세요.` | 개발자 A |
| 9.2.5 | 인계 확인 처리 (is_confirmed) | 🟧 | PATCH /handovers/:id/confirm | S | P0 | 후임자 인계 확인 처리(is_confirmed). 참고: docs/04 §3 활동지원사 | `PATCH /handovers/:id/confirm 핸들러를 구현하세요. 후임자만 is_confirmed=true 처리, 발신자 알림. docs/04 §3 참고. Supertest로 후임자 확인·타인 차단을 통합 테스트하세요.` | 개발자 A |
| 9.2.6 | 인계 확인 시 권한 자동 이양 (옵션) | 🟧 | trigger | M | P1 | 인계 확인 시 권한 자동 이양 트리거(옵션, P1). 참고: docs/05 §7·§2 | `supabase/migrations/에 인계 확인 시 권한을 후임자에게 자동 이양하는 트리거를 작성하세요(P1, 옵션). docs/05 §7·§2 따르기. pgTAP로 확인→권한 이양·기존 권한 만료를 검증하세요.` | 개발자 A |

---

# 10. 알림 (Notification)

> 🧪 **테스트 전략:** 이벤트→알림 자동 생성 트리거를 pgTAP로, 채널(FCM·이메일·SMS) 발송 함수는 외부 SDK 모킹 Vitest 단위로, 설정 API는 Supertest 통합으로 검증한다.

## 10.1 알림 인프라

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 10.1.1 | 알림 생성 (이벤트별 자동) | 🟦 | trigger fn | M | P0 | 이벤트별 알림 자동 생성 트리거(기록 작성·권한 변경·인계 등). 참고: docs/05 §8 알림 발송/수신, docs/02 §3 JSONB(notification payload) | `supabase/migrations/에 이벤트별 알림 자동 생성 트리거를 작성하세요. 기록 작성·권한 변경·인계 이벤트별 type·payload(JSONB) 생성. docs/05 §8·docs/02 §3 따르기. pgTAP로 각 이벤트가 올바른 알림을 생성하는지 검증하세요.` | 개발자 A |
| 10.1.2 | 알림 단건 조회 | 🟩 | GET /notifications/:id | XS | P0 | 알림 단건 조회. | `GET /notifications/:id 핸들러를 구현하세요. 본인 알림 단건만 조회. Supertest로 본인 조회·타인 차단을 통합 테스트하세요.` | 개발자 A |
| 10.1.3 | 사용자별 알림 목록 (페이징) | 🟨 | GET /notifications | S | P0 | 사용자별 알림 목록(페이징). 참고: wireframes/web/23-guardian-notifications.svg | `GET /notifications 핸들러를 구현하세요. 본인 알림을 시간 역순·페이징·읽음 필터 반환. wireframes/web/23 참고. Supertest로 페이징·읽음 필터를 통합 테스트하세요.` | 개발자 A |
| 10.1.4 | 알림 읽음 처리 | 🟧 | PATCH /notifications/:id/read | XS | P0 | 알림 읽음 처리. | `PATCH /notifications/:id/read 핸들러를 구현하세요. 본인 알림 is_read=true 처리. Supertest로 읽음 처리·타인 차단을 통합 테스트하세요.` | 개발자 A |
| 10.1.5 | 알림 일괄 읽음 처리 | 🔀 | PATCH /notifications/read-all | XS | P0 | 알림 일괄 읽음 처리. | `PATCH /notifications/read-all 핸들러를 구현하세요. 본인 미읽음 알림 전체를 읽음 처리. Supertest로 일괄 처리·본인 범위를 통합 테스트하세요.` | 개발자 A |
| 10.1.6 | 알림 삭제 | 🟥 | DELETE /notifications/:id | XS | P1 | 알림 삭제(P1). | `DELETE /notifications/:id 핸들러를 구현하세요(P1). 본인 알림만 삭제. Supertest로 삭제·타인 차단을 통합 테스트하세요.` | 개발자 A |

## 10.2 알림 채널

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 10.2.1 | FCM (앱 푸시) 발송 | 🟦 | edge function | M | P0 | FCM 앱 푸시 발송 edge function. 참고: docs/05 §8, §16.6.1 | `FCM 앱 푸시 발송 edge function을 supabase/functions에 구현하세요. 토큰 조회·페이로드 구성·전송·실패 토큰 정리. docs/05 §8·§16.6.1 참고. FCM SDK를 모킹해 Vitest로 성공/실패 분기를 단위 테스트하세요.` | 개발자 A |
| 10.2.2 | 이메일 발송 (SendGrid/Resend) | 🟦 | edge function | S | P0 | 이메일 발송(SendGrid/Resend) edge function. 참고: docs/05 §8 | `Resend 이메일 발송 edge function을 구현하세요. 템플릿 렌더·전송·실패 로깅. docs/05 §8 참고. Resend를 모킹해 Vitest로 템플릿 렌더·전송 호출을 단위 테스트하세요.` | 개발자 A |
| 10.2.3 | SMS 발송 (응급용) | 🟦 | edge function | M | P1 | SMS 발송(응급용, P1). | `SMS 발송 edge function을 구현하세요(P1, 응급용). 발송·실패 폴백. SMS 게이트웨이를 모킹해 Vitest로 발송·실패 처리를 단위 테스트하세요.` | 개발자 A |
| 10.2.4 | 사용자별 채널 설정 조회 | 🟩 | GET /notification-settings | XS | P0 | 사용자별 알림 채널 설정 조회. 참고: wireframes/web/27-guardian-notification-settings.svg | `GET /notification-settings 핸들러를 구현하세요. 본인 채널 설정을 조회·미설정 시 기본값. wireframes/web/27 참고. Supertest로 조회·기본값을 통합 테스트하세요.` | 개발자 A |
| 10.2.5 | 사용자별 채널 설정 수정 | 🟧 | PATCH /notification-settings | S | P0 | 알림 채널 설정 수정. | `PATCH /notification-settings 핸들러를 구현하세요. 채널(푸시·이메일·SMS) on/off 수정. Zod 검증. Supertest로 수정·검증을 통합 테스트하세요.` | 개발자 A |
| 10.2.6 | 알림 유형별 토글 (매트릭스) | 🟧 | PATCH /notification-settings/types | S | P0 | 알림 유형별 on/off 토글 매트릭스. 참고: wireframes/web/27-guardian-notification-settings.svg | `PATCH /notification-settings/types 핸들러를 구현하세요. 알림 유형×채널 매트릭스 토글 저장. wireframes/web/27 참고. Supertest로 매트릭스 저장·부분 갱신을 통합 테스트하세요.` | 개발자 A |
| 10.2.7 | 방해 금지 시간대 설정 | 🟧 | PATCH /notification-settings/quiet-hours | S | P1 | 방해 금지 시간대 설정(P1). | `PATCH /notification-settings/quiet-hours 핸들러를 구현하세요(P1). 방해 금지 시간대 저장·발송 시 적용. Vitest로 시간대 내 발송 억제 로직을 단위 테스트하세요.` | 개발자 A |
| 10.2.8 | 푸시 토큰 등록 (앱 설치) | 🟦 | POST /push-tokens | S | P0 | 앱 설치 시 푸시 토큰 등록. 참고: §16.6.1 | `POST /push-tokens 핸들러를 구현하세요. 앱 설치 시 디바이스 푸시 토큰 등록·중복 제거·만료 토큰 갱신. §16.6.1 참고. Supertest로 등록·중복 처리를 통합 테스트하세요.` | 개발자 A |

---

# 11. 접근 로그 (Audit)

> 🧪 **테스트 전략:** read/write 자동 로깅·불변성을 pgTAP로 검증하고, 로그 조회·필터·내보내기 API는 Supertest 통합으로 검증한다.

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 11.1 | 모든 read 자동 로깅 (트리거) | 🟦 | DB trigger | M | P0 | 모든 read 자동 로깅 트리거(누가 무엇을 열람). 참고: docs/02 §2(access_logs), docs/05 §9 접근 로그 조회 | `민감 리소스 read를 access_logs에 자동 기록하는 함수/트리거를 작성하세요. actor·target_table·target_id 기록. docs/02 §2·docs/05 §9 따르기. pgTAP로 read 시 로그 생성을 검증하세요.` | PL |
| 11.2 | 모든 write 자동 로깅 (트리거) | 🟦 | DB trigger | S | P0 | 모든 write 자동 로깅 트리거. 참고: docs/03 §RLS | `INSERT/UPDATE/DELETE write를 access_logs에 자동 기록하는 트리거를 작성하세요. docs/03 §RLS 따르기. pgTAP로 각 write 동작이 로그를 남기는지 검증하세요.` | PL |
| 11.3 | 권한 외 시도 별도 로깅 | 🟦 | trigger | S | P0 | 권한 외 접근 시도 별도 로깅. 참고: docs/05 §11 보안 흐름 | `권한 외 접근 시도를 access_logs에 violation action으로 별도 기록하는 트리거를 작성하세요. docs/05 §11 따르기. pgTAP로 무권한 접근 시 violation 로그 생성을 검증하세요.` | PL |
| 11.4 | 당사자별 접근 로그 조회 | 🟨 | GET /persons/:id/access-logs | M | P0 | 당사자별 접근 로그 조회(보호자 투명성). 참고: docs/05 §9, wireframes/web/22-guardian-access-log.svg | `GET /persons/:id/access-logs 핸들러를 구현하세요. 당사자별 접근 로그를 보호자에게 시간 역순·페이징 반환. docs/05 §9·wireframes/web/22 참고. Supertest로 보호자 조회·권한 차단을 통합 테스트하세요.` | PL |
| 11.5 | 접근 로그 필터 (날짜·접근자·동작) | 🟨 | ?filter= | S | P0 | 접근 로그 필터(날짜·접근자·동작). | `접근 로그 조회에 날짜·접근자·action 필터를 추가하세요. Supertest로 각 필터 조합 결과를 통합 테스트하세요.` | PL |
| 11.6 | 이상 활동 자동 감지 (rule engine) | 🔐 | edge function | M | P1 | 이상 활동 자동 감지 rule engine(P1). 참고: docs/05 §11 | `이상 활동 감지 rule engine edge function을 구현하세요(P1). 임계치(빈도·시간대·대량 열람) 룰 평가→알림. docs/05 §11 참고. Vitest로 각 룰 트리거 조건을 단위 테스트하세요.` | PL |
| 11.7 | 로그 CSV 내보내기 | 🔀 | POST /access-logs/export | S | P0 | 접근 로그 CSV 내보내기. | `POST /access-logs/export 핸들러를 구현하세요. 필터 적용 로그를 CSV로 내보내기·권한 범위 제한. Vitest로 CSV 포맷·이스케이프를 단위 테스트하세요.` | PL |
| 11.8 | 월간 보고서 자동 발송 (cron) | 🔀 | scheduled fn | S | P1 | 월간 접근 보고서 자동 발송 cron(P1). | `월간 접근 보고서를 생성·발송하는 scheduled function을 구현하세요(P1). 시간을 모킹해 Vitest로 월 집계·발송 호출을 단위 테스트하세요.` | PL |
| 11.9 ✨ NEW | 로그 파기 배치 (purge_expired_audit_logs + pg_cron) | 🔀 | scheduled fn | S | P0 | append-only 로그(access_logs·permission_logs)의 보유기간 경과분을 service_role(RLS 우회)로 파기하는 배치. `purge_expired_audit_logs(p_retention interval)` 함수(SECURITY DEFINER·service_role EXECUTE 전용) + pg_cron 스케줄. 사용자 불변 RLS는 유지(불변=사용자 변조 방지, 파기=시스템 배치). 보유기간 수치는 docs/16 §4.1·§9 #1 법무 확정 전 🟡 TBD. 참고: docs/13 §4.1, docs/16 §4.3 | `supabase/migrations/에 purge_expired_audit_logs(p_retention interval) 함수와 pg_cron 스케줄을 작성하세요. created_at < now()-p_retention인 access_logs·permission_logs 행만 service_role로 DELETE(SECURITY DEFINER, PUBLIC/authenticated EXECUTE 차단). 사용자 경로 불변 RLS는 그대로 두세요. docs/13 §4.1·docs/16 §4.3 따르기. p_retention 실제 수치는 법무 확정 전 주입하지 말 것(🟡). pgTAP로 경과분만 삭제·authenticated 호출 차단·사용자 변조 차단 유지를 검증하세요.` | PL |
| 11.10 ✨ NEW | soft-delete hard-delete 배치 | 🔀 | scheduled fn | S | P1 | 사용자 대면 테이블의 soft-delete 행(deleted_at IS NOT NULL)을 유예기간 경과 후 물리 삭제하는 service_role 배치(P1). persons 파기 시 연결된 records·self_expressions·record_files·매핑·secure_identifiers·consents 동시 처리, record_files는 Storage 객체도 동시 hard delete. 유예기간은 🟡 TBD. 참고: docs/16 §4.2·§4.3, docs/02 §5 | `supabase/functions에 soft-delete hard-delete 배치를 구현하세요(P1). deleted_at이 유예기간을 경과한 행을 service_role로 물리 삭제하고, record_files는 Storage 객체도 동시 삭제하세요. persons 파기 시 연결 테이블(records·self_expressions·record_files·매핑·secure_identifiers·consents)을 일괄 처리하세요. docs/16 §4.2·§4.3 따르기. 유예기간 수치는 확정 전 주입하지 말 것(🟡). 경과분만 삭제·Storage 동기 삭제를 Vitest 단위 테스트하세요.` | PL |

---

# 11.5 백엔드 통합 테스트 체크포인트 [✨ 신규]

> 🧪 **테스트 전략:** Phase 5~11까지 백엔드(API·RLS·트리거)가 모두 구현된 시점에서, **각 Phase에 분산된 단위 테스트를 넘어 핵심 워크플로우·RLS 전체·역할별 시나리오를 통합 검증**한다. 이 체크포인트를 통과해야 Phase 12 프론트엔드로 진입한다.

| ID | 작업 | CRUD | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|------|:---:|:-:| :-------- | :-------- | :----: |
| 11.5.1 ✨ NEW | API 통합 테스트 전체 실행 (핵심 워크플로우 5개) | 🔐 | Supertest suite | M | P0 | 핵심 워크플로우 5개(가입~당사자 등록~권한 부여 / 기록 작성~조회 / 자기표현~보호자 알림 / 인계 생성~확인 / 권한 회수~접근 차단)를 실 Supabase 연동 Supertest로 엔드투엔드 검증. | `tests/integration/에 핵심 워크플로우 5개 Supertest 통합 테스트 스위트를 작성하세요: (1)가입→당사자 등록→권한 부여, (2)기록 작성→권한자 조회, (3)자기표현 작성→보호자 알림, (4)인계 생성→후임자 확인, (5)권한 회수→즉시 접근 차단. 실 Supabase에 시드 데이터를 넣고 docs/05 워크플로우대로 검증하세요.` | PM |
| 11.5.2 ✨ NEW | RLS 정책 전체 자동 검증 (pgTAP) | 🔐 | pgTAP suite | M | P0 | Phase 1~11에서 작성한 모든 RLS 정책(records·self_expressions·permissions·access_logs 등)을 한 번에 회귀 검증하는 pgTAP 마스터 스위트. | `supabase/tests/에 전체 RLS 회귀 pgTAP 마스터 스위트를 구성하세요. records·self_expressions·permissions·access_logs 등 모든 테이블에 대해 역할별 SELECT/INSERT/UPDATE/DELETE 허용·차단을 docs/03 §RLS 기준으로 검증하고, CI(0.14)에서 일괄 실행되도록 연결하세요.` | PM |
| 11.5.3 ✨ NEW | 역할별 접근 시나리오 통합 테스트 | 🔐 | scenario suite | M | P0 | 보호자·당사자·전문가 4역할 각각이 자신의 권한 범위 안/밖 리소스에 접근하는 시나리오를 통합 검증(권한 매트릭스 정합성). | `tests/integration/role-scenarios/에 역할별 접근 시나리오 스위트를 작성하세요. 보호자·당사자·활동지원사·특수교사·사회복지사·치료사 각각이 권한 내 리소스 접근 성공·권한 외 리소스 접근 차단되는지 검증하세요. docs/04 역할별 워크플로우·docs/13 RLS 정책을 기준으로 매트릭스 정합성을 확인하세요.` | PM |

---

# 12. 디자인 시스템 (Phase 12)

> 🧪 **테스트 전략:** 모든 컴포넌트는 **Storybook 스토리 + 스냅샷 테스트**를 동시 작성하고, 접근성 토큰은 axe-core로 대비를 자동 검증한다.

## 12.1 토큰 (07-design-system.md 기반)

| ID | 작업 | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|------|:---:|:-:| :-------- | :-------- | :----: |
| 12.1.1 | 컬러 토큰 (Primary·Domain×6·Status) | tokens.ts | S | P0 | 컬러 토큰(Primary·6 도메인 컬러·Status). 참고: docs/07-design-system.md §1 컬러 시스템, §10 Tailwind 설정 | `packages/shared/design/tokens.ts에 컬러 토큰(Primary·6 도메인 컬러·Status)을 정의하세요. docs/07 §1·§10 Tailwind 설정을 정확히 따르세요. 토큰 값·키 존재를 Vitest 스냅샷으로 검증하세요.` | 개발자 C |
| 12.1.2 | 타이포 토큰 (Pretendard 스케일) | tokens.ts | XS | P0 | 타이포 토큰(Pretendard 스케일). 참고: docs/07 §2 타이포그래피 | `tokens.ts에 타이포 토큰(Pretendard 스케일·웨이트·행간)을 정의하세요. docs/07 §2를 따르세요. 스케일 단조 증가를 Vitest 단위 테스트하세요.` | 개발자 C |
| 12.1.3 | 스페이싱·반경·그림자 토큰 | tokens.ts | XS | P0 | 스페이싱·보더 레디어스·엘리베이션 토큰. 참고: docs/07 §3·§4·§5 | `tokens.ts에 스페이싱·보더 레디어스·엘리베이션(그림자) 토큰을 정의하세요. docs/07 §3·§4·§5를 따르세요. 토큰 키·값을 Vitest 스냅샷으로 검증하세요.` | 개발자 C |
| 12.1.4 | 접근성 토큰 (당사자 모드: 큰글씨·고대비) | tokens-a11y.ts | S | P0 | 당사자 접근성 토큰(큰 글씨·고대비). 참고: docs/07 §9 당사자 접근성 모드 | `tokens-a11y.ts에 당사자 접근성 토큰(큰 글씨 스케일·고대비 컬러)을 정의하세요. docs/07 §9를 따르세요. 고대비 조합의 대비비 4.5:1 이상을 axe-core/대비 계산 단위 테스트로 검증하세요.` | 개발자 C |

## 12.2 Primitives

| ID | 작업 | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|------|:---:|:-:| :-------- | :-------- | :----: |
| 12.2.1 | Button (variant: primary/secondary/destructive) | Button.tsx | S | P0 | Button(primary/secondary/destructive). 참고: docs/07 §8 컴포넌트 라이브러리(Button) | `packages/shared/components에 Button.tsx(primary/secondary/destructive variant)를 구현하세요. docs/07 §8 따르기. Storybook 스토리와 variant별 렌더 스냅샷·disabled 동작 테스트를 작성하세요.` | 개발자 C |
| 12.2.2 | Input (text/email/password/number) | Input.tsx | S | P0 | Input(text/email/password/number). 참고: docs/07 §8(Input) | `Input.tsx(text/email/password/number)를 구현하세요. label·error·aria 연결 포함. docs/07 §8 따르기. Storybook + 타입별 렌더·에러 표시 스냅샷 테스트를 작성하세요.` | 개발자 C |
| 12.2.3 | TextArea | TextArea.tsx | XS | P0 | TextArea. 참고: docs/07 §8 | `TextArea.tsx를 구현하세요. 자동 높이·글자수 표시. docs/07 §8 따르기. Storybook + 입력 동작 스냅샷 테스트를 작성하세요.` | 개발자 C |
| 12.2.4 | Select / Dropdown | Select.tsx | S | P0 | Select/Dropdown. 참고: docs/07 §8 | `Select.tsx(Dropdown)를 구현하세요. 키보드 네비게이션·aria-expanded 포함. docs/07 §8 따르기. Storybook + 선택·키보드 조작 테스트를 작성하세요.` | 개발자 C |
| 12.2.5 | Checkbox / Radio | Checkbox.tsx | XS | P0 | Checkbox/Radio. 참고: docs/07 §8 | `Checkbox.tsx·Radio를 구현하세요. label 연결·aria-checked. docs/07 §8 따르기. Storybook + 토글 상태 스냅샷 테스트를 작성하세요.` | 개발자 C |
| 12.2.6 | Toggle / Switch | Toggle.tsx | XS | P0 | Toggle/Switch. 참고: docs/07 §8 | `Toggle.tsx(Switch)를 구현하세요. role=switch·aria-checked. docs/07 §8 따르기. Storybook + on/off 전환 테스트를 작성하세요.` | 개발자 C |
| 12.2.7 | Badge (도메인 컬러 6 variant) | Badge.tsx | XS | P0 | Badge(도메인 6 컬러 variant). 참고: docs/07 §1 도메인 컬러·§8 | `Badge.tsx(도메인 6 컬러 variant)를 구현하세요. tokens.ts 도메인 컬러 사용. docs/07 §1·§8 따르기. Storybook + variant별 컬러 스냅샷 테스트를 작성하세요.` | 개발자 C |
| 12.2.8 | Avatar | Avatar.tsx | XS | P0 | Avatar. 참고: docs/07 §8 | `Avatar.tsx를 구현하세요. 이미지·이니셜 폴백·사이즈 variant. docs/07 §8 따르기. Storybook + 폴백 렌더 스냅샷 테스트를 작성하세요.` | 개발자 C |

## 12.3 Composite Components

| ID | 작업 | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|------|:---:|:-:| :-------- | :-------- | :----: |
| 12.3.1 | RecordCard (도메인별 컬러 + 첨부 미리보기) | RecordCard.tsx | S | P0 | RecordCard(도메인 컬러+첨부 미리보기). 참고: docs/07 §8 컴포넌트 라이브러리(RecordCard) | `RecordCard.tsx를 구현하세요. 도메인 컬러 배지·첨부 미리보기·핀/이정표 표시. docs/07 §8 따르기. Storybook + 도메인별·첨부 유무 스냅샷 테스트를 작성하세요.` | 개발자 C |
| 12.3.2 | PersonCard (당사자 카드) | PersonCard.tsx | S | P0 | PersonCard(당사자 카드). 참고: docs/07 §8 | `PersonCard.tsx(당사자 카드)를 구현하세요. 사진·이름·생애주기·요약. docs/07 §8 따르기. Storybook + 데이터 유무 스냅샷 테스트를 작성하세요.` | 개발자 C |
| 12.3.3 | NotificationCard (3 type variant) | NotificationCard.tsx | S | P0 | NotificationCard(3 type variant). 참고: docs/07 §8 | `NotificationCard.tsx(3 type variant)를 구현하세요. type별 아이콘·읽음 상태·인라인 액션. docs/07 §8 따르기. Storybook + type별·읽음 상태 스냅샷 테스트를 작성하세요.` | 개발자 C |
| 12.3.4 | IconSelectorCard (ST-08, 자기표현 전용) | IconSelectorCard.tsx | M | P0 | IconSelectorCard(자기표현 전용, 큰 아이콘). 참고: docs/07 §6 아이콘·§9, docs/06 §6 Flow-1 | `IconSelectorCard.tsx(자기표현 전용·큰 아이콘)를 구현하세요. 큰 터치 타깃·선택 강조·aria-pressed·접근성 토큰 적용. docs/07 §6·§9·docs/06 §6 따르기. Storybook + 선택 상태·접근성 스냅샷 테스트를 작성하세요.` | 개발자 C |
| 12.3.5 | StepIndicator (위자드 진행) | StepIndicator.tsx | S | P0 | StepIndicator(위자드 진행 표시). 참고: docs/07 §8, docs/06 §6 플로우 | `StepIndicator.tsx(위자드 진행 표시)를 구현하세요. 현재/완료/대기 단계·aria-current. docs/07 §8·docs/06 §6 따르기. Storybook + 단계별 진행 스냅샷 테스트를 작성하세요.` | 개발자 C |

## 12.4 레이아웃 셀

| ID | 작업 | 산출물 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|------|:---:|:-:| :-------- | :-------- | :----: |
| 12.4.1 | 웹 Sidebar (240px ↔ 64px 접힘) | Sidebar.tsx | M | P0 | 웹 Sidebar(240px↔64px 접힘). 참고: docs/06 §2 내비게이션 패턴, docs/07 §8 | `apps/web에 Sidebar.tsx(240px↔64px 접힘)를 구현하세요. 역할별 메뉴·접힘 상태 저장·키보드 네비게이션. docs/06 §2·docs/07 §8 따르기. Storybook + 펼침/접힘 스냅샷·키보드 조작 테스트를 작성하세요.` | 개발자 C |
| 12.4.2 | 웹 GlobalHeader (검색·알림·프로필) | Header.tsx | S | P0 | 웹 GlobalHeader(검색·알림·프로필). 참고: docs/06 §4 반응형 웹 IA | `apps/web에 Header.tsx(검색·알림 배지·프로필 메뉴)를 구현하세요. docs/06 §4 따르기. Storybook + 알림 배지·메뉴 열림 스냅샷 테스트를 작성하세요.` | 개발자 C |
| 12.4.3 | 모바일 BottomTabBar (역할별 variant) | TabBar.tsx | M | P0 | 모바일 BottomTabBar(역할별 variant). 참고: docs/06 §5 모바일 앱 IA, §2 내비게이션 | `apps/mobile에 TabBar.tsx(역할별 variant)를 구현하세요. 역할별 탭 구성·활성 표시·접근성 레이블. docs/06 §5·§2 따르기. 역할별 탭 렌더 Jest 스냅샷 테스트를 작성하세요.` | 개발자 C |
| 12.4.4 | 모바일 NavigationBar (Push 스택용) | NavBar.tsx | S | P0 | 모바일 NavigationBar(Push 스택용). 참고: docs/06 §5 | `apps/mobile에 NavBar.tsx(Push 스택용)를 구현하세요. 뒤로가기·타이틀·우측 액션. docs/06 §5 따르기. 렌더·뒤로가기 동작 Jest 테스트를 작성하세요.` | 개발자 C |

---

# 13. 웹 UI — 보호자 (Guardian, 19 screens)

> 🧪 **테스트 전략:** 각 화면은 API 연동 작업 ID의 데이터를 **TanStack Query 훅**으로 페치하고, 폼은 **RHF+Zod**로 검증한다. 주요 화면마다 **Playwright E2E 테스트 파일을 동시 작성**하고 ARIA 레이블·키보드 접근을 포함한다.

## 13.1 인증 화면

| ID | 화면 | API 연동 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|--------|:---:|:-:| :-------- | :-------- | :----: |
| 13.1.1 | A-01 로그인 | 2.2, 2.10, 2.11 | S | P0 | 보호자 로그인 화면(이메일·소셜). 참고: docs/06 §4 반응형 웹 IA, wireframes/web/01-login.svg | `apps/web/app/(auth)/login에 로그인 화면을 구현하세요. API 연동 2.2(로그인)·2.10/2.11(소셜). RHF+Zod 폼 검증, TanStack mutation 제출. wireframes/web/01-login.svg 준수, 입력 label·aria-invalid 적용. Playwright E2E(성공·실패) 테스트 파일을 동시 작성하세요.` | 개발자 C |
| 13.1.2 | A-03 회원가입·역할 선택 | 2.1 | S | P0 | 회원가입 역할 선택. 참고: docs/05 §1 온보딩, wireframes/web/11-signup-role.svg | `회원가입 역할 선택 화면을 구현하세요. API 연동 2.1. radiogroup·aria-checked로 역할 선택. wireframes/web/11-signup-role.svg 준수. Playwright E2E(역할 선택→다음)와 접근성(키보드 선택) 테스트를 작성하세요.` | 개발자 C |
| 13.1.3 | A-04 회원가입·기본정보 | 2.1, 2.4 | S | P0 | 회원가입 기본정보 입력. 참고: wireframes/web/12-signup-profile.svg | `회원가입 기본정보 화면을 구현하세요. API 연동 2.1·2.4(인증 메일). RHF+Zod 검증, TanStack mutation. wireframes/web/12-signup-profile.svg 준수, 필수 필드 aria-required. Playwright E2E(제출→인증 안내) 테스트를 작성하세요.` | 개발자 C |
| 13.1.4 | A-05 이메일 인증 | 2.5 | S | P0 | 이메일 인증 화면. 참고: wireframes/web/13-signup-verify.svg | `이메일 인증 화면을 구현하세요. API 연동 2.5(확인). 토큰 자동 확인·재발송 버튼. wireframes/web/13-signup-verify.svg 준수, 상태 안내 aria-live. Playwright E2E(인증 성공·만료) 테스트를 작성하세요.` | 개발자 C |
| 13.1.5 | A-06 초대 링크 수락 | 2.9 | M | P0 | 초대 링크 수락 화면. 참고: docs/05 §1, wireframes/web/14-invite-accept.svg | `초대 링크 수락 화면을 구현하세요. API 연동 2.9. 토큰 검증·신규/기존 분기 UI·권한 미리보기. docs/05 §1·wireframes/web/14 준수. Playwright E2E(신규·기존·만료 분기) 테스트를 작성하세요.` | 개발자 C |
| 13.1.6 | A-07 비밀번호 재설정 | 2.6, 2.7 | S | P0 | 비밀번호 재설정 화면. 참고: wireframes/web/15-reset-password.svg | `비밀번호 재설정 화면을 구현하세요. API 연동 2.6(요청)·2.7(확인). RHF+Zod 비밀번호 정책 검증. wireframes/web/15 준수, aria-describedby로 정책 안내. Playwright E2E(요청→재설정) 테스트를 작성하세요.` | 개발자 C |
| 13.1.7 ✨ NEW | A-08 동의 수집 화면 | 2.12, 2.13 | M | P0 | 회원가입·당사자 등록 플로우 내 동의 수집 단계 — 필수/선택 분리 체크박스, 민감정보·고유식별정보 별도 동의, 14세 미만·피후견인 대리동의 안내. policy_version 표시, A-09/A-10 전문 보기 진입. 일괄 동의 금지(PIPA §22⑤). 참고: docs/05 §1-3, docs/16 §2·§3, wireframes/web/63-signup-consent.svg | `apps/web 회원가입 플로우에 A-08 동의 수집 화면을 구현하세요. API 연동 2.12(동의 INSERT)·2.13(주체 판정). 필수/선택 분리 체크박스(일괄 동의 금지)·민감/고유식별 별도 동의·대리동의 안내·policy_version 표시·A-09/A-10 전문 보기 링크. docs/05 §1-3·docs/16 §2·§3·wireframes/web/63 준수, fieldset·aria-required. Playwright E2E(필수 누락 차단·전체 동의→다음) 테스트를 작성하세요.` | 개발자 C |
| 13.1.8 ✨ NEW | A-09 이용약관 · A-10 처리방침 전문 페이지 | — | S | P1 | 정적 전문 페이지(PIPA §30 게시 의무) — 이용약관(A-09)·개인정보 처리방침(A-10). A-08 전문 보기·푸터·설정에서 진입. 버전·시행일 표기, 변경 고지 연계(docs/16 §7). 콘텐츠는 17.4.x(법무) 산출물 게시. 참고: docs/16 §7, wireframes/web/64-legal-terms.svg·65-legal-privacy.svg | `apps/web에 A-09 이용약관·A-10 개인정보 처리방침 정적 전문 페이지를 구현하세요(P1, API 연동 없음). 버전·시행일 표기, 푸터·A-08·설정에서 진입. 콘텐츠는 17.4.x 법무 산출물을 게시. docs/16 §7·wireframes/web/64·65 준수, article landmark·heading 구조. Playwright E2E(진입·앵커 이동) 테스트를 작성하세요.` | 개발자 C |

## 13.2 메인 화면

| ID | 화면 | API 연동 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|--------|:---:|:-:| :-------- | :-------- | :----: |
| 13.2.1 | G-01 대시보드 | 3.2.3, 8.2.1 | M | P0 | 보호자 대시보드(당사자 목록·최근 활동·알림). 참고: docs/04 §1 보호자, wireframes/web/02-guardian-dashboard.svg | `보호자 대시보드를 구현하세요. API 연동 3.2.3(당사자 목록)·8.2.1(타임라인). TanStack Query로 병렬 페치, PersonCard 그리드·최근 활동·알림 요약. wireframes/web/02 준수, landmark·heading 구조. Playwright E2E(로드→당사자 진입) 테스트를 작성하세요.` | 개발자 C |
| 13.2.2 | G-02 당사자 프로필 | 3.2.2, 4.1.3 | M | P0 | 당사자 프로필(요약·권한 현황). 참고: wireframes/web/16-guardian-person-profile.svg | `당사자 프로필 화면을 구현하세요. API 연동 3.2.2(상세)·4.1.3(권한 매트릭스). TanStack Query 페치, 요약·권한 현황·진입 버튼. wireframes/web/16 준수. Playwright E2E(프로필 로드→기록/권한 이동) 테스트를 작성하세요.` | 개발자 C |
| 13.2.3 | G-03 당사자 등록 위자드 (5 step) | 3.2.1 | L | P0 | 당사자 등록 위자드 5스텝. 참고: docs/04 §1, wireframes/web/17-guardian-person-register.svg | `당사자 등록 위자드 5스텝을 구현하세요. API 연동 3.2.1. StepIndicator·단계별 RHF+Zod 검증·중간 저장·마지막 단계 TanStack mutation. wireframes/web/17 준수, aria-current. Playwright E2E(전체 5스텝 완주) 테스트를 작성하세요.` | 개발자 C |
| 13.2.4 | G-10 타임라인 | 8.2.* | M | P0 | 생애주기 타임라인. 참고: docs/05 §6, wireframes/web/03-timeline.svg | `생애주기 타임라인 화면을 구현하세요. API 연동 8.2.1~8.2.5(필터). TanStack Query 무한 스크롤·도메인/생애주기/날짜 필터. wireframes/web/03 준수, 시간순 리스트 aria. Playwright E2E(필터 적용·스크롤) 테스트를 작성하세요.` | 개발자 C |
| 13.2.5 | G-20 기록 관리 (전체) | 5.0.3 | M | P0 | 전체 기록 관리. 참고: wireframes/web/04-record-list.svg | `전체 기록 관리 화면을 구현하세요. API 연동 5.0.3(목록). TanStack Query 페이징·필터, RecordCard 리스트. wireframes/web/04 준수. Playwright E2E(필터·페이징·상세 진입) 테스트를 작성하세요.` | 개발자 C |
| 13.2.6 | G-21 분야별 기록 목록 | 5.0.4 | S | P0 | 도메인별 기록 목록. 참고: wireframes/web/18-guardian-records-domain.svg | `분야별 기록 목록 화면을 구현하세요. API 연동 5.0.4. 도메인 탭·TanStack Query 페치·도메인 컬러 적용. wireframes/web/18 준수. Playwright E2E(도메인 전환) 테스트를 작성하세요.` | 개발자 C |
| 13.2.7 | G-22 기록 상세 (Split) | 5.0.2 | M | P0 | 기록 상세(Split 뷰). 참고: wireframes/web/05-record-detail.svg | `기록 상세(Split 뷰) 화면을 구현하세요. API 연동 5.0.2. 본문·첨부·메타 패널, 핀/이정표/수정 액션. wireframes/web/05 준수, region landmark. Playwright E2E(상세 로드·첨부 열람) 테스트를 작성하세요.` | 개발자 C |
| 13.2.8 | G-23 기록 작성 (5 step) | 5.0.1 (도메인별 분기) | L | P0 | 기록 작성 위자드 5스텝(도메인별 분기). 참고: docs/05 §4 기록 작성 공통, wireframes/web/06-record-form.svg | `기록 작성 위자드 5스텝을 구현하세요. API 연동 5.0.1. 도메인·record_type 선택 후 content를 record_type별 RHF+Zod 스키마로 동적 검증·중간 저장(5.0.7)·제출 mutation. docs/05 §4·wireframes/web/06 준수. Playwright E2E(도메인별 분기 작성) 테스트를 작성하세요.` | 개발자 C |
| 13.2.9 | G-24 기록 수정 | 5.0.5 | S | P0 | 기록 수정. 참고: wireframes/web/19-guardian-record-edit.svg | `기록 수정 화면을 구현하세요. API 연동 5.0.5. 기존 값 prefill·RHF+Zod 재검증·mutation. wireframes/web/19 준수. Playwright E2E(수정 저장) 테스트를 작성하세요.` | 개발자 C |
| 13.2.10 | G-30 권한 매트릭스 | 4.1.3 | M | P0 | 권한 매트릭스(이해관계자×도메인). 참고: wireframes/web/07-permission-matrix.svg | `권한 매트릭스 화면을 구현하세요. API 연동 4.1.3. 이해관계자×도메인 그리드·TanStack Query·셀 클릭 상세. wireframes/web/07 준수, table 헤더 scope. Playwright E2E(그리드 로드·셀 진입) 테스트를 작성하세요.` | 개발자 C |
| 13.2.11 | G-31 이해관계자 상세 | 4.1.4 | S | P0 | 이해관계자 상세(받은 권한·이력). 참고: wireframes/web/20-guardian-stakeholder-detail.svg | `이해관계자 상세 화면을 구현하세요. API 연동 4.1.4. 받은 권한·이력 리스트·수정/회수 진입. wireframes/web/20 준수. Playwright E2E(상세 로드→수정/회수) 테스트를 작성하세요.` | 개발자 C |
| 13.2.12 | G-32 권한 부여 위자드 (4 step) | 4.2.* | L | P0 | 권한 부여 위자드 4스텝. 참고: docs/06 §6, wireframes/web/21-guardian-grant-wizard.svg | `권한 부여 위자드 4스텝을 구현하세요. API 연동 4.2.1~4.2.4. 대상자 검색/초대→도메인 멀티 선택→수준·기간→미리보기·UPSERT mutation. docs/06 §6·wireframes/web/21 준수. Playwright E2E(전체 부여 플로우) 테스트를 작성하세요.` | 개발자 C |
| 13.2.13 | G-33/34 권한 수정·회수 모달 | 4.1.5, 4.1.6 | S | P0 | 권한 수정·회수 모달. 참고: wireframes/web/28-guardian-permission-modals.svg | `권한 수정·회수 모달을 구현하세요. API 연동 4.1.5(수정)·4.1.6(회수). dialog role·focus trap·확인 단계. wireframes/web/28 준수. Playwright E2E(수정·회수 확인) 테스트를 작성하세요.` | 개발자 C |
| 13.2.14 | G-40 접근 로그 | 11.4, 11.5 | M | P0 | 접근 로그 화면. 참고: docs/05 §9, wireframes/web/22-guardian-access-log.svg | `접근 로그 화면을 구현하세요. API 연동 11.4(조회)·11.5(필터). TanStack Query 페이징·날짜/접근자/동작 필터·CSV 내보내기. wireframes/web/22 준수. Playwright E2E(필터·내보내기) 테스트를 작성하세요.` | 개발자 C |
| 13.2.15 | G-50 알림 | 10.1.3 | S | P0 | 알림 목록. 참고: wireframes/web/23-guardian-notifications.svg | `알림 목록 화면을 구현하세요. API 연동 10.1.3·읽음 처리(10.1.4/5). NotificationCard 리스트·인라인 액션·aria-live 갱신. wireframes/web/23 준수. Playwright E2E(읽음 처리·진입) 테스트를 작성하세요.` | 개발자 C |

## 13.3 설정 화면

| ID | 화면 | API 연동 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|--------|:---:|:-:| :-------- | :-------- | :----: |
| 13.3.1 | G-60 설정 허브 | — | S | P0 | 설정 허브. 참고: wireframes/web/10-settings.svg | `설정 허브 화면을 구현하세요(API 연동 없음, 라우팅 카드). 프로필·당사자·응급·알림 진입 카드. wireframes/web/10 준수, nav landmark. Playwright E2E(각 설정 진입) 테스트를 작성하세요.` | 개발자 C |
| 13.3.2 | G-61 프로필 편집 | 3.1.2 | S | P0 | 프로필 편집. 참고: wireframes/web/24-guardian-profile-edit.svg | `프로필 편집 화면을 구현하세요. API 연동 3.1.2. RHF+Zod 검증·prefill·mutation. wireframes/web/24 준수. Playwright E2E(저장) 테스트를 작성하세요.` | 개발자 C |
| 13.3.3 | G-62 당사자 정보 편집 | 3.2.4 | M | P0 | 당사자 정보 편집. 참고: wireframes/web/25-guardian-person-edit.svg | `당사자 정보 편집 화면을 구현하세요. API 연동 3.2.4. RHF+Zod·prefill·mutation. wireframes/web/25 준수. Playwright E2E(저장) 테스트를 작성하세요.` | 개발자 C |
| 13.3.4 | G-63 응급 정보 편집 | 3.2.5 | M | P0 | 응급 정보 편집(추가 인증). 참고: wireframes/web/26-guardian-emergency-edit.svg | `응급 정보 편집 화면을 구현하세요. API 연동 3.2.5(추가 인증). 진입 시 PIN/생체 인증 게이트·RHF+Zod·mutation. wireframes/web/26 준수. Playwright E2E(인증 통과→저장·실패 차단) 테스트를 작성하세요.` | 개발자 C |
| 13.3.5 | G-64 알림 설정 | 10.2.4~7 | S | P0 | 알림 설정. 참고: wireframes/web/27-guardian-notification-settings.svg | `알림 설정 화면을 구현하세요. API 연동 10.2.4~10.2.7. 채널 토글·유형 매트릭스·방해 금지 시간대·mutation. wireframes/web/27 준수, switch aria. Playwright E2E(설정 저장) 테스트를 작성하세요.` | 개발자 C |
| 13.3.6 ✨ NEW | G-65 동의·권리 관리 화면 | 2.12 | M | P1 | 개인정보·동의 관리(PIPA §5 권리행사 창구) — 동의 현황 조회·선택 동의 철회(granted=false 신규 행)·데이터 내보내기. 설정 허브(G-60) 하위 진입. 참고: docs/16 §5, docs/05 §1-3, wireframes/web/66-guardian-consent-mgmt.svg | `apps/web에 G-65 동의·권리 관리 화면을 구현하세요. API 연동 2.12(동의 조회·철회 INSERT). 동의 현황 리스트(유형·필수/선택·동의 시각·policy_version)·선택 동의 철회(granted=false 신규 행)·데이터 내보내기 진입. docs/16 §5·wireframes/web/66 준수. Playwright E2E(철회·필수 동의 철회 차단) 테스트를 작성하세요.` | 개발자 C |

---

# 14. 웹 UI — 당사자 (Person, 접근성 모드, 10 screens)

> 🧪 **테스트 전략:** 당사자 화면은 **WCAG 2.1 AA**를 axe-core 자동 검사로 통과해야 하며(대비·큰 터치 타깃·TTS), 핵심 플로우는 접근성 보조기술 기반 Playwright E2E로 검증한다.

| ID | 화면 | API 연동 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|--------|:---:|:-:| :-------- | :-------- | :----: |
| 14.1 | P-01 오늘 기록 홈 | 6.2 | M | P0 | 당사자 오늘 기록 홈(큰 CTA). 참고: docs/04 §2 당사자, docs/07 §9, wireframes/web/08-person-home.svg | `당사자 오늘 기록 홈을 구현하세요. API 연동 6.2(오늘 자기표현). 큰 CTA·접근성 토큰 적용·TanStack Query. docs/07 §9·wireframes/web/08 준수, 큰 터치 타깃·aria-label. axe-core 검사 + Playwright E2E(CTA→자기표현 진입)를 작성하세요.` | 개발자 C |
| 14.2 | P-02 자기표현 위자드 (Flow-1) | 6.1 | L | P0 | 자기표현 위자드(Flow-1, 아이콘 기반). 참고: docs/06 §6 Flow-1, wireframes/web/09-self-expression.svg | `자기표현 위자드(Flow-1 5스텝, 아이콘 기반)를 구현하세요. API 연동 6.1. IconSelectorCard·큰 단계 버튼·중간 저장·제출 mutation. docs/06 §6·wireframes/web/09 준수, aria-pressed·키보드 선택. axe-core + Playwright E2E(전체 완주) 테스트를 작성하세요.` | 개발자 C |
| 14.3 | P-03 자기표현 완료 애니메이션 | — | XS | P0 | 자기표현 완료 애니메이션(긍정 피드백). 참고: docs/07 §7 모션 & 애니메이션 | `자기표현 완료 애니메이션 화면을 구현하세요(API 연동 없음). 긍정 피드백·prefers-reduced-motion 대응·aria-live 안내. docs/07 §7 준수. axe-core + 모션 감소 모드 렌더 테스트를 작성하세요.` | 개발자 C |
| 14.4 | P-10 내 기록 (분야 그리드) | 5.0.3 | S | P0 | 내 기록 분야 그리드. 참고: wireframes/web/29-person-records.svg | `당사자 내 기록 분야 그리드를 구현하세요. API 연동 5.0.3. 큰 도메인 카드·TanStack Query·접근성 토큰. wireframes/web/29 준수, 큰 터치 타깃. axe-core + Playwright E2E(도메인 진입) 테스트를 작성하세요.` | 개발자 C |
| 14.5 | P-11 기록 상세 (쉬운 요약) | 5.0.2 (summary 필드) | M | P0 | 기록 상세(쉬운 요약 summary 필드). 참고: wireframes/web/30-person-record-detail.svg | `당사자 기록 상세(쉬운 요약)를 구현하세요. API 연동 5.0.2(summary 필드 우선 표시). 쉬운 언어·큰 글씨·TTS 버튼. wireframes/web/30 준수. axe-core + Playwright E2E(TTS 재생) 테스트를 작성하세요.` | 개발자 C |
| 14.6 | P-20 설정 허브 (큰 카드) | — | XS | P0 | 설정 허브(큰 카드). 참고: wireframes/web/31-person-settings.svg | `당사자 설정 허브(큰 카드)를 구현하세요(라우팅). 접근성·내 정보·알림 진입 큰 카드. wireframes/web/31 준수. axe-core + Playwright E2E(각 설정 진입) 테스트를 작성하세요.` | 개발자 C |
| 14.7 | P-21 접근성 설정 | 3.4.3 | M | P0 | 접근성 설정(글씨·대비·TTS). 참고: docs/07 §9, wireframes/web/32-person-accessibility.svg | `접근성 설정 화면을 구현하세요. API 연동 3.4.3. 글씨 크기·고대비·TTS 토글이 즉시 미리보기에 반영·mutation. docs/07 §9·wireframes/web/32 준수. axe-core + Playwright E2E(설정 변경→즉시 반영) 테스트를 작성하세요.` | 개발자 C |
| 14.8 | P-22 내 정보 | 3.4.2 | S | P0 | 내 정보. 참고: wireframes/web/33-person-profile.svg | `당사자 내 정보 화면을 구현하세요. API 연동 3.4.2. 읽기 위주·큰 글씨. wireframes/web/33 준수. axe-core + Playwright E2E(정보 로드) 테스트를 작성하세요.` | 개발자 C |
| 14.9 | P-30 알림 (큰 카드) | 10.1.3 | S | P0 | 알림(큰 카드). 참고: wireframes/web/34-person-notifications.svg | `당사자 알림 화면(큰 카드)을 구현하세요. API 연동 10.1.3·읽음 처리. 큰 카드·간단 문구·aria-live. wireframes/web/34 준수. axe-core + Playwright E2E(읽음 처리) 테스트를 작성하세요.` | 개발자 C |
| 14.10 | 접근성 모드 자동 적용 (theme switch) | tokens-a11y | M | P0 | 접근성 모드 자동 적용(theme switch). 참고: docs/07 §9 당사자 접근성 모드, tokens-a11y | `당사자 접근성 모드 theme switch를 구현하세요. person_accounts 설정에 따라 tokens-a11y(큰 글씨·고대비)를 자동 적용하는 ThemeProvider. docs/07 §9 준수. 설정값별 토큰 적용을 Vitest 단위 + axe-core 대비 검사로 테스트하세요.` | 개발자 C |

---

# 15. 웹 UI — 전문가 (4 역할, 36 screens)

> 🧪 **테스트 전략:** 4역할(활동지원사·특수교사·사회복지사·치료사)별로 **권한 범위에 맞는 E2E 시나리오**를 작성한다. 화면 데이터는 TanStack Query 훅, 작성 폼은 record_type별 RHF+Zod 검증, ARIA·키보드 접근을 포함한다.

## 15.1 활동지원사 (S)

| ID | 화면 | API 연동 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|--------|:---:|:-:| :-------- | :-------- | :----: |
| 15.1.1 | S-01 홈 | 5.D.2 list | S | P0 | 활동지원사 홈. 참고: docs/04 §3 활동지원사, wireframes/web/35-supporter-home.svg | `활동지원사 홈을 구현하세요. API 연동 5.D.2 list(일지 목록). 오늘 일지 CTA·담당 당사자 요약·TanStack Query. docs/04 §3·wireframes/web/35 준수. Playwright E2E(홈 로드→일지 작성 진입, 활동지원사 권한) 테스트를 작성하세요.` | 개발자 D |
| 15.1.2 | S-10 일지 목록 | 5.D.2 L | S | P0 | 일지 목록. 참고: wireframes/web/36-supporter-journal-list.svg | `일지 목록 화면을 구현하세요. API 연동 5.D.2 L. TanStack Query 페이징·날짜 필터·RecordCard. wireframes/web/36 준수. Playwright E2E(목록·상세 진입) 테스트를 작성하세요.` | 개발자 D |
| 15.1.3 | S-11 일지 상세 | 5.D.2 R | S | P0 | 일지 상세. 참고: wireframes/web/37-supporter-journal-detail.svg | `일지 상세 화면을 구현하세요. API 연동 5.D.2 R. 본문·첨부·수정 진입. wireframes/web/37 준수. Playwright E2E(상세 로드) 테스트를 작성하세요.` | 개발자 D |
| 15.1.4 | S-12 일지 작성 위자드 (5 step, Flow-4) | 5.D.2 C | L | P0 | 일지 작성 위자드 5스텝(Flow-4). 참고: docs/06 §6 Flow-4, wireframes/web/38-supporter-journal-form.svg | `일지 작성 위자드 5스텝(Flow-4)을 구현하세요. API 연동 5.D.2 C. DAI-002 content를 RHF+Zod로 검증·중간 저장·제출 mutation. docs/06 §6·wireframes/web/38 준수, aria-current. Playwright E2E(전체 작성 완주) 테스트를 작성하세요.` | 개발자 D |
| 15.1.5 | S-13 일지 수정 | 5.D.2 U | S | P0 | 일지 수정. 참고: wireframes/web/38-supporter-journal-form.svg | `일지 수정 화면을 구현하세요. API 연동 5.D.2 U. prefill·RHF+Zod 재검증·mutation. wireframes/web/38 준수. Playwright E2E(수정 저장) 테스트를 작성하세요.` | 개발자 D |
| 15.1.6 | S-20 인수인계 목록 | 9.1.3, 9.1.4 | S | P0 | 인수인계 목록. 참고: wireframes/web/39-supporter-handover-list.svg | `활동지원사 인수인계 목록을 구현하세요. API 연동 9.1.3(받은)·9.1.4(전달). 탭 분리·TanStack Query. wireframes/web/39 준수. Playwright E2E(목록·상세 진입) 테스트를 작성하세요.` | 개발자 D |
| 15.1.7 | S-21 인수인계 상세 | 9.1.2, 9.2.5 | M | P0 | 인수인계 상세(확인 처리). 참고: docs/05 §7, wireframes/web/40-supporter-handover-detail.svg | `인수인계 상세(확인 처리) 화면을 구현하세요. API 연동 9.1.2(상세)·9.2.5(확인). 연계 기록·확인 버튼 mutation. docs/05 §7·wireframes/web/40 준수. Playwright E2E(확인 처리) 테스트를 작성하세요.` | 개발자 D |
| 15.1.8 | S-30/40 알림+설정 통합 | 10.1.3, 10.2.5 | S | P0 | 알림+설정 통합. 참고: wireframes/web/41-supporter-notifications-settings.svg | `활동지원사 알림+설정 통합 화면을 구현하세요. API 연동 10.1.3(알림)·10.2.5(설정). 탭 구성·읽음 처리·채널 토글. wireframes/web/41 준수. Playwright E2E(알림 읽음·설정 저장) 테스트를 작성하세요.` | 개발자 D |

## 15.2 특수교사 (T)

| ID | 화면 | API 연동 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|--------|:---:|:-:| :-------- | :-------- | :----: |
| 15.2.1 | T-01 홈 (담당 학생) | 5.B list | M | P0 | 교사 홈(담당 학생). 참고: docs/04 §4 특수교사, wireframes/web/42-teacher-home.svg | `특수교사 홈(담당 학생)을 구현하세요. API 연동 5.B list. 담당 학생 카드·최근 IEP/관찰 요약·TanStack Query. docs/04 §4·wireframes/web/42 준수. Playwright E2E(홈 로드→학생 진입, 교사 권한) 테스트를 작성하세요.` | 개발자 D |
| 15.2.2 | T-11 IEP 목록 | 5.B.1 L | S | P0 | IEP 목록. 참고: wireframes/web/43-teacher-iep-list.svg | `IEP 목록 화면을 구현하세요. API 연동 5.B.1 L. TanStack Query 페이징. wireframes/web/43 준수. Playwright E2E(목록·상세 진입) 테스트를 작성하세요.` | 개발자 D |
| 15.2.3 | T-12 IEP 상세 | 5.B.1 R | M | P0 | IEP 상세. 참고: wireframes/web/44-teacher-iep-detail.svg | `IEP 상세 화면을 구현하세요. API 연동 5.B.1 R. 현행수준·목표·평가 섹션·점검 진입. wireframes/web/44 준수. Playwright E2E(상세 로드) 테스트를 작성하세요.` | 개발자 D |
| 15.2.4 | T-13 IEP 작성 위자드 (6 step, Flow-5) | 5.B.1 C | XL | P0 | IEP 작성 위자드 6스텝(Flow-5·최대 공수). 참고: docs/06 §6 Flow-5, docs/02 §3 JSONB(EDU-001), wireframes/web/45-teacher-iep-form.svg | `IEP 작성 위자드 6스텝(Flow-5)을 구현하세요. API 연동 5.B.1 C. EDU-001 content(현행수준·연간/단기목표·평가)를 docs/02 §3 JSONB 기준 RHF+Zod 동적 배열 검증·중간 저장·제출. docs/06 §6·wireframes/web/45 준수. Playwright E2E(6스텝 완주) 테스트를 작성하세요.` | 개발자 D |
| 15.2.5 | T-14 IEP 점검 | 5.B.3 | M | P0 | IEP 중간 점검. 참고: wireframes/web/46-teacher-iep-review.svg | `IEP 중간 점검 화면을 구현하세요. API 연동 5.B.3. 목표 달성도 입력 RHF+Zod·mutation. wireframes/web/46 준수. Playwright E2E(점검 저장) 테스트를 작성하세요.` | 개발자 D |
| 15.2.6 | T-15 관찰 기록 목록 | 5.B.4 L | S | P0 | 관찰 기록 목록. 참고: wireframes/web/47-teacher-observation.svg | `학교생활 관찰 기록 목록을 구현하세요. API 연동 5.B.4 L. TanStack Query 페이징. wireframes/web/47 준수. Playwright E2E(목록·작성 진입) 테스트를 작성하세요.` | 개발자 D |
| 15.2.7 | T-16 관찰 기록 작성 | 5.B.4 C | M | P0 | 관찰 기록 작성. 참고: wireframes/web/47-teacher-observation.svg | `관찰 기록 작성 화면을 구현하세요. API 연동 5.B.4 C. EDU-004 content RHF+Zod·mutation. wireframes/web/47 준수. Playwright E2E(작성 저장) 테스트를 작성하세요.` | 개발자 D |
| 15.2.8 | T-17 전환교육 목록 | 5.B.7 L | S | P0 | 전환교육 목록. 참고: wireframes/web/48-teacher-transition.svg | `전환교육 목록 화면을 구현하세요. API 연동 5.B.7 L. TanStack Query. wireframes/web/48 준수. Playwright E2E(목록·작성 진입) 테스트를 작성하세요.` | 개발자 D |
| 15.2.9 | T-18 전환교육 작성 (4 step) | 5.B.7 C | L | P0 | 전환교육 작성 4스텝. 참고: wireframes/web/48-teacher-transition.svg | `전환교육 작성 위자드 4스텝을 구현하세요. API 연동 5.B.7 C. EDU-007 content RHF+Zod·중간 저장·mutation. wireframes/web/48 준수. Playwright E2E(4스텝 완주) 테스트를 작성하세요.` | 개발자 D |
| 15.2.10 | T-20 교육 타임라인 | 8.2 (filter) | S | P0 | 교육 타임라인(도메인 필터). 참고: wireframes/web/49-teacher-timeline.svg | `교육 타임라인 화면을 구현하세요. API 연동 8.2(education 도메인 필터). TanStack Query 무한 스크롤. wireframes/web/49 준수. Playwright E2E(필터·스크롤) 테스트를 작성하세요.` | 개발자 D |
| 15.2.11 | T-30/40 알림+설정 | 10.* | S | P0 | 알림+설정. 참고: wireframes/web/50-teacher-notifications-settings.svg | `교사 알림+설정 통합 화면을 구현하세요. API 연동 10.1.3·10.2.5. 탭·읽음 처리·채널 토글. wireframes/web/50 준수. Playwright E2E(알림 읽음·설정 저장) 테스트를 작성하세요.` | 개발자 D |

## 15.3 사회복지사 (W)

| ID | 화면 | API 연동 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|--------|:---:|:-:| :-------- | :-------- | :----: |
| 15.3.1 | W-01 홈 | 5.C, 5.E list | M | P0 | 복지사 홈. 참고: docs/04 §5 사회복지사, wireframes/web/51-worker-home.svg | `사회복지사 홈을 구현하세요. API 연동 5.C·5.E list. 담당 당사자·최근 ISP/전환계획 요약·TanStack Query. docs/04 §5·wireframes/web/51 준수. Playwright E2E(홈 로드→진입, 복지사 권한) 테스트를 작성하세요.` | 개발자 D |
| 15.3.2 | W-11 ISP 목록 | 5.C.4 L | S | P0 | ISP 목록. 참고: wireframes/web/52-worker-isp.svg | `ISP 목록 화면을 구현하세요. API 연동 5.C.4 L. TanStack Query 페이징. wireframes/web/52 준수. Playwright E2E(목록·상세 진입) 테스트를 작성하세요.` | 개발자 D |
| 15.3.3 | W-12 ISP 상세 | 5.C.4 R | M | P0 | ISP 상세. 참고: wireframes/web/52-worker-isp.svg | `ISP 상세 화면을 구현하세요. API 연동 5.C.4 R. 욕구·목표·서비스 매핑 섹션·점검 진입. wireframes/web/52 준수. Playwright E2E(상세 로드) 테스트를 작성하세요.` | 개발자 D |
| 15.3.4 | W-13 ISP 작성 (5 step) | 5.C.4 C | XL | P0 | ISP 작성 위자드 5스텝(최대 공수). 참고: docs/02 §3 JSONB(WEL-004), wireframes/web/53-worker-isp-form.svg | `ISP 작성 위자드 5스텝을 구현하세요. API 연동 5.C.4 C. WEL-004 content(욕구·목표·서비스 매핑)를 docs/02 §3 JSONB 기준 RHF+Zod 동적 매핑 검증·중간 저장·제출. wireframes/web/53 준수. Playwright E2E(5스텝 완주) 테스트를 작성하세요.` | 개발자 D |
| 15.3.5 | W-14 ISP 점검 | 5.C.5 | M | P0 | ISP 중간 점검. 참고: wireframes/web/52-worker-isp.svg | `ISP 중간 점검 화면을 구현하세요. API 연동 5.C.5. WEL-005 content RHF+Zod·mutation. wireframes/web/52 준수. Playwright E2E(점검 저장) 테스트를 작성하세요.` | 개발자 D |
| 15.3.6 | W-15 전환계획 목록 | 5.E.1 L | S | P0 | 전환계획 목록. 참고: wireframes/web/54-worker-transition.svg | `전환계획 목록 화면을 구현하세요. API 연동 5.E.1 L. TanStack Query 페이징. wireframes/web/54 준수. Playwright E2E(목록·작성 진입) 테스트를 작성하세요.` | 개발자 D |
| 15.3.7 | W-16 전환계획 작성 (5 step) | 5.E.1 C | XL | P0 | 전환계획 작성 5스텝(최대 공수). 참고: docs/02 §3 JSONB(TRA-001), wireframes/web/54-worker-transition.svg | `전환계획 작성 위자드 5스텝을 구현하세요. API 연동 5.E.1 C. TRA-001 content(교육→자립 종합 계획)를 docs/02 §3 JSONB 기준 RHF+Zod·중간 저장·제출. wireframes/web/54 준수. Playwright E2E(5스텝 완주) 테스트를 작성하세요.` | 개발자 D |
| 15.3.8 | W-17 서비스 이용 현황 (매트릭스) | 5.C.6 R | M | P0 | 서비스 이용 현황 매트릭스. 참고: wireframes/web/55-worker-service-matrix.svg | `서비스 이용 현황 매트릭스 화면을 구현하세요. API 연동 5.C.6 R. 서비스×기간 그리드·TanStack Query. wireframes/web/55 준수, table scope. Playwright E2E(매트릭스 로드) 테스트를 작성하세요.` | 개발자 D |
| 15.3.9 | W-20 복지+전환 타임라인 | 8.2 | M | P0 | 복지+전환 타임라인. | `복지+전환 타임라인 화면을 구현하세요. API 연동 8.2(welfare·transition 도메인 필터). TanStack Query 무한 스크롤. Playwright E2E(필터·스크롤) 테스트를 작성하세요.` | 개발자 D |
| 15.3.10 | W-30 인수인계 목록 | 9.1.3, 9.1.4 | S | P0 | 인수인계 목록. | `복지사 인수인계 목록을 구현하세요. API 연동 9.1.3(받은)·9.1.4(전달). 탭 분리·TanStack Query. Playwright E2E(목록·생성 진입) 테스트를 작성하세요.` | 개발자 D |
| 15.3.11 | W-31 인수인계 생성 (4 step, Flow-6) | 9.1.1 | L | P0 | 인수인계 생성 4스텝(Flow-6). 참고: docs/06 §6 Flow-6, wireframes/web/56-worker-handover-create.svg | `인수인계 생성 위자드 4스텝(Flow-6)을 구현하세요. API 연동 9.1.1(9.2.1~9.2.4 단계). 분야·기간·요약·기록 다중 선택·미리보기·제출 mutation. docs/06 §6·wireframes/web/56 준수. Playwright E2E(생성 완주) 테스트를 작성하세요.` | 개발자 D |
| 15.3.12 | W-40/50 알림+설정 | 10.* | S | P0 | 알림+설정. 참고: wireframes/web/57-worker-notifications-settings.svg | `복지사 알림+설정 통합 화면을 구현하세요. API 연동 10.1.3·10.2.5. 탭·읽음 처리·채널 토글. wireframes/web/57 준수. Playwright E2E(알림 읽음·설정 저장) 테스트를 작성하세요.` | 개발자 D |

## 15.4 치료사 (TH)

| ID | 화면 | API 연동 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|--------|:---:|:-:| :-------- | :-------- | :----: |
| 15.4.1 | TH-01 홈 (오늘 회기) | 5.A.6 (date filter) | M | P0 | 치료사 홈(오늘 회기). 참고: docs/04 §6 치료사, wireframes/web/58-therapist-home.svg | `치료사 홈(오늘 회기)을 구현하세요. API 연동 5.A.6 date filter. 오늘 회기 리스트·작성 CTA·TanStack Query. docs/04 §6·wireframes/web/58 준수. Playwright E2E(홈 로드→회기 작성 진입, 치료사 권한) 테스트를 작성하세요.` | 개발자 D |
| 15.4.2 | TH-11 치료계획서 목록 | 5.A.5 L | S | P0 | 치료계획서 목록. 참고: wireframes/web/59-therapist-plan.svg | `치료계획서 목록 화면을 구현하세요. API 연동 5.A.5 L. TanStack Query 페이징. wireframes/web/59 준수. Playwright E2E(목록·상세 진입) 테스트를 작성하세요.` | 개발자 D |
| 15.4.3 | TH-12 치료계획서 상세 | 5.A.5 R | M | P0 | 치료계획서 상세. 참고: wireframes/web/59-therapist-plan.svg | `치료계획서 상세 화면을 구현하세요. API 연동 5.A.5 R. 목표·회기 계획·평가지표 섹션. wireframes/web/59 준수. Playwright E2E(상세 로드) 테스트를 작성하세요.` | 개발자 D |
| 15.4.4 | TH-13 치료계획서 작성 (5 step) | 5.A.5 C | L | P0 | 치료계획서 작성 5스텝. 참고: docs/02 §3 JSONB(MED-005), wireframes/web/59-therapist-plan.svg | `치료계획서 작성 위자드 5스텝을 구현하세요. API 연동 5.A.5 C. MED-005 content(목표·회기 계획·평가지표)를 docs/02 §3 JSONB 기준 RHF+Zod·중간 저장·제출. wireframes/web/59 준수. Playwright E2E(5스텝 완주) 테스트를 작성하세요.` | 개발자 D |
| 15.4.5 | TH-14 회기 일지 목록 | 5.A.6 L | S | P0 | 회기 일지 목록. 참고: wireframes/web/60-therapist-session-form.svg | `회기 일지 목록 화면을 구현하세요. API 연동 5.A.6 L. TanStack Query·날짜 필터. wireframes/web/60 준수. Playwright E2E(목록·작성 진입) 테스트를 작성하세요.` | 개발자 D |
| 15.4.6 | TH-15 회기 일지 작성 | 5.A.6 C | M | P0 | 회기 일지 작성. 참고: docs/02 §3 JSONB(MED-006), wireframes/web/60-therapist-session-form.svg | `회기 일지 작성 화면을 구현하세요. API 연동 5.A.6 C. MED-006 content(회기 활동·반응·과제)를 docs/02 §3 JSONB 기준 RHF+Zod·mutation. wireframes/web/60 준수. Playwright E2E(작성 저장) 테스트를 작성하세요.` | 개발자 D |
| 15.4.7 | TH-16 평가 보고서 목록 | 5.A.7 L | S | P0 | 평가 보고서 목록. 참고: wireframes/web/61-therapist-evaluation.svg | `평가 보고서 목록 화면을 구현하세요. API 연동 5.A.7 L. TanStack Query 페이징. wireframes/web/61 준수. Playwright E2E(목록·작성 진입) 테스트를 작성하세요.` | 개발자 D |
| 15.4.8 | TH-17 평가 보고서 작성 (4 step) | 5.A.7 C | L | P0 | 평가 보고서 작성 4스텝. 참고: docs/02 §3 JSONB(MED-007), wireframes/web/61-therapist-evaluation.svg | `평가 보고서 작성 위자드 4스텝을 구현하세요. API 연동 5.A.7 C. MED-007 content(기간 성과·재평가)를 docs/02 §3 JSONB 기준 RHF+Zod·중간 저장·제출. wireframes/web/61 준수. Playwright E2E(4스텝 완주) 테스트를 작성하세요.` | 개발자 D |
| 15.4.9 | TH-20 의료 타임라인 | 8.2 | M | P0 | 의료 타임라인. 참고: wireframes/web/62-therapist-timeline-settings.svg | `의료 타임라인 화면을 구현하세요. API 연동 8.2(medical 도메인 필터). TanStack Query 무한 스크롤. wireframes/web/62 준수. Playwright E2E(필터·스크롤) 테스트를 작성하세요.` | 개발자 D |
| 15.4.10 | TH-30/40 알림+설정 | 10.* | S | P0 | 알림+설정. 참고: wireframes/web/62-therapist-timeline-settings.svg | `치료사 알림+설정 통합 화면을 구현하세요. API 연동 10.1.3·10.2.5. 탭·읽음 처리·채널 토글. wireframes/web/62 준수. Playwright E2E(알림 읽음·설정 저장) 테스트를 작성하세요.` | 개발자 D |

---

# 16. 모바일 앱 (React Native, 24+ screens)

> 웹과 동일한 API 사용 / 모바일 전용 패턴: BottomSheet · FAB · Push 스택
> 🧪 **테스트 전략:** 화면 로직은 **Jest 단위 테스트**, 사용자 플로우는 **Detox E2E**로 검증한다. 웹과 동일 API를 TanStack Query 훅으로 재사용하고, 접근성 레이블·딥링크·오프라인 동기화 케이스를 포함한다.

## 16.1 인증

| ID | 화면 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|:-:| :-------- | :-------- | :----: |
| 16.1.1 | A-01 로그인 (모바일) | S | P0 | 모바일 로그인. 참고: docs/06 §5 모바일 앱 IA, wireframes/mobile/01-m-login.svg | `apps/mobile에 로그인 화면을 구현하세요. API 연동 2.2(웹과 동일, TanStack mutation 재사용). RHF+Zod 검증·접근성 레이블. docs/06 §5·wireframes/mobile/01 준수. Jest 단위(폼 검증) + Detox E2E(로그인 성공) 테스트를 작성하세요.` | 개발자 E |
| 16.1.2 | A-03 회원가입 역할 선택 | S | P0 | 회원가입 역할 선택. 참고: wireframes/mobile/06-m-signup-role.svg | `모바일 회원가입 역할 선택 화면을 구현하세요. API 연동 2.1. 큰 선택 카드·accessibilityRole. wireframes/mobile/06 준수. Jest 단위 + Detox E2E(역할 선택→다음) 테스트를 작성하세요.` | 개발자 E |
| 16.1.3 | A-02/04/05/07 회원가입·인증·재설정 통합 | M | P0 | 회원가입·이메일 인증·재설정 통합 플로우. 참고: docs/05 §1 온보딩 | `모바일 회원가입·이메일 인증·재설정 통합 플로우를 구현하세요. API 연동 2.1·2.4·2.5·2.6·2.7. 단계 네비게이션·RHF+Zod. docs/05 §1 준수. Jest 단위 + Detox E2E(가입→인증→완료) 테스트를 작성하세요.` | 개발자 E |
| 16.1.4 | A-06 초대 수락 (Deep Link) | M | P0 | 초대 수락(Deep Link 처리). 참고: §16.6.6 | `모바일 초대 수락 화면을 구현하세요. API 연동 2.9. Deep Link(16.6.6)로 토큰 수신·신규/기존 분기. §16.6.6 준수. Jest 단위(딥링크 파싱) + Detox E2E(딥링크→수락) 테스트를 작성하세요.` | 개발자 E |

## 16.2 보호자

| ID | 화면 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|:-:| :-------- | :-------- | :----: |
| 16.2.1 | G-01 홈 (Bottom Tab) | M | P0 | 보호자 홈(Bottom Tab). 참고: wireframes/mobile/02-m-guardian-home.svg | `모바일 보호자 홈(Bottom Tab)을 구현하세요. API 연동 3.2.3·8.2.1. TanStack Query·당사자 카드·FAB. wireframes/mobile/02 준수, accessibilityLabel. Jest 단위 + Detox E2E(홈 로드→탭 전환) 테스트를 작성하세요.` | 개발자 E |
| 16.2.2 | G-10 타임라인 | M | P0 | 타임라인. 참고: wireframes/mobile/03-m-timeline.svg | `모바일 타임라인 화면을 구현하세요. API 연동 8.2.*. 무한 스크롤·필터 BottomSheet. wireframes/mobile/03 준수. Jest 단위 + Detox E2E(필터·스크롤) 테스트를 작성하세요.` | 개발자 E |
| 16.2.3 | G-22 기록 상세 (Push) | S | P0 | 기록 상세(Push). 참고: wireframes/mobile/07-m-record-detail.svg | `모바일 기록 상세(Push 스택) 화면을 구현하세요. API 연동 5.0.2. 본문·첨부·액션. wireframes/mobile/07 준수. Jest 단위 + Detox E2E(상세 진입) 테스트를 작성하세요.` | 개발자 E |
| 16.2.4 | G-23 기록 작성 (Full-screen Flow) | L | P0 | 기록 작성(Full-screen Flow). 참고: wireframes/mobile/08-m-record-form.svg | `모바일 기록 작성(Full-screen Flow)을 구현하세요. API 연동 5.0.1. record_type별 RHF+Zod·중간 저장·제출. wireframes/mobile/08 준수. Jest 단위 + Detox E2E(작성 완주) 테스트를 작성하세요.` | 개발자 E |
| 16.2.5 | G-30 권한 매트릭스 (카드 리스트) | M | P0 | 권한 매트릭스(카드 리스트). 참고: wireframes/mobile/09-m-permissions.svg | `모바일 권한 매트릭스(카드 리스트) 화면을 구현하세요. API 연동 4.1.3. 이해관계자별 카드·TanStack Query. wireframes/mobile/09 준수. Jest 단위 + Detox E2E(목록·상세 진입) 테스트를 작성하세요.` | 개발자 E |
| 16.2.6 | G-32 권한 부여 위자드 | L | P0 | 권한 부여 위자드. 참고: wireframes/mobile/10-m-grant-wizard.svg | `모바일 권한 부여 위자드를 구현하세요. API 연동 4.2.*. 단계별 BottomSheet/풀스크린·제출 mutation. wireframes/mobile/10 준수. Jest 단위 + Detox E2E(부여 완주) 테스트를 작성하세요.` | 개발자 E |
| 16.2.7 | G-50 알림 (인라인 액션) | S | P0 | 알림(인라인 액션). 참고: wireframes/mobile/11-m-notifications.svg | `모바일 알림 화면(인라인 액션)을 구현하세요. API 연동 10.1.3·읽음 처리. 스와이프/인라인 액션. wireframes/mobile/11 준수. Jest 단위 + Detox E2E(읽음 처리) 테스트를 작성하세요.` | 개발자 E |
| 16.2.8 | G-60 설정 (당사자별 진입) | S | P0 | 설정(당사자별 진입). 참고: wireframes/mobile/12-m-settings.svg | `모바일 설정 화면(당사자별 진입)을 구현하세요. API 연동 라우팅·10.2.5. 당사자별 설정 진입 리스트. wireframes/mobile/12 준수. Jest 단위 + Detox E2E(설정 진입) 테스트를 작성하세요.` | 개발자 E |

## 16.3 당사자 (접근성)

| ID | 화면 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|:-:| :-------- | :-------- | :----: |
| 16.3.1 | P-01 오늘 기록 홈 (큰 CTA) | M | P0 | 당사자 오늘 기록 홈(큰 CTA). 참고: docs/07 §9 접근성, wireframes/mobile/04-m-person-home.svg | `모바일 당사자 오늘 기록 홈(큰 CTA)을 구현하세요. API 연동 6.2. 접근성 토큰·큰 터치 타깃·VoiceOver/TalkBack 레이블. docs/07 §9·wireframes/mobile/04 준수. Jest 단위 + Detox E2E(CTA→자기표현) + 접근성 레이블 테스트를 작성하세요.` | 개발자 E |
| 16.3.2 | P-02 자기표현 위자드 (4 step, 풀스크린) | L | P0 | 자기표현 위자드 4스텝(풀스크린). 참고: docs/06 §6 Flow-1, wireframes/mobile/05-m-self-expression.svg | `모바일 자기표현 위자드 4스텝(풀스크린)을 구현하세요. API 연동 6.1. IconSelectorCard·큰 버튼·중간 저장·제출. docs/06 §6·wireframes/mobile/05 준수, accessibilityState. Jest 단위 + Detox E2E(전체 완주) 테스트를 작성하세요.` | 개발자 E |
| 16.3.3 | P-10 내 기록 (분야 그리드) | S | P0 | 내 기록(분야 그리드). 참고: wireframes/mobile/13-m-person-records.svg | `모바일 당사자 내 기록(분야 그리드)을 구현하세요. API 연동 5.0.3. 큰 도메인 카드·접근성 토큰. wireframes/mobile/13 준수. Jest 단위 + Detox E2E(도메인 진입) 테스트를 작성하세요.` | 개발자 E |
| 16.3.4 | P-11 기록 상세 (쉬운 요약) | M | P0 | 기록 상세(쉬운 요약). 참고: wireframes/mobile/14-m-person-record-detail.svg | `모바일 당사자 기록 상세(쉬운 요약)를 구현하세요. API 연동 5.0.2(summary). 쉬운 언어·큰 글씨·TTS 버튼. wireframes/mobile/14 준수. Jest 단위 + Detox E2E(TTS 재생) 테스트를 작성하세요.` | 개발자 E |
| 16.3.5 | P-20 설정 (큰 카드) | S | P0 | 설정(큰 카드). 참고: wireframes/mobile/15-m-person-settings.svg | `모바일 당사자 설정(큰 카드)을 구현하세요. API 연동 3.4.3·라우팅. 접근성·내 정보·알림 큰 카드. wireframes/mobile/15 준수. Jest 단위 + Detox E2E(설정 진입) 테스트를 작성하세요.` | 개발자 E |

## 16.4 활동지원사

| ID | 화면 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|:-:| :-------- | :-------- | :----: |
| 16.4.1 | S-01 홈 (대형 일지 CTA) | M | P0 | 활동지원사 홈(대형 일지 CTA). 참고: wireframes/mobile/16-m-supporter-home.svg | `모바일 활동지원사 홈(대형 일지 CTA)을 구현하세요. API 연동 5.D.2 list. 오늘 일지 CTA·담당 당사자·TanStack Query. wireframes/mobile/16 준수. Jest 단위 + Detox E2E(홈→일지 작성) 테스트를 작성하세요.` | 개발자 E |
| 16.4.2 | S-12 일지 작성 위자드 (5 step) | XL | P0 | 일지 작성 위자드 5스텝. 참고: wireframes/mobile/17-m-supporter-journal-form.svg | `모바일 일지 작성 위자드 5스텝을 구현하세요. API 연동 5.D.2 C. DAI-002 content RHF+Zod·오프라인 임시저장(16.6.4) 연계·제출. wireframes/mobile/17 준수. Jest 단위 + Detox E2E(오프라인 작성→동기화) 테스트를 작성하세요.` | 개발자 E |
| 16.4.3 | S-20 인수인계 목록 | S | P0 | 인수인계 목록. 참고: wireframes/mobile/18-m-supporter-handover.svg | `모바일 인수인계 목록을 구현하세요. API 연동 9.1.3·9.1.4. 탭·확인 액션. wireframes/mobile/18 준수. Jest 단위 + Detox E2E(목록·확인) 테스트를 작성하세요.` | 개발자 E |

## 16.5 전문가 4역할 통합 패턴

| ID | 화면 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|:-:| :-------- | :-------- | :----: |
| 16.5.1 | T-01 교사 홈 | M | P0 | 교사 홈. 참고: wireframes/mobile/19-m-teacher-home.svg | `모바일 교사 홈을 구현하세요. API 연동 5.B list. 담당 학생·최근 IEP 요약·TanStack Query. wireframes/mobile/19 준수. Jest 단위 + Detox E2E(홈→학생 진입) 테스트를 작성하세요.` | 개발자 E |
| 16.5.2 | T-12 IEP 상세 | M | P0 | IEP 상세. 참고: wireframes/mobile/20-m-teacher-iep-detail.svg | `모바일 IEP 상세 화면을 구현하세요. API 연동 5.B.1 R. 현행수준·목표·평가 섹션. wireframes/mobile/20 준수. Jest 단위 + Detox E2E(상세 로드) 테스트를 작성하세요.` | 개발자 E |
| 16.5.3 | W-01 복지사 홈 | M | P0 | 복지사 홈. 참고: wireframes/mobile/21-m-worker-home.svg | `모바일 복지사 홈을 구현하세요. API 연동 5.C·5.E list. 담당 당사자·최근 ISP/전환 요약·TanStack Query. wireframes/mobile/21 준수. Jest 단위 + Detox E2E(홈→진입) 테스트를 작성하세요.` | 개발자 E |
| 16.5.4 | W-12 ISP 상세 | M | P0 | ISP 상세. 참고: wireframes/mobile/22-m-worker-isp-detail.svg | `모바일 ISP 상세 화면을 구현하세요. API 연동 5.C.4 R. 욕구·목표·서비스 매핑 섹션. wireframes/mobile/22 준수. Jest 단위 + Detox E2E(상세 로드) 테스트를 작성하세요.` | 개발자 E |
| 16.5.5 | TH-01 치료사 홈 | M | P0 | 치료사 홈. 참고: wireframes/mobile/23-m-therapist-home.svg | `모바일 치료사 홈(오늘 회기)을 구현하세요. API 연동 5.A.6 date filter. 오늘 회기·작성 CTA·TanStack Query. wireframes/mobile/23 준수. Jest 단위 + Detox E2E(홈→회기 작성) 테스트를 작성하세요.` | 개발자 E |
| 16.5.6 | TH-15 회기 일지 작성 | M | P0 | 회기 일지 작성. 참고: wireframes/mobile/24-m-therapist-session.svg | `모바일 회기 일지 작성 화면을 구현하세요. API 연동 5.A.6 C. MED-006 content RHF+Zod·제출. wireframes/mobile/24 준수. Jest 단위 + Detox E2E(작성 저장) 테스트를 작성하세요.` | 개발자 E |

## 16.6 모바일 전용 기능

| ID | 작업 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|:-:| :-------- | :-------- | :----: |
| 16.6.1 | FCM 푸시 알림 통합 | M | P0 | FCM 푸시 알림 통합(토큰 등록·수신). 참고: docs/05 §8 알림, §10.2.1·§10.2.8 | `apps/mobile에 FCM 푸시 알림을 통합하세요. 토큰 등록(10.2.8)·포그라운드/백그라운드 수신·탭 시 딥링크 라우팅. docs/05 §8·§10.2.1 준수. 알림 핸들러를 모킹해 Jest로 수신·라우팅을 단위 테스트하세요.` | 개발자 E |
| 16.6.2 | 카메라/갤러리 (사진 첨부) | M | P0 | 카메라/갤러리 사진 첨부. 참고: docs/05 §5 파일 첨부 | `카메라/갤러리 사진 첨부 기능을 구현하세요. 권한 요청·이미지 선택·presigned URL(7.1) 업로드. docs/05 §5 준수. 권한 거부·선택 취소 분기를 Jest 단위 테스트하세요.` | 개발자 E |
| 16.6.3 | 음성 메모 녹음 | M | P1 | 음성 메모 녹음(P1). 참고: §6.6 | `음성 메모 녹음 기능을 구현하세요(P1). 녹음·재생·업로드(6.6). §6.6 준수. 녹음 상태 전이·권한 거부를 Jest 단위 테스트하세요.` | 개발자 E |
| 16.6.4 | 일지 오프라인 임시저장 (AsyncStorage) | L | P0 | 일지 오프라인 임시저장(AsyncStorage) 후 동기화. 참고: docs/04 §3 활동지원사 | `일지 오프라인 임시저장(AsyncStorage) 후 온라인 시 자동 동기화를 구현하세요. 충돌·중복 제출 방지. docs/04 §3 준수. 오프라인 저장→복구→동기화·충돌 케이스를 Jest 단위 + Detox E2E 테스트하세요.` | 개발자 E |
| 16.6.5 | 생체 인증 (Face ID / 지문) | M | P0 | 생체 인증(Face ID/지문) — 민감정보 보호. 참고: §17.2.5 | `생체 인증(Face ID/지문) 게이트를 구현하세요. 응급정보 등 민감 화면 진입 시 인증 요구·폴백(PIN). §17.2.5 준수. 인증 성공/실패/미지원 분기를 Jest 단위 테스트하세요.` | 개발자 E |
| 16.6.6 | Deep Link 라우팅 (초대 등) | M | P0 | Deep Link 라우팅(초대·알림 진입). 참고: §16.1.4 | `Deep Link 라우팅을 구현하세요. 초대(16.1.4)·알림 진입 URL을 파싱해 해당 화면으로 네비게이션. §16.1.4 준수. URL 파싱·라우팅 매핑을 Jest 단위 테스트하세요.` | 개발자 E |
| 16.6.7 | OTA 업데이트 (Expo Updates) | S | P1 | OTA 업데이트(Expo Updates, P1). | `Expo Updates OTA 업데이트를 구성하세요(P1). 업데이트 확인·다운로드·재시작 흐름. 업데이트 가용/불가 분기를 Jest 단위 테스트하세요.` | 개발자 E |

---

# 17. SEO · 보안 · 접근성 (Phase 17)

> 🧪 **테스트 전략:** 접근성은 **axe-core 자동 검사**, 보안은 **OWASP ZAP 스캔**으로 자동화한다. 응급정보 추가 인증·감사 로그 불변성은 Phase 1/11 pgTAP와 연계해 회귀 검증한다.

## 17.1 SEO (웹만)

| ID | 작업 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|:-:| :-------- | :-------- | :----: |
| 17.1.1 | 메타 태그 (랜딩 페이지) | XS | P1 | 랜딩 페이지 메타 태그(P1). | `apps/web 랜딩 페이지에 메타 태그(title·description·canonical)를 Next.js Metadata API로 추가하세요(P1). 메타 렌더를 Vitest로 단위 테스트하세요.` | PL |
| 17.1.2 | Sitemap·robots.txt | XS | P1 | Sitemap·robots.txt(P1). | `apps/web에 sitemap.ts·robots.ts를 생성하세요(P1). 공개 라우트만 포함. 생성 결과를 Vitest로 단위 테스트하세요.` | PL |
| 17.1.3 | OG 이미지·소셜 미리보기 | S | P2 | OG 이미지·소셜 미리보기(P2). | `OG 이미지·소셜 미리보기를 구현하세요(P2). 동적 OG 이미지 생성·메타 적용. 메타 태그 렌더를 Vitest로 단위 테스트하세요.` | PL |

## 17.2 보안

| ID | 작업 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|:-:| :-------- | :-------- | :----: |
| 17.2.1 | OWASP Top 10 자체 점검 | M | P0 | OWASP Top 10 자체 점검. 참고: docs/05 §11 시스템 보안 흐름, bkit:phase-7-seo-security 스킬 | `OWASP Top 10 자체 점검을 수행하세요. OWASP ZAP 스캔을 CI에 통합하고 발견 항목을 docs/14 보안 체크리스트에 정리하세요. docs/05 §11·bkit:phase-7-seo-security 참고. ZAP 베이스라인 스캔 잡을 추가하세요.` | PL |
| 17.2.2 | XSS 필터 (입력값 sanitize) | S | P0 | XSS 방어 — 입력값 sanitize. | `XSS 방어 sanitize 유틸을 구현하세요. 사용자 입력·리치 텍스트 렌더 시 sanitize 적용. 대표 XSS 페이로드 차단을 Vitest 단위 테스트하세요.` | PL |
| 17.2.3 | CSRF 토큰 | S | P0 | CSRF 토큰 적용. | `상태 변경 API에 CSRF 토큰 검증을 적용하세요. 토큰 발급·검증 미들웨어 구현. 유효/누락/위조 토큰 케이스를 Vitest 단위 테스트하세요.` | PL |
| 17.2.4 | SQL Injection 방어 검증 (RLS + Prisma) | S | P0 | SQL Injection 방어 검증(RLS + Prisma 파라미터화). 참고: docs/03 §RLS | `SQL Injection 방어를 검증하세요. 모든 쿼리 파라미터화·RLS 보강. docs/03 §RLS 참고. 인젝션 페이로드가 차단되는지 Supertest 통합 + pgTAP로 테스트하세요.` | PL |
| 17.2.5 | 응급정보 추가 인증 (PIN 또는 생체) | M | P0 | 응급정보 접근 시 PIN/생체 추가 인증. 참고: docs/05 §11, docs/02 §3 JSONB(emergency) | `응급정보 접근 시 PIN/생체 추가 인증을 구현하세요(웹 PIN·모바일 생체). docs/05 §11·docs/02 §3 참고. 인증 통과/미통과 분기를 Vitest 단위 + Supertest 통합 테스트하세요.` | PL |
| 17.2.6 | 민감 파일 다운로드 워터마킹 | M | P1 | 민감 파일 다운로드 워터마킹(P1). | `민감 파일 다운로드 시 사용자·시각 워터마킹을 적용하세요(P1). 워터마크 삽입 로직을 Vitest 단위 테스트하세요.` | PL |
| 17.2.7 | Rate Limiting (API) | S | P0 | API Rate Limiting. | `API Rate Limiting 미들웨어를 구현하세요. IP/사용자별 윈도우 제한·429 응답. 임계 초과 차단을 Vitest 단위 + Supertest 통합 테스트하세요.` | PL |
| 17.2.8 | Audit log immutability (PostgreSQL) | S | P0 | Audit log 불변성(PostgreSQL append-only). 참고: docs/02 §2(access_logs), docs/03 §RLS | `access_logs append-only 불변성을 보강하세요. UPDATE/DELETE 차단 트리거·권한 회수. docs/02 §2·docs/03 §RLS 참고. pgTAP로 UPDATE/DELETE 차단·INSERT 허용을 회귀 검증하세요.` | PL |
| 17.2.9 ✨ NEW | Sentry PII 스크러빙 (beforeSend 마스킹) | S | P0 | Sentry 에러 페이로드에서 민감정보(emergency_info·records.content·고유식별정보·이메일 등) 스크러빙 — beforeSend 훅 마스킹·민감 키 제거·국외이전 위탁(docs/16 §6.1) 위험 차단. 웹·모바일·서버 공통. 참고: docs/16 §6.2, docs/10 §6 | `웹·모바일·서버 Sentry에 beforeSend PII 스크러빙을 구현하세요. emergency_info·records.content·고유식별정보(secure_identifiers)·이메일·전화 등 민감 키를 마스킹/제거해 외부 전송(국외이전 수탁) 페이로드에서 제외하세요. docs/16 §6.2 따르기. 민감 필드 포함 에러를 던져 스크러빙 후 전송 페이로드에 PII 부재를 Vitest 단위 테스트하세요.` | PL |

## 17.3 접근성 (WCAG 2.1 AA)

| ID | 작업 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|:-:| :-------- | :-------- | :----: |
| 17.3.1 | 키보드 네비게이션 | M | P0 | 키보드 네비게이션(WCAG 2.1 AA). 참고: docs/07 §9 접근성 | `전체 웹 화면 키보드 네비게이션을 점검·보강하세요. 포커스 순서·포커스 표시·스킵 링크. docs/07 §9 참고. axe-core + Playwright 키보드 전용 E2E로 주요 플로우를 테스트하세요.` | PL |
| 17.3.2 | 스크린 리더 호환 (ARIA) | M | P0 | 스크린 리더 호환(ARIA 레이블). 참고: docs/07 §9 | `스크린 리더 호환을 위해 ARIA 레이블·landmark·live region을 점검·보강하세요. docs/07 §9 참고. axe-core 자동 검사로 ARIA 위반 0건을 검증하세요.` | PL |
| 17.3.3 | 컬러 대비 4.5:1 검증 | S | P0 | 컬러 대비 4.5:1 검증. 참고: docs/07 §1 컬러 시스템·§9 | `전체 컬러 조합의 대비 4.5:1 이상을 검증·보정하세요. docs/07 §1·§9 참고. tokens 조합 대비비를 자동 계산하는 Vitest 단위 테스트 + axe-core 검사를 작성하세요.` | PL |
| 17.3.4 | 당사자 모드 — TTS 통합 | M | P0 | 당사자 모드 TTS 통합. 참고: docs/07 §9 당사자 접근성 모드 | `당사자 모드 TTS를 통합하세요(웹 SpeechSynthesis·모바일 TTS). 기록 요약·안내 읽기. docs/07 §9 참고. TTS 호출을 모킹해 Vitest 단위 + Detox/Playwright E2E(재생) 테스트하세요.` | PL |

## 17.4 법무·고지 (개인정보 거버넌스)

| ID | 작업 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|:-:| :-------- | :-------- | :----: |
| 17.4.1 ✨ NEW | 개인정보 처리방침·이용약관 게시 + CPO 지정 | S | P1 | PIPA §30·§31 게시 의무 — 개인정보 처리방침(수집항목·목적·보유기간·위탁·권리·CPO)·이용약관 작성·게시, 개인정보 보호책임자(CPO) 지정·공개. 수치·항목은 docs/16 §1·§4·§6과 일치. A-09/A-10 페이지(13.1.8)에 게시. 변경 시 시행 7일 전 고지(불리 변경 30일). 법무 협업·확정. 참고: docs/16 §7, docs/16 §9 TBD | `개인정보 처리방침·이용약관을 작성·게시하고 CPO를 지정하세요(P1, 법무 협업). 처리방침은 docs/16 §1 인벤토리·§4 보유기간·§6 위탁 현황과 수치·항목이 일치해야 하며 A-09/A-10 페이지(13.1.8)에 게시하세요. 변경 고지(시행 7일 전·불리 변경 30일) 절차와 policy_version 갱신 연계를 정의하세요. docs/16 §7·§9 TBD(보유기간·국외이전 리전) 확정 항목을 반영하세요.` | PL |

---

# 18. QA · 테스트 (Phase 18)

> 🧪 **테스트 전략:** **자동화 단위/통합/E2E/RLS 테스트는 이미 Phase 0~17 각 작업에 분산 내재화**되었다(0.13 인프라 위에서). 이 Phase는 그 회귀 스위트를 통합 운영하면서 **Zero Script QA 역할별 시나리오와 성능 테스트**에 집중한다.

## 18.1 자동화 테스트 (회귀 스위트 통합 운영)

> 18.1.1~18.1.5는 신규 작성이 아니라, 각 Phase에서 작성된 테스트를 **회귀 스위트로 통합·커버리지 게이트 관리**하는 작업이다.

| ID | 작업 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|:-:| :-------- | :-------- | :----: |
| 18.1.1 | 단위 테스트 (Vitest, 핵심 로직 70%) | L | P0 | 단위 테스트(Vitest, 핵심 로직 70%). 각 Phase 분산 작성 테스트를 통합·커버리지 70% 게이트 관리. | `각 Phase에서 작성된 Vitest 단위 테스트를 회귀 스위트로 통합하고 커버리지 70% 게이트를 CI(0.14)에 추가하세요. 미달 영역의 보강 테스트를 작성하세요.` | PM |
| 18.1.2 | API 통합 테스트 (Supertest) | L | P0 | API 통합 테스트(Supertest). 11.5.1 워크플로우 테스트를 전 API 회귀로 확장. 참고: docs/05 워크플로우 | `11.5.1 핵심 워크플로우 통합 테스트를 전체 API 회귀 스위트로 확장하세요. docs/05 워크플로우 전부를 커버하고 CI에서 실 Supabase 연동으로 실행되게 하세요.` | PM |
| 18.1.3 | E2E 테스트 (Playwright, 5개 핵심 플로우) | XL | P0 | E2E 테스트(Playwright, 5개 핵심 플로우). Phase 13~15 화면별 E2E를 5개 핵심 플로우 스위트로 묶음. 참고: docs/06 §6 주요 플로우 | `Phase 13~15에서 작성한 Playwright E2E를 5개 핵심 플로우(가입·기록·자기표현·권한·인계) 회귀 스위트로 묶고 CI 야간 실행을 구성하세요. docs/06 §6 참고. 누락 플로우 E2E를 보강하세요.` | PM |
| 18.1.4 | RLS 정책 자동 검증 (pgTAP) | L | P0 | RLS 정책 자동 검증(pgTAP). 11.5.2 마스터 스위트를 CI 회귀로 운영. 참고: docs/03 §RLS 정책 요약 | `11.5.2 RLS pgTAP 마스터 스위트를 CI 회귀 잡으로 운영하세요. docs/03 §RLS 신규 정책이 추가되면 테스트도 동반되도록 게이트를 설정하세요.` | PM |
| 18.1.5 | 시각 회귀 (Chromatic) | M | P1 | 시각 회귀 테스트(Chromatic, P1). Phase 12 Storybook 기반. 참고: docs/07 디자인 시스템 | `Phase 12 Storybook을 Chromatic에 연결해 시각 회귀 테스트를 구성하세요(P1). docs/07 참고. PR마다 컴포넌트 시각 diff를 검토하도록 CI에 추가하세요.` | PM |

## 18.2 Zero Script QA (역할별 시나리오)

| ID | 시나리오 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|---------|:---:|:-:| :-------- | :-------- | :----: |
| 18.2.1 | 보호자 — 회원가입~당사자 등록~권한 부여 | M | P0 | 보호자 시나리오 — 가입~당사자 등록~권한 부여. 참고: docs/04 §1 보호자, bkit:zero-script-qa 스킬 | `보호자 Zero Script QA 시나리오를 작성·실행하세요. 가입→당사자 등록→권한 부여 전 과정을 실제 사용자처럼 탐색·검증하고 결함을 기록하세요. docs/04 §1·bkit:zero-script-qa 스킬 참고.` | PM |
| 18.2.2 | 당사자 — 자기표현 5일 연속 입력 | S | P0 | 당사자 시나리오 — 자기표현 5일 연속. 참고: docs/04 §2 당사자 | `당사자 Zero Script QA 시나리오를 실행하세요. 자기표현 5일 연속 입력·접근성 모드 사용성을 검증하고 결함을 기록하세요. docs/04 §2 참고.` | PM |
| 18.2.3 | 활동지원사 — 일지 작성 + 인계 확인 | M | P0 | 활동지원사 시나리오 — 일지+인계 확인. 참고: docs/04 §3 | `활동지원사 Zero Script QA 시나리오를 실행하세요. 일지 작성(오프라인 포함)→인계 확인을 검증하고 결함을 기록하세요. docs/04 §3 참고.` | PM |
| 18.2.4 | 특수교사 — IEP 작성 + 점검 | M | P0 | 특수교사 시나리오 — IEP 작성+점검. 참고: docs/04 §4 | `특수교사 Zero Script QA 시나리오를 실행하세요. IEP 6스텝 작성→중간 점검을 검증하고 결함을 기록하세요. docs/04 §4 참고.` | PM |
| 18.2.5 | 사회복지사 — ISP·전환계획 작성 | M | P0 | 사회복지사 시나리오 — ISP·전환계획. 참고: docs/04 §5 | `사회복지사 Zero Script QA 시나리오를 실행하세요. ISP·전환계획 작성·서비스 매트릭스를 검증하고 결함을 기록하세요. docs/04 §5 참고.` | PM |
| 18.2.6 | 치료사 — 계획서 + 회기 + 평가 사이클 | M | P0 | 치료사 시나리오 — 계획서+회기+평가 사이클. 참고: docs/04 §6 | `치료사 Zero Script QA 시나리오를 실행하세요. 치료계획서→회기 일지→평가 보고서 사이클을 검증하고 결함을 기록하세요. docs/04 §6 참고.` | PM |
| 18.2.7 | 권한 외 접근 시도 차단 검증 | M | P0 | 권한 외 접근 차단 검증. 참고: docs/05 §11 보안 흐름 | `권한 외 접근 시도 차단을 QA 검증하세요. 무권한·만료 권한·도메인 외 접근을 시도하고 차단·로깅·알림을 확인하세요. docs/05 §11 참고. 11.5.3 시나리오와 교차 확인하세요.` | PM |
| 18.2.8 | 인수인계 권한 이양 검증 | S | P0 | 인수인계 권한 이양 검증. 참고: docs/05 §7 | `인수인계 권한 이양을 QA 검증하세요. 인계 확인 후 후임자 권한 활성화·전임자 권한 변경을 확인하세요. docs/05 §7 참고.` | PM |

## 18.3 성능

| ID | 작업 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|:-:| :-------- | :-------- | :----: |
| 18.3.1 | 타임라인 응답 시간 (10k 기록, p95 < 500ms) | M | P0 | 타임라인 응답 성능(10k 기록, p95<500ms). 참고: docs/02 §5 인덱스 전략 | `타임라인 응답 성능 테스트를 작성하세요. 10k 기록 시드 후 GET /timeline p95<500ms를 k6/Artillery로 측정하세요. docs/02 §5 인덱스 전략 참고. 미달 시 인덱스 보강 후 재측정하세요.` | PM |
| 18.3.2 | 권한 매트릭스 응답 (20명 권한자, p95 < 300ms) | S | P0 | 권한 매트릭스 응답(20명, p95<300ms). | `권한 매트릭스 응답 성능 테스트를 작성하세요. 권한자 20명 시드 후 GET /persons/:id/permissions p95<300ms를 측정하고 미달 시 쿼리 최적화하세요.` | PM |
| 18.3.3 | 모바일 첫 화면 로드 (LCP < 2.5s) | S | P0 | 모바일 첫 화면 로드(LCP<2.5s). | `모바일 첫 화면 로드 성능을 측정하세요. LCP<2.5s 목표로 번들·이미지 최적화 후 재측정하세요. 측정 결과를 docs에 기록하세요.` | PM |
| 18.3.4 | 부하 테스트 (100 동시 일지 작성) | M | P1 | 부하 테스트(100 동시 일지 작성, P1). | `부하 테스트를 작성하세요(P1). 100 동시 일지 작성(POST /records)을 k6로 실행해 오류율·응답 분포를 측정하고 병목을 기록하세요.` | PM |

---

# 19. CI/CD · 배포 (Phase 19)

> 🧪 **테스트 전략:** Phase 0.14에서 구축한 기본 CI 파이프라인(lint+type+test+pgTAP)을 **프리뷰·스테이징·프로덕션 배포까지 확장·완성**한다. 배포 게이트는 전체 회귀 테스트(18.1) 통과를 조건으로 한다.

## 19.1 CI

| ID | 작업 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|:-:| :-------- | :-------- | :----: |
| 19.1.1 | GitHub Actions — Lint·Type·Test | S | P0 | GitHub Actions — Lint·Type·Test 파이프라인. 0.14 기본 파이프라인을 E2E·커버리지 게이트까지 확장. 참고: bkit:phase-9-deployment 스킬 | `0.14 기본 CI를 확장하세요. lint·typecheck·test:unit·test:db에 더해 test:e2e·커버리지 게이트(18.1.1)를 추가하고 잡 캐싱·병렬화하세요. bkit:phase-9-deployment 참고.` | PL |
| 19.1.2 | PR 미리보기 환경 (Vercel Preview) | S | P0 | PR 미리보기 환경(Vercel Preview). | `PR마다 Vercel Preview 배포를 구성하세요. preview env 변수 주입·PR 코멘트에 URL 게시. preview 배포 후 smoke E2E를 실행하세요.` | PL |
| 19.1.3 | DB 마이그레이션 검증 (스테이징) | S | P0 | DB 마이그레이션 검증(스테이징). | `스테이징 DB 마이그레이션 검증 잡을 구성하세요. 마이그레이션 적용 후 pgTAP(11.5.2) 전체 실행·실패 시 차단. 롤백 절차를 문서화하세요.` | PL |
| 19.1.4 | 모바일 EAS Build (iOS·Android) | M | P0 | 모바일 EAS Build(iOS·Android). | `EAS Build를 구성하세요(iOS·Android). 프로필별 빌드·아티팩트 업로드. 빌드 전 Jest·Detox 테스트 통과를 게이트로 두세요.` | PL |

## 19.2 CD

| ID | 작업 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|:-:| :-------- | :-------- | :----: |
| 19.2.1 | dev 환경 자동 배포 | S | P0 | dev 환경 자동 배포. | `dev 환경 자동 배포를 구성하세요. main 머지 시 자동 배포·배포 후 smoke 테스트. 실패 시 알림하세요.` | PL |
| 19.2.2 | staging 환경 (manual trigger) | S | P0 | staging 환경 수동 배포 트리거. | `staging 환경 수동 배포 트리거를 구성하세요. 회귀 테스트(18.1) 통과를 조건으로 배포·배포 후 smoke E2E를 실행하세요.` | PL |
| 19.2.3 | production 배포 (승인 게이트) | M | P0 | production 배포(승인 게이트). | `production 배포에 승인 게이트를 구성하세요. 전체 회귀 통과 + 수동 승인 후 배포·헬스체크·실패 시 자동 롤백 연계(19.2.5).` | PL |
| 19.2.4 | DB 백업 자동화 (일 1회) | S | P0 | DB 백업 자동화(일 1회). | `DB 일 1회 자동 백업을 구성하세요. 백업·보존 정책·복구 리허설. 백업 생성·복구 가능성을 점검 스크립트로 검증하세요.` | PL |
| 19.2.5 | 롤백 시나리오 문서 | S | P0 | 롤백 시나리오 문서. 참고: bkit:rollback 스킬 | `롤백 시나리오를 문서화하세요. 애플리케이션·DB 마이그레이션 롤백 절차·판단 기준. bkit:rollback 스킬 참고. 롤백 리허설 결과를 docs에 기록하세요.` | PL |

## 19.3 운영

| ID | 작업 | 공수 | P | 세부사항 | AI 프롬프트 | 담당자 |
|----|------|:---:|:-:| :-------- | :-------- | :----: |
| 19.3.1 | 모니터링 대시보드 (Grafana) | M | P1 | 모니터링 대시보드(Grafana, P1). | `Grafana 모니터링 대시보드를 구성하세요(P1). API 지연·오류율·DB 메트릭 패널. 임계 알림 룰을 정의하세요.` | PL |
| 19.3.2 | 알림 인프라 (PagerDuty/Slack) | S | P1 | 알림 인프라(PagerDuty/Slack, P1). | `PagerDuty/Slack 알림 인프라를 구성하세요(P1). 심각도별 라우팅·온콜. 테스트 알림으로 라우팅을 검증하세요.` | PL |
| 19.3.3 | 로그 통합 (Loki / Datadog) | M | P1 | 로그 통합(Loki/Datadog, P1). | `Loki/Datadog 로그 통합을 구성하세요(P1). 구조화 로그·상관 ID·보존 정책. 핵심 쿼리 대시보드를 작성하세요.` | PL |
| 19.3.4 | 보안 감사 분기별 (외부) | M | P1 | 분기별 외부 보안 감사(P1). | `분기별 외부 보안 감사 프로세스를 정의하세요(P1). 범위·체크리스트(docs/14)·후속 조치 추적 양식을 작성하세요.` | PL |
| 19.3.5 | 사용자 데이터 GDPR/개인정보보호법 응대 워크플로우 | M | P0 | GDPR/개인정보보호법 응대 워크플로우(데이터 열람·삭제 요청). | `GDPR/개인정보보호법 데이터 열람·삭제 요청 응대 워크플로우와 API를 구현하세요. 본인 확인·열람 패키지 생성·삭제(soft/hard) 처리. 열람·삭제 요청 처리를 Supertest 통합 테스트하세요.` | PL |

---

# 부록 A. 의존성 차트

```
0. 프로젝트 셋업 + CI 기초 (0.13 테스트 인프라·0.14 CI 우선)
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
  ↓
11.5 백엔드 통합 테스트 체크포인트 (✨ 게이트: 통과해야 프론트 진입)
  ↓                ↓
16. 모바일 앱
  ↓
17. SEO/보안 → 18. QA(시나리오·성능) → 19. 배포(0.14 CI 완성)
```

> v1.1 핵심 변화: 테스트 인프라(0.13·0.14)가 최상단에 위치하고, 백엔드 완료 직후 **11.5 통합 테스트 체크포인트**가 프론트엔드 진입 게이트 역할을 한다. 단위→통합→E2E 순으로 검증 깊이가 누적된다.

---

# 부록 B. MVP vs 차기 릴리스

## MVP (P0 합계: ~295d, 5명 팀 약 12주)

- 인증·사용자·당사자·권한 매트릭스 (전체)
- 기록 6도메인 핵심 유형 (MED-001~008, EDU-001/003/004/007/009, WEL-001~006, DAI-002/003, TRA-001/002/003, LEG-001/002/003)
- 자기표현 (전체)
- 파일 첨부 (전체)
- 이정표·타임라인 (전체)
- 인수인계 핵심 4-step
- 알림 (앱 푸시 + 이메일)
- 접근 로그
- **개인정보 거버넌스 P0 (✨ v1.1):** secure_identifiers·consents 테이블·deleted_at·부분인덱스(1.1.14~1.1.16), soft-delete 가시성·복호화 통제 RLS(1.2.6·1.2.7), 동의 수집/주체 판정 API(2.12·2.13), 고유식별정보 암호화 서비스(5.G.1), 로그 파기 배치(11.9), A-08 동의 수집 화면(13.1.7), Sentry PII 스크러빙(17.2.9)
- **테스트 인프라·CI 기초 (0.13·0.14) + 백엔드 통합 테스트 체크포인트 (11.5)** ✨
- 디자인 시스템 + 웹 UI (역할 7개 핵심 화면) + 모바일 핵심 화면
- 보안·접근성 필수
- CI/CD + 프로덕션 배포

## 차기 릴리스 (P1, P2)

- 영유아·노년기 전용 기록 (DAI-001, MED-010, WEL-007, TRA-007 등)
- **개인정보 거버넌스 P1 (✨ v1.1):** 성년 도달 본인 동의 재취득(3.2.10), soft-delete hard-delete 배치(11.10), A-09/A-10 약관·처리방침 페이지(13.1.8), G-65 동의·권리 관리 화면(13.3.6), 처리방침·약관 게시+CPO 지정(17.4.1·법무)
- SMS 채널·음성 메모
- 시각 회귀·부하 테스트 고도화
- i18n (영어)
- OG 이미지·소셜 미리보기
- 시각 분석 대시보드 (보호자용 통계)

## 잔여 TBD (법무·인프라 확정 대상, docs/16 §9)

- 고유식별정보 **암호화 도구·키관리** 선택(Supabase Vault vs pgcrypto+KMS) — 5.G.1·1.2.7 인터페이스만 고정 🟡
- 로그/soft-delete **보유기간·유예기간 수치** — 11.9·11.10 함수는 구조만 확정, 수치 주입은 법무 확정 후 🟡
- 만 14세 이상 미성년자 동의 분기·**법정대리인 자격 증빙 절차** — 2.13 분기 미세부 🟡
- 본인 동의 전환 시 **기존 보호자 권한 처리**(유지/재동의/회수) — 3.2.10 연계 미정 🟡
- **국외이전 리전 확정·DPA** — 17.4.1 처리방침 고지 전제 🟡
- 침해사고 대응 플레이북·권리행사 접수 창구·본인확인 절차 🟡

---

# 부록 C. 역할별 작업 비중 (MVP 기준)

| 역할 | 작업 일수 |
|------|--------|
| 백엔드 엔지니어 (DB·RLS·API) | ~120d |
| 프론트엔드 엔지니어 (웹) | ~80d |
| 모바일 엔지니어 (RN) | ~50d |
| 디자인 시스템 / 디자이너 | ~30d |
| QA / 인프라 (테스트 인프라·통합 체크포인트 포함) | ~36d |
| **합계** | **~316d** |

> 5명 동시 진행 시 12~14주 예상 (병렬 작업 가능 영역 고려). v1.1에서 테스트 인프라(0.13·0.14)·통합 체크포인트(11.5)가 QA/인프라 비중에 +6d 반영됨.

---

> 본 WBS(v1.1)는 IA(06-information-architecture.md), 데이터 명세(02-data-specification.md), ERD(03-erd.md), 워크플로우(04, 05), 디자인 시스템(07)을 기반으로 작성되었습니다. v1.0 대비 모든 작업에 AI 프롬프트 열을 추가하고, 단위→통합→E2E 테스트가 내재화되도록 구현 순서를 재정렬했습니다. 우선순위·공수는 팀 역량과 프로젝트 일정에 따라 조정 가능합니다.
