# RLS 정책 상세 — OnDol 플랫폼

> 버전: v1.0 | 작성일: 2026-06-14

docs/03-erd.md §RLS 정책 요약을 **테이블 × 역할 × 작업(SELECT/INSERT/UPDATE/DELETE)** 매트릭스로 확장한 PostgreSQL(Supabase) 행 수준 보안(Row Level Security) 정책 명세서. 본 문서는 docs/02-data-specification.md(§2 테이블 13개·§4 Enum·§6 제약조건)와 docs/03-erd.md(§RLS 정책 요약)에 **정의된 규칙만** 기술하며, 미정의 항목은 🟡 **TBD**로 표기한다.

---

## 1. 전제 (Conventions)

- DB: PostgreSQL (Supabase) — `auth.uid()`는 현재 인증된 `users.id`(= `auth.users.id`)를 반환한다(docs/02 §2.2: `users.id = auth.users FK`).
- 모든 테이블은 `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` 적용을 전제로 한다.
- 본 문서에서 사용하는 **3가지 접근 주체 판별 헬퍼**(아래 의사 SQL은 정책 표현용이며 docs 정의 관계에 근거):

```sql
-- (1) 보호자 매핑: guardian_persons (UNIQUE(guardian_id, person_id))
is_guardian(p_person uuid) :=
  EXISTS (SELECT 1 FROM guardian_persons gp
          WHERE gp.person_id = p_person
            AND gp.guardian_id = auth.uid());

-- (2) 당사자 본인: person_accounts (person_id PK, user_id FK NULL 가능)
is_self(p_person uuid) :=
  EXISTS (SELECT 1 FROM person_accounts pa
          WHERE pa.person_id = p_person
            AND pa.user_id = auth.uid());

-- (3) 권한자: permissions (domain + access_level + 유효기간 + is_active)
has_permission(p_person uuid, p_domain text, p_min_level text) :=
  EXISTS (SELECT 1 FROM permissions pm
          WHERE pm.person_id = p_person
            AND pm.user_id   = auth.uid()
            AND pm.is_active  = true
            AND (pm.domain = p_domain OR pm.domain = 'all')
            AND (pm.valid_from  IS NULL OR pm.valid_from  <= CURRENT_DATE)
            AND (pm.valid_until IS NULL OR pm.valid_until >= CURRENT_DATE)
            AND access_level_gte(pm.access_level, p_min_level));
```

### Enum 기준값 (docs/02 §4)

| Enum | 값 |
|------|-----|
| `user_role` | `guardian` · `person` · `supporter` · `teacher` · `social_worker` · `therapist` |
| `domain_type` | `medical` · `education` · `welfare` · `daily` · `transition` · `legal` · `all` |
| `access_level` | `read` < `write` < `edit` < `admin` (순서 = 권한 강도) |

- **`access_level_gte(a, b)`**: 위 순서 기준 `a`가 `b` 이상이면 참. `read`=1, `write`=2, `edit`=3, `admin`=4.
  - `read`: 열람만 / `write`: 새 기록 작성 / `edit`: 기존 기록 수정 포함 / `admin`: 전체 관리 (docs/02 §4).
- **역할 매핑 주의**: docs/02 §4 `access_level`은 `read/write/edit/admin`이다. docs/08 WBS 4.1.1 본문의 `manage` 표현은 Enum 미정의 값이므로 본 문서는 `edit`/`admin`을 정본으로 사용한다 🟡(WBS 표기 불일치, 데이터 명세 §4 우선).

---

## 2. 정책 매트릭스 (13개 테이블)

✅=정책 정의됨 · ❌=거부(정책 없음→기본 거부) · 🟡=정책 미정(TBD)

