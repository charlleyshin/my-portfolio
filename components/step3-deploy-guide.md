# Step 3 부록: Vercel 배포 상세 가이드

이 문서는 처음으로 웹사이트를 배포하는 분들을 위한 **단계별 상세 가이드**입니다.

---

## 목차

1. [사전 준비](#1-사전-준비)
2. [GitHub 계정 만들기](#2-github-계정-만들기)
3. [Git 설치 확인](#3-git-설치-확인)
4. [GitHub에 프로젝트 올리기](#4-github에-프로젝트-올리기)
5. [Vercel 계정 만들기](#5-vercel-계정-만들기)
6. [Vercel에서 배포하기](#6-vercel에서-배포하기)
7. [배포 후 업데이트하기](#7-배포-후-업데이트하기)
8. [문제 해결](#8-문제-해결)

---

## 1. 사전 준비

### 필요한 것

| 항목 | 설명 |
|------|------|
| 이메일 주소 | GitHub, Vercel 가입용 |
| 웹 브라우저 | Chrome 권장 |
| 완성된 프로젝트 | Step 3 템플릿 수정 완료 상태 |

### 확인 사항

배포 전에 로컬에서 사이트가 잘 작동하는지 확인하세요:

```bash
npm run dev
```

브라우저에서 `http://localhost:3001` 접속하여 확인합니다.

---

## 2. GitHub 계정 만들기

### 2.1 GitHub 가입

1. 브라우저에서 **https://github.com** 접속

2. 오른쪽 상단 **"Sign up"** 클릭

3. 가입 정보 입력:
   ```
   Enter your email: 이메일 주소 입력
   Create a password: 비밀번호 입력 (15자 이상 또는 숫자+소문자 8자 이상)
   Enter a username: 사용자 이름 입력 (영문, 숫자, 하이픈만 가능)
   ```

4. 이메일 인증:
   - 입력한 이메일로 인증 코드가 전송됨
   - 이메일에서 코드를 확인하여 입력

5. 가입 완료!

### 2.2 사용자 이름 선택 팁

GitHub 사용자 이름은 나중에 바꾸기 어려우므로 신중하게 선택하세요.

```
좋은 예:
  - hong-gildong
  - gildong-dev
  - gildong2024

피해야 할 예:
  - 123456 (의미 없는 숫자)
  - test-user (임시 느낌)
  - 한글이름 (영문만 가능)
```

---

## 3. Git 설치 확인

### 3.1 Git이 설치되어 있는지 확인

터미널(명령 프롬프트)을 열고 다음 명령어 입력:

```bash
git --version
```

**결과 예시:**
```
git version 2.43.0
```

버전 번호가 나오면 Git이 설치된 것입니다. → **3.3으로 이동**

### 3.2 Git 설치하기 (설치 안 된 경우)

**Windows:**
1. https://git-scm.com/download/win 접속
2. "Click here to download" 클릭
3. 다운로드된 설치 파일 실행
4. 모든 옵션 기본값으로 "Next" 클릭
5. "Install" 클릭

**Mac:**
1. 터미널에서 `git --version` 입력
2. "개발자 도구를 설치하시겠습니까?" 팝업이 뜨면 "설치" 클릭

### 3.3 Git 초기 설정 (처음 사용하는 경우)

GitHub 가입할 때 사용한 이름과 이메일을 설정합니다:

```bash
git config --global user.name "여러분의 이름"
git config --global user.email "여러분의이메일@example.com"
```

**예시:**
```bash
git config --global user.name "Hong Gildong"
git config --global user.email "gildong@company.com"
```

설정 확인:
```bash
git config --list
```

---

## 4. GitHub에 프로젝트 올리기

### 4.1 GitHub에서 새 저장소 만들기

1. GitHub 로그인 후, 오른쪽 상단 **"+"** 클릭 → **"New repository"** 선택

2. 저장소 정보 입력:
   ```
   Repository name: my-portfolio (원하는 이름, 영문-하이픈만)
   Description: My personal portfolio website (선택사항)
   Public/Private: Public 선택 (무료 배포를 위해)
   ```

3. **나머지 체크박스는 모두 해제** 상태로 둠
   - Add a README file: 체크 해제
   - Add .gitignore: 체크 해제
   - Choose a license: None

4. **"Create repository"** 클릭

5. 다음 화면이 나타남 (이 화면을 열어두세요):
   ```
   Quick setup - if you've done this kind of thing before

   ...or push an existing repository from the command line

   git remote add origin https://github.com/여러분아이디/my-portfolio.git
   git branch -M main
   git push -u origin main
   ```

### 4.2 프로젝트 폴더에서 Git 초기화

터미널에서 프로젝트 폴더로 이동:

```bash
cd /mnt/d/claude-projects/BlueEye/poc
```

Git 저장소 초기화 (이미 되어있다면 건너뛰어도 됨):

```bash
git init
```

**결과:**
```
Initialized empty Git repository in /mnt/d/claude-projects/BlueEye/poc/.git/
```

또는 이미 초기화된 경우:
```
Reinitialized existing Git repository in ...
```

### 4.3 .gitignore 파일 확인

프로젝트에 `.gitignore` 파일이 있는지 확인합니다. 이 파일은 GitHub에 올리지 않을 파일 목록입니다.

```bash
cat .gitignore
```

다음 내용이 포함되어 있어야 합니다:
```
node_modules
.next
.env*.local
```

없다면 이미 Next.js 프로젝트에 기본으로 포함되어 있을 것입니다.

### 4.4 파일 추가 및 커밋

**1단계: 모든 파일을 스테이징 (추가 준비)**

```bash
git add .
```

(아무 메시지 없이 완료되면 정상)

**2단계: 상태 확인**

```bash
git status
```

**결과 예시:**
```
On branch master
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   app/globals.css
        new file:   app/layout.tsx
        new file:   app/page.tsx
        new file:   components/AboutSection.tsx
        ...
```

**3단계: 커밋 (저장)**

```bash
git commit -m "Initial commit: My portfolio site"
```

**결과 예시:**
```
[master (root-commit) abc1234] Initial commit: My portfolio site
 15 files changed, 1234 insertions(+)
 create mode 100644 app/globals.css
 ...
```

### 4.5 GitHub에 업로드 (Push)

**1단계: GitHub 저장소 연결**

GitHub에서 복사한 명령어를 실행합니다:

```bash
git remote add origin https://github.com/여러분아이디/my-portfolio.git
```

**2단계: 브랜치 이름 설정**

```bash
git branch -M main
```

**3단계: 업로드**

```bash
git push -u origin main
```

**처음 push할 때 인증 요청:**

팝업 창이 뜨거나 터미널에서 GitHub 로그인을 요청할 수 있습니다.

- **브라우저 팝업**: "Authorize" 클릭
- **터미널 입력**: GitHub 사용자명과 Personal Access Token 입력

### 4.6 Personal Access Token 만들기 (비밀번호 대신)

GitHub은 비밀번호 대신 토큰을 사용합니다.

1. GitHub 로그인 → 오른쪽 상단 프로필 아이콘 클릭 → **"Settings"**

2. 왼쪽 메뉴 맨 아래 **"Developer settings"** 클릭

3. **"Personal access tokens"** → **"Tokens (classic)"** 클릭

4. **"Generate new token"** → **"Generate new token (classic)"** 클릭

5. 토큰 설정:
   ```
   Note: vercel-deploy (설명용 메모)
   Expiration: 90 days (또는 원하는 기간)

   체크할 항목:
   [x] repo (전체 선택됨)
   ```

6. **"Generate token"** 클릭

7. **토큰을 복사하여 안전한 곳에 저장** (다시 볼 수 없음!)
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

8. git push 할 때 비밀번호 대신 이 토큰을 입력

### 4.7 업로드 성공 확인

**결과:**
```
Enumerating objects: 25, done.
Counting objects: 100% (25/25), done.
...
To https://github.com/여러분아이디/my-portfolio.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

GitHub 저장소 페이지를 새로고침하면 파일들이 보입니다!

---

## 5. Vercel 계정 만들기

### 5.1 Vercel 가입

1. 브라우저에서 **https://vercel.com** 접속

2. 오른쪽 상단 **"Sign Up"** 클릭

3. **"Continue with GitHub"** 클릭 (가장 쉬운 방법)

4. GitHub 로그인 페이지로 이동 → 로그인

5. **"Authorize Vercel"** 클릭 (Vercel이 GitHub에 접근하도록 허용)

6. Vercel 대시보드로 이동됨 - 가입 완료!

---

## 6. Vercel에서 배포하기

### 6.1 프로젝트 가져오기

1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭

2. **"Import Git Repository"** 섹션에서 GitHub 저장소 목록이 보임

3. 방금 만든 **"my-portfolio"** 저장소 옆의 **"Import"** 클릭

### 6.2 프로젝트 설정

1. **Configure Project** 화면:
   ```
   Project Name: my-portfolio (자동 입력됨, 원하면 변경 가능)
   Framework Preset: Next.js (자동 감지됨)
   Root Directory: ./ (기본값 유지)
   ```

2. **Build and Output Settings**: 기본값 유지 (변경 불필요)

3. **Environment Variables**: 비워둠 (필요 없음)

4. **"Deploy"** 클릭!

### 6.3 배포 진행

배포가 시작되면 실시간으로 로그가 표시됩니다:

```
Cloning github.com/여러분아이디/my-portfolio...
Installing dependencies...
Running build...
Generating static pages...
Finalizing...
```

**예상 소요 시간: 1-3분**

### 6.4 배포 완료!

성공하면 축하 화면이 나타납니다:

```
Congratulations! 🎉
Your project has been deployed to:

https://my-portfolio-xxxx.vercel.app
```

**"Visit"** 버튼을 클릭하면 배포된 사이트를 볼 수 있습니다!

### 6.5 배포된 URL 구조

```
https://[프로젝트명]-[랜덤문자].vercel.app

예시:
https://my-portfolio-abc123.vercel.app
```

이 URL을 친구, 가족에게 공유하면 바로 접속할 수 있습니다!

---

## 7. 배포 후 업데이트하기

### 7.1 코드 수정하기

원하는 파일을 수정합니다. 예를 들어 `app/page.tsx`에서 이름을 변경:

```tsx
const myInfo = {
  name: "김철수",  // 홍길동 → 김철수로 변경
  ...
};
```

### 7.2 변경사항 GitHub에 올리기

```bash
# 1. 변경된 파일 확인
git status

# 2. 모든 변경사항 추가
git add .

# 3. 커밋 (설명과 함께 저장)
git commit -m "이름 변경"

# 4. GitHub에 업로드
git push
```

### 7.3 자동 배포 확인

git push를 하면 **Vercel이 자동으로 감지**하여 다시 배포합니다.

1. Vercel 대시보드에서 프로젝트 클릭
2. **"Deployments"** 탭에서 새 배포가 진행 중인 것을 확인
3. 1-2분 후 배포 완료

**별도로 Vercel에서 버튼을 누를 필요가 없습니다!**

### 7.4 배포 상태 확인

| 상태 | 의미 |
|------|------|
| Building | 빌드 중 |
| Ready | 배포 완료 |
| Error | 오류 발생 (로그 확인 필요) |

---

## 8. 문제 해결

### 8.1 git push 실패: 인증 오류

**증상:**
```
remote: Support for password authentication was removed...
fatal: Authentication failed
```

**해결:**
- Personal Access Token을 사용하세요 (4.6 섹션 참고)
- 비밀번호 입력란에 토큰을 붙여넣기

### 8.2 git push 실패: 권한 오류

**증상:**
```
remote: Permission to 저장소.git denied to 사용자
fatal: unable to access '...'
```

**해결:**
- GitHub 저장소 소유자가 맞는지 확인
- 다른 계정으로 로그인되어 있을 수 있음
- Git 자격 증명 삭제 후 다시 시도:

Windows:
```
제어판 → 자격 증명 관리자 → Windows 자격 증명
→ github.com 관련 항목 삭제
```

### 8.3 Vercel 배포 실패: 빌드 오류

**증상:** Vercel 대시보드에서 "Error" 상태

**해결:**
1. Vercel 대시보드에서 해당 배포 클릭
2. **"Build Logs"** 확인
3. 오류 메시지를 읽고 원인 파악

**흔한 오류:**

| 오류 메시지 | 원인 | 해결 |
|------------|------|------|
| Module not found | import 경로 오류 | 파일 경로 확인 |
| Type error | TypeScript 오류 | 타입 오류 수정 |
| Build failed | 문법 오류 | 로컬에서 `npm run build` 실행하여 확인 |

### 8.4 로컬에서 빌드 테스트

배포 전에 로컬에서 빌드가 되는지 확인:

```bash
npm run build
```

오류 없이 완료되면 Vercel 배포도 성공할 가능성이 높습니다.

### 8.5 이미지가 안 보임

**원인 1: 경로 오류**
```tsx
// 잘못된 예
src: "public/my-photo.jpg"    // public 폴더 이름을 포함하면 안 됨

// 올바른 예
src: "/my-photo.jpg"          // 슬래시로 시작, public 폴더 기준
```

**원인 2: 파일명 문제**
- 파일명에 한글이 있으면 영문으로 변경
- 파일명에 공백이 있으면 하이픈으로 대체
- 대소문자 정확히 일치해야 함

```
잘못된 예: "내 사진.jpg", "My Photo.jpg"
올바른 예: "my-photo.jpg"
```

### 8.6 저장소를 처음부터 다시 만들고 싶을 때

기존 Git 설정 삭제:
```bash
rm -rf .git
```

그 다음 4.2부터 다시 시작

---

## 9. 유용한 Git 명령어 모음

| 명령어 | 설명 |
|--------|------|
| `git status` | 현재 상태 확인 |
| `git add .` | 모든 변경사항 추가 |
| `git add 파일명` | 특정 파일만 추가 |
| `git commit -m "메시지"` | 커밋 (저장) |
| `git push` | GitHub에 업로드 |
| `git pull` | GitHub에서 다운로드 |
| `git log --oneline` | 커밋 히스토리 보기 |
| `git diff` | 변경사항 비교 |

---

## 10. 배포 완료 체크리스트

- [ ] GitHub 계정 생성
- [ ] Git 설치 및 초기 설정
- [ ] GitHub에 저장소 생성
- [ ] 프로젝트 파일 커밋 및 푸시
- [ ] Vercel 계정 생성 (GitHub 연동)
- [ ] Vercel에서 프로젝트 Import
- [ ] 배포 완료 확인
- [ ] URL을 친구/가족에게 공유!

---

## 11. 다음 단계 (선택사항)

### 11.1 커스텀 도메인 연결

무료 `.vercel.app` 대신 자신만의 도메인을 연결할 수 있습니다.

1. 도메인 구매 (예: 가비아, Namecheap)
2. Vercel 대시보드 → Settings → Domains
3. 도메인 입력 → DNS 설정 안내 따르기

### 11.2 Analytics 활성화

방문자 통계를 무료로 볼 수 있습니다.

1. Vercel 대시보드 → Analytics 탭
2. "Enable" 클릭

### 11.3 여러 프로젝트 관리

Vercel 무료 플랜에서도 여러 프로젝트를 배포할 수 있습니다.
각 프로젝트마다 별도의 GitHub 저장소를 만들어 연결하면 됩니다.

---

**축하합니다!** 이제 여러분은 웹사이트를 만들고 전 세계에 배포할 수 있습니다.
