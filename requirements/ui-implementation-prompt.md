# 실전 면접 연습 서비스 - Frontend UI Implementation Prompt

## Overview
Implement a premium interview practice service with a "Premium Professional" design aesthetic using Deep Navy + Gold accents.

## Tech Stack
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS v3.4+
- **Routing**: React Router v6
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **State**: Zustand
- **Upload**: react-dropzone

---

## Design System

### Color Palette (Tailwind Config)
```javascript
colors: {
  navy: {
    900: '#0a1628',
    800: '#1a2744',
    700: '#2a3b5a',
  },
  gold: {
    400: '#d4af37',
    500: '#c9a227',
    600: '#b8941f',
  }
}
```

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Source Sans Pro (sans-serif)
- **Code**: JetBrains Mono

### Spacing Scale
- Base unit: 4px
- Page padding: px-6 md:px-12 lg:px-24
- Card padding: p-6 md:p-8
- Component gap: gap-4 md:gap-6

---

## Page 1: Landing Page (`/`)

### Layout
```
┌─────────────────────────────────────┐
│           [Gradient Mesh BG]        │
│                                     │
│         [Staggered Reveal]          │
│       "실전 면접 연습 서비스"         │
│                                     │
│   "답을 알려주는 AI가 아니라         │
│    말하는 연습을 돕습니다"           │
│                                     │
│   [ 면접 연습 시작 ] ← Gold Gradient │
│                                     │
└─────────────────────────────────────┘
```

### Implementation
```tsx
// pages/LandingPage.tsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex items-center justify-center">
      <div className="text-center max-w-2xl px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-playfair text-4xl md:text-6xl font-bold text-white mb-6"
        >
          실전 면접 연습 서습
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-sans text-lg md:text-xl text-gray-300 mb-12"
        >
          "답을 알려주는 AI가 아니라<br />말하는 연습을 돕습니다"
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ scale: 1.05, background: 'linear-gradient(135deg, #d4af37, #c9a227)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/company-job')}
          className="bg-gold-500 text-navy-900 font-semibold px-8 py-4 rounded-full text-lg transition-all shadow-lg hover:shadow-gold-400/25"
        >
          면접 연습 시작
        </motion.button>
      </div>
    </div>
  );
}
```

---

## Page 2: Company/Job Selection (`/company-job`)

### Layout
```
┌─────────────────────────────────────┐
│  ← Back              [Progress: 1/6]│
│                                     │
│  기업 선택                           │
│  ┌─────────────────────────────┐    │
│  │  [TOSS Logo]                │    │
│  │  TOSS                       │    │
│  │  금융 플랫폼 기반의 핀테크    │    │
│  │  ─────────────────────────  │    │
│  │  인재상: ✓ 혁신적 사고      │    │
│  │         ✓ 주도적 실행       │    │
│  └─────────────────────────────┘    │
│                                     │
│  직무 선택                           │
│  [Frontend ✓] [Backend ✗] [PM ✗]   │
│                                     │
│  [다음 →] (disabled until selected) │
└─────────────────────────────────────┘
```

### Components
```tsx
// components/CompanyCard.tsx
interface CompanyCardProps {
  company: Company;
  isSelected: boolean;
  onSelect: () => void;
}

// components/JobChip.tsx
interface JobChipProps {
  job: Job;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}
```

### State
```typescript
interface SelectionState {
  selectedCompany: Company | null;
  selectedJob: Job | null;
}
```

---

## Page 3: Resume Upload (`/resume-upload`)

### Layout
```
┌─────────────────────────────────────┐
│  ← Back              [Progress: 2/6]│
│                                     │
│  지원자 정보 입력                     │
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │    [Upload Icon]            │    │
│  │                             │    │
│  │  PDF 파일을 드래그하거나      │    │
│  │  클릭하여 업로드하세요        │    │
│  │                             │    │
│  │    * 이력서 또는 자소서       │    │
│  └─────────────────────────────┘    │
│                                     │
│  (내용은 저장되지 않습니다)          │
│                                     │
│  [다음 →]                           │
└─────────────────────────────────────┘
```

