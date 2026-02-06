import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, MessageSquare, Target } from 'lucide-react';
import styles from './InterviewComplete.module.css';

export function InterviewComplete() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: MessageSquare, text: '답변 구조 분석 중...' },
    { icon: TrendingUp, text: '언어 패턴 분석 중...' },
    { icon: Target, text: '개선 포인트 도출 중...' },
    { icon: Sparkles, text: '피드백 생성 중...' }
  ];

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    // Step animation
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    // Navigate to report after completion
    const completeTimeout = setTimeout(() => {
      navigate('/report');
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(completeTimeout);
    };
  }, [navigate]);

  return (
    <div className={styles.page}>
      {/* Animated background particles */}
      <div className={styles.backgroundEffect}>
        <div className={`${styles.gradientOrb} ${styles.orb1}`} />
        <div className={`${styles.gradientOrb} ${styles.orb2}`} />
      </div>

      <div className={styles.content}>
        {/* Icon Animation */}
        <div className={styles.iconWrapper}>
          <div className={styles.pulseRing} />
          <div className={styles.pulseRing2} />
          <div className={styles.pulseRing3} />
          <div className={styles.iconBox}>
            <Sparkles className={styles.icon} />
          </div>
        </div>

        {/* Title */}
        <h1 className={styles.title}>
          면접이 종료되었습니다
        </h1>

        {/* Current Step */}
        <p className={styles.statusText}>{steps[currentStep].text}</p>

        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}>
              <div className={styles.progressShimmer} />
            </div>
          </div>

          <div className={styles.progressText}>{progress}%</div>
        </div>

        {/* Steps Indicator */}
        <div className={styles.stepsList}>
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div
                key={index}
                className={`${styles.stepItem} ${
                  index === currentStep ? styles.active : ''
                }`}
              >
                <StepIcon className={styles.stepIcon} />
                <span className={styles.stepText}>{step.text}</span>
              </div>
            );
          })}
        </div>

        {/* Completion Message */}
        {progress === 100 && (
          <p className={styles.note}>
            잠시 후 리포트 페이지로 이동합니다...
          </p>
        )}
      </div>
    </div>
  );
}
