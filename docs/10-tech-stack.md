# 기술 스택 — OnDol 플랫폼

> 버전: v1.0 | 작성일: 2026-06-14
> 본 문서는 WBS(`08-wbs.md`) Phase 0.2가 산출물로 지정한 기술 스택 확정 문서다.
> 범례: ✅ **확정** · ⚪ **차기**(P1/P2)
> 미결 4건(BaaS·서버상태·폼·이메일)은 2026-06-14 확정 완료 — §8 참조.

---

## 0. 한눈에 보기

| 레이어 | 기술 | 상태 |
|--------|------|:---:|
| 웹 프론트 | Next.js (App Router) · TypeScript · Tailwind CSS | ✅ |
| 모바일 | React Native (Expo) | ✅ |
| 백엔드·DB | PostgreSQL + RLS (**Supabase**) · Prisma | ✅ |
| 인증 | 이메일·비밀번호 + 카카오/네이버 OAuth | ✅ |
| 스토리지 | Supabase Storage + Presigned URL + CDN | ✅ |
| 알림 | FCM(푸시) · 이메일(**Resend**) · SMS | ✅ / ⚪ SMS |
| 캐시 | Redis (권한 캐시) | ⚪ P1 |
| 모노레포 | pnpm workspaces | ✅ |
| CI/CD | GitHub Actions · Vercel(웹) · EAS Build(모바일) | ✅ |
| 모니터링 | Sentry · (Grafana/Loki) | ✅ / ⚪ |

---

## 1. 프론트엔드 — 반응형 웹

| 항목 | 선택 | 근거 |
|------|------|------|
| 프레임워크 | **Next.js (App Router)** ✅ | SSR/RSC로 초기 로딩·SEO 유리, 역할별 라우팅. WBS 0.3 |
| 언어 | **TypeScript (strict)** ✅ | 타입 안전, AI 협업 시 계약 명확. WBS 0.7 |
| 스타일 | **Tailwind CSS** ✅ | 디자인 토큰 직결. `07-design-system.md §10`에 Tailwind 설정 정의 |
| 폰트 | **Pretendard** ✅ | 한글 가독성. `07-design-system.md §2` |
| 상태/서버데이터 | **TanStack Query** ✅ | 서버 상태 캐싱·동기화. 권한·기록 등 서버 데이터 의존도 높음 (2026-06-14 확정) |
| 폼 | **React Hook Form + Zod** ✅ | 다단계 위자드 검증. Zod는 `validation` 패키지·JSONB 스키마와 공유 (2026-06-14 확정) |
| 배포 | **Vercel** ✅ | WBS 0.10·19.1.2(Preview) |

> 대상 해상도: PC/Tablet 1280px+, 768px+ (`06-information-architecture.md`).

## 2. 모바일 앱

| 항목 | 선택 | 근거 |
|------|------|------|
| 프레임워크 | **React Native (Expo)** ✅ | 웹과 TypeScript·API 클라이언트 공유, 빠른 빌드. WBS 0.4 |
| 빌드/배포 | **EAS Build** ✅ | iOS·Android 통합 빌드. WBS 19.1.4 |
| 업데이트 | Expo Updates (OTA) ⚪ | 코드 푸시. WBS 16.6.7 (P1) |
| 오프라인 | AsyncStorage ✅ | 일지 임시저장. WBS 16.6.4 |
| 디바이스 | 카메라/갤러리, 생체 인증(Face ID/지문), Deep Link ✅ | WBS 16.6.2/16.6.5/16.6.6 |
| 푸시 | FCM ✅ | WBS 16.6.1 |

## 3. 백엔드 · 데이터베이스

### 3.1 핵심 결정: BaaS → **Supabase 직접** ✅ (2026-06-14 확정)

WBS 0.6의 "bkend.ai BaaS 연동 (또는 Supabase 직접)" 선택지를 **Supabase 직접 제어**로 확정한다.

| | Supabase ✅ | bkend.ai (미채택) |
|---|----------|----------|
| DB | PostgreSQL (직접 제어) | PostgreSQL 기반 BaaS |
| RLS | 네이티브 지원 | 정책 검증 필요 |
| 인증·스토리지 | 통합 제공 (Auth·Storage) | 통합 제공 |
| 적합성 | RLS·트리거·pgTAP 등 **PostgreSQL 깊은 제어** 필요한 본 프로젝트에 유리 | 빠른 온보딩 |

