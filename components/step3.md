# Step 3 교육 교재: 나만의 포트폴리오 사이트 만들기

---

## Step 1, 2에서 Step 3로

Step 1에서는 **보기만 하는** 카페 웹사이트를 만들었습니다.
Step 2에서는 **클릭하면 반응하는** 주문 기능을 추가했습니다.
Step 3에서는 **나만의 개인 소개 사이트**를 만들고, **실제 인터넷에 배포**합니다.

### 비유: 연습에서 실전으로

```
Step 1-2 = 요리 학원에서 레시피 따라하기
Step 3   = 내 식당 오픈하기 (손님이 실제로 방문 가능!)
```

| 구분 | Step 1-2 | Step 3 |
|------|----------|--------|
| 결과물 | 카페 웹사이트 (남의 것) | 내 포트폴리오 (내 것) |
| 접속 방법 | localhost (내 컴퓨터만) | 인터넷 URL (누구나) |
| 콘텐츠 | 샘플 데이터 | 내 사진, 내 소개 |
| 디바이스 | 데스크톱만 | 데스크톱 + 모바일 |

---

## 1. 완성된 사이트 미리보기

```
+------------------------------------------------------------------+
|  [My Portfolio]                    [About] [Travel] [Photos]     |  <- 네비게이션
+------------------------------------------------------------------+
|                                                                  |
|                        (배경 이미지)                              |
|                                                                  |
|                         WELCOME                                  |
|                        홍길동                                     |  <- Hero 섹션
|               여행을 좋아하는 개발자입니다                          |
|                           |                                      |
|                           v                                      |
+------------------------------------------------------------------+
|                        About Me                                  |
|                                                                  |
|   [프로필 사진]        안녕하세요!                                 |  <- About 섹션
|                        저는 새로운 곳을 탐험하고...                |
|                        - 여행 사진 촬영                           |
|                        - 새로운 음식 탐험                         |
+------------------------------------------------------------------+
|                         Travel                                   |
|                  제가 다녀온 여행지들입니다                         |
|                                                                  |
|   [사진1]    [사진2]    [사진3]                                   |  <- 사진 그리드
|   [사진4]    [사진5]    [사진6]     <- 클릭하면 크게 보기          |
+------------------------------------------------------------------+
|                         Photos                                   |
|                       일상의 순간들                                |
|   [사진1]    [사진2]    [사진3]                                   |
+------------------------------------------------------------------+
|                         홍길동                                    |
|                    hello@example.com                             |  <- Footer
|                      [SNS 아이콘들]                               |
+------------------------------------------------------------------+
```

### 모바일에서는 이렇게 보입니다

```
+------------------+
| [=] My Portfolio |  <- 햄버거 메뉴
+------------------+
|                  |
|    (배경 이미지)   |
|     홍길동        |
|                  |
+------------------+
|    About Me      |
|                  |
|  [프로필 사진]    |  <- 세로 정렬
|                  |
|  안녕하세요!      |
+------------------+
|     Travel       |
|  [사진] <- 1열    |  <- 한 줄에 하나씩
|  [사진]          |
+------------------+
```

---

## 2. 파일 구조

```
프로젝트 폴더/
├── app/
│   ├── globals.css        ← 전역 스타일 (글꼴)
│   ├── layout.tsx         ← 공통 틀
│   └── page.tsx           ← 메인 페이지 (★ 여기를 수정합니다)
│
├── components/
│   ├── Navbar.tsx         ← 상단 네비게이션 (모바일 메뉴 포함)
│   ├── HeroSection.tsx    ← 첫 화면 (이름, 배경 이미지)
│   ├── AboutSection.tsx   ← 자기소개 섹션
│   ├── PhotoGrid.tsx      ← 사진 그리드 (Travel, Photos 공용)
│   ├── ImageModal.tsx     ← 사진 클릭 시 확대 팝업
│   └── Footer.tsx         ← 하단 정보
│
└── public/                ← 내 사진 파일을 여기에 넣습니다
    └── (my-photo.jpg)
```

