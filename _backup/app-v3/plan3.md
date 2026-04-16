# Plan 3: `/clone-ui` Custom Skill 구현 방안

> 대상 웹사이트의 UI/UX 스타일을 Tailwind CSS로 자동 추출 및 적용하는 Claude Code Custom Skill

---

## 1. 문제 정의

### 1.1 오늘 겪은 수동 워크플로우 (Google Maps Platform AI → BlueEye)

```
Round 1: Playwright로 URL 접속 → browser_evaluate로 CSS 추출 (3회 시행착오)
Round 2: 추출된 CSS를 수동 분석 → 커스텀 CSS 클래스로 변환 (Tailwind 미사용)
Round 3: 스크린샷 비교 → 7개 불일치 발견 → 수동 수정
Round 4: 커스텀 CSS → Tailwind CSS 리팩토링 → @import 순서 에러 → 수정
─────────────────────────────────────────────────────
총 소요: 4라운드, 다수의 파일 수정, 반복적 시행착오
```

### 1.2 목표

**`/clone-ui <url> [selector]`** 한 번으로 위 전체 과정을 자동화:

1. URL 접속 및 대상 영역 식별
2. `getComputedStyle()` 기반 정밀 CSS 추출
3. Tailwind v4 `@theme` 토큰 + 유틸리티 클래스 자동 생성
4. 프로젝트 파일에 적용
5. 원본 vs 결과 스크린샷 비교 검증

### 1.3 오늘의 핵심 교훈

| 교훈 | 설명 |
|------|------|
| `getComputedStyle()`이 가장 신뢰성 높음 | `document.styleSheets`는 cross-origin 제한, CSS Modules 해시 문제. Computed style은 최종 렌더링 결과를 직접 반환 |
| 계층적 추출이 필수 | 단일 요소가 아닌 부모→자식 트리 전체의 스타일을 추출해야 레이아웃 재현 가능 |
| Tailwind v4 `@theme`이 핵심 | 반복 사용되는 색상은 `@theme { --color-*: ... }` 디자인 토큰으로 정의해야 시맨틱 유틸리티 자동 생성 |
| Google Fonts는 `<link>`로 로드 | Tailwind v4의 `@import "tailwindcss"` 이후에 `@import url()` 불가 → layout.tsx에서 `<link>` 사용 |
| 그래디언트 보더 기법 | 래퍼에 gradient bg + `p-px`, 내부에 solid bg → 1px gradient border 효과 |

---

## 2. Skill 아키텍처

### 2.1 디렉토리 구조

```
~/.claude/skills/clone-ui/
├── SKILL.md                    # 메인 지침 (트리거 시 로드, ~400줄)
├── TAILWIND_V4_TOKENS.md       # Tailwind v4 @theme 토큰 매핑 레퍼런스
├── CSS_PATTERNS.md             # 사이트 유형별 추출 전략
└── scripts/
    └── extract-styles.mjs      # 브라우저에서 실행할 CSS 추출 로직 (템플릿)
```

### 2.2 Progressive Disclosure (단계별 로딩)

| Level | 파일 | 로드 시점 | 토큰 | 역할 |
|-------|------|----------|------|------|
| L1 | SKILL.md frontmatter | 항상 (세션 시작) | ~80 | Skill 존재 인식, 트리거 조건 |
| L2 | SKILL.md body | `/clone-ui` 호출 시 | ~3,000 | 5단계 워크플로우 전체 지침 |
| L3 | TAILWIND_V4_TOKENS.md | Step 3 (변환) 시 | ~2,000 | CSS→Tailwind 정밀 매핑 |
| L3 | CSS_PATTERNS.md | CSS Modules/Shadow DOM 사이트일 때 | ~1,000 | 추출 실패 시 대안 전략 |
| L3 | scripts/extract-styles.mjs | Step 2에서 `browser_evaluate` 실행 시 | 0 | 컨텍스트 비소비, 출력만 반환 |

---

## 3. SKILL.md 전체 설계

