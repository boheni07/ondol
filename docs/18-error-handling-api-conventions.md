# 에러 처리 · 공통 API 규약 — OnDol 플랫폼

> 버전: v1.0 | 작성일: 2026-06-14
> DB: PostgreSQL (Supabase 직접) | 기본 타임존: KST (UTC+9)

`docs/12-api-index.md §13`(공통 규약 — TBD)과 `docs/13-rls-policy.md` 부록에서 **TBD**로 남겨둔 공통 규약을 확정하는 문서다. `docs/12`의 13개 도메인 엔드포인트(`/auth`·`/users`·`/persons`·`/permissions`·`/records`·`/self-expressions`·`/files`·`/milestones`·`/timeline`·`/handovers`·`/notifications`·`/access-logs`)에 공통 적용되며, 엔드포인트별 요청/응답 본문은 여전히 구현 단계(Phase 4)에서 OpenAPI로 확정한다.

본 문서가 확정하는 것은 **엔드포인트 본문 스키마가 아니라 모든 엔드포인트를 가로지르는 봉투·에러·페이징·헤더 규약**이다.

---

## 0. 한눈에 보기 — 확정 규약 요약

| # | 규약 | 확정값 | 근거(1줄) |
|---|------|--------|-----------|
| 1 | 응답 봉투 | 성공 `{ data, meta? }` / 에러 `{ error }` | `data`/`error` 상호배타 — TanStack Query·RHF가 분기 단순화(`docs/10 §1`) |
| 2 | 에러 코드 체계 | `DOMAIN.REASON` 점 표기 + HTTP status 동시 제공 | 클라가 status로 처리·code로 분기(2축 분리) |
| 3 | RLS 차단 표면화 | **소유 리소스 = 403 / 비소유(존재 은닉) = 404** | RLS는 0행 반환 → 존재 자체를 숨겨야 정보 누출 방지(`docs/13 §5`) |
| 4 | 검증 에러 | `422` + `error.fields[]` (필드별 `path`·`code`·`message`) | RHF `setError` 경로 직결(`docs/10 §1` RHF+Zod) |
| 5 | 페이지네이션 | **cursor 기본**(타임라인·기록·알림) / offset은 소규모 목록 한정 | 시간 역순 대용량 목록의 안정성·성능(`docs/12 §9 타임라인`) |
| 6 | idempotency | `Idempotency-Key` 헤더 — 권한부여·기록·인계·파일등록 등 **부수효과 POST** | 중복 권한부여·기록작성 방지(`docs/12 §1·5·9`) |
| 7 | Rate limit | 인증/공개 엔드포인트 IP 기준, 그 외 사용자 기준 — `429` + `Retry-After` | brute-force·남용 방어(`docs/12 §13 17.2.7`) |
| 8 | 버저닝 | URL prefix `/v1` | 봉투/에러 구조 변경 시 안전한 진화 경로 |
| 9 | 날짜·타임존 | 저장·전송 **UTC ISO 8601**, 표시 **KST** | `DATE`형(`record_date` 등)과 `TIMESTAMPTZ` 혼재 정합(`docs/02`) |
| 10 | 로깅 분리 | 사용자 노출 메시지 ↔ 서버 상세 로그 분리, PII·`emergency_info` 미노출 | 민감 의료/장애 정보 보호 일반 원칙 |

---

## 1. 표준 응답 봉투 (Response Envelope)

### 1.1 원칙

- 모든 응답은 **`data` 또는 `error` 중 정확히 하나**를 최상위 키로 갖는다(상호배타). 클라이언트는 `if ('error' in res)` 단일 분기로 처리한다.
- 목록·페이징 응답은 `meta`(페이지네이션·합계 등)를 동반한다.
- HTTP status code는 **항상** 봉투와 정합한다(2xx → `data`, 4xx/5xx → `error`).

> **확정 사유**: `docs/10 §1`의 TanStack Query는 throw 기반 에러 처리를, RHF+Zod는 필드 에러 매핑을 기대한다. `data`/`error` 상호배타 봉투는 양쪽 클라이언트의 분기를 단순화한다.

