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
| 2026-06-14 | 권장 문서 6종 작성 | docs/11~15 + docs/structure.md | 화면 인벤토리 SSOT·API 인덱스·RLS 정책·접근성 체크리스트·마이그레이션 순서·폴더 구조(병렬 문서 에이전트 4 + 직접 2) |
| 2026-06-14 | access_level 정합화 + admin 위임 정책 확정 | docs/02,06,08,13 + 파생자산 | WBS 4.1.1 `manage`→enum 정합, admin은 주보호자 전용·위임 불가(위자드 read/write/edit 3단계) |
| 2026-06-14 | 기술 스택 미결 4건 확정 | docs/10-tech-stack.md, README | BaaS=Supabase 직접, 서버상태=TanStack Query, 폼=RHF+Zod, 이메일=Resend |
| 2026-06-14 | 에이전트 3종 + 스킬 3종 추가 (팀 5→8명) | agents/{designer,security-reviewer,data-infra}.md, skills/{design-spec,security-review,infra-ops}, skills/ondol-dev, skills/qa-review | 전문 영역 공백 보완 — designer(Phase 1.5: 와이어프레임·a11y), security-reviewer(Phase 3 병렬: RLS·OWASP·PII), data-infra(Phase 3.5: 마이그레이션·배포·CI/CD). 오케스트레이터 Phase·데이터흐름·재실행 갱신, qa-review와 보안 트리거 경계 분리 |
| 2026-06-14 | 설계문서 점검 + 누락 문서 3종 추가 | docs/16~18 | 점검 결과 공백 보완 — 16 개인정보·데이터 거버넌스(PIPA 동의/보관·파기/주체권리), 17 테스트 전략 SSOT(피라미드·커버리지·E2E·CI 게이트), 18 에러처리·공통 API 규약(docs/12 §13 TBD 5건 확정). 병렬 에이전트 3(security-reviewer·qa-reviewer·architect-developer). 발견 drift 3건은 후속 협의 |
| 2026-06-14 | 저위험 정합화 3건 | docs/10·12·13 | docs/10 §5 Detox(모바일 E2E) 등재·성능도구 미선정 명시, docs/12 §13 공통규약 5건 docs/18 역참조 확정, docs/13 부록 RLS 차단 HTTP 표면화(docs/18 §2.3) 역참조 |
| 2026-06-14 | drift 2건 정합화 (거버넌스↔모델/RLS) | docs/02·05·13·15·16 | ①고유식별정보 암호화 분리(`secure_identifiers`)+동의 이력(`consents`)+soft-delete(`deleted_at`) 신설(docs/02 v1.1), 동의 워크플로우 노드 추가(docs/05 §1-3·§10) ②불변 로그 "사용자 불변/service_role 파기" 2계층+soft-delete 가시성 RLS(docs/13 §4.1·4.2, docs/15 §8.4). docs/16 TBD #2·3·4·6·7 해소. architect-developer+data-infra 병렬, 잔여(보유기간·키관리 등)는 법무/인프라 TBD |
| 2026-06-13 | WBS v1.1 작성(이력 누락분 소급 기록) | docs/08-wbs-v1.1.md | AI 프롬프트 열 추가 + 테스트 내재화 순서 재정렬. 커밋 df57b93에서 생성됐으나 변경 이력 미기재였던 것을 소급 등재 |
| 2026-06-14 | 전반 정합성 검토 + 정합화 (4차원 fan-out) | docs/03·04·06·07·08·11·12·13·15·18·README·structure·CLAUDE | docs/02 v1.1·docs/16~18 변경이 미전파된 대규모 drift 정합화. 읽기전용 검토 4(qa·pm·designer·documenter)→정합화: 테이블 13→15 전파(03 ERD·13 RLS매트릭스·15 마이그레이션), 동의 화면 5종 추가(11/06/07, 웹62→67·모바일24→29), 동의 워크플로우(04), 동의·고유식별 API(12), WBS 16작업 추가·v1.1 정본 승격+v1.0 deprecated(386→402작업·665.5p-d). xlsx·csv·09 재생성은 후속 |
| 2026-06-14 | 하네스 진화 — 전파 체크리스트 + WBS SSOT 통일 | skills/ondol-dev, skills/project-planning, agents/pm-planner | "설계 확정→파생문서 전파 누락" drift 2회 반복(진화 트리거) 대응. ondol-dev에 "설계 변경 전파 체크리스트(정합성 게이트)" 섹션 신설 — SSOT별 동기화 대상·4차원 fan-out 운영방식. WBS SSOT 포인터를 docs/08-wbs.md→08-wbs-v1.1.md로 통일 |
| 2026-06-14 | WBS 파생자산 v1.1 재생성 + 요약표 공수 교정 | docs/08.xlsx, wbs-github-issues.csv, docs/09, scripts/gen-wbs-assets.py, docs/08-wbs-v1.1.md | v1.1 정본 기준 xlsx(WBS+Gantt COUNTIF/SUMIF)·CSV(58이슈)·가이드(21마일스톤) 재생성+생성기 보존(SSOT 직접 파싱). 검증 중 요약표 공수 사전오류 발견 — Phase 0(12.5→14.0)·11.5(6→7.5) 테스트작업 미반영분 교정, 총계 666.0→**665.5p-d**(전 작업행 실측) |
| 2026-06-15 | 후속 3건 완료 — 와이어프레임·gh스크립트·TBD 권고안 | wireframes/(SVG 10+index), scripts/(gen-wbs-assets.py write_sh·import-wbs-github.sh), docs/16·02·05·README | ①동의 화면 SVG 10종 제작(웹63~67·모바일25~29, 총 96)+index.html 정합 ②생성기에 write_sh 추가→import-wbs-github.sh v1.1 재생성(이슈58·마일스톤21·라벨39, bash -n OK) ③법무/인프라 TBD 권고안 6건(docs/16 §2.2.1·2.2.2·3.2.1·4.1.1·5.3.1·7.1·8.3.1, 전부 🟡 확정 필요)·§9 표 #1·2·8·10·13·14 "권고안 있음" 갱신. designer·security-reviewer 병렬 |
