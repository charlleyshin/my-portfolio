# Step 2 교육 교재: 카페 주문 기능으로 배우는 인터랙티브 웹

---

## Step 1에서 Step 2로

Step 1에서는 카페 랜딩 페이지를 만들었습니다. 보기 좋았지만, **보는 것만** 가능했습니다.
Step 2에서는 같은 카페 페이지에 **주문 기능**을 추가합니다.

### 비유: 포스터에서 키오스크로

```
Step 1 = 카페 포스터              Step 2 = 카페 키오스크
+-------------------+            +-------------------+
|   Maison de Cafe  |            |   Maison de Cafe  |
|                   |            |                   |
|  [라떼] [크루아상] |            |  [라떼] [크루아상] |
|                   |            |  [-] 2 [+]  [+]   |  <-- 클릭 가능!
|                   |            |                   |
|                   |            | 총 2개  ₩11,000   |  <-- 자동 계산!
|                   |            |      [주문하기]    |
+-------------------+            +-------------------+
   보기만 가능                      클릭하면 반응
```

카페 키오스크를 사용해본 적 있다면, Step 2에서 만드는 것이 바로 그것입니다.

---

## 1. 무엇이 바뀌었나: 파일 변경 요약

Step 1의 파일 6개 중, **3개를 수정**하고 **1개를 추가**했습니다.

```
components/
  HeroSection.tsx       ← 변경 없음
  InfoSection.tsx        ← 변경 없음
  MenuCard.tsx           ← 수정: +/- 버튼, 수량 표시 추가
  OrderBar.tsx           ← 신규: 하단 주문 요약 바

app/
  globals.css            ← 수정: import 순서 변경 (글꼴 → Tailwind)
  layout.tsx             ← 변경 없음
  page.tsx               ← 수정: 주문 기능의 두뇌 역할 추가
```

### globals.css 수정 이유

Step 1에서는 Tailwind를 먼저, Google Fonts를 나중에 불러왔습니다.

```css
/* Step 1 (에러 발생) */
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=...');
```

그런데 `@import "tailwindcss"`는 실행될 때 수천 줄의 CSS 규칙으로 전개됩니다.
CSS 표준에서는 **모든 `@import`가 다른 규칙보다 먼저 와야 한다**고 정해져 있기 때문에,
Tailwind가 전개된 뒤에 오는 Google Fonts `@import`가 규칙 위반이 됩니다.

해결 방법은 순서를 바꾸는 것입니다.

```css
/* Step 2 (정상) */
@import url('https://fonts.googleapis.com/css2?family=...');
@import "tailwindcss";
```

글꼴을 먼저 불러오고, Tailwind를 나중에 불러오면 문제가 해결됩니다.

Step 1에서 만든 코드를 **대부분 그대로 유지**하면서, 필요한 부분만 확장한 것입니다.
기존 코드를 버리고 새로 만든 것이 아닙니다.

---

## 2. 핵심 개념 3가지

Step 2에서 새로 등장하는 개념은 **3가지**입니다.

| 개념 | 비유 | 한 줄 설명 |
|------|------|-----------|
| `"use client"` | 키오스크 전원 켜기 | "이 페이지는 사용자와 상호작용합니다" 선언 |
| `useState` | 칠판 | 숫자를 기억하고, 바뀌면 화면을 자동으로 업데이트 |
| `onClick` | 버튼 센서 | "이 버튼이 눌리면 이 동작을 실행해라" |

이 3가지만 이해하면 Step 2의 전체 코드를 읽을 수 있습니다.
하나씩 설명하겠습니다.

---

## 3. "use client" - 상호작용 활성화

### Step 1의 page.tsx (첫 줄)

```tsx
import HeroSection from "@/components/HeroSection";
```

### Step 2의 page.tsx (첫 줄)

```tsx
"use client";

import { useState } from "react";
```

맨 위에 `"use client"`라는 한 줄이 추가되었습니다.

### 이게 왜 필요한가?

Next.js에서는 페이지가 기본적으로 **서버 컴포넌트**입니다.
서버 컴포넌트는 화면을 보여주기만 하고, 사용자의 클릭에 반응하지 않습니다.

`"use client"`를 선언하면 **클라이언트 컴포넌트**가 되어 사용자와 상호작용할 수 있습니다.

```
서버 컴포넌트 (기본값)     →  포스터: 보기만 가능
클라이언트 컴포넌트        →  키오스크: 터치하면 반응
```

