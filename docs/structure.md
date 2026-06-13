# 폴더 구조 & 네이밍 컨벤션 — OnDol 플랫폼

> 버전: v1.0 | 작성일: 2026-06-14
> WBS 0.8 산출물. 기술 스택은 `10-tech-stack.md`, AI 협업 코딩 규칙은 향후 컨벤션 문서를 따른다.

## 1. 모노레포 최상위 구조

pnpm workspaces 기반 모노레포 (WBS 0.9).

```
ondol/
├── apps/
│   ├── web/            # Next.js (App Router)
│   └── mobile/         # React Native (Expo)
├── packages/
│   ├── shared/         # 타입·상수·도메인 모델 (web·mobile 공유)
│   ├── api-client/     # API 호출 래퍼 + React Query 훅
│   └── validation/     # Zod 스키마 (요청·폼 검증, 양쪽 공유)
├── supabase/           # 마이그레이션·RLS 정책·Edge Functions (또는 bkend 설정)
│   ├── migrations/     # 15-migration-order.md 순서대로
│   └── functions/      # Edge Functions (알림·cron·트리거)
├── docs/               # 설계 문서 01~15
├── wireframes/         # SVG 와이어프레임 + index.html
├── scripts/            # 유틸리티 (WBS GitHub 임포트 등)
├── .claude/            # 개발 하네스 (에이전트·스킬)
├── pnpm-workspace.yaml
└── package.json
```

> `supabase/` vs bkend 설정 디렉터리는 `10-tech-stack.md`의 BaaS 결정에 따른다.

## 2. 앱 내부 구조 — `apps/web` (Next.js App Router)

도메인(기능) 기반으로 구성한다. 기술 레이어보다 **기능 응집**을 우선한다.

```
apps/web/
├── app/                # App Router 라우트 (역할별 세그먼트)
│   ├── (auth)/         # 로그인·회원가입·초대 (A-*)
│   ├── (guardian)/     # 보호자 화면 (G-*)
│   ├── (person)/       # 당사자 접근성 모드 (P-*)
│   └── (pro)/          # 전문가 4역할 (S/T/W/TH-*)
├── features/           # 도메인별 기능 모듈
│   ├── records/        # 기록 (components·hooks·api·types)
│   ├── permissions/    # 권한 매트릭스
│   ├── self-expression/
│   └── ...
├── components/         # 공용 UI (디자인 시스템 컴포넌트)
│   ├── primitives/     # Button, Input … (07-design-system §8)
│   └── composite/      # RecordCard, PersonCard …
├── lib/                # supabase 클라이언트, 유틸
└── styles/             # Tailwind 설정·토큰
```

`apps/mobile`도 동일한 `features/` 응집 원칙을 따르되 라우팅은 Expo Router/네비게이션 스택을 사용한다.

## 3. 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|------|------|------|
| 디렉터리 | kebab-case | `self-expression/`, `access-log/` |
| React 컴포넌트 파일 | PascalCase | `RecordCard.tsx`, `PermissionMatrix.tsx` |
| 훅 | camelCase + `use` 접두 | `useRecords.ts`, `usePermission.ts` |
| 유틸·일반 모듈 | camelCase | `formatDate.ts`, `supabase.ts` |
| 타입·인터페이스 | PascalCase | `Record`, `PermissionLevel` |
| 상수 | UPPER_SNAKE_CASE | `DOMAIN_COLORS`, `MAX_FILE_SIZE` |
| DB 테이블·컬럼 | snake_case | `guardian_persons`, `is_sensitive` (02-data-specification 기준) |
| API 라우트 | kebab/소문자 복수 리소스 | `/persons/:id`, `/self-expressions` |
| 화면 ID | 역할 약자-번호 | `G-01`, `TH-15` (11-screen-inventory 기준) |

## 4. 공유 패키지 경계

| 패키지 | 담는 것 | 담지 않는 것 |
|--------|---------|-------------|
| `shared` | 도메인 타입·enum·상수 | UI, 네트워크 |
| `api-client` | 엔드포인트 호출·캐싱 훅 (12-api-index 기준) | 비즈니스 화면 로직 |
| `validation` | Zod 스키마 (02 §3 JSONB·폼) | 렌더링 |

> 순환 의존 금지: `apps/*` → `packages/*` 단방향. `packages/*`는 `apps/*`를 참조하지 않는다.

## 5. 환경·비밀

- 환경 파일: `.env.{dev,stg,prod}` (WBS 0.5), 저장소 커밋 금지(`.gitignore`)
- 비밀키는 환경변수로만 주입. 코드·문서에 하드코딩 금지

## 6. 문서·자산 위치

| 종류 | 위치 |
|------|------|
| 설계 문서 | `docs/NN-*.md` (번호 순서 유지) |
| 와이어프레임 | `wireframes/{web,mobile}/*.svg` |
| 마이그레이션 | `supabase/migrations/` (`15-migration-order.md` 순서) |
| 스크립트 | `scripts/*.sh`·`*.py` |

---

> 본 컨벤션은 구현 착수(Phase 0) 시점에 팀 합의로 확정하며, 변경 시 `CLAUDE.md` 변경 이력에 기록한다.