### 1.2 성공 봉투

```jsonc
// GET /v1/records/:id  (단건)
{
  "data": {
    "id": "a1b2c3d4-...",
    "person_id": "...",
    "domain": "medical",
    "record_type": "MED-008",
    "title": "2024년 1분기 검진",
    "created_at": "2026-06-14T01:23:45.000Z"
  }
}
```

```jsonc
// GET /v1/persons/:id/records  (목록 + 커서)
{
  "data": [ { "id": "...", "title": "..." } ],
  "meta": {
    "pagination": {
      "cursor": { "next": "eyJyZCI6IjIwMjQtMDMtMTUiLCJpZCI6Ii4uLiJ9", "prev": null },
      "limit": 20,
      "has_more": true
    }
  }
}
```

### 1.3 에러 봉투

```jsonc
{
  "error": {
    "code": "RECORD.NOT_FOUND",     // 도메인.사유 (안정 식별자)
    "message": "해당 기록을 찾을 수 없습니다.",  // 사용자 노출용(한국어)
    "status": 404,                   // HTTP status 미러링
    "request_id": "req_01HX...",     // 서버 로그 상관관계 추적용
    "fields": []                     // 검증 에러일 때만 채움 (§3)
  }
}
```

### 1.4 Supabase 응답과의 정합

Supabase JS 클라이언트(`postgrest-js`)는 `{ data, error }` 형태를 반환한다. 본 봉투는 이를 **얇게 래핑**한다.

- Next.js Route Handler / Server Action에서 Supabase `error`(PostgREST·RLS·제약 위반)를 본 카탈로그(§2)로 매핑한 뒤 봉투로 직렬화한다.
- PostgREST 원시 에러(`code`·`details`·`hint`)는 **클라이언트에 직접 노출하지 않고**(§8), 서버 로그에만 남긴다.
- 대표 매핑:

| Supabase / PostgREST 신호 | 본 카탈로그 매핑 | HTTP |
|---|---|---|
| RLS USING 0행 (SELECT) | `*.NOT_FOUND` 또는 `*.FORBIDDEN`(§2.3 정책) | 404 / 403 |
| RLS WITH CHECK 위반 (`42501`) | `AUTH.FORBIDDEN` 계열 | 403 |
| UNIQUE 위반 (`23505`) | `*.CONFLICT` | 409 |
| FK 위반 (`23503`) | `*.INVALID_REFERENCE` | 422 |
| CHECK 위반 (`23514`) | `*.VALIDATION_FAILED` | 422 |
| `PGRST116`(단건 0행) | `*.NOT_FOUND` | 404 |
| JWT 만료·부재 | `AUTH.UNAUTHORIZED` | 401 |

---

## 2. 에러 코드 카탈로그

### 2.1 코드 체계

- 형식: **`DOMAIN.REASON`** (대문자·점 구분). 예: `PERMISSION.NOT_PRIMARY_GUARDIAN`.
- `DOMAIN`은 `docs/12`의 리소스 그룹과 1:1 대응(`AUTH`·`USER`·`PERSON`·`MAPPING`·`PERMISSION`·`RECORD`·`SELF_EXPR`·`FILE`·`MILESTONE`·`TIMELINE`·`HANDOVER`·`NOTIFICATION`·`ACCESS_LOG`) + 공통 `COMMON`.
- `code`는 **불변 식별자**(i18n 키·클라 분기용), `message`는 사용자 노출 문구(변경 가능).

> **확정 사유**: HTTP status만으로는 같은 403/422 안의 원인을 구분할 수 없다. `code`(분기)와 `status`(처리 계층) 2축 분리로 프론트가 토스트/필드에러/리다이렉트를 정확히 선택한다.

### 2.2 HTTP 상태 코드 운용 표

