import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import styles from './Landing.module.css';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className={styles.landing}>
      {/* Animated background elements */}
      <div className={styles.backgroundEffect}>
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />
      </div>

      <div className={styles.container}>
        {/* Logo/Icon */}
        <div className={styles.iconWrapper}>
          <div className={styles.iconGlow} />
          <div className={styles.iconBox}>
            <Sparkles className={styles.icon} />
          </div>
        </div>

        {/* Title with staggered animation */}
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            <span className={`${styles.titleWord} ${styles.titleWord1}`}>
              실전
            </span>{' '}
            <span className={`${styles.titleWord} ${styles.titleWord2}`}>
              면접
            </span>{' '}
            <span className={`${styles.titleWord} ${styles.titleWord3}`}>
              연습
            </span>
          </h1>

          <p className={styles.subtitle}>
            답을 알려주는 AI가 아니라
            <br />
            <span className={styles.highlight}>말하는 연습</span>을 돕습니다
          </p>
        </div>

        {/* CTA Button */}
        <div className={styles.ctaSection}>
          <button
            onClick={() => navigate('/company-job')}
            className={styles.ctaButton}
          >
            <div className={styles.ctaButtonBg} />
            <div className={styles.ctaButtonShine} />
            <span className={styles.ctaButtonContent}>
              면접 연습 시작
              <Sparkles />
            </span>
          </button>
        </div>

        {/* Subtitle */}
        <p className={styles.note}>
          120초 안에 완벽한 답변을 만들어보세요
        </p>
      </div>
    </div>
  );
}