**정리**: 클릭, 입력 등 사용자 상호작용이 필요하면 파일 맨 위에 `"use client"`를 적습니다.

---

## 4. useState - 숫자를 기억하는 칠판

### 왜 필요한가?

메뉴 카드에서 [+] 버튼을 누르면 수량이 1 올라가야 합니다.
그런데 컴퓨터는 "지금 수량이 몇 개인지" 어딘가에 기억해두지 않으면 모릅니다.

`useState`는 **값을 기억하고, 값이 바뀌면 화면을 자동으로 업데이트**하는 도구입니다.

### 실제 코드

```tsx
const [quantities, setQuantities] = useState([0, 0, 0]);
```

이 한 줄이 하는 일:

```
useState([0, 0, 0])
         ↑  ↑  ↑
         |  |  └── 세 번째 메뉴(치즈케이크)의 수량: 0개
         |  └───── 두 번째 메뉴(크루아상)의 수량: 0개
         └──────── 첫 번째 메뉴(라떼)의 수량: 0개
```

| 이름 | 역할 | 비유 |
|------|------|------|
| `quantities` | 현재 수량을 읽을 때 사용 | 칠판에 적힌 숫자를 읽기 |
| `setQuantities` | 수량을 바꿀 때 사용 | 칠판의 숫자를 지우고 새로 쓰기 |
| `[0, 0, 0]` | 처음 시작할 때의 값 | 칠판에 처음 적어놓는 숫자 |

### 칠판 비유로 보면

```
+--칠판---------------------+
|                           |
|  라떼: 0  크루아상: 0      |   ← 처음 상태 (useState 시작값)
|  치즈케이크: 0             |
|                           |
+---------------------------+

    [+] 버튼 클릭! (라떼)

+--칠판---------------------+
|                           |
|  라떼: 1  크루아상: 0      |   ← setQuantities가 숫자를 바꿈
|  치즈케이크: 0             |      → 화면이 자동으로 업데이트됨!
|                           |
+---------------------------+
```

**핵심**: `quantities`로 읽고, `setQuantities`로 바꿉니다. 바꾸면 화면이 자동으로 변합니다.

---

## 5. onClick - 버튼 클릭 감지

### 왜 필요한가?

[+] 버튼을 눌렀을 때 수량을 올려야 합니다.
"버튼이 눌리면 → 이 동작을 해라" 라는 연결이 `onClick`입니다.

### 실제 코드 (MenuCard.tsx)

```tsx
<button onClick={onAdd}>
  +
</button>
```

이것이 전부입니다.

```
<button           →  화면에 버튼을 만든다
  onClick={onAdd} →  이 버튼이 클릭되면, onAdd 동작을 실행한다
>
  +               →  버튼에 "+" 글자를 표시한다
</button>
```

### 동작의 전체 흐름

```
사용자가 [+] 버튼 클릭
       |
       v
onClick={onAdd} 이 감지
       |
       v
onAdd 함수 실행 (page.tsx의 handleAdd)
       |
       v
setQuantities로 수량 +1
       |
       v
quantities 값이 바뀜
       |
       v
화면이 자동으로 업데이트! (숫자 표시, 총액 변경, 카드 테두리 등)
```

**핵심**: `onClick`은 "이 버튼이 눌리면 이 함수를 실행해라"라는 연결 장치입니다.

---

## 6. page.tsx 읽기 - 주문 시스템의 두뇌

page.tsx가 Step 1에서 Step 2로 어떻게 바뀌었는지 비교합니다.

### Step 1의 page.tsx (요약)

```tsx
import HeroSection from "@/components/HeroSection";
import MenuCard from "@/components/MenuCard";
import InfoSection from "@/components/InfoSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <MenuCard emoji="☕" name="시그니처 라떼" price="₩5,500" ... />
      <MenuCard emoji="🥐" name="버터 크루아상" price="₩4,800" ... />
      <MenuCard emoji="🍰" name="바스크 치즈케이크" price="₩7,500" ... />
      <InfoSection />
    </div>
  );
}
```

역할: 부품을 가져와서 순서대로 배치. 그게 전부였습니다.

### Step 2의 page.tsx에 추가된 것들

Step 2에서는 page.tsx가 **배치 + 주문 관리**까지 담당합니다.
추가된 부분을 역할별로 나눠서 보겠습니다.

**[추가 1] 메뉴 데이터**

