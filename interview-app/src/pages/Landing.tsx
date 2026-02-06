import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import styles from './Landing.module.css';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className={styles.landing}>
      <div className={styles.backgroundEffect}>
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />
      </div>

      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <div className={styles.iconGlow} />
          <div className={styles.iconBox}>
            <Sparkles className={styles.icon} />
          </div>
        </div>

        <div className={styles.titleSection}>
          <h1 className={styles.brandTitle}>
            spe
            <span className={styles.brandAccentA}>a</span>
            [K
            <span className={styles.brandAccentI}>i</span>
            ng]
            <span className={styles.brandSubtitle}>: <span className={styles.glassTag}>면접왕</span></span>
          </h1>
          <p className={styles.subtitle}>
            <span className={styles.highlight}>기업·지원자 데이터</span>를 반영한
            <br />
            <span className={styles.highlight}>맞춤형 AI 질문</span>으로
            <span className={styles.highlight}> 실전 면접</span>을 연습하세요.
          </p>
        </div>

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

        <p className={styles.note}>
          실전과 같은 긴장감으로 2분 답변을 훈련해 보세요
        </p>
      </div>
    </div>
  );
}