### 3.1 Frontmatter

```yaml
---
name: clone-ui
description: >
  Clone a website's UI design into Tailwind CSS. Navigates to a URL with Playwright,
  extracts computed styles from target elements, converts to Tailwind v4 @theme tokens
  and utility classes, and applies to project components. Use when the user wants to
  replicate, copy, or clone a website's visual design, or convert CSS to Tailwind.
disable-model-invocation: true
allowed-tools: Read Edit Write Bash Glob Grep
argument-hint: "<url> [css-selector-or-description]"
effort: max
---
```

**설계 결정 근거:**

| 필드 | 값 | 이유 |
|------|-----|------|
| `name` | `clone-ui` | 직관적 (/clone-ui), 동작을 명확히 설명 |
| `disable-model-invocation` | `true` | 사용자가 명시적으로 호출해야 함 (자동 트리거 방지) |
| `allowed-tools` | Read Edit Write Bash Glob Grep | 파일 조작에 대해 매번 승인 프롬프트 제거 |
| `effort` | `max` | CSS 분석과 Tailwind 변환에 최고 추론 품질 필요 |
| Playwright MCP 도구 | 미명시 | MCP 도구는 별도 경로로 접근, allowed-tools에 불필요 |

### 3.2 Body (메인 워크플로우)

```markdown
# Clone UI - Website Style Extraction & Tailwind CSS Conversion

대상 URL의 UI 디자인을 분석하여 Tailwind CSS로 변환하고 프로젝트에 적용합니다.

## 입력

- `$0`: 대상 URL (필수)
- `$1`: CSS 셀렉터, 요소 설명, 또는 스크린샷 영역 (선택)

셀렉터 미지정 시 페이지 스냅샷을 보여주고 사용자에게 대상 영역을 질문합니다.

## Step 1: 페이지 탐색 및 대상 식별

1. `browser_navigate`로 `$0` URL 접속
2. `browser_take_screenshot`으로 전체 페이지 캡처 → 원본 참조 이미지로 저장
3. `browser_snapshot`으로 접근성 트리 구조 파악
4. `$1`이 제공된 경우:
   - CSS 셀렉터라면 해당 요소를 대상으로 설정
   - 텍스트 설명이라면 스냅샷에서 매칭되는 요소 식별
5. `$1`이 미제공이면: 스크린샷을 사용자에게 보여주고 대상 영역 질문

**결과물**: 대상 요소의 ref 또는 셀렉터 확보

## Step 2: 계층적 CSS 추출 (핵심)

`browser_evaluate`로 대상 요소와 모든 자식 요소의 computed styles을 계층적으로 추출합니다.

### 2-1: 대상 요소 트리 구조 파악

```javascript
(targetEl) => {
  // 대상 요소와 모든 자식 요소의 트리 구조 추출
  function mapTree(el, depth = 0) {
    const cs = window.getComputedStyle(el);
    const children = Array.from(el.children).map(c => mapTree(c, depth + 1));
    return {
      tag: el.tagName.toLowerCase(),
      classes: el.className,
      depth,
      childCount: el.children.length,
      textPreview: el.textContent?.substring(0, 40),
      // 레이아웃 관련 핵심 속성만 우선 추출
      layout: {
        display: cs.display,
        position: cs.position,
        width: cs.width,
        height: cs.height,
        padding: cs.padding,
        margin: cs.margin,
      },
      children: children.length > 0 ? children : undefined,
    };
  }
  return mapTree(targetEl);
}
```

### 2-2: 각 요소의 전체 스타일 추출

```javascript
(el) => {
  const cs = window.getComputedStyle(el);
  return {
    // 레이아웃
    display: cs.display,
    position: cs.position,
    flexDirection: cs.flexDirection,
    justifyContent: cs.justifyContent,
    alignItems: cs.alignItems,
    gap: cs.gap,
    flexWrap: cs.flexWrap,

    // 크기
    width: cs.width,
    height: cs.height,
    maxWidth: cs.maxWidth,
    minHeight: cs.minHeight,

    // 간격
    padding: cs.padding,
    margin: cs.margin,

    // 배경/색상
    backgroundColor: cs.backgroundColor,
    backgroundImage: cs.backgroundImage,
    color: cs.color,

    // 보더
    border: cs.border,
    borderRadius: cs.borderRadius,
    borderColor: cs.borderColor,

    // 타이포그래피
    fontSize: cs.fontSize,
    fontWeight: cs.fontWeight,
    fontFamily: cs.fontFamily,
    lineHeight: cs.lineHeight,
    textAlign: cs.textAlign,
    letterSpacing: cs.letterSpacing,

    // 효과
    backdropFilter: cs.backdropFilter,
    boxShadow: cs.boxShadow,
    opacity: cs.opacity,
    overflow: cs.overflow,
    cursor: cs.cursor,
    transition: cs.transition,

    // 위치 (absolute/fixed인 경우)
    top: cs.top,
    right: cs.right,
    bottom: cs.bottom,
    left: cs.left,
    transform: cs.transform,
    zIndex: cs.zIndex,
  };
}
```

### 2-3: 특수 요소 추가 추출

- `<textarea>`, `<input>`: `placeholder` 텍스트, `::placeholder` pseudo-element 스타일
- `<button>`: `:hover` 상태 스타일 (hover 후 재추출)
- `<a>`: `href` 속성
- `<img>`, `<svg>`: `src`, `viewBox`, `fill` 속성

### 2-4: 추출 실패 시 대안

Cross-origin 제한 등으로 실패하면 [CSS_PATTERNS.md](CSS_PATTERNS.md) 참조.

**결과물**: JSON 형태의 계층적 스타일 데이터

## Step 3: CSS → Tailwind v4 변환

추출된 CSS 속성을 Tailwind v4 유틸리티 클래스로 변환합니다.
상세 매핑 테이블은 [TAILWIND_V4_TOKENS.md](TAILWIND_V4_TOKENS.md)를 참조하세요.

### 3-1: 디자인 토큰 추출 (반복 사용 색상)

추출된 모든 색상 값을 수집하고, 2회 이상 등장하는 색상을 `@theme` 토큰으로 정의:

```css
@theme {
  --color-<semantic-name>: <color-value>;
}
```

시맨틱 네이밍 규칙:
- `rgb(32, 33, 36)` → `--color-surface-dark` (어두운 배경)
- `rgb(26, 115, 232)` → `--color-primary` (주요 액션)
- `rgb(174, 203, 250)` → `--color-accent-light` (밝은 강조)
- 이미 Tailwind 기본값에 매핑 가능한 색상은 토큰 생략 (예: white, black)

### 3-2: 속성별 변환 규칙

**직접 매핑 (우선)**:
- `padding: 32px` → `p-8` (32/4=8)
- `font-size: 14px` → `text-sm`
- `border-radius: 50%` → `rounded-full`
- `display: flex` → `flex`

**Arbitrary value (표준값 없을 때)**:
- `height: 190px` → `h-[190px]`
- `border-radius: 23px` → `rounded-[23px]`
- `backdrop-filter: blur(12px)` → `backdrop-blur-[12px]`

**@theme 토큰 참조**:
- `background: rgb(24,61,121)` → `bg-chip-bg` (@theme에 정의된 경우)

**인라인 유지 (Tailwind 표현 불가)**:
- 복잡한 `linear-gradient()` → `bg-[linear-gradient(...)]` arbitrary 또는 className으로
- CSS 변수 참조 값

### 3-3: 그래디언트 보더 기법 감지

래퍼 요소가 다음 패턴을 가지면 그래디언트 보더로 판단:
- `background: linear-gradient(...)` + `padding: 1px` + `border-radius: Npx`
- 자식 요소: `background: solid-color` + `border-radius: (N-1)px`

→ 래퍼: `bg-[linear-gradient(...)] rounded-3xl p-px`
→ 자식: `bg-<token> rounded-[23px]`

### 3-4: 폰트 처리

1. `fontFamily` 분석하여 Google Fonts 사용 여부 확인
2. Google Fonts인 경우: `layout.tsx`에 `<link>` 태그 추가
3. 비공개 폰트(예: Google Sans)인 경우: 가장 유사한 공개 폰트 대체 추천
4. `@theme { --font-sans: '...'; }` 정의

**결과물**: Tailwind className 문자열 + @theme 토큰 + 필요 시 layout.tsx 수정사항

## Step 4: 프로젝트 적용

### 4-1: globals.css 수정
```css
@import "tailwindcss";
@import "maplibre-gl/dist/maplibre-gl.css"; /* 기존 import 유지 */

