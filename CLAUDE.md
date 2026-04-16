# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

*중요: 모든 답변과 설명은 한글로 작성해주세요. (IMPORTANT: Please provide all responses and explanations in Korean.)*

## 1. 프로젝트 개요

### 1.1 개발 단계 (PoC)
현재 목표: 핵심 기능 검증 및 사용자 피드백 수집
따라서 모든 규칙은 빠른 검증을 위한 것임

## 2. 개발 환경

### 2.1 기술 스택
- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **빌드 도구**: Next.js 내장 (Turbopack)
- **패키지 관리**: npm
- **테스트**: 없음 (수동 테스트)

### 2.2 프로젝트 구조
```
/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 메인 페이지
│   └── globals.css         # 전역 스타일 (Tailwind)
├── components/             # React 컴포넌트
└── public/                 # 정적 파일
```

### 2.3 주요 명령어
```bash
npm run dev      # 개발 서버 실행 (http://localhost:3001)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

### 2.4 WSL2 환경 참고사항
- **실행 환경**: WSL2 (Linux 6.6.87.1-microsoft-standard-WSL2)
- **포트 점유 확인**: `lsof`가 WSL2에서 백그라운드 프로세스를 감지하지 못하는 경우가 있음
  ```bash
  # 권장: ss 또는 fuser 사용 (WSL2에서 확실)
  ss -tlnp | grep <포트번호>
  fuser <포트번호>/tcp

  # 비권장: lsof (WSL2에서 누락 가능)
  lsof -i :<포트번호>
  ```
- **프로세스 종료**: `fuser -k <포트번호>/tcp` 또는 `kill $(fuser <포트번호>/tcp 2>/dev/null)`
- **Claude Code 백그라운드 프로세스**: Playwright 등으로 인해 Next.js 서버가 백그라운드에서 실행될 수 있음. 포트 충돌 시 위 명령어로 확인 후 종료
- **개발 서버 재시작 절차**: 코드 변경 후 캐시 문제가 발생할 경우 반드시 기존 프로세스 종료 + `.next` 캐시 삭제 후 재시작
  ```bash
  fuser -k 3001/tcp 2>/dev/null; rm -rf .next && npm run dev
  ```
- **Python 실행**: WSL2에서는 `python` 대신 `python3` 명령어 사용 필수
  - Windows pyenv 경로의 python shim은 CRLF(`^M`) 문제로 WSL2에서 실행 불가
  - 모든 Python 스크립트 실행 시 반드시 `python3` 사용
  - 스킬 실행 시에도 동일하게 적용
  ```bash
  # 권장: WSL2 네이티브 Python 사용
  python3 script.py
  python3 -m pip install package

  # 비권장: Windows Python 경로로 인한 에러 발생
  python script.py  # Error: /bin/sh^M: bad interpreter
  ```

### 2.5 개발 서버 관리

#### 원칙: Claude Code가 서버를 자동 관리
- **Claude Code가 필요할 때 자동으로 서버 시작**
- 서버 시작 후 사용자에게 안내: "localhost:3001을 브라우저에서 확인하세요"
- 사용자는 Windows 브라우저로 실시간 확인
- Claude는 Playwright로 자동 비교/테스트
- **작업 완료 후 서버 자동 종료** (포트 충돌 방지)

#### 서버 관리 절차
1. **작업 시작 시**: 기존 프로세스 정리 + 캐시 삭제 + 서버 백그라운드 시작
   ```bash
   fuser -k 3001/tcp 2>/dev/null; rm -rf .next && npm run dev &
   ```
2. **사용자 안내**: "브라우저에서 http://localhost:3001 을 열어 결과를 확인하세요" 메시지 출력
3. **대기 시간**: 서버 시작 후 5초 대기 (초기 빌드 완료)
4. **작업 수행**: Playwright로 스크린샷/비교 작업
5. **작업 종료 시**: 서버 프로세스 종료
   ```bash
   fuser -k 3001/tcp 2>/dev/null
   ```

#### Claude Code의 역할
1. 코드 편집 (컴포넌트, 스타일 등)
2. 필요 시 자동으로 개발 서버 시작/종료
3. Playwright로 자동 스크린샷/비교
4. 사용자에게 브라우저 확인 안내

#### 사용자의 역할
1. Claude의 안내에 따라 브라우저에서 localhost:3001 접속
2. 실시간으로 코드 변경 결과 확인 (Next.js hot reload)
3. 작업 완료 후 브라우저 닫기 (서버는 Claude가 자동 종료)

#### 장점
- 사용자가 수동으로 서버를 시작/종료할 필요 없음
- Windows 브라우저로 실시간 확인 가능 (WSL2 GUI 불필요)
- 포트 충돌 자동 방지
- 프로세스 관리 완전 자동화

#### Playwright 브라우저 정리
- **작업 종료 시**: 반드시 Playwright 브라우저 프로세스 정리
  ```bash
  # 모든 Playwright Chrome 프로세스 종료
  pkill -f "chrome.*playwright"

  # 확인
  ps aux | grep -E "chrome|chromium" | grep -v grep
  ```
- **이유**: Playwright headless 브라우저가 백그라운드에서 메모리를 계속 차지할 수 있음
- **증상**: Windows 작업표시줄에 리눅스 크롬 아이콘이 남아있음 (클릭해도 창 없음)
- **자동 정리**: 모든 Playwright 작업 완료 후 자동으로 프로세스 정리

## 3. 개발 가이드

### 3.1 개발 원칙
- 컴포넌트 기반 아키텍처 (React)
- 각 컴포넌트가 하나의 책임을 가짐 (SRP)
- 새로운 기능 추가가 용이하도록 설계 (OCP)
- Server/Client 컴포넌트 적절히 분리
- 메모리 누수 방지: useEffect cleanup 함수 필수

#### 기술 제안 원칙
- **실현 가능성 우선**: 100% 구현 가능하고 검증된 기술만 제안
- **투명한 커뮤니케이션**: 불확실하거나 모르는 내용은 명확히 표시
- **현실적 접근**: 이론적 가능성이 아닌 실제 구현 가능성 기준으로 판단
- **구체적 근거 제시**: 기술 제안 시 구현 방법과 근거 제시

#### 금지 사항
- 검증되지 않은 실험적 기술 제안
- 구현 불가능하거나 비현실적인 솔루션 제시
- 추측에 기반한 답변 (대신 "확실하지 않음" 명시)
- 존재하지 않는 API나 기능 언급

### 3.2 코딩 컨벤션

#### 명명 규칙
- 컴포넌트 파일: PascalCase (예: `ChatOverlay.tsx`, `Button.tsx`)
- 유틸리티 파일: camelCase (예: `utils.ts`, `helpers.ts`)
- 컴포넌트명: PascalCase (예: `ChatOverlay`, `PrimaryButton`)
- 변수/함수명: camelCase (예: `handleClick`, `isVisible`)
- 상수: UPPER_SNAKE_CASE (예: `MAX_RETRY_COUNT`)
- 타입/인터페이스: PascalCase + Props/Type 접미사 (예: `ButtonProps`, `UserType`)

#### 코드 작성 우선순위
1. **기존 파일 우선 활용**: 새 파일 생성 전 반드시 기존 파일 존재 여부 확인
2. **명명 규칙 일관성**: 프로젝트 내 기존 명명 규칙 분석 후 동일 패턴 적용
3. **구조 일관성**: 새 컴포넌트 추가 시 기존 폴더 구조와 계층 규칙 준수

### 3.3 Next.js 컨벤션

#### Server vs Client 컴포넌트
```tsx
// Client 컴포넌트 (상호작용 필요시)
"use client";
import { useState } from 'react';

