# WBS → GitHub 등록 가이드 (Issues · Milestones · Projects)

> 생성: project-planning 스킬 · 원본 docs/08-wbs-v1.1.md (정본 SSOT, v1.1)

작업패키지(WBS 하위 섹션) 1개 = Issue 1개, Phase 1개 = Milestone 1개, 전체를 Projects 보드 1개로 관리한다. v1.1 기준 **이슈 58개 · 마일스톤 21개 · 작업 402개 · 공수 665.5d**.

---

## 1. 담당자 배정 정책

| 담당자 | 담당 영역 | Phase | 작업패키지 | 작업 | 예상 공수 |
|--------|-----------|-------|:----:|:---:|:------:|
| PM (PM) | QA·테스트(품질/인수 시나리오) + 백엔드 통합 테스트 체크포인트 | 11.5,18 | 4 | 20 | 56d |
| PL (PL) | 셋업·CI·DB·감사·보안접근성·법무고지·배포 | 0,1,11,17,19 | 11 | 78 | 93.5d |
| 개발자 A (Dev-A) | 백엔드(인증·사용자·권한·타임라인·인계·알림·동의) | 2,3,4,8,9,10 | 15 | 96 | 114.5d |
| 개발자 B (Dev-B) | 백엔드(기록·자기표현·파일·고유식별정보 암호화) | 5,6,7 | 10 | 74 | 118d |
| 개발자 C (Dev-C) | 프론트 웹(디자인시스템·보호자·당사자·동의/권리) | 12,13,14 | 8 | 60 | 100d |
| 개발자 D (Dev-D) | 프론트 웹(전문가 4역할) | 15 | 4 | 41 | 100d |
| 개발자 E (Dev-E) | 모바일(RN) | 16 | 6 | 33 | 83.5d |

> 배정 근거: docs/08-wbs-v1.1.md 본문 담당자 열. 백엔드 부하 완화를 위해 타임라인·인계·알림(8~10)은 Dev-A, 감사·보안(11·17)은 PL, 백엔드 통합 테스트(11.5)는 PM이 담당. GitHub 실제 할당은 스크립트 상단 role→username 매핑 사용.

---

## 2. Milestones (Phase 21개)

| Milestone | 주차 | 작업패키지 | 작업 | 공수 | 담당(주) |
|-----------|:----:|:----:|:---:|:---:|:------:|
| Phase 0 · 프로젝트 셋업 | W1–W2 | 1 | 14 | 14d | PL |
| Phase 1 · DB 스키마 + RLS | W2–W4 | 2 | 23 | 17d | PL |
| Phase 2 · 인증 (Auth) | W4–W6 | 1 | 13 | 18.5d | 개발자 A |
| Phase 3 · 사용자·당사자·매핑 | W5–W7 | 4 | 25 | 25.5d | 개발자 A |
| Phase 4 · 권한 관리 | W6–W8 | 4 | 18 | 25d | 개발자 A |
| Phase 5 · 기록 (Records) | W7–W12 | 8 | 57 | 98d | 개발자 B |
| Phase 6 · 자기표현 | W9–W10 | 1 | 8 | 9.5d | 개발자 B |
| Phase 7 · 파일 첨부 | W9–W10 | 1 | 9 | 10.5d | 개발자 B |
| Phase 8 · 이정표·타임라인 | W10–W12 | 2 | 14 | 13.5d | 개발자 A |
| Phase 9 · 인수인계 | W11–W13 | 2 | 12 | 16d | 개발자 A |
| Phase 10 · 알림 | W11–W13 | 2 | 14 | 16d | 개발자 A |
| Phase 11 · 접근 로그 | W12–W13 | 1 | 10 | 14.5d | PL |
| Phase 11.5 · 백엔드 통합 테스트 | W13 | 1 | 3 | 7.5d | PM |
| Phase 12 · 디자인 시스템 | W4–W6 | 4 | 21 | 22d | 개발자 C |
| Phase 13 · 웹 UI — 보호자 | W7–W11 | 3 | 29 | 59d | 개발자 C |
| Phase 14 · 웹 UI — 당사자(접근성) | W10–W12 | 1 | 10 | 19d | 개발자 C |
| Phase 15 · 웹 UI — 전문가(4역할) | W9–W14 | 4 | 41 | 100d | 개발자 D |
| Phase 16 · 모바일 앱(RN) | W11–W15 | 6 | 33 | 83.5d | 개발자 E |
| Phase 17 · SEO·보안·접근성 | W13–W15 | 4 | 17 | 25d | PL |
| Phase 18 · QA·테스트 | W14–W16 | 3 | 17 | 48.5d | PM |
| Phase 19 · CI/CD·배포 | W15–W16 | 3 | 14 | 23d | PL |

---

## 3. Labels

- `phase:0` ~ `phase:19` (`phase:11.5` 포함)
- `priority:P0` · `priority:P1` · `priority:P2`
- `type:infra|db|backend|frontend|mobile|design|security|qa`
- `role:PM|PL|Dev-A|Dev-B|Dev-C|Dev-D|Dev-E`

