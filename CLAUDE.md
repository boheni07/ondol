# OnDol 프로젝트

## 하네스: OnDol B2C 웹/앱 서비스 개발

**목표:** B2C 소비자 서비스의 요구사항 분석부터 구현, QA, 문서화까지 에이전트 팀이 협업하여 개발한다.

**트리거:** OnDol 기능 개발, 서비스 구현, 코드 작성, 리뷰, 문서화 등 개발 관련 작업 요청 시 `ondol-dev` 스킬을 사용하라. 단순 질문이나 조언은 직접 응답 가능.

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-06-12 | 초기 하네스 구성 | 전체 | B2C 웹/앱 서비스 개발 시작 |
| 2026-06-12 | 설계 문서 정합성 보완 | docs/02,03,05 | enum 불일치 3건 수정, JSONB 스키마 23개 추가, notifications 테이블 self_expression_id FK 추가, 타이포 수정 |
| 2026-06-12 | IA(정보구조도) 작성 | docs/06 | 반응형웹 82개·모바일 75개 스크린, 11개 스크린 타입, 6개 플로우 정의 |
| 2026-06-12 | 디자인 시스템 작성 | docs/07 | 컬러 토큰(브랜드+6개 도메인), 타이포그래피, 컴포넌트 카탈로그 17종, Tailwind 설정 |
| 2026-06-13 | WBS 작성 + 엑셀(Gantt 연계) | docs/08-wbs.md, docs/08-wbs.xlsx | 381개 작업 20 Phase 분해, 작업별 세부사항·참고문서/와이어프레임 매핑, WBS+Gantt_Chart 시트 COUNTIF/SUMIF 연계 |
| 2026-06-13 | WBS GitHub 등록 자산 + 담당자 배정 | docs/09-wbs-github.md, docs/wbs-github-issues.csv, scripts/import-wbs-github.sh | 작업패키지 55=Issue·Phase 20=Milestone·Projects 1, PM·PL·개발자 A~E 배정, gh CLI 임포트 스크립트 |
| 2026-06-13 | 에이전트 frontmatter 보강 | agents/*.md (analyst·architect-developer·qa-reviewer·documenter) | name·description·model:opus·tools 추가 — subagent_type 미등록 drift 수정 |
| 2026-06-13 | pm-planner 에이전트 + project-planning 스킬 추가 | agents/pm-planner.md, skills/project-planning, skills/ondol-dev | PM/WBS/이슈·일정 역량 공백 보완(진화 트리거: 오케스트레이터 우회 수동 작업), 오케스트레이터 Phase 0.5 연결 |
| 2026-06-14 | 담당자 재배정 + 문서 정합성 보완 | docs/02,03,06,08 + wireframes/index.html | 개발자 B 부하 분산(161→115.5d), WBS 요약표·화면 수·ERD·플로우·컬러 정합화 |
| 2026-06-14 | README + 기술 스택 문서 작성 | README.md, docs/10-tech-stack.md | 프로젝트 부재 문서 보완, WBS 0.2 산출물 경로 정합화 |