@theme {
  /* Step 3에서 추출된 디자인 토큰 */
  --font-sans: '...', Arial, Helvetica, sans-serif;
  --color-<name>: <value>;
  ...
}

@layer base {
  html, body {
    @apply m-0 p-0 overflow-hidden h-full w-full font-sans;
  }
}
```

### 4-2: 컴포넌트 파일 수정
- 기존 `style={{}}` 인라인 스타일 → Tailwind className으로 교체
- 기존 커스텀 CSS 클래스 → Tailwind 유틸리티로 교체
- `className` 문자열이 너무 길면 (100자+) 관련 유틸리티를 논리 그룹으로 줄바꿈

### 4-3: layout.tsx 수정 (필요 시)
- Google Fonts `<link>` 추가
- 기타 `<head>` 메타데이터 수정

## Step 5: 비교 검증

1. `browser_navigate`로 로컬 dev 서버 페이지 접속
2. `browser_take_screenshot`으로 결과 캡처
3. 원본 캡처와 나란히 비교 분석:
   - 레이아웃/위치 일치 여부
   - 색상/타이포그래피 일치 여부
   - 간격/패딩 일치 여부
   - 세부 디테일 (보더, 그림자, 효과)
4. 불일치 항목이 있으면 목록으로 보고하고 수정 여부 질문
5. 사용자 승인 시 자동 수정 실행

## 주의사항

- `@import "tailwindcss"` 이후에 `@import url(...)` 불가 → 외부 리소스는 `<link>` 사용
- `resize: none` → `resize-none` (textarea 전용)
- `overflow: hidden` → `overflow-hidden`
- `outline: none` → `outline-none`
- `white-space: nowrap` → `whitespace-nowrap`
- hover/transition: `hover:bg-<token> transition-colors`
- `::placeholder` 스타일: `placeholder:text-<token>`
```

