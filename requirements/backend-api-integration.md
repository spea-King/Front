# 백엔드 API 연동 명세서

## 프론트엔드에 전달해야 할 핵심 코드/연동 정보

---

## 1. 필수 엔드포인트

### 1.1 문서 파싱
```
POST /api/session/parse-doc
Content-Type: multipart/form-data
```

**설명**: PDF 업로드 → 텍스트 반환

**요청**:
- `file`: PDF 파일 (multipart/form-data)

**응답**:
```json
{
  "text": "추출된 텍스트 내용..."
}
```

---

### 1.2 세션 시작
```
POST /api/session/start
Content-Type: application/json
```

**설명**: 세션 생성 + 첫 질문 반환

**요청 필드**:
```json
{
  "company_id": "toss",
  "job_id": "frontend",
  "resume_text": "이력서 텍스트...",
  "self_intro_text": "자기소개서 텍스트...",
  "jd_text": "직무 설명서 텍스트...",
  "question_count": 5,
  "style": "friendly" | "pressure",
  "voice": "male" | "female",
  "tts_instructions": "TTS 지시사항...",
  "tts_speed": 1.0
}
```

**필드 설명**:
- `company_id`: 기업 ID (예: "toss")
- `job_id`: 직무 ID (예: "frontend")
- `resume_text`: 이력서 텍스트
- `self_intro_text`: 자기소개서 텍스트
- `jd_text`: 직무 설명서 텍스트
- `question_count`: 질문 개수 (5~10개)
- `style`: 면접 스타일
  - `"friendly"`: 친절한 톤 + TTS 말투
  - `"pressure"`: 압박 톤 + TTS 말투
  - ⚠️ **style은 질문 문장 톤 + TTS 말투 모두에 영향**
- `voice`: 면접관 음성
  - `"male"` 또는 `"female"`만 전송
  - 백엔드에서 자동으로 보이스 매핑함
- `tts_instructions`: TTS 추가 지시사항 (선택)
- `tts_speed`: TTS 속도 (기본값: 1.0)

**응답**:
```json
{
  "session_id": "uuid",
  "first_question": {
    "question_id": "uuid",
    "question_text": "자기소개 부탁드립니다",
    "order": 1
  }
}
```

---

### 1.3 다음 질문 요청
```
POST /api/question/next
Content-Type: application/json
```

**설명**: 다음 질문 1개씩 받기

**요청**:
```json
{
  "session_id": "uuid"
}
```

**응답**:
```json
{
  "question_id": "uuid",
  "question_text": "프론트엔드 개발 경험에 대해 말씀해주세요",
  "order": 2
}
```

---

### 1.4 답변 오디오 업로드
```
POST /api/question/answer-audio
Content-Type: multipart/form-data
```

**설명**: 답변 오디오 업로드 + STT 처리

**요청 필드** (multipart/form-data):
- `session_id`: 세션 ID
- `question_id`: 질문 ID
- `answer_seconds`: 답변 시간 (0~120초)
- `audio`: 오디오 파일 (webm/wav/mp3 가능)

**응답**:
```json
{
  "transcript": "제 답변은...",
  "words_per_min": 155,
  "answer_seconds": 45
}
```

**중요 사항**:
- ⚠️ **답변 시간은 무조건 120초 고정**
- 2분 경과 또는 조기 종료 시 업로드

---

### 1.5 리포트 조회
```
GET /api/report/{session_id}
```

**설명**: 면접 종료 후 분석 리포트 조회

**응답**:
```json
{
  "session_id": "uuid",
  "summary": {
    "average_time": 55,
    "speaking_speed": "적정",
    "three_line_summary": [
      "전반적으로 자신감 있는 답변",
      "구체적 예시가 부족",
      "시간 관리 개선 필요"
    ]
  },
  "questions": [
    {
      "id": 1,
      "question": "자기소개 부탁드립니다",
      "duration": 45,
      "my_answer": "저는 프론트엔드 개발자입니다...",
      "ai_suggestion": "안녕하세요. 3년차 프론트엔드 개발자로...",
      "feedback": "핵심 경험을 먼저 언급하면 좋겠어요"
    }
  ]
}
```

---

### 1.6 TTS 음성 생성
```
POST /api/tts/speak
Content-Type: application/json
```

**설명**: 질문 텍스트 → 음성 생성

**요청**:
```json
{
  "session_id": "uuid",
  "question_id": "uuid"
}
```

**중요 사항**:
- `question_id`만 전송하면 해당 질문의 음성 자동 생성
- 반환: 오디오 스트림 (기본 mp3)

**응답**:
- Content-Type: `audio/mpeg`
- Body: 오디오 바이너리 스트림

---

## 2. 질문 흐름

### 2.1 전체 플로우

```
1. [세션 시작]
   POST /api/session/start
   → 첫 질문 반환 (Q1)

2. [첫 질문 TTS]
   POST /api/tts/speak { question_id: Q1 }
   → 음성 재생

3. [답변 녹음]
   120초 타이머 시작
   → 2분 경과 or 조기 종료

4. [답변 업로드]
   POST /api/question/answer-audio
   → STT 결과 반환

5. [다음 질문 요청]
   POST /api/question/next
   → Q2 반환

6. [2~5번 반복]
   question_count만큼 반복

7. [리포트 조회]
   GET /api/report/{session_id}
   → 분석 결과 표시
```