### Step 1-2와 비교

| Step 1-2 | Step 3 | 변화 |
|----------|--------|------|
| HeroSection (고정 텍스트) | HeroSection (Props로 변경 가능) | 재사용성 향상 |
| MenuCard | PhotoGrid | 카드 -> 사진 그리드 |
| OrderBar | ImageModal | 주문바 -> 이미지 팝업 |
| - | Navbar | 새로 추가 (모바일 메뉴) |

---

## 3. Step 1-2 개념 복습 + Step 3 새 개념

### 복습: 이미 배운 것들

| 개념 | Step에서 배움 | Step 3에서의 활용 |
|------|--------------|------------------|
| 컴포넌트 | Step 1 | 6개의 컴포넌트로 페이지 구성 |
| Props | Step 1 | 내 정보를 컴포넌트에 전달 |
| Tailwind CSS | Step 1 | 모든 스타일링 |
| "use client" | Step 2 | Navbar, PhotoGrid, ImageModal |
| useState | Step 2 | 모달 열기/닫기, 메뉴 토글 |
| onClick | Step 2 | 사진 클릭, 메뉴 버튼 클릭 |
| 조건부 렌더링 | Step 2 | 모달 표시, 모바일 메뉴 표시 |

### 새로 배우는 것: 반응형 웹

**반응형 웹**이란 화면 크기에 따라 레이아웃이 자동으로 바뀌는 것입니다.

```
데스크톱 (넓은 화면)          모바일 (좁은 화면)
[사진][사진][사진]            [사진]
                             [사진]
                             [사진]
```

Tailwind에서는 **브레이크포인트 접두사**를 사용합니다:

| 접두사 | 화면 너비 | 대상 기기 |
|--------|----------|----------|
| (없음) | 0px 이상 | 모바일 (기본값) |
| `sm:` | 640px 이상 | 큰 모바일/작은 태블릿 |
| `md:` | 768px 이상 | 태블릿 |
| `lg:` | 1024px 이상 | 노트북/데스크톱 |

### 실제 코드 예시

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

**핸드폰 → 태블릿 → 컴퓨터 순서로 화면이 커진다고 생각하세요.**

```
핸드폰 (좁음)        태블릿 (중간)         컴퓨터 (넓음)
화면폭 ~639px       화면폭 640px~        화면폭 1024px~

+----------+        +-----+-----+        +----+----+----+
|  사진1   |        |사진1|사진2|        |사진1|사진2|사진3|
+----------+        +-----+-----+        +----+----+----+
|  사진2   |        |사진3|사진4|        |사진4|사진5|사진6|
+----------+        +-----+-----+        +----+----+----+
|  사진3   |
+----------+
   1열                  2열                   3열
```

| 클래스 | 의미 |
|--------|------|
| `grid-cols-1` | 기본값 (가장 좁은 화면부터 적용) |
| `sm:` | 화면이 **좀 커지면** (640px 이상) |
| `lg:` | 화면이 **많이 커지면** (1024px 이상) |

> **비유: "방 크기에 따라 책상 배치를 바꾸는 것"**
> - 좁은 방: 책상 1개만 세로로
> - 중간 방: 책상 2개 나란히
> - 넓은 방: 책상 3개 나란히

**핵심**: Tailwind는 **모바일 우선** 방식입니다. 기본값은 모바일이고, `sm:`, `md:`, `lg:`로 큰 화면을 추가합니다.

---

## 4. page.tsx 읽기 - 내 정보 설정하기

page.tsx는 크게 **3개 영역**으로 나뉩니다:

```tsx
// ============================================
// 영역 1: 내 정보 (★ 여기를 수정하세요!)
// ============================================
const myInfo = {
  name: "홍길동",                              // 이름
  tagline: "여행을 좋아하는 개발자입니다",        // 한 줄 소개
  email: "hello@example.com",                 // 이메일
  greeting: "안녕하세요!",                     // 인사말
  description: "저는 새로운 곳을 탐험하고...",   // 자기소개
  highlights: ["여행 사진 촬영", ...],          // 관심사 목록
  socialLinks: { instagram: "...", ... },     // SNS 링크
};

// ============================================
// 영역 2: 이미지 설정
// ============================================
const images = {
  hero: "배경 이미지 URL",
  profile: "프로필 사진 URL",
  travel: [ { src: "...", alt: "...", caption: "..." }, ... ],
  photos: [ { src: "...", alt: "...", caption: "..." }, ... ],
};

// ============================================
// 영역 3: 페이지 조립 (수정 불필요)
// ============================================
export default function Home() {
  // ... 컴포넌트 배치
}
```

### 수정해야 할 곳

**영역 1과 2만 수정**하면 됩니다. 영역 3은 건드릴 필요 없습니다.

```tsx
// 수정 전 (샘플 데이터)
const myInfo = {
  name: "홍길동",
  tagline: "여행을 좋아하는 개발자입니다",
  ...
};

// 수정 후 (내 정보)
const myInfo = {
  name: "김철수",
  tagline: "맛집 탐방을 즐기는 마케터입니다",
  ...
};
```

---

## 5. 내 사진 넣는 방법

### 방법 1: Unsplash 이미지 사용 (쉬움)