---

## 4. 보조 파일 설계

### 4.1 TAILWIND_V4_TOKENS.md

Tailwind v4 특화 매핑 레퍼런스. Step 3에서 필요 시 로드됩니다.

**핵심 내용:**

```
# Tailwind v4 @theme 토큰 및 유틸리티 매핑

## @theme 블록 (Tailwind v4 전용)
- `--color-<name>: value` → `bg-<name>`, `text-<name>`, `border-<name>` 자동 생성
- `--font-<name>: value` → `font-<name>` 자동 생성
- `--spacing-<name>: value` → spacing 유틸리티에 추가

## Spacing 계산법
| px | rem | Tailwind |
|----|-----|----------|
| 4  | 0.25 | 1 |
| 8  | 0.5  | 2 |
| 12 | 0.75 | 3 |
| 16 | 1    | 4 |
| 20 | 1.25 | 5 |
| 24 | 1.5  | 6 |
| 32 | 2    | 8 |
| 40 | 2.5  | 10 |
| 48 | 3    | 12 |
| 표준 스케일에 없으면 → `[Npx]` arbitrary value

## Font Size 매핑
| px | Tailwind |
|----|----------|
| 12 | text-xs |
| 14 | text-sm |
| 16 | text-base |
| 18 | text-lg |
| 20 | text-xl |
| 24 | text-2xl |
| 30 | text-3xl |
| 비표준 → `text-[Npx]`

## Border Radius 매핑
| px/값 | Tailwind |
|-------|----------|
| 2px | rounded-sm |
| 4px | rounded |
| 6px | rounded-md |
| 8px | rounded-lg |
| 12px | rounded-xl |
| 16px | rounded-2xl |
| 24px | rounded-3xl |
| 50% | rounded-full |
| 비표준 → `rounded-[Npx]`

## 색상 결정 흐름
1. Tailwind 기본 색상과 매칭 가능? → `text-white`, `bg-black` 등
2. 2회 이상 사용? → @theme 토큰으로 정의
3. 1회만 사용? → arbitrary value `text-[rgb(N,N,N)]`

## Arbitrary Value 규칙
- 공백은 `_`로 대체: `bg-[linear-gradient(to_right,red,blue)]`
- 쉼표 뒤 공백 제거: `bg-[rgb(32,33,36)]` (O) / `bg-[rgb(32, 33, 36)]` (X)
- 퍼센트: `w-[76.71%]`
```

