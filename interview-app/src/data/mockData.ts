import type { Question, Report, Company } from '../types';

export const mockCompanies: Company[] = [
  {
    company_id: "toss",
    name: "TOSS",
    company_summary: "금융 플랫폼 기반의 핀테크 서비스 기업",
    talent_profile: [
      "송금·결제·투자·보험 등 파편화된 금융 서비스를 하나로 통합한 혁신 플랫폼",
      "어렵고 복잡한 금융의 표준을 깨고, 누구나 쉽고 간편하게 누리는 접근성 제공",
      "엄격한 금융 보안/규제를 준수하면서도 기술적 유연함을 잃지 않는 핀테크 리더"
    ],
    culture_fit: [
      "자율적인 환경에서 최고의 성과를 내기 위해 스스로를 강하게 동기부여하는 태도",
      "모든 정보를 사내에 공개하고, 논리와 근거를 바탕으로 거침없이 피드백을 주고받는 문화"
    ],
    jobs: [
      {
        job_id: "frontend",
        title: "Frontend Developer",
        active: true,
        focus_points: [
          "데스크톱 기반 업무 도구의 복잡도 해소 및 유려한 UX 구현",
          "초고속 빌드·배포 환경 구축 및 개발 도구 자동화/최적화"
        ]
      },
      {
        job_id: "po",
        title: "PO",
        active: false,
        focus_points: ["North Star Metric 설정 및 비즈니스 임팩트 중심 우선순위 결정"]
      },
      {
        job_id: "server",
        title: "Server Developer",
        active: false,
        focus_points: ["대규모 실시간 트래픽을 견디는 확장 가능한 분산 시스템 설계"]
      }
    ]
  }
];

export const mockQuestions: Question[] = [
  {
    id: 1,
    question: "자기소개 부탁드립니다",
    timeLimit: 120
  },
  {
    id: 2,
    question: "프론트엔드 개발 경험에 대해 말씀해주세요",
    timeLimit: 120
  },
  {
    id: 3,
    question: "데스크톱 기반 업무 도구의 복잡도를 어떻게 해소하셨나요?",
    timeLimit: 120
  },
  {
    id: 4,
    question: "빌드·배포 환경 최적화 경험이 있으신가요?",
    timeLimit: 120
  },
  {
    id: 5,
    question: "마지막으로 하고 싶은 말씀이 있으신가요?",
    timeLimit: 120
  }
];

export const mockReport: Report = {
  summary: {
    averageTime: 55,
    speakingSpeed: "적정 (155 WPM)",
    threeLineSummary: [
      "전반적으로 자신감 있는 답변으로 좋은 인상을 주었습니다",
      "구체적인 기술 스택과 수치 언급이 부족했어요",
      "답변 시간 배분을 개선하면 더 좋을 것 같습니다"
    ]
  },
  questions: [
    {
      id: 1,
      question: "자기소개 부탁드립니다",
      duration: 45,
      myAnswer: "저는 3년차 프론트엔드 개발자입니다. React와 TypeScript를 주로 사용하며, 사용자 경험 개선에 관심이 많습니다.",
      aiSuggestion: "안녕하세요. 3년차 프론트엔드 개발자 김지원입니다. React 기반 대시보드 개발 경험이 있으며, 특히 렌더링 최적화로 로딩 속도를 40% 개선한 경험이 있습니다. 토스의 간편하고 직관적인 UX 철학에 공감하여 지원하게 되었습니다.",
      feedback: "강점: 간결하고 명확한 소개. 개선점: 구체적인 프로젝트 성과와 지원 동기를 추가하면 더 좋습니다"
    },
    {
      id: 2,
      question: "프론트엔드 개발 경험에 대해 말씀해주세요",
      duration: 60,
      myAnswer: "여러 프로젝트에서 React를 사용했고, 상태 관리 라이브러리도 다뤄봤습니다. 성능 최적화에도 관심이 많아서 여러 시도를 해봤습니다.",
      aiSuggestion: "가장 기억에 남는 프로젝트는 실시간 협업 도구 개발이었습니다. Redux Toolkit으로 복잡한 상태를 관리했고, React.memo와 useMemo를 활용해 불필요한 리렌더링을 80% 줄였습니다. 번들 크기도 코드 스플리팅으로 30% 감소시켰습니다.",
      feedback: "강점: 다양한 경험 언급. 개선점: 구체적인 프로젝트명, 기술 스택, 수치화된 성과를 추가해야 합니다"
    },
    {
      id: 3,
      question: "데스크톱 기반 업무 도구의 복잡도를 어떻게 해소하셨나요?",
      duration: 70,
      myAnswer: "복잡한 폼을 단순화하고, 직관적인 UI로 개선했습니다. 사용자 피드백을 반영해서 계속 개선했습니다.",
      aiSuggestion: "관리자 대시보드에서 20개 이상의 필터가 있는 복잡한 검색 폼을 재설계했습니다. 단계별 필터링과 저장된 프리셋 기능을 추가해 클릭 수를 평균 15회에서 3회로 줄였고, 사용자 만족도가 85%로 상승했습니다.",
      feedback: "강점: 문제 해결 의지. 개선점: Before/After 비교, 구체적 개선 방법, 수치화된 결과가 필요합니다"
    },
    {
      id: 4,
      question: "빌드·배포 환경 최적화 경험이 있으신가요?",
      duration: 50,
      myAnswer: "CI/CD 파이프라인을 구축해봤고, 빌드 시간을 단축시킨 경험이 있습니다.",
      aiSuggestion: "GitHub Actions로 CI/CD를 구축하고, Vite의 esbuild를 활용해 빌드 시간을 8분에서 2분으로 75% 단축했습니다. 또한 의존성 캐싱과 병렬 테스트로 전체 파이프라인 시간을 5분 이내로 줄여 개발 생산성을 크게 높였습니다.",
      feedback: "강점: 관련 경험 보유. 개선점: 구체적인 도구명, 최적화 기법, Before/After 수치가 필요합니다"
    },
    {
      id: 5,
      question: "마지막으로 하고 싶은 말씀이 있으신가요?",
      duration: 40,
      myAnswer: "토스에서 성장하고 싶습니다. 열심히 하겠습니다.",
      aiSuggestion: "토스의 '복잡한 금융을 단순하게'라는 철학에 깊이 공감합니다. 제 강점인 UX 최적화와 성능 개선 경험을 바탕으로, 사용자가 더 쉽고 빠르게 금융 서비스를 이용할 수 있도록 기여하고 싶습니다. 함께 성장할 기회를 주신다면 최선을 다하겠습니다.",
      feedback: "강점: 입사 의지 표현. 개선점: 회사 가치와의 연결, 본인 강점의 구체적 활용 방안을 언급하면 훨씬 좋습니다"
    }
  ]
};
