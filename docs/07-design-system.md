# 디자인 시스템 — OnDol 플랫폼

> 버전: v1.1 | 작성일: 2026-06-12 (v1.1 개정 2026-06-14)  
> 스택: Next.js 14 · Tailwind CSS · shadcn/ui · React Native (Expo)  
> 기준: WCAG 2.1 AA (대비비 4.5:1 이상, 당사자 모드 AAA 목표)

> **v1.1 개정(동의 수집 워크플로우 전파):** §8 컴포넌트 카탈로그에 동의 UI 3종 추가 — `ConsentItem`(§8-18)·`PolicyViewer`(§8-19)·`ConsentManagementList`(§8-20). §9에 당사자 동의·권리 관리(P-23) 대형 변형 명시. 근거: docs/05 §1-3·docs/06 Flow-0/Flow-2·docs/16 §5·§7. 대상 화면: A-08·A-09·A-10·G-65·P-23(docs/11 §1).

---

## 목차
1. [컬러 시스템](#1-컬러-시스템)
2. [타이포그래피](#2-타이포그래피)
3. [스페이싱 & 그리드](#3-스페이싱--그리드)
4. [엘리베이션 & 그림자](#4-엘리베이션--그림자)
5. [보더 레디어스](#5-보더-레디어스)
6. [아이콘 시스템](#6-아이콘-시스템)
7. [모션 & 애니메이션](#7-모션--애니메이션)
8. [컴포넌트 라이브러리](#8-컴포넌트-라이브러리)
9. [당사자 접근성 모드](#9-당사자-접근성-모드)
10. [Tailwind 설정](#10-tailwind-설정)

---

## 1. 컬러 시스템

### 1-1. 브랜드 철학
**온돌**은 바닥에서 올라오는 따뜻함, 집, 안심감을 상징한다. 의료·복지 서비스의 신뢰감과 일상적인 따뜻함을 동시에 전달한다.  
→ **Primary: 따뜻한 청록(Warm Teal)** · **Warm: 산호 앰버(Coral Amber)**

---

### 1-2. Primary — Warm Teal (브랜드 메인)

| Token | Hex | 용도 |
|-------|-----|------|
| `primary-50` | `#F0F8FA` | 배경 틴트 |
| `primary-100` | `#D6EDF3` | 호버 배경, 선택 배경 |
| `primary-200` | `#A8D6E4` | 비활성 테두리 |
| `primary-300` | `#72BBCF` | 플레이스홀더 아이콘 |
| `primary-400` | `#479DB6` | 보조 버튼 |
| **`primary-500`** | **`#3B7D8E`** | **메인 버튼, 링크, 포커스 링** |
| `primary-600` | `#316878` | 버튼 호버 |
| `primary-700` | `#265462` | 버튼 Active |
| `primary-800` | `#1C404B` | 다크 텍스트 강조 |
| `primary-900` | `#122D36` | 헤더 다크 |

---

### 1-3. Warm — Coral Amber (보조 강조)

| Token | Hex | 용도 |
|-------|-----|------|
| `warm-50` | `#FFF8F4` | 알림 배경 |
| `warm-100` | `#FDEADE` | 강조 카드 배경 |
| `warm-200` | `#FACDB8` | 태그 |
| `warm-300` | `#F5A882` | 보조 아이콘 |
| `warm-400` | `#EE8A5D` | 보조 CTA |
| **`warm-500`** | **`#E8724A`** | **보조 버튼, 뱃지, 이정표 마커** |
| `warm-600` | `#D45A34` | 호버 |
| `warm-700` | `#B34628` | Active |

---

### 1-4. Domain Colors — 6개 분야 식별 색상

각 분야는 배경(bg)·텍스트(text)·강조(accent) 세 가지 값을 가진다.  
대비비: bg + text 조합 기준 **7:1 이상** (AAA)

| 분야 | Domain | bg | text | accent (버튼/아이콘) |
|------|--------|----|------|---------------------|
| **A. 의료** | medical | `#FEF0F0` | `#BF3030` | `#E04545` |
| **B. 교육** | education | `#EEF4FD` | `#2E5FA8` | `#4377C0` |
| **C. 복지** | welfare | `#EDFAF3` | `#276B4C` | `#3EA673` |
| **D. 일상** | daily | `#FFF5E6` | `#B56F10` | `#E8991E` |
| **E. 전환** | transition | `#F4EFFB` | `#6A43A8` | `#8A5DC6` |
| **F. 법적** | legal | `#EEF2F7` | `#3E5E7A` | `#5A7FA0` |

**도메인 색상 CSS 변수 패턴:**
```css
--domain-medical-bg: #FEF0F0;
--domain-medical-text: #BF3030;
--domain-medical-accent: #E04545;
/* ... 동일 패턴 반복 */
```

---

### 1-5. Neutral — Gray Scale

| Token | Hex | 용도 |
|-------|-----|------|
| `neutral-50` | `#F9FAFB` | 페이지 배경 |
| `neutral-100` | `#F3F4F6` | 카드 배경 (보조), Skeleton |
| `neutral-200` | `#E5E7EB` | 구분선, 비활성 테두리 |
| `neutral-300` | `#D1D5DB` | 입력 테두리 (기본) |
| `neutral-400` | `#9CA3AF` | 플레이스홀더 텍스트 |
| `neutral-500` | `#6B7280` | 보조 텍스트, 캡션 |
| `neutral-600` | `#4B5563` | 레이블, 서브 헤딩 |
| `neutral-700` | `#374151` | 본문 텍스트 |
| `neutral-800` | `#1F2937` | 메인 텍스트 |
| `neutral-900` | `#111827` | 헤딩 |

---

### 1-6. Semantic Colors

| 역할 | bg | text | border | 도메인 연계 |
|------|----|------|--------|-----------|
| **Success** | `#EDFAF3` | `#276B4C` | `#3EA673` | welfare와 동일 |
| **Warning** | `#FFF5E6` | `#B56F10` | `#E8991E` | daily와 동일 |
| **Error / Danger** | `#FEF0F0` | `#BF3030` | `#E04545` | medical와 동일 |
| **Info** | `#EEF4FD` | `#2E5FA8` | `#4377C0` | education와 동일 |

---

### 1-7. Surface & Background

| Token | Hex | 용도 |
|-------|-----|------|
| `surface-page` | `#F9FAFB` | 전체 페이지 배경 |
| `surface-card` | `#FFFFFF` | 카드, 패널 |
| `surface-overlay` | `rgba(17,24,39,0.48)` | 모달 오버레이 |
| `surface-sidebar` | `#FFFFFF` | 사이드바 배경 |
| `surface-header` | `#FFFFFF` | 헤더 배경 |

---

## 2. 타이포그래피

### 2-1. 폰트 패밀리

| 용도 | 폰트 | 대체 폰트 |
|------|------|---------|
| **웹 헤딩·본문** | Pretendard | Apple SD Gothic Neo, Noto Sans KR, sans-serif |
| **모바일 헤딩·본문** | Pretendard (CDN) | SF Pro Display (iOS), Roboto (Android) |
| **코드·기술값** | JetBrains Mono | Consolas, monospace |

```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css');

--font-sans: 'Pretendard Variable', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
--font-mono: 'JetBrains Mono', Consolas, monospace;
```

---

### 2-2. 타입 스케일

| 토큰 | Size | Line-height | Letter-spacing | Weight | 용도 |
|------|------|-------------|----------------|--------|------|
| `display-1` | 40px | 48px | -0.02em | **700** | 랜딩 히어로 |
| `display-2` | 32px | 40px | -0.02em | **700** | 섹션 히어로 |
| `heading-1` | 28px | 36px | -0.01em | **600** | 페이지 타이틀 |
| `heading-2` | 24px | 32px | -0.01em | **600** | 섹션 제목 |
| `heading-3` | 20px | 28px | 0 | **600** | 카드 제목 |
| `heading-4` | 18px | 26px | 0 | **500** | 서브섹션 |
| `body-lg` | 18px | 28px | 0 | 400 | 긴 본문 |
| `body-md` | 16px | 24px | 0 | 400 | 기본 본문 ← **Base** |
| `body-sm` | 14px | 22px | 0 | 400 | 보조 설명 |
| `caption` | 12px | 18px | 0.01em | 400 | 타임스탬프, 힌트 |
| `label-lg` | 14px | 20px | 0.02em | **500** | 폼 레이블 |
| `label-sm` | 12px | 16px | 0.04em | **500** | 뱃지, 태그, 대문자 레이블 |
| `button-lg` | 16px | 24px | 0.01em | **600** | 대형 버튼 |
| `button-md` | 14px | 20px | 0.01em | **600** | 기본 버튼 |
| `button-sm` | 13px | 18px | 0.01em | **500** | 소형 버튼 |

---

### 2-3. 폰트 웨이트

| 값 | 이름 | Tailwind | 용도 |
|----|------|----------|------|
| 400 | Regular | `font-normal` | 본문 |
| 500 | Medium | `font-medium` | 레이블, 서브 헤딩 |
| 600 | SemiBold | `font-semibold` | 헤딩, 버튼 |
| 700 | Bold | `font-bold` | 디스플레이, 강조 |

---

## 3. 스페이싱 & 그리드

### 3-1. Spacing Tokens (8px Grid)

| Token | px | rem | Tailwind | 용도 |
|-------|----|----|----------|------|
| `space-1` | 4 | 0.25 | `p-1` | 아이콘 내부 여백 |
| `space-2` | 8 | 0.5 | `p-2` | 컴팩트 패딩 |
| `space-3` | 12 | 0.75 | `p-3` | 소형 패딩 |
| `space-4` | 16 | 1 | `p-4` | 기본 패딩 |
| `space-5` | 20 | 1.25 | `p-5` | 중형 패딩 |
| `space-6` | 24 | 1.5 | `p-6` | 섹션 간격 |
| `space-8` | 32 | 2 | `p-8` | 카드 패딩 |
| `space-10` | 40 | 2.5 | `p-10` | 섹션 패딩 |
| `space-12` | 48 | 3 | `p-12` | 대형 섹션 |
| `space-16` | 64 | 4 | `p-16` | 페이지 마진 |

---

### 3-2. 레이아웃 그리드

**웹:**

| 브레이크포인트 | 컬럼 수 | Gutter | Margin | Sidebar |
|-------------|:------:|:------:|:------:|:-------:|
| Mobile `< 768px` | 4 | 16px | 16px | — |
| Tablet `768~1023px` | 8 | 20px | 24px | 64px (접힘) |
| Desktop `1024~1279px` | 12 | 24px | 32px | 240px |
| Wide `≥ 1280px` | 12 | 24px | 48px | 240px |

**컨텐츠 최대 너비:**
- 기본 컨텐츠: `max-w-4xl` (896px)
- 폼 화면: `max-w-2xl` (672px)
- 타임라인: `max-w-3xl` (768px)
- 전체 너비 테이블: 제한 없음

**모바일:**
- 단일 컬럼, 좌우 마진 16px (`px-4`)
- 카드 내부 패딩: 16px (`p-4`)
- 하단 탭바 높이: 56px + Safe Area Inset

---

## 4. 엘리베이션 & 그림자

| 레벨 | CSS | 용도 |
|------|-----|------|
| **0** | `none` | 플랫 요소 (배경 구분 없음) |
| **1** | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)` | 카드 기본 |
| **2** | `0 4px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06)` | 카드 호버, 드롭다운 |
| **3** | `0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)` | 모달, 팝오버 |
| **4** | `0 16px 48px rgba(0,0,0,0.14), 0 8px 16px rgba(0,0,0,0.08)` | 사이드 패널, 드로어 |

---

## 5. 보더 레디어스

| Token | px | Tailwind | 용도 |
|-------|----|----------|------|
| `radius-sm` | 4 | `rounded` | 배지, 코드 블록 |
| `radius-md` | 8 | `rounded-lg` | 입력 필드, 버튼 |
| `radius-lg` | 12 | `rounded-xl` | 카드, 드롭다운 |
| `radius-xl` | 16 | `rounded-2xl` | 모달, Bottom Sheet |
| `radius-2xl` | 20 | `rounded-[20px]` | 당사자 아이콘 카드 |
| `radius-full` | 9999 | `rounded-full` | 아바타, 칩, FAB |

---

## 6. 아이콘 시스템

### 6-1. 기반 아이콘 라이브러리
- **Lucide React** (shadcn/ui 내장) — UI 기본 아이콘
- **크기 규격:** 16px / 20px / 24px / 32px (4단계)
- **기본 stroke:** 1.5px, 모바일 터치 영역: 최소 44×44px

### 6-2. 도메인 전용 아이콘 (커스텀)

| 분야 | 아이콘명 | 기반 아이콘 | 색상 |
|------|---------|------------|------|
| 의료 | `MedicalIcon` | `Stethoscope` | medical-accent |
| 교육 | `EducationIcon` | `BookOpen` | education-accent |
| 복지 | `WelfareIcon` | `HeartHandshake` | welfare-accent |
| 일상 | `DailyIcon` | `Sun` | daily-accent |
| 전환 | `TransitionIcon` | `ArrowRightCircle` | transition-accent |
| 법적 | `LegalIcon` | `FileText` | legal-accent |
| 자기표현 | `SelfExpressionIcon` | `Smile` | warm-500 |

### 6-3. 당사자 자기표현 이모지 아이콘 (ST-08 전용)

PNG/SVG 커스텀 일러스트. 72×72px 기본 크기.

| 카테고리 | 아이콘 목록 |
|---------|----------|
| 감정 (5) | 😊 좋아요 / 😐 보통 / 😢 슬퍼요 / 😡 화났어요 / 😰 불안해요 |
| 식사 (4) | 🍚 잘먹음 / 😐 조금먹음 / 😞 별로 / ❌ 못먹음 |
| 활동 (10) | 🏃 운동 / 📚 공부 / 🎨 만들기 / 👫 친구 / 🏥 병원 / 🛒 쇼핑 / 🏠 집 / 🎮 게임 / 💆 치료 / 💼 일 |
| 몸 상태 (4) | 💪 건강 / 🤧 감기 / 😴 피곤 / 🤕 아파 |

---

## 7. 모션 & 애니메이션

### 7-1. Duration Tokens

| Token | 값 | 용도 |
|-------|---|------|
| `duration-fast` | 100ms | 아이콘 상태 전환 |
| `duration-normal` | 200ms | 버튼 호버, 색상 전환 |
| `duration-slow` | 300ms | 모달 진입, 패널 슬라이드 |
| `duration-slower` | 500ms | 페이지 전환, 완료 애니메이션 |

### 7-2. Easing

| 이름 | CSS | 용도 |
|------|-----|------|
| `ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | 대부분의 UI 전환 |
| `ease-enter` | `cubic-bezier(0, 0, 0.2, 1)` | 요소 진입 |
| `ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | 요소 퇴장 |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 완료 애니메이션, 선택 피드백 |

### 7-3. 주요 애니메이션 패턴

| 패턴 | Duration | Easing | 적용 |
|------|---------|--------|------|
| 모달 진입 | 300ms | ease-enter | scale(0.95)→1 + opacity 0→1 |
| 모달 퇴장 | 200ms | ease-exit | scale(1)→0.95 + opacity 1→0 |
| Bottom Sheet 올라오기 | 300ms | ease-enter | translateY(100%)→0 |
| 페이지 전환 | 250ms | ease-standard | translateX(20px)→0 + opacity |
| 완료 애니메이션 | 600ms | ease-spring | scale 0.8→1.1→1 |
| 토스트 진입 | 300ms | ease-enter | translateY(-16px)→0 |

### 7-4. Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. 컴포넌트 라이브러리

---

### 8-1. Button

**기반:** shadcn/ui `Button`

#### Variants

| Variant | 배경 | 텍스트 | 테두리 | 용도 |
|---------|------|--------|--------|------|
| `primary` | primary-500 | white | — | 메인 CTA |
| `secondary` | primary-100 | primary-700 | — | 보조 액션 |
| `outline` | transparent | primary-500 | primary-300 | 3순위 액션 |
| `ghost` | transparent | neutral-700 | — | 텍스트 버튼 |
| `danger` | error-accent | white | — | 삭제, 회수 |
| `warm` | warm-500 | white | — | 당사자 주 CTA |
| `domain` | domain-{X}-accent | white | — | 분야별 컬러 버튼 |

#### Sizes

| Size | Height | Padding | Font | 용도 |
|------|:------:|---------|------|------|
| `sm` | 32px | `px-3 py-1.5` | button-sm | 테이블 인라인 |
| `md` | 40px | `px-4 py-2` | button-md | 기본 ← **Default** |
| `lg` | 48px | `px-6 py-3` | button-lg | 폼 제출, CTA |
| `xl` | 56px | `px-8 py-4` | button-lg | 당사자 모드 전용 |

#### States

```
기본    → primary-500 bg
호버    → primary-600 bg, elevation-1
Active  → primary-700 bg, scale(0.98)
Focus   → outline 2px primary-500, offset 2px
Disabled→ neutral-200 bg, neutral-400 text, cursor-not-allowed
Loading → 스피너 아이콘 + 텍스트 유지, disabled 상태
```

#### 좌/우 아이콘
```tsx
<Button leftIcon={<Plus />}>새 기록 추가</Button>
<Button rightIcon={<ChevronRight />} variant="ghost">더보기</Button>
<Button iconOnly aria-label="닫기"><X /></Button>  {/* icon-only: w=h */}
```

---

### 8-2. Input Fields

**기반:** shadcn/ui `Input`, `Textarea`, `Select`

#### 공통 구조
```
[FormField]
  ├── Label (label-lg, neutral-700)
  ├── [Input / Textarea / Select]
  ├── HelpText (body-sm, neutral-500) — 선택
  └── ErrorMessage (body-sm, error-text) — 유효성 실패 시
```

#### Input States

```
기본     → 테두리 neutral-300, bg white
Focus    → 테두리 primary-500 2px, bg white
Filled   → 테두리 neutral-300, bg white
Disabled → bg neutral-100, 텍스트 neutral-400, cursor-not-allowed
Error    → 테두리 error-accent 2px, ErrorMessage 표시
Success  → 테두리 success-accent 2px
Read-only→ bg neutral-50, 테두리 neutral-200
```

#### Input Variants

| 컴포넌트 | Tailwind 기반 | 특이사항 |
|---------|-------------|---------|
| `TextInput` | `h-10 rounded-lg px-3` | 기본 |
| `Textarea` | `min-h-24 rounded-lg p-3 resize-y` | 자동 높이 조절 |
| `SearchInput` | `TextInput` + SearchIcon 좌측 | 항상 clear 버튼 |
| `Select` | shadcn Select | 커스텀 드롭다운 |
| `DatePicker` | shadcn Calendar | 한국어 로케일 |
| `TimePicker` | 커스텀 (hh:mm) | 24시간 형식 |
| `FileUpload` | Dropzone | 드래그&드롭, 프리뷰 |

---

### 8-3. Checkbox & Radio & Toggle

| 컴포넌트 | 크기 | 선택 색상 | 용도 |
|---------|:----:|----------|------|
| `Checkbox` | 18×18px | primary-500 | 다중 선택 |
| `CheckboxLg` | 24×24px | primary-500 | 접근성 모드 |
| `Radio` | 18×18px | primary-500 | 단일 선택 |
| `Toggle` (Switch) | 40×24px | primary-500 | 설정 on/off |

---

### 8-4. Badge / Tag

#### DomainBadge
분야 식별 전용. 배경 = domain-bg, 텍스트 = domain-text.

```
┌─────────────────┐
│ 🔴 의료          │  ← Icon(16px) + 텍스트(label-sm)
└─────────────────┘
Padding: px-2.5 py-0.5 · rounded-full
```

#### StatusBadge
기록 상태, 생애주기 단계.

| Variant | 색상 | 예시 |
|---------|------|------|
| `default` | neutral-100/700 | — |
| `success` | success bg/text | 확인 완료 |
| `warning` | warning bg/text | 검토 필요 |
| `error` | error bg/text | 만료됨 |
| `info` | info bg/text | 임시저장 |
| `life-stage` | primary-100/700 | 아동기 |

#### Tag (필터 / 다중선택)
```
기본:   neutral-100 bg, neutral-700 text
선택:   primary-100 bg, primary-700 text, primary-300 border
삭제:   선택 상태 + × 버튼
```

---

### 8-5. Avatar

| Size | px | 용도 |
|------|:--:|------|
| `xs` | 24 | 댓글, 인라인 |
| `sm` | 32 | 목록 아이템 |
| `md` | 40 | 카드 헤더 (기본) |
| `lg` | 56 | 프로필 |
| `xl` | 80 | 프로필 페이지 |

- 이미지 없을 때: 이름 첫 글자 + 역할별 배경색 (guardian=primary-200, person=warm-200, supporter=welfare-200 등)
- 온라인 상태 인디케이터: 우하단 8px 원 (success green)

---

### 8-6. Card

#### BaseCard
```
bg white · rounded-xl · elevation-1
호버 → elevation-2 · transition-shadow 200ms
Padding: p-4 (모바일) / p-6 (웹)
```

#### RecordCard (기록 목록 아이템)

```
┌──────────────────────────────────────────┐
│ [DomainBadge]            [날짜] [is_draft?] │
│                                           │
│  제목 (heading-4)                          │
│  요약 텍스트 (body-sm, 2줄 말줄임)          │
│                                           │
│  [AuthorAvatar xs] 작성자명   [첨부파일 수] │
└──────────────────────────────────────────┘
```
- 이정표(is_milestone): 좌측 warm-500 3px 세로 Border
- 임시저장(is_draft): 우상단 `임시저장` StatusBadge

#### PersonCard (대시보드 당사자 카드)

```
┌──────────────────────────────────────────┐
│  [Avatar lg]  이름 (heading-3)             │
│               생애주기 BadgeTag            │
│               장애 유형                   │
│                                           │
│  오늘 자기표현 있음 여부                    │
│  최근 기록 분야 DomainBadge × N            │
│                                           │
│  [타임라인 보기] [기록 작성]               │
└──────────────────────────────────────────┘
```

#### NotificationCard

```
┌──────────────────────────────────────────┐
│ ● [DomainIcon] 알림 제목 (body-md/semibold)│  ← ● = 미읽음 dot
│   알림 내용 요약 (body-sm)                 │
│                     [시간] (caption)      │
└──────────────────────────────────────────┘
읽음: dot 사라짐, bg neutral-50
미읽음: bg primary-50
```

#### HandoverCard (인수인계)

```
┌──────────────────────────────────────────┐
│ [DomainBadge]   기간: 2024-03 ~ 2024-08   │
│ [Avatar sm] 이전 → [Avatar sm] 신규       │
│                                           │
│ 핵심 요약 (body-sm, 3줄 말줄임)            │
│ 특이사항 태그 × N                         │
│                                           │
│ [확인 완료 Badge] 또는 [확인 요청 버튼]    │
└──────────────────────────────────────────┘
```

---

### 8-7. Modal / Dialog

**기반:** shadcn/ui `Dialog`

```
Overlay: rgba(17,24,39,0.48) · backdrop-blur-sm
Container: bg white · rounded-2xl · elevation-3
          max-w-lg (기본) / max-w-2xl (대형)
          mx-4 (모바일)

구조:
  Header: 제목(heading-3) + 닫기 버튼(X)
  ─────────────────────────────────
  Content: 스크롤 가능 (max-h-[70vh])
  ─────────────────────────────────
  Footer: 취소 버튼 + 확인 버튼 (우측 정렬)
```

**확인 다이얼로그 (Confirm):**
- 아이콘 (AlertTriangle 또는 Trash2) + 메시지 + 취소/확인
- Danger 액션: 확인 버튼 `danger` variant

---

### 8-8. Bottom Sheet (모바일 전용)

```
Overlay: rgba(17,24,39,0.40)
Handle: 4×32px 둥근 바 · neutral-300 · 상단 중앙
Container: bg white · rounded-t-2xl · elevation-4
           Safe Area 하단 여백 자동 적용

크기:
  compact: 높이 auto (최대 48%)    ← 필터, 확인
  full:    높이 92% (페이지처럼)   ← 긴 폼, 기록 작성
```

---

### 8-9. Toast / Alert

#### Toast (비침습적 알림)
```
위치: 화면 우상단 (웹) / 화면 상단 중앙 (모바일)
진입: translateY(-16px)→0, 300ms ease-enter
퇴장: 3초 후 자동 사라짐 (또는 X 닫기)

구조: [아이콘] [메시지] [액션 링크 - 선택] [X]
너비: max-w-sm (360px)
```

#### InlineAlert (폼 내부 / 섹션 알림)
```
구조: [아이콘 20px] [타이틀 + 설명] [닫기 - 선택]
Variant: success / warning / error / info
bg = semantic-bg, border-l = 4px solid semantic-accent
rounded-lg p-4
```

---

### 8-10. Step Indicator (Multi-step Form)

**웹 (수평 진행 바):**
```
[● 1. 기본정보] ──── [● 2. 장애정보] ──── [○ 3. 응급정보] ──── [○ 4. 확인]
 완료=primary-500    현재=primary-500    예정=neutral-300
 텍스트(label-sm)     텍스트(bold)         텍스트(neutral-500)
```

**모바일 (점 인디케이터):**
```
● ● ○ ○  ← 상단 중앙, 8px 원, 간격 8px
현재: primary-500  완료: primary-300  예정: neutral-300
```

---

### 8-11. Timeline Entry

```
[생애주기 라인]
│
◆  ← is_milestone: warm-500 다이아몬드
│
●  ← 일반 기록: domain-accent 원
│
●  ← self_expression: warm-300 원 (작은 크기)
│

각 항목 우측:
┌────────────────────────────┐
│ [DomainBadge]  날짜        │
│ 제목 (body-md/semibold)    │
│ 요약 (body-sm, 1줄)        │
│ [AuthorAvatar xs] 이름     │
└────────────────────────────┘
```

**생애주기 구간 배경:**
| 단계 | 배경색 |
|------|--------|
| 영유아기 | `#FEF9F0` (연한 따뜻한 노랑) |
| 아동기 | `#F0F8F4` (연한 초록) |
| 청소년기 | `#F0F4FE` (연한 파랑) |
| 성인전환기 | `#F5F0FE` (연한 보라) |
| 성인기 | `#F0F8FA` (연한 청록) |
| 중장년/노년기 | `#F5F5F5` (연한 회색) |

---

### 8-12. Permission Matrix (권한 매트릭스)

```
┌─────────────────────────────────────────────────────┐
│            의료  교육  복지  일상  전환  법적         │
│ 이름(역할)  [읽기][작성][작성][작성][ - ][ - ]  [수정] │
│ 이름(역할)  [읽기][ - ][ - ][읽기][ - ][ - ]  [수정] │
└─────────────────────────────────────────────────────┘

권한 셀 컬러:
  admin/edit → primary-200 bg, primary-700 text
  write      → primary-100 bg, primary-600 text
  read       → neutral-100 bg, neutral-600 text
  없음(—)    → neutral-50  bg, neutral-300 text
  만료        → error-bg,     error-text (선긋기)
```

---

### 8-13. Form — Multi-step Container

**웹:**
```
┌──────────────────────────────────────────────┐
│ [Step Indicator]                             │
├──────────────────────────────────────────────┤
│                                              │
│  [스텝 제목 heading-2]                        │
│  [스텝 설명 body-md neutral-500]              │
│                                              │
│  [폼 컨텐츠]                                  │
│                                              │
├──────────────────────────────────────────────┤
│  [← 이전]                    [다음 →] / [완료]│  ← Sticky Footer
└──────────────────────────────────────────────┘
```

**모바일:**
- 탭바 숨김 (Full-screen flow)
- 상단: NavBar (뒤로가기 + 스텝명 + 닫기)
- 하단: Sticky footer (이전 + 다음 버튼 또는 단일 다음 버튼)
- 컨텐츠 스크롤: 키보드 올라왔을 때 자동 스크롤

---

### 8-14. 공통 Empty State

```
┌──────────────────────────────────┐
│                                  │
│   [일러스트 / 아이콘 64px]         │
│   제목 (heading-3, neutral-700)   │
│   설명 (body-sm, neutral-500)     │
│                                  │
│   [CTA 버튼 - 선택]               │
│                                  │
└──────────────────────────────────┘
```

| 컨텍스트 | 아이콘 | 제목 | CTA |
|---------|--------|------|-----|
| 기록 없음 | FileText | 아직 기록이 없어요 | 첫 기록 작성하기 |
| 권한 없음 | Lock | 접근 권한이 없어요 | 보호자에게 연락하기 |
| 알림 없음 | Bell | 새로운 알림이 없어요 | — |
| 검색 결과 없음 | Search | 검색 결과가 없어요 | 검색어 변경 |

---

### 8-15. Skeleton (로딩 상태)

```css
/* Tailwind */
.skeleton { @apply bg-neutral-200 animate-pulse rounded-md; }
```

RecordCard Skeleton → 동일 높이의 neutral-200 블록  
Timeline Skeleton → 좌측 라인 + 우측 카드 × 3  
Avatar Skeleton → 원형 neutral-200

---

### 8-16. Sidebar Navigation (웹)

```
┌──────────────────────────────────┐
│ [Logo] OnDol          [접기 ←]  │ ← 240px
├──────────────────────────────────┤
│ [PersonSelector Dropdown]        │ ← 당사자 전환
├──────────────────────────────────┤
│ 🏠  대시보드                      │ ← 활성: primary-100 bg, primary-700 text, left 3px border
│ 📅  타임라인                      │ ← 기본: hover neutral-100, neutral-700
│ 📝  기록 관리         [▼]        │ ← 서브메뉴 토글
│   ├ 전체                         │
│   ├ 🔴 의료                      │
│   ├ 🔵 교육                      │
│   └ ...                          │
│ 🔑  권한 관리                     │
│ 📊  접근 로그                     │
│ 🔔  알림              [3]        │ ← 미읽음 뱃지
├──────────────────────────────────┤
│ ⚙️  설정                          │
│ [Avatar] 이름 / 역할              │
└──────────────────────────────────┘
```

**접힌 상태 (64px):**
- 아이콘만 표시
- 호버 시 툴팁으로 메뉴명 표시

---

### 8-17. Bottom Tab Bar (모바일)

```
┌────────────────────────────────────────┐
│ [홈]     [타임라인] [기록+] [권한] [설정]│
│  🏠         📅      [+]      🔑     ⚙️  │
│  홈       타임라인   기록작성  권한   설정 │
└────────────────────────────────────────┘

활성 탭: primary-500 아이콘 + 텍스트, 상단 2px border
기본 탭: neutral-400 아이콘 + 텍스트
중앙 FAB: warm-500 bg, white 아이콘, elevation-3, 56×56px rounded-full
```

---

### 8-18. ConsentItem (동의 항목)

동의 수집(A-08, docs/05 §1-3·docs/06 Flow-0) 및 당사자 등록 위자드 동의 Step(docs/06 Flow-2 Step 2/6)에서 개별 동의를 분리 체크박스로 받는 컴포넌트. PIPA §22⑤(일괄 동의 금지) 준수를 위해 항목마다 1개의 `ConsentItem`을 사용한다.

```
┌──────────────────────────────────────────────┐
│ ☐  이용약관 동의           [필수]  [전문 보기 ›]│  ← Checkbox + Label + Badge + Link
│     서비스 이용을 위한 기본 약관입니다 (body-sm)  │  ← HelpText (선택)
└──────────────────────────────────────────────┘
```

| 요소 | 사양 |
|------|------|
| Checkbox | `Checkbox` 18×18px (접근성 모드 `CheckboxLg` 24×24px), primary-500 |
| Label | body-md, neutral-800 |
| 필수/선택 뱃지 | `StatusBadge` — 필수=error bg/text, 선택=neutral-100/600, 고지·동의=info bg/text |
| 전문 보기 | `Button variant="ghost" size="sm"` + ChevronRight → `PolicyViewer`(A-09/A-10) 진입 |
| HelpText | body-sm, neutral-500 (선택) |

**상태:**
```
미동의(기본) → Checkbox unchecked, 테두리 neutral-300
동의         → Checkbox checked primary-500
필수 미충족   → 제출 시도 시 테두리 error-accent + 인라인 강조(흔들림 애니메이션 1회, reduced-motion 시 색상만)
disabled     → 대리동의 불가 항목 등, neutral-100 bg
```

- **전체 동의 토글:** 목록 상단 선택적 "전체 동의" 체크박스는 **시각 보조**일 뿐 — 개별 `consents` 레코드는 항목별 분리 INSERT(docs/02 §2.15). 필수+선택을 한 INSERT로 묶지 않는다.
- **접근성:** 각 항목 `<label>` 연결, Badge는 `aria-label`("필수 동의 항목"), 전문 보기 버튼 `aria-label`에 약관명 포함. 키보드 Tab 순서: Checkbox → 전문 보기.

---

### 8-19. PolicyViewer (약관/처리방침 뷰어)

이용약관 전문(A-09) · 개인정보 처리방침 전문(A-10) 정적 페이지(docs/16 §7 게시 의무). 동의 시점의 버전·일시를 함께 표시해 변경 고지(docs/16 §7) 대상 판별 근거를 보인다.

```
┌──────────────────────────────────────────────┐
│ 이용약관                              [버전 v1.2]│  ← heading-2 + 버전 StatusBadge
│ 시행일 2026-06-01 · 내가 동의한 일시 2026-06-14 │  ← caption, neutral-500
├──────────────────────────────────────────────┤
│ [목차 앵커 — 조항 점프]                          │  ← 웹: 좌측 sticky / 모바일: 상단 Accordion
│                                                │
│ 제1조 (목적) ...                               │  ← body-md, max-w-3xl(768px)
│ 제2조 ...                                      │
│                                                │
├──────────────────────────────────────────────┤
│ [← 돌아가기]                                    │  ← Sticky Footer (A-08에서 진입 시)
└──────────────────────────────────────────────┘
```

| 요소 | 사양 |
|------|------|
| 버전 뱃지 | `StatusBadge variant="info"` — `consents.policy_version` 연계 |
| 동의 일시 | caption, "내가 동의한 일시"는 로그인 후 본인 동의 이력 존재 시에만 표시 |
| 본문 | 장문 가독성 — body-md, 줄간격 넉넉, 최대폭 768px(타임라인 폭 기준) |
| 목차 | 웹 sticky 사이드 앵커 / 모바일 상단 Accordion |

**상태:** 로딩(Skeleton 문단 블록 ×5) · 정상 · 에러(약관 로드 실패 → InlineAlert + 재시도) · 빈 상태 없음(정적 콘텐츠 항상 존재).
- **접근성:** 본문 `<article>` 랜드마크, 조항 제목 `<h2>` 계층, 목차 앵커 `aria-label`. 대비비 7:1(당사자 진입 시 §9 대형 변형).

---

### 8-20. ConsentManagementList (동의 현황·철회)

설정 내 개인정보·동의 관리(G-65 보호자 / P-23 당사자)에서 수집된 동의 현황을 조회하고 선택 동의를 철회한다(docs/16 §5 권리행사). 데이터 내보내기(전송요구권 §35-2) 진입점을 포함한다.

```
┌──────────────────────────────────────────────┐
│ 동의 현황                                       │  ← heading-2
├──────────────────────────────────────────────┤
│ 이용약관          필수  동의함 2026-06-14  [전문]│  ← 필수: 철회 불가(회원 탈퇴 안내)
│ 개인정보(필수)    필수  동의함 2026-06-14  [전문]│
│ 마케팅·알림       선택  [Toggle ●]  2026-06-14  │  ← 선택: Toggle 즉시 철회
│ 위탁·국외이전     고지  동의함 2026-06-14  [고지]│
├──────────────────────────────────────────────┤
│ 민감정보(장애·건강) 별도  동의함 · [철회]        │  ← 철회 시 핵심 기능 제한 Confirm
│ 고유식별정보        별도  미수집                  │
├──────────────────────────────────────────────┤
│ [내 데이터 내보내기]  (CSV/PDF)                  │  ← Button outline, docs/05 §9 연계
└──────────────────────────────────────────────┘
```

| 요소 | 사양 |
|------|------|
| 항목 행 | `ConsentItem` 읽기 변형 + 동의 일시(caption) + 구분 뱃지 |
| 선택 동의 철회 | `Toggle` — off 전환 시 즉시 `consents` 처리정지 반영 |
| 필수/민감 철회 | `Button danger` → Confirm Modal(docs/07 §8-7): "철회 시 서비스/기능 제한" 경고 |
| 데이터 내보내기 | `Button variant="outline"` → 비동기 생성 후 다운로드(Toast 완료 알림) |

**상태:** 로딩(Skeleton 행 ×4) · 정상 · 빈 상태(동의 이력 없음 — 신규 계정, EmptyState "동의 내역이 없어요") · 에러(InlineAlert + 재시도) · 처리 중(철회/내보내기 — 버튼 Loading).
- **대리/본인 분기:** 보호자(G-65)는 대리동의(`on_behalf=true`) 당사자별 탭으로 분리 표시. 당사자 본인(P-23)은 본인 명의(`on_behalf=false`) 동의만 — 성년 전환 후 활성(docs/05 §10).
- **접근성:** 행 단위 `<dl>` 또는 표 구조, 철회 버튼 `aria-label`에 항목명 포함. P-23은 §9 당사자 접근성 모드 대형 변형 적용.

---

## 9. 당사자 접근성 모드

`ui_mode: 'icon'` 설정 시 자동 적용. WCAG 2.1 **AAA** 목표.

### 9-1. 타이포그래피 오버라이드

| 일반 | 접근성 모드 | Tailwind |
|------|-----------|----------|
| body-md (16px) | body-lg (20px) | `text-xl` |
| body-sm (14px) | body-md (16px) | `text-base` |
| caption (12px) | body-sm (14px) | `text-sm` |
| button-md (14px) | button-lg (16px) | `text-base font-semibold` |

### 9-2. 컴포넌트 오버라이드

| 요소 | 기본 | 접근성 모드 |
|------|------|-----------|
| Button height | 40px | 56px |
| Tap target | 44×44px | 56×56px |
| Icon size | 20px | 28px |
| Card padding | p-4 | p-6 |
| Border radius | radius-lg | radius-2xl |
| 색상 대비비 | 4.5:1 AA | 7:1 AAA |

### 9-3. 당사자 전용 컬러 (고대비)

| 항목 | 기본 | 고대비 모드 |
|------|------|-----------|
| 배경 | `#F9FAFB` | `#FFFFFF` |
| 메인 텍스트 | `#1F2937` | `#000000` |
| 버튼 (warm) | `#E8724A` | `#C4500A` (더 어둡게) |
| 포커스 링 | primary-500 2px | `#000000 3px` |

### 9-4. 아이콘 선택 카드 (ST-08)

```
┌───────────────┐  ← 너비: 화면의 45% (2열 그리드)
│               │
│   [아이콘]    │  ← 72×72px 커스텀 일러스트
│   💪           │
│               │
│  건강해요     │  ← body-md (접근성: body-lg), 중앙 정렬
└───────────────┘
기본:   neutral-100 bg, neutral-300 border 2px
선택:   primary-100 bg, primary-500 border 3px, ✓ 우상단
아이콘 카드 height: 120px (기본) / 140px (접근성 모드)
rounded-2xl
```

> **당사자 동의·권리 관리 대형 변형(P-23):** §8-20 `ConsentManagementList`와 §8-18 `ConsentItem`은 당사자 본인 진입(P-23) 시 본 접근성 모드를 적용한다 — `CheckboxLg`(24px), 버튼 56px, 본문 body-lg(20px), 쉬운 언어 레이블("동의함/안 함"), Toggle 대신 큰 ●/○ 버튼, 7:1 고대비. 성년 전환 동의 재취득(docs/05 §10) 화면도 동일 변형을 따른다.

### 9-5. 키보드 & 스위치 접근

- 모든 인터랙티브 요소 Tab 접근 가능
- Focus indicator: 2px solid (AAA: 3px solid #000)
- Enter/Space: 버튼/카드 활성화
- Escape: 모달/시트 닫기
- 스위치 접근(Switch Access): 터치 영역 최소 56×56px

---

## 10. Tailwind 설정

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F8FA', 100: '#D6EDF3', 200: '#A8D6E4',
          300: '#72BBCF', 400: '#479DB6', 500: '#3B7D8E',
          600: '#316878', 700: '#265462', 800: '#1C404B', 900: '#122D36',
        },
        warm: {
          50: '#FFF8F4', 100: '#FDEADE', 200: '#FACDB8',
          300: '#F5A882', 400: '#EE8A5D', 500: '#E8724A',
          600: '#D45A34', 700: '#B34628',
        },
        domain: {
          medical:    { bg: '#FEF0F0', text: '#BF3030', accent: '#E04545' },
          education:  { bg: '#EEF4FD', text: '#2E5FA8', accent: '#4377C0' },
          welfare:    { bg: '#EDFAF3', text: '#276B4C', accent: '#3EA673' },
          daily:      { bg: '#FFF5E6', text: '#B56F10', accent: '#E8991E' },
          transition: { bg: '#F4EFFB', text: '#6A43A8', accent: '#8A5DC6' },
          legal:      { bg: '#EEF2F7', text: '#3E5E7A', accent: '#5A7FA0' },
        },
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Apple SD Gothic Neo', 'Noto Sans KR', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-1': ['2.5rem',   { lineHeight: '3rem',   letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-2': ['2rem',     { lineHeight: '2.5rem', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-1': ['1.75rem',  { lineHeight: '2.25rem', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-2': ['1.5rem',   { lineHeight: '2rem',   letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-3': ['1.25rem',  { lineHeight: '1.75rem', fontWeight: '600' }],
        'heading-4': ['1.125rem', { lineHeight: '1.625rem', fontWeight: '500' }],
        'body-lg':   ['1.125rem', { lineHeight: '1.75rem' }],
        'body-md':   ['1rem',     { lineHeight: '1.5rem'  }],
        'body-sm':   ['0.875rem', { lineHeight: '1.375rem' }],
        'caption':   ['0.75rem',  { lineHeight: '1.125rem', letterSpacing: '0.01em' }],
        'label-lg':  ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-sm':  ['0.75rem',  { lineHeight: '1rem',   letterSpacing: '0.04em', fontWeight: '500' }],
      },
      borderRadius: {
        'sm': '4px', 'md': '8px', 'lg': '12px',
        'xl': '16px', '2xl': '20px',
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'elevation-2': '0 4px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06)',
        'elevation-3': '0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)',
        'elevation-4': '0 16px 48px rgba(0,0,0,0.14), 0 8px 16px rgba(0,0,0,0.08)',
      },
      transitionDuration: {
        'fast':   '100ms',
        'normal': '200ms',
        'slow':   '300ms',
        'slower': '500ms',
      },
      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.2, 0, 0, 1)',
        'enter':    'cubic-bezier(0, 0, 0.2, 1)',
        'exit':     'cubic-bezier(0.4, 0, 1, 1)',
        'spring':   'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

---

## 컴포넌트 파일 구조 (참고)

```
components/
├── ui/                      ← shadcn/ui 베이스 (수정 최소화)
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...
│
├── ondol/                   ← OnDol 커스텀 컴포넌트
│   ├── domain/
│   │   ├── DomainBadge.tsx
│   │   └── DomainIcon.tsx
│   ├── records/
│   │   ├── RecordCard.tsx
│   │   ├── RecordListItem.tsx
│   │   └── TimelineEntry.tsx
│   ├── person/
│   │   ├── PersonCard.tsx
│   │   └── SelfExpressionWizard.tsx
│   ├── permissions/
│   │   ├── PermissionMatrix.tsx
│   │   └── PermissionBadge.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── BottomTabBar.tsx     ← React Native
│   │   └── StepIndicator.tsx
│   └── accessibility/
│       ├── IconSelectorCard.tsx
│       └── AccessibilityWrapper.tsx
│
└── icons/
    ├── domain/               ← 분야별 커스텀 SVG 아이콘
    └── expression/           ← 당사자 자기표현 SVG 일러스트
```