```tsx
const menu = [
  {
    emoji: "☕",
    name: "시그니처 라떼",
    description: "부드러운 우유 거품 위에 은은한 바닐라 향을 더한 시그니처 메뉴",
    price: 5500,
  },
  {
    emoji: "🥐",
    name: "버터 크루아상",
    description: "프랑스산 발효 버터로 48시간 숙성한 겹겹이 바삭한 크루아상",
    price: 4800,
  },
  {
    emoji: "🍰",
    name: "바스크 치즈케이크",
    description: "겉은 캐러멜, 속은 부드러운 크림치즈의 시그니처 디저트와 다이어트 코크",
    price: 7500,
  },
];
```

Step 1에서는 MenuCard에 직접 텍스트를 적었지만, Step 2에서는 메뉴 정보를 **데이터 목록**으로 정리했습니다.
엑셀에서 표를 만드는 것과 비슷합니다.

```
Step 1: 카드에 직접 글씨 적기      Step 2: 표에 정리하고 카드에 넣기
                                  +-------+----------+-------+
<MenuCard name="라떼" />          | emoji | name     | price |
<MenuCard name="크루아상" />      | ☕    | 라떼     | 5500  |
<MenuCard name="치즈케이크" />    | 🥐    | 크루아상  | 4800  |
                                  | 🍰    | 치즈케이크| 7500  |
                                  +-------+----------+-------+
```

왜 이렇게 바꿨을까요? 가격이 숫자(`5500`)여야 총액 계산이 가능하기 때문입니다.
Step 1에서는 `"₩5,500"`이라는 글자였기 때문에 계산할 수 없었습니다.

**[추가 2] 수량 기억하기 (useState)**

```tsx
const [quantities, setQuantities] = useState([0, 0, 0]);
```

위에서 설명한 칠판입니다. 메뉴 3개의 주문 수량을 기억합니다.

**[추가 3] +/- 버튼 동작 정의**

```tsx
const handleAdd = (index: number) => {
  setQuantities((prev) => {
    const next = [...prev];
    next[index] += 1;
    return next;
  });
};
```

"몇 번째 메뉴의 수량을 1 올려라" 라는 동작입니다.

```
handleAdd(0) 실행 시:
  칠판 [0, 0, 0]  →  칠판 [1, 0, 0]    (첫 번째 메뉴 +1)

handleAdd(2) 실행 시:
  칠판 [1, 0, 0]  →  칠판 [1, 0, 1]    (세 번째 메뉴 +1)
```

`handleRemove`도 같은 원리인데, 반대로 수량을 1 내립니다 (0 이하로는 내려가지 않음).

**[추가 4] 총 수량과 총 금액 계산**

```tsx
const totalCount = quantities.reduce((sum, q) => sum + q, 0);
const totalPrice = quantities.reduce(
  (sum, q, i) => sum + q * menu[i].price,
  0
);
```

`reduce`라는 함수는 "목록의 모든 숫자를 더해라"라는 뜻입니다.

```
quantities = [2, 1, 0] 일 때:

totalCount = 2 + 1 + 0 = 3개

totalPrice = (2 x 5500) + (1 x 4800) + (0 x 7500) = 15,800원
```

이 값들이 하단 주문 바에 표시됩니다.

**[추가 5] 주문 완료 동작**

```tsx
const handleOrder = () => {
  alert(
    `${totalCount}개 메뉴, 총 ${totalPrice.toLocaleString()}원 주문이 완료되었습니다!`
  );
  setQuantities([0, 0, 0]);
};
```

"주문하기" 버튼을 누르면:
1. 알림창에 주문 내역을 보여주고
2. 칠판을 `[0, 0, 0]`으로 초기화 (모든 수량 리셋)

---

## 7. MenuCard.tsx 읽기 - 클릭 가능한 카드

Step 1의 MenuCard는 정보를 보여주기만 했습니다.
Step 2에서는 [+][-] 버튼과 수량 표시가 추가되었습니다.

### Step 1과 Step 2 비교

```
Step 1 MenuCard:               Step 2 MenuCard:
+------------------+           +------------------+
|       ☕         |           |       ☕         |
|   시그니처 라떼   |           |   시그니처 라떼   |
|   설명 텍스트     |           |   설명 텍스트     |
|   ₩5,500         |           |   5,500원        |
|                  |           |                  |
|                  |           |   [-]  2  [+]    |  <-- 추가된 부분
+------------------+           +------------------+
                               수량 > 0이면 테두리 강조
```

### 추가된 Props

