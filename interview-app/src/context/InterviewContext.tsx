import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  InterviewState,
  InterviewSettings,
  Question,
  Company,
  Report,
} from '../types';
import TossLogo from '../assets/Toss_Symbol_Primary.png';
import GoogleLogo from '../assets/google-color.svg';
import KakaoLogo from '../assets/kakao.png';

interface InterviewContextType extends InterviewState {
  currentQuestion: Question | null;
  elapsedTime: number;
  voiceVolume: number[];
  questions: Question[];
  companies: Company[];
  report: Report | null;
  setCurrentQuestionIndex: (index: number) => void;
  setRemainingTime: (time: number | ((prev: number) => number)) => void;
  setIsRecording: (recording: boolean) => void;
  setSelectedCompany: (companyId: string) => void;
  setSelectedJob: (jobId: string) => void;
  setResumeFile: (file: File | null) => void;
  setResumeText: (text: string | null) => void;
  setSelfIntroText: (text: string | null) => void;
  setSettings: (settings: InterviewSettings) => void;
  setElapsedTime: (time: number | ((prev: number) => number)) => void;
  setVoiceVolume: (volume: number[]) => void;
  setQuestions: (questions: Question[]) => void;
  resetInterview: () => void;
  startSession: () => Promise<void>;
  fetchNextQuestion: () => Promise<void>;
  submitAnswerTime: (questionId: string, seconds: number) => Promise<void>;
  submitAnswerAudio: (
    questionId: string,
    seconds: number,
    audio: Blob,
  ) => Promise<void>;
  fetchReport: () => Promise<void>;
  parseDoc: (file: File) => Promise<string>;
  speakQuestion: (questionId: string) => Promise<string>;
}

const InterviewContext = createContext<InterviewContextType | undefined>(
  undefined,
);

const companiesSeed: Company[] = [
  {
    company_id: 'toss',
    name: 'TOSS',
    logo: TossLogo,
    company_summary: '금융 플랫폼 기반의 핀테크 서비스 기업',
    talent_profile: ['문제 해결에 집요함', '고객 중심 사고', '빠른 실행'],
    culture_fit: ['수평적 커뮤니케이션', '자율과 책임', '실험과 개선'],
    jobs: [
      {
        job_id: 'frontend',
        title: 'Frontend Developer',
        active: true,
        focus_points: [
          '데스크톱 기반 업무 도구의 복잡도 해소 및 유려한 UX 구현',
          '초고속 빌드·배포 환경 구축 및 개발 도구 자동화/최적화',
          '까다로운 요구사항을 단순화하여 재사용 가능한 코드로 설계',
          '스스로 문제를 정의하고 솔루션을 제안하는 직접 의사결정',
          '코드 리뷰, 테크 톡, 오픈소스 기여를 통한 동반 성장 추구',
        ],
      },
      { job_id: 'po', title: 'Product Owner', active: false, focus_points: [] },
      {
        job_id: 'server',
        title: 'Server Developer',
        active: false,
        focus_points: [],
      },
    ],
  },
  {
    company_id: 'google',
    name: 'Google',
    logo: GoogleLogo,
    company_summary: '혁신과 창의성을 기반으로 세상의 정보를 정리하는 글로벌 테크 리더',
    talent_profile: ['기술적 우수성', '창의적 문제 해결', '데이터 기반 의사결정'],
    culture_fit: ['개방적 소통', '실험 정신', '사용자 중심'],
    jobs: [
      {
        job_id: 'frontend',
        title: 'Frontend Developer',
        active: true,
        focus_points: [
          '대규모 사용자 대상 웹 애플리케이션 설계 및 구현',
          '성능 최적화 및 접근성 개선을 통한 사용자 경험 향상',
          'Angular, React 등 최신 프레임워크 활용한 UI 개발',
          '크로스 브라우저 호환성 및 반응형 디자인 구현',
          '협업을 통한 디자인 시스템 구축 및 유지보수',
        ],
      },
      { job_id: 'backend', title: 'Backend Developer', active: false, focus_points: [] },
      { job_id: 'data', title: 'Data Scientist', active: false, focus_points: [] },
    ],
  },
  {
    company_id: 'kakao',
    name: 'Kakao',
    logo: KakaoLogo,
    company_summary: '일상의 모든 순간을 연결하는 국내 최대 IT 플랫폼 기업',
    talent_profile: ['사용자 중심 사고', '적극적 협업', '빠른 실행력'],
    culture_fit: ['수평적 문화', '자율과 책임', '성장 마인드'],
    jobs: [
      {
        job_id: 'frontend',
        title: 'Frontend Developer',
        active: true,
        focus_points: [
          '카카오톡, 카카오맵 등 주요 서비스의 웹 인터페이스 개발',
          'React 기반 SPA 설계 및 상태 관리 최적화',
          '모바일 웹 성능 개선 및 사용자 경험 향상',
          '컴포넌트 기반 아키텍처 설계 및 재사용성 극대화',
          'A/B 테스트를 통한 데이터 기반 UI/UX 개선',
        ],
      },
      { job_id: 'pm', title: 'Product Manager', active: false, focus_points: [] },
      { job_id: 'server', title: 'Server Developer', active: false, focus_points: [] },
    ],
  },
];