| status | 의미 | 대표 `code` | 사용 위치(`docs/12`) |
|:---:|------|------|------|
| **400** | 요청 형식 오류(파싱 불가·잘못된 쿼리 파라미터) | `COMMON.BAD_REQUEST` | 전 엔드포인트 |
| **401** | 미인증(JWT 부재·만료·무효) | `AUTH.UNAUTHORIZED` | `인증` 외 모든 보호 엔드포인트 |
| **403** | 인증됨, 권한 부족(소유/관계는 있으나 작업 불가) | `AUTH.FORBIDDEN`·`PERMISSION.NOT_PRIMARY_GUARDIAN` | §5 권한, §6 기록 등 |
| **404** | 리소스 없음 **또는 비소유 리소스 은닉**(§2.3) | `RECORD.NOT_FOUND` | 단건 조회·하위 경로 |
| **409** | 상태/유니크 충돌 | `SELF_EXPR.ALREADY_EXISTS`·`MAPPING.DUPLICATE` | §4·§7 등 |
| **422** | 의미 검증 실패(Zod·CHECK·FK·비즈니스 규칙) | `COMMON.VALIDATION_FAILED` | 생성·수정 전반 |
| **429** | rate limit 초과 | `COMMON.RATE_LIMITED` | §1 인증, §6 검색 등 |
| **500** | 서버 내부 오류(원인 미노출) | `COMMON.INTERNAL_ERROR` | 전 엔드포인트 |
| **503** | 의존 서비스(Storage·Resend·FCM) 장애 | `COMMON.SERVICE_UNAVAILABLE` | 파일·알림 |

> 400 vs 422 경계: **구문 오류**(JSON 깨짐·타입 불일치·필수 파라미터 누락)는 400, **구문은 맞으나 값/관계가 규칙 위반**(enum 외 값·기간 역전·FK 부재)은 422. Zod 검증 실패는 §3에 따라 422로 통일한다.

### 2.3 RLS 차단 → 403 / 404 정책 (존재 은닉 결정)

`docs/13`의 RLS는 위반 시 **조용히 0행을 반환하거나 거부(`42501`)**한다(`docs/13 §5`). 이를 HTTP로 표면화할 때 다음 규칙으로 **확정**한다.

| 상황 | HTTP | code | 사유 |
|------|:---:|------|------|
| **비소유 리소스 단건 조회**(요청자가 보호자·본인·권한자 어디에도 해당 안 됨) | **404** | `*.NOT_FOUND` | 403을 주면 "그 ID의 리소스가 존재함"이 노출됨 → **존재 은닉**으로 정보 누출 차단 |
| **소유/관계는 있으나 작업 권한 부족**(예: 기록 읽기는 되나 삭제 불가, 보호자이나 주보호자 아님) | **403** | `AUTH.FORBIDDEN`·`PERMISSION.NOT_PRIMARY_GUARDIAN` | 리소스 존재·접근은 이미 정당하므로 은닉 불필요. 명확한 권한 안내가 UX에 유리 |
| **미인증 상태에서 보호 리소스 접근** | **401** | `AUTH.UNAUTHORIZED` | 로그인 유도 |

> **확정 사유**: OnDol 데이터는 장애·의료·법적 정보(민감 PII)이므로, "권한 없음(403)"이 곧 "이 사람의 기록이 존재한다"는 사실을 노출해선 안 된다. 따라서 **접근 자격 자체가 없으면 404로 은닉**, 자격은 있으나 특정 작업만 막힌 경우는 403으로 안내한다. 이 경계는 `docs/13 §3.1`의 SELECT 3조건(보호자/본인/권한자)을 통과 못하면 404, 통과했으나 `write/edit/admin` 미달이면 403으로 구현한다.

#### 도메인별 대표 에러 코드

