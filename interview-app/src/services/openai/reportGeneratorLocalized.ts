import type { Report, QuestionAnalysis } from '../../types/report';
import type { SpeedLabel } from '../../types/question';
import { openai } from './client';

interface QuestionInput {
  readonly order: number;
  readonly questionText: string;
  readonly questionType: string;
  readonly context: string;
}

interface AnswerInput {
  readonly order: number;
  readonly answerText: string;
  readonly answerDuration: number;
  readonly answerWpm: number;
  readonly speedLabel: string;
}

interface GenerateReportParams {
  readonly companyName: string;
  readonly jobTitle: string;
  readonly resumeText: string;
  readonly questions: readonly QuestionInput[];
  readonly answers: readonly AnswerInput[];
  readonly interviewLanguage?: 'ko' | 'en';
}

interface RawQuestionAnalysis {
  readonly questionOrder: number;
  readonly answerTime: number;
  readonly speedLabel: SpeedLabel;
  readonly aiSuggestedAnswer: string;
  readonly oneLineReview: string;
}

interface RawReport {
  readonly summary: string;
  readonly avgAnswerTime: number;
  readonly avgWpm: number;
  readonly questionAnalyses: readonly RawQuestionAnalysis[];
}

function buildSystemPromptKo(): string {
  return `당신은 전문 면접 코칭 전문가입니다.
지원자의 면접 답변을 분석하여 건설적인 피드백을 제공합니다.

중요: 이것은 합격/불합격 판정이 아닌, 면접 역량 향상을 위한 코칭 도구입니다.
긍정적인 점을 먼저 언급하고, 개선점을 구체적으로 제안해주세요.

응답은 반드시 아래 JSON 형식으로 반환하세요:
{
  "summary": "3줄 요약 (잘한 점 + 개선할 점을 포함, 한국어)",
  "avgAnswerTime": 평균 답변 시간(초, 숫자),
  "avgWpm": 평균 분당 단어수(숫자),
  "questionAnalyses": [
    {
      "questionOrder": 질문 순번(숫자),
      "answerTime": 답변 시간(초, 숫자),
      "speedLabel": "fast" | "normal" | "slow",
      "aiSuggestedAnswer": "이상적인 모범 답변 (한국어)",
      "oneLineReview": "강점 + 개선점 한 줄 리뷰 (한국어)"
    }
  ]
}`;
}

function buildSystemPromptEn(): string {
  return `You are a professional interview coach.
Analyze the candidate's answers and provide constructive feedback.

Important: This is a coaching tool, not a pass/fail decision.
Highlight strengths first, and suggest specific improvements.

Return JSON strictly in this format:
{
  "summary": "3-sentence summary (strengths + improvements, in English)",
  "avgAnswerTime": average answer time (seconds, number),
  "avgWpm": average words per minute (number),
  "questionAnalyses": [
    {
      "questionOrder": question order (number),
      "answerTime": answer time (seconds, number),
      "speedLabel": "fast" | "normal" | "slow",
      "aiSuggestedAnswer": "ideal sample answer (English)",
      "oneLineReview": "one-line review (strength + improvement, English)"
    }
  ]
}`;
}

function buildUserPromptKo(params: GenerateReportParams): string {
  const qaPairs = params.questions.map((q) => {
    const answer = params.answers.find((a) => a.order === q.order);
    return `
[질문 ${q.order}] (${q.questionType})
질문: ${q.questionText}
질문 의도: ${q.context}
답변: ${answer?.answerText ?? '(답변 없음)'}
답변 시간: ${answer?.answerDuration ?? 0}초
말하기 속도: ${answer?.answerWpm ?? 0} WPM (${answer?.speedLabel ?? 'normal'})`;
  });

  return `[면접 정보]
- 회사: ${params.companyName}
- 직무: ${params.jobTitle}

[지원자 이력서]
${params.resumeText}

[면접 질의응답]
${qaPairs.join('\n')}

위 면접 내용을 분석하여 코칭 리포트를 생성해주세요.
avgAnswerTime과 avgWpm은 실제 데이터를 기반으로 계산해주세요.`;
}

function buildUserPromptEn(params: GenerateReportParams): string {
  const qaPairs = params.questions.map((q) => {
    const answer = params.answers.find((a) => a.order === q.order);
    return `
[Question ${q.order}] (${q.questionType})
Question: ${q.questionText}
Intent: ${q.context}
Answer: ${answer?.answerText ?? '(no answer)'}
Answer time: ${answer?.answerDuration ?? 0}s
Speaking speed: ${answer?.answerWpm ?? 0} WPM (${answer?.speedLabel ?? 'normal'})`;
  });

  return `[Interview Info]
- Company: ${params.companyName}
- Role: ${params.jobTitle}

[Resume]
${params.resumeText}

[Q&A]
${qaPairs.join('\n')}

Please analyze the interview and produce the coaching report in English.
Compute avgAnswerTime and avgWpm based on the provided data.`;
}

export async function generateReport(
  params: GenerateReportParams,
): Promise<Report> {
  const language = params.interviewLanguage ?? 'ko';

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: language === 'en' ? buildSystemPromptEn() : buildSystemPromptKo() },
      { role: 'user', content: language === 'en' ? buildUserPromptEn(params) : buildUserPromptKo(params) },
    ],
    temperature: 0.5,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI returned empty response for report generation');
  }

  const parsed: RawReport = JSON.parse(content);

  const questionAnalyses: readonly QuestionAnalysis[] =
    parsed.questionAnalyses.map((qa) => ({
      questionOrder: qa.questionOrder,
      answerTime: qa.answerTime,
      speedLabel: qa.speedLabel,
      aiSuggestedAnswer: qa.aiSuggestedAnswer,
      oneLineReview: qa.oneLineReview,
    }));

  return {
    summary: parsed.summary,
    avgAnswerTime: parsed.avgAnswerTime,
    avgWpm: parsed.avgWpm,
    questionAnalyses,
  };
}
