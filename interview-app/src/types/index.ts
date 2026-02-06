export interface Job {
  job_id: string;
  title: string;
  active: boolean;
  focus_points: string[];
}

export interface Company {
  company_id: string;
  name: string;
  company_summary: string;
  talent_profile: string[];
  culture_fit: string[];
  jobs: Job[];
}

export interface Question {
  id: number;
  question: string;
  timeLimit: number;
}

export interface QuestionReport {
  id: number;
  question: string;
  duration: number;
  myAnswer: string;
  aiSuggestion: string;
  feedback: string;
}

export interface Report {
  summary: {
    averageTime: number;
    speakingSpeed: string;
    threeLineSummary: string[];
  };
  questions: QuestionReport[];
}

export interface InterviewSettings {
  questionCount: number;
  voice: 'male' | 'female';
  style: 'friendly' | 'pressure';
}

export interface InterviewState {
  currentQuestionIndex: number;
  remainingTime: number;
  isRecording: boolean;
  answers: string[];
  selectedCompany: string | null;
  selectedJob: string | null;
  resumeFile: File | null;
  settings: InterviewSettings;
}