```
AUTH.UNAUTHORIZED            401  토큰 없음/만료
AUTH.FORBIDDEN               403  인증됐으나 작업 권한 없음
AUTH.INVALID_CREDENTIALS     401  로그인 실패 (POST /v1/login)
AUTH.EMAIL_NOT_VERIFIED      403  미인증 계정 (POST /v1/login, docs/12 §1 2.5)
AUTH.INVITE_INVALID          404  초대 토큰 무효/만료 (POST /v1/invites/:token/accept)
AUTH.INVITE_ALREADY_USED     409  초대 토큰 재사용 (docs/12 §1 2.9)

PERSON.NOT_FOUND             404  당사자 없음 또는 비접근 (GET /v1/persons/:id)
PERSON.EMERGENCY_REAUTH_REQUIRED  403  응급정보 수정 시 추가 인증 필요 (docs/12 §3 3.2.5)

MAPPING.DUPLICATE            409  guardian_persons UNIQUE(guardian_id, person_id) 위반
MAPPING.PRIMARY_REQUIRED     409  주보호자는 1명 단일 제약 위반 (docs/12 §4 3.3.4)

PERMISSION.NOT_PRIMARY_GUARDIAN  403  주보호자만 부여/회수 가능 (docs/13 §3.3)
PERMISSION.DUPLICATE         409  UNIQUE(person_id, user_id, domain) 위반 → UPSERT 안내
PERMISSION.INVALID_PERIOD    422  valid_from > valid_until (docs/02 §6)
PERMISSION.ADMIN_NOT_DELEGABLE  422  access_level=admin은 위임 불가 (docs/02 §4, docs/13 부록 #7)

RECORD.NOT_FOUND             404  기록 없음 또는 비접근 (docs/13 §3.1 SELECT 3조건 미통과)
RECORD.FORBIDDEN_WRITE       403  write 미만 (docs/13 §3.1 INSERT)
RECORD.FORBIDDEN_EDIT        403  edit 미만·비작성자 (docs/13 §3.1 UPDATE)
RECORD.UNDELETABLE_TYPE      403  MED-004 등 삭제불가 record_type (docs/13 §3.1 TBD 후속)
RECORD.INVALID_CONTENT       422  content JSONB가 record_type 스키마 위반 (docs/02 §3)

SELF_EXPR.NOT_SELF           403  당사자 본인만 작성/수정 (docs/13 §3.2)
SELF_EXPR.ALREADY_EXISTS     409  UNIQUE(person_id, expression_date) — 하루 1건 (docs/02 §6)
SELF_EXPR.NOT_TODAY          403  작성 당일만 수정 가능 (docs/13 §3.2)

FILE.SENSITIVE_REAUTH_REQUIRED  403  is_sensitive 파일 추가 인증 (docs/12 §8 7.8)
FILE.PRESIGN_EXPIRED         410  presigned URL 만료

HANDOVER.ALREADY_CONFIRMED   409  확인된 인계는 수정 불가 (docs/12 §10 9.1.5)
HANDOVER.NOT_RECIPIENT       403  수신자만 확인 처리 (docs/12 §10 9.2.5)

NOTIFICATION.NOT_RECIPIENT   403  수신자 본인만 읽음/삭제 (docs/12 §11)

ACCESS_LOG.IMMUTABLE         403  UPDATE/DELETE 차단 (불변, docs/13 §4) — 정상 호출엔 노출 안 됨

COMMON.BAD_REQUEST           400  요청 파싱·파라미터 오류
COMMON.VALIDATION_FAILED     422  Zod/CHECK 검증 실패 (§3)
COMMON.RATE_LIMITED          429  rate limit 초과 (§6)
COMMON.IDEMPOTENCY_CONFLICT  409  Idempotency-Key 본문 불일치 재사용 (§5)
COMMON.INTERNAL_ERROR        500  서버 내부 오류
COMMON.SERVICE_UNAVAILABLE   503  의존 서비스 장애
```

---

## 3. 검증 에러 포맷 (Zod → RHF)

### 3.1 원칙

- 모든 검증 실패는 **`422` + `error.code = "COMMON.VALIDATION_FAILED"` + `error.fields[]`**.
- `fields[].path`는 RHF의 필드 경로와 동일 표기(점·대괄호). `code`는 Zod issue code를 따른다.
- 서버는 Zod 스키마(`shared/validation` 패키지, `docs/10 §1`)로 검증하고, `flatten()`을 본 포맷으로 변환한다. JSONB `content`(`docs/02 §3`) 검증 실패도 동일 포맷으로 내려보낸다.

