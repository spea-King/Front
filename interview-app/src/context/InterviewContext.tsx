import { createContext, useContext, useState, type ReactNode } from 'react';
import type { InterviewState, InterviewSettings, Question, Company, Job } from '../types';

interface InterviewContextType extends InterviewState {
  currentQuestion: Question | null;
  elapsedTime: number;
  voiceVolume: number[];
  questions: Question[];
  companies: Company[];
  setCurrentQuestionIndex: (index: number) => void;
  setRemainingTime: (time: number) => void;
  setIsRecording: (recording: boolean) => void;
  addAnswer: (answer: string) => void;
  setSelectedCompany: (companyId: string) => void;
  setSelectedJob: (jobId: string) => void;
  setResumeFile: (file: File | null) => void;
  setSettings: (settings: InterviewSettings) => void;
  setElapsedTime: (time: number) => void;
  setVoiceVolume: (volume: number[]) => void;
  setQuestions: (questions: Question[]) => void;
  resetInterview: () => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

const mockCompanies: Company[] = [
  {
    company_id: 'toss',
    name: 'TOSS',
    company_summary: '금융을 쉽고 간편하게, 파괴적 혁신을 지향하는 핀테크 리더',
    talent_profile: ['문제 해결 집요함', '고객 중심', '빠른 실행'],
    culture_fit: [],
    jobs: [
      {
        job_id: 'frontend',
        title: 'Frontend Developer',
        active: true,
        focus_points: ['React, Next.js 기반의 고성능 웹 서비스 개발']
      }
    ]
  }
];

const mockQuestions: Question[] = [
  {
    id: 1,
    question: '간단히 자기소개 부탁드립니다.',
    timeLimit: 120
  },
  {
    id: 2,
    question: '본인이 진행했던 프로젝트 중에서 기술적 한계에 부딪혔던 경험과, 이를 어떻게 극복하셨는지 구체적으로 말씀해 주세요.',
    timeLimit: 180
  }
];

const initialState: InterviewState = {
  currentQuestionIndex: 0,
  remainingTime: 120,
  isRecording: false,
  answers: [],
  selectedCompany: null,
  selectedJob: null,
  resumeFile: null,
  settings: {
    questionCount: 10,
    voice: 'female',
    style: 'friendly'
  }
};

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InterviewState>(initialState);
  const [questions, setQuestionsState] = useState<Question[]>(mockQuestions);
  const [elapsedTime, setElapsedTimeState] = useState(0);
  const [voiceVolume, setVoiceVolumeState] = useState<number[]>([40, 70, 55, 20, 15]);
  const [companies] = useState<Company[]>(mockCompanies);

  const currentQuestion = questions[state.currentQuestionIndex] || null;

  const setCurrentQuestionIndex = (index: number) => {
    setState(prev => ({ ...prev, currentQuestionIndex: index }));
  };

  const setRemainingTime = (time: number) => {
    setState(prev => ({ ...prev, remainingTime: time }));
  };

  const setIsRecording = (recording: boolean) => {
    setState(prev => ({ ...prev, isRecording: recording }));
  };

  const addAnswer = (answer: string) => {
    setState(prev => ({ ...prev, answers: [...prev.answers, answer] }));
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

  const setSettings = (settings: InterviewSettings) => {
    setState(prev => ({ ...prev, settings }));
  };

  const setElapsedTime = (time: number) => {
    setElapsedTimeState(time);
  };

  const setVoiceVolume = (volume: number[]) => {
    setVoiceVolumeState(volume);
  };

  const setQuestions = (newQuestions: Question[]) => {
    setQuestionsState(newQuestions);
  };

  const resetInterview = () => {
    setState(initialState);
    setElapsedTimeState(0);
    setVoiceVolumeState([40, 70, 55, 20, 15]);
  };

  return (
    <InterviewContext.Provider
      value={{
        ...state,
        currentQuestion,
        elapsedTime,
        voiceVolume,
        questions,
        companies,
        setCurrentQuestionIndex,
        setRemainingTime,
        setIsRecording,
        addAnswer,
        setSelectedCompany,
        setSelectedJob,
        setResumeFile,
        setSettings,
        setElapsedTime,
        setVoiceVolume,
        setQuestions,
        resetInterview
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within InterviewProvider');
  }
  return context;
}