### Implementation
```tsx
// components/FileUploadZone.tsx
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';

export function FileUploadZone({ onUpload, file, onRemove }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (files) => onUpload(files[0]),
  });
  
  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
        transition-colors duration-200
        ${isDragActive ? 'border-gold-400 bg-gold-400/5' : 'border-gray-300 hover:border-navy-700'}
        ${file ? 'border-green-500 bg-green-50' : ''}
      `}
    >
      <input {...getInputProps()} />
      {file ? (
        <div className="flex items-center justify-center gap-3">
          <File className="w-8 h-8 text-navy-700" />
          <span className="text-navy-700 font-medium">{file.name}</span>
          <button onClick={onRemove} className="p-1 hover:bg-gray-200 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      ) : (
        <>
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">PDF 파일을 드래그하거나 클릭하여 업로드하세요</p>
          <p className="text-sm text-gray-400">* 이력서 또는 자소서 (최대 10MB)</p>
        </>
      )}
    </div>
  );
}
```

---

## Page 4: Interview Settings (`/interview-settings`)

### Layout
```
┌─────────────────────────────────────┐
│  ← Back              [Progress: 3/6]│
│                                     │
│  면접 설정                           │
│                                     │
│  면접 질문 수                        │
│  ●━━━━━━━━●━━━━━━━━━━━━━━  [5개 ▼] │
│  5        10                        │
│                                     │
│  면접관 목소리                       │
│  [  남  │  ●여●  ]                  │
│                                     │
│  면접 스타일                         │
│  [  친절한  │  ●압박●  ]            │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  미리보기                    │    │
│  │  • 질문 5개                 │    │
│  │  • 여성 면접관              │    │
│  │  • 압박 면접 스타일         │    │
│  └─────────────────────────────┘    │
│                                     │
│  [    면접 시작    ]                │
└─────────────────────────────────────┘
```

### Components
```tsx
// components/Slider.tsx
interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
}