### 2.2 주요 규칙

- ✅ 세션 시작 시 **첫 질문 자동 반환**
- ✅ 이후는 `POST /api/question/next`로 1개씩 요청
- ✅ **답변 시간은 무조건 120초 고정**
- ✅ 2분 경과 또는 사용자가 조기 종료 시 업로드
- ✅ `question_count`에 도달하면 자동 종료

---

## 3. 세션 시작 요청 상세

### 3.1 필수 필드

```typescript
interface SessionStartRequest {
  company_id: string;        // 기업 ID
  job_id: string;           // 직무 ID
  resume_text: string;      // 이력서 텍스트
  self_intro_text: string;  // 자기소개서 텍스트
  jd_text: string;          // 직무 설명서 텍스트
  question_count: number;   // 5~10
  style: 'friendly' | 'pressure';
  voice: 'male' | 'female';
  tts_instructions?: string;
  tts_speed?: number;       // 기본값: 1.0
}
```

### 3.2 Style 영향 범위

`style` 파라미터는 다음 두 가지에 영향을 줍니다:

1. **질문 문장 톤**: 친절한 표현 vs 압박 표현
2. **TTS 말투**: 부드러운 음성 vs 단호한 음성

**예시**:
- `"friendly"`: "편하게 말씀해주세요" + 부드러운 톤
- `"pressure"`: "명확히 답변해주시기 바랍니다" + 단호한 톤

### 3.3 Voice 매핑

프론트엔드는 `"male"` 또는 `"female"`만 전송하면 됩니다.

백엔드에서 자동으로 다음과 같이 매핑합니다:
- `"male"` → 남성 TTS 보이스 선택
- `"female"` → 여성 TTS 보이스 선택

---

## 4. 답변 업로드 형식

### 4.1 요청 예시 (FormData)

```javascript
const formData = new FormData();
formData.append('session_id', sessionId);
formData.append('question_id', questionId);
formData.append('answer_seconds', String(elapsedSeconds));
formData.append('audio', audioBlob, 'answer.webm');

const response = await fetch('/api/question/answer-audio', {
  method: 'POST',
  body: formData
});
```

### 4.2 지원 오디오 포맷

- ✅ `webm` (브라우저 기본 녹음)
- ✅ `wav`
- ✅ `mp3`

### 4.3 응답 활용

```typescript
interface AnswerAudioResponse {
  transcript: string;      // STT 결과 텍스트
  words_per_min: number;   // 분당 단어 수 (WPM)
  answer_seconds: number;  // 실제 답변 시간
}
```

---

## 5. TTS 호출 방식

### 5.1 기본 호출

```javascript
const response = await fetch('/api/tts/speak', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    session_id: sessionId,
    question_id: questionId
  })
});

const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
const audio = new Audio(audioUrl);
audio.play();
```

### 5.2 응답 헤더

```
Content-Type: audio/mpeg
Content-Length: [파일 크기]
```

---

## 6. 에러 처리

### 6.1 공통 에러 응답

```json
{
  "error": "에러 메시지",
  "code": "ERROR_CODE"
}
```

### 6.2 주요 에러 코드

| 코드 | 의미 | 대응 방법 |
|------|------|----------|
| `SESSION_NOT_FOUND` | 세션이 존재하지 않음 | 세션 재시작 |
| `QUESTION_LIMIT_REACHED` | 질문 개수 초과 | 리포트로 이동 |
| `INVALID_AUDIO_FORMAT` | 지원하지 않는 오디오 형식 | webm/wav/mp3 사용 |
| `TTS_GENERATION_FAILED` | TTS 생성 실패 | 재시도 또는 텍스트만 표시 |

---

## 7. TypeScript 타입 정의

```typescript
// 세션 시작 요청
interface SessionStartRequest {
  company_id: string;
  job_id: string;
  resume_text: string;
  self_intro_text: string;
  jd_text: string;
  question_count: number;
  style: 'friendly' | 'pressure';
  voice: 'male' | 'female';
  tts_instructions?: string;
  tts_speed?: number;
}

// 세션 시작 응답
interface SessionStartResponse {
  session_id: string;
  first_question: {
    question_id: string;
    question_text: string;
    order: number;
  };
}

// 다음 질문 응답
interface NextQuestionResponse {
  question_id: string;
  question_text: string;
  order: number;
}

// 답변 업로드 응답
interface AnswerAudioResponse {
  transcript: string;
  words_per_min: number;
  answer_seconds: number;
}

// 리포트 응답
interface ReportResponse {
  session_id: string;
  summary: {
    average_time: number;
    speaking_speed: string;
    three_line_summary: string[];
  };
  questions: {
    id: number;
    question: string;
    duration: number;
    my_answer: string;
    ai_suggestion: string;
    feedback: string;
  }[];
}
```

---

## 8. 환경 변수 설정

```env
# .env
VITE_API_BASE_URL=http://localhost:8000
```

**사용 예시**:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const response = await fetch(`${API_BASE_URL}/api/session/start`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(requestData)
});
```

---

**작성일**: 2026-02-06
**문서 버전**: 1.0