| 테이블 | SELECT | INSERT | UPDATE | DELETE | 핵심 정책 (docs 근거) |
|--------|:---:|:---:|:---:|:---:|------|
| `records` | ✅ | ✅ | ✅ | ✅ | 보호자(매핑)·당사자 본인·권한자(domain+유효기간) 조회. 작성/수정은 `write`/`edit` 이상. 삭제는 보호자(docs/03 §RLS, docs/08 1.2.1·1.2.2·5.0.6) |
| `self_expressions` | ✅ | ✅ | ✅ | 🟡 | 당사자 본인만 INSERT/UPDATE(당일). SELECT는 보호자·권한자 포함(docs/03 §RLS, docs/08 1.2.3·6.4) |
| `permissions` | ✅ | ✅ | ✅ | ✅ | 주보호자만 부여/수정/회수. 권한자는 본인 권한 SELECT(docs/03 §RLS, docs/08 1.2.5·4.1.6) |
| `access_logs` | ✅ | ✅ | ❌ | ❌ | **INSERT-only**. UPDATE/DELETE 정책 없음→불변(docs/02 §6·§2.10, docs/03 §RLS) |
| `permission_logs` | ✅ | ✅ | ❌ | ❌ | **INSERT-only**(docs/02 §6 권한 이력 불변성) |
| `persons` | ✅ | 🟡 | 🟡 | 🟡 | 보호자·본인·권한자 SELECT(records 접근 주체와 동일 매핑). 쓰기 정책 docs 미정(docs/03 §RLS는 records 기준) |
| `users` | 🟡 | 🟡 | 🟡 | 🟡 | RLS 정책 docs 미정(TBD). 본인 프로필 한정 등은 docs/08 3.1.x API 레벨 |
| `guardian_persons` | 🟡 | 🟡 | 🟡 | 🟡 | 매핑 판별 소스이나 자체 RLS 규칙 docs 미정(TBD) |
| `person_accounts` | 🟡 | 🟡 | 🟡 | 🟡 | 본인 판별 소스이나 자체 RLS 규칙 docs 미정(TBD) |
| `record_files` | 🟡 | 🟡 | 🟡 | 🟡 | 상위 `records`/`self_expressions` 접근 상속 추정이나 docs 명시 없음(TBD). `is_sensitive` 추가 인증은 docs/08 7.8 API 레벨 |
| `life_milestones` | 🟡 | 🟡 | 🟡 | 🟡 | RLS 정책 docs 미정(TBD) |
| `handovers` | 🟡 | 🟡 | 🟡 | 🟡 | "미확인 상태에서만 수정"은 docs/08 9.1.5에 언급되나 RLS 구현 규칙 docs 미정(TBD) |
| `notifications` | 🟡 | 🟡 | 🟡 | 🟡 | RLS 정책 docs 미정(TBD). 수신자(recipient_id) 한정 등은 추정 |

> **표기 원칙**: docs/03 §RLS 정책 요약에 명시된 `records`/`self_expressions`/`access_logs`와 docs/08 1.2.x·11에서 RLS 산출물(🔐)로 지정된 `permissions`/`permission_logs`만 ✅로 확정한다. 나머지 8개 테이블은 RLS 정책 문장이 docs에 없으므로 TBD다.

---

## 3. 핵심 테이블 상세 정책

> 의사 SQL은 PostgreSQL RLS 문법(USING / WITH CHECK)을 따르되, 테이블·컬럼명은 docs/02와 일치한다. docs에 명시되지 않은 조건은 추가하지 않는다.

### 3.1 `records` — 이해관계자 기록

docs/03 §RLS 정책 요약(records 열람 3조건) + docs/08 1.2.1(SELECT)·1.2.2(INSERT/UPDATE)·5.0.6(DELETE) 근거.

**자연어 규칙**
- **SELECT**: 다음 중 하나면 열람 — ① 해당 당사자의 보호자(`guardian_persons` 매핑), ② 당사자 본인(`person_accounts`), ③ 해당 `domain` + 유효기간 내 `read` 이상 권한 보유자.
- **INSERT**: 해당 `domain`에 `write` 이상 권한, 또는 보호자. `author_id = auth.uid()` 강제.
- **UPDATE**: 해당 `domain`에 `edit` 이상 권한, 또는 작성자 본인, 또는 보호자(docs/08 5.0.5 "작성자/권한자").
- **DELETE**: 보호자 권한(docs/08 5.0.6).

```sql
-- SELECT
CREATE POLICY records_select ON records FOR SELECT USING (
     is_guardian(person_id)
  OR is_self(person_id)
  OR has_permission(person_id, domain, 'read')
);

-- INSERT (write 이상 또는 보호자)
CREATE POLICY records_insert ON records FOR INSERT WITH CHECK (
  author_id = auth.uid()
  AND ( is_guardian(person_id)
        OR has_permission(person_id, domain, 'write') )
);

-- UPDATE (edit 이상 / 작성자 / 보호자)
CREATE POLICY records_update ON records FOR UPDATE
USING (
     is_guardian(person_id)
  OR author_id = auth.uid()
  OR has_permission(person_id, domain, 'edit')
)
WITH CHECK (
     is_guardian(person_id)
  OR author_id = auth.uid()
  OR has_permission(person_id, domain, 'edit')
);

-- DELETE (보호자)
CREATE POLICY records_delete ON records FOR DELETE USING (
  is_guardian(person_id)
);
```

