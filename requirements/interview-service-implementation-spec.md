# 실전 면접 연습 서비스 UI 구현 명세서

## 원본 요구사항
"frontend.md 파일 기반으로 실전 면접 연습 서비스 UI 구현"

---

## 명확화된 요구사항

### 목표
기존 프로젝트에 실전 면접 연습 서비스의 핵심 3개 페이지를 React로 구현

### 구현 범위

#### 포함되는 페이지
1. **Landing 페이지** - 서비스 소개 및 시작 버튼
2. **면접 진행 페이지** - 실제 면접 시뮬레이션 (핵심)
3. **사후 리포트 페이지** - 면접 분석 결과 제공

#### 제외되는 페이지 (추후 확장 가능)
- 기업/직무 선택 페이지
- 이력서/자소서 업로드 페이지
- 면접 세션 설정 페이지
- 면접 종료 화면

### 기술 스택 및 제약사항

#### 프로젝트 설정
- **프레임워크**: React + TypeScript
- **빌드 도구**: Vite
- **상태**: 새 프로젝트 설정 필요 (package.json 없음)

#### 핵심 라이브러리
- **라우팅**: React Router
- **상태 관리**: Context API
- **스타일링**: Tailwind CSS
- **아이콘**: Lucide React (선택)

#### 구현 제약
- ✅ Mock 데이터 사용 (백엔드 API 연동 제외)
- ✅ 음성 기능은 UI만 구현 (실제 녹음/재생 제외)
- ✅ 타이머는 실제 작동하는 2분 카운트다운 구현
- ✅ 차트는 Tailwind CSS로 직접 구현 (외부 라이브러리 없음)
- ✅ 간결한 디자인 (Tailwind 기본 스타일 + 간단한 transition 효과)

### 파일 구조

```
src/
├── App.tsx
├── main.tsx
├── pages/
│   ├── Landing.tsx          # 랜딩 페이지
│   ├── InterviewSession.tsx # 면접 진행 페이지
│   └── InterviewReport.tsx  # 사후 리포트 페이지
├── components/
│   ├── Timer.tsx            # 타이머 컴포넌트
│   ├── ProgressBar.tsx      # 프로그레스 바
│   └── BarChart.tsx         # Tailwind 기반 막대그래프
├── context/
│   └── InterviewContext.tsx # 전역 상태 관리
├── data/
│   └── mockData.ts          # Mock 데이터
└── types/
    └── index.ts             # TypeScript 타입 정의
```

### 라우팅 구조

```
/                    → Landing 페이지
/interview           → 면접 진행 페이지
/report              → 사후 리포트 페이지
```

### 주요 기능 상세

#### 1. Landing 페이지
- 서비스 제목 및 설명
- "면접 연습 시작" CTA 버튼
- 버튼 클릭 시 `/interview`로 이동

#### 2. 면접 진행 페이지
- **면접관 사진** (정적 이미지)
- **질문 표시** (텍스트)
- **실제 작동 타이머**:
  - 2분 (120초) 카운트다운
  - 색상 변화: green (120-60초) → yellow (60-30초) → red (30-0초)
  - 0초 도달 시 자동으로 다음 질문
- **프로그레스 바** (현재 질문 / 전체 질문)
- **답변 가이드** (접을 수 있는 패널)
- **버튼**: "답변 시작" / "다음 질문" / "면접 종료"
- Mock 질문 데이터 (5개 질문)

#### 3. 사후 리포트 페이지
- **전체 요약**:
  - 3줄 요약 (긍정/개선점)
  - 평균 답변 시간
  - 말 속도 (WPM)
- **시간 분포 차트** (Tailwind CSS 막대그래프)
- **질문별 상세 분석**:
  - 질문 제목
  - 답변 시간
  - 내 답변 (Mock)
  - AI 답변 제안 (Mock)
  - 한 줄 평가 (Mock)
- 면책 조항: "합격 여부와 무관한 연습용 피드백입니다"

### Mock 데이터 구조

```typescript
// 면접 질문 데이터
interface Question {
  id: number;
  question: string;
  timeLimit: number; // 초 단위
}

// 면접 리포트 데이터
interface Report {
  summary: {
    averageTime: number;
    speakingSpeed: string;
    threeLineSummary: string[];
  };
  questions: {
    id: number;
    question: string;
    duration: number;
    myAnswer: string;
    aiSuggestion: string;
    feedback: string;
  }[];
}
```

### 디자인 가이드

#### 색상 팔레트
- **Primary**: 딥 네이비 (`#0a1628`, `#1a2744`)
- **Accent**: 골드 (`#d4af37`)
- **Success**: 초록 (`#22c55e`)
- **Warning**: 주황 (`#f97316`)
- **Error**: 빨강 (`#ef4444`)
- **Background**: 화이트/그레이

#### 타이포그래피
- **제목**: `text-2xl font-bold`
- **본문**: `text-base`
- **버튼**: `text-lg font-semibold`

#### 애니메이션
- **페이지 전환**: `transition-opacity duration-300`
- **hover**: `hover:scale-105 transition-transform`
- **타이머**: `transition-colors duration-500`

### 성공 기준

1. ✅ 3개 핵심 페이지가 정상적으로 렌더링됨
2. ✅ React Router를 통한 페이지 간 라우팅이 작동함
3. ✅ 면접 진행 페이지의 타이머가 실제로 120초부터 카운트다운됨
4. ✅ 타이머가 0초 도달 시 다음 질문으로 자동 전환됨
5. ✅ 리포트 페이지에 Mock 데이터가 표시됨
6. ✅ Tailwind CSS 기반 차트가 정상적으로 렌더링됨
7. ✅ 반응형 디자인 (모바일/데스크톱)

### 의사결정 요약

| 항목 | 결정사항 | 이유 |
|------|---------|------|
| 프로젝트 설정 | 기존 프로젝트에 추가 | 사용자 요청 |
| 구현 범위 | 핵심 3개 페이지만 | 빠른 MVP 구현 |
| API 연동 | Mock 데이터 | UI 먼저 완성 후 API 연동 |
| 음성 기능 | UI만 구현 | 복잡도 감소 |
| 디자인 수준 | 간결한 디자인 | 빠른 개발 우선 |
| 타이머 기능 | 실제 작동 타이머 | 핵심 기능이므로 필수 |
| 차트 구현 | Tailwind 직접 구현 | 라이브러리 의존성 감소 |
| 파일 구조 | pages/ 기반 | 페이지별 명확한 분리 |
| 라우팅 | React Router | 표준 라우팅 솔루션 |
| 상태 관리 | Context API | 간단하고 충분함 |

### 다음 단계

1. Vite + React + TypeScript 프로젝트 초기화
2. Tailwind CSS 설정
3. React Router 설정
4. Mock 데이터 작성
5. Context API 설정
6. 페이지별 컴포넌트 구현
7. 테스트 및 최적화

---

**작성일**: 2026-02-06
**기준 문서**: frontend.md
