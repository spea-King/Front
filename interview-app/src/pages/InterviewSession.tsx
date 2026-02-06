import { useEffect, useRef, useState } from 'react';
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
    sessionId,
    setElapsedTime,
    setIsRecording,
    setCurrentQuestionIndex,
    setVoiceVolume,
    fetchNextQuestion,
    submitAnswerTime,
    submitAnswerAudio,
    speakQuestion
  } = useInterview();

  const [formattedTime, setFormattedTime] = useState('02:00');
  const [micError, setMicError] = useState<string | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [showQuestionText, setShowQuestionText] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [speedLabel, setSpeedLabel] = useState<'느림' | '적정' | '빠름'>('적정');

  const isLastQuestion = currentQuestionIndex === settings.questionCount - 1;
  const interviewerImage =
    settings.voice === 'male'
      ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80'
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80';
  const isFinishingRef = useRef(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (currentQuestionIndex >= questions.length) {
      fetchNextQuestion().catch(() => undefined);
    }
  }, [currentQuestionIndex, questions.length, fetchNextQuestion]);

  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording, setElapsedTime]);

  useEffect(() => {
    const remaining = Math.max(0, 120 - elapsedTime);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    setFormattedTime(
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    );

    if (isRecording && elapsedTime >= 120 && !isFinishingRef.current) {
      isFinishingRef.current = true;
      handleFinishAnswer();
    }
  }, [elapsedTime, isRecording]);

  useEffect(() => {
    if (!isRecording) return;

    const volumeInterval = setInterval(() => {
      const newVolume = Array.from({ length: 5 }, () => Math.floor(Math.random() * 80) + 20);
      setVoiceVolume(newVolume);
    }, 200);

    return () => clearInterval(volumeInterval);
  }, [isRecording, setVoiceVolume]);

  useEffect(() => {
    const avg = voiceVolume.reduce((acc, cur) => acc + cur, 0) / voiceVolume.length;
    if (avg < 35) setSpeedLabel('느림');
    else if (avg < 60) setSpeedLabel('적정');
    else setSpeedLabel('빠름');
  }, [voiceVolume]);

  const startRecording = async () => {
    if (!currentQuestion || !sessionId) return;
    if (isRecording || isSubmitting) return;

    setElapsedTime(0);

    const beginRecording = async () => {
      try {
        if (!streamRef.current) {
          streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        const recorder = new MediaRecorder(streamRef.current);
        chunksRef.current = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        recorderRef.current = recorder;
        recorder.start();
        setIsRecording(true);
        setMicError(null);
      } catch {
        setMicError('마이크 권한이 필요합니다. 브라우저 설정에서 허용해 주세요.');
        setIsRecording(true);
      }
    };

    try {
      const url = await speakQuestion(currentQuestion.id);
      if (url) {
        if (audioRef.current) {
          audioRef.current.pause();
          URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current = new Audio(url);
        audioRef.current.onended = () => {
          beginRecording().catch(() => undefined);
        };
        audioRef.current.play().catch(() => undefined);
      }
      setTtsError(null);
      setShowQuestionText(false);
    } catch {
      setTtsError('질문 음성을 불러오지 못했습니다. 텍스트를 표시합니다.');
      setShowQuestionText(true);
      await beginRecording();
    }
  };

  useEffect(() => {
    if (!currentQuestion || !sessionId) return;
    isFinishingRef.current = false;
    setElapsedTime(0);

    startRecording();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, [currentQuestion?.id]);

  useEffect(() => {
    return () => {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFinishAnswer = async () => {
    if (!currentQuestion) return;
    if (isSubmitting) return;
    setIsSubmitting(true);

    setIsRecording(false);

    const seconds = Math.min(elapsedTime, 120);

    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      await new Promise<void>((resolve) => {
        recorder.onstop = async () => {
          try {
            const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
            if (blob.size > 0) {
              await submitAnswerAudio(currentQuestion.id, seconds, blob);
            } else {
              await submitAnswerTime(currentQuestion.id, seconds);
            }
          } catch {
            await submitAnswerTime(currentQuestion.id, seconds);
          }
          resolve();
        };
        recorder.stop();
      });
    } else {
      await submitAnswerTime(currentQuestion.id, seconds);
    }

    if (isLastQuestion) {
      navigate('/interview-complete');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setElapsedTime(0);
      isFinishingRef.current = false;
    }
    setIsSubmitting(false);
  };

  const progressPercent = Math.max(0, Math.round(((120 - elapsedTime) / 120) * 100));

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
        <div className={styles.videoSection}>
          <div className={styles.videoBackground}>
            <div className={styles.videoBackgroundInner}>
              <img
                className={styles.interviewerImage}
                src={interviewerImage}
                alt="AI Interviewer"
              />
            </div>
            <div className={styles.videoOverlay} />
          </div>

          <div className={styles.topLeftBadges}>
            <div className={styles.liveSessionBadge}>
              <span className={styles.liveIndicator} />
              LIVE SESSION
            </div>
            <div className={`${styles.styleBadge} ${settings.style === 'pressure' ? styles.stylePressure : styles.styleFriendly}`}>
              {settings.style === 'pressure' ? '압박 면접' : '친절 면접'}
            </div>
            <div className={styles.companyBadge}>
              {selectedCompany?.toUpperCase() || 'TOSS'} | {selectedJob || 'Frontend Dev'}
            </div>
          </div>

          <div className={styles.topRightBadge}>
            <div className={styles.questionCountBadge}>
              <i className={`fa-solid fa-microphone-lines ${styles.micIcon}`} />
              QUESTION {String(currentQuestionIndex + 1).padStart(2, '0')} / {String(settings.questionCount).padStart(2, '0')}
            </div>
          </div>

          <div className={styles.questionCardArea}>
            <div className={styles.questionCard}>
              <p className={styles.questionText}>
                {showQuestionText ? `"${currentQuestion.text}"` : '"질문은 음성으로 제공됩니다."'}
              </p>
              {ttsError && (
                <p className={`${styles.statusMessage} ${styles.statusError}`}>{ttsError}</p>
              )}
              {micError && (
                <p className={`${styles.statusMessage} ${styles.statusError}`}>{micError}</p>
              )}
              {isRecording && (
                <div className={styles.listeningIndicator}>
                  <div className={styles.audioWave}>
                    <div className={styles.audioBar} />
                    <div className={styles.audioBar} />
                    <div className={styles.audioBar} />
                    <div className={styles.audioBar} />
                  </div>
                  <span className={styles.listeningText}>
                    답변 녹음 중입니다
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.controlsGrid}>
          <div className={styles.controlPanel}>
            <div className={styles.controlInfo}>
              <div className={styles.infoColumn}>
                <span className={styles.infoLabel}>남은 시간</span>
                <span className={styles.timerValue}>{formattedTime}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.infoColumn}>
                <span className={styles.infoLabel}>Progress</span>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
                </div>
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
              <button
                onClick={startRecording}
                className={styles.startButton}
                disabled={isRecording || isSubmitting}
              >
                <i className="fa-solid fa-play" />
              </button>
              <button
                onClick={handleFinishAnswer}
                className={styles.finishButton}
                disabled={isSubmitting}
              >
                <i className="fa-solid fa-stop" />
              </button>
              <div className={styles.finishLabel}>
                <span className={styles.finishLabelText}>
                  {isSubmitting ? '전송 중...' : 'Start / Finish'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.guidePanel}>
            <h5 className={styles.guideTitle}>Interview Guide</h5>
            <ul className={styles.guideList}>
              <li className={styles.guideItem}>
                <i className={`fa-solid fa-circle-check ${styles.guideCheckIcon}`} />
                <span className={styles.guideText}>
                  STAR 기법으로 상황, 과제, 행동, 결과를 명확히 말해 주세요.
                </span>
              </li>
              <li className={styles.guideItem}>
                <i className={`fa-solid fa-circle-check ${styles.guideCheckIcon}`} />
                <span className={styles.guideText}>
                  {settings.style === 'pressure'
                    ? '근거와 수치를 중심으로 짧게 답해 주세요.'
                    : '기술적 포인트를 구체적으로 보여 주세요.'}
                </span>
              </li>
            </ul>

            <div className={styles.speedPanel}>
              <span className={styles.speedTitle}>말 속도</span>
              <div className={styles.speedLights}>
                <div className={`${styles.speedLight} ${speedLabel === '빠름' ? styles.speedOnFast : ''}`} />
                <div className={`${styles.speedLight} ${speedLabel === '적정' ? styles.speedOnNormal : ''}`} />
                <div className={`${styles.speedLight} ${speedLabel === '느림' ? styles.speedOnSlow : ''}`} />
              </div>
              <div className={styles.speedLabels}>
                <span>빠름</span>
                <span>적정</span>
                <span>느림</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