> 🟡 TBD: MED-004(응급)·EDU-009(졸업)·WEL-001(장애등록) 등 docs/08 5.x의 "삭제불가(—)" 기록 유형은 **행 단위 DELETE 차단** 의도이나, `record_type`별 RLS 분기 규칙은 docs에 구체화되지 않음. 현재는 `is_draft`/`is_milestone` 등 컬럼 기반 정책만 명시 가능.

---

### 3.2 `self_expressions` — 당사자 자기표현

docs/03 §RLS("당사자만 작성") + docs/08 1.2.3("본인 계정만 작성/수정, 당일")·6.4("작성 당일만 허용") 근거. 제약 `UNIQUE(person_id, expression_date)`(docs/02 §6).

**자연어 규칙**
- **INSERT**: 당사자 본인 계정만 작성.
- **UPDATE**: 본인 계정 + **작성 당일(`expression_date = CURRENT_DATE`)만** 수정 가능.
- **SELECT**: 본인 + 보호자 + 권한자(자기표현은 별도 도메인이 없으므로 보호자·본인 우선; 권한자 범위는 아래 TBD).
- **DELETE**: 🟡 docs에 정책 없음 → 기본 거부.

```sql
-- INSERT (본인만)
CREATE POLICY self_expr_insert ON self_expressions FOR INSERT WITH CHECK (
  is_self(person_id)
);

-- UPDATE (본인 + 당일만)
CREATE POLICY self_expr_update ON self_expressions FOR UPDATE
USING ( is_self(person_id) AND expression_date = CURRENT_DATE )
WITH CHECK ( is_self(person_id) AND expression_date = CURRENT_DATE );

-- SELECT (본인 + 보호자)
CREATE POLICY self_expr_select ON self_expressions FOR SELECT USING (
     is_self(person_id)
  OR is_guardian(person_id)
);
```

> 🟡 TBD: 자기표현을 **권한자(전문가)가 열람**할 수 있는지는 docs에 도메인 매핑이 없다. docs/08 6.7(보호자 요약 알림)은 보호자 가시성을 시사하나, 전문가 SELECT 허용 여부는 미정.

---

### 3.3 `permissions` — 권한 매트릭스

docs/03 §RLS(permissions가 records/self_expressions 접근을 자동 제어) + docs/08 1.2.5("주보호자만 권한 부여/회수")·4.1.6(즉시 회수) 근거. 제약 `UNIQUE(person_id, user_id, domain)`, `valid_from <= valid_until`(docs/02 §6).

**자연어 규칙**
- **INSERT/UPDATE/DELETE**: **주보호자(`guardian_persons.is_primary = true`)만** 권한 부여·수정·회수.
- **SELECT**: 주보호자(매트릭스 관리) + 권한 대상자 본인(`user_id = auth.uid()`, 받은 권한 확인).

```sql
-- helper: 주보호자
is_primary_guardian(p_person uuid) :=
  EXISTS (SELECT 1 FROM guardian_persons gp
          WHERE gp.person_id = p_person
            AND gp.guardian_id = auth.uid()
            AND gp.is_primary = true);

-- SELECT
CREATE POLICY permissions_select ON permissions FOR SELECT USING (
     is_primary_guardian(person_id)
  OR user_id = auth.uid()
);

-- INSERT
CREATE POLICY permissions_insert ON permissions FOR INSERT WITH CHECK (
  is_primary_guardian(person_id)
  AND granted_by = auth.uid()
);

-- UPDATE / DELETE (주보호자만)
CREATE POLICY permissions_update ON permissions FOR UPDATE
  USING ( is_primary_guardian(person_id) )
  WITH CHECK ( is_primary_guardian(person_id) );

CREATE POLICY permissions_delete ON permissions FOR DELETE
  USING ( is_primary_guardian(person_id) );
```

> 참고: docs/08 4.3.1 트리거가 `permissions` 변경 시 `permission_logs`를 자동 기록한다(아래 §4).

---

### 3.4 `access_logs` — 접근 로그 (불변)

docs/02 §2.10·§6 + docs/03 §RLS("INSERT만 허용, UPDATE/DELETE 정책 없음 → 자동 거부") + docs/08 1.2.4·11(자동 로깅)·17.2.8(immutability) 근거.

