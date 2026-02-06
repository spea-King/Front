import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import styles from './InterviewSession.module.css';

export function InterviewSession() {
  const navigate = useNavigate();
  const {
    currentQuestion,
    currentQuestionIndex,
    questions,
    elapsedTime,
    voiceVolume,
    isRecording,
    selectedCompany,
    selectedJob,
    settings,
    setElapsedTime,
    setIsRecording,
    addAnswer,
    setCurrentQuestionIndex,
    setVoiceVolume
  } = useInterview();

  const [formattedTime, setFormattedTime] = useState('00:00');
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // 경과 시간 타이머
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setElapsedTime(elapsedTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording, elapsedTime, setElapsedTime]);

  // 시간 포맷팅
  useEffect(() => {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    setFormattedTime(
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    );
  }, [elapsedTime]);

  // 음성 볼륨 시뮬레이션 (실제로는 마이크 입력을 사용)
  useEffect(() => {
    if (!isRecording) return;

    const volumeInterval = setInterval(() => {
      const newVolume = Array.from({ length: 5 }, () => Math.floor(Math.random() * 80) + 20);
      setVoiceVolume(newVolume);
    }, 200);

    return () => clearInterval(volumeInterval);
  }, [isRecording, setVoiceVolume]);

  // 녹음 자동 시작
  useEffect(() => {
    if (currentQuestion && !isRecording) {
      setTimeout(() => setIsRecording(true), 1000);
    }
  }, [currentQuestion]);

  const handleFinishAnswer = () => {
    addAnswer(`답변 완료: Question ${currentQuestionIndex + 1}`);
    setIsRecording(false);

    if (isLastQuestion) {
      navigate('/interview-complete');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setElapsedTime(0);
    }
  };

  if (!currentQuestion) {
    return (
      <div className={styles.loadingScreen}>
        <p className={styles.loadingText}>질문을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        {/* 메인 비디오 영역 */}
        <div className={styles.videoSection}>
          <div className={styles.videoBackground}>
            <div className={styles.videoBackgroundInner}>
              <img
                className={styles.interviewerImage}
                src="https://gmcnqdpighpxhzpesqwf.supabase.co/storage/v1/object/public/generated-images/image-fdadce2a-0128-44f8-8992-c1b9c7d214c3.jpg"
                alt="AI Interviewer"
              />
            </div>
            <div className={styles.videoOverlay} />
          </div>

          {/* 좌측 상단 배지 */}
          <div className={styles.topLeftBadges}>
            <div className={styles.liveSessionBadge}>
              <span className={styles.liveIndicator} />
              LIVE SESSION
            </div>
            <div className={styles.companyBadge}>
              {selectedCompany?.toUpperCase() || 'TOSS'} | {selectedJob || 'Frontend Dev'}
            </div>
          </div>

          {/* 우측 상단 배지 */}
          <div className={styles.topRightBadge}>
            <div className={styles.questionCountBadge}>
              <i className={`fa-solid fa-microphone-lines ${styles.micIcon}`} />
              QUESTION {String(currentQuestionIndex + 1).padStart(2, '0')} / {String(settings.questionCount).padStart(2, '0')}
            </div>
          </div>

          {/* 하단 질문 카드 */}
          <div className={styles.questionCardArea}>
            <div className={styles.questionCard}>
              <p className={styles.questionText}>
                "{currentQuestion.question}"
              </p>
              {isRecording && (
                <div className={styles.listeningIndicator}>
                  <div className={styles.audioWave}>
                    <div className={styles.audioBar} />
                    <div className={styles.audioBar} />
                    <div className={styles.audioBar} />
                    <div className={styles.audioBar} />
                  </div>
                  <span className={styles.listeningText}>
                    AI Interviewer Listening...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 하단 컨트롤 영역 */}
        <div className={styles.controlsGrid}>
          {/* 왼쪽: 컨트롤 패널 */}
          <div className={styles.controlPanel}>
            <div className={styles.controlInfo}>
              <div className={styles.infoColumn}>
                <span className={styles.infoLabel}>Elapsed Time</span>
                <span className={styles.timerValue}>{formattedTime}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.infoColumn}>
                <span className={styles.infoLabel}>Voice Volume</span>
                <div className={styles.volumeBars}>
                  {voiceVolume.map((height, index) => (
                    <div
                      key={index}
                      className={`${styles.volumeBar} ${height > 50 ? styles.volumeBarHigh : styles.volumeBarLow}`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.finishSection}>
              <button onClick={handleFinishAnswer} className={styles.finishButton}>
                <i className="fa-solid fa-stop" />
              </button>
              <div className={styles.finishLabel}>
                <span className={styles.finishLabelText}>Finish Answer</span>
              </div>
            </div>
          </div>

          {/* 오른쪽: 가이드 패널 */}
          <div className={styles.guidePanel}>
            <h5 className={styles.guideTitle}>Interview Guide</h5>
            <ul className={styles.guideList}>
              <li className={styles.guideItem}>
                <i className={`fa-solid fa-circle-check ${styles.guideCheckIcon}`} />
                <span className={styles.guideText}>
                  STAR 기법을 활용하여 상황, 과제, 행동, 결과를 명확히 하세요.
                </span>
              </li>
              <li className={styles.guideItem}>
                <i className={`fa-solid fa-circle-check ${styles.guideCheckIcon}`} />
                <span className={styles.guideText}>
                  기술적 키워드를 적절히 섞어 전문성을 보여주세요.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
