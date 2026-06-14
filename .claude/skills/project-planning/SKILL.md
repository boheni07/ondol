---
name: project-planning
description: OnDol 서비스의 프로젝트 기획·관리를 수행한다. 요구사항/설계 문서를 WBS로 분해하고 공수·우선순위·의존성·담당자·일정을 산정하며, GitHub Issues/Milestones/Projects 등록 자산(가이드·CSV·gh 스크립트)과 엑셀(WBS+Gantt) 을 생성한다. WBS 작성·작업분해·공수 산정·일정/간트·마일스톤·이슈 등록·담당자 배정 요청 시 반드시 이 스킬을 사용할 것. "WBS 만들어줘", "작업 분해해줘", "일정 짜줘", "이슈로 등록", "마일스톤", "담당자 배정", "간트 차트" 등의 표현에 트리거된다. 단, 요구사항 정의 자체는 requirement-analysis, 코드 구현은 implementation 스킬이 담당한다.
---

# project-planning — WBS · 일정 · 이슈/마일스톤 기획

요구사항·설계를 추적 가능한 작업 계획으로 변환한다. 산출물은 사람이 읽는 WBS 문서 + 도구로 등록 가능한 자산(엑셀·CSV·gh 스크립트)이다.

## 표준 단위 (일관성 유지)

이유: 추정 단위가 섞이면 합산·비교가 불가능해진다. 프로젝트 전체에서 아래를 고정한다.

- **공수:** XS=0.5d · S=1d · M=2.5d · L=5d · XL=7d
- **우선순위:** P0(MVP 필수) · P1(권장) · P2(차기 릴리스)
- **분해 원칙:** 기능의 최소 단위. CRUD는 C/R(단건)/L(목록)/U/D 별도. 각 작업에 명확한 산출물이 있어야 한다.

## 워크플로우

### 1. 입력 수집
analyst 요구사항(`_workspace/01_analyst_requirements.md`)과 기존 설계 문서(`docs/02-data-specification.md`, `docs/03-erd.md`, `docs/06-information-architecture.md`, `docs/07-design-system.md`, 와이어프레임)를 읽는다. 입력이 없으면 사용자 요청 범위에서 상위 수준으로 시작한다.

### 2. WBS 분해 — `docs/08-wbs-v1.1.md`
Phase(대분류) → 작업패키지(하위 섹션) → 작업(행) 3계층으로 분해한다. 각 작업 테이블 컬럼:

`ID | 작업 | 산출물 | 공수 | 우선순위 | 세부사항 | 담당자`

- **세부사항:** 작업이 무엇인지 + 개발 시 참고할 문서 제목/위치(`docs/02 §3 JSONB(MED-001)`, `wireframes/web/45-teacher-iep-form.svg`)를 명시한다. 참고가 구체적일수록 구현 단계가 빨라진다.
- 문서 상단에 분해 원칙·추정 단위·우선순위 범례와 작업량 요약 표, 하단에 의존성 차트·MVP 범위·역할별 비중 부록을 둔다.

### 3. 담당자 배정
역할: **PM**(품질·인수·QA) · **PL**(셋업·아키텍처·인프라·보안·배포) · **개발자 A~E**(전문 영역별). 배정은 전문성 기준으로 하고 역할별 총 공수를 합산해 부하를 점검한다(편중 시 재배정 제안). 배정 근거(예: 백엔드 비중이 가장 크므로 Dev-B에 도메인 집중)를 문서에 남긴다.

### 4. 일정 — Gantt
의존성 차트와 병렬 작업 가능 영역을 고려해 Phase별 시작주~종료주를 배정한다. 전체 기간 = 합계 공수 / 인원, 병렬성 반영.

### 5. 엑셀 생성 — `docs/08-wbs.xlsx` (openpyxl)
- **WBS 시트:** 전 작업 + 공수(일) 환산값(SUMIF 가능하도록 숫자). Phase·우선순위·담당자 색상.
- **Gantt_Chart 시트:** Phase별 타임라인. 작업수=`COUNTIF`, 공수합계=`SUMIF`로 **WBS 시트와 수식 연계**(WBS 수정 시 자동 갱신). 진행 막대는 시작주≤주차≤종료주 조건부 서식.
- 한글 깨짐 방지: UTF-8로 저장, 검증은 `PYTHONIOENCODING=utf-8`.

### 6. GitHub 등록 자산
원천은 `docs/08-wbs-v1.1.md`(단일 source of truth). 파싱해서 생성:
- **`docs/09-wbs-github.md`** — 담당자 정책·마일스톤(Phase)·라벨·이슈 목록·등록 방법 가이드
- **`docs/wbs-github-issues.csv`** — 작업패키지=Issue 임포트용 (Title·Body·Milestone·Labels·Assignee·공수)
- **`scripts/import-wbs-github.sh`** — gh CLI 스크립트: 라벨→마일스톤→이슈→(옵션)Projects. 멱등 재실행 가능

매핑 규칙:
- **Issue** = 작업패키지(WBS 하위 섹션). 본문에 작업 체크리스트 + 세부사항.
- **Milestone** = Phase. 주차 기반 마감일.
- **Projects** = 보드 1개.
- **Labels** = `phase:N` · `priority:P0~2` · `type:backend|frontend|mobile|design|infra|db|security|qa` · `role:PM|PL|Dev-A~E`
- **담당자:** 스크립트 상단 role→GitHub username 매핑을 사용자가 채운다. 비우면 미할당 생성 + role 라벨 유지(보드 필터 가능).

> **gh는 직접 실행하지 않는다.** 자산 파일만 생성하고, 등록은 사용자 확인 후 스크립트 실행으로 진행한다. 다수 이슈 생성은 되돌리기 어렵기 때문이다.

### 7. 기획 요약 — `_workspace/00_pm_plan.md`
팀 공유용 1페이지 요약: 총 작업수·공수, Phase별 일정, 담당자별 부하, MVP 범위, 다음 단계.

## 재생성 원칙

`docs/08-wbs-v1.1.md`를 수정하면 엑셀·CSV·가이드·스크립트는 항상 md를 다시 파싱해 재생성한다. 여러 산출물의 정합성을 보장하는 단일 원천 규칙이다. 부분 수정 요청 시 해당 Phase/작업패키지만 손대고 나머지는 보존한다.

## 산출물 체크리스트

- [ ] `docs/08-wbs-v1.1.md` — Phase·작업패키지·작업, 공수/우선순위/세부사항/담당자 컬럼 완비
- [ ] `docs/08-wbs.xlsx` — WBS + Gantt_Chart 시트, COUNTIF/SUMIF 연계 동작
- [ ] `docs/09-wbs-github.md` + `wbs-github-issues.csv` + `scripts/import-wbs-github.sh`
- [ ] 담당자 배정 근거 + 역할별 부하 점검
- [ ] gh 미실행 (자산만 생성), 마크다운 컬럼 정합성 검증