> **확정 사유**: `docs/10 §1`이 RHF+Zod를 폼·검증 표준으로 못박았고, Zod 스키마를 `validation` 패키지로 프론트·백 공유한다. 서버 검증 에러의 `path`를 RHF 필드 경로와 일치시키면 `setError(path, { message })` 한 줄로 폼에 매핑된다.

### 3.2 포맷

```jsonc
// POST /v1/permissions  — 기간 역전 + enum 위반
{
  "error": {
    "code": "COMMON.VALIDATION_FAILED",
    "message": "입력값을 확인해 주세요.",
    "status": 422,
    "request_id": "req_01HX...",
    "fields": [
      {
        "path": "access_level",
        "code": "invalid_enum_value",
        "message": "접근 수준은 read·write·edit·admin 중 하나여야 합니다."
      },
      {
        "path": "valid_until",
        "code": "custom",
        "message": "종료일은 시작일 이후여야 합니다."  // docs/02 §6 valid_from <= valid_until
      }
    ]
  }
}
```

```jsonc
// POST /v1/records — JSONB content 중첩 경로 (docs/02 §3 MED-001)
{
  "error": {
    "code": "COMMON.VALIDATION_FAILED",
    "message": "입력값을 확인해 주세요.",
    "status": 422,
    "fields": [
      {
        "path": "content.diagnosis_date",
        "code": "invalid_string",
        "message": "진단 날짜는 YYYY-MM-DD 형식이어야 합니다."
      },
      {
        "path": "content.results[0].interpretation",
        "code": "too_small",
        "message": "결과 해석을 입력해 주세요."
      }
    ]
  }
}
```

### 3.3 프론트 연동 (참고)

```ts
// TanStack Query mutation onError → RHF setError
function applyFieldErrors(error: ApiError, setError: UseFormSetError<FormValues>) {
  if (error.code !== 'COMMON.VALIDATION_FAILED') return false;
  for (const f of error.fields) {
    setError(f.path as FieldPath<FormValues>, { type: f.code, message: f.message });
  }
  return true; // 폼에 매핑됨 → 전역 토스트 생략
}
```

---

## 4. 페이지네이션 규약

### 4.1 결정: cursor 기본 · offset 한정

| 방식 | 적용 대상 | 사유 |
|------|----------|------|
| **cursor (기본)** | `GET /v1/persons/:id/timeline`(§9)·`GET /v1/persons/:id/records`(5.0.3)·`GET /v1/notifications`(10.1.3)·`GET /v1/self-expressions`·`GET /v1/persons/:id/access-logs` | 시간 역순 대용량·잦은 신규 INSERT 목록에서 페이지 밀림(skew) 없고 인덱스(`idx_records_person_date` 등 `docs/02 §5`) 직접 활용 |
| **offset (한정)** | 보호자별 당사자 목록·받은/보낸 인계 목록 등 **소규모·총개수 필요** 목록 | 건수가 작고 "전체 N건/페이지 점프" UX가 필요한 경우만 |

> **확정 사유**: `docs/12 §9` 타임라인은 시간 역순(`created_at DESC`) 통합 목록이고 기록·알림은 계속 쌓인다. offset은 페이지 이동 중 새 행이 끼면 중복/누락이 발생하므로 cursor를 기본으로 확정한다. `docs/02 §5`의 복합 인덱스(`person_id, record_date DESC`)가 keyset 페이징에 그대로 맞는다.

### 4.2 cursor 파라미터·응답

- 요청: `?limit=20&cursor=<opaque>` (정렬 키는 엔드포인트 고정: 기록·타임라인=`record_date DESC, id DESC`).
- `cursor`는 **base64로 인코딩한 keyset**(`{ "rd": "2024-03-15", "id": "..." }`) — 클라는 불투명(opaque) 토큰으로 취급하고 파싱하지 않는다.
- `limit` 기본 **20**, 최대 **100**(초과 시 100으로 클램프, 400 아님).
- 응답 `meta.pagination`: `{ cursor: { next, prev }, limit, has_more }`. `next`가 `null`이면 마지막 페이지.

```http
GET /v1/persons/{id}/timeline?limit=20&domain=medical&from=2024-01-01&to=2024-12-31&cursor=eyJyZCI6...
```

