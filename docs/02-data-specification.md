# 데이터 명세서 — OnDol 플랫폼

> 버전: v1.1 | 작성일: 2026-06-12 (개정: 2026-06-14)  
> DB: PostgreSQL (Supabase) | 기본 타임존: KST (UTC+9)
>
> **v1.1 변경(docs/16 거버넌스 정합):** ①고유식별정보 분리 암호화 저장 테이블 `secure_identifiers`(§2.14) 신설 — WEL-001·LEG-001 평문 분리(docs/16 TBD #2 해소) ②동의 이력 테이블 `consents`(§2.15) 신설(docs/16 §2 연계) ③사용자 대면 엔티티에 `deleted_at` soft-delete 컬럼 추가(docs/16 TBD #4 해소, append-only 로그는 제외) ④Enum 2종·부분 인덱스·제약 보강.

---

## 목차
1. [테이블 목록](#1-테이블-목록)
2. [핵심 테이블 상세](#2-핵심-테이블-상세)
3. [JSONB content 스키마 (분야별 기록 유형)](#3-jsonb-content-스키마)
4. [Enum 정의](#4-enum-정의)
5. [인덱스 전략](#5-인덱스-전략)
6. [제약조건 요약](#6-제약조건-요약)

---

## 1. 테이블 목록

| # | 테이블명 | 설명 | 주요 관계 |
|---|---------|------|---------|
| 1 | `persons` | 당사자 기본 정보 | 모든 기록의 소유자 |
| 2 | `users` | 이해관계자 계정 | auth.users 확장 |
| 3 | `guardian_persons` | 보호자↔당사자 연결 | N:M |
| 4 | `person_accounts` | 당사자 계정 연결 | 1:1 (선택) |
| 5 | `permissions` | 권한 매트릭스 | 핵심 접근 제어 |
| 6 | `permission_logs` | 권한 변경 이력 | 감사 로그 |
| 7 | `records` | 이해관계자 기록 | 전 분야 통합 |
| 8 | `self_expressions` | 당사자 자기표현 | 이미지 선택 |
| 9 | `record_files` | 첨부 파일 | records, self_expressions |
| 10 | `access_logs` | 접근 로그 | 삭제 불가 |
| 11 | `life_milestones` | 생애 이정표 | persons |
| 12 | `handovers` | 인수인계 | users, persons |
| 13 | `notifications` | 알림 | users, records |
| 14 | `secure_identifiers` | 고유식별정보 암호화 저장 (분리) | persons, records |
| 15 | `consents` | 동의 이력 (필수/선택·민감·고유식별 분리) | users, persons |

> **soft-delete 컬럼(`deleted_at`) 적용 정책 (docs/16 §4.3 연계):** 사용자 대면 엔티티(`persons`, `records`, `self_expressions`, `record_files`, `guardian_persons`, `person_accounts`, `secure_identifiers`, `consents`)는 `deleted_at TIMESTAMPTZ NULL`을 가진다 — 파기/탈퇴 시 논리 삭제 후 유예기간 경과 시 물리 삭제. 반면 **`access_logs`·`permission_logs`는 append-only(불변)** 으로 `deleted_at`을 두지 않으며, 법정 보유기간 경과분은 data-infra가 `docs/13 §4`에서 service_role 시스템 배치로 별도 파기한다(사용자 변조 차단 ≠ 시스템 파기 분리 원칙).

---

## 2. 핵심 테이블 상세

---

### 2.1 `persons` — 당사자

| 컬럼명 | 타입 | NOT NULL | 기본값 | 설명 | 예시 |
|--------|------|:--------:|--------|------|------|
| `id` | UUID | ✅ | gen_random_uuid() | PK | `a1b2c3...` |
| `name` | TEXT | ✅ | — | 이름 | `"김철수"` |
| `birth_date` | DATE | ✅ | — | 생년월일 | `2005-03-15` |
| `gender` | TEXT | — | — | 성별 (male/female/other) | `"male"` |
| `disability_types` | TEXT[] | — | `'{}'` | 장애 유형 목록 | `{"지적장애","자폐성장애"}` |
| `disability_grade` | TEXT | — | — | 장애 정도 (심한/심하지않은) | `"심한"` |
| `photo_url` | TEXT | — | — | 프로필 사진 URL | Supabase Storage URL |
| `emergency_info` | JSONB | — | `'{}'` | 핀고정 응급 정보 | 아래 스키마 참조 |
| `current_life_stage` | TEXT | — | — | 현재 생애주기 단계 | `"child"` |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | 등록일시 | |
| `updated_at` | TIMESTAMPTZ | ✅ | NOW() | 수정일시 | |
| `deleted_at` | TIMESTAMPTZ | — | NULL | soft-delete 시각 (NULL=활성). 파기/탈퇴 시 설정, 유예기간 경과 후 hard delete (docs/16 §4.3) | |

> **soft-delete 주의:** `deleted_at IS NOT NULL` 행은 모든 조회·RLS에서 제외해야 한다. 조회 쿼리 기본 필터(`WHERE deleted_at IS NULL`)와 부분 인덱스(§5)로 처리한다. `persons` soft-delete 시 연결된 `records`·`self_expressions`·`record_files`·매핑 테이블도 함께 soft-delete 처리(애플리케이션 트랜잭션, docs/16 §4.2 FK 정책은 🟡 TBD).

**`emergency_info` JSONB 스키마:**
```json
{
  "allergies": ["땅콩", "페니실린"],
  "forbidden_medications": ["아스피린"],
  "medical_conditions": ["간질 (항경련제 복용 중)"],
  "emergency_contacts": [
    { "name": "김보호", "relation": "모", "phone": "010-1234-5678" }
  ],
  "hospital": { "name": "서울대병원 소아신경과", "phone": "02-2072-2114" },
  "behavior_notes": "낯선 환경에서 자해 행동 발생 가능",
  "communication_method": "PECS 사용"
}
```

---

### 2.2 `users` — 이해관계자 계정

| 컬럼명 | 타입 | NOT NULL | 기본값 | 설명 | 예시 |
|--------|------|:--------:|--------|------|------|
| `id` | UUID | ✅ | — | PK (auth.users FK) | |
| `name` | TEXT | ✅ | — | 이름 | `"박선생"` |
| `role` | TEXT | ✅ | — | 역할 (Enum 참조) | `"teacher"` |
| `phone` | TEXT | — | — | 연락처 | `"010-9876-5432"` |
| `organization` | TEXT | — | — | 소속 기관명 | `"○○특수학교"` |
| `organization_type` | TEXT | — | — | 기관 유형 | `"special_school"` |
| `profile_photo_url` | TEXT | — | — | 프로필 사진 | |
| `is_active` | BOOLEAN | ✅ | `true` | 계정 활성 여부 | |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | 가입일시 | |

---

### 2.3 `guardian_persons` — 보호자↔당사자 연결

| 컬럼명 | 타입 | NOT NULL | 기본값 | 설명 | 예시 |
|--------|------|:--------:|--------|------|------|
| `id` | UUID | ✅ | gen_random_uuid() | PK | |
| `guardian_id` | UUID | ✅ | — | FK → users.id | |
| `person_id` | UUID | ✅ | — | FK → persons.id | |
| `is_primary` | BOOLEAN | ✅ | `false` | 주보호자 여부 | `true` |
| `relationship` | TEXT | — | — | 관계 | `"부"`, `"모"`, `"형제"`, `"후견인"` |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | 연결일시 | |
| `deleted_at` | TIMESTAMPTZ | — | NULL | soft-delete 시각 (관계 종료·당사자 파기 시; docs/16 §4.3) | |

**제약:** `UNIQUE(guardian_id, person_id)` — soft-delete 운영 시 부분 유니크 인덱스 `WHERE deleted_at IS NULL`로 대체(파기 후 재연결 허용)

---

### 2.4 `person_accounts` — 당사자 계정 연결 (1:1, 선택)

| 컬럼명 | 타입 | NOT NULL | 기본값 | 설명 |
|--------|------|:--------:|--------|------|
| `person_id` | UUID | ✅ | — | PK, FK → persons.id |
| `user_id` | UUID | — | — | FK → users.id (NULL 가능) |
| `accessibility_settings` | JSONB | — | 아래 참조 | 접근성 설정 |
| `ui_mode` | TEXT | — | `'icon'` | UI 모드 (icon/mixed) |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | |
| `deleted_at` | TIMESTAMPTZ | — | NULL | soft-delete 시각 (당사자 파기·계정 해제 시; docs/16 §4.3) |

**`accessibility_settings` 기본값:**
```json
{
  "large_icons": true,
  "high_contrast": false,
  "font_size": "large",
  "simple_language": true,
  "color_theme": "default"
}
```

---

### 2.5 `permissions` — 권한 매트릭스

| 컬럼명 | 타입 | NOT NULL | 기본값 | 설명 | 예시 |
|--------|------|:--------:|--------|------|------|
| `id` | UUID | ✅ | gen_random_uuid() | PK | |
| `person_id` | UUID | ✅ | — | FK → persons.id | |
| `user_id` | UUID | ✅ | — | FK → users.id | |
| `granted_by` | UUID | ✅ | — | FK → users.id (권한 부여자) | |
| `domain` | TEXT | ✅ | — | 분야 (Enum: DomainType) | `"education"` |
| `access_level` | TEXT | ✅ | — | 접근 수준 (Enum: AccessLevel) | `"write"` |
| `valid_from` | DATE | — | — | 유효 시작일 (NULL=즉시) | `2024-03-01` |
| `valid_until` | DATE | — | — | 유효 종료일 (NULL=무기한) | `2024-12-31` |
| `note` | TEXT | — | — | 권한 부여 사유 | `"2024학년도 담임"` |
| `is_active` | BOOLEAN | ✅ | `true` | 활성 여부 | |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | 생성일시 | |
| `updated_at` | TIMESTAMPTZ | ✅ | NOW() | 수정일시 | |

**제약:** `UNIQUE(person_id, user_id, domain)`

---

### 2.6 `permission_logs` — 권한 변경 이력 (삭제 불가)

| 컬럼명 | 타입 | NOT NULL | 설명 |
|--------|------|:--------:|------|
| `id` | UUID | ✅ | PK |
| `permission_id` | UUID | — | FK → permissions.id (삭제 후 NULL 허용) |
| `person_id` | UUID | ✅ | FK → persons.id (직접 저장) |
| `user_id` | UUID | ✅ | 권한 대상자 ID |
| `action` | TEXT | ✅ | 'granted' / 'revoked' / 'modified' / 'expired' |
| `changed_by` | UUID | ✅ | FK → users.id |
| `domain` | TEXT | ✅ | 분야 |
| `old_value` | JSONB | — | 변경 전 값 |
| `new_value` | JSONB | — | 변경 후 값 |
| `created_at` | TIMESTAMPTZ | ✅ | 변경일시 |

---

### 2.7 `records` — 이해관계자 기록 (전 분야 통합)

| 컬럼명 | 타입 | NOT NULL | 기본값 | 설명 | 예시 |
|--------|------|:--------:|--------|------|------|
| `id` | UUID | ✅ | gen_random_uuid() | PK | |
| `person_id` | UUID | ✅ | — | FK → persons.id | |
| `author_id` | UUID | ✅ | — | FK → users.id | |
| `domain` | TEXT | ✅ | — | Enum: DomainType | `"medical"` |
| `record_type` | TEXT | ✅ | — | 기록 유형 코드 | `"MED-008"` |
| `title` | TEXT | ✅ | — | 기록 제목 | `"2024년 1분기 검진"` |
| `content` | JSONB | ✅ | — | 구조화 내용 (유형별 스키마) | 아래 참조 |
| `summary` | TEXT | — | — | 당사자용 짧은 요약 | `"선생님이 교육 기록을 남겼어요"` |
| `life_stage` | TEXT | — | — | 생애주기 단계 | `"child"` |
| `record_date` | DATE | ✅ | — | 기록 대상 날짜 | `2024-03-15` |
| `is_milestone` | BOOLEAN | ✅ | `false` | 주요 이정표 여부 | |
| `is_pinned` | BOOLEAN | ✅ | `false` | 상단 핀고정 | |
| `is_draft` | BOOLEAN | ✅ | `false` | 임시저장 | |
| `tags` | TEXT[] | — | `'{}'` | 태그 목록 | `{"IEP","2024"}` |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | | |
| `updated_at` | TIMESTAMPTZ | ✅ | NOW() | | |
| `deleted_at` | TIMESTAMPTZ | — | NULL | soft-delete 시각 (정정·삭제권 행사·파기 시; docs/16 §4.3·§5.1) | |

> **고유식별정보 분리 (docs/16 §3.2 / PIPA §24):** `records.content`(JSONB)는 **평문**이므로 고유식별정보를 직접 담지 않는다. WEL-001 `registration_number`(장애인 등록번호)·LEG-001 `document_number`(증명서 문서번호)는 `content`에서 **제외**하고 §2.14 `secure_identifiers`에 암호화 저장하며, content에는 해당 식별정보를 가리키는 `secure_identifier_id`(UUID 참조)만 둔다. §3.C·§3.F 스키마 주석 참조.

---

### 2.8 `self_expressions` — 당사자 자기표현

| 컬럼명 | 타입 | NOT NULL | 기본값 | 설명 | 값 목록 |
|--------|------|:--------:|--------|------|---------|
| `id` | UUID | ✅ | gen_random_uuid() | PK | |
| `person_id` | UUID | ✅ | — | FK → persons.id | |
| `expression_date` | DATE | ✅ | CURRENT_DATE | 기록 날짜 | |
| `emotion` | TEXT | — | — | 감정 선택 | happy / neutral / sad / angry / anxious |
| `meal_status` | TEXT | — | — | 식사 상태 | ate_well / ate_ok / ate_poorly / did_not_eat |
| `meal_photo_url` | TEXT | — | — | 식사 사진 URL | |
| `activities` | TEXT[] | — | `'{}'` | 활동 목록 | exercise / study / art / friends / hospital / shopping / home / game / therapy / work |
| `body_condition` | TEXT | — | — | 몸 상태 | healthy / cold / tired / pain / other |
| `memo` | TEXT | — | — | 자유 메모 (선택) | |
| `voice_memo_url` | TEXT | — | — | 음성 메모 URL | |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | | |
| `deleted_at` | TIMESTAMPTZ | — | NULL | soft-delete 시각 (파기·삭제권 행사 시; docs/16 §4.3) | |

**제약:** `UNIQUE(person_id, expression_date)` — 하루 1건 (soft-delete 운영 시 부분 유니크 인덱스 `WHERE deleted_at IS NULL`로 대체)

---

### 2.9 `record_files` — 첨부 파일

| 컬럼명 | 타입 | NOT NULL | 설명 |
|--------|------|:--------:|------|
| `id` | UUID | ✅ | PK |
| `record_id` | UUID | — | FK → records.id (NULL 가능) |
| `self_expression_id` | UUID | — | FK → self_expressions.id (NULL 가능) |
| `uploader_id` | UUID | ✅ | FK → users.id |
| `file_name` | TEXT | ✅ | 원본 파일명 |
| `storage_path` | TEXT | ✅ | Supabase Storage 경로 |
| `file_type` | TEXT | — | pdf / image / audio / document |
| `file_size` | BIGINT | — | 파일 크기 (bytes) |
| `is_sensitive` | BOOLEAN | ✅ | `false` | 민감 문서 여부 (진단서 등) |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | |
| `deleted_at` | TIMESTAMPTZ | — | NULL | soft-delete 시각. Storage 객체 hard delete는 유예기간 경과 후 배치로 동시 처리 (docs/16 §4.3) |

**제약:** `CHECK ((record_id IS NOT NULL) != (self_expression_id IS NOT NULL))`
(둘 중 정확히 하나만 NOT NULL)

---

### 2.10 `access_logs` — 접근 로그 (삭제 불가)

| 컬럼명 | 타입 | NOT NULL | 설명 |
|--------|------|:--------:|------|
| `id` | UUID | ✅ | PK |
| `user_id` | UUID | ✅ | FK → users.id |
| `person_id` | UUID | ✅ | FK → persons.id |
| `record_id` | UUID | — | FK → records.id |
| `self_expression_id` | UUID | — | FK → self_expressions.id |
| `action` | TEXT | ✅ | view / create / edit / delete / download / share / permission_change |
| `ip_address` | INET | — | 접근 IP |
| `user_agent` | TEXT | — | 브라우저/앱 정보 |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() |

**정책:** INSERT만 허용, UPDATE/DELETE 불가 (RLS)

---

### 2.11 `life_milestones` — 생애 이정표

| 컬럼명 | 타입 | NOT NULL | 설명 | 예시 |
|--------|------|:--------:|------|------|
| `id` | UUID | ✅ | PK | |
| `person_id` | UUID | ✅ | FK → persons.id | |
| `title` | TEXT | ✅ | 이정표 제목 | `"특수학교 입학"` |
| `description` | TEXT | — | 상세 설명 | |
| `milestone_date` | DATE | ✅ | 이정표 날짜 | `2012-03-02` |
| `category` | TEXT | — | 분류 (Enum: MilestoneCategory) | `"school_entry"` |
| `life_stage` | TEXT | — | 생애주기 단계 | `"child"` |
| `created_by` | UUID | ✅ | FK → users.id | |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | |

---

### 2.12 `handovers` — 인수인계

| 컬럼명 | 타입 | NOT NULL | 설명 |
|--------|------|:--------:|------|
| `id` | UUID | ✅ | PK |
| `person_id` | UUID | ✅ | FK → persons.id |
| `from_user_id` | UUID | — | FK → users.id (떠나는 담당자, NULL=최초 지정) |
| `to_user_id` | UUID | — | FK → users.id (새 담당자) |
| `domain` | TEXT | ✅ | 인수인계 분야 |
| `period_start` | DATE | — | 담당 기간 시작 |
| `period_end` | DATE | — | 담당 기간 종료 |
| `summary` | TEXT | — | 핵심 요약 |
| `key_notes` | TEXT[] | — | 특이사항 목록 |
| `priority_records` | UUID[] | — | 중요 기록 ID 목록 (강조 표시용) |
| `is_confirmed` | BOOLEAN | ✅ | `false` | 수신 확인 여부 |
| `confirmed_at` | TIMESTAMPTZ | — | 확인 일시 |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() |

---

### 2.13 `notifications` — 알림

| 컬럼명 | 타입 | NOT NULL | 설명 |
|--------|------|:--------:|------|
| `id` | UUID | ✅ | PK |
| `recipient_id` | UUID | ✅ | FK → users.id (수신자) |
| `person_id` | UUID | ✅ | FK → persons.id |
| `record_id` | UUID | — | FK → records.id (관련 기록, NULL 가능) |
| `self_expression_id` | UUID | — | FK → self_expressions.id (자기표현 알림 링크, NULL 가능) |
| `type` | TEXT | ✅ | new_record / permission_granted / permission_revoked / handover / milestone |
| `title` | TEXT | ✅ | 알림 제목 |
| `body` | TEXT | — | 알림 내용 |
| `is_read` | BOOLEAN | ✅ | `false` |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() |

---

### 2.14 `secure_identifiers` — 고유식별정보 암호화 저장 (PIPA §24)

> **설계 결정 (확정):** PIPA §24③·시행령 §21은 고유식별정보의 **암호화 저장**을 의무화한다. `records.content`(JSONB)는 평문 저장 구조라 컬럼 단위 암호화가 불가하므로, 고유식별정보를 **content에서 분리**해 본 전용 테이블에 암호화 저장한다. content에는 평문 대신 본 테이블 행을 가리키는 `secure_identifier_id` 참조만 남긴다. **모델 구조(분리 저장)는 확정**이며, 구체 암호화 도구(Supabase Vault vs pgcrypto 앱레벨 암호화)·키 관리(KMS)는 법무·인프라 확정 대상 🟡 TBD.

| 컬럼명 | 타입 | NOT NULL | 기본값 | 설명 |
|--------|------|:--------:|--------|------|
| `id` | UUID | ✅ | gen_random_uuid() | PK. content/persons가 참조하는 키 |
| `person_id` | UUID | ✅ | — | FK → persons.id (소유 당사자) |
| `record_id` | UUID | — | — | FK → records.id (출처 기록, NULL 가능) |
| `identifier_type` | TEXT | ✅ | — | 식별정보 유형 (Enum: SecureIdentifierType) — `disability_registration_number`(WEL-001) / `disability_certificate_number`(LEG-001) |
| `encrypted_value` | BYTEA | ✅ | — | **암호화된 원문**. 평문 저장 금지. pgcrypto `pgp_sym_encrypt` 또는 Supabase Vault 시크릿 참조 🟡 |
| `value_masked` | TEXT | ✅ | — | **표시용 마스킹 값**(예: `123-45-****`). 화면·목록 출력은 항상 이 값만 사용 |
| `encryption_ref` | TEXT | — | — | Vault 사용 시 시크릿/키 식별자(앱레벨 암호화 시 키 버전). 도구 확정 후 채움 🟡 |
| `created_by` | UUID | ✅ | — | FK → users.id (입력자) |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | |
| `updated_at` | TIMESTAMPTZ | ✅ | NOW() | |
| `deleted_at` | TIMESTAMPTZ | — | NULL | soft-delete 시각 (연결 기록·당사자 파기 시; docs/16 §4.3) |

- **마스킹(표시용) vs 암호화(저장용) 역할 구분:** `value_masked`는 *표시 제어*(부분만 노출), `encrypted_value`는 *저장 보호*(DB 유출 시에도 원문 비노출)다. 둘은 별개 의무이며 본 설계는 양쪽을 모두 충족한다. 원문 복호화는 권한 재검증을 거친 서버(service_role/Edge Function)에서만 수행한다.
- **접근 통제:** 본 테이블은 RLS로 보호자·권한자만 접근하며, 복호화는 docs/13에서 별도 정책으로 통제한다(data-infra 연계 🟡).
- **수집 최소화:** PIPA §24 권고에 따라 서비스상 불필요하면 수집하지 않는다(docs/16 §3.2).
- 🟡 **암호화 도구·키관리 권고(확정 필요):** 도구 선택은 **docs/16 §3.2.1** 권고안 참조 — 1차 출시는 **Supabase Vault**(`encryption_ref`에 Vault 시크릿 식별자), 규모·감사 요구 증대 시 **pgcrypto(`pgp_sym_encrypt`)+외부 KMS 봉투암호화**로 전환 가능하도록 `encryption_ref`를 키 식별 추상화 계층으로 사용한다. 키 회전 시 과거 키 버전을 `encryption_ref`에 보존해 기존 행 복호 가능성을 유지한다. 복호는 `service_role`/Edge Function 한정(docs/13 §3.5)이며 복호 1건마다 `access_logs`에 기록(권고). **도구·키 회전 주기는 인프라, PIPA §24③·시행령 §21 충족 여부는 법무 확정 대상.** 🔒 키가 `service_role` 키와 동일 신뢰경계에서 유출되면 분리 저장 의미가 소멸하므로 키 접근 경로를 별도 격리한다.

---

### 2.15 `consents` — 동의 이력 (PIPA §22~24)

> **설계 결정 (확정):** docs/16 §2 동의 체계를 시스템에 반영한다. 필수/선택, 민감정보·고유식별정보 별도 동의를 **분리 레코드**로 보관하고, 14세 미만·피후견인은 법정대리인 대리동의를 기록한다(docs/05 §1 온보딩·§10 전환기 흐름과 연계).

| 컬럼명 | 타입 | NOT NULL | 기본값 | 설명 |
|--------|------|:--------:|--------|------|
| `id` | UUID | ✅ | gen_random_uuid() | PK |
| `subject_user_id` | UUID | — | — | FK → users.id (성인 본인 동의 시) |
| `person_id` | UUID | — | — | FK → persons.id (당사자 정보 동의 시) |
| `consent_type` | TEXT | ✅ | — | Enum: ConsentType (아래) |
| `is_required` | BOOLEAN | ✅ | — | 필수(true)/선택(false) 구분 — 필수·선택 일괄동의 금지(PIPA §22⑤) |
| `granted` | BOOLEAN | ✅ | — | 동의(true)/철회·거부(false) |
| `consented_by` | UUID | ✅ | — | FK → users.id (실제 동의 클릭 주체 = 본인 또는 법정대리인) |
| `on_behalf` | BOOLEAN | ✅ | `false` | 대리동의 여부 (법정대리인이 당사자 대신 동의) |
| `legal_basis` | TEXT | — | — | 대리동의 근거 (`친권자`/`성년후견인` 등; docs/16 §2.2) |
| `policy_version` | TEXT | ✅ | — | 동의 시점 처리방침/약관 버전 (docs/16 §7) |
| `consented_at` | TIMESTAMPTZ | ✅ | NOW() | 동의 시각 |
| `revoked_at` | TIMESTAMPTZ | — | NULL | 철회 시각 (NULL=유효) |
| `deleted_at` | TIMESTAMPTZ | — | NULL | soft-delete 시각 (계정·당사자 파기 시; docs/16 §4.3) |

**`consent_type` 값 (Enum: ConsentType):** `terms_of_service`(이용약관·필수) / `privacy_required`(개인정보 수집·이용 필수) / `sensitive_info`(민감정보 별도 필수, docs/16 §3.1) / `unique_identifier`(고유식별정보 별도 필수, docs/16 §3.2) / `third_party_processing`(위탁·국외이전 고지·동의, docs/16 §6) / `marketing`(마케팅·부가서비스 알림, 선택).

- **`subject_user_id` XOR `person_id`**: 동의 대상이 이용자 본인이면 `subject_user_id`, 당사자 정보면 `person_id`를 채운다(둘 중 하나 NOT NULL).
- **동의 철회(PIPA §22)**: 철회는 행 삭제가 아니라 `granted=false` 신규 행 추가 + 원 행 `revoked_at` 기록(이력 보존, docs/16 §5.1 처리정지·철회 연계).
- **성년 전환 재동의(docs/16 §2.3)**: 당사자 성년 도달·후견 미개시 시, 기존 대리동의(`on_behalf=true`)는 유지하되 **본인 명의 신규 동의 레코드**(`subject_user_id`=당사자 계정, `on_behalf=false`)를 재취득한다(docs/05 §10 흐름).

---

## 3. JSONB content 스키마

> 본 절은 `records.content`(JSONB)에 저장되는 6개 분야 기록유형(MED/EDU/WEL/DAI/TRA/LEG)의 스키마를 정의한다. `01-record-matrix.md` 코드 목록의 **SELF-001(자기표현)** 은 `records`가 아닌 별도 `self_expressions` 테이블(§2.8)의 정형 컬럼으로 관리하므로 여기에 content 스키마가 없다.

### A. 의료/건강

**MED-001 초기 진단 요약**
```typescript
{
  hospital_name: string           // 진단 병원
  doctor_name?: string            // 진단 의사 (선택)
  diagnosis_date: string          // 진단 날짜 (YYYY-MM-DD)
  diagnosis_codes?: string[]      // KCD 코드 (예: "F84.0")
  diagnosis_name: string          // 진단명 (예: "자폐스펙트럼장애")
  diagnosis_detail: string        // 진단 내용 요약
  recommendations?: string        // 권고 사항
  next_steps?: string             // 이후 계획
  file_attached: boolean          // 진단서 파일 첨부 여부
}
```

**MED-002 발달/행동 검사 결과**
```typescript
{
  assessment_name: string         // 검사명 (예: "K-WISC-V", "CARS-2")
  assessment_date: string
  assessor: string                // 검사자
  institution: string             // 검사 기관
  results: {
    domain: string                // 검사 영역
    score?: number
    interpretation: string        // 결과 해석
  }[]
  overall_summary: string         // 종합 소견
  recommendations?: string
  file_attached: boolean
}
```

**MED-003 복약 기록**
```typescript
{
  medications: {
    name: string                  // 약품명
    dosage: string                // 용량 (예: "5mg")
    frequency: string             // 복용 횟수 (예: "하루 2회")
    timing?: string               // 복용 시간 (예: "아침, 저녁 식후")
    purpose?: string              // 복용 목적
    start_date: string
    end_date?: string             // null = 상시 복용
    prescribing_hospital?: string
    side_effects?: string         // 부작용 메모
  }[]
  last_reviewed: string           // 최근 검토일
}
```

**MED-004 응급 대응 정보** (is_pinned=true 권장)
```typescript
{
  allergies: string[]             // 알레르기 목록
  forbidden_medications: string[] // 금기 약물
  medical_conditions: string[]    // 주요 진단명/상태
  seizure_info?: string          // 발작 관련 정보
  communication_method: string    // 의사소통 방법
  behavior_crisis_protocol?: string // 행동 위기 대응
  emergency_contacts: {
    name: string
    relation: string
    phone: string
    priority: number
  }[]
  hospital: {
    name: string
    department: string
    phone: string
    patient_id?: string
  }
}
```

**MED-005 치료 계획서**
```typescript
{
  therapy_type: 'OT' | 'PT' | 'ST' | 'behavioral' | 'music' | 'art' | 'sensory' | 'other'
  therapy_type_detail?: string
  therapist_name: string
  organization: string
  period_start: string
  period_end?: string
  session_frequency: string       // 예: "주 2회 50분"
  current_level: {
    domain: string
    description: string
  }[]
  short_term_goals: string[]      // 단기 목표 (3개월)
  long_term_goals: string[]       // 장기 목표 (1년)
  methods: string[]               // 치료 방법론
  parent_guidance?: string        // 가정 연계 지도 사항
}
```

**MED-006 치료 회기 일지**
```typescript
{
  therapy_type: string
  session_number: number
  session_date: string
  duration_minutes: number
  therapist_name: string
  activities: {
    name: string
    purpose: string
    response: 'excellent' | 'good' | 'fair' | 'poor'
    notes?: string
  }[]
  goal_progress: {
    goal: string
    status: 'achieved' | 'improving' | 'maintained' | 'regressed'
    notes: string
  }[]
  behavior_notes?: string
  next_session_plan?: string
  parent_feedback_needed: boolean
}
```

**MED-008 정기 검진 요약**
```typescript
{
  hospital_name: string
  doctor_name?: string
  visit_date: string
  visit_purpose: string           // 방문 목적
  findings: string                // 주요 소견
  prescriptions_changed: boolean  // 처방 변경 여부
  prescription_notes?: string
  next_visit_date?: string
  referral?: string               // 다른 과 의뢰
  file_attached: boolean
}
```

**MED-007 치료 평가 보고서**
```typescript
{
  therapy_type: string
  period: string                  // 평가 기간 (예: "2024년 상반기")
  therapist_name: string
  session_count: number           // 총 회기 수
  attendance_rate: number         // 출석률 (%)
  goal_evaluation: {
    goal: string
    initial_level: string
    current_level: string
    achievement: 'achieved' | 'in_progress' | 'not_achieved'
    notes: string
  }[]
  overall_assessment: string
  next_period_goals: string[]     // 다음 기간 목표
  recommendations?: string
  file_attached: boolean
}
```

**MED-009 치료 종결 평가**
```typescript
{
  therapy_type: string
  termination_reason: 'goal_achieved' | 'transfer' | 'personal' | 'financial' | 'other'
  termination_reason_detail?: string
  therapist_name: string
  period_start: string
  period_end: string
  total_sessions: number
  final_goal_status: {
    goal: string
    achievement_level: string
    notes: string
  }[]
  summary: string
  recommendations?: string        // 이후 권고사항
  referral?: string               // 다른 서비스 의뢰
  file_attached: boolean
}
```

**MED-010 만성질환 관리 기록**
```typescript
{
  condition_name: string          // 만성질환명
  diagnosed_date?: string
  managing_hospital: string
  current_status: 'stable' | 'improving' | 'worsening' | 'monitoring'
  management_method: string       // 관리 방법
  monitoring_items: string[]      // 모니터링 항목
  notes?: string
}
```

---

### B. 교육

**EDU-001 개별화 교육계획 (IEP)**
```typescript
{
  school_name: string
  teacher_name: string
  academic_year: string           // 예: "2024"
  meeting_date: string
  participants: string[]          // 참석자 목록
  placement: string               // 교육 배치 (특수학급/통합학급/특수학교 등)
  current_level: {
    domain: string                // 영역 (국어, 수학, 사회성 등)
    description: string           // 현재 수준 기술
  }[]
  annual_goals: {
    domain: string
    goal: string                  // 연간 목표
    short_term_objectives: {
      objective: string
      evaluation_method: string
      schedule: string
    }[]
  }[]
  support_services: {
    service: string               // 제공 서비스
    frequency: string
    provider: string
  }[]
  related_services: string[]      // 관련 서비스 (치료지원 등)
  graduation_transition?: {       // 청소년기 이후
    post_secondary_goal: string
    transition_services: string[]
  }
}
```

**EDU-003 IEP 중간 점검**
```typescript
{
  review_date: string
  reviewer: string
  review_period: string           // 예: "2024년 1학기"
  goal_progress: {
    domain: string
    goal: string
    achievement_rate: number      // 0-100
    status: 'achieved' | 'in_progress' | 'not_started' | 'discontinued'
    evidence: string
    adjustment_needed: boolean
    adjustment_plan?: string
  }[]
  overall_assessment: string
  next_review_date?: string
}
```

**EDU-004 학교생활 관찰 기록**
```typescript
{
  observation_period: string      // 예: "2024년 3월 4주"
  observation_areas: {
    area: string                  // 관찰 영역 (학습참여, 사회성, 의사소통 등)
    observation: string           // 관찰 내용
    strengths?: string
    challenges?: string
  }[]
  behavior_incidents?: {
    date: string
    description: string
    antecedent?: string           // 선행 사건
    consequence?: string          // 결과/대응
  }[]
  peer_relationships: string
  recommendations?: string
}
```

**EDU-002 유아 특수교육 관찰**
```typescript
{
  observation_month: string       // 예: "2024-03"
  teacher_name: string
  institution_name: string        // 유치원/어린이집명
  developmental_domains: {
    domain: '인지' | '언어' | '사회성' | '감각운동' | '자조기술'
    observation: string
    progress: 'improving' | 'maintaining' | 'needs_support'
  }[]
  play_behavior: string           // 놀이 행동 관찰
  peer_interaction: string        // 또래 관계
  parent_feedback?: string        // 보호자 전달 사항
}
```

**EDU-005 통합교육 참여 기록**
```typescript
{
  activity_date: string
  activity_name: string
  inclusion_type: '완전통합' | '부분통합' | '교류학습'
  general_class: string           // 통합 학급명
  participants: number            // 참여 학생 수
  support_provided: string[]      // 제공된 지원
  participation_level: 'full' | 'partial' | 'minimal'
  observations: string
  challenges?: string
  successes?: string
  next_activities?: string
}
```

**EDU-006 학교 치료지원 기록**
```typescript
{
  support_date: string
  therapist_name: string
  therapy_type: string            // OT/ST/PT/기타
  location: '특수학급' | '통합학급' | '치료실' | '기타'
  session_duration: number        // 분
  activities: string[]
  student_response: string
  teacher_collaboration: boolean  // 담임교사 협력 여부
  notes?: string
}
```

**EDU-007 전환교육 계획**
```typescript
{
  plan_year: string
  student_age: number
  post_school_vision: string      // 졸업 후 비전 (학생 의견 포함)
  transition_domains: {
    domain: 'employment' | 'education' | 'independent_living' | 'community'
    current_status: string
    goal: string
    activities: string[]
    responsible: string[]
    timeline: string
  }[]
  agency_linkages: string[]       // 연계 기관
  family_involvement: string
}
```

**EDU-008 직업교육 참여 기록**
```typescript
{
  activity_date: string
  activity_type: string           // 직업탐색/직업훈련/현장실습 등
  activity_name: string
  duration_hours: number
  skills_practiced: string[]
  participation_level: 'excellent' | 'good' | 'fair' | 'poor'
  strengths_observed: string[]
  areas_for_support: string[]
  employer_feedback?: string      // 현장실습 시
  notes?: string
}
```

**EDU-009 졸업/수료 기록**
```typescript
{
  institution_name: string
  graduation_date: string
  program_type: '특수학교' | '특수학급' | '일반학교' | '직업훈련기관' | '기타'
  credential: string              // 학위/수료증 종류
  final_grade?: string
  achievements: string[]          // 주요 성취
  next_placement?: string         // 이후 진로 계획
  file_attached: boolean
}
```

---

### C. 복지서비스

**WEL-001 장애 등록 정보**

> 🟧 **고유식별정보 분리 (docs/16 §3.2 / PIPA §24):** `registration_number`(장애인 등록번호)는 고유식별정보다. **content에 평문 저장하지 않고** §2.14 `secure_identifiers`(`identifier_type='disability_registration_number'`)에 암호화 저장한다. content에는 참조 ID와 표시용 마스킹 값만 둔다.

```typescript
{
  secure_identifier_id?: string   // → secure_identifiers.id (암호화된 등록번호 참조)
  registration_number_masked?: string  // 표시용 마스킹 값 (예: "123-45-****") — 평문 금지
  registration_date: string
  disability_type: string         // 장애 유형
  disability_degree: 'severe' | 'not_severe'
  issuing_office: string          // 발급 기관 (주민센터)
  last_renewed?: string           // 마지막 갱신일
  file_attached: boolean
}
```

**WEL-003 활동지원 계획서**
```typescript
{
  plan_year: string
  support_grade: string           // 활동지원 등급
  monthly_hours: number           // 월 지원 시간
  service_types: {
    type: string                  // 서비스 유형
    hours_per_month: number
    provider?: string
  }[]
  individual_needs: string        // 개인별 특성 및 욕구
  support_goals: string[]
  created_by: string              // 담당 사회복지사
  valid_period: string            // 유효 기간
}
```

**WEL-002 초기 복지 연계 기록**
```typescript
{
  connection_date: string
  social_worker: string
  agency_name: string             // 복지관/기관명
  services_connected: {
    service_name: string
    start_date: string
    provider: string
    contact?: string
  }[]
  unmet_needs: string[]           // 미해결 욕구
  follow_up_date?: string
  notes?: string
}
```

**WEL-004 개인지원계획 (ISP)**
```typescript
{
  plan_year: string
  social_worker: string
  meeting_date: string
  participants: string[]
  person_strengths: string[]      // 당사자 강점
  person_challenges: string[]     // 지원 필요 영역
  dreams_goals: string            // 당사자 희망/목표
  support_domains: {
    domain: string
    current_situation: string
    goal: string
    action_plans: {
      action: string
      responsible: string
      timeline: string
      status?: 'planned' | 'in_progress' | 'completed'
    }[]
  }[]
  review_schedule: string
}
```

**WEL-005 ISP 중간 점검**
```typescript
{
  review_date: string
  reviewer: string
  review_period: string           // 예: "2024년 상반기"
  domain_progress: {
    domain: string
    goal: string
    action_status: 'completed' | 'in_progress' | 'not_started' | 'discontinued'
    achievement_notes: string
    adjustment_needed: boolean
    adjustment_plan?: string
  }[]
  overall_assessment: string
  service_satisfaction?: 'satisfied' | 'neutral' | 'dissatisfied'  // 당사자 의견
  next_review_date?: string
}
```

**WEL-006 서비스 이용 현황**
```typescript
{
  report_month: string            // 예: "2024-03"
  services: {
    service_name: string
    provider: string
    allocated_hours: number
    used_hours: number
    utilization_rate: number      // %
    notes?: string
  }[]
  total_cost?: number             // 월 총 비용 (원)
  issues?: string[]               // 발생 문제
  changes_needed?: string         // 서비스 변경 필요 사항
}
```

**WEL-007 노인복지 연계 기록**
```typescript
{
  connection_date: string
  social_worker: string
  reason: string                  // 연계 사유
  senior_services: {
    service_name: string
    agency: string
    start_date: string
    support_type: string
  }[]
  disability_service_overlap: string  // 장애+노인복지 중복 영역 조율
  care_plan_updated: boolean
  notes?: string
}
```

---

### D. 일상/돌봄

**DAI-001 영유아 돌봄 기록**
```typescript
{
  care_date: string
  caregiver: string
  daily_routine: {
    time: string
    activity: string
    notes?: string
  }[]
  meals: {
    meal_type: '수유' | '이유식' | '식사'
    amount?: string
    time: string
    notes?: string
  }[]
  sleep: {
    sleep_time: string
    wake_time: string
    quality: 'good' | 'fair' | 'poor'
  }[]
  development_observations?: string  // 발달 관찰 사항
  therapy_sessions?: string[]         // 당일 치료 내용
  concerns?: string
}
```

**DAI-002 활동지원 일지**
```typescript
{
  service_date: string
  supporter_name: string
  service_start: string           // "09:00"
  service_end: string             // "18:00"
  actual_hours: number
  service_activities: {
    category: '이동지원' | '가사지원' | '외출지원' | '신변처리' | '의사소통' | '일상생활' | '사회활동' | '기타'
    description: string
    duration_minutes: number
  }[]
  meals: {
    breakfast: boolean
    lunch: boolean
    dinner: boolean
    snacks?: string
    notes?: string
  }
  health_status: '양호' | '감기' | '피로' | '통증' | '기타'
  health_notes?: string
  behavior_notes?: string         // 특이 행동
  incidents?: string              // 사고/특이 사항
  tomorrow_notes?: string         // 다음 날 인계 사항
}
```

**DAI-003 행동 관찰 기록**
```typescript
{
  observation_date: string
  observer: string
  context: string                 // 관찰 상황
  behavior_type: 'challenging' | 'positive' | 'general'
  behavior_description: string
  antecedent?: string             // 선행 사건 (ABC 기록)
  behavior_detail?: string        // 행동 세부 내용
  consequence?: string            // 결과/대응
  duration?: number               // 지속 시간 (분)
  frequency?: number              // 빈도 (일간)
  intensity?: 'low' | 'medium' | 'high'
  strategies_used?: string[]      // 사용한 전략
  outcome?: string                // 결과
  notes?: string
}
```

**DAI-004 식이 기록**
```typescript
{
  record_date: string
  meals: {
    meal_type: '아침' | '점심' | '저녁' | '간식'
    menu: string
    amount: '다먹음' | '절반' | '조금' | '안먹음'
    appetite: 'good' | 'fair' | 'poor'
    texture_modified: boolean     // 질감 수정식 여부
    notes?: string
  }[]
  water_intake?: string           // 수분 섭취
  special_diet?: string           // 특이식이 적용 내용
  concerns?: string
}
```

**DAI-005 수면 기록**
```typescript
{
  record_date: string
  sleep_time: string              // "22:00"
  wake_time: string               // "07:00"
  total_hours: number
  sleep_quality: 'good' | 'fair' | 'poor'
  night_waking: number            // 야간 각성 횟수
  waking_reasons?: string[]       // 각성 원인
  sleep_aids?: string[]           // 수면 보조 (약물 등)
  behavior_before_sleep?: string
  notes?: string
}
```

---

### E. 전환/자립

**TRA-001 전환계획서**
```typescript
{
  plan_date: string
  social_worker: string
  current_life_stage: string
  target_life_stage: string       // 전환 목표 단계
  person_goals: string            // 당사자 의견/목표
  transition_areas: {
    area: '주거' | '고용' | '교육' | '여가' | '사회관계' | '건강' | '기타'
    current_status: string
    goal: string
    support_needed: string[]
    agencies: string[]            // 연계 기관
    timeline: string
  }[]
  key_contacts: {
    role: string
    name: string
    organization: string
    phone?: string
  }[]
  review_date: string
}
```

**TRA-002 직업 역량 평가**
```typescript
{
  assessment_date: string
  assessor: string
  assessment_tools: string[]      // 사용 평가 도구
  work_skills: {
    domain: string
    skill: string
    level: 'independent' | 'supported' | 'emerging' | 'not_demonstrated'
    notes?: string
  }[]
  work_interests: string[]
  work_preferences: {
    environment: string[]         // 선호 환경
    tasks: string[]               // 선호 작업
    avoid: string[]               // 기피 사항
  }
  recommended_jobs: string[]
  support_needs: string[]
  summary: string
}
```

**TRA-003 직업훈련/취업 기록**
```typescript
{
  record_type: '직업훈련' | '취업' | '직업유지'
  employer_or_institution: string
  position_or_program: string
  start_date: string
  end_date?: string               // 진행중이면 NULL
  work_hours_per_week?: number
  job_coach_support: boolean      // 잡코치 지원 여부
  skills_developed: string[]
  performance_notes: string
  challenges?: string[]
  supports_needed?: string[]
  status: 'ongoing' | 'completed' | 'terminated'
  termination_reason?: string
}
```

**TRA-004 자립생활 계획서**
```typescript
{
  plan_date: string
  social_worker: string
  target_independence_level: string
  living_arrangement: '가족과 동거' | '지원주거' | '독립주거' | '공동생활가정' | '시설'
  independence_domains: {
    domain: '주거' | '재정' | '건강관리' | '이동' | '사회활동' | '일상생활'
    current_level: string
    goal: string
    support_needed: string[]
    timeline: string
  }[]
  support_network: {
    role: string
    name: string
    contact?: string
  }[]
  review_schedule: string
}
```

**TRA-005 자립생활 경과 기록**
```typescript
{
  review_date: string
  reviewer: string
  review_period: string
  domain_progress: {
    domain: string
    goal: string
    current_status: string
    progress: 'improved' | 'maintained' | 'declined'
    notes: string
  }[]
  incidents?: string[]            // 특이 사건
  support_adjustments?: string    // 지원 조정 사항
  person_satisfaction?: string    // 당사자 의견
  next_review_date?: string
}
```

**TRA-006 의사결정 지원 기록**
```typescript
{
  decision_date: string
  supported_by: string            // 지원자 이름/역할
  decision_topic: string
  decision_type: '일상' | '재정' | '의료' | '법적' | '거주' | '사회활동' | '기타'
  person_preference: string       // 당사자 선호/의견
  options_presented: string[]     // 제시된 선택지
  final_decision: string
  person_agreement: boolean       // 당사자 동의 여부
  support_method: string          // 지원 방법 (AAC, 그림 등)
  notes?: string
}
```

**TRA-007 돌봄 전환 계획**
```typescript
{
  plan_date: string
  current_caregiver: string
  transition_reason: string       // 예: 보호자 고령화, 주거 이전
  target_transition_date?: string
  current_support_summary: string
  transition_options: {
    option_type: string           // 공동생활가정/지원주거/시설 등
    pros: string[]
    cons: string[]
    feasibility: 'high' | 'medium' | 'low'
  }[]
  selected_option?: string
  preparation_steps: {
    step: string
    responsible: string
    timeline: string
    status?: 'pending' | 'in_progress' | 'done'
  }[]
  stakeholders: string[]
  notes?: string
}
```

---

### F. 법적/행정

**LEG-001 장애인 증명서 보관**

> 🟧 **고유식별정보 분리 (docs/16 §3.2 / PIPA §24):** `document_number`(증명서 문서번호)는 고유식별정보다. **content에 평문 저장하지 않고** §2.14 `secure_identifiers`(`identifier_type='disability_certificate_number'`)에 암호화 저장한다. content에는 참조 ID와 표시용 마스킹 값만 둔다.

```typescript
{
  document_type: '장애인등록증' | '장애인증명서' | '복지카드' | '기타'
  issued_date: string
  issued_by: string               // 발급 기관 (주민센터 등)
  expiry_date?: string
  secure_identifier_id?: string   // → secure_identifiers.id (암호화된 문서번호 참조)
  document_number_masked?: string // 표시용 마스킹 값 — 평문 금지
  file_attached: boolean
  notes?: string
}
```

**LEG-002 수급 관련 기록**
```typescript
{
  benefit_type: '장애인연금' | '장애수당' | '활동지원급여' | '기초생활수급' | '기타급여'
  benefit_detail?: string
  application_date?: string
  approval_date?: string
  status: 'approved' | 'pending' | 'rejected' | 'terminated'
  monthly_amount?: number         // 월 수급액 (원)
  review_date?: string            // 다음 갱신 예정일
  file_attached: boolean
  notes?: string
}
```

**LEG-003 후견 관련 문서**
```typescript
{
  document_type: '성년후견' | '한정후견' | '특정후견' | '의사결정지원' | '기타'
  status: 'considering' | 'applying' | 'active' | 'not_applicable'
  guardian_name?: string
  guardian_relation?: string
  court?: string                  // 관할 법원
  decision_date?: string
  scope?: string                  // 후견 범위
  review_date?: string
  file_attached: boolean
  notes?: string
}
```

**LEG-004 의사결정 지원 계약**
```typescript
{
  contract_type: '의사결정지원신탁' | '지원계약' | '기타'
  supporter_name: string
  supporter_relation: string
  contract_date: string
  effective_date: string
  expiry_date?: string
  scope: string[]                 // 지원 범위 (재정/의료/일상 등)
  limitations?: string[]          // 제한 사항
  review_schedule?: string
  file_attached: boolean
  notes?: string
}
```

**LEG-005 노후 돌봄 계획 문서**
```typescript
{
  document_date: string
  prepared_by: string
  current_caregivers: {
    name: string
    relation: string
    age?: number
    health_status?: string
  }[]
  future_care_preferences?: string  // 당사자 선호 (있을 경우)
  identified_risks: string[]         // 위험 요인 (고령화 등)
  long_term_plan: string             // 장기 돌봄 계획
  financial_provisions?: string      // 재정 대비 사항
  legal_documents?: string[]         // 준비된 법적 문서
  review_date?: string
  file_attached: boolean
}
```

---

## 4. Enum 정의

```sql
-- 사용자 역할
CREATE TYPE user_role AS ENUM (
  'guardian',       -- 보호자
  'person',         -- 당사자
  'supporter',      -- 활동지원사
  'teacher',        -- 특수교사
  'social_worker',  -- 사회복지사
  'therapist'       -- 치료사
);

-- 분야
CREATE TYPE domain_type AS ENUM (
  'medical',        -- A. 의료/건강
  'education',      -- B. 교육
  'welfare',        -- C. 복지서비스
  'daily',          -- D. 일상/돌봄
  'transition',     -- E. 전환/자립
  'legal',          -- F. 법적/행정
  'all'             -- 전체 (권한용)
);

-- 접근 수준
CREATE TYPE access_level AS ENUM (
  'read',           -- 열람만
  'write',          -- 새 기록 작성
  'edit',           -- 기존 기록 수정 포함
  'admin'           -- 전체 관리 (주보호자 전용 — 권한 부여 위자드로 위임 불가)
);

-- 생애주기 단계
CREATE TYPE life_stage AS ENUM (
  'infant',         -- 영유아 (0-5)
  'child',          -- 아동 (6-12)
  'adolescent',     -- 청소년 (13-18)
  'young_adult',    -- 성인전환기 (19-24)
  'adult',          -- 성인 (25-39)
  'senior'          -- 중장년/노년 (40+)
);

-- 이정표 분류
CREATE TYPE milestone_category AS ENUM (
  'diagnosis',          -- 진단
  'school_entry',       -- 입학
  'graduation',         -- 졸업/수료
  'service_start',      -- 서비스 시작
  'service_end',        -- 서비스 종료
  'employment',         -- 취업/직업훈련 시작
  'independent',        -- 자립생활 시작
  'caregiver_change',   -- 담당자 교체
  'medical_event',      -- 주요 의료 사건
  'legal_change',       -- 법적 지위 변경
  'other'
);

-- 고유식별정보 유형 (secure_identifiers — PIPA §24, docs/16 §3.2)
CREATE TYPE secure_identifier_type AS ENUM (
  'disability_registration_number',  -- 장애인 등록번호 (WEL-001)
  'disability_certificate_number'    -- 장애인 증명서 문서번호 (LEG-001)
);

-- 동의 유형 (consents — PIPA §22~24, docs/16 §2·§3)
CREATE TYPE consent_type AS ENUM (
  'terms_of_service',       -- 이용약관 (필수)
  'privacy_required',       -- 개인정보 수집·이용 (필수)
  'sensitive_info',         -- 민감정보 별도 동의 (필수, docs/16 §3.1)
  'unique_identifier',      -- 고유식별정보 별도 동의 (필수, docs/16 §3.2)
  'third_party_processing', -- 위탁·국외이전 고지·동의 (docs/16 §6)
  'marketing'               -- 마케팅·부가서비스 알림 (선택)
);
```

---

## 5. 인덱스 전략

```sql
-- records 테이블 (가장 빈번히 조회)
CREATE INDEX idx_records_person_domain ON records(person_id, domain);
CREATE INDEX idx_records_person_date ON records(person_id, record_date DESC);
CREATE INDEX idx_records_author ON records(author_id);
CREATE INDEX idx_records_life_stage ON records(person_id, life_stage);
CREATE INDEX idx_records_milestone ON records(person_id) WHERE is_milestone = true;

-- permissions 테이블
CREATE INDEX idx_permissions_person_user ON permissions(person_id, user_id);
CREATE INDEX idx_permissions_user_active ON permissions(user_id, is_active) WHERE is_active = true;
CREATE UNIQUE INDEX idx_permissions_unique ON permissions(person_id, user_id, domain);

-- self_expressions 테이블
CREATE INDEX idx_self_expr_person_date ON self_expressions(person_id, expression_date DESC);

-- access_logs 테이블 (파티셔닝 고려)
CREATE INDEX idx_access_logs_person ON access_logs(person_id, created_at DESC);
CREATE INDEX idx_access_logs_user ON access_logs(user_id, created_at DESC);

-- notifications 테이블
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, is_read, created_at DESC);

-- soft-delete 부분 인덱스 (deleted_at IS NULL 행만 조회 — docs/16 §4.3)
-- 활성 행 위주 조회 성능 유지 + 유니크 제약을 활성 행으로 한정
CREATE INDEX idx_records_active ON records(person_id, record_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_self_expr_active ON self_expressions(person_id, expression_date DESC) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_self_expr_unique_active ON self_expressions(person_id, expression_date) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_guardian_persons_unique_active ON guardian_persons(guardian_id, person_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_persons_active ON persons(id) WHERE deleted_at IS NULL;

-- secure_identifiers / consents (docs/16 §3·§2)
CREATE INDEX idx_secure_ident_person ON secure_identifiers(person_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_consents_subject ON consents(subject_user_id, consent_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_consents_person ON consents(person_id, consent_type) WHERE deleted_at IS NULL;
```

> **soft-delete 인덱스 영향:** 기존 비조건부 유니크 제약(`guardian_persons`·`self_expressions`)은 soft-delete 행이 유니크 충돌을 일으키므로, 위 **부분 유니크 인덱스**(`WHERE deleted_at IS NULL`)로 대체해 파기 후 재등록을 허용한다. 모든 일반 조회 쿼리는 `WHERE deleted_at IS NULL`을 기본 포함한다(RLS 정책에도 반영 — data-infra가 docs/13에서 처리 🟡).

---

## 6. 제약조건 요약

| 테이블 | 제약조건 | 설명 |
|--------|---------|------|
| `guardian_persons` | UNIQUE(guardian_id, person_id) | 중복 연결 방지 |
| `permissions` | UNIQUE(person_id, user_id, domain) | 분야별 1개 권한 |
| `permissions` | valid_from <= valid_until | 기간 논리적 순서 |
| `self_expressions` | UNIQUE(person_id, expression_date) | 하루 1건 |
| `record_files` | record_id XOR self_expression_id NOT NULL | 하나에만 연결 |
| `records` | domain IN Enum값 | 유효 분야만 |
| `notifications` | record_id XOR self_expression_id (둘 중 최대 하나만 NOT NULL) | 알림 원본 참조 무결성 |
| `access_logs` | INSERT 전용 (UPDATE/DELETE 불가) | 감사 로그 불변성 (`deleted_at` 없음 — append-only) |
| `permission_logs` | INSERT 전용 | 권한 이력 불변성 (`deleted_at` 없음 — append-only) |
| `secure_identifiers` | `encrypted_value` 평문 저장 금지 | 고유식별정보 암호화 의무 (PIPA §24, docs/16 §3.2) |
| `consents` | subject_user_id XOR person_id (둘 중 하나 NOT NULL) | 동의 대상 무결성 |
| 사용자 대면 테이블 | `deleted_at` 부분 유니크 인덱스 `WHERE deleted_at IS NULL` | soft-delete 후 재등록 허용 (docs/16 §4.3) |
