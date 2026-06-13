---
name: ondol-dev
description: OnDol B2C 웹/앱 서비스 개발 하네스의 오케스트레이터. OnDol 기능 개발, 서비스 구현, 기획/WBS/일정, 팀 작업 조율 요청 시 반드시 이 스킬을 사용할 것. "OnDol 개발", "기능 만들어줘", "서비스 구현", "WBS 만들어줘", "작업 분해", "일정 짜줘", "이슈 등록", "마일스톤", "담당자 배정", "팀 돌려줘", "다시 실행", "재실행", "업데이트", "수정해줘", "이전 결과 개선", "부분만 다시" 등의 표현에 트리거된다. pm-planner, analyst, architect-developer, qa-reviewer, documenter 에이전트를 에이전트 팀으로 조율한다.
---

## 실행 모드

**에이전트 팀** — pm-planner, analyst, architect-developer, qa-reviewer, documenter가 SendMessage로 직접 통신하며 자체 조율한다. 오케스트레이터는 팀 구성과 작업 할당만 담당하고, 진행 상황을 모니터링한다.

## Phase 0: 컨텍스트 확인

워크플로우 시작 전 기존 산출물 존재 여부를 확인한다:

```
_workspace/ 존재?
  ├── 없음 → 초기 실행 (Phase 1부터)
  ├── 있음 + 사용자가 부분 수정 요청 → 부분 재실행 (해당 에이전트만)
  └── 있음 + 새 요청 → 새 실행 (_workspace를 _workspace_prev로 이동 후 시작)
```

## Phase 0.5: 기획·WBS (기획 범위 요청 시)

**실행 모드:** 에이전트 팀 (pm-planner 주도)

이 Phase는 **기획·WBS·일정·이슈 등록 범위의 요청일 때만** 실행한다. 단순 단일 기능 구현·버그 수정이면 건너뛰고 Phase 1로 간다.

1. pm-planner에게 `TaskCreate`로 작업 할당:
   - "WBS 분해 및 기획: {요청 내용}"
   - skill: project-planning
   - 입력: `_workspace/01_analyst_requirements.md`(있으면) + `docs/` 설계 문서

2. pm-planner가 `docs/08-wbs.md`(+xlsx) 및 GitHub 등록 자산 생성, `_workspace/00_pm_plan.md` 요약 공유

3. GitHub 이슈 등록은 자산 생성까지만 하고, 실제 `gh` 실행은 사용자 확인 후 진행

**완료 조건:** `docs/08-wbs.md` 생성/갱신 + `_workspace/00_pm_plan.md` 요약 + 사용자 확인

## Phase 1: 요구사항 분석

**실행 모드:** 에이전트 팀 (analyst 단독 시작)

1. `TeamCreate`로 팀 구성:
   - team_name: `ondol-{작업명}-team`
   - members: pm-planner, analyst, architect-developer, qa-reviewer, documenter

2. analyst에게 `TaskCreate`로 작업 할당:
   - "요구사항 명세 작성: {기능/요청 내용}"
   - skill: requirement-analysis

3. analyst가 `_workspace/01_analyst_requirements.md` 완성 후 팀 내 공유

**완료 조건:** `_workspace/01_analyst_requirements.md` 생성 + 사용자 확인

## Phase 2: 설계 및 구현

**실행 모드:** 에이전트 팀 (architect-developer 주도)

1. architect-developer에게 `TaskCreate`로 작업 할당:
   - "기술 설계 및 구현: {기능명}"
   - skill: implementation
   - 입력: `_workspace/01_analyst_requirements.md`

2. 구현 중 qa-reviewer가 점진적 리뷰 (모듈 완성마다)

3. 주요 기술 결정 (스택, DB 설계)은 사용자에게 확인 요청

**완료 조건:** 핵심 기능 구현 완료 + `_workspace/02_architect_design.md` 생성

## Phase 3: QA 검증

**실행 모드:** 에이전트 팀 (qa-reviewer 주도)

1. qa-reviewer에게 `TaskCreate`로 작업 할당:
   - "최종 QA 검증: {기능명}"
   - skill: qa-review

2. FAIL 시: architect-developer 수정 → qa-reviewer 재검증 (최대 3회)

3. PASS 시: Phase 4로 진행

**완료 조건:** `_workspace/03_qa_review.md` 에 PASS 기록

## Phase 4: 문서화

**실행 모드:** 에이전트 팀 (documenter 단독)

1. documenter에게 `TaskCreate`로 작업 할당:
   - "문서 작성: {기능명}"
   - skill: documentation

2. `docs/` 에 최종 문서 저장

**완료 조건:** `docs/` 에 관련 문서 생성

## 데이터 전달 경로

```
pm-planner (기획 범위 요청 시)
  └─→ docs/08-wbs.md (+xlsx) + GitHub 등록 자산 + _workspace/00_pm_plan.md
        └─→ analyst
analyst
  └─→ _workspace/01_analyst_requirements.md
        └─→ architect-developer
              └─→ _workspace/02_architect_design.md + 구현 코드
                    └─→ qa-reviewer
                          └─→ _workspace/03_qa_review.md
                                └─→ documenter
                                      └─→ docs/
```

## 에러 핸들링

- analyst 분석 불완전: 핵심 가정 3개 명시 후 진행
- 구현 실패 (1회): architect-developer 재시도
- 구현 실패 (2회): analyst에게 요구사항 범위 축소 요청
- QA FAIL 3회 반복: 사용자에게 요구사항 재정의 요청
- 문서화 차단: QA 결과 없이 시작하지 않고 오케스트레이터에 보고

## 부분 재실행 (후속 작업)

특정 Phase만 다시 실행이 필요하면:
- "WBS/일정 수정", "이슈 다시", "담당자 재배정": Phase 0.5만 (pm-planner)
- "분석만 다시": Phase 1만
- "코드 수정": Phase 2 + Phase 3
- "문서 업데이트": Phase 4만
- "QA 재검증": Phase 3만

## 테스트 시나리오

**정상 흐름:**
1. "로그인 기능 만들어줘" → Phase 0(신규) → (기획 범위 아님, Phase 0.5 건너뜀) → Phase 1(요구사항) → Phase 2(NextAuth 구현) → Phase 3(QA) → Phase 4(README 업데이트)
2. "전체 WBS 만들고 GitHub 이슈로 등록 준비해줘" → Phase 0 → Phase 0.5(pm-planner: docs/08-wbs.md + 엑셀 + 이슈 자산) → 사용자 확인 후 gh 스크립트 실행

**에러 흐름:**
1. QA FAIL 2회 → architect-developer가 요구사항 범위 재확인 → analyst와 협의 → 범위 축소 후 재구현