### 4.3 offset 파라미터·응답 (한정)

- 요청: `?page=1&limit=20` (1-base).
- 응답 `meta.pagination`: `{ page, limit, total, total_pages }`.

### 4.4 정렬·필터 (docs/12 §13 정렬·필터 TBD 해소)

- 필터 파라미터는 `docs/12`에 명시된 것만 표준화: `?domain=`·`?category=`·`?life_stage=`·`?from=&to=`·`?milestones_only=true`·`?author=`·`?q=`.
- 다중 값은 콤마 구분(`?domain=medical,education`). 정렬은 엔드포인트별 고정(임의 `sort` 파라미터 미지원 — keyset 안정성 보장).

---

## 5. Idempotency (중복 방지)

### 5.1 결정: 부수효과 POST에 `Idempotency-Key` 헤더

- 클라이언트가 `Idempotency-Key: <UUID v4>` 헤더를 보내면, 서버는 **(키, 사용자, 경로)** 기준으로 24시간 결과를 캐시한다.
- 동일 키 재요청 시: 본문이 같으면 **최초 응답을 그대로 반환**(재실행 안 함), 본문이 다르면 **409 `COMMON.IDEMPOTENCY_CONFLICT`**.

### 5.2 적용 대상

| 적용 | 엔드포인트 | 사유 |
|:---:|------|------|
| **필수 권장** | `POST /v1/permissions`(4.1.1 권한부여) | 네트워크 재시도로 중복 권한·중복 `permission_logs`(트리거, `docs/13 §4`) 방지 |
| **필수 권장** | `POST /v1/records`(5.0.1 기록작성) | 더블탭/재전송으로 동일 기록 2건 생성 방지 |
| **필수 권장** | `POST /v1/handovers`(9.1.1 인계생성) | 인계 중복 발송·중복 알림 방지 |
| **권장** | `POST /v1/files`(7.2 메타등록)·`POST /v1/self-expressions`(6.1) | `self_expressions`는 `UNIQUE(person_id, expression_date)`(`docs/02 §6`)가 1차 방어, idempotency가 2차 |
| 불필요 | 멱등한 `GET`·`PATCH /:id`(전체 치환)·`DELETE /:id` | HTTP 의미상 이미 멱등 |

> **확정 사유**: OnDol에서 권한부여·기록작성·인계는 **부수효과가 큰 1회성 행위**(중복 시 권한 매트릭스·감사 로그 오염)다. `docs/12 §5·§9`의 해당 POST에 idempotency를 둬 재시도 안전성을 확보한다. `PATCH`는 부분 수정이라도 같은 페이로드면 결과가 같으므로 헤더 없이 멱등으로 본다.

---

## 6. Rate Limiting / 동시성

### 6.1 Rate Limiting (docs/12 §13 Rate Limiting TBD 해소)

`docs/12 §13`의 `17.2.7 Rate Limiting (API)`을 다음 방향으로 **확정**(임계값은 부하 테스트 후 §9 TBD에서 조정).

| 그룹 | 키 | 권장 임계값(초기) | 사유 |
|------|----|----|------|
| 인증/공개(`POST /v1/login`·`/signup`·`/reset-password`·`/invites/:token/accept`) | **IP + 이메일** | 분당 10회 / 시간당 30회 | credential brute-force·초대 토큰 추측 방어 |
| 검색·내보내기(`GET /v1/records?q=`·`POST /v1/records/export`·`POST /v1/timeline/export`) | **사용자** | 분당 20회 | 무거운 쿼리·PDF 생성 남용 방지 |
| 일반 인증 API | **사용자** | 분당 120회 | 정상 사용 보장 + 자동화 남용 차단 |
| 파일 presign(`POST /v1/files/presign`) | **사용자** | 분당 30회 | presigned URL 대량 발급 방지 |

- 초과 시 **429 `COMMON.RATE_LIMITED`** + `Retry-After`(초) 헤더 + `X-RateLimit-Remaining`·`X-RateLimit-Reset`.
- 구현은 Supabase Edge Function 또는 Next.js 미들웨어 레벨(분산 카운터는 P1 Redis, `docs/10 §3.2`).