### 4.2 CSS_PATTERNS.md

사이트 유형별 추출 대안 전략:

```
# 사이트 유형별 CSS 추출 전략

## 1순위: getComputedStyle (모든 사이트 공통)
- 크로스오리진 제한 없음
- 최종 렌더링 결과 직접 반환
- 단점: 상속된 값과 명시적 값 구분 불가

## CSS Modules 사이트 (해시 클래스명)
- 패턴: `_className_hash_lineNumber`
- getComputedStyle로 추출 후, 구조만 참조

## CSS-in-JS 사이트 (Styled Components, Emotion)
- <style> 태그에 동적 삽입
- getComputedStyle이 최선

## Tailwind 사이트
- element.className에서 직접 Tailwind 클래스 복사
- className 분석만으로 완료 가능

## Shadow DOM
- element.shadowRoot.querySelector로 접근
- getComputedStyle(shadowElement)

## :hover, :focus 등 의사 클래스
- Playwright hover 후 재추출
- 또는 CSS 규칙에서 :hover 블록 검색
```

### 4.3 scripts/extract-styles.mjs

`browser_evaluate`에서 사용할 JavaScript 추출 함수 템플릿:

```javascript
// 대상 요소의 계층적 스타일 추출
// 사용법: browser_evaluate에서 이 로직을 실행
// 입력: CSS 셀렉터 또는 요소 참조
// 출력: JSON 형태의 스타일 트리

export function extractTree(rootSelector) {
  const root = document.querySelector(rootSelector);
  if (!root) return { error: `Element not found: ${rootSelector}` };

  const STYLE_PROPS = [
    'display', 'position', 'flexDirection', 'justifyContent', 'alignItems',
    'gap', 'flexWrap', 'width', 'height', 'maxWidth', 'minHeight',
    'padding', 'margin', 'backgroundColor', 'backgroundImage', 'color',
    'border', 'borderRadius', 'borderColor', 'fontSize', 'fontWeight',
    'fontFamily', 'lineHeight', 'textAlign', 'letterSpacing',
    'backdropFilter', 'boxShadow', 'opacity', 'overflow', 'cursor',
    'top', 'right', 'bottom', 'left', 'transform', 'zIndex',
  ];

  function extract(el, depth = 0) {
    if (depth > 10) return null; // 깊이 제한
    const cs = window.getComputedStyle(el);
    const styles = {};
    for (const prop of STYLE_PROPS) {
      const val = cs[prop];
      if (val && val !== 'none' && val !== 'normal' && val !== 'auto'
          && val !== '0px' && val !== 'rgba(0, 0, 0, 0)') {
        styles[prop] = val;
      }
    }

    const children = Array.from(el.children)
      .map(c => extract(c, depth + 1))
      .filter(Boolean);

    return {
      tag: el.tagName.toLowerCase(),
      id: el.id || undefined,
      classes: el.className || undefined,
      placeholder: el.placeholder || undefined,
      textContent: el.children.length === 0
        ? el.textContent?.trim().substring(0, 50) : undefined,
      styles,
      children: children.length > 0 ? children : undefined,
    };
  }

  return extract(root);
}
```

