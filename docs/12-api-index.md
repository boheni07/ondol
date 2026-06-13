# API 엔드포인트 인덱스 — OnDol 플랫폼

> 버전: v1.0 | 작성일: 2026-06-14

WBS(`docs/08-wbs.md`)의 각 작업 산출물 열에 흩어져 있는 API 연동 항목을 리소스 그룹별 단일 인덱스로 정리한 문서다. 요청/응답 계약(스키마·상태 코드)의 상세는 구현 단계(Phase 4 — API 설계·구현)에서 OpenAPI로 확정한다.

---

## 작성 원칙

- 본 인덱스의 엔드포인트는 **`docs/08-wbs.md`의 산출물 열에 명시된 것만** 수록한다. WBS에 없는 경로는 추가하지 않았다.
- 요청/응답 JSON 스키마는 현재 정의된 바가 없으므로 **임의로 정의하지 않으며, 구현 시 OpenAPI로 확정**한다.
- 인증/권한 열은 `docs/03-erd.md` §RLS 정책 요약을 근거로 한다. WBS·ERD에 명시가 없어 추정한 경우 **"(권한)"** 로 표기한다.
- DB 트리거·scheduled fn·edge function 등 **HTTP 엔드포인트가 아닌 산출물**(예: `DB trigger`, `scheduled fn`, `notification fn`)은 본 인덱스에 수록하지 않았다.
- 타임라인 필터처럼 산출물이 쿼리 파라미터(`?domain=` 등)로만 표기된 항목은, 부착되는 기준 엔드포인트(`GET /persons/:id/timeline`)의 쿼리 파라미터로 통합 기재했다.

---

## 1. 인증 (Auth) — Phase 2

| METHOD path | 설명 | 인증/권한 | WBS ID |
|---|---|---|---|
| POST /signup | 이메일/비밀번호 회원가입(역할 분기) | 공개 | 2.1 |
| POST /login | 이메일/비밀번호 로그인 + JWT 발급 | 공개 | 2.2 |
| POST /logout | 로그아웃(세션/토큰 무효화) | 인증 | 2.3 |
| POST /verify-email | 이메일 인증 메일 발송 | 공개 | 2.4 |
| POST /verify-email/confirm | 이메일 인증 토큰 확인 + 계정 활성화 | 공개(토큰) | 2.5 |
| POST /reset-password | 비밀번호 재설정 요청 | 공개 | 2.6 |
| POST /reset-password/confirm | 비밀번호 재설정 확인 | 공개(토큰) | 2.7 |
| POST /invites | 초대 링크 생성(전문가/공동보호자) | 인증·(권한) 주보호자 | 2.8 |
| POST /invites/:token/accept | 초대 링크 수락(가입/연결 분기 + 권한 매핑) | 공개(토큰) | 2.9 |
| POST /auth/kakao | 카카오 OAuth 소셜 로그인 (P1) | 공개 | 2.10 |
| POST /auth/naver | 네이버 OAuth 소셜 로그인 (P1) | 공개 | 2.11 |

---

## 2. 사용자 (Users) — Phase 3.1

| METHOD path | 설명 | 인증/권한 | WBS ID |
|---|---|---|---|
| GET /users/:id | 사용자 프로필 단건 조회 | 인증·(권한) 범위 내 | 3.1.1 |
| PATCH /users/:id | 사용자 프로필 수정 | 인증·본인 | 3.1.2 |
| PATCH /users/:id/deactivate | 사용자 비활성화(soft delete) | 인증·본인 | 3.1.3 |
| GET /users?q= | 사용자 검색(이메일·전화) | 인증 | 3.1.4 |
| GET /users?role= | 역할 기반 사용자 필터 (P1) | 인증 | 3.1.5 |
| GET /users/:id/permissions | 사용자별 받은 권한 목록 | 인증·(권한) | 4.1.4 |
| GET /users/:id/permission-logs | 사용자별 권한 변동 이력 | 인증·(권한) | 4.3.3 |

---

## 3. 당사자 (Persons) — Phase 3.2

