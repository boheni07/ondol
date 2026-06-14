# 화면 인벤토리 (SSOT) — OnDol 플랫폼

> 버전: v1.1 | 작성일: 2026-06-14
> 화면 수의 단일 기준(Single Source of Truth). `06-information-architecture.md`(논리 IA), `08-wbs.md`(구현 작업), `wireframes/index.html`(미리보기)의 화면 수치가 단위 차이로 달라 보일 때 본 문서를 기준으로 한다.

> **v1.1 개정(2026-06-14, 동의 수집 워크플로우 전파):** `docs/05 §1-3·§10` 동의 수집 흐름 및 `docs/16 §5·§7`(권리행사·처리방침 게시 의무)에 따라 동의 관련 화면 5종(A-08·A-09·A-10·G-65·P-23)을 웹+모바일 양 플랫폼에 추가했다. G-03 당사자 등록 위자드에는 민감/고유식별 동의 Step이 삽입된다(신규 화면 아님, 위자드 Step 확장 — 아래 §1.2 주석 참조). 총계: **웹 62→67 · 모바일 24→29 (총 86→96).**

## 카운트 기준 정의

| 단위 | 정의 | 총계 |
|------|------|:----:|
| **논리 화면(IA)** | `06-information-architecture.md` 사이트맵의 스크린 ID 수 | 웹 82 · 모바일 75 |
| **구현 SVG(본 문서)** | 실제 제작된 와이어프레임 파일 수. 일부 논리 화면을 1파일로 병합(예: 목록+상세, 수정+회수 모달) | **웹 67 · 모바일 29 (총 96)** |
| **구현 작업(WBS)** | `08-wbs.md` §13~16의 화면 구현 작업 수 | 별도 집계 |

> 셋은 **세는 단위가 다를 뿐 모순이 아니다.** 진척·산출물 대조는 본 문서(구현 SVG)를 기준으로 한다.

---

## 1. 반응형 웹 (67 SVG)

### 1.1 인증 · 공통 (A) — 9
| ID | 화면명 | SVG | 타입 |
|----|--------|-----|------|
| A-01 | 로그인 | web/01-login.svg | ST-09 |
| A-03 | 회원가입 · 역할 선택 | web/11-signup-role.svg | ST-09 |
| A-04 | 회원가입 · 기본 정보 | web/12-signup-profile.svg | ST-09 |
| A-05 | 이메일 인증 | web/13-signup-verify.svg | ST-09 |
| A-06 | 초대 링크 수락 | web/14-invite-accept.svg | ST-09 |
| A-07 | 비밀번호 재설정 | web/15-reset-password.svg | ST-09 |
| A-08 | 회원가입 · 동의 수집 | web/63-signup-consent.svg | ST-09 |
| A-09 | 이용약관 전문 | web/64-legal-terms.svg | ST-03 |
| A-10 | 개인정보 처리방침 전문 | web/65-legal-privacy.svg | ST-03 |

> A-02(자동 로그인/세션)는 논리 화면이나 별도 와이어프레임 미제작.
> A-08(동의 수집, docs/05 §1-3): 필수/선택 분리 체크박스 — 회원가입 플로우 내 단계. A-09·A-10은 정적 전문 페이지(docs/16 §7 게시 의무), A-08의 "전문 보기"·푸터·설정에서 진입.

### 1.2 보호자 (Guardian) — 21
| ID | 화면명 | SVG | 타입 |
|----|--------|-----|------|
| G-01 | 대시보드 | web/02-guardian-dashboard.svg | ST-01 Hub |
| G-02 | 당사자 프로필 | web/16-guardian-person-profile.svg | ST-03 |
| G-03 | 당사자 등록 위자드 | web/17-guardian-person-register.svg | ST-05 ✚ |
| G-10 | 생애 타임라인 | web/03-timeline.svg | ST-06 |
| G-20 | 기록 관리(전체) | web/04-record-list.svg | ST-02 |
| G-21 | 분야별 기록 | web/18-guardian-records-domain.svg | ST-02 |
| G-22 | 기록 상세(Split) | web/05-record-detail.svg | ST-03 |
| G-23 | 기록 작성 | web/06-record-form.svg | ST-05 |
| G-24 | 기록 수정 | web/19-guardian-record-edit.svg | ST-05 |
| G-30 | 권한 매트릭스 | web/07-permission-matrix.svg | ST-07 |
| G-31 | 이해관계자 상세 | web/20-guardian-stakeholder-detail.svg | ST-03 |
| G-32 | 권한 부여 위자드 | web/21-guardian-grant-wizard.svg | ST-05 |
| G-33/34 | 권한 수정+회수 모달 | web/28-guardian-permission-modals.svg | ST-10 |
| G-40 | 접근 로그 | web/22-guardian-access-log.svg | ST-07 |
| G-50 | 알림 | web/23-guardian-notifications.svg | ST-02 |
| G-60 | 설정 허브 | web/10-settings.svg | ST-11 |
| G-61 | 프로필 편집 | web/24-guardian-profile-edit.svg | ST-04 |
| G-62 | 당사자 정보 편집 | web/25-guardian-person-edit.svg | ST-04 |
| G-63 | 응급 정보 편집 | web/26-guardian-emergency-edit.svg | ST-04 |
| G-64 | 알림 설정 | web/27-guardian-notification-settings.svg | ST-11 |
| G-65 | 개인정보·동의 관리 | web/66-guardian-consent-mgmt.svg | ST-11 |

