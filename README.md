# OnDol (온돌)

> 발달장애인의 **생애주기 전체**를 기록하고, 보호자·전문가 간 **민감 정보 접근 권한**을 안전하게 관리하는 B2C 웹/앱 플랫폼.

**온돌**은 바닥에서 올라오는 따뜻함·집·안심감을 상징한다. 의료·복지 서비스의 신뢰감과 일상의 따뜻함을 함께 전한다.

---

## 무엇을 해결하나

발달장애인의 진단·교육·복지·치료 기록은 병원·학교·복지관·치료실에 흩어져 있고, 담당자가 바뀔 때마다 맥락이 끊긴다. OnDol은 **당사자 1명을 중심으로** 평생의 기록을 한곳에 모으고, 보호자가 **누가 어떤 분야를 얼마 동안 볼 수 있는지**를 직접 통제한다.

## 핵심 개념

- **생애주기 × 이해관계자 × 기록 매트릭스** — 영유아기부터 노년기까지 6단계, 6개 분야(의료·교육·복지·일상·전환·법적)의 기록을 타임라인으로 통합 (`docs/01`)
- **권한 매트릭스** — 보호자가 전문가별로 분야·수준(열람/작성/편집/관리)·기간을 지정해 부여/회수. 모든 접근은 감사 로그로 남는다 (`docs/04 §보호자`, RLS 기반)
- **자기표현(Self-Expression)** — 당사자가 직접 아이콘으로 오늘의 기분·활동을 기록하는 접근성 우선 플로우 (`docs/06 Flow-1`)
- **인수인계(Handover)** — 전문가 교체 시 핵심 기록·특이사항을 구조화해 전달

## 역할 (7)

| 역할 | 주요 활동 |
|------|----------|
| 보호자 (Guardian) | 당사자 등록, 기록 관리, 권한 부여/회수, 접근 로그 확인 |
| 당사자 (Person) | 자기표현 기록, 내 기록 열람 (접근성 모드) |
| 활동지원사 (Supporter) | 활동지원 일지, 인수인계 |
| 특수교사 (Teacher) | IEP, 학교생활 관찰, 전환교육 |
| 사회복지사 (Social Worker) | ISP, 전환계획, 서비스 이용 현황 |
| 치료사 (Therapist) | 치료계획서, 회기 일지, 평가 보고서 |
| 공통(인증) | 회원가입·로그인·초대 수락 |

## 현재 상태

> 📐 **설계 완료 · 구현 착수 전.** 본 저장소는 현재 **설계 문서 + 와이어프레임 + 작업 분해(WBS)** 단계다. 애플리케이션 코드(`apps/`)는 아직 없다.

- 설계 문서 9종 (`docs/01`~`docs/09`)
- 와이어프레임 86개 — 웹 62 · 모바일 24 (`wireframes/`, 미리보기: `wireframes/index.html`)
- WBS 381개 작업 / 632 person-day / 7인 16주 추정 (`docs/08-wbs.md`)

## 문서 인덱스

| 문서 | 내용 |
|------|------|
| [docs/01-record-matrix.md](docs/01-record-matrix.md) | 생애주기 × 이해관계자 × 기록 매트릭스, 기록유형 코드 |
| [docs/02-data-specification.md](docs/02-data-specification.md) | 테이블 명세, JSONB 스키마, Enum, 인덱스 |
| [docs/03-erd.md](docs/03-erd.md) | ERD, RLS 정책 요약 |
| [docs/04-workflows-user.md](docs/04-workflows-user.md) | 역할별 워크플로우 |
| [docs/05-workflows-feature.md](docs/05-workflows-feature.md) | 기능별 워크플로우 |
| [docs/06-information-architecture.md](docs/06-information-architecture.md) | IA(정보구조도), 사이트맵, 주요 플로우 |
| [docs/07-design-system.md](docs/07-design-system.md) | 컬러·타이포·컴포넌트·접근성 |
| [docs/08-wbs.md](docs/08-wbs.md) | 작업 분해 구조 (담당자·공수·일정) |
| [docs/09-wbs-github.md](docs/09-wbs-github.md) | GitHub Issues/Milestones/Projects 등록 가이드 |
| [docs/10-tech-stack.md](docs/10-tech-stack.md) | 기술 스택 결정 |
| [docs/11-screen-inventory.md](docs/11-screen-inventory.md) | 화면 인벤토리 SSOT (웹 62·모바일 24) |
| [docs/12-api-index.md](docs/12-api-index.md) | API 엔드포인트 인덱스 |
| [docs/13-rls-policy.md](docs/13-rls-policy.md) | RLS 정책 상세 매트릭스 |
| [docs/14-accessibility-checklist.md](docs/14-accessibility-checklist.md) | 접근성 체크리스트 (WCAG 2.1) |
| [docs/15-migration-order.md](docs/15-migration-order.md) | DB 마이그레이션 순서 |
| [docs/structure.md](docs/structure.md) | 폴더 구조·네이밍 컨벤션 |

## 기술 스택 (요약)

- **웹:** Next.js (App Router) · TypeScript · Tailwind CSS · Pretendard
- **모바일:** React Native (Expo) · EAS
- **백엔드·DB:** Supabase — PostgreSQL + **RLS**(행 수준 보안) · Prisma
- **상태·폼:** TanStack Query · React Hook Form + Zod
- **알림:** FCM(푸시) · Resend(이메일)
- **인프라:** pnpm 모노레포 · Vercel(웹) · GitHub Actions · Sentry

자세한 내용과 선정 근거는 [docs/10-tech-stack.md](docs/10-tech-stack.md) 참조.

## 프로젝트 구조 (계획)

```
ondol/
├── apps/
│   ├── web/         # Next.js (App Router) — 예정
│   └── mobile/      # React Native (Expo) — 예정
├── docs/            # 설계 문서 01~10
├── wireframes/      # SVG 와이어프레임 (web/ · mobile/) + index.html
├── scripts/         # 유틸리티 (GitHub WBS 임포트 등)
└── .claude/         # 개발 하네스 (에이전트·스킬)
```

## 시작하기

현재는 설계 단계이므로 코드 실행 대신 문서·와이어프레임을 확인한다.

```bash
# 와이어프레임 미리보기 (브라우저에서 열기)
open wireframes/index.html      # macOS
start wireframes/index.html     # Windows
```

구현 착수 시 `docs/10-tech-stack.md`의 셋업 순서와 `docs/08-wbs.md` Phase 0(프로젝트 셋업)을 따른다.

## 개발 로드맵

WBS 기준 20개 Phase(셋업 → DB/RLS → 인증 → 권한 → 기록 → … → 배포). MVP(P0)는 약 280 person-day, 5명 12주 추정. 담당자 배정·일정은 [docs/08-wbs.md](docs/08-wbs.md)와 [docs/09-wbs-github.md](docs/09-wbs-github.md) 참조.

## 개발 하네스

이 저장소는 `.claude/`에 에이전트 팀 기반 개발 하네스를 둔다 — `pm-planner`(기획·WBS), `analyst`(요구사항), `architect-developer`(설계·구현), `qa-reviewer`(검증), `documenter`(문서). 오케스트레이터 스킬 `ondol-dev`가 이들을 조율한다. 트리거 규칙·변경 이력은 [CLAUDE.md](CLAUDE.md) 참조.

---

> 본 README는 설계 문서(`docs/`) 기준으로 작성되었으며, 구현 진행에 따라 갱신된다.