| METHOD path | 설명 | 인증/권한 | WBS ID |
|---|---|---|---|
| POST /persons | 당사자 신규 등록(+매핑 자동 연결) | 인증·보호자 | 3.2.1 |
| GET /persons/:id | 당사자 단건 조회 | RLS(보호자/본인/권한자) | 3.2.2 |
| GET /persons?guardian= | 당사자 목록 조회(보호자 기준) | 인증·보호자 | 3.2.3 |
| PATCH /persons/:id | 당사자 기본정보 수정 | 인증·(권한) 보호자 | 3.2.4 |
| PATCH /persons/:id/emergency | 당사자 응급정보 수정(추가 인증) | 인증·(권한) 보호자+추가인증 | 3.2.5 |
| POST /persons/:id/photo | 당사자 사진 업로드(presigned) | 인증·(권한) 보호자 | 3.2.6 |
| DELETE /persons/:id/photo | 당사자 사진 삭제 | 인증·(권한) 보호자 | 3.2.7 |
| PATCH /persons/:id/archive | 당사자 비활성화/이장(archive) (P1) | 인증·(권한) 보호자 | 3.2.8 |

> `3.2.9 당사자 생애주기 자동 계산`은 산출물이 `DB trigger`이므로 HTTP 엔드포인트에서 제외.

---

## 4. 매핑 (Guardian-Persons / Person-Accounts) — Phase 3.3·3.4

| METHOD path | 설명 | 인증/권한 | WBS ID |
|---|---|---|---|
| POST /guardian-persons | 보호자-당사자 연결 생성 | 인증·보호자 | 3.3.1 |
| GET /guardian-persons/:id | 보호자-당사자 매핑 단건 조회 | 인증·(권한) | 3.3.2 |
| GET /persons/:id/guardians | 당사자별 보호자 목록 | 인증·(권한) 보호자 | 3.3.3 |
| PATCH /guardian-persons/:id/primary | 주보호자 변경(단일 제약) | 인증·(권한) 주보호자 | 3.3.4 |
| PATCH /guardian-persons/:id | 관계(부/모/후견인) 수정 | 인증·(권한) 보호자 | 3.3.5 |
| DELETE /guardian-persons/:id | 보호자 연결 해제 (P1) | 인증·(권한) 주보호자 | 3.3.6 |
| POST /person-accounts | 당사자 계정 생성(선택적) | 인증·(권한) 보호자 | 3.4.1 |
| GET /person-accounts/:id | 접근성 설정 조회 | 인증·본인/보호자 | 3.4.2 |
| PATCH /person-accounts/:id | 접근성 설정 수정 | 인증·본인/보호자 | 3.4.3 |
| PATCH /person-accounts/:id/ui-mode | UI 모드(아이콘/혼합) 변경 | 인증·본인/보호자 | 3.4.4 |

---

## 5. 권한 (Permissions) — Phase 4

| METHOD path | 설명 | 인증/권한 | WBS ID |
|---|---|---|---|
| POST /permissions | 권한 부여(도메인·수준·기간 UPSERT) | 인증·(권한) 주보호자 | 4.1.1 |
| GET /permissions/:id | 권한 단건 조회 | 인증·(권한) | 4.1.2 |
| GET /persons/:id/permissions | 당사자별 권한 매트릭스 조회 | 인증·(권한) 보호자 | 4.1.3 |
| PATCH /permissions/:id | 권한 수정(수준/기간 변경) | 인증·(권한) 주보호자 | 4.1.5 |
| DELETE /permissions/:id | 권한 즉시 회수 | 인증·(권한) 주보호자 | 4.1.6 |
| GET /persons/:id/permission-logs | 당사자별 권한 변경 이력 조회 | 인증·(권한) 보호자 | 4.3.2 |

> `4.1.7 기간 만료 자동 회수`·`4.1.8 만료 7일 전 알림`은 산출물이 `scheduled fn`, `4.2.* 권한 위자드`는 `UI step`, `4.3.1 자동 로그`는 `DB trigger`, `4.4.* RLS 검증`은 trigger/fn 이므로 HTTP 엔드포인트에서 제외.

---

## 6. 기록 (Records) — Phase 5

