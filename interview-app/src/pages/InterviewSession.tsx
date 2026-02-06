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

  const [formattedTime, setFormattedTime] = useState('00:00');
  const isLastQuestion = currentQuestionIndex === settings.questionCount - 1;
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
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
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
    if (!currentQuestion || !sessionId) return;
    isFinishingRef.current = false;
    setElapsedTime(0);

    const start = async () => {
      try {
        const url = await speakQuestion(currentQuestion.id);
        if (url) {
          if (audioRef.current) {
            audioRef.current.pause();
            URL.revokeObjectURL(audioRef.current.src);
          }
          audioRef.current = new Audio(url);
          audioRef.current.play().catch(() => undefined);
        }
      } catch {
        // ignore
      }

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
      } catch {
        setIsRecording(true);
      }
    };

    start();

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

          <div className={styles.topLeftBadges}>
            <div className={styles.liveSessionBadge}>
              <span className={styles.liveIndicator} />
              LIVE SESSION
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
              <p className={styles.questionText}>"질문은 음성으로 제공됩니다."</p>
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

        <div className={styles.controlsGrid}>
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
                  기술적 포인트를 구체적으로 보여 주세요.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