> ✚ G-03 위자드는 docs/05 §1-3에 따라 **민감/고유식별 동의 Step**이 삽입된다(신규 SVG 아님 — 기존 web/17 위자드에 동의 Step 화면 1개 추가). docs/06 Flow-2 참조.
> G-65(docs/16 §5 권리행사 창구): 동의 현황·철회·데이터 내보내기. 설정 허브(G-60) 하위 진입.

### 1.3 당사자 (Person · 접근성) — 9
| ID | 화면명 | SVG | 타입 |
|----|--------|-----|------|
| P-01 | 오늘 기록 홈 | web/08-person-home.svg | ST-01 Accessible |
| P-02 | 자기표현 위자드 | web/09-self-expression.svg | ST-08 |
| P-10 | 내 기록(분야 그리드) | web/29-person-records.svg | ST-02 |
| P-11 | 기록 상세(쉬운 요약) | web/30-person-record-detail.svg | ST-03 |
| P-20 | 설정 허브(큰 카드) | web/31-person-settings.svg | ST-11 |
| P-21 | 접근성 설정 | web/32-person-accessibility.svg | ST-11 |
| P-22 | 내 정보 | web/33-person-profile.svg | ST-04 |
| P-23 | 내 동의·권리 관리(쉬운 언어·대형 UI) | web/67-person-consent-mgmt.svg | ST-11 Accessible |
| P-30 | 알림(큰 카드) | web/34-person-notifications.svg | ST-02 |

> P-23(docs/16 §5.2 본인 권리 행사, docs/05 §10 성년 도달 동의 재취득): 성년 전환 당사자가 본인 명의로 동의 현황·철회를 관리. 당사자 접근성 모드(대형 UI·쉬운 언어, 디자인시스템 docs/07 §9) 적용. P0~P2 우선순위 중 P2(전환기 도래 시 활성).

### 1.4 활동지원사 (Supporter) — 7
| ID | 화면명 | SVG | 타입 |
|----|--------|-----|------|
| S-01 | 홈 | web/35-supporter-home.svg | ST-01 |
| S-10 | 일지 목록 | web/36-supporter-journal-list.svg | ST-02 |
| S-11 | 일지 상세 | web/37-supporter-journal-detail.svg | ST-03 |
| S-12 | 일지 작성 위자드 | web/38-supporter-journal-form.svg | ST-05 |
| S-20 | 인수인계 목록 | web/39-supporter-handover-list.svg | ST-02 |
| S-21 | 인계 상세 | web/40-supporter-handover-detail.svg | ST-03 |
| S-30/40 | 알림+설정 | web/41-supporter-notifications-settings.svg | ST-02+11 |

### 1.5 특수교사 (Teacher) — 9
| ID | 화면명 | SVG | 타입 |
|----|--------|-----|------|
| T-01 | 홈(담당 학생) | web/42-teacher-home.svg | ST-01 |
| T-11 | IEP 목록 | web/43-teacher-iep-list.svg | ST-02 |
| T-12 | IEP 상세 | web/44-teacher-iep-detail.svg | ST-03 |
| T-13 | IEP 작성 위자드 | web/45-teacher-iep-form.svg | ST-05 |
| T-14 | IEP 학기말 점검 | web/46-teacher-iep-review.svg | ST-04 |
| T-15/16 | 관찰 목록+작성 | web/47-teacher-observation.svg | ST-02+04 |
| T-17/18 | 전환교육 목록+작성 | web/48-teacher-transition.svg | ST-02+05 |
| T-20 | 교육 타임라인 | web/49-teacher-timeline.svg | ST-06 |
| T-30/40 | 알림+설정 | web/50-teacher-notifications-settings.svg | ST-02+11 |

### 1.6 사회복지사 (Social Worker) — 7
| ID | 화면명 | SVG | 타입 |
|----|--------|-----|------|
| W-01 | 홈 | web/51-worker-home.svg | ST-01 |
| W-11/12 | ISP 목록+상세 | web/52-worker-isp.svg | ST-02+03 |
| W-13/14 | ISP 작성+점검 | web/53-worker-isp-form.svg | ST-05+04 |
| W-15/16 | 전환계획 목록+작성 | web/54-worker-transition.svg | ST-02+05 |
| W-17/20 | 서비스 매트릭스+타임라인 | web/55-worker-service-matrix.svg | ST-07+06 |
| W-30/31 | 인계 목록+생성 | web/56-worker-handover-create.svg | ST-02+05 |
| W-40/50 | 알림+설정 | web/57-worker-notifications-settings.svg | ST-02+11 |

