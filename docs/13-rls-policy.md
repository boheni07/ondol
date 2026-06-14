# RLS 정책 상세 — OnDol 플랫폼

> 버전: v1.1 | 작성일: 2026-06-14 (개정: 2026-06-14)
>
> **v1.1 변경(docs/02 v1.1 데이터모델 정합):** ①테이블 13→15(`secure_identifiers`·`consents` 추가) ②`secure_identifiers` 정책 행·**복호화 통제 정책 절 §3.5** 신설(docs/02 §2.14 약속 이행, docs/16 §3.2 연계) ③`consents` 정책 행 추가 ④soft-delete 가시성(§4.2) 대상 목록에 신규 2테이블 반영 ⑤신규 enum 2종(`secure_identifier_type`·`consent_type`)은 RLS 판별과 무관함을 명시.

docs/03-erd.md §RLS 정책 요약을 **테이블 × 역할 × 작업(SELECT/INSERT/UPDATE/DELETE)** 매트릭스로 확장한 PostgreSQL(Supabase) 행 수준 보안(Row Level Security) 정책 명세서. 본 문서는 docs/02-data-specification.md(§2 테이블 15개·§4 Enum·§6 제약조건)와 docs/03-erd.md(§RLS 정책 요약)에 **정의된 규칙만** 기술하며, 미정의 항목은 🟡 **TBD**로 표기한다.

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
- **`secure_identifier_type`·`consent_type`(docs/02 §4 신규 2종) — RLS 무관**: 두 enum은 각각 `secure_identifiers.identifier_type`·`consents.consent_type`의 분류값일 뿐 접근 주체 판별(보호자/본인/권한자)에 사용되지 않으므로, 위 헬퍼·정책 판별식에 등장하지 않는다(불필요한 확장 금지).

---

## 2. 정책 매트릭스 (15개 테이블)

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
| `secure_identifiers` | ✅ | ✅ | ✅ | ✅ | 보호자(매핑)·권한자·당사자 본인 SELECT(records 접근 주체와 동일 매핑, `value_masked`만 노출). INSERT/UPDATE는 `write` 이상 권한 또는 보호자. DELETE는 soft-delete(보호자)·물리삭제는 `service_role`. **원문 복호화는 별도 통제(§3.5)**(docs/02 §2.14·docs/16 §3.2) |
| `consents` | ✅ | ✅ | ✅ | 🟡 | SELECT: 동의 주체 본인(`subject_user_id`/`consented_by`)·대리인(법정대리인)·주보호자. INSERT: 가입·정보 등록 시 본인 또는 법정대리인. UPDATE: 철회 표시(`revoked_at`/`granted=false` 신규 행 지향). 물리 DELETE는 이력 보존 위해 비지향(append 지향, soft-delete만)(docs/02 §2.15·docs/16 §2) |

> **표기 원칙**: docs/03 §RLS 정책 요약에 명시된 `records`/`self_expressions`/`access_logs`와 docs/08 1.2.x·11에서 RLS 산출물(🔐)로 지정된 `permissions`/`permission_logs`, 그리고 docs/02 §2.14가 "docs/13에서 별도 정책"을 약속한 `secure_identifiers`(본 문서 §3.5)와 docs/02 §2.15 동의 모델 근거의 `consents`만 ✅로 확정한다. `secure_identifiers`·`consents`의 ✅ 셀은 docs/02·docs/16에 근거 있는 범위에 한하며, 미명시 세부(예: `consents` 물리 DELETE 정책)는 🟡 TBD다. 나머지 8개 테이블(`persons`·`users`·`guardian_persons`·`person_accounts`·`record_files`·`life_milestones`·`handovers`·`notifications`)은 RLS 정책 문장이 docs에 없으므로 TBD다.