### 6.2 동시성 (낙관적 잠금)

- 수정 충돌이 가능한 리소스(`records`·`persons`·`permissions`)는 **`updated_at` 기반 낙관적 동시성**을 권장한다.
- 클라가 `If-Unmodified-Since`(또는 본문 `expected_updated_at`)를 보내고, 서버 값과 다르면 **409 `*.CONFLICT`**(stale write) 반환.
- `self_expressions`·`guardian_persons`·`permissions`의 UNIQUE 제약(`docs/02 §6`)은 DB 레벨 동시성 방어로 작동하며 409로 표면화한다(§2.3).

> **확정 사유**: 공동보호자·전문가가 동일 기록을 동시 편집할 수 있어, last-write-wins로 인한 무음 덮어쓰기를 막는 낙관적 잠금이 필요하다. 비관적 락은 B2C 트래픽에 과하다.

---

## 7. 공통 헤더 · 버저닝 · 날짜/타임존

### 7.1 공통 헤더

| 헤더 | 방향 | 설명 |
|------|:---:|------|
| `Authorization: Bearer <JWT>` | 요청 | Supabase Auth JWT(`docs/12 §13` 인증 헤더 TBD 해소). 만료 시 401 → 클라가 refresh |
| `Content-Type: application/json` | 요청 | 파일 업로드는 presigned URL로 Storage에 직접(본 API 경유 아님, `docs/12 §8`) |
| `Idempotency-Key` | 요청 | §5 대상 POST |
| `If-Unmodified-Since` | 요청 | §6.2 낙관적 잠금(선택) |
| `X-Request-Id` | 요청/응답 | 없으면 서버 생성. `error.request_id`와 동일(§8 로그 상관관계) |
| `Retry-After`·`X-RateLimit-*` | 응답 | 429 동반(§6.1) |

### 7.2 버저닝

- **URL prefix `/v1`** 로 확정. 봉투(§1)·에러 카탈로그(§2) 등 **횡단 계약의 파괴적 변경** 시에만 `/v2`로 올린다.
- 엔드포인트 추가·필드 추가(하위호환)는 버전을 올리지 않는다.

> **확정 사유**: 헤더 기반 버저닝보다 URL prefix가 캐시·라우팅·디버깅에 명확하다. `docs/12`의 경로 앞에 `/v1`을 붙인 것이 정본이다.

### 7.3 날짜 · 타임존 (KST)

- **저장·전송**: `TIMESTAMPTZ`(`created_at`·`updated_at`·`confirmed_at` 등)는 **UTC ISO 8601**(`2026-06-14T01:23:45.000Z`)로 직렬화.
- **`DATE`형**(`record_date`·`birth_date`·`expression_date`·`valid_from/until`·`milestone_date`, `docs/02`)은 시각·타임존 없는 `YYYY-MM-DD` 문자열로 그대로 전송한다(타임존 변환 금지 — 날짜 밀림 방지).
- **표시·해석 기준 타임존**: **KST(UTC+9)**(`docs/02` 헤더). "오늘"·`expression_date = CURRENT_DATE`(자기표현 당일 수정, `docs/13 §3.2`)·`valid_from/until` 비교는 모두 **KST 자정 경계**로 판정한다. 서버는 KST 기준으로 `CURRENT_DATE`를 계산하도록 세션 타임존을 `Asia/Seoul`로 설정한다.

> **확정 사유**: `record_date` 등 순수 날짜를 UTC로 변환하면 KST 23시 입력이 전날로 밀린다. 시각 없는 날짜는 변환하지 않고, 시각 포함 값만 UTC↔KST 변환하는 이원 규칙으로 자기표현 "당일" 판정(`docs/13`)을 정확히 보장한다.

---

## 8. 에러 로깅 & 사용자 노출 분리

> 민감정보 미노출 원칙은 `docs/16-privacy-data-governance.md` §8(안전성 확보조치)·§6.2(Sentry PII 스크러빙)와 정합한다 — 본 절은 에러 응답·로깅 관점의 적용 규약이고, 데이터 거버넌스 정본은 docs/16이다.