// components/ToggleGroup.tsx
interface ToggleGroupProps<T> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}
```

---

## Page 5: Interview Session (`/interview-session`) - CORE

### Layout
```
┌─────────────────────────────────────┐
│  [Progress: Q1/5]        [Exit ✕]  │
│                                     │
│         ┌──────────┐               │
│         │ [Avatar] │  ← pulse      │
│         │   👤     │    animation  │
│         └──────────┘               │
│                                     │
│    🔊 "자기소개 부탁드립니다"        │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│       ⏱️ 01:45 / 02:00             │
│    ████████████████░░░░░░░░░       │
│         ↑ color transitions        │
│         (green→yellow→red)         │
│                                     │
│  📌 답변 구조 가이드 [▼]            │
│  ┌─────────────────────────────┐    │
│  │ • 도입                       │    │
│  │ • 핵심 경험                  │    │
│  │ • 결과/배운 점               │    │
│  └─────────────────────────────┘    │
│                                     │
│  [  답변 시작  ]    [  종료  ]      │
└─────────────────────────────────────┘
```

### Key Implementation Details
```tsx
// components/Timer.tsx
export function Timer({ duration, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const progress = ((duration - timeLeft) / duration) * 100;
  
  const getColor = () => {
    if (progress < 50) return 'bg-green-500';
    if (progress < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>⏱️ {formatTime(timeLeft)} / {formatTime(duration)}</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColor()}`}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}

// components/InterviewerAvatar.tsx
export function InterviewerAvatar({ isSpeaking }) {
  return (
    <motion.div
      animate={isSpeaking ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="relative"
    >
      <div className="w-32 h-32 rounded-full bg-navy-700 flex items-center justify-center">
        <span className="text-6xl">👤</span>
      </div>
      {isSpeaking && (
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse" />
      )}
    </motion.div>
  );
}

// components/AnswerGuide.tsx
export function AnswerGuide({ isOpen, onToggle }) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center gap-2 text-navy-700 font-medium">
        <Pin className="w-4 h-4" />
        답변 구조 가이드
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="mt-3 space-y-2 text-gray-600">
          <li>• 도입 - 간단한 인사와 직무 관심사</li>
          <li>• 핵심 경험 - 구체적인 프로젝트/성과</li>
          <li>• 결과/배운 점 - 성과와 인사이트</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
```

### State Management
```typescript
interface InterviewState {
  currentQuestionIndex: number;
  questions: Question[];
  remainingTime: number;
  isRecording: boolean;
  answers: Answer[];
  settings: InterviewSettings;
}
```

---

## Page 6: Interview Complete (`/interview-complete`)

### Layout
```
┌─────────────────────────────────────┐
│                                     │
│      면접이 종료되었습니다           │
│                                     │
│         [Animated Icon]             │
│      🔍 → 📊 → ✨                   │
│                                     │
│       "분석 중..."                  │
│    "답변 구조 분석 중..."            │
│                                     │
│   ████████████████░░░░  80%        │
│                                     │
│     [   결과 보기   ]               │
│        ← fade in at 100%            │
│                                     │
└─────────────────────────────────────┘
```

### Implementation
```tsx
export function InterviewCompletePage() {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('분석 중...');
  const [showResultButton, setShowResultButton] = useState(false);
  
  const statusMessages = [
    '답변 구조 분석 중...',
    '언어 패턴 분석 중...',
    '피드백 생성 중...',
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowResultButton(true);
          return 100;
        }
        // Update status message based on progress
        const messageIndex = Math.floor((prev / 100) * statusMessages.length);
        setStatusText(statusMessages[Math.min(messageIndex, statusMessages.length - 1)]);
        return prev + 2;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center text-white">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-8"
      >
        면접이 종료되었습니다
      </motion.h1>
      
      <AnalysisAnimation />
      
      <motion.p
        key={statusText}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gold-400 mt-6"
      >
        {statusText}
      </motion.p>
      
      <div className="w-64 h-2 bg-navy-700 rounded-full mt-6 overflow-hidden">
        <motion.div
          className="h-full bg-gold-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      
      <AnimatePresence>
        {showResultButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gold-500 text-navy-900 font-semibold px-8 py-3 rounded-full"
            onClick={() => navigate('/interview-report')}
          >
            결과 보기
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## Page 7: Interview Report (`/interview-report`)

### Layout
```
┌─────────────────────────────────────┐
│  면접 리포트                         │
│  *합격 여부와 무관한 연습용 피드백입니다│
├─────────────────────────────────────┤
│                                     │
│  📋 전체 요약                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • 전반적으로 자신감 있는 답변       │
│  • 구체적 예시가 부족함              │
│  • 시간 관리 개선 필요               │
│                                     │
│  📊 평균 답변 시간: 55초             │
│  🗣️ 말 속도: 안정적 (155 WPM)        │
│                                     │
│  질문별 시간 분포                     │
│  Q1 ████████████████ 45s            │
│  Q2 ██████████░░░░░░ 30s            │
│  Q3 ████████████████████ 60s        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  📄 질문별 상세 분석                 │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Q1. 자기소개 (45s, 적정)    │    │
│  │ ████████████████░░          │    │
│  │                             │    │
│  │ 내 답변:                    │    │
│  │ "저는 프론트엔드 개발자..."  │    │
│  │                             │    │
│  │ AI 답변 제안:               │    │
│  │ "안녕하세요. 3년차..."       │    │
│  │                             │    │
│  │ 💡 한 줄 평가:              │    │
│  │ 핵심 경험을 먼저 언급하면    │    │
│  │ 좋겠어요                    │    │
│  └─────────────────────────────┘    │
│                                     │
│  [다음 질문 →]                       │
│                                     │
│  [새로운 면접 시작하기]              │
│                                     │
└─────────────────────────────────────┘
```

### Components
```tsx
// components/SummaryCard.tsx
export function SummaryCard({ summary, averageTime, speakingSpeed }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-playfair text-xl font-bold text-navy-900 mb-4">📋 전체 요약</h3>
      <ul className="space-y-2 text-gray-700 mb-6">
        {summary.map((point, i) => (
          <li key={i}>• {point}</li>
        ))}
      </ul>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-navy-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">평균 답변 시간</p>
          <p className="text-2xl font-bold text-navy-900">{averageTime}초</p>
        </div>
        <div className="bg-gold-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">말 속도</p>
          <p className="text-2xl font-bold text-gold-600">{speakingSpeed}</p>
        </div>
      </div>
    </div>
  );
}

// components/TimeDistributionChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function TimeDistributionChart({ data }) {
  return (
    <div className="h-48 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="question" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="duration" fill="#1a2744" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// components/QuestionAnalysisCard.tsx
export function QuestionAnalysisCard({ question, isExpanded, onToggle }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between text-left"
      >
        <div>
          <h4 className="font-semibold text-navy-900">
            Q{question.id}. {question.title}
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            {question.duration}s, {question.speed}
          </p>
        </div>
        <ChevronDown className={cn("w-5 h-5 transition-transform", isExpanded && "rotate-180")} />
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 space-y-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-navy-700"
                  style={{ width: `${(question.duration / 120) * 100}%` }}
                />
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">내 답변</p>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{question.myAnswer}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gold-600 mb-2">AI 답변 제안</p>
                <p className="text-gray-700 bg-gold-50 rounded-lg p-3">{question.aiSuggestion}</p>
              </div>
              
              <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-3">
                <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-blue-800">{question.feedback}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## Shared Components

### Progress Indicator
```tsx
// components/ProgressIndicator.tsx
export function ProgressIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            i < current ? "w-8 bg-gold-400" : "w-2 bg-gray-300"
          )}
        />
      ))}
    </div>
  );
}
```

### Navigation Header
```tsx
// components/NavigationHeader.tsx
export function NavigationHeader({ showBack = true, onBack, progress }) {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      {showBack ? (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-navy-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>뒤로</span>
        </button>
      ) : (
        <div />
      )}
      {progress && <ProgressIndicator {...progress} />}
    </header>
  );
}
```

---

## State Management (Zustand)

```typescript
// stores/interviewStore.ts
import { create } from 'zustand';

interface InterviewStore {
  // Selection
  selectedCompany: Company | null;
  selectedJob: Job | null;
  resumeFile: File | null;
  
  // Settings
  settings: {
    questionCount: number;
    voiceGender: 'male' | 'female';
    interviewStyle: 'friendly' | 'pressure';
  };
  
  // Session
  currentQuestionIndex: number;
  answers: Answer[];
  isRecording: boolean;
  remainingTime: number;
  
  // Report
  report: ReportData | null;
  
  // Actions
  setCompany: (company: Company) => void;
  setJob: (job: Job) => void;
  setResume: (file: File) => void;
  updateSettings: (settings: Partial<InterviewStore['settings']>) => void;
  startRecording: () => void;
  stopRecording: () => void;
  submitAnswer: (answer: Answer) => void;
  nextQuestion: () => void;
  setReport: (report: ReportData) => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewStore>((set, get) => ({
  selectedCompany: null,
  selectedJob: null,
  resumeFile: null,
  settings: {
    questionCount: 5,
    voiceGender: 'female',
    interviewStyle: 'pressure',
  },
  currentQuestionIndex: 0,
  answers: [],
  isRecording: false,
  remainingTime: 120,
  report: null,
  
  setCompany: (company) => set({ selectedCompany: company }),
  setJob: (job) => set({ selectedJob: job }),
  setResume: (file) => set({ resumeFile: file }),
  updateSettings: (newSettings) => 
    set((state) => ({ settings: { ...state.settings, ...newSettings } })),
  startRecording: () => set({ isRecording: true }),
  stopRecording: () => set({ isRecording: false }),
  submitAnswer: (answer) => 
    set((state) => ({ answers: [...state.answers, answer] })),
  nextQuestion: () => 
    set((state) => ({ 
      currentQuestionIndex: state.currentQuestionIndex + 1,
      remainingTime: 120,
      isRecording: false,
    })),
  setReport: (report) => set({ report }),
  reset: () => set({
    selectedCompany: null,
    selectedJob: null,
    resumeFile: null,
    currentQuestionIndex: 0,
    answers: [],
    isRecording: false,
    remainingTime: 120,
    report: null,
  }),
}));
```

---

## Route Configuration

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/company-job" element={<CompanyJobPage />} />
        <Route path="/resume-upload" element={<ResumeUploadPage />} />
        <Route path="/interview-settings" element={<InterviewSettingsPage />} />
        <Route path="/interview-session" element={<InterviewSessionPage />} />
        <Route path="/interview-complete" element={<InterviewCompletePage />} />
        <Route path="/interview-report" element={<InterviewReportPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## File Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/
│   │   ├── NavigationHeader.tsx
│   │   └── PageWrapper.tsx
│   ├── interview/
│   │   ├── Timer.tsx
│   │   ├── InterviewerAvatar.tsx
│   │   ├── AnswerGuide.tsx
│   │   └── AudioWave.tsx
│   ├── report/
│   │   ├── SummaryCard.tsx
│   │   ├── TimeDistributionChart.tsx
│   │   └── QuestionAnalysisCard.tsx
│   └── shared/
│       ├── ProgressIndicator.tsx
│       ├── CompanyCard.tsx
│       ├── JobChip.tsx
│       └── FileUploadZone.tsx
├── pages/
│   ├── LandingPage.tsx
│   ├── CompanyJobPage.tsx
│   ├── ResumeUploadPage.tsx
│   ├── InterviewSettingsPage.tsx
│   ├── InterviewSessionPage.tsx
│   ├── InterviewCompletePage.tsx
│   └── InterviewReportPage.tsx
├── stores/
│   └── interviewStore.ts
├── hooks/
│   ├── useTimer.ts
│   ├── useRecording.ts
│   └── useInterview.ts
├── types/
│   └── index.ts
├── lib/
│   └── utils.ts
├── data/
│   └── mockData.ts
└── App.tsx
```

---

## Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md/lg)
- **Desktop**: > 1024px (xl)

### Mobile Adaptations
- Stack all layouts vertically
- Reduce padding: px-4 (mobile) → px-12 (desktop)
- Full-width buttons on mobile
- Simplified charts on mobile
- Touch-friendly tap targets (min 44px)

---

## Accessibility Requirements

1. **Keyboard Navigation**
   - All interactive elements focusable
   - Tab order follows visual order
   - Enter/Space to activate buttons
   - Escape to close modals/collapsibles

2. **ARIA Labels**
   - `aria-label` for icon-only buttons
   - `aria-expanded` for collapsible content
   - `aria-live="polite"` for status updates
   - `role="progressbar"` for timers

3. **Focus Indicators**
   - Visible focus rings on all interactive elements
   - High contrast focus colors

4. **Screen Reader Support**
   - Semantic HTML (nav, main, article, button)
   - Alt text for images
   - Live regions for dynamic content

---

## Animation Guidelines

### Page Transitions
```tsx
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};
```

### Micro-interactions
- Button hover: `scale: 1.02`, shadow elevation
- Card hover: `translateY: -2px`, subtle shadow
- Selection: Scale pulse + color transition
- Loading: Shimmer effect, progress indicator

### Timing
- Quick feedback: 150-200ms
- Standard transitions: 300ms
- Page transitions: 400ms
- Complex animations: 500-800ms

---

## Mock Data

```typescript
// data/mockData.ts
export const companies: Company[] = [
  {
    company_id: 'toss',
    name: 'TOSS',
    company_summary: '금융 플랫폼 기반의 핀테크 서비스 기업',
    talent_profile: [
      '송금·결제·투자·보험 등 파편화된 금융 서비스를 하나로 통합한 혁신 플랫폼',
      '어렵고 복잡한 금융의 표준을 깨고, 누구나 쉽고 간편하게 누리는 접근성 제공',
    ],
    culture_fit: [
      '자율적인 환경에서 최고의 성과를 내기 위해 스스로를 강하게 동기부여하는 태도',
      '모든 정보를 사내에 공개하고, 논리와 근거를 바탕으로 거침없이 피드백을 주고받는 문화',
    ],
    jobs: [
      {
        job_id: 'frontend',
        title: 'Frontend Developer',
        active: true,
        focus_points: [
          '데스크톱 기반 업무 도구의 복잡도 해소 및 유려한 UX 구현',
          '초고속 빌드·배포 환경 구축 및 개발 도구 자동화/최적화',
        ],
      },
      {
        job_id: 'backend',
        title: 'Backend Developer',
        active: false,
        focus_points: ['대규모 실시간 트래픽을 견디는 확장 가능한 분산 시스템 설계'],
      },
      {
        job_id: 'po',
        title: 'PO',
        active: false,
        focus_points: ['North Star Metric 설정 및 비즈니스 임팩트 중심 우선순위 결정'],
      },
    ],
  },
];

export const mockReport: ReportData = {
  summary: {
    averageTime: 42,
    speakingSpeed: '안정적',
    structureBalance: '도입 과다',
    threeLineSummary: [
      '전반적으로 자신감 있는 답변',
      '구체적 예시가 부족',
      '시간 관리 개선 필요',
    ],
  },
  questions: [
    {
      id: 1,
      question: '자기소개 부탁드립니다',
      duration: 45,
      myAnswer: '저는 프론트엔드 개발자입니다...',
      aiSuggestion: '안녕하세요. 3년차 프론트엔드 개발자로...',
      feedback: '핵심 경험을 먼저 언급하면 좋겠어요',
    },
  ],
};
```

---

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "framer-motion": "^10.16.0",
    "zustand": "^4.4.0",
    "react-dropzone": "^14.2.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.294.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "@radix-ui/react-collapsible": "^1.0.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

---

## Implementation Checklist

- [ ] Set up project with Vite + React + TypeScript
- [ ] Configure Tailwind with custom colors
- [ ] Install all dependencies
- [ ] Set up Zustand store
- [ ] Create base layout components
- [ ] Implement Landing page
- [ ] Implement Company/Job selection
- [ ] Implement Resume upload
- [ ] Implement Interview settings
- [ ] Implement Interview session (core)
- [ ] Implement Interview complete animation
- [ ] Implement Interview report
- [ ] Add page transitions
- [ ] Add responsive styles
- [ ] Add accessibility attributes
- [ ] Test all user flows
- [ ] Verify animations work smoothly
- [ ] Test on mobile devices