현재 템플릿은 [Unsplash](https://unsplash.com) 무료 이미지를 사용하고 있습니다.
Unsplash에서 마음에 드는 사진을 찾아 URL을 복사해서 붙여넣으면 됩니다.

```tsx
// 예시
{
  src: "https://images.unsplash.com/photo-xxxxx?w=800&q=80",
  alt: "사진 설명",
  caption: "사진 아래 표시될 캡션",
}
```

### 방법 2: 내 사진 파일 사용 (추천)

1. `public` 폴더에 사진 파일을 복사합니다
2. 파일명을 영문으로 변경합니다 (예: `tokyo-trip.jpg`)
3. page.tsx에서 경로를 수정합니다

```tsx
// 수정 전 (Unsplash URL)
hero: "https://images.unsplash.com/photo-xxxxx",

// 수정 후 (내 사진)
hero: "/my-background.jpg",   // public 폴더의 my-background.jpg
```

```
public/
├── my-background.jpg    <- hero에 사용
├── my-profile.jpg       <- profile에 사용
├── tokyo-trip.jpg       <- travel 배열에 추가
└── food-photo.jpg       <- photos 배열에 추가
```

---

## 6. 컴포넌트별 설명

### 6.1 Navbar.tsx - 네비게이션 바

```tsx
"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);    // 모바일 메뉴 열림/닫힘
  const [isScrolled, setIsScrolled] = useState(false);    // 스크롤 여부

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);  // 50px 이상 스크롤하면 true
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ...
}
```

#### 새로운 개념: useEffect

`useEffect`는 **"페이지가 로드된 후에 이 작업을 실행해라"** 라는 뜻입니다.

```tsx
useEffect(() => {
  // 페이지가 로드되면 실행되는 코드
  window.addEventListener("scroll", handleScroll);

  // 페이지를 떠날 때 실행되는 코드 (정리)
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

| useState | useEffect |
|----------|-----------|
| 값을 기억하고 화면을 업데이트 | 페이지 로드 후 작업 실행 |
| 칠판 | 자동 실행 프로그램 |

#### 스크롤에 따른 네비게이션 변화

**1단계: 스크롤 감지 (11번 라인)**
```tsx
setIsScrolled(window.scrollY > 50);
```
→ 50px 이상 스크롤하면 `isScrolled = true`

**2단계: 색상 변경 (조건부 스타일)**

| 위치 | 라인 | 스크롤 전 | 스크롤 후 |
|------|------|----------|----------|
| 네비게이션 배경 | 26-28 | `bg-transparent` (투명) | `bg-white/90` (흰색) |
| 로고 글자 | 37 | `text-white` (흰색) | `text-neutral-800` (검정) |
| 메뉴 글자 | 51 | `text-white/90` (흰색) | `text-neutral-600` (회색) |
| 햄버거 버튼 | 63 | `text-white` (흰색) | `text-neutral-800` (검정) |

**코드 패턴**
```tsx
className={`... ${
  isScrolled ? "스크롤 후 스타일" : "스크롤 전 스타일"
}`}
```

> `isScrolled`가 true/false에 따라 다른 Tailwind 클래스가 적용됩니다.

#### 화면 크기에 따른 메뉴 변화

```
데스크톱 (768px 이상)              모바일 (768px 미만)
+---------------------------+     +------------------+
| Logo   About Travel Photos|     | Logo         [=] |  <- 햄버거
+---------------------------+     +------------------+
     일반 메뉴 표시                   클릭하면 메뉴 펼침
```

**코드에서 보면**
```tsx
{/* 데스크톱 메뉴 - md 이상에서만 보임 */}
<div className="hidden md:flex ...">   // 45번 라인
  About, Travel, Photos
</div>

{/* 모바일 햄버거 - md 미만에서만 보임 */}
<button className="md:hidden ...">     // 60번 라인
  햄버거 아이콘
</button>
```

| 클래스 | 의미 |
|--------|------|
| `hidden md:flex` | 기본 숨김, 768px 이상에서 표시 |
| `md:hidden` | 768px 이상에서 숨김 (모바일에서만 표시) |

> 각자 Vercel 배포 후 **핸드폰으로 접속**할 때 햄버거 메뉴가 나타납니다.

#### 모바일 햄버거 메뉴 동작

```tsx
<button onClick={() => setIsMenuOpen(!isMenuOpen)}>
```

`!isMenuOpen`: 현재 상태의 반대로 바꿈 (열려있으면 닫고, 닫혀있으면 열기)

```
isMenuOpen = false  →  메뉴 숨김
isMenuOpen = true   →  메뉴 표시
```

### 6.2 PhotoGrid.tsx - 사진 그리드

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {photos.map((photo, index) => (
    <div onClick={() => onPhotoClick(photo)} className="...">
      <img src={photo.src} alt={photo.alt} />
    </div>
  ))}
</div>
```

#### 반응형 그리드 동작

```
모바일 (grid-cols-1)     태블릿 (sm:grid-cols-2)    데스크톱 (lg:grid-cols-3)
+--------+               +--------+--------+        +------+------+------+
| 사진 1  |               | 사진 1  | 사진 2  |        |사진1 |사진2 |사진3 |
+--------+               +--------+--------+        +------+------+------+
| 사진 2  |               | 사진 3  | 사진 4  |        |사진4 |사진5 |사진6 |
+--------+               +--------+--------+        +------+------+------+
| 사진 3  |
+--------+
```

#### 사진 클릭 시 동작

```
사진 클릭
    |
    v
onPhotoClick(photo) 호출
    |
    v
page.tsx의 handlePhotoClick 실행
    |
    v
setModalImage(photo) - 모달에 표시할 사진 설정
    |
    v
ImageModal이 화면에 나타남 (isOpen = true)
```

### 6.3 ImageModal.tsx - 이미지 확대 팝업

```tsx
if (!isOpen) return null;  // 닫혀있으면 아무것도 표시하지 않음

return (
  <div className="fixed inset-0 z-50 bg-black/80" onClick={onClose}>
    <img src={imageSrc} alt={imageAlt} />
  </div>
);
```

| 클래스 | 효과 |
|--------|------|
| `fixed` | 화면에 고정 (스크롤해도 따라다님) |
| `inset-0` | 상하좌우 모두 0 (화면 전체 덮음) |
| `z-50` | 다른 요소 위에 표시 |
| `bg-black/80` | 검은색 배경, 80% 불투명 |

**팝업 닫기**: 배경(어두운 부분)을 클릭하면 `onClose` 실행 → `setModalImage(null)` → 팝업 사라짐

---

## 7. Vercel 배포하기

> **상세 가이드**: 처음 배포하는 분은 [step3-deploy-guide.md](./step3-deploy-guide.md) 문서를 참고하세요.
> Git 설치, GitHub 토큰 생성, 문제 해결 방법까지 스크린샷 수준으로 상세히 설명되어 있습니다.

아래는 간략한 요약입니다.

### 7.1 GitHub 계정 만들기

1. [github.com](https://github.com) 접속
2. "Sign up" 클릭
3. 이메일, 비밀번호 입력하여 가입

### 7.2 프로젝트를 GitHub에 올리기

터미널(명령 프롬프트)에서:

```bash
# 1. Git 저장소 초기화 (처음 한 번만)
git init

# 2. 모든 파일 추가
git add .

# 3. 커밋 (저장)
git commit -m "My portfolio site"

# 4. GitHub에 새 저장소 만들고 연결
# GitHub에서 "New repository" 클릭 → 저장소 이름 입력 → Create
# 그 다음 나오는 명령어 복사해서 실행
git remote add origin https://github.com/내아이디/저장소이름.git
git push -u origin main
```

### 7.3 Vercel에서 배포하기

1. [vercel.com](https://vercel.com) 접속
2. "Sign up" → "Continue with GitHub" 선택
3. GitHub 계정으로 로그인
4. "Import Project" 클릭
5. 방금 만든 GitHub 저장소 선택
6. "Deploy" 클릭
7. 잠시 기다리면 배포 완료!

```
배포 완료 후 받는 URL:
https://내프로젝트.vercel.app

이 URL을 친구에게 공유하면 바로 접속 가능!
```

### 7.4 업데이트하기

코드를 수정한 후:

```bash
git add .
git commit -m "사진 추가"
git push
```

GitHub에 올리면 Vercel이 **자동으로** 다시 배포합니다.
별도로 Vercel에 접속할 필요 없습니다!

---

## 8. 직접 해보기

### 실습 1: 내 정보로 바꾸기

`app/page.tsx`를 열고 `myInfo` 부분을 수정하세요:

```tsx
const myInfo = {
  name: "여러분의 이름",
  tagline: "여러분의 한 줄 소개",
  email: "여러분의 이메일",
  greeting: "여러분의 인사말",
  description: "여러분의 자기소개",
  highlights: [
    "여러분의 관심사 1",
    "여러분의 관심사 2",
    "여러분의 관심사 3",
  ],
  socialLinks: {
    instagram: "https://instagram.com/여러분의아이디",
  },
};
```

### 실습 2: 내 사진 넣기

1. `public` 폴더에 사진 파일 복사
2. `app/page.tsx`의 `images` 부분 수정:

```tsx
const images = {
  hero: "/my-background.jpg",
  profile: "/my-profile.jpg",
  travel: [
    {
      src: "/trip-tokyo.jpg",
      alt: "도쿄 여행",
      caption: "2024년 도쿄 여행",
    },
    // ... 더 추가
  ],
  // ...
};
```

### 실습 3: 네비게이션 색상 바꾸기

`components/Navbar.tsx`에서 링크 호버 색상을 찾습니다:

```tsx
className="... hover:text-amber-500 ..."
```

`amber`를 다른 색으로 바꿔보세요: `blue`, `green`, `pink`, `purple`

### 실습 4: 브라우저 크기 조절해보기

1. 브라우저에서 F12 키를 눌러 개발자 도구 열기
2. 왼쪽 상단의 "기기 아이콘" 클릭
3. 여러 기기 크기로 바꿔가며 레이아웃 변화 확인

```
데스크톱 → 태블릿 → 모바일 순으로 줄여보세요.
사진 그리드가 3열 → 2열 → 1열로 바뀌는 것을 확인하세요.
```

### 실습 5: Vercel에 배포하기

위 7번 섹션을 따라 실제로 배포해보세요.
완성된 URL을 가족이나 친구에게 공유해보세요!

---

## 9. Step 3에서 배운 새 용어

| 용어 | 한 줄 설명 | 비유 |
|------|-----------|------|
| **반응형 웹** | 화면 크기에 따라 레이아웃이 바뀌는 웹사이트 | 접이식 가구 |
| **브레이크포인트** | 레이아웃이 바뀌는 기준 화면 너비 | 옷 사이즈 (S, M, L) |
| **sm:, md:, lg:** | Tailwind의 반응형 접두사 | "태블릿에서는 이렇게" |
| **모바일 우선** | 기본값이 모바일이고, 큰 화면을 추가하는 방식 | 작은 집부터 짓고 확장 |
| **useEffect** | 페이지 로드 후 실행되는 코드를 정의 | 자동 실행 프로그램 |
| **fixed** | 화면에 고정되어 스크롤해도 따라다님 | 화면에 붙은 스티커 |
| **z-50** | 다른 요소보다 앞에 표시 (숫자가 클수록 앞) | 레이어 순서 |
| **Vercel** | Next.js 프로젝트를 쉽게 배포하는 서비스 | 무료 웹 호스팅 |
| **배포(Deploy)** | 내 컴퓨터의 코드를 인터넷에 올리는 것 | 가게 오픈 |

---

## 10. 요약

```
Step 3에서 만든 것:
  - 나만의 개인 소개 웹사이트
  - 반응형 (모바일에서도 볼 수 있음)
  - 실제 인터넷에 배포 (URL 공유 가능)

파일 구조:
  page.tsx      → 내 정보와 사진 설정 (★ 여기만 수정)
  Navbar        → 상단 메뉴 (모바일 햄버거 메뉴 포함)
  HeroSection   → 첫 화면 (이름, 배경)
  AboutSection  → 자기소개
  PhotoGrid     → 사진 그리드 (Travel, Photos)
  ImageModal    → 사진 클릭 시 확대
  Footer        → 하단 정보, SNS 링크

새로 배운 것:
  - 반응형 웹: sm:, md:, lg: 브레이크포인트
  - useEffect: 페이지 로드 후 실행
  - Vercel 배포: GitHub 연동으로 자동 배포

개인화 방법:
  1. page.tsx의 myInfo 수정 (이름, 소개, 관심사)
  2. public 폴더에 내 사진 추가
  3. page.tsx의 images 경로 수정
  4. GitHub push → Vercel 자동 배포
```

---

## 부록: 자주 묻는 질문

**Q: 사진이 안 보여요**
- public 폴더에 사진이 있는지 확인
- 파일명에 한글이나 공백이 있으면 영문으로 변경
- 경로가 `/파일명.jpg`로 시작하는지 확인 (앞에 슬래시 필수)

**Q: 모바일에서 확인하고 싶어요**
- 개발 중: 브라우저 F12 → 기기 아이콘 클릭
- 배포 후: Vercel URL을 핸드폰 브라우저에 입력

**Q: Vercel 무료인가요?**
- 네, 개인 프로젝트는 무료입니다
- 월 100GB 대역폭까지 무료 (개인 사이트에 충분)

**Q: 나중에 수정하고 싶으면?**
- 코드 수정 후 `git add . && git commit -m "수정" && git push`
- Vercel이 자동으로 다시 배포합니다

**Q: 내 도메인을 연결하고 싶어요**
- Vercel 대시보드 → Settings → Domains
- 원하는 도메인 입력 후 DNS 설정 안내를 따라하세요