---

## 5. 사용 시나리오

### 5.1 기본: URL만 지정
```
/clone-ui https://mapsplatform.google.com/ai/
```
→ 스크린샷 표시 → "어떤 영역을 복제할까요?" 질문 → 사용자 응답 후 추출 진행

### 5.2 셀렉터 지정
```
/clone-ui https://mapsplatform.google.com/ai/ [class*="_widget_105ml"]
```
→ 지정 셀렉터의 요소 트리 전체 추출 → Tailwind 변환 → 적용

### 5.3 텍스트 설명으로 지정
```
/clone-ui https://mapsplatform.google.com/ai/ "오늘은 어떤 지도가 필요하신가요?" 박스
```
→ 텍스트로 요소 식별 → 해당 영역 추출

### 5.4 다른 사이트 예시
```
/clone-ui https://vercel.com/home hero 섹션
/clone-ui https://linear.app/features 가격 테이블
/clone-ui https://stripe.com/payments 결제 폼 UI
```

---

## 6. 구현 계획

### Phase 1: 코어 Skill (1일)

```
[ ] ~/.claude/skills/clone-ui/ 디렉토리 생성
[ ] SKILL.md 작성 (frontmatter + 5단계 워크플로우)
[ ] /clone-ui 기본 동작 검증
    - URL 접속 → 스크린샷 → 스타일 추출 → 콘솔 출력
```

### Phase 2: 보조 파일 + 변환 로직 (1일)

```
[ ] TAILWIND_V4_TOKENS.md 작성
[ ] CSS_PATTERNS.md 작성
[ ] scripts/extract-styles.mjs 구현
[ ] 실제 사이트로 E2E 테스트 (Google Maps Platform AI)
```

### Phase 3: 적용 + 검증 자동화 (1일)

```
[ ] globals.css @theme 토큰 자동 삽입 로직
[ ] 컴포넌트 파일 className 자동 교체 로직
[ ] 원본 vs 결과 스크린샷 비교 검증 로직
```

### Phase 4: 엣지케이스 + 개선 (지속적)

```
[ ] 다양한 사이트 유형 테스트 (CSS Modules, Tailwind, CSS-in-JS)
[ ] hover/focus 등 인터랙티브 스타일 추출
[ ] 반응형 미디어쿼리 처리
[ ] 피드백 기반 SKILL.md 개선
```

---

## 7. 기술적 고려사항

### 7.1 Playwright MCP 의존성

| MCP 도구 | 사용 단계 | 용도 |
|----------|----------|------|
| `browser_navigate` | Step 1, 5 | URL 접속 |
| `browser_snapshot` | Step 1 | 접근성 트리 구조 파악 |
| `browser_take_screenshot` | Step 1, 5 | 원본/결과 이미지 캡처 |
| `browser_evaluate` | Step 2 | getComputedStyle 실행 |
| `browser_hover` | Step 2 | hover 상태 스타일 추출 |
| `browser_click` | Step 1 | 쿠키 동의 등 팝업 처리 |

### 7.2 `allowed-tools` vs MCP 도구

- `allowed-tools`에 명시된 도구: 사용자 승인 없이 즉시 실행
- MCP 도구 (Playwright): MCP 서버 설정으로 별도 접근, `allowed-tools`에 명시 불필요
- 따라서 파일 I/O 도구만 `allowed-tools`에 포함

### 7.3 Windows 환경

- 스크립트 경로: `${CLAUDE_SKILL_DIR}/scripts/extract-styles.mjs` (자동 OS 대응)
- Node.js 기반 스크립트 → Python 불필요, Next.js 프로젝트와 호환
- `shell: powershell` 옵션 사용 가능 (필요 시)

### 7.4 토큰 효율성 전략