> 6 도메인(MED·EDU·WEL·DAI·TRA·LEG)의 개별 기록 유형(5.A~5.F)은 모두 공통 CRUD 엔드포인트(`/records`, `/persons/:id/records`)를 `domain`·`record_type`으로 분기하여 사용한다. 유형별 전용 경로는 WBS에 정의되어 있지 않으므로 별도 기재하지 않는다.

| METHOD path | 설명 | 인증/권한 | WBS ID |
|---|---|---|---|
| POST /records | 기록 생성(도메인 무관, content JSONB 검증) | RLS·write 이상 | 5.0.1 |
| GET /records/:id | 기록 단건 조회 | RLS(보호자/본인/권한자) | 5.0.2 |
| GET /persons/:id/records | 당사자별 기록 목록(페이징·필터·정렬) | RLS | 5.0.3 |
| GET /persons/:id/records?domain= | 분야별 기록 목록 | RLS | 5.0.4 |
| PATCH /records/:id | 기록 수정 | RLS·write 이상 | 5.0.5 |
| DELETE /records/:id | 기록 삭제 | RLS·보호자 권한 | 5.0.6 |
| PATCH /records/:id/draft | 기록 임시저장(is_draft) | RLS·작성자 | 5.0.7 |
| PATCH /records/:id/milestone | 기록 이정표 표시 | RLS·(권한) | 5.0.8 |
| PATCH /records/:id/pin | 기록 고정/해제 | RLS·(권한) | 5.0.9 |
| PATCH /records/:id/tags | 기록 태그 추가/제거 (P1) | RLS·(권한) | 5.0.10 |
| GET /records?q= | 기록 전문 검색 (P1) | RLS | 5.0.11 |
| POST /records/export | 기록 일괄 내보내기(PDF/CSV) (P1) | RLS·(권한) 보호자 | 5.0.12 |
| GET /records/stats?by=author | 기록 작성자별 카운트 (P2) | RLS·(권한) | 5.0.13 |
| GET /records/:id/files | 기록별 첨부 파일 목록 | RLS | 7.4 |

---

## 7. 자기표현 (Self-Expressions) — Phase 6

| METHOD path | 설명 | 인증/권한 | WBS ID |
|---|---|---|---|
| POST /self-expressions | 자기표현 입력(날짜별 1건) | 인증·당사자 본인 | 6.1 |
| GET /self-expressions/:date | 자기표현 단건 조회(날짜별 UNIQUE) | 인증·(권한) 본인/보호자 | 6.2 |
| GET /self-expressions?month= | 자기표현 목록(월·주 단위) | 인증·(권한) 본인/보호자 | 6.3 |
| PATCH /self-expressions/:id | 자기표현 수정(당일만) | 인증·당사자 본인 | 6.4 |
| POST /self-expressions/:id/photo | 자기표현 사진 업로드(presigned) | 인증·당사자 본인 | 6.5 |
| POST /self-expressions/:id/voice | 자기표현 음성 메모 업로드 (P1) | 인증·당사자 본인 | 6.6 |
| GET /self-expressions/stats | 자기표현 통계(연속 일수 등) (P1) | 인증·(권한) 본인/보호자 | 6.8 |
| GET /self-expressions/:id/files | 자기표현별 첨부 파일 목록 | 인증·(권한) | 7.5 |

> `6.7 자기표현 보호자 요약 발송`은 산출물이 `notification fn`이므로 HTTP 엔드포인트에서 제외.

---

## 8. 파일 (Files) — Phase 7

| METHOD path | 설명 | 인증/권한 | WBS ID |
|---|---|---|---|
| POST /files/presign | Presigned URL 발급(업로드용) | 인증·(권한) | 7.1 |
| POST /files | 파일 메타데이터 등록 | 인증·(권한) | 7.2 |
| GET /files/:id | 파일 단건 조회 + 다운로드 URL | 인증·(권한) | 7.3 |
| PATCH /files/:id | 파일 메타 수정(제목/민감도) | 인증·(권한) | 7.6 |
| DELETE /files/:id | 파일 삭제(storage + meta) | 인증·(권한) | 7.7 |

> 기록·자기표현별 파일 목록(`GET /records/:id/files` 7.4, `GET /self-expressions/:id/files` 7.5)은 각각 6·7번 그룹에 기재. `7.8 민감 파일 추가 인증`(middleware)·`7.9 바이러스 스캔`(edge function)은 엔드포인트가 아니므로 제외.

