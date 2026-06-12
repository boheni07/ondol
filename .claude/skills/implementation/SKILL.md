---
name: implementation
description: OnDol 서비스의 코드를 작성하고 기술 아키텍처를 설계한다. 코드 작성, 기능 구현, API 개발, DB 스키마 설계, 컴포넌트 개발, 기술 스택 선정, 버그 수정 요청 시 반드시 이 스킬을 사용할 것. "만들어줘", "구현해줘", "코드 작성", "개발해줘", "스택 뭐 쓸까", "버그 고쳐줘" 등의 표현에 트리거된다.
---

## 목적

요구사항을 실행 가능한 코드로 변환한다. 기술 스택이 미정인 초기에는 스택 선정부터, 이후에는 바로 구현으로 진행한다.

## 작업 순서

### 0단계: 컨텍스트 확인
- `_workspace/01_analyst_requirements.md` 읽기
- `_workspace/02_architect_design.md` 존재 여부 확인
  - 있으면: 기존 설계 기반으로 이어서 구현
  - 없으면: 설계부터 시작

### 1단계: 기술 스택 결정 (미정인 경우)

스택이 결정되지 않았으면 아래 기준으로 B2C 서비스 적합 옵션을 추천:

| 고려 기준 | 질문 |
|---------|------|
| 규모 | 동시 사용자 예상치? |
| 팀 | 개발자 수, 숙련도? |
| 예산 | 호스팅 비용 제약? |
| 속도 | MVP까지 기간? |

**기본 추천 스택 (Dynamic B2C):**
- **풀스택**: Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- **DB**: PostgreSQL + Prisma ORM (관계형) 또는 Supabase (BaaS)
- **인증**: NextAuth.js 또는 Supabase Auth
- **배포**: Vercel (프론트) + Railway/Supabase (백)

### 2단계: 설계 문서 작성

`_workspace/02_architect_design.md` 에 작성:

```markdown
# 시스템 설계 — {기능명}

## 기술 스택
- Frontend: 
- Backend: 
- Database: 
- 인증: 
- 배포: 

## DB 스키마
{테이블 정의}

## API 엔드포인트
| Method | Path | 설명 |
|--------|------|------|

## 컴포넌트 구조
{프론트엔드 컴포넌트 트리}
```

### 3단계: 구현

- 핵심 기능부터 동작하는 코드를 먼저 작성
- 의사코드 없이 실행 가능한 코드로 작성
- 파일 경로를 명확히 지정하여 프로젝트 루트에 직접 생성
- 각 파일 완성 후 qa-reviewer에게 점진적 리뷰 요청

### 4단계: QA 요청

구현 완료 후 qa-reviewer에게 SendMessage:
```
리뷰 요청: {기능명} 구현 완료
파일: {변경된 파일 목록}
체크포인트: {주요 확인 사항}
```
