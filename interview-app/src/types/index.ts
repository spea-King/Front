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
  id: string;
  text: string;
  timeLimit: number;
}

export interface ReportAnswer {
  question_id: string;
  question_text: string;
  answer_seconds: number;
  words_per_min: number;
  wpm_label: string;
  transcript?: string | null;
  model_answer?: string | null;
  feedback?: string | null;
}

export interface ReportSummary {
  average_seconds: number;
  min_seconds: number;
  max_seconds: number;
  std_dev_seconds: number;
  average_wpm: number;
  average_wpm_label: string;
  summary_lines: string[];
}

export interface Report {
  session_id: string;
  total_questions: number;
  answered_questions: number;
  summary: ReportSummary;
  answers: ReportAnswer[];
}

export interface InterviewSettings {
  questionCount: number;
  voice: 'male' | 'female';
  style: 'friendly' | 'pressure';
}

export interface InterviewState {
  sessionId: string | null;
  currentQuestionIndex: number;
  remainingTime: number;
  isRecording: boolean;
  selectedCompany: string | null;
  selectedJob: string | null;
  resumeFile: File | null;
  resumeText: string | null;
  selfIntroText: string | null;
  settings: InterviewSettings;
}