### 1.7 치료사 (Therapist) — 5
| ID | 화면명 | SVG | 타입 |
|----|--------|-----|------|
| TH-01 | 홈(오늘 회기) | web/58-therapist-home.svg | ST-01 |
| TH-11/12 | 치료계획서 목록+상세 | web/59-therapist-plan.svg | ST-02+03 |
| TH-13/15 | 계획서 작성+회기 일지 | web/60-therapist-session-form.svg | ST-05+04 |
| TH-14/16/17 | 회기 목록+평가 보고서 | web/61-therapist-evaluation.svg | ST-02+05 |
| TH-20/30/40 | 타임라인+알림+설정 | web/62-therapist-timeline-settings.svg | ST-06+02+11 |

---

## 2. 모바일 앱 (29 SVG)

### 2.1 인증 + 보호자 — 14
| ID | 화면명 | SVG |
|----|--------|-----|
| A-01 | 로그인 | mobile/01-m-login.svg |
| A-03 | 회원가입 역할 | mobile/06-m-signup-role.svg |
| A-08 | 회원가입 동의 수집 | mobile/25-m-signup-consent.svg |
| A-09 | 이용약관 전문 | mobile/26-m-legal-terms.svg |
| A-10 | 개인정보 처리방침 전문 | mobile/27-m-legal-privacy.svg |
| G-01 | 보호자 홈 | mobile/02-m-guardian-home.svg |
| G-10 | 타임라인 | mobile/03-m-timeline.svg |
| G-22 | 기록 상세 | mobile/07-m-record-detail.svg |
| G-23 | 기록 작성 | mobile/08-m-record-form.svg |
| G-30 | 권한 카드 리스트 | mobile/09-m-permissions.svg |
| G-32 | 권한 부여 위자드 | mobile/10-m-grant-wizard.svg |
| G-50 | 알림 | mobile/11-m-notifications.svg |
| G-60 | 설정 | mobile/12-m-settings.svg |
| G-65 | 개인정보·동의 관리 | mobile/28-m-guardian-consent-mgmt.svg |

> 모바일 A-08은 회원가입 Full-screen Flow 내 동의 Step, A-09·A-10은 NavBar Push 정적 페이지. G-65는 설정(G-60) 하위 Push. G-03 위자드 동의 Step은 mobile/10 계열 위자드 흐름에 포함(신규 SVG 아님).

### 2.2 당사자 (접근성) — 6
| ID | 화면명 | SVG |
|----|--------|-----|
| P-01 | 오늘 기록 홈 | mobile/04-m-person-home.svg |
| P-02 | 자기표현 위자드 | mobile/05-m-self-expression.svg |
| P-10 | 내 기록(6분야) | mobile/13-m-person-records.svg |
| P-11 | 기록 상세 | mobile/14-m-person-record-detail.svg |
| P-20 | 설정(큰 카드) | mobile/15-m-person-settings.svg |
| P-23 | 내 동의·권리 관리(대형 UI) | mobile/29-m-person-consent-mgmt.svg |

### 2.3 활동지원사 — 3
| ID | 화면명 | SVG |
|----|--------|-----|
| S-01 | 홈(FAB) | mobile/16-m-supporter-home.svg |
| S-12 | 일지 작성 위자드 | mobile/17-m-supporter-journal-form.svg |
| S-20 | 인계 목록 | mobile/18-m-supporter-handover.svg |

### 2.4 교사 · 복지사 · 치료사 — 6
| ID | 화면명 | SVG |
|----|--------|-----|
| T-01 | 교사 홈 | mobile/19-m-teacher-home.svg |
| T-12 | IEP 상세 | mobile/20-m-teacher-iep-detail.svg |
| W-01 | 복지사 홈 | mobile/21-m-worker-home.svg |
| W-12 | ISP 상세 | mobile/22-m-worker-isp-detail.svg |
| TH-01 | 치료사 홈 | mobile/23-m-therapist-home.svg |
| TH-15 | 회기 일지 작성 | mobile/24-m-therapist-session.svg |

---

## 3. 총계

| 플랫폼 | 인증 | 보호자 | 당사자 | 지원사 | 교사 | 복지사 | 치료사 | 합계 |
|--------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 웹 SVG | 9 | 21 | 9 | 7 | 9 | 7 | 5 | **67** |
| 모바일 SVG | (인증+보호자 14) | — | 6 | 3 | (교사+복지사+치료사 6) | — | — | **29** |
| | | | | | | | | **총 96** |

> **동의 화면 추가 내역(v1.1):** 웹 +5 (A-08·A-09·A-10·G-65·P-23) → 62→67 · 모바일 +5 (A-08·A-09·A-10·G-65·P-23) → 24→29. G-03 위자드 동의 Step은 기존 SVG 확장이라 화면 수 불변. SVG 파일 번호: 웹 63~67, 모바일 25~29.
> 미리보기: [`wireframes/index.html`](../wireframes/index.html) · 화면 유형(ST-01~11) 정의: `06-information-architecture.md §1`