> **Soft-delete 가시성(§4.2 연계)**: `deleted_at` 컬럼을 갖는 사용자 대면 테이블(`records`·`self_expressions`·`record_files`·`persons`·매핑(`guardian_persons`·`person_accounts`)·`secure_identifiers`·`consents`)의 위 ✅ SELECT 셀은 `deleted_at IS NULL` 조건이 AND로 결합된 것으로 읽는다(파기 표시 행은 권한자에게도 미노출). append-only 로그(`access_logs`/`permission_logs`)는 `deleted_at`을 두지 않고 §4.1 시스템 파기로 처리한다.

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
-- SELECT (파기 행 제외: deleted_at IS NULL — §4.2)
CREATE POLICY records_select ON records FOR SELECT USING (
  deleted_at IS NULL
  AND ( is_guardian(person_id)
        OR is_self(person_id)
        OR has_permission(person_id, domain, 'read') )
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
- **SELECT**: 본인 + 보호자 + 권한자(자기표현은 별도 도메인이 없으므로 보호자·본인 우선; 권한자 범위는 아래 TBD). **파기 행 제외**(`deleted_at IS NULL` — §4.2).
- **DELETE**: 🟡 docs에 물리 삭제 정책 없음 → 기본 거부. 사용자 "삭제"는 `deleted_at` 세팅 UPDATE(soft-delete, §4.2)로 처리, 물리 삭제는 `service_role` 배치.

```sql
-- INSERT (본인만)
CREATE POLICY self_expr_insert ON self_expressions FOR INSERT WITH CHECK (
  is_self(person_id)
);

-- UPDATE (본인 + 당일만)
CREATE POLICY self_expr_update ON self_expressions FOR UPDATE
USING ( is_self(person_id) AND expression_date = CURRENT_DATE )
WITH CHECK ( is_self(person_id) AND expression_date = CURRENT_DATE );

-- SELECT (본인 + 보호자, 파기 행 제외 — §4.2)
CREATE POLICY self_expr_select ON self_expressions FOR SELECT USING (
  deleted_at IS NULL
  AND ( is_self(person_id)
        OR is_guardian(person_id) )
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
- **UPDATE / DELETE**: **사용자 경로 정책 미생성 → RLS 기본 거부**(사용자 변조 불변). 정책을 만들지 않는 것이 곧 차단이다. 단, **보유기간 경과분의 법정 파기**는 `service_role`(RLS 우회) 배치로만 수행한다(§4.1) — 사용자 경로로는 절대 삭제 불가.

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

### 3.5 `secure_identifiers` — 고유식별정보 복호화 통제 (PIPA §24)

docs/02 §2.14는 고유식별정보(WEL-001 장애인 등록번호·LEG-001 증명서 문서번호)를 `records.content` 평문에서 분리해 본 테이블에 **암호화 저장**(`encrypted_value` BYTEA)하고, **"접근 통제·복호화는 docs/13에서 별도 정책으로 통제"** 라고 약속했다. 본 절이 그 약속을 이행한다(docs/16 §3.2 / PIPA §24③·시행령 §21 연계).

**핵심 구분 — 행 접근(RLS) vs 원문 복호화(애플리케이션 레이어)**
- **행 접근(RLS)**: 본 테이블의 SELECT/INSERT/UPDATE/DELETE는 `records`와 **동일한 접근 주체 매핑**(보호자·당사자 본인·해당 도메인 권한자)으로 통제한다. 단, **RLS가 반환하는 것은 `value_masked`(표시용 마스킹 값)와 메타데이터까지**이며, 일반 SELECT로 `encrypted_value` 원문이 복호화되어 노출되지 않는다.
- **원문 복호화**: `encrypted_value`의 복호화는 **권한자·보호자 한정**이며, 복호화 키 접근은 RLS 행 정책이 아니라 **`service_role`/애플리케이션 레이어(Edge Function)에서 권한 재검증 후** 수행한다(docs/02 §2.14 "원문 복호화는 권한 재검증을 거친 서버에서만"). 복호화 도구·키 관리(Supabase Vault vs pgcrypto+KMS)는 docs/16 §9 #2로 법무·인프라 확정 🟡.

**자연어 규칙**
- **SELECT(마스킹)**: 보호자(`guardian_persons`)·당사자 본인(`person_accounts`)·해당 `domain`(welfare/legal) `read` 이상 권한자. 화면·목록 출력은 `value_masked`만 사용한다.
- **INSERT**: `write` 이상 권한자 또는 보호자. `created_by = auth.uid()` 강제.
- **UPDATE**: `edit` 이상 권한자 또는 보호자.
- **DELETE**: soft-delete(`deleted_at` 세팅)는 보호자, 물리 삭제는 `service_role` 배치(§4.2와 동일 원칙).
- **원문 복호화(복호화 함수 EXECUTE)**: 보호자·권한자 한정. 일반 `authenticated`에는 복호화 함수 EXECUTE를 부여하지 않으며, 키 참조(`encryption_ref`)는 `service_role`만 접근한다.

```sql
-- SELECT (records와 동일 주체 매핑, 파기 행 제외 — §4.2. 원문이 아닌 value_masked 노출)
-- 도메인 매핑: secure_identifier_type → domain
--   disability_registration_number → 'welfare', disability_certificate_number → 'legal'
CREATE POLICY secure_ident_select ON secure_identifiers FOR SELECT USING (
  deleted_at IS NULL
  AND ( is_guardian(person_id)
        OR is_self(person_id)
        OR has_permission(person_id, secure_identifier_domain(identifier_type), 'read') )
);

-- INSERT (write 이상 또는 보호자, 입력자 강제)
CREATE POLICY secure_ident_insert ON secure_identifiers FOR INSERT WITH CHECK (
  created_by = auth.uid()
  AND ( is_guardian(person_id)
        OR has_permission(person_id, secure_identifier_domain(identifier_type), 'write') )
);

-- UPDATE (edit 이상 또는 보호자)
CREATE POLICY secure_ident_update ON secure_identifiers FOR UPDATE
USING (
     is_guardian(person_id)
  OR has_permission(person_id, secure_identifier_domain(identifier_type), 'edit')
)
WITH CHECK (
     is_guardian(person_id)
  OR has_permission(person_id, secure_identifier_domain(identifier_type), 'edit')
);

-- DELETE (soft-delete는 보호자 UPDATE로, 물리 삭제는 service_role — §4.2)
CREATE POLICY secure_ident_delete ON secure_identifiers FOR DELETE USING (
  is_guardian(person_id)
);

-- 원문 복호화 함수: 권한 재검증 후 service_role/애플리케이션 레이어에서만 실행
-- ⚠️ 일반 authenticated 역할에는 EXECUTE를 부여하지 않는다(키 접근 분리).
-- CREATE FUNCTION decrypt_secure_identifier(p_id uuid) RETURNS text
--   LANGUAGE plpgsql SECURITY DEFINER ...  -- 내부에서 보호자/권한자 재검증 후 복호화
-- REVOKE ALL ON FUNCTION decrypt_secure_identifier(uuid) FROM PUBLIC, authenticated;
```

> 🟡 TBD: ①`secure_identifier_domain(identifier_type)` 매핑 헬퍼는 본 문서 정책 표현용이며, `identifier_type`→`domain` 매핑(welfare/legal)을 DB 함수/CASE로 구현한다(docs/02 §2.14 식별정보 유형 기준). ②복호화 도구·키 관리(Vault/pgcrypto+KMS)·복호화 함수 본체는 docs/16 §9 #2 법무·인프라 확정 후 docs/15 §6(Step 7)에 등록한다. ③복호화 행위 자체의 `access_logs` 기록(action=`download`/별도 코드) 여부는 docs/08 11.x와 정합 후 확정.

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

### 4.1 사용자 불변 ↔ 시스템 파기 분리 (PIPA 보유기간 정합)

docs/16 §4.3은 **불변성(append-only) ↔ PIPA §21 파기 의무**의 충돌을 식별하고, "사용자에 대한 불변 ↔ 법정 보유기간 후 시스템 파기"의 **2계층 분리**를 해소 방향으로 제시했다. 본 절은 그 방향을 RLS 정책으로 확정한다.

| 주체 | 경로 | `access_logs` / `permission_logs` UPDATE·DELETE | 근거 |
|------|------|:---:|------|
| `authenticated`(보호자·본인·권한자 등 일반 역할) | 사용자 API | **차단**(정책 미생성 → RLS 자동 거부) | docs/16 §4.3 "불변성=사용자 변조 방지" |
| `service_role`(시스템 배치) | 파기 배치 잡 | **허용**(RLS 우회) — 보유기간 경과분만 | docs/16 §4.3 "파기=시스템 배치", PIPA §21 |

**핵심 원칙**
- **사용자 경로로는 절대 삭제 불가**: 일반 역할에 대한 UPDATE/DELETE 정책을 **만들지 않는다**. §4의 불변성 서술은 *사용자 변조에 대한 불변*을 의미하며, 본 절의 시스템 파기와 모순되지 않는다(두 계층은 주체·경로가 다르다).
- **시스템 파기는 RLS 우회 경로로만**: Supabase `service_role`은 RLS를 우회하므로(`BYPASSRLS`), 정책을 추가하지 않고도 보유기간 경과분을 DELETE할 수 있다. 즉 **불변 RLS를 유지한 채** 법정 파기를 수행한다. 이를 위해 사용자 정의 DB 함수에 `SECURITY DEFINER`를 부여하거나, 배치 잡을 `service_role` 키로 실행한다.
- **파기 대상 한정**: 파기 배치는 `created_at < (now() - 보유기간)` 조건을 만족하는 행만 삭제한다. 보유기간 수치는 docs/16 §4.1 기준이며 법무 확정 전까지 🟡 TBD(아래).

```sql
-- 보유기간 경과 로그 파기 함수 (service_role 또는 SECURITY DEFINER 전용)
-- ⚠️ 일반 역할에는 EXECUTE 권한을 부여하지 않는다.
CREATE OR REPLACE FUNCTION purge_expired_audit_logs(p_retention interval)
RETURNS void
LANGUAGE sql
SECURITY DEFINER          -- 함수 소유자 권한으로 실행(RLS 불변 정책 우회)
SET search_path = public
AS $$
  DELETE FROM access_logs     WHERE created_at < (now() - p_retention);
  DELETE FROM permission_logs WHERE created_at < (now() - p_retention);
$$;

REVOKE ALL ON FUNCTION purge_expired_audit_logs(interval) FROM PUBLIC, authenticated;
-- service_role(또는 운영 배치 롤)에만 EXECUTE 부여
-- GRANT EXECUTE ON FUNCTION purge_expired_audit_logs(interval) TO service_role;

-- 정기 실행 (예: Supabase pg_cron). p_retention 값은 docs/16 §4.1 확정 후 주입.
-- SELECT cron.schedule('purge-audit-logs', '0 3 * * *',
--   $$ SELECT purge_expired_audit_logs('🟡 TBD interval'); $$);
```

> 🟡 TBD(법무 확정 잔여): `p_retention` 실제 보유기간 수치(접속기록·권한이력 각각)는 docs/16 §4.1·§9 #1과 정합되어야 하며 법무 확정 전 단정하지 않는다. **RLS 정책 구조(사용자 불변 / service_role 파기)는 본 절로 확정**한다.
>
> 마이그레이션 배치 위치: 파기 함수·`pg_cron` 스케줄은 docs/15 §6(Step 7 트리거/함수) 등록 시점에 함께 생성한다(불변 RLS는 Step 8에서 활성화되므로 함수가 의존하는 테이블은 이미 존재). docs/15 §8.2(INSERT-only 주의)에 파기 경로가 `service_role` 전용임을 명시한다.

### 4.2 Soft-delete 행의 RLS 가시성 (사용자 대면 테이블)

§4.1이 **append-only 로그**의 파기를 다룬다면, 본 절은 **사용자 대면 테이블**의 논리 삭제(soft-delete) 행을 RLS에서 어떻게 가리는지 확정한다. architect-developer가 docs/02에서 아래 테이블에 `deleted_at timestamptz NULL` 컬럼을 추가한다(파기 표시 = 논리 삭제). append-only 로그(`access_logs`/`permission_logs`)에는 추가하지 않으며 그쪽은 §4.1로 처리한다.

| 테이블 | `deleted_at` | SELECT 정책 보정 | 비고 |
|--------|:---:|------|------|
| `records` | ✅ | `deleted_at IS NULL` AND (§3.1 조건) | 본 문서 §3.1에 반영 |
| `self_expressions` | ✅ | `deleted_at IS NULL` AND (§3.2 조건) | 본 문서 §3.2에 반영 |
| `record_files` | ✅ | 상위(`records`/`self_expressions`) 접근 상속 + `deleted_at IS NULL` | 정책 구체화는 부록 TBD #1 |
| `persons` | ✅ | `deleted_at IS NULL` AND (보호자·본인·권한자) | SELECT 정책 구체화는 부록 TBD #1 |
| 매핑(`guardian_persons`·`person_accounts`) | ✅ | `deleted_at IS NULL` AND (자체 정책) | 자체 RLS 미정(부록 TBD #1) — soft-delete 조건만 선반영 |
| `secure_identifiers` | ✅ | `deleted_at IS NULL` AND (§3.5 조건) | 본 문서 §3.5에 반영 |
| `consents` | ✅ | `deleted_at IS NULL` AND (동의 주체·대리인·주보호자) | §2 매트릭스 행 근거. 철회는 행 삭제가 아닌 `granted=false` 신규 행+`revoked_at`(docs/02 §2.15) |
| `access_logs` / `permission_logs` | ❌ | (해당 없음) | §4.1 시스템 파기로 처리 |

**가시성 원칙**
- 파기 표시된 행(`deleted_at IS NOT NULL`)은 일반 SELECT 정책에서 **제외**한다. 보호자·당사자 본인·권한자 등 **권한자에게도 미노출**한다(논리 삭제 = 조회상 부재).
- 모든 대상 테이블의 SELECT 정책 USING 절에 `deleted_at IS NULL`을 **AND로 결합**한다. 기존 접근 주체 조건(보호자/본인/권한자)은 그대로 두고 가시성 게이트만 덧댄다.
- **소프트 삭제 행위**(`deleted_at` 세팅)는 해당 테이블의 기존 UPDATE/DELETE 권한 주체가 수행한다(예: `records`는 보호자 — §3.1 DELETE 주체와 동일). 실제 운영에서 "삭제"는 `deleted_at` 세팅 UPDATE로 구현하며, 물리 삭제(hard delete)는 유예기간 경과 후 §4.1과 동일한 `service_role` 배치로 수행한다.
- **예외(복구·감사)**: 복구(undelete)·법정 감사 목적의 파기 행 조회는 `service_role`(RLS 우회) 경로로만 가능하다. 사용자 대면 RLS에는 파기 행 조회 정책을 두지 않는다.

```sql
-- 예시: records SELECT (§3.1과 동일 — 파기 행 제외 게이트)
CREATE POLICY records_select ON records FOR SELECT USING (
  deleted_at IS NULL
  AND ( is_guardian(person_id)
        OR is_self(person_id)
        OR has_permission(person_id, domain, 'read') )
);

-- 예시: self_expressions SELECT (§3.2 — 파기 행 제외 게이트 적용)
CREATE POLICY self_expr_select ON self_expressions FOR SELECT USING (
  deleted_at IS NULL
  AND ( is_self(person_id)
        OR is_guardian(person_id) )
);
```

> 🟡 TBD: 사용자 대면 "휴지통/복구 UI" 도입 여부(권한자가 자신이 파기한 행을 일정 기간 복구)는 docs 미정. 도입 시 별도 SELECT 정책(`deleted_at IS NOT NULL AND <소유 주체>`)을 추가한다. 현재는 **권한자에게도 미노출 = 조회상 부재**로 확정한다.
>
> 마이그레이션 영향: `deleted_at` 컬럼은 docs/02 테이블 DDL(docs/15 Step 1~3) 단계에서 추가되며, 본 절의 SELECT 게이트는 docs/15 §7(Step 8 RLS 활성화)에서 적용된다. 부분 인덱스 `WHERE deleted_at IS NULL`로 활성 행 조회 성능을 보강할 수 있다(docs/15 §5 보조 인덱스 후보).

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

-- (참고) soft-delete: 파기 표시된 records는 권한자에게도 0행 (§4.2)
SELECT is_empty($$ SELECT id FROM records
                   WHERE person_id = :person AND id = :soft_deleted $$,
               'soft-deleted record is invisible even to guardian');

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
| access_logs UPDATE/DELETE (사용자) | 거부(불변) | §4 |
| permission_logs UPDATE/DELETE (사용자) | 거부(불변) | §4 |
| access_logs/permission_logs 보유기간 파기 (service_role) | 허용(경과분만) | §4.1 |
| records/self_expressions SELECT: `deleted_at IS NOT NULL` 행 | 0행(권한자도 미노출) | §4.2 |

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
| 5b | access_logs/permission_logs **불변 ↔ 파기 충돌** | ✅ 해결 (2026-06-14) | §4.1로 확정 — 사용자 경로 불변(UPDATE/DELETE 정책 미생성), `service_role` 배치로 보유기간 경과분만 파기(docs/16 §4.3 정합). 잔여 🟡: `p_retention` 수치(법무, docs/16 §4.1·§9 #1) |
| 8 | 사용자 대면 **soft-delete 가시성**(`deleted_at`) | ✅ 구조 확정 (2026-06-14) | §4.2로 확정 — SELECT에 `deleted_at IS NULL` AND 결합, 권한자도 파기 행 미노출. 잔여 🟡: 휴지통/복구 UI 도입 여부, `record_files`·`persons`·매핑 자체 SELECT 정책 본체(부록 #1) |
| 6 | handovers "미확인 상태에서만 수정"(9.1.5) RLS화 | API 레벨 언급, RLS 규칙 미정 | `is_confirmed=false` USING 조건 후보 |
| 7 | `access_level` 'manage'(WBS) vs 'edit/admin'(§4) | ✅ 해결 (2026-06-14) | WBS 4.1.1 `manage`→`read/write/edit` 수정. `admin`은 주보호자 전용·위임 불가로 확정(docs/02 §4·docs/06 Flow-3). 위자드 3단계 노출 |
| 9 | `secure_identifiers` 행 접근 + **원문 복호화 통제** | ✅ 행 RLS 확정 (2026-06-14) | §3.5로 확정 — 행 SELECT는 records 동일 매핑(`value_masked`만), 원문 복호화는 보호자·권한자 한정·`service_role`/앱 레이어 키 접근. 잔여 🟡: 암호화 도구·키관리(docs/16 §9 #2), `identifier_type`→`domain` 매핑 헬퍼 구현, 복호화 로깅 |
| 10 | `consents` SELECT/INSERT/UPDATE 정책 | ✅ 골격 확정 (2026-06-14) | §2 매트릭스 행으로 확정 — 동의 주체·대리인·주보호자 SELECT, 철회는 `granted=false` 신규 행+`revoked_at`(append 지향). 잔여 🟡: 물리 DELETE 정책(이력 보존상 비지향), 대리인 판별식(법정대리인=주보호자/후견인) DB 헬퍼 본체 |

---

> **RLS 차단의 HTTP 표면화:** RLS가 행을 차단했을 때 API가 어떤 상태 코드로 응답하는지(접근 자격 없음 → 404 존재 은닉, 자격은 있으나 작업만 거부 → 403)는 `docs/18-error-handling-api-conventions.md` §2.3에서 확정한다. 민감 의료/장애 PII 누출 방지가 결정 근거다.

> 본 문서는 docs/02-data-specification.md(§2·§4·§6), docs/03-erd.md(§RLS 정책 요약), docs/08-wbs-v1.1.md(Phase 1.2·4.4·11·18.1.4)에 **정의된 정책만** 기술했으며, 미정의 항목은 모두 🟡 TBD로 명시했다. RLS 정책 확정 시 본 문서와 pgTAP(18.1.4)를 함께 갱신한다.