// Server 컴포넌트 (기본값, 데이터 fetching)
// "use client" 없이 작성
```

#### 컴포넌트 구조 패턴
```tsx
"use client";

import { useState } from 'react';

interface ComponentProps {
  title: string;
  onClick?: () => void;
}

export default function Component({ title, onClick }: ComponentProps) {
  const [state, setState] = useState(false);

  return (
    <div className="...">
      {title}
    </div>
  );
}
```

### 3.4 Tailwind CSS 가이드

#### 클래스 작성 순서 (권장)
1. 레이아웃 (flex, grid, position)
2. 박스 모델 (w, h, p, m)
3. 타이포그래피 (text, font)
4. 배경/테두리 (bg, border, rounded)
5. 효과 (shadow, opacity)
6. 상태 (hover, focus)
7. 트랜지션 (transition)

#### 예시
```tsx
<button className="flex items-center justify-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
```

### 3.5 기존 파일 확인 방법
```bash
# 파일 검색
find . -name "*키워드*" -type f

# 컴포넌트 검색
ls components/

# 특정 패턴 검색
grep -r "키워드" --include="*.tsx"
```

### 3.6 코드 최적화 가이드

#### 최적화 요청 대응 원칙
최적화/개선 요청 시 "코드 다이어트" 원칙 적용:
1. **진단**: 정확한 병목 지점 파악
2. **최소 처방**: 해당 부분만 수술적 수정
3. **부작용 방지**: 새 의존성/복잡도 추가 금지

#### 실제 적용 예시
- 잘못된 예: "성능 개선을 위해 새로운 상태관리 라이브러리 도입"
- 올바른 예: "불필요한 리렌더링 방지를 위해 useMemo 적용"

- 잘못된 예: "코드 품질을 위한 새 추상화 레이어 추가"
- 올바른 예: "중복 코드를 기존 컴포넌트로 통합"

### 3.7 추상화 레벨 가이드

#### PoC 단계 추상화 수준
1. **UI 컴포넌트**: 직접 구현 또는 기본 HTML 요소 활용
2. **데이터 처리**: 단순 함수 또는 커스텀 훅으로 구현
3. **상태 관리**: useState, useContext로 충분 (Redux/Zustand 도입 금지)
4. **API 호출**: fetch 또는 간단한 래퍼 함수

#### 추상화 결정 플로우차트
```
기능 구현 필요
    ↓