---

## 9. 이정표 · 타임라인 (Milestones / Timeline) — Phase 8

| METHOD path | 설명 | 인증/권한 | WBS ID |
|---|---|---|---|
| POST /milestones | 이정표 추가 | RLS·(권한) 보호자 | 8.1.1 |
| GET /milestones/:id | 이정표 단건 조회 | RLS | 8.1.2 |
| GET /persons/:id/milestones | 당사자별 이정표 목록 | RLS | 8.1.3 |
| PATCH /milestones/:id | 이정표 수정 | RLS·(권한) 보호자 | 8.1.4 |
| DELETE /milestones/:id | 이정표 삭제 | RLS·(권한) 보호자 | 8.1.5 |
| GET /milestones?category= | 카테고리별 이정표 필터 | RLS | 8.1.6 |
| GET /persons/:id/timeline | 통합 타임라인 조회(시간 역순) | RLS | 8.2.1 |
| POST /timeline/export | 타임라인 PDF 내보내기 (P1) | RLS·(권한) 보호자 | 8.2.7 |

> 타임라인 필터(8.2.2~8.2.6)는 `GET /persons/:id/timeline`의 쿼리 파라미터로 통합: `?domain=`(분야), `?life_stage=`(생애주기), `?from=&to=`(날짜 범위), `?milestones_only=true`(이정표만), `?author=`(작성자별, P1). `8.2.8 생애주기 자동 마커`는 `DB trigger`이므로 제외.

---

## 10. 인수인계 (Handover) — Phase 9

| METHOD path | 설명 | 인증/권한 | WBS ID |
|---|---|---|---|
| POST /handovers | 인수인계 생성(4스텝) | 인증·(권한) 전문가 | 9.1.1 |
| GET /handovers/:id | 인수인계 단건 조회(연계 기록 포함) | 인증·(권한) 당사자 관계자 | 9.1.2 |
| GET /handovers/received | 받은 인계 목록 | 인증·수신자 | 9.1.3 |
| GET /handovers/sent | 전달한 인계 목록 | 인증·발신자 | 9.1.4 |
| PATCH /handovers/:id | 인계 수정(미확인 상태에서만) | 인증·발신자 | 9.1.5 |
| DELETE /handovers/:id | 인계 삭제/취소 (P1) | 인증·발신자 | 9.1.6 |
| PATCH /handovers/:id/confirm | 인계 확인 처리(is_confirmed) | 인증·수신자 | 9.2.5 |

> 인계 플로우 Step1~4(9.2.1~9.2.4)는 `UI step` 산출물, `9.2.6 권한 자동 이양`은 `trigger`이므로 엔드포인트에서 제외.

---

## 11. 알림 (Notification) — Phase 10

| METHOD path | 설명 | 인증/권한 | WBS ID |
|---|---|---|---|
| GET /notifications/:id | 알림 단건 조회 | 인증·수신자 | 10.1.2 |
| GET /notifications | 사용자별 알림 목록(페이징) | 인증·수신자 | 10.1.3 |
| PATCH /notifications/:id/read | 알림 읽음 처리 | 인증·수신자 | 10.1.4 |
| PATCH /notifications/read-all | 알림 일괄 읽음 처리 | 인증·수신자 | 10.1.5 |
| DELETE /notifications/:id | 알림 삭제 (P1) | 인증·수신자 | 10.1.6 |
| GET /notification-settings | 사용자별 채널 설정 조회 | 인증·본인 | 10.2.4 |
| PATCH /notification-settings | 사용자별 채널 설정 수정 | 인증·본인 | 10.2.5 |
| PATCH /notification-settings/types | 알림 유형별 토글(매트릭스) | 인증·본인 | 10.2.6 |
| PATCH /notification-settings/quiet-hours | 방해 금지 시간대 설정 (P1) | 인증·본인 | 10.2.7 |
| POST /push-tokens | 푸시 토큰 등록(앱 설치) | 인증·본인 | 10.2.8 |

> `10.1.1 알림 생성`(trigger fn), `10.2.1 FCM`·`10.2.2 이메일`·`10.2.3 SMS`(edge function)는 발송 인프라이며 HTTP 엔드포인트가 아니므로 제외.