Step 1에서는 4개였던 Props가 Step 2에서 7개로 늘었습니다.

```tsx
// Step 1의 Props
interface MenuCardProps {
  emoji: string;
  name: string;
  description: string;
  price: string;          // 글자 "₩5,500"
}

// Step 2의 Props
interface MenuCardProps {
  emoji: string;
  name: string;
  description: string;
  price: number;          // 숫자 5500 (계산 가능)
  quantity: number;       // 현재 수량 (칠판에서 읽어온 값)
  onAdd: () => void;      // [+] 누르면 실행할 동작
  onRemove: () => void;   // [-] 누르면 실행할 동작
}
```

새로 추가된 3개:

| Props | 타입 | 비유 |
|-------|------|------|
| `quantity` | 숫자 | 칠판에서 읽어온 "현재 수량" |
| `onAdd` | 함수 | [+] 버튼을 눌렀을 때 실행할 명령서 |
| `onRemove` | 함수 | [-] 버튼을 눌렀을 때 실행할 명령서 |

Step 1에서는 Props로 **글자와 숫자**(데이터)만 전달했는데,
Step 2에서는 **동작**(함수)도 전달할 수 있다는 것을 알 수 있습니다.

### 추가된 화면 요소: +/- 버튼

```tsx
<div className="flex items-center justify-center gap-3">
  <button
    onClick={onRemove}
    className="w-8 h-8 rounded-full bg-stone-200 ..."
  >
    -
  </button>
  <span className="w-8 text-center font-semibold text-lg">
    {quantity}
  </span>
  <button
    onClick={onAdd}
    className="w-8 h-8 rounded-full bg-amber-500 ..."
  >
    +
  </button>
</div>
```

```
[-] 버튼              수량 표시              [+] 버튼
onClick={onRemove}    {quantity}            onClick={onAdd}
클릭 시 수량 -1        현재 수량 표시         클릭 시 수량 +1
```

### 선택된 카드 강조 효과

```tsx
const isSelected = quantity > 0;
```

`quantity`가 0보다 크면 `isSelected`는 `true`(참)가 됩니다.

```tsx
className={`... ${
  isSelected
    ? "ring-2 ring-amber-400 shadow-md"     // 수량 > 0: 금색 테두리 + 진한 그림자
    : "shadow-sm hover:shadow-md"            // 수량 = 0: 평소 상태
}`}
```

이것은 **조건부 스타일링**입니다.

```
비유: "만약 이 메뉴를 1개 이상 담았으면 → 금색 테두리를 쳐라"

수량 0개:  일반 카드 (연한 그림자)
수량 1개+: 강조 카드 (금색 테두리 + 진한 그림자)
```

---

## 8. OrderBar.tsx 읽기 - 하단 주문 요약 바

Step 2에서 **새로 만든** 유일한 컴포넌트입니다.

```tsx
interface OrderBarProps {
  totalCount: number;
  totalPrice: number;
  onOrder: () => void;
}

export default function OrderBar({ totalCount, totalPrice, onOrder }: OrderBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-stone-900 ...">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div>
          <span>총 <span>{totalCount}개</span></span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>
        <button onClick={onOrder}>
          주문하기
        </button>
      </div>
    </div>
  );
}
```

### 화면에서 보이는 모습

```
+================================================================+
|  총 3개        15,800원                          [주문하기]      |
+================================================================+
  ↑ totalCount    ↑ totalPrice                      ↑ onOrder
  (page.tsx에서    (page.tsx에서                      (클릭하면
   계산해서 전달)   계산해서 전달)                      handleOrder 실행)
```

### 이 바는 언제 나타날까?

page.tsx에 이런 코드가 있습니다:

```tsx
{totalCount > 0 && (
  <OrderBar ... />
)}
```

이것은 **조건부 렌더링**이라고 합니다.

```
totalCount > 0   → true (참)  → OrderBar를 보여줌
totalCount === 0 → false (거짓) → OrderBar를 숨김
```

비유: "메뉴를 1개라도 담았으면 주문 바를 보여줘. 아무것도 안 담았으면 숨겨."

배달앱에서 장바구니가 비어있으면 하단 바가 안 보이다가,
메뉴를 하나라도 담으면 "주문하기" 바가 나타나는 것과 같은 원리입니다.

---

## 9. 전체 동작 흐름

사용자가 [+] 버튼을 한 번 누를 때 일어나는 일의 전체 순서입니다.