현재 코드에 유사한 컴포넌트/훅이 있는가?
    ├─ 예 → 기존 코드 재사용
    └─ 아니오 → 단순하게 직접 구현
                    ↓
                3번째 유사 구현인가?
                    ├─ 예 → 공통 컴포넌트/훅으로 추출
                    └─ 아니오 → 그대로 유지
```

#### 금지된 패턴 (PoC 단계)
- 복잡한 Context 계층 구조 (2단계 초과)
- HOC(Higher Order Component) 남용
- 과도한 커스텀 훅 분리
- 3단계 이상의 컴포넌트 합성
- 5개 이상의 props를 가진 컴포넌트 (객체로 그룹화 권장)

## 4. 개발 제약사항

### 4.1 수정 범위 제한

#### 수정 범위 원칙
1. **최소 수정 원칙**: 요청된 기능 구현에 필요한 최소한의 코드만 수정
2. **기존 코드 보존**: 동작하는 기존 코드는 절대 수정 금지
3. **단계별 확인**: 각 파일 수정 전 수정 필요성 재검토
4. **예외**: 사용자가 기존 코드 수정/교체를 명시적으로 허가한 경우 위 원칙을 따르지 않아도 됨

#### 수정 전 필수 확인사항
- [ ] 이 파일 수정이 요청된 기능과 직접 관련이 있는가?
- [ ] 기존 코드가 정상 동작하고 있는가?
- [ ] 수정 없이 새 기능 추가가 가능한가?
- [ ] 사용자가 이 파일 수정을 명시적으로 요청했는가?

#### 개발 진행 방식
1. **영향 범위 분석**: 요청된 기능이 어떤 파일에 영향을 주는지 먼저 분석
2. **최소 수정 계획**: 기존 코드 최대한 보존하면서 새 기능 추가 방법 계획
3. **단계별 구현**: 한 번에 모든 것을 바꾸지 말고 단계적으로 추가
4. **기존 코드 존중**: 동작하는 코드는 건드리지 않음

#### 새 기능 추가 시 우선순위
1. 새 파일 생성으로 해결 가능한가?
2. 기존 파일에 최소한 추가로 해결 가능한가?
3. 정말 기존 코드 수정이 필요한가?

#### 수정 범위 확인 원칙
- 요청된 기능 외의 파일 수정 시 사용자에게 사전 확인 요청
- 기존 Tailwind 클래스나 스타일 변경 시 명시적 허가 요청
- 대규모 리팩토링 필요 시 별도 작업으로 분리 제안

### 4.2 기능 제약사항

#### 금지 사항
- 요청과 무관한 기존 코드 수정
- 정상 동작하는 스타일 변경
- 기존 파일 구조 임의 변경
- 사용자 요청 없는 리팩토링

#### 추상화 관련 금지사항
- 미래를 위한 설계 (YAGNI 원칙 위반)
- 1-2번만 사용되는 유틸리티 컴포넌트 생성
- 불필요한 커스텀 훅 분리
- 과도한 타입 제네릭 사용

#### 디바이스 지원 제약사항
**데스크톱 전용 개발** - 다음 기능들은 구현하지 않음:
- 모바일/태블릿 지원 (터치 이벤트, 반응형 디자인)
- 모바일 최적화 Tailwind 클래스 (sm:, md: 브레이크포인트)
- 키보드 단축키 및 키보드 네비게이션

### 4.3 기술 제약사항
- 새로운 상태관리 라이브러리 도입 금지 (Redux, Zustand, Jotai 등)
- UI 컴포넌트 라이브러리 도입 금지 (shadcn/ui, MUI, Chakra 등)
- 모든 MD 파일과 코드에서 이모지 사용 금지

## 5. 문서화 원칙

### 5.1 문서 작성 규칙
- CLAUDE.md 파일은 한글로 작성
- /init를 수행하는 경우, 기존 CLAUDE.md 내용의 임의 수정, 삭제 금지
- 요구사항 명세서 작성시에는 명확한 요구사항 이외의 향후 계획 제외

### 5.2 분석 필수 항목
**요구사항 명세서/상세설계 작성 시**: 반드시 깊이 분석 후(Ultrathink), md파일 생성
- 기존 시스템과의 연동점 분석
- 예외 상황 및 엣지 케이스 고려
- 구현 복잡도 및 리스크 평가
- PoC 범위 내에서의 우선순위 설정