> **확정 사유:** RLS·DB 트리거·pgTAP 검증 의존도가 높다(`03-erd.md` RLS, `13-rls-policy.md`, WBS 1.2/4.4/11/18.1.4). Supabase Auth(OAuth 포함)·Storage(presigned·CDN)·Edge Functions를 함께 사용한다. WBS 0.6 산출물 `lib/supabase.ts` 기준.

### 3.2 공통

| 항목 | 선택 | 근거 |
|------|------|------|
| DB | **PostgreSQL** ✅ | JSONB content, 트리거, RLS. `02-data-specification.md` |
| 보안 | **RLS (행 수준 보안)** ✅ | 권한 매트릭스의 DB 레벨 강제. `03-erd.md` RLS 정책 |
| ORM | **Prisma** ✅ | 타입 안전 쿼리 + SQL Injection 방어. WBS 17.2.4 |
| 서버 로직 | Edge Functions ✅ | 알림·cron·트리거 처리. WBS 4.1.7/10.2.x |
| 캐시 | Redis ⚪ | 권한 캐시 무효화. WBS 4.4.3 (P1) |

### 3.3 인증·스토리지

- **인증:** 이메일·비밀번호 + 이메일 인증 + 초대 링크 ✅ / 카카오·네이버 OAuth ✅ (WBS 2.x)
- **스토리지:** Presigned URL 업로드 + CDN 다운로드 + 민감 파일 추가 인증 ✅ (WBS 7.x)

## 4. 알림

| 채널 | 기술 | 상태 |
|------|------|:---:|
| 앱 푸시 | FCM | ✅ WBS 10.2.1 |
| 이메일 | **Resend** (React Email 템플릿) | ✅ WBS 10.2.2 (2026-06-14 벤더 확정) |
| SMS (응급) | 외부 SMS API | ⚪ P1 WBS 10.2.3 |

## 5. 테스트

| 종류 | 도구 | 근거 |
|------|------|------|
| 단위 | **Vitest** ✅ | WBS 18.1.1 |
| API 통합 | **Supertest** ✅ | WBS 18.1.2 |
| E2E | **Playwright** ✅ | 5개 핵심 플로우. WBS 18.1.3 |
| RLS 정책 | **pgTAP** ✅ | DB 보안 자동 검증. WBS 18.1.4 |
| 시각 회귀 | Chromatic ⚪ | WBS 18.1.5 (P1) |

## 6. 인프라 · 운영

| 항목 | 선택 | 근거 |
|------|------|------|
| 모노레포 | **pnpm workspaces** ✅ | web·mobile·shared(타입·API·검증 스키마) 공유. WBS 0.9 |
| 린트/포맷 | ESLint + Prettier ✅ | WBS 0.7 |
| CI | **GitHub Actions** (Lint·Type·Test) ✅ | WBS 19.1.1 |
| CD | Vercel(웹) · EAS(모바일) · 승인 게이트 prod ✅ | WBS 19.2 |
| 에러 추적 | **Sentry** ✅ | WBS 0.11 |
| 모니터링 | Grafana · Loki/Datadog ⚪ | WBS 19.3 (P1) |
| 알림(운영) | PagerDuty/Slack ⚪ | WBS 19.3.2 (P1) |
| i18n | 한국어 기본, 영어 차기 ✅/⚪ | WBS 0.12 |

## 7. 환경 분리

`.env.{dev,stg,prod}` 3환경 (WBS 0.5). 비밀키는 환경변수, 저장소 커밋 금지(`.gitignore`).

---

## 8. 결정 완료 항목 (2026-06-14 확정)

| # | 항목 | 확정 | 사유 |
|---|------|------|------|
| 1 | BaaS | **Supabase 직접** | RLS·트리거·pgTAP 깊은 제어 |
| 2 | 서버 상태 관리 | **TanStack Query** | 서버 데이터 캐싱·동기화 표준 |
| 3 | 폼·검증 | **React Hook Form + Zod** | 다단계 위자드 + JSONB 스키마 공유 |
| 4 | 이메일 벤더 | **Resend** | 개발자 친화 DX·React Email 템플릿 |

> 4건 모두 확정 완료. 추가 변경 시 본 문서와 `CLAUDE.md` 변경 이력에 기록한다.

---

> 본 문서는 `08-wbs.md`·`02-data-specification.md`·`03-erd.md`·`07-design-system.md`에 명시된 기술 선택을 종합한 것이다. 미결 4건이 확정되어 스택이 모두 잠겼다(⚪ 차기 항목 제외). 변경 시 본 문서와 `CLAUDE.md`를 갱신한다.