```
[1] 사용자가 시그니처 라떼의 [+] 버튼을 클릭
                |
                v
[2] MenuCard의 onClick={onAdd}가 감지
                |
                v
[3] page.tsx의 handleAdd(0) 실행  (0 = 첫 번째 메뉴)
                |
                v
[4] setQuantities로 칠판 업데이트
    [0, 0, 0] → [1, 0, 0]
                |
                v
[5] React가 화면을 자동으로 다시 그림:
    - 라떼 카드의 수량 표시: 0 → 1
    - 라떼 카드 테두리: 일반 → 금색 강조
    - totalCount 계산: 1개
    - totalPrice 계산: 5,500원
    - OrderBar 나타남 (totalCount > 0이므로)
```

**핵심**: 개발자가 "화면을 다시 그려라"고 명령하지 않습니다.
`setQuantities`로 **값만 바꾸면**, React가 **알아서 화면을 업데이트**합니다.
이것이 React의 가장 강력한 특징입니다.

---

## 10. Step 2에서 배운 새 용어

Step 1에서 배운 용어는 생략하고, Step 2에서 새로 나온 것만 정리합니다.

| 용어 | 한 줄 설명 | 비유 |
|------|-----------|------|
| **"use client"** | 사용자 상호작용을 가능하게 하는 선언 | 키오스크 전원 켜기 |
| **useState** | 값을 기억하고, 바뀌면 화면을 자동 업데이트 | 칠판 (읽기 + 쓰기) |
| **state (상태)** | useState로 관리되는 값 (예: 주문 수량) | 칠판에 적힌 숫자 |
| **onClick** | 클릭 시 실행할 함수를 연결하는 속성 | 버튼 센서 |
| **함수 Props** | 컴포넌트에 "동작"을 전달하는 것 (onAdd 등) | 주문서에 "이렇게 해주세요" 메모 추가 |
| **조건부 렌더링** | 조건에 따라 화면 요소를 보이거나 숨기는 것 | "담은 게 있으면 보여줘" |
| **조건부 스타일링** | 조건에 따라 디자인을 바꾸는 것 | "선택되면 테두리 강조" |

---

## 11. 직접 해보기

### 실습 1: 최대 수량 제한 걸기

현재는 [+]를 계속 누르면 수량이 끝없이 올라갑니다.
`page.tsx`의 `handleAdd` 함수에서 최대 10개로 제한해봅시다.

현재 코드:
```tsx
const handleAdd = (index: number) => {
  setQuantities((prev) => {
    const next = [...prev];
    next[index] += 1;
    return next;
  });
};
```

`next[index] += 1;` 줄을 아래처럼 바꿔보세요:
```tsx
    if (next[index] < 10) next[index] += 1;
```

저장 후 [+]를 10번 이상 눌러보세요. 10에서 멈추는 것을 확인할 수 있습니다.

### 실습 2: 주문 완료 메시지 바꾸기

`page.tsx`의 `handleOrder` 함수를 찾습니다:

```tsx
alert(
  `${totalCount}개 메뉴, 총 ${totalPrice.toLocaleString()}원 주문이 완료되었습니다!`
);
```

이 메시지를 원하는 문구로 바꿔보세요.
예: `"감사합니다! 주문하신 ${totalCount}개 메뉴를 준비하겠습니다."`

### 실습 3: 주문 바 색상 바꾸기

`components/OrderBar.tsx`에서 주문하기 버튼을 찾습니다:

```tsx
className="bg-amber-500 ... hover:bg-amber-600 ..."
```

`bg-amber-500`을 `bg-green-500`으로, `hover:bg-amber-600`을 `hover:bg-green-600`으로 바꿔보세요.
주문 버튼이 초록색으로 변합니다.

---

## 요약

```
Step 1 → Step 2 변화:

  포스터 (보기만 가능)  →  키오스크 (클릭하면 반응)

추가된 핵심 개념 3가지:

  "use client"  →  상호작용을 켜는 스위치
  useState      →  값을 기억하는 칠판
  onClick       →  클릭을 감지하는 센서

변경된 파일:

  page.tsx      →  주문 로직 추가 (두뇌)
  MenuCard.tsx  →  +/- 버튼 추가 (인터페이스)
  OrderBar.tsx  →  주문 요약 바 신규 생성 (결과 표시)

가장 중요한 것:

  값을 바꾸면(setQuantities) → 화면이 자동으로 업데이트된다.
  이것이 React의 핵심입니다.
```