| 전략 | 설명 |
|------|------|
| 추출 결과 파일 저장 | 대규모 CSS 추출 결과는 임시 파일에 저장 후 Read로 참조 |
| scripts 실행 | extract-styles.mjs는 실행만, 소스코드는 컨텍스트 비소비 |
| 선택적 L3 로드 | TAILWIND_V4_TOKENS.md는 변환 단계에서만 로드 |
| 불필요 속성 필터링 | `getComputedStyle`에서 default/inherit 값 제외 |

---

## 8. 성공 기준

| 기준 | 측정 방법 | 목표 |
|------|----------|------|
| 1회 커맨드 완료 | `/clone-ui URL` 한 번으로 전체 플로우 | Pass/Fail |
| Tailwind 변환 정확도 | 표준 속성의 정확한 Tailwind 매핑 | 95%+ |
| 시각적 일치도 | 원본 vs 결과 스크린샷 비교 | 90%+ |
| 커스텀 CSS 최소화 | globals.css에 남는 커스텀 CSS 줄 수 | @theme 토큰만 |
| 인라인 style 최소화 | TSX에 남는 `style={{}}` 수 | 0~2개 |
| 다양한 사이트 호환 | CSS Modules, 일반 CSS, Tailwind 사이트 | 3종 이상 |

---

## 9. 전체 흐름도

```
사용자: /clone-ui https://example.com "hero section"
         │
         ▼
┌─── Step 1: 탐색 ──────────────────────────────────────┐
│  browser_navigate(url)                                 │
│  browser_take_screenshot → _reference/original.png     │
│  browser_snapshot → 접근성 트리                          │
│  → 대상 요소 식별 (ref 또는 셀렉터)                       │
└───────────────────────────────┬────────────────────────┘
                                │
                                ▼
┌─── Step 2: CSS 추출 ──────────────────────────────────┐
│  browser_evaluate(getComputedStyle)                    │
│  → 부모→자식 계층 전체 스타일 JSON                       │
│  → hover 상태 추가 추출                                 │
│  → placeholder, SVG 등 특수 요소                        │
└───────────────────────────────┬────────────────────────┘
                                │
                                ▼
┌─── Step 3: Tailwind 변환 ─────────────────────────────┐
│  [TAILWIND_V4_TOKENS.md 참조]                          │
│  → 반복 색상 → @theme 토큰 정의                         │
│  → CSS 속성 → Tailwind utility 매핑                     │
│  → 그래디언트 보더 등 패턴 감지                           │
│  → 폰트 처리 (Google Fonts / 대체 폰트)                 │
└───────────────────────────────┬────────────────────────┘
                                │
                                ▼
┌─── Step 4: 프로젝트 적용 ─────────────────────────────┐
│  globals.css: @theme 토큰 + @layer base               │
│  layout.tsx: <link> 폰트 (필요 시)                      │
│  component.tsx: className="tailwind utilities..."       │
└───────────────────────────────┬────────────────────────┘
                                │
                                ▼
┌─── Step 5: 비교 검증 ─────────────────────────────────┐
│  browser_navigate(localhost:3001)                      │
│  browser_take_screenshot → _reference/result.png       │
│  → 원본 vs 결과 비교 분석                                │
│  → 불일치 항목 목록 → 사용자에게 수정 제안                 │
└───────────────────────────────────────────────────────┘
```

---

## 10. 요약

오늘 4라운드에 걸쳐 수동으로 수행한 CSS 추출→Tailwind 변환→검증 워크플로우를
**`/clone-ui` 한 번의 커맨드**로 자동화합니다.

핵심 차별점:
- **`getComputedStyle()` 기반**: CSS 규칙 파싱 대신 최종 렌더링 결과 직접 추출 → cross-origin 무관
- **Tailwind v4 `@theme` 네이티브**: 디자인 토큰을 시맨틱 유틸리티로 자동 생성
- **Progressive Disclosure**: SKILL.md는 ~3,000 토큰, 보조 파일은 필요 시만 로드
- **검증 내장**: 스크린샷 비교로 시각적 일치 자동 확인
