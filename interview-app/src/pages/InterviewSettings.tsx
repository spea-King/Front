import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ChevronRight, User, Volume2, ChevronLeft, CheckCircle } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import type { InterviewSettings as SettingsType } from '../types';
import styles from './InterviewSettings.module.css';

export function InterviewSettings() {
  const navigate = useNavigate();
  const { setSettings } = useInterview();
  const [localSettings, setLocalSettings] = useState<SettingsType>({
    questionCount: 5,
    voice: 'female',
    style: 'friendly'
  });

  const handleStart = () => {
    setSettings(localSettings);
    navigate('/interview');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <Settings className={styles.badgeIcon} />
            <span className={styles.badgeText}>
              Step 3 of 4
            </span>
          </div>
          <h1 className={styles.title}>
            면접 설정
          </h1>
          <p className={styles.description}>
            면접 환경을 설정해주세요
          </p>
        </div>

        <div>
          {/* Question Count */}
          <div className={styles.settingsSection}>
            <div className={styles.settingGroup}>
              <div className={styles.settingLabel}>
                <User className={styles.settingIcon} />
                면접 질문 수
              </div>
              <p className={styles.settingDescription}>받고 싶은 질문의 개수를 선택하세요</p>

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

            {/* Voice Selection */}
            <div className={styles.settingGroup}>
              <div className={styles.settingLabel}>
                <Volume2 className={styles.settingIcon} />
                면접관 목소리
              </div>
              <p className={styles.settingDescription}>선호하는 음성을 선택하세요</p>

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
                  <p className={styles.choiceDescription}>부드럽고 친근한</p>
                </button>
              </div>
            </div>

            {/* Interview Style */}
            <div className={styles.settingGroup}>
              <div className={styles.settingLabel}>
                <Settings className={styles.settingIcon} />
                면접 스타일
              </div>
              <p className={styles.settingDescription}>연습하고 싶은 면접 분위기를 선택하세요</p>

              <div className={styles.choiceGrid}>
                <button
                  onClick={() => setLocalSettings(prev => ({ ...prev, style: 'friendly' }))}
                  className={`${styles.choiceCard} ${
                    localSettings.style === 'friendly' ? styles.selected : ''
                  }`}
                >
                  <span className={styles.choiceEmoji}>😊</span>
                  <div className={styles.choiceName}>친절한</div>
                  <p className={styles.choiceDescription}>
                    격려하고 편안한 분위기로 진행됩니다
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
                    긴장감 있는 실전과 유사한 분위기로 진행됩니다
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Summary */}
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
                <div className={styles.summaryItemLabel}>면접관 음성</div>
                <div className={styles.summaryItemValue}>
                  {localSettings.voice === 'male' ? '남성' : '여성'}
                </div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemLabel}>면접 스타일</div>
                <div className={styles.summaryItemValue}>
                  {localSettings.style === 'friendly' ? '친절한' : '압박'}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
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
            >
              <div className={styles.startButtonBg} />
              <div className={styles.startButtonShine} />
              <span className={styles.startButtonContent}>
                면접 시작
                <ChevronRight />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