### 8.1 원칙

- **사용자 노출(`error.message`)** 과 **서버 로그(상세)** 를 분리한다. `error.message`는 한국어 일반 문구만, 원인 진단은 `request_id`로 서버 로그에서 추적한다.
- **PII·민감 정보 미노출**: `persons.emergency_info`(알레르기·금기약물·진단명, `docs/02 §2.1`)·`disability_types`·진단 코드·전화·`registration_number`(WEL-001) 등은 **에러 메시지·로그 본문 어디에도 평문 적재 금지**.
- 500/503은 내부 원인(스택·SQL·PostgREST `details`)을 **절대 클라에 노출하지 않는다**. `COMMON.INTERNAL_ERROR` + `request_id`만 반환.

### 8.2 로깅 계층

| 항목 | 사용자 응답 | 서버 로그(Sentry, `docs/10 §6`) |
|------|------|------|
| `code`·`status`·`request_id` | 포함 | 포함 |
| 사용자 메시지 | 포함(일반 문구) | 포함 |
| 스택/SQL/PostgREST 원시 에러 | **제외** | 포함(단, PII 마스킹 후) |
| `auth.uid()`·`person_id` | 제외 | 포함(상관관계용 ID만, 내용 아님) |
| `emergency_info`·진단명·등록번호 등 본문 | 제외 | **제외/마스킹** |

- RLS 거부(`42501`)·권한 외 접근 시도는 `docs/13 §5`(4.4.1 감지 트리거)에 따라 `access_logs`에 ID·action만 기록하고, 본문 내용은 남기지 않는다.
- Sentry 전송 전 `beforeSend`에서 헤더(`Authorization`)·본문 민감 필드를 스크럽한다.

---

## 9. TBD 항목

| # | 항목 | 현재 상태 | 후속 |
|---|------|----------|------|
| 1 | Rate limit 구체 임계값 | §6.1 초기값 제시 | 부하 테스트(WBS 18.x) 후 확정, P1 Redis 분산 카운터(`docs/10 §3.2`) |
| 2 | JWT 만료·refresh 토큰 수명 | Bearer 형식만 확정(§7.1) | Supabase Auth 설정값(access/refresh TTL) 구현 시 확정 |
| 3 | Idempotency 키 저장소·TTL 정밀화 | 24h·(키,사용자,경로) 방향 확정(§5) | 저장소(DB 테이블 vs Redis)·키 충돌 정책 구현 시 |
| 4 | `record_type`별 DELETE 차단 매핑(MED-004 등) | `RECORD.UNDELETABLE_TYPE` 코드 예약 | `docs/13 §3.1 TBD`·부록 #3 RLS 분기 확정 후 연동 |
| 5 | 자기표현 전문가 SELECT 허용 시 에러 표면화 | 미정 | `docs/13 부록 #4` 권한 모델 확장과 함께 |
| 6 | 에러 메시지 i18n(영어) | 한국어 우선(`docs/10 §6` i18n P1) | `code`를 i18n 키로 사용해 차기 확장 |
| 7 | 응답 봉투 `meta` 확장 필드(집계·rate 정보 인라인) | `pagination`만 확정 | 통계 API(5.0.13 등) 구현 시 |

---

> 본 문서는 `docs/12-api-index.md §13`(인증 헤더·페이징·정렬/필터·에러 응답·Rate Limiting TBD)과 `docs/13-rls-policy.md 부록`(RLS 거부의 HTTP 표면화)을 **확정**한 횡단 규약이며, enum·제약은 `docs/02-data-specification.md`(§4·§6), 권한 거부 의미는 `docs/13-rls-policy.md`(§3·§4·§5), 클라이언트 기대 shape는 `docs/10-tech-stack.md`(§1 RHF+Zod·TanStack Query)에 근거한다. 엔드포인트별 요청/응답 본문 스키마는 여전히 구현 단계(Phase 4)에서 OpenAPI로 확정한다.