**자연어 규칙**
- **INSERT**: 자기 행위 로그 기록. `user_id = auth.uid()` 강제(트리거/서버에서 기록).
- **SELECT**: 보호자 투명성(docs/08 11.4 "당사자별 접근 로그 조회 — 보호자 투명성"). 권한자 본인 로그 조회는 TBD.
- **UPDATE / DELETE**: **정책 미생성 → RLS 기본 거부**(불변성 보장). 정책을 만들지 않는 것이 곧 차단이다.

```sql
-- INSERT only
CREATE POLICY access_logs_insert ON access_logs FOR INSERT WITH CHECK (
  user_id = auth.uid()
);

-- SELECT (보호자)
CREATE POLICY access_logs_select ON access_logs FOR SELECT USING (
  is_guardian(person_id)
);

-- UPDATE / DELETE: 정책 없음 → 모든 사용자 거부 (불변)
-- (정책을 정의하지 않음으로써 RLS가 자동으로 거부)
```

> 🟡 TBD: 권한자(전문가) 본인이 자신의 접근 로그를 조회할 수 있는지(`user_id = auth.uid()` SELECT 허용)는 docs 미정.

---

## 4. 불변성 보장 (Append-only 로그)

docs/02 §6 제약조건 요약에 따라 **두 로그 테이블은 INSERT 전용**이며 UPDATE/DELETE를 차단한다.

| 테이블 | INSERT | UPDATE | DELETE | 근거 |
|--------|:---:|:---:|:---:|------|
| `access_logs` | ✅ | ❌ | ❌ | docs/02 §6 "INSERT 전용 (UPDATE/DELETE 불가) — 감사 로그 불변성", docs/03 §RLS |
| `permission_logs` | ✅ | ❌ | ❌ | docs/02 §6 "INSERT 전용 — 권한 이력 불변성" |

**구현 원칙**
- RLS에서 `UPDATE`/`DELETE` 정책을 **정의하지 않으면** 해당 작업은 모든 역할에 대해 자동 거부된다(PostgreSQL RLS 기본 동작). 이것이 docs/03 §RLS가 말하는 "정책 없음 → 자동 거부"다.
- `permission_logs`는 docs/08 4.3.1 트리거(`permissions` 변경 시 자동 기록)로만 채워진다. `permission_id`는 권한 삭제 후 NULL 허용(docs/02 §2.6)이므로, 권한 행이 회수·삭제되어도 이력 행은 남는다.

```sql
ALTER TABLE access_logs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY permission_logs_insert ON permission_logs FOR INSERT WITH CHECK (true);
CREATE POLICY permission_logs_select ON permission_logs FOR SELECT USING (
  is_guardian(person_id)          -- docs/08 4.3.2 당사자별 이력
  OR user_id = auth.uid()         -- docs/08 4.3.3 본인 권한 변동 이력
);
-- UPDATE / DELETE 정책 미생성 → 불변
```

> 추가 방어층(docs/08 17.2.8): DB 레벨 append-only는 RLS 외에 `REVOKE UPDATE, DELETE`(권한 회수) 또는 BEFORE UPDATE/DELETE 트리거로 이중화할 수 있다. 구체 구현 방식은 docs 미지정 🟡.

---

## 5. 권한 외 접근 감지 연계 (docs/08 §4.4)

RLS는 **거부**를 담당하고, 거부 시도의 **로깅·알림**은 docs/08 4.4가 담당한다.

| WBS ID | 작업 | RLS와의 관계 |
|--------|------|------------|
| 4.4.1 | 권한 외 접근 시도 감지 트리거(RLS 위반 로깅) | RLS 거부 이벤트를 `access_logs`에 별도 기록(docs/08 11.3) |
| 4.4.2 | 이상 접근 감지 시 보호자 알림 | 감지 → `notifications` 발송 |
| 4.4.3 | 권한 캐시 무효화(Redis, P1) | `permissions` 변경 시 캐시 동기화 |

> RLS 자체는 위반을 조용히 0행 반환/거부하므로, 위반 "감지·기록"은 애플리케이션·트리거 레벨에서 수행된다(docs/03 §RLS는 거부까지만 정의).

---

## 6. 검증 — pgTAP 자동 검증 (docs/08 18.1.4)

WBS **18.1.4 "RLS 정책 자동 검증 (pgTAP)"**(공수 L, P0, 담당 PM)와 직접 연결된다. 본 문서의 §2 매트릭스 각 ✅ 셀이 pgTAP 테스트 케이스의 명세가 된다.

**검증 대상 케이스(✅ 확정 정책만)**

