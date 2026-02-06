import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ChevronRight, User, Volume2, ChevronLeft, CheckCircle } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import type { InterviewSettings as SettingsType } from '../types';
import styles from './InterviewSettings.module.css';

const encouragements = [
  (name: string) => `면접이 곧 시작됩니다. ${name}님, 준비한 만큼 충분히 잘하실 수 있어요.`,
  (name: string) => `좋습니다 ${name}님. 긴장 풀고, 한 질문씩 차분히 넘어가면 됩니다.`,
  (name: string) => `${name}님, 지금까지의 노력이 답변에 드러날 거예요. 자신 있게 시작하세요.`
];

const extractName = (text?: string | null) => {
  if (!text) return null;
  const patterns = [/이름\s*[:：]?\s*([가-힣]{2,4})/, /성명\s*[:：]?\s*([가-힣]{2,4})/];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
};

export function InterviewSettings() {
  const navigate = useNavigate();
  const { setSettings, startSession, selectedCompany, selectedJob, resumeText, selfIntroText } = useInterview();
  const [localSettings, setLocalSettings] = useState<SettingsType>({
    questionCount: 5,
    voice: 'female',
    style: 'friendly'
  });
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    if (!selectedCompany || !selectedJob) {
      setError('기업/직무 선택이 필요합니다.');
      navigate('/company-job');
      return;
    }
    setSettings(localSettings);
    setIsStarting(true);
    try {
      await startSession(localSettings);
      navigate('/interview');
    } finally {
      setIsStarting(false);
    }
  };

  const candidateName = extractName(resumeText) || extractName(selfIntroText) || '지원자';
  const message = encouragements[(candidateName.length + localSettings.questionCount) % encouragements.length](candidateName);

  return (
    <div className={styles.page}>
      {isStarting && (
        <div className={styles.startOverlay}>
          <div className={styles.startCard}>
            <div className={styles.startPulse} />
            <div className={styles.startBadge}>
              <span className={styles.startClover}>🍀</span>
              <span className={styles.startBadgeText}>행운을 빌어요</span>
            </div>
            <p className={styles.startTitle}>면접 준비 중</p>
            <p className={styles.startMessage}>{message}</p>
          </div>
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <Settings className={styles.badgeIcon} />
            <span className={styles.badgeText}>Step 3 of 4</span>
          </div>
          <h1 className={styles.title}>면접 설정</h1>
          <p className={styles.description}>면접 환경을 설정해 주세요</p>
        </div>

        <div>
          {error && (
            <div className={styles.errorNotice}>{error}</div>
          )}
          <div className={styles.settingsSection}>
            <div className={styles.settingGroup}>
              <div className={styles.settingLabel}>
                <User className={styles.settingIcon} />
                면접 질문 수
              </div>
              <p className={styles.settingDescription}>받고 싶은 질문의 개수를 선택해 주세요</p>

              <div className={styles.sliderContainer}>
                <div className={styles.sliderValue}>{localSettings.questionCount}개</div>

                <input
                  type="range"
                  min="5"
                  max="10"
                  value={localSettings.questionCount}
                  onChange={(e) => setLocalSettings(prev => ({
                    ...prev,
                    questionCount: parseInt(e.target.value)
                  }))}
                  className={styles.slider}
                />

                <div className={styles.sliderLabels}>
                  <span>5개</span>
                  <span>10개</span>
                </div>
              </div>
            </div>

            <div className={styles.settingGroup}>
              <div className={styles.settingLabel}>
                <Volume2 className={styles.settingIcon} />
                면접관 목소리
              </div>
              <p className={styles.settingDescription}>선호하는 목소리를 선택해 주세요</p>

              <div className={styles.choiceGrid}>
                <button
                  onClick={() => setLocalSettings(prev => ({ ...prev, voice: 'male' }))}
                  className={`${styles.choiceCard} ${
                    localSettings.voice === 'male' ? styles.selected : ''
                  }`}
                >
                  <span className={styles.choiceEmoji}>🧑</span>
                  <div className={styles.choiceName}>남성</div>
                  <p className={styles.choiceDescription}>차분하고 안정적인</p>
                </button>

                <button
                  onClick={() => setLocalSettings(prev => ({ ...prev, voice: 'female' }))}
                  className={`${styles.choiceCard} ${
                    localSettings.voice === 'female' ? styles.selected : ''
                  }`}
                >
                  <span className={styles.choiceEmoji}>👩</span>
                  <div className={styles.choiceName}>여성</div>
                  <p className={styles.choiceDescription}>부드럽고 친절한</p>
                </button>
              </div>
            </div>

            <div className={styles.settingGroup}>
              <div className={styles.settingLabel}>
                <Settings className={styles.settingIcon} />
                면접 스타일
              </div>
              <p className={styles.settingDescription}>연습할 면접 분위기를 선택해 주세요</p>

              <div className={styles.choiceGrid}>
                <button
                  onClick={() => setLocalSettings(prev => ({ ...prev, style: 'friendly' }))}
                  className={`${styles.choiceCard} ${
                    localSettings.style === 'friendly' ? styles.selected : ''
                  }`}
                >
                  <span className={styles.choiceEmoji}>😊</span>
                  <div className={styles.choiceName}>친절</div>
                  <p className={styles.choiceDescription}>
                    격려하고 편안한 분위기
                  </p>
                </button>

                <button
                  onClick={() => setLocalSettings(prev => ({ ...prev, style: 'pressure' }))}
                  className={`${styles.choiceCard} ${
                    localSettings.style === 'pressure' ? styles.selected : ''
                  }`}
                >
                  <span className={styles.choiceEmoji}>😐</span>
                  <div className={styles.choiceName}>압박</div>
                  <p className={styles.choiceDescription}>
                    긴장감 있는 실전 분위기
                  </p>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.summarySection}>
            <div className={styles.summaryTitle}>
              <CheckCircle className={styles.summaryIcon} />
              설정 요약
            </div>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemLabel}>질문 개수</div>
                <div className={styles.summaryItemValue}>{localSettings.questionCount}개</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemLabel}>면접관 목소리</div>
                <div className={styles.summaryItemValue}>
                  {localSettings.voice === 'male' ? '남성' : '여성'}
                </div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemLabel}>면접 스타일</div>
                <div className={styles.summaryItemValue}>
                  {localSettings.style === 'friendly' ? '친절' : '압박'}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.navigation}>
            <button
              onClick={() => navigate('/resume-upload')}
              className={styles.backButton}
            >
              <ChevronLeft />
              이전
            </button>

            <button
              onClick={handleStart}
              className={styles.startButton}
              disabled={isStarting}
            >
              <div className={styles.startButtonBg} />
              <div className={styles.startButtonShine} />
              <span className={styles.startButtonContent}>
                {isStarting ? '시작 중...' : '면접 시작'}
                <ChevronRight />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
