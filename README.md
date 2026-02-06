# 실전 면접 연습 서비스 (AI Interview Practice)

실전과 같은 환경에서 면접을 연습할 수 있는 AI 기반 면접 연습 서비스입니다.

## 프로젝트 소개

AI 면접관과 함께하는 1:1 모의 면접 서비스로, 다음과 같은 기능을 제공합니다:

- 기업/직무별 맞춤 면접 질문
- 이력서/자소서 기반 개인화된 질문
- 실시간 음성 인터랙션 (TTS/STT)
- 120초 타이머로 실전 시간 관리 연습
- AI 기반 답변 분석 및 피드백
- 상세한 면접 리포트 제공

## 기술 스택

### Frontend

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **React Router v7** - 라우팅
- **Tailwind CSS 4.0** - 스타일링
- **Lucide React** - 아이콘

### 개발 도구

- ESLint - 코드 품질 관리
- PostCSS - CSS 처리
- Autoprefixer - CSS 자동 접두사

## 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- npm 9.0 이상

### 설치 방법

1. 저장소 클론

```bash
git clone <repository-url>
cd Front
```

2. 의존성 패키지 설치

```bash
cd interview-app
npm install
```

### 실행 방법

#### 개발 모드로 실행 (권장)

```bash
cd interview-app
npm run dev
```

개발 서버가 실행되면 브라우저에서 `http://localhost:5173`으로 접속하세요.

#### 프로덕션 빌드

```bash
cd interview-app
npm run build
```

빌드된 파일은 `interview-app/dist` 폴더에 생성됩니다.

#### 프로덕션 미리보기

```bash
cd interview-app
npm run preview
```

빌드된 파일을 로컬 서버에서 미리볼 수 있습니다 (`http://localhost:4173`).

## 프로젝트 구조

```
Front/
├── interview-app/          # React 앱 메인 폴더
│   ├── src/
│   │   ├── pages/          # 페이지 컴포넌트 (7개)
│   │   │   ├── Landing.tsx
│   │   │   ├── CompanyJobSelect.tsx
│   │   │   ├── ResumeUpload.tsx
│   │   │   ├── InterviewSettings.tsx
│   │   │   ├── InterviewSession.tsx
│   │   │   ├── InterviewComplete.tsx
│   │   │   └── InterviewReport.tsx
│   │   ├── components/     # 재사용 컴포넌트
│   │   │   ├── Timer.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── BarChart.tsx
│   │   ├── context/        # Context API (상태 관리)
│   │   │   └── InterviewContext.tsx
│   │   ├── data/           # Mock 데이터
│   │   │   └── mockData.ts
│   │   ├── types/          # TypeScript 타입 정의
│   │   │   └── index.ts
│   │   ├── App.tsx         # 앱 라우팅
│   │   ├── main.tsx        # 앱 진입점
│   │   └── index.css       # 글로벌 스타일
│   ├── dist/               # 빌드 결과물
│   ├── package.json        # 패키지 의존성
│   ├── vite.config.ts      # Vite 설정
│   ├── tailwind.config.js  # Tailwind 설정
│   └── tsconfig.json       # TypeScript 설정
├── requirements/           # 프로젝트 명세서
│   ├── frontend.md
│   ├── interview-service-implementation-spec.md
│   └── backend-api-integration.md
├── PROJECT_SUMMARY.md      # 프로젝트 상세 요약
└── README.md               # 이 파일
```

## 주요 기능

### 1. 7단계 면접 플로우

1. **Landing** - 서비스 소개 및 시작
2. **기업/직무 선택** - TOSS 등 기업 및 직무 선택
3. **이력서 업로드** - PDF 드래그앤드롭 업로드
4. **면접 설정** - 질문 수, 면접관 목소리, 스타일 설정
5. **실전 면접** - 120초 타이머와 함께 질문 답변
6. **면접 종료** - AI 분석 로딩 애니메이션
7. **리포트** - 상세한 피드백 및 개선점 제공

### 2. 핵심 기능

- **실시간 타이머**: 120초 카운트다운 (색상 변화: 녹색 → 노란색 → 빨간색)
- **자동 전환**: 타이머 0초 도달 시 자동으로 다음 질문
- **드래그앤드롭**: 이력서 파일 업로드 (10MB 제한)
- **파일 검증**: PDF 파일 형식 및 크기 검증
- **프로그레스 추적**: 현재 질문 진행도 표시
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

### 3. UI/UX 특징

- 페이지별 차별화된 디자인 컨셉
- 부드러운 애니메이션 효과
- 다크/라이트 테마 믹스
- 로딩 상태 및 에러 핸들링
- 접근성 고려

## 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview

# 린트 검사
npm run lint
```

## 환경 설정

### Vite 설정 (vite.config.ts)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### Tailwind 설정 (tailwind.config.js)

프로젝트는 Tailwind CSS 4.0을 사용하며, 커스텀 색상 및 폰트가 설정되어 있습니다.

## 현재 상태

현재는 **프론트엔드 UI**만 완성된 상태이며, Mock 데이터를 사용합니다.

### 완성된 기능

- ✅ 7개 페이지 구현
- ✅ 라우팅 및 네비게이션
- ✅ 실시간 타이머
- ✅ 파일 업로드 UI
- ✅ 리포트 차트 및 분석
- ✅ 반응형 디자인

### 백엔드 연동 필요

- ⏳ API 엔드포인트 연결
- ⏳ 실제 TTS 음성 재생
- ⏳ 실제 음성 녹음 기능
- ⏳ STT 처리
- ⏳ AI 기반 리포트 생성

백엔드 API 연동 가이드는 `requirements/backend-api-integration.md`를 참고하세요.

## 트러블슈팅

### 1. npm install 실패

```bash
# 캐시 삭제 후 재시도
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 2. 포트 충돌

기본 포트(5173)가 사용 중일 경우:

```bash
# 다른 포트로 실행
npm run dev -- --port 3000
```

### 3. Tailwind 스타일 미적용

```bash
# PostCSS 재설치
npm install -D tailwindcss postcss autoprefixer
```

## 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 라이선스

이 프로젝트는 개인 프로젝트입니다.

## 참고 문서

- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - 프로젝트 상세 요약
- [requirements/frontend.md](./requirements/frontend.md) - UI 명세서
- [requirements/interview-service-implementation-spec.md](./requirements/interview-service-implementation-spec.md) - 구현 명세서
- [requirements/backend-api-integration.md](./requirements/backend-api-integration.md) - API 연동 가이드

## 개발 정보

- **프로젝트 시작일**: 2026-02-06
- **개발 도구**: Claude Code (frontend-design skill)
- **개발 기간**: ~2시간
- **총 코드 라인**: ~3,000+ 줄
- **빌드 크기**: JS 277.57 kB (gzip: 85.00 kB)
