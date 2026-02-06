import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart as BarChartIcon, Clock, TrendingUp, Home, AlertCircle, User, CheckCircle, Sparkles } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import styles from './InterviewReport.module.css';

export function InterviewReport() {
  const navigate = useNavigate();
  const { report, fetchReport } = useInterview();

  useEffect(() => {
    fetchReport().catch(() => undefined);
  }, [fetchReport]);

  if (!report) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>리포트를 불러오는 중...</h1>
            <p className={styles.subtitle}>답변을 분석하고 요약을 구성하고 있어요</p>
          </div>
          <div className={styles.loadingBlock}>
            <div className={styles.loadingSpinner} />
            <div className={styles.loadingText}>잠시만 기다려 주세요</div>
          </div>
          <div className={styles.loadingGrid}>
            <div className={styles.loadingCard}>
              <div className={styles.loadingLine} />
              <div className={styles.loadingLine} />
              <div className={styles.loadingLineShort} />
            </div>
            <div className={styles.loadingCard}>
              <div className={styles.loadingLine} />
              <div className={styles.loadingLine} />
              <div className={styles.loadingLineShort} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <CheckCircle className={styles.badgeIcon} />
            <span className={styles.badgeText}>분석 완료</span>
          </div>
          <h1 className={styles.title}>면접 리포트</h1>
          <p className={styles.subtitle}>*합격 여부와 무관한 연습용 피드백입니다</p>
        </div>

        <div className={styles.summarySection}>
          <h2 className={styles.sectionTitle}>
            <BarChartIcon className={styles.sectionIcon} />
            전체 요약
          </h2>

          <div>
            {report.summary.summary_lines.map((line, index) => (
              <p key={index} className={styles.summaryText}>
                {line}
              </p>
            ))}
          </div>

          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>평균 답변 시간</div>
              <div className={styles.summaryValue}>{Math.round(report.summary.average_seconds)}초</div>
            </div>

            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>말 속도</div>
              <div className={styles.summaryValue}>
                {report.summary.average_wpm_label} ({Math.round(report.summary.average_wpm)} WPM)
              </div>
            </div>
          </div>
        </div>

        <div className={styles.questionsSection}>
          {report.answers.map((q, idx) => (
            <div key={q.question_id} className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <div className={styles.questionTitle}>
                  <div className={styles.questionNumber}>Question {idx + 1}</div>
                  <h3 className={styles.questionText}>{q.question_text}</h3>
                </div>

                <div className={styles.scoreCircle}>
                  <div className={styles.scoreValue}>{Math.round(q.answer_seconds)}s</div>
                  <div className={styles.scoreLabel}>시간</div>
                </div>
              </div>

              <div className={styles.answerComparison}>
                <div className={`${styles.answerBlock} ${styles.myAnswer}`}>
                  <div className={`${styles.answerLabel} ${styles.my}`}>
                    <User className={styles.answerLabelIcon} />
                    내 답변
                  </div>
                  <p className={styles.answerContent}>{q.transcript || '—'}</p>
                </div>

                <div className={`${styles.answerBlock} ${styles.aiAnswer}`}>
                  <div className={`${styles.answerLabel} ${styles.ai}`}>
                    <Sparkles className={styles.answerLabelIcon} />
                    AI 답변 제안
                  </div>
                  <p className={styles.answerContent}>{q.model_answer || '—'}</p>
                </div>
              </div>

              <div className={styles.feedbackSection}>
                <div className={styles.feedbackLabel}>
                  <AlertCircle className={styles.feedbackIcon} />
                  피드백
                </div>
                <p className={styles.feedbackText}>{q.feedback || '—'}</p>
              </div>

              <div className={styles.metricsRow}>
                <div className={styles.metricItem}>
                  <Clock className={styles.metricIcon} />
                  <div className={styles.metricContent}>
                    <div className={styles.metricLabel}>답변 시간</div>
                    <div className={styles.metricValue}>{Math.round(q.answer_seconds)}초</div>
                  </div>
                </div>
                <div className={styles.metricItem}>
                  <TrendingUp className={styles.metricIcon} />
                  <div className={styles.metricContent}>
                    <div className={styles.metricLabel}>말 속도</div>
                    <div className={styles.metricValue}>{q.wpm_label}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.ctaSection}>
          <button
            onClick={() => navigate('/')}
            className={styles.retryButton}
          >
            <div className={styles.retryButtonBg} />
            <div className={styles.retryButtonShine} />
            <span className={styles.retryButtonContent}>
              <Home />
              다시 연습하기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
