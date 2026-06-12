# 기능별 워크플로우 — OnDol 플랫폼

> Mermaid flowchart 형식

---

## 목차
1. [회원가입 & 역할별 온보딩](#1-회원가입--역할별-온보딩)
2. [권한 부여 프로세스](#2-권한-부여-프로세스)
3. [권한 회수 프로세스](#3-권한-회수-프로세스)
4. [기록 작성 공통 프로세스 (RLS 포함)](#4-기록-작성-공통-프로세스)
5. [파일 첨부 프로세스](#5-파일-첨부-프로세스)
6. [생애주기 타임라인 조회](#6-생애주기-타임라인-조회)
7. [인수인계 프로세스](#7-인수인계-프로세스)
8. [알림 발송/수신 프로세스](#8-알림-발송수신-프로세스)
9. [접근 로그 조회](#9-접근-로그-조회)
10. [당사자 전환기 처리 (생애주기 변경)](#10-당사자-전환기-처리)
11. [시스템 보안 흐름 (Sequence)](#11-시스템-보안-흐름)
12. [전체 플랫폼 상태 흐름도](#12-전체-플랫폼-상태-흐름도)

---

## 1. 회원가입 & 역할별 온보딩

### 1-1. 전체 가입 분기

```mermaid
flowchart TD
    A([앱/웹 접속]) --> B{기존 계정?}
    B -- 있음 --> C[로그인]
    B -- 없음 --> D[회원가입]
    C --> E{초대 링크로\n접속?}
    E -- 예 --> F[초대 당사자에 자동 연결]
    E -- 아니오 --> G{역할?}

    D --> H[역할 선택]
    H --> I1[보호자]
    H --> I2[활동지원사]
    H --> I3[특수교사]
    H --> I4[사회복지사]
    H --> I5[치료사]
    H --> I6[당사자 본인\n보호자 지원 하에]

    I1 --> J1[보호자 온보딩\n당사자 등록 필수]
    I2 --> J2[이해관계자 온보딩\n초대 코드 필요]
    I3 --> J2
    I4 --> J2
    I5 --> J2
    I6 --> J3[당사자 온보딩\n보호자 승인 필요]

    J1 --> K1[당사자 프로필 생성]
    K1 --> K2[응급 정보 입력]
    K2 --> K3[이해관계자 초대 시작\n선택]
    K3 --> L[대시보드 진입]

    J2 --> M1[초대 코드 입력 또는 링크 클릭]
    M1 --> M2[보호자 승인 대기]
    M2 --> M3{보호자 승인?}
    M3 -- 거절 --> M4[가입 보류]
    M3 -- 승인 --> M5[권한 확인 후 대시보드 진입]
```

### 1-2. 초대 → 가입 → 연결 상세 흐름

```mermaid
sequenceDiagram
    participant 보호자
    participant 시스템
    participant 이해관계자

    보호자->>시스템: 초대 이메일 발송 요청
    시스템->>시스템: 초대 토큰 생성 (24시간 유효)
    시스템->>이해관계자: 초대 이메일 발송
    이해관계자->>시스템: 초대 링크 클릭
    시스템->>시스템: 토큰 유효성 검증
    alt 토큰 만료
        시스템->>이해관계자: 재발송 요청 안내
    else 토큰 유효
        이해관계자->>시스템: 계정 생성 또는 로그인
        시스템->>보호자: 연결 승인 요청 알림
        보호자->>시스템: 승인
        시스템->>시스템: permissions INSERT
        시스템->>이해관계자: 연결 완료 알림 + 권한 안내
    end
```

---

## 2. 권한 부여 프로세스

```mermaid
flowchart TD
    A([보호자: 권한 부여 시작]) --> B[대상 이해관계자 선택]
    B --> C{이미 권한\n있음?}
    C -- 예 --> D[기존 권한 표시\n수정 여부 확인]
    D --> E{수정할까요?}
    E -- 아니오 --> Z([종료])
    E -- 예 --> F
    C -- 아니오 --> F

    F[분야 선택\n의료/교육/복지/일상/전환/법적/전체] --> G

    subgraph 접근수준["접근 수준 선택"]
        G{역할별\n기본값 제안}
        G --> H1[열람 Read\n기록만 볼 수 있음]
        G --> H2[작성 Write\n새 기록 추가 가능]
        G --> H3[편집 Edit\n기존 기록 수정 가능]
    end

    H1 --> I
    H2 --> I
    H3 --> I

    I[기간 설정\n시작일 ~ 종료일] --> J{무기한\n여부}
    J -- 무기한 --> K[valid_until = NULL]
    J -- 기간 한정 --> L[종료일 달력 선택]
    K --> M
    L --> M

    M{분야 추가?} -- 예 --> F
    M -- 아니오 --> N[권한 요약 미리보기]

    N --> O{최종 확인}
    O -- 취소 --> F
    O -- 확인 --> P

    subgraph DB_처리["DB 처리 (트랜잭션)"]
        P[permissions UPSERT] --> Q[permission_logs INSERT\naction: granted]
    end

    Q --> R[이해관계자에게 알림\n권한 부여 내용 포함]
    R --> S[완료]
```

---

## 3. 권한 회수 프로세스

```mermaid
flowchart TD
    A([보호자: 권한 회수 시작]) --> B{회수 트리거}

    B --> C1[직접 회수 요청\n보호자 의도적 회수]
    B --> C2[기간 만료 자동 회수\nvalid_until 도래]
    B --> C3[이해관계자 계정 비활성\nusers.is_active=false]

    %% 직접 회수
    C1 --> D1[이해관계자 선택]
    D1 --> E1[회수할 분야 선택]
    E1 --> F1{전체 회수?}
    F1 -- 예 --> G1[해당 이해관계자\n모든 permissions 회수]
    F1 -- 아니오 --> H1[선택 분야만 회수]
    G1 --> I1
    H1 --> I1
    I1{회수 확인} --> J1
    J1[permissions.is_active = false] --> K1[permission_logs INSERT\naction: revoked]
    K1 --> L1[이해관계자에게 알림]
    L1 --> M1[해당 이해관계자\n즉시 접근 차단\nRLS 자동 적용]
    M1 --> N1[완료]

    %% 자동 만료
    C2 --> D2[스케줄러 실행\n매일 자정]
    D2 --> E2[valid_until < 오늘인\npermissions 조회]
    E2 --> F2[is_active = false 일괄 처리]
    F2 --> G2[permission_logs INSERT\naction: expired]
    G2 --> H2[보호자 + 이해관계자 알림\n권한 만료 안내]
```

---

## 4. 기록 작성 공통 프로세스

모든 기록 작성 시 동일하게 거치는 RLS 검증 및 저장 흐름.

```mermaid
flowchart TD
    A([기록 작성 버튼 클릭]) --> B[사용자 JWT 토큰 확인]
    B --> C{토큰 유효?}
    C -- 만료 --> D[재로그인 요청]
    C -- 유효 --> E[대상 당사자 선택]

    E --> F[기록 분야 선택\ndomain]
    F --> G{RLS 권한 검증\nDB 레벨}

    subgraph RLS_CHECK["PostgreSQL RLS 자동 검증"]
        G --> H{보호자?}
        H -- 예 --> I[통과]
        H -- 아니오 --> J{permissions 확인}
        J --> K{해당 domain\nwrite 이상?}
        K -- 예 --> L{기간 유효?}
        L -- 예 --> I
        L -- 아니오 --> M[접근 거부]
        K -- 아니오 --> M
    end

    I --> N[record_type 선택\n기록 유형 코드]
    M --> N2[권한 없음 안내\n보호자에게 연락 유도]

    N --> O{템플릿\n있음?}
    O -- 예 --> P[구조화 폼 표시\nJSONB 스키마 기반]
    O -- 아니오 --> Q[자유형식 텍스트 입력]

    P --> R[필수 항목 입력]
    Q --> R

    R --> S{파일 첨부\n필요?}
    S -- 예 --> T[파일 첨부 프로세스\n→ 5번 참조]
    T --> U
    S -- 아니오 --> U

    U[생애주기 단계 자동 계산\n생년월일 기반] --> V[당사자용 요약 자동/수동 입력]
    V --> W{임시저장?}
    W -- 예 --> X[is_draft=true\nrecords INSERT]
    X --> Y[나중에 계속 가능]
    W -- 아니오 --> Z{유효성 검사}
    Z -- 실패 --> AA[오류 항목 표시]
    AA --> R
    Z -- 통과 --> AB[records INSERT\nRLS 통과 확인]
    AB --> AC[access_logs INSERT\naction: create]
    AC --> AD{알림 발송\n대상 있음?}
    AD -- 예 --> AE[관련 이해관계자 알림\nnotifications INSERT]
    AD -- 아니오 --> AF
    AE --> AF[저장 완료]
```

---

## 5. 파일 첨부 프로세스

```mermaid
flowchart TD
    A([파일 첨부 시작]) --> B{파일 소스}
    B --> C1[기기 파일 선택\n갤러리/탐색기]
    B --> C2[카메라 촬영\n모바일]
    B --> C3[문서 스캔\n모바일]

    C1 --> D
    C2 --> D
    C3 --> D

    D[파일 선택 완료] --> E{파일 유효성 검사}
    E --> F{크기 제한\n50MB 이하?}
    F -- 초과 --> G[크기 초과 안내\n압축 권장]
    F -- 이하 --> H{파일 형식\nPDF/이미지/문서/음성?}
    H -- 허용 --> I
    H -- 불허 --> J[허용 형식 안내]

    I{민감 문서\n여부 선택} --> K1[일반 문서\nis_sensitive=false]
    I --> K2[민감 문서\n진단서/개인정보\nis_sensitive=true]

    K1 --> L[Supabase Storage 업로드]
    K2 --> L

    L --> M{업로드 성공?}
    M -- 실패 --> N[재시도 안내\n최대 3회]
    N --> L
    M -- 성공 --> O[storage_path 저장]
    O --> P{is_sensitive?}
    P -- true --> Q[접근 시 presigned URL\n시간 제한 URL 발급]
    P -- false --> R[일반 URL 저장]
    Q --> S
    R --> S

    S[record_files INSERT] --> T[첨부 완료\n기록 폼으로 복귀]
```

---

## 6. 생애주기 타임라인 조회

```mermaid
flowchart TD
    A([타임라인 메뉴 진입]) --> B[사용자 권한 확인\nRLS 자동 적용]
    B --> C[당사자 선택]

    C --> D{조회 대상}
    D --> E1[보호자: 전 분야 전체]
    D --> E2[이해관계자: 권한 분야만]
    D --> E3[당사자: 전체 열람\n요약 카드 뷰]

    E1 --> F[타임라인 데이터 로딩]
    E2 --> F
    E3 --> F

    F --> G[records + self_expressions + life_milestones\n시간순 정렬]
    G --> H[생애주기 단계별 구간 표시\n배경색 구분]
    H --> I[기록 아이템 렌더링\n분야별 색상]

    I --> J{필터 적용?}
    J -- 예 --> K{필터 유형}
    K --> L1[생애주기 단계 필터\n영유아/아동/청소년 등]
    K --> L2[분야 필터\n의료/교육/복지 등]
    K --> L3[기간 필터\n날짜 범위]
    K --> L4[이해관계자 필터\n작성자]
    K --> L5[이정표만 보기]
    L1 --> M[필터된 결과 표시]
    L2 --> M
    L3 --> M
    L4 --> M
    L5 --> M
    J -- 아니오 --> M

    M --> N{아이템 선택}
    N --> O[상세 내용 표시\n사이드 패널]
    O --> P[access_logs INSERT\naction: view]
    P --> Q{관련 기록\n더 있음?}
    Q -- 예 --> R[연관 기록 링크 표시]
    Q -- 아니오 --> S[이전 화면으로]
```

---

## 7. 인수인계 프로세스

### 7-1. 인수인계 생성 (담당자 교체 시)

```mermaid
flowchart TD
    A([인수인계 시작]) --> B{인수인계 트리거}
    B --> C1[기존 담당자가\n직접 요청]
    B --> C2[보호자가\n담당자 교체 결정]
    B --> C3[권한 만료로\n자동 생성]

    C1 --> D
    C2 --> D
    C3 --> D

    D[인수인계 대상 당사자 선택] --> E[분야 선택\n어느 역할의 인수인계?]
    E --> F[기존 담당자 확인\nfrom_user_id]
    F --> G[새 담당자 지정\nto_user_id]
    G --> H[담당 기간 조회\nperiod_start ~ period_end]
    H --> I[해당 기간 기록 자동 요약 생성]

    I --> J[핵심 요약 작성\n담당자 직접 입력]
    J --> K[특이사항 목록 작성\n중요 행동/선호/비선호 등]
    K --> L[중요 기록 링크 선택\npriority_records]
    L --> M{신규 담당자\n계정 있음?}
    M -- 없음 --> N[보호자가 초대 링크 발송]
    N --> O[신규 담당자 가입 대기]
    O --> P
    M -- 있음 --> P

    P[handovers INSERT] --> Q[신규 담당자에게 알림\n인수인계 검토 요청]
    Q --> R[보호자에게 알림\n인수인계 생성 완료]
    R --> S[완료]

    S --> T[신규 담당자\n인수인계 확인 대기]
```

### 7-2. 신규 담당자 인수인계 수신

```mermaid
flowchart TD
    A([신규 담당자: 인수인계 알림 수신]) --> B[인수인계 문서 열람]
    B --> C[핵심 요약 확인]
    C --> D[특이사항 목록 확인]
    D --> E[중요 기록 링크 열람\npriority_records]
    E --> F{추가 기록\n더 확인?}
    F -- 예 --> G[담당 기간 전체 기록 조회\nRLS 자동 필터]
    G --> H[기록 열람\naccess_logs 기록]
    F -- 아니오 --> I

    H --> I{궁금한 사항\n있음?}
    I -- 예 --> J[보호자 또는 이전 담당자에게\n앱 내 메모 남기기\n선택]
    I -- 아니오 --> K

    J --> K[인수인계 확인 완료 서명]
    K --> L[handovers.is_confirmed = true]
    L --> M[이전 담당자 + 보호자 알림]
    M --> N[서비스 시작 준비 완료]
```

---

## 8. 알림 발송/수신 프로세스

### 8-1. 알림 발송 트리거 매트릭스

```mermaid
flowchart TD
    A{이벤트 발생} --> B1[새 기록 작성]
    A --> B2[권한 부여]
    A --> B3[권한 회수/만료]
    A --> B4[인수인계 생성]
    A --> B5[인수인계 확인]
    A --> B6[이정표 등록]
    A --> B7[파일 첨부]

    B1 --> C1{수신 대상}
    C1 --> D1[보호자\n항상]
    C1 --> D2[해당 분야 권한\n이해관계자]

    B2 --> C2[권한 받은\n이해관계자]
    B3 --> C3[권한 잃은\n이해관계자 + 보호자]
    B4 --> C4[신규 담당자 + 보호자]
    B5 --> C5[이전 담당자 + 보호자]
    B6 --> C6[모든 이해관계자]
    B7 --> C7[보호자]

    D1 --> E[notifications INSERT]
    D2 --> E
    C2 --> E
    C3 --> E
    C4 --> E
    C5 --> E
    C6 --> E
    C7 --> E

    E --> F[Supabase Realtime 발송]
    F --> G{앱 활성 상태?}
    G -- 활성 --> H[인앱 알림 표시]
    G -- 비활성 --> I[푸시 알림 발송\nFCM/APNs]
```

### 8-2. 알림 수신 및 처리

```mermaid
flowchart TD
    A([알림 아이콘 클릭]) --> B[알림 목록 조회\nnotifications WHERE is_read=false]
    B --> C[알림 목록 표시\n최신순]
    C --> D{알림 선택}

    D --> E1[새 기록 알림\n→ 해당 기록으로 이동]
    D --> E2[권한 알림\n→ 권한 목록으로 이동]
    D --> E3[인수인계 알림\n→ 인수인계 문서로 이동]
    D --> E4[이정표 알림\n→ 타임라인으로 이동]

    E1 --> F[notifications.is_read = true]
    E2 --> F
    E3 --> F
    E4 --> F

    F --> G[해당 콘텐츠 표시]
    G --> H[access_logs INSERT\naction: view]
```

---

## 9. 접근 로그 조회

```mermaid
flowchart TD
    A([접근 로그 메뉴 - 보호자 전용]) --> B[당사자 선택]
    B --> C{조회 기간}
    C --> D1[오늘]
    C --> D2[최근 7일]
    C --> D3[최근 30일]
    C --> D4[직접 기간 설정]

    D1 --> E[access_logs 조회\nRLS: 보호자만 전체 조회 가능]
    D2 --> E
    D3 --> E
    D4 --> E

    E --> F{필터 적용?}
    F --> G1[이해관계자별 필터]
    F --> G2[액션별 필터\nview/create/edit/download]
    F --> G3[분야별 필터]
    F -- 없음 --> H

    G1 --> H[로그 목록 표시]
    G2 --> H
    G3 --> H

    H --> I{의심 접근 발견?}
    I -- 예 --> J[해당 이해관계자 선택]
    J --> K{조치 선택}
    K --> L1[권한 회수\n→ 3번 프로세스]
    K --> L2[이해관계자에게 문의\n메모 발송]
    K --> L3[기록만 남기기]
    I -- 아니오 --> M[확인 완료]

    H --> N{로그 내보내기?}
    N -- 예 --> O[CSV 또는 PDF 다운로드]
    O --> P[access_logs INSERT\naction: download]
```

---

## 10. 당사자 전환기 처리

생애주기 단계가 변경될 때 (예: 아동→청소년, 청소년→성인전환기) 수행하는 프로세스.

```mermaid
flowchart TD
    A{전환기 트리거} --> B1[나이 기반 자동 감지\n시스템 스케줄러]
    A --> B2[보호자가 수동 변경]

    B1 --> C[보호자에게 알림\n생애주기 전환 시기 도래]
    B2 --> C

    C --> D[생애 이정표 등록\nlife_milestones INSERT\ncategory: 전환기]
    D --> E{전환 유형 확인}

    E --> F1[아동→청소년 (13세)]
    E --> F2[청소년→성인전환기 (19세)]
    E --> F3[성인전환기→성인 (25세)]
    E --> F4[성인→중장년 (40세)]

    %% 청소년 전환
    F1 --> G1[특수교사에게 알림\n전환교육 계획 수립 권고]
    G1 --> H1[사회복지사에게 알림\n전환계획 준비 권고]
    H1 --> I1

    %% 성인전환기
    F2 --> G2[특수교사 역할 만료 예고\n보호자에게 안내]
    G2 --> H2[사회복지사에게 알림\n성인 ISP 전환 준비]
    H2 --> I2[법적 서류 검토 알림\n후견/의사결정지원 계약]
    I2 --> I1

    F3 --> I1
    F4 --> I1

    I1[persons.current_life_stage 업데이트] --> J[타임라인에 전환기 마커 표시]
    J --> K{기존 담당자\n권한 연장 필요?}
    K -- 예 --> L[보호자 권한 갱신 요청]
    L --> M[권한 부여 프로세스\n→ 2번 참조]
    K -- 아니오 --> N[전환기 처리 완료]
    M --> N
```

---

## 11. 시스템 보안 흐름

### 11-1. API 요청 보안 흐름

```mermaid
sequenceDiagram
    participant 클라이언트
    participant Next.js API
    participant tRPC 미들웨어
    participant Supabase RLS
    participant DB

    클라이언트->>Next.js API: API 요청 + JWT 토큰
    Next.js API->>tRPC 미들웨어: 요청 전달
    tRPC 미들웨어->>tRPC 미들웨어: JWT 검증 (Supabase Auth)
    
    alt JWT 만료/무효
        tRPC 미들웨어-->>클라이언트: 401 Unauthorized
    else JWT 유효
        tRPC 미들웨어->>Supabase RLS: 쿼리 실행 요청
        Supabase RLS->>Supabase RLS: auth.uid() 추출
        Supabase RLS->>DB: permissions 테이블 조인 검사
        
        alt RLS 정책 위반
            Supabase RLS-->>tRPC 미들웨어: 빈 결과 또는 오류
            tRPC 미들웨어-->>클라이언트: 403 Forbidden
        else RLS 통과
            DB-->>Supabase RLS: 허가된 데이터만 반환
            Supabase RLS-->>tRPC 미들웨어: 결과 데이터
            tRPC 미들웨어->>DB: access_logs INSERT
            tRPC 미들웨어-->>클라이언트: 200 OK + 데이터
        end
    end
```

### 11-2. 파일 접근 보안 흐름

```mermaid
sequenceDiagram
    participant 클라이언트
    participant tRPC API
    participant Supabase Storage
    participant DB

    클라이언트->>tRPC API: 파일 다운로드 요청 (file_id)
    tRPC API->>DB: record_files WHERE id = file_id
    DB-->>tRPC API: storage_path + is_sensitive

    alt is_sensitive = true
        tRPC API->>DB: permissions 권한 재검증
        DB-->>tRPC API: 권한 확인
        alt 권한 없음
            tRPC API-->>클라이언트: 403 Forbidden
        else 권한 있음
            tRPC API->>Supabase Storage: presigned URL 발급 (5분 유효)
            Supabase Storage-->>tRPC API: 임시 URL
            tRPC API->>DB: access_logs INSERT (action: download)
            tRPC API-->>클라이언트: 임시 URL 반환
        end
    else is_sensitive = false
        tRPC API->>Supabase Storage: 일반 접근 URL
        Supabase Storage-->>tRPC API: URL
        tRPC API->>DB: access_logs INSERT (action: download)
        tRPC API-->>클라이언트: URL 반환
    end
```

---

## 12. 전체 플랫폼 상태 흐름도

당사자 한 명을 중심으로 플랫폼의 전체 생애 흐름.

```mermaid
stateDiagram-v2
    [*] --> 등록전: 보호자 가입

    등록전 --> 프로필등록: 당사자 기본정보 입력
    프로필등록 --> 기반구축: 이해관계자 초대 + 권한 부여

    기반구축 --> 영유아기록: 0~5세
    영유아기록 --> 아동기기록: 6세 전환\n특수교사 참여 시작

    아동기기록 --> 청소년기기록: 13세 전환\n전환교육 시작

    청소년기기록 --> 성인전환기기록: 19세 전환\n교육→자립 전환\n특수교사 종료

    성인전환기기록 --> 성인기기록: 25세 전환\n자립생활 중심

    성인기기록 --> 중장년기기록: 40세 전환\n노화 대응 강화

    state 영유아기록 {
        [*] --> 초기진단
        초기진단 --> 조기치료
        조기치료 --> 장애등록
    }

    state 아동기기록 {
        [*] --> IEP시작
        IEP시작 --> ISP시작
        ISP시작 --> 자기표현시작
        자기표현시작 --> 정기기록반복
    }

    state 청소년기기록 {
        [*] --> 전환교육추가
        전환교육추가 --> 활동지원본격
        활동지원본격 --> 전환계획수립
    }

    state 성인전환기기록 {
        [*] --> 직업훈련시작
        직업훈련시작 --> 법적검토
        법적검토 --> 자립계획
    }

    state 인수인계 {
        [*] --> 요약생성
        요약생성 --> 신규담당자확인
        신규담당자확인 --> 완료
    }

    영유아기록 --> 인수인계: 담당자 교체시
    아동기기록 --> 인수인계: 담당자 교체시
    청소년기기록 --> 인수인계: 담당자 교체시
    성인전환기기록 --> 인수인계: 담당자 교체시
    인수인계 --> 영유아기록: 복귀
    인수인계 --> 아동기기록: 복귀
    인수인계 --> 청소년기기록: 복귀
    인수인계 --> 성인전환기기록: 복귀

    중장년기기록 --> [*]: 서비스 종료
```

---

## 워크플로우 요약 매트릭스

| 워크플로우 | 주 사용자 | 빈도 | 핵심 DB 작업 |
|-----------|---------|------|------------|
| 온보딩 | 전체 | 최초 1회 | users, guardian_persons, person_accounts INSERT |
| 권한 부여 | 보호자 | 이해관계자 추가시 | permissions UPSERT, permission_logs INSERT |
| 권한 회수 | 보호자/시스템 | 필요시/만료시 | permissions UPDATE, permission_logs INSERT |
| 기록 작성 | 이해관계자 | 매일~월별 | records INSERT, access_logs INSERT |
| 자기표현 기록 | 당사자 | 매일 | self_expressions INSERT |
| 파일 첨부 | 보호자/이해관계자 | 필요시 | record_files INSERT, Storage 업로드 |
| 타임라인 조회 | 전체 | 수시 | records+self_expressions SELECT, access_logs INSERT |
| 인수인계 | 보호자/담당자 | 담당자 교체시 | handovers INSERT/UPDATE |
| 알림 | 시스템 자동 | 이벤트 발생시 | notifications INSERT, Realtime 발송 |
| 접근 로그 | 보호자 | 필요시 | access_logs SELECT |
| 전환기 처리 | 시스템/보호자 | 연 1회 이하 | persons UPDATE, life_milestones INSERT |
