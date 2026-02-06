import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import styles from './InterviewSession.module.css';

import interviewerManPressure from '../assets/interviewer/interviewer_man_pressure.png';
import interviewerManPeaceful from '../assets/interviewer/interviewer_man_peaceful.png';

import interviewerWomanPressure from '../assets/interviewer/interviewer_woman_pressure.png';
import interviewerWomanPeaceful from '../assets/interviewer/interviewer_woman_peaceful.png';

export function InterviewSession() {
  const navigate = useNavigate();
  const {
    currentQuestion,
    currentQuestionIndex,
    questions,
    elapsedTime,
    remainingTime,
    voiceVolume,
    isRecording,
    selectedCompany,
    selectedJob,
    settings,
    sessionId,
    setElapsedTime,
    setRemainingTime,
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
  const [timerActive, setTimerActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isLastQuestion = currentQuestionIndex === settings.questionCount - 1;
  const interviewerImage = (() => {
    if (settings.style === 'pressure') {
      return settings.voice === 'male'
        ? interviewerManPressure
        : interviewerWomanPressure;
    }
    return settings.voice === 'male'
      ? interviewerManPeaceful
      : interviewerWomanPeaceful;
  })();

  const isFinishingRef = useRef(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    if (currentQuestionIndex >= questions.length) {
      fetchNextQuestion().catch(() => undefined);
    }
  }, [currentQuestionIndex, questions.length, fetchNextQuestion]);

  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      setRemainingTime(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    const safeRemaining = Number.isFinite(remainingTime) ? remainingTime : 120;
    const minutes = Math.floor(safeRemaining / 60);
    const seconds = safeRemaining % 60;
    setFormattedTime(
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    );

    if (timerActive && safeRemaining <= 0 && !isFinishingRef.current) {
      isFinishingRef.current = true;
      handleFinishAnswer();
    }
  }, [remainingTime, timerActive]);

  useEffect(() => {
    if (!isRecording || !streamRef.current) return;

    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }
    const audioCtx = audioContextRef.current;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    if (sourceRef.current) sourceRef.current.disconnect();
    const source = audioCtx.createMediaStreamSource(streamRef.current);
    source.connect(analyser);
    sourceRef.current = source;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const volumeInterval = setInterval(() => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;

      if (average > 10) {
        const newVolume = Array.from({ length: 5 }, () => Math.floor(Math.random() * 80) + 20);
        setVoiceVolume(newVolume);
      } else {
        setVoiceVolume([5, 5, 5, 5, 5]);
      }
    }, 150);

    return () => {
      clearInterval(volumeInterval);
      if (sourceRef.current) sourceRef.current.disconnect();
    };
  }, [isRecording, setVoiceVolume]);

  useEffect(() => {
    const avg = voiceVolume.reduce((acc, cur) => acc + cur, 0) / voiceVolume.length;
    if (avg <= 5) return; 

    if (avg < 35) setSpeedLabel('느림');
    else if (avg < 60) setSpeedLabel('적정');
    else setSpeedLabel('빠름');
  }, [voiceVolume]);

  const startRecording = async () => {
    if (!currentQuestion || !sessionId) return;
    if (isRecording || isSubmitting) return;

    setElapsedTime(0);
    setRemainingTime(120);

    const beginRecording = async () => {
      try {
        if (!streamRef.current) {
          streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        }

        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        const recorder = new MediaRecorder(streamRef.current);
        chunksRef.current = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        recorderRef.current = recorder;
        recorder.start();
        setIsRecording(true);
        setTimerActive(true);
        setMicError(null);
      } catch {
        setMicError('마이크 권한이 필요합니다. 브라우저 설정에서 허용해 주세요.');
        setIsRecording(true);
        setTimerActive(true);
      }
    };

    try {
      const url = await speakQuestion(currentQuestion.id);
      if (url) {
        setIsSpeaking(true);
        if (audioRef.current) {
          audioRef.current.pause();
          URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current = new Audio(url);
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          beginRecording().catch(() => undefined);
        };
        audioRef.current.play().catch(() => {
          setIsSpeaking(false);
          beginRecording().catch(() => undefined);
        });
      } else {
        await beginRecording();
      }
      setTtsError(null);
      setShowQuestionText(false);
    } catch {
      setIsSpeaking(false);
      setTtsError('질문 음성을 불러오지 못했습니다. 텍스트를 표시합니다.');
      setShowQuestionText(true);
      await beginRecording();
    }
  };

  useEffect(() => {
    if (!currentQuestion || !sessionId) return;
    isFinishingRef.current = false;
    setIsSpeaking(true);
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
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleFinishAnswer = async () => {
    if (!currentQuestion || isSubmitting) return;
    setIsSubmitting(true);

    setIsRecording(false);
    setTimerActive(false);

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

  const safeRemaining = Number.isFinite(remainingTime) ? remainingTime : 120;
  const progressPercent = Math.max(0, Math.round((safeRemaining / 120) * 100));

  if (!currentQuestion) {
    return (
      <div className={styles.loadingScreen}>
        <p className={styles.loadingText}>질문을 불러오는 중...</p>
      </div>
    );
  }

  const statusText = isSubmitting
    ? '답변 전송 중'
    : isSpeaking
      ? '질문 재생 중'
      : isRecording
        ? '답변 녹음 중'
        : '대기 중';

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.videoSection}>
          <div className={styles.statusBanner}>{statusText}</div>
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
              {ttsError && <p className={`${styles.statusMessage} ${styles.statusError}`}>{ttsError}</p>}
              {micError && <p className={`${styles.statusMessage} ${styles.statusError}`}>{micError}</p>}
              {isRecording && (
                <div className={styles.listeningIndicator}>
                  <div className={styles.audioWave}>
                    <div className={styles.audioBar} />
                    <div className={styles.audioBar} />
                    <div className={styles.audioBar} />
                    <div className={styles.audioBar} />
                  </div>
                  <span className={styles.listeningText}>답변 녹음 중입니다</span>
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
                className={`${styles.statusButton} ${isSpeaking ? styles.statusSpeaking : isRecording ? styles.statusRecording : styles.statusIdle}`}
                disabled
              >
                {isSpeaking ? '질문 재생 중' : isRecording ? '녹음 중' : '대기 중'}
              </button>
              <button
                onClick={handleFinishAnswer}
                className={styles.finishButton}
                disabled={isSubmitting}
              >
                {isLastQuestion ? '면접 종료' : '다음 질문'}
              </button>
            </div>
          </div>

          <div className={styles.guidePanel}>
            <h5 className={styles.guideTitle}>Interview Guide</h5>
            <ul className={styles.guideList}>
              <li className={styles.guideItem}>
                <i className={`fa-solid fa-circle-check ${styles.guideCheckIcon}`} />
                <span className={styles.guideText}>STAR 기법으로 상황, 과제, 행동, 결과를 명확히 말해 주세요.</span>
              </li>
              <li className={styles.guideItem}>
                <i className={`fa-solid fa-circle-check ${styles.guideCheckIcon}`} />
                <span className={styles.guideText}>
                  {settings.style === 'pressure' ? '근거와 수치를 중심으로 짧게 답해 주세요.' : '기술적 포인트를 구체적으로 보여 주세요.'}
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
