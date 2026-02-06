import { useNavigate } from 'react-router-dom';
import { BarChart as BarChartIcon, Clock, TrendingUp, Home, AlertCircle, User, CheckCircle, Sparkles } from 'lucide-react';
import { mockReport } from '../data/mockData';
import styles from './InterviewReport.module.css';

export function InterviewReport() {
  const navigate = useNavigate();
  const report = mockReport;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <CheckCircle className={styles.badgeIcon} />
            <span className={styles.badgeText}>
              분석 완료
            </span>
          </div>
          <h1 className={styles.title}>
            면접 리포트
          </h1>
          <p className={styles.subtitle}>
            *합격 여부와 무관한 연습용 피드백입니다
          </p>
        </div>

        {/* Summary Section */}
        <div className={styles.summarySection}>
          <h2 className={styles.sectionTitle}>
            <BarChartIcon className={styles.sectionIcon} />
            전체 요약
          </h2>

          {/* Three Line Summary */}
          <div>
            {report.summary.threeLineSummary.map((line, index) => (
              <p key={index} className={styles.summaryText}>
                {line}
              </p>
            ))}
          </div>

          {/* Stats Grid */}
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>평균 답변 시간</div>
              <div className={styles.summaryValue}>{report.summary.averageTime}초</div>
            </div>

            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>말 속도</div>
              <div className={styles.summaryValue}>{report.summary.speakingSpeed}</div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis Section */}
        <div className={styles.questionsSection}>
          {report.questions.map((q) => (
            <div key={q.id} className={styles.questionCard}>
              {/* Question Header */}
              <div className={styles.questionHeader}>
                <div className={styles.questionTitle}>
                  <div className={styles.questionNumber}>Question {q.id}</div>
                  <h3 className={styles.questionText}>{q.question}</h3>
                </div>

                <div className={styles.scoreCircle}>
                  <div className={styles.scoreValue}>{q.duration}s</div>
                  <div className={styles.scoreLabel}>시간</div>
                </div>
              </div>

              {/* Answers Grid */}
              <div className={styles.answerComparison}>
                {/* My Answer */}
                <div className={`${styles.answerBlock} ${styles.myAnswer}`}>
                  <div className={`${styles.answerLabel} ${styles.my}`}>
                    <User className={styles.answerLabelIcon} />
                    내 답변
                  </div>
                  <p className={styles.answerContent}>{q.myAnswer}</p>
                </div>

                {/* AI Suggestion */}
                <div className={`${styles.answerBlock} ${styles.aiAnswer}`}>
                  <div className={`${styles.answerLabel} ${styles.ai}`}>
                    <Sparkles className={styles.answerLabelIcon} />
                    AI 답변 제안
                  </div>
                  <p className={styles.answerContent}>{q.aiSuggestion}</p>
                </div>
              </div>

              {/* Feedback */}
              <div className={styles.feedbackSection}>
                <div className={styles.feedbackLabel}>
                  <AlertCircle className={styles.feedbackIcon} />
                  피드백
                </div>
                <p className={styles.feedbackText}>{q.feedback}</p>
              </div>

              {/* Metrics */}
              <div className={styles.metricsRow}>
                <div className={styles.metricItem}>
                  <Clock className={styles.metricIcon} />
                  <div className={styles.metricContent}>
                    <div className={styles.metricLabel}>답변 시간</div>
                    <div className={styles.metricValue}>{q.duration}초</div>
                  </div>
                </div>
                <div className={styles.metricItem}>
                  <TrendingUp className={styles.metricIcon} />
                  <div className={styles.metricContent}>
                    <div className={styles.metricLabel}>진행도</div>
                    <div className={styles.metricValue}>{Math.round((q.duration / 120) * 100)}%</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
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
