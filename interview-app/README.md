# 실전 면접 연습 서비스 🎯

**Interview Studio** - 답을 알려주는 AI가 아니라, 말하는 연습을 돕는 면접 시뮬레이터

## ✨ 주요 기능

### 📱 3개 핵심 페이지
1. **Landing** - 서비스 소개 및 시작
2. **Interview Session** - 실시간 면접 시뮬레이션
3. **Interview Report** - AI 기반 면접 분석 리포트

### 🎨 디자인 특징
- **컨셉**: Interview Studio - 방송국 스튜디오의 긴장감 + 모던 프로페셔널
- **색상**: 다크 그라데이션 + 네온 액센트 (Cyan/Blue)
- **폰트**: Playfair Display + Source Sans Pro
- **애니메이션**: Staggered reveal, 극적인 타이머 색상 변화

### ⚡ 핵심 기능
- ✅ **실시간 타이머**: 120초 카운트다운 + 색상 변화 (Green → Yellow → Red)
- ✅ **자동 전환**: 시간 종료 시 자동으로 다음 질문
- ✅ **프로그레스 추적**: 현재 질문 / 전체 질문 표시
- ✅ **답변 가이드**: 접을 수 있는 구조화된 답변 팁
- ✅ **상세 리포트**: 질문별 분석 + AI 답변 제안 + 피드백

## 🚀 빠른 시작

### 설치
```bash
cd interview-app
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

서버가 시작되면 브라우저에서 http://localhost:5173 를 열어주세요.

### 프로덕션 빌드
```bash
npm run build
npm run preview
```

## 📂 프로젝트 구조

```
src/
├── pages/
│   ├── Landing.tsx           # 랜딩 페이지
│   ├── InterviewSession.tsx  # 면접 진행 페이지 (핵심)
│   └── InterviewReport.tsx   # 사후 리포트 페이지
├── components/
│   ├── Timer.tsx             # 타이머 컴포넌트
│   ├── ProgressBar.tsx       # 프로그레스 바
│   └── BarChart.tsx          # Tailwind 기반 막대그래프
├── context/
│   └── InterviewContext.tsx  # 전역 상태 관리
├── data/
│   └── mockData.ts           # Mock 데이터
└── types/
    └── index.ts              # TypeScript 타입 정의
```

## 🛠 기술 스택

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State**: Context API
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React

## 📊 페이지별 기능 상세

### 1. Landing 페이지
- 미니멀한 디자인 with 애니메이션
- Staggered reveal 효과
- 그라데이션 배경 + 글로우 효과
- CTA 버튼 호버 시 shine 애니메이션

### 2. Interview Session 페이지
- **면접관 아바타**: 음성 재생 시 pulse 애니메이션
- **질문 표시**: 질문 번호 + 텍스트 + TTS 버튼 (UI만)
- **타이머**:
  - 120초 카운트다운
  - 시간대별 색상 변화
  - 0초 도달 시 자동 다음 질문
- **프로그레스 바**: 현재 진행도 표시
- **답변 가이드**:
  - 도입 → 핵심 경험 → 결과/배운 점
  - 접기/펴기 가능
- **컨트롤**:
  - 답변 시작 버튼
  - 일시정지 버튼
  - 다음 질문 / 면접 완료 버튼
  - 종료 버튼

### 3. Interview Report 페이지
- **전체 요약**:
  - 3줄 요약 (긍정/개선점)
  - 평균 답변 시간
  - 말 속도 (WPM)
  - 질문별 시간 분포 차트
- **질문별 상세 분석**:
  - 질문 + 답변 시간
  - 내 답변 vs AI 답변 제안
  - 피드백
  - 프로그레스 바

## 🎯 향후 확장 가능

현재는 핵심 3개 페이지만 구현되어 있습니다. 추후 추가 가능한 페이지:

- [ ] 기업/직무 선택 페이지
- [ ] 이력서/자소서 업로드 페이지
- [ ] 면접 세션 설정 페이지
- [ ] 면접 종료 로딩 화면

## 🔌 백엔드 API 연동

현재는 Mock 데이터를 사용합니다. 실제 백엔드 연동을 위해서는:

1. `/api/session/start` - 세션 시작
2. `/api/question/next` - 다음 질문
3. `/api/question/answer-audio` - 답변 업로드
4. `/api/report/{session_id}` - 리포트 조회
5. `/api/tts/speak` - TTS 음성 생성

자세한 API 명세는 `../requirements/backend-api-integration.md`를 참고하세요.

## 📝 라이센스

MIT

## 👨‍💻 개발자

Created with ❤️ by Claude Code (frontend-design skill)

---

**면접 준비, 이제 실전처럼 연습하세요!** 🚀