---

## 12. 접근 로그 (Audit) — Phase 11

| METHOD path | 설명 | 인증/권한 | WBS ID |
|---|---|---|---|
| GET /persons/:id/access-logs | 당사자별 접근 로그 조회 | 인증·(권한) 보호자 | 11.4 |
| POST /access-logs/export | 접근 로그 CSV 내보내기 | 인증·(권한) 보호자 | 11.7 |

> 접근 로그 필터(11.5)는 `GET /persons/:id/access-logs`의 쿼리 파라미터 `?filter=`(날짜·접근자·동작)로 통합. `11.1~11.3 자동 로깅`(DB trigger), `11.6 이상 활동 감지`(edge function), `11.8 월간 보고서`(scheduled fn)는 엔드포인트가 아니므로 제외. `access_logs` 테이블은 INSERT-only이며 UPDATE/DELETE는 RLS로 자동 거부된다(`docs/03-erd.md` §RLS).

---

## 13. 공통 규약 (구현 시 확정 — TBD)

아래 항목은 현재 docs에 구체 명세가 없다. **구현 단계(Phase 4)에서 OpenAPI 스펙으로 확정**하며, 본 인덱스에서는 임의로 정의하지 않는다.

| 항목 | 현재 상태 | 비고 |
|---|---|---|
| 인증 헤더(JWT) | TBD | `POST /login`(2.2)에서 JWT 발급. 헤더 형식·만료·리프레시 토큰 정책은 구현 시 확정. `bkit:bkend-auth` 참고. |
| 페이징(`?page` / `?limit`) | TBD | `GET /persons/:id/records`(5.0.3)·`GET /notifications`(10.1.3) 등 목록 API에 페이징이 명시되어 있으나, 파라미터명·기본값·응답 메타(total·cursor 등) 형태는 구현 시 확정. |
| 정렬·필터 파라미터 | TBD | 도메인 필터(`?domain=`)·카테고리(`?category=`)·날짜 범위(`?from=&to=`) 등은 WBS에 표기된 파라미터만 본 인덱스에 반영. 그 외 정렬 키·다중 필터 조합은 구현 시 확정. |
| 에러 응답 형태 | TBD | 에러 코드·메시지·HTTP status 매핑 표준은 정의되지 않음. 구현 시 확정. |
| 상태 코드 / 요청·응답 JSON 스키마 | TBD | 리소스·필드는 `docs/02-data-specification.md`, JSONB content 스키마는 동 문서 §3 참고. 엔드포인트별 요청/응답 본문은 **구현 시 OpenAPI로 확정**. |
| Rate Limiting | TBD | `17.2.7 Rate Limiting (API)`로 적용 예정. 임계값·대상 경로는 구현 시 확정. |

---

## 부록 — 비-HTTP 산출물 (참고)

다음 WBS 산출물은 HTTP 엔드포인트가 아니어서 본 인덱스에서 제외했으나, API 동작과 연계되므로 참고용으로 명시한다.

- **DB trigger**: 3.2.9(생애주기 계산), 4.3.1(권한 로그), 4.4.1(권한 외 접근 감지), 8.2.8(생애주기 마커), 11.1·11.2(read/write 자동 로깅)
- **scheduled fn (cron)**: 4.1.7(만료 자동 회수), 4.1.8(만료 7일 전 알림), 11.8(월간 보고서)
- **notification / edge function**: 4.4.2(이상 접근 알림), 6.7(자기표현 요약), 10.1.1(알림 생성), 10.2.1(FCM), 10.2.2(이메일), 10.2.3(SMS), 11.6(이상 활동 감지)
- **middleware / 기타**: 7.8(민감 파일 추가 인증), 7.9(바이러스 스캔)

---

> 본 인덱스는 `docs/08-wbs.md`(WBS) 산출물 열을 단일 출처로 추출했으며, 인증/권한 근거는 `docs/03-erd.md` §RLS, 리소스·필드는 `docs/02-data-specification.md`, 기능 흐름은 `docs/05-workflows-feature.md`를 참조한다. 요청/응답 계약 상세는 구현 단계(Phase 4)에서 OpenAPI로 확정한다.