---

## 4. Issue 목록 (작업패키지 58개)

| # | Issue 제목 | Milestone | 담당자 | 우선 | 공수 | 작업수 |
|:--:|-----------|-----------|:------:|:---:|:---:|:---:|
| 1 | [0] 프로젝트 셋업 + CI 기초 (Phase 0) | Phase 0 · 프로젝트 셋업 | PL | P0 | 14d | 14 |
| 2 | [1.1] 마이그레이션 — 핵심 테이블 | Phase 1 · DB 스키마 + RLS | PL | P0 | 9d | 16 |
| 3 | [1.2] RLS 정책 | Phase 1 · DB 스키마 + RLS | PL | P0 | 8d | 7 |
| 4 | [2] 인증 (Auth) | Phase 2 · 인증 (Auth) | 개발자 A | P0 | 18.5d | 13 |
| 5 | [3.1] 사용자 (users) | Phase 3 · 사용자·당사자·매핑 | 개발자 A | P0 | 3.5d | 5 |
| 6 | [3.2] 당사자 (persons) | Phase 3 · 사용자·당사자·매핑 | 개발자 A | P0 | 14d | 10 |
| 7 | [3.3] 보호자-당사자 매핑 (guardian_persons) | Phase 3 · 사용자·당사자·매핑 | 개발자 A | P0 | 5d | 6 |
| 8 | [3.4] 당사자 계정 (person_accounts) | Phase 3 · 사용자·당사자·매핑 | 개발자 A | P0 | 3d | 4 |
| 9 | [4.1] 권한 CRUD | Phase 4 · 권한 관리 | 개발자 A | P0 | 12d | 8 |
| 10 | [4.2] 권한 위자드 플로우 (4 step) | Phase 4 · 권한 관리 | 개발자 A | P0 | 5.5d | 4 |
| 11 | [4.3] 권한 변경 이력 (permission_logs) | Phase 4 · 권한 관리 | 개발자 A | P0 | 3d | 3 |
| 12 | [4.4] RLS 권한 검증 | Phase 4 · 권한 관리 | 개발자 A | P0 | 4.5d | 3 |
| 13 | [5.0] 기록 공통 CRUD | Phase 5 · 기록 (Records) | 개발자 B | P0 | 18d | 13 |
| 14 | [5.A] 의료 기록 (MED-001 ~ MED-010) | Phase 5 · 기록 (Records) | 개발자 B | P0 | 13d | 10 |
| 15 | [5.B] 교육 기록 (EDU-001 ~ EDU-009) | Phase 5 · 기록 (Records) | 개발자 B | P0 | 16d | 9 |
| 16 | [5.C] 복지 기록 (WEL-001 ~ WEL-007) | Phase 5 · 기록 (Records) | 개발자 B | P0 | 15.5d | 7 |
| 17 | [5.D] 일상/돌봄 기록 (DAI-001 ~ DAI-005) | Phase 5 · 기록 (Records) | 개발자 B | P0 | 6.5d | 5 |
| 18 | [5.E] 전환/자립 기록 (TRA-001 ~ TRA-007) | Phase 5 · 기록 (Records) | 개발자 B | P0 | 18.5d | 7 |
| 19 | [5.F] 법적/행정 기록 (LEG-001 ~ LEG-005) | Phase 5 · 기록 (Records) | 개발자 B | P0 | 8d | 5 |
| 20 | [5.G] 고유식별정보 암호화 서비스 (PIPA §24) | Phase 5 · 기록 (Records) | 개발자 B | P0 | 2.5d | 1 |
| 21 | [6] 자기표현 (Self-Expression) | Phase 6 · 자기표현 | 개발자 B | P0 | 9.5d | 8 |
| 22 | [7] 파일 첨부 (Record Files) | Phase 7 · 파일 첨부 | 개발자 B | P0 | 10.5d | 9 |
| 23 | [8.1] 이정표 CRUD | Phase 8 · 이정표·타임라인 | 개발자 A | P0 | 4d | 6 |
| 24 | [8.2] 타임라인 (records + milestones + self_expressions 통합) | Phase 8 · 이정표·타임라인 | 개발자 A | P0 | 9.5d | 8 |
| 25 | [9.1] 인수인계 CRUD | Phase 9 · 인수인계 | 개발자 A | P0 | 7d | 6 |
| 26 | [9.2] 인계 플로우 | Phase 9 · 인수인계 | 개발자 A | P0 | 9d | 6 |
| 27 | [10.1] 알림 인프라 | Phase 10 · 알림 | 개발자 A | P0 | 5.5d | 6 |
| 28 | [10.2] 알림 채널 | Phase 10 · 알림 | 개발자 A | P0 | 10.5d | 8 |
| 29 | [11] 접근 로그 (Audit) | Phase 11 · 접근 로그 | PL | P0 | 14.5d | 10 |
| 30 | [11.5] 백엔드 통합 테스트 체크포인트 | Phase 11.5 · 백엔드 통합 테스트 | PM | P0 | 7.5d | 3 |
| 31 | [12.1] 토큰 (07-design-system.md 기반) | Phase 12 · 디자인 시스템 | 개발자 C | P0 | 3d | 4 |
| 32 | [12.2] Primitives | Phase 12 · 디자인 시스템 | 개발자 C | P0 | 5.5d | 8 |
| 33 | [12.3] Composite Components | Phase 12 · 디자인 시스템 | 개발자 C | P0 | 6.5d | 5 |
| 34 | [12.4] 레이아웃 셀 | Phase 12 · 디자인 시스템 | 개발자 C | P0 | 7d | 4 |
| 35 | [13.1] 인증 화면 | Phase 13 · 웹 UI — 보호자 | 개발자 C | P0 | 11d | 8 |
| 36 | [13.2] 메인 화면 | Phase 13 · 웹 UI — 보호자 | 개발자 C | P0 | 37.5d | 15 |
| 37 | [13.3] 설정 화면 | Phase 13 · 웹 UI — 보호자 | 개발자 C | P0 | 10.5d | 6 |
| 38 | [14] 웹 UI — 당사자 (Person, 접근성 모드, 10 screens) | Phase 14 · 웹 UI — 당사자(접근성) | 개발자 C | P0 | 19d | 10 |
| 39 | [15.1] 활동지원사 (S) | Phase 15 · 웹 UI — 전문가(4역할) | 개발자 D | P0 | 13.5d | 8 |
| 40 | [15.2] 특수교사 (T) | Phase 15 · 웹 UI — 전문가(4역할) | 개발자 D | P0 | 27d | 11 |
| 41 | [15.3] 사회복지사 (W) | Phase 15 · 웹 UI — 전문가(4역할) | 개발자 D | P0 | 35.5d | 12 |
| 42 | [15.4] 치료사 (TH) | Phase 15 · 웹 UI — 전문가(4역할) | 개발자 D | P0 | 24d | 10 |
| 43 | [16.1] 인증 | Phase 16 · 모바일 앱(RN) | 개발자 E | P0 | 7d | 4 |
| 44 | [16.2] 보호자 | Phase 16 · 모바일 앱(RN) | 개발자 E | P0 | 20.5d | 8 |
| 45 | [16.3] 당사자 (접근성) | Phase 16 · 모바일 앱(RN) | 개발자 E | P0 | 12d | 5 |
| 46 | [16.4] 활동지원사 | Phase 16 · 모바일 앱(RN) | 개발자 E | P0 | 10.5d | 3 |
| 47 | [16.5] 전문가 4역할 통합 패턴 | Phase 16 · 모바일 앱(RN) | 개발자 E | P0 | 15d | 6 |
| 48 | [16.6] 모바일 전용 기능 | Phase 16 · 모바일 앱(RN) | 개발자 E | P0 | 18.5d | 7 |
| 49 | [17.1] SEO (웹만) | Phase 17 · SEO·보안·접근성 | PL | P1 | 2d | 3 |
| 50 | [17.2] 보안 | Phase 17 · SEO·보안·접근성 | PL | P0 | 13.5d | 9 |
| 51 | [17.3] 접근성 (WCAG 2.1 AA) | Phase 17 · SEO·보안·접근성 | PL | P0 | 8.5d | 4 |
| 52 | [17.4] 법무·고지 (개인정보 거버넌스) | Phase 17 · SEO·보안·접근성 | PL | P1 | 1d | 1 |
| 53 | [18.1] 자동화 테스트 | Phase 18 · QA·테스트 | PM | P0 | 24.5d | 5 |
| 54 | [18.2] Zero Script QA (역할별 시나리오) | Phase 18 · QA·테스트 | PM | P0 | 17d | 8 |
| 55 | [18.3] 성능 | Phase 18 · QA·테스트 | PM | P0 | 7d | 4 |
| 56 | [19.1] CI | Phase 19 · CI/CD·배포 | PL | P0 | 5.5d | 4 |
| 57 | [19.2] CD | Phase 19 · CI/CD·배포 | PL | P0 | 6.5d | 5 |
| 58 | [19.3] 운영 | Phase 19 · CI/CD·배포 | PL | P0 | 11d | 5 |

---

## 5. 등록 방법

### 방법 A — 자동 스크립트 (권장)

```bash
gh auth login
gh auth refresh -s project,repo
# scripts/import-wbs-github.sh 상단 role→username 매핑 편집 후
bash scripts/import-wbs-github.sh
```

스크립트는 라벨→마일스톤→이슈 58개→(옵션)Projects 순으로 동작, 멱등 재실행 가능.

### 방법 B — CSV 임포트

docs/wbs-github-issues.csv 를 GitHub CSV 임포트 도구로 업로드.

### 방법 C — Projects 커스텀 필드

Status·담당자·우선순위·공수(일)·Phase 필드 권장. 라벨로도 필터 가능.

---

> 재생성: `python scripts/gen-wbs-assets.py` (SSOT=docs/08-wbs-v1.1.md). csv·09·xlsx 세 자산을 일괄 갱신.