const initialState: InterviewState = {
  sessionId: null,
  currentQuestionIndex: 0,
  remainingTime: 120,
  isRecording: false,
  selectedCompany: null,
  selectedJob: null,
  resumeFile: null,
  resumeText: null,
  selfIntroText: null,
  settings: {
    questionCount: 10,
    voice: 'female',
    style: 'friendly',
  },
};

const API_BASE = 'http://localhost:8000';

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InterviewState>(initialState);
  const [questions, setQuestionsState] = useState<Question[]>([]);
  const [elapsedTime, setElapsedTimeState] = useState(0);
  const [voiceVolume, setVoiceVolumeState] = useState<number[]>([
    40, 70, 55, 20, 15,
  ]);
  const [companies] = useState<Company[]>(companiesSeed);
  const [report, setReport] = useState<Report | null>(null);

  const currentQuestion = questions[state.currentQuestionIndex] || null;

  const setCurrentQuestionIndex = (index: number) => {
    setState(prev => ({ ...prev, currentQuestionIndex: index }));
  };

  const setRemainingTime = useCallback((time: number | ((prev: number) => number)) => {
    if (typeof time === 'function') {
      setState(prev => ({ ...prev, remainingTime: time(prev.remainingTime ?? 120) }));
      return;
    }
    setState(prev => ({ ...prev, remainingTime: time }));
  }, []);

  const setIsRecording = (recording: boolean) => {
    setState(prev => ({ ...prev, isRecording: recording }));
  };

  const setSelectedCompany = (companyId: string) => {
    setState(prev => ({ ...prev, selectedCompany: companyId }));
  };

  const setSelectedJob = (jobId: string) => {
    setState(prev => ({ ...prev, selectedJob: jobId }));
  };

  const setResumeFile = (file: File | null) => {
    setState(prev => ({ ...prev, resumeFile: file }));
  };

  const setResumeText = (text: string | null) => {
    setState(prev => ({ ...prev, resumeText: text }));
  };

  const setSelfIntroText = (text: string | null) => {
    setState(prev => ({ ...prev, selfIntroText: text }));
  };

  const setSettings = (settings: InterviewSettings) => {
    setState(prev => ({ ...prev, settings }));
  };

  const setElapsedTime = useCallback((time: number | ((prev: number) => number)) => {
    if (typeof time === 'function') {
      setElapsedTimeState(prev => time(prev));
      return;
    }
    setElapsedTimeState(time);
  }, []);

  const setVoiceVolume = (volume: number[]) => {
    setVoiceVolumeState(volume);
  };

  const setQuestions = (newQuestions: Question[]) => {
    setQuestionsState(newQuestions);
  };

  const resetInterview = () => {
    setState(initialState);
    setQuestionsState([]);
    setElapsedTimeState(0);
    setVoiceVolumeState([40, 70, 55, 20, 15]);
    setReport(null);
  };

  const parseDoc = async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_BASE}/api/session/parse-doc`, {
      method: 'POST',
      body: form,
    });
    const data = await res.json();
    return data.text || '';
  };

  const startSession = async () => {
    if (!state.selectedCompany || !state.selectedJob) {
      throw new Error('company/job not selected');
    }
    const payload = {
      company_id: state.selectedCompany,
      job_id: state.selectedJob,
      resume_text: state.resumeText,
      self_intro_text: state.selfIntroText,
      question_count: state.settings.questionCount,
      voice: state.settings.voice,
      style: state.settings.style,
    };

    const res = await fetch(`${API_BASE}/api/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error('failed to start session');
    }

    const data = await res.json();
    const firstQuestion: Question = {
      id: data.question.question_id,
      text: data.question.text,
      timeLimit: data.question.time_limit_seconds,
    };

    setState(prev => ({
      ...prev,
      sessionId: data.session_id,
      currentQuestionIndex: 0,
      remainingTime: firstQuestion.timeLimit,
    }));
    setQuestionsState([firstQuestion]);
    setElapsedTimeState(0);
  };

  const fetchNextQuestion = async () => {
    if (!state.sessionId) return;
    const res = await fetch(`${API_BASE}/api/question/next`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: state.sessionId }),
    });

    if (!res.ok) {
      throw new Error('no more questions');
    }

    const data = await res.json();
    const nextQuestion: Question = {
      id: data.question_id,
      text: data.text,
      timeLimit: data.time_limit_seconds,
    };
    setQuestionsState(prev => [...prev, nextQuestion]);
  };

  const submitAnswerTime = async (questionId: string, seconds: number) => {
    if (!state.sessionId) return;
    await fetch(`${API_BASE}/api/question/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: state.sessionId,
        question_id: questionId,
        answer_seconds: seconds,
      }),
    });
  };

  const submitAnswerAudio = async (
    questionId: string,
    seconds: number,
    audio: Blob,
  ) => {
    if (!state.sessionId) return;
    const form = new FormData();
    form.append('session_id', state.sessionId);
    form.append('question_id', questionId);
    form.append('answer_seconds', String(seconds));
    form.append('audio', audio, 'answer.webm');

    await fetch(`${API_BASE}/api/question/answer-audio`, {
      method: 'POST',
      body: form,
    });
  };

  const speakQuestion = async (questionId: string) => {
    if (!state.sessionId) return '';
    const res = await fetch(`${API_BASE}/api/tts/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: state.sessionId,
        question_id: questionId,
      }),
    });
    if (!res.ok) {
      throw new Error('tts failed');
    }
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };

  const fetchReport = async () => {
    if (!state.sessionId) return;
    const res = await fetch(`${API_BASE}/api/report/${state.sessionId}`);
    if (!res.ok) {
      throw new Error('failed to load report');
    }
    const data = await res.json();
    setReport(data);
  };

  const value = useMemo(
    () => ({
      ...state,
      currentQuestion,
      elapsedTime,
      voiceVolume,
      questions,
      companies,
      report,
      setCurrentQuestionIndex,
      setRemainingTime,
      setIsRecording,
      setSelectedCompany,
      setSelectedJob,
      setResumeFile,
      setResumeText,
      setSelfIntroText,
      setSettings,
      setElapsedTime,
      setVoiceVolume,
      setQuestions,
      resetInterview,
      startSession,
      fetchNextQuestion,
      submitAnswerTime,
      submitAnswerAudio,
      fetchReport,
      parseDoc,
      speakQuestion,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      state,
      currentQuestion,
      elapsedTime,
      voiceVolume,
      questions,
      companies,
      report,
    ],
  );

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within InterviewProvider');
  }
  return context;
}