```sql
-- pgTAP 예시: records SELECT 3조건
BEGIN;
SELECT plan(8);

-- (1) 보호자는 담당 당사자 기록을 본다
SET LOCAL ROLE authenticated;  -- auth.uid() = 보호자
SELECT isnt_empty($$ SELECT id FROM records WHERE person_id = :person $$,
                 'guardian can read records');

-- (2) 권한 없는 전문가는 0행
SELECT is_empty($$ SELECT id FROM records WHERE person_id = :other_person $$,
               'unauthorized user reads nothing');

-- (3) self_expressions: 본인만 INSERT
SELECT throws_ok($$ INSERT INTO self_expressions(person_id, expression_date)
                    VALUES (:person, CURRENT_DATE) $$,  -- 비본인 컨텍스트
                 '42501', NULL, 'non-self cannot insert self_expression');

-- (4) access_logs UPDATE 차단 (불변성)
SELECT throws_ok($$ UPDATE access_logs SET action='view' WHERE id = :log $$,
                 '42501', NULL, 'access_logs is immutable (UPDATE blocked)');

-- (5) access_logs DELETE 차단
SELECT throws_ok($$ DELETE FROM access_logs WHERE id = :log $$,
                 '42501', NULL, 'access_logs is immutable (DELETE blocked)');

-- (6) permissions: 주보호자만 INSERT
-- (7) permissions: 권한 대상자 본인 SELECT 가능
-- (8) self_expressions: 당일 외 UPDATE 거부

SELECT * FROM finish();
ROLLBACK;
```

**검증 매트릭스 요약**

| 검증 항목 | 기대 결과 | 근거 |
|---------|---------|------|
| records SELECT: 보호자/본인/권한자 | 허용 | §3.1 |
| records SELECT: 무권한자 | 0행 | §3.1 |
| records INSERT: write 미만 | 거부 | §3.1 |
| self_expressions INSERT: 비본인 | 거부 | §3.2 |
| self_expressions UPDATE: 당일 외 | 거부 | §3.2 |
| permissions 변경: 비주보호자 | 거부 | §3.3 |
| access_logs UPDATE/DELETE | 거부(불변) | §4 |
| permission_logs UPDATE/DELETE | 거부(불변) | §4 |

> 🟡 TBD 8개 테이블(§2 매트릭스의 TBD 행)은 정책 정의 후 pgTAP 케이스를 추가한다. 정책 미정 상태에서는 "RLS enabled & 정책 0개 → 전체 거부"가 기본값임을 명시 테스트로 둘 수 있다.

---

## 부록. TBD 항목 정리 (정책 미정 — docs 미정의)

| # | 항목 | 사유 | 후속 |
|---|------|------|------|
| 1 | `users`·`guardian_persons`·`person_accounts`·`record_files`·`life_milestones`·`handovers`·`notifications` RLS | docs/03 §RLS에 정책 문장 없음 | 설계 보강 후 §2/§3 확장 |
| 2 | `persons` 쓰기(INSERT/UPDATE/DELETE) RLS | docs §RLS는 records 기준만 | 응급정보 추가 인증(docs/08 17.2.5)과 연계 설계 |
| 3 | `record_type`별 DELETE 차단(MED-004 등 "삭제불가") | 컬럼 기반 분기 규칙 미명시 | 5.x "—" 표기를 RLS 조건으로 구체화 |
| 4 | self_expressions 전문가 SELECT 허용 여부 | 자기표현 도메인 매핑 부재 | 권한 모델 확장 검토 |
| 5 | access_logs/permission_logs 권한자 본인 SELECT | docs 미정 | 11.x 조회 API 설계와 정합 |
| 6 | handovers "미확인 상태에서만 수정"(9.1.5) RLS화 | API 레벨 언급, RLS 규칙 미정 | `is_confirmed=false` USING 조건 후보 |
| 7 | `access_level` 'manage'(WBS) vs 'edit/admin'(§4) | ✅ 해결 (2026-06-14) | WBS 4.1.1 `manage`→`read/write/edit` 수정. `admin`은 주보호자 전용·위임 불가로 확정(docs/02 §4·docs/06 Flow-3). 위자드 3단계 노출 |

---

> 본 문서는 docs/02-data-specification.md(§2·§4·§6), docs/03-erd.md(§RLS 정책 요약), docs/08-wbs.md(Phase 1.2·4.4·11·18.1.4)에 **정의된 정책만** 기술했으며, 미정의 항목은 모두 🟡 TBD로 명시했다. RLS 정책 확정 시 본 문서와 pgTAP(18.1.4)를 함께 갱신한다.
