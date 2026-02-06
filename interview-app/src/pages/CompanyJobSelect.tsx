import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ChevronRight } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import styles from './CompanyJobSelect.module.css';

export function CompanyJobSelect() {
  const navigate = useNavigate();
  const { setSelectedCompany, setSelectedJob, companies } = useInterview();
  const [localCompany, setLocalCompany] = useState<string | null>(null);
  const [localJob, setLocalJob] = useState<string | null>(null);

  const selectedCompanyData = companies.find(
    c => c.company_id === localCompany,
  );

  const handleNext = () => {
    if (localCompany && localJob) {
      setSelectedCompany(localCompany);
      setSelectedJob(localJob);
      navigate('/resume-upload');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.title}>목표 기업 선택</h1>
              <p className={styles.description}>
                입력한 <span className={styles.highlight}>기업 정보</span>와
                <span className={styles.highlight}> 직무 포인트</span>를 바탕으로
                질문을 <span className={styles.highlightStrong}>개인화</span>합니다.
              </p>
              <p className={styles.subDescription}>
                인재상·컬처핏·직무 키워드를 함께 반영해 실제 면접처럼 묻습니다.
              </p>
            </div>
            <div className={styles.navButtons}>
              <button className={styles.navButton}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button className={styles.navButton}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.companySection}>
          <div className={styles.companyGrid}>
            {companies.map(company => (
              <button
                key={company.company_id}
                onClick={() => {
                  setLocalCompany(company.company_id);
                  setLocalJob(null);
                }}
                className={`${styles.companyCard} ${
                  localCompany === company.company_id ? styles.selected : ''
                }`}
              >
                <div className={styles.companyHeader}>
                  <div className={styles.companyIcon}>
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className={styles.companyLogo}
                      />
                    ) : (
                      <Building2 size={32} />
                    )}
                  </div>
                  {localCompany === company.company_id && (
                    <div className={styles.selectedBadge}>SELECTED</div>
                  )}
                </div>
                <h3 className={styles.companyName}>{company.name}</h3>
                <p className={styles.companySummary}>
                  {company.company_summary}
                </p>

                {localCompany === company.company_id ? (
                  <div className={styles.coreValuesSection}>
                    <span className={styles.coreValuesLabel}>Core Values</span>
                    <div className={styles.coreValuesTags}>
                      {company.talent_profile
                        .slice(0, 3)
                        .map((profile, idx) => (
                          <span key={idx} className={styles.coreValueTag}>
                            {profile}
                          </span>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className={styles.placeholderBars}>
                    <div
                      className={styles.placeholderBar}
                      style={{ width: '100%' }}
                    />
                    <div
                      className={styles.placeholderBar}
                      style={{ width: '66.67%' }}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>

          {selectedCompanyData && (
            <div className={styles.jobSection}>
              <div className={styles.jobSectionHeader}>
                <h2 className={styles.sectionTitle}>지원 직무</h2>
                <span className={styles.availableBadge}>
                  {selectedCompanyData.jobs.filter(j => j.active).length}{' '}
                  AVAILABLE
                </span>
              </div>

              <div className={styles.jobGrid}>
                {selectedCompanyData.jobs.map(job => (
                  <button
                    key={job.job_id}
                    onClick={() => job.active && setLocalJob(job.job_id)}
                    disabled={!job.active}
                    className={`${styles.jobCard} ${
                      !job.active
                        ? styles.disabled
                        : localJob === job.job_id
                          ? styles.selected
                          : ''
                    }`}
                  >
                    <div className={styles.jobContent}>
                      <h3 className={styles.jobTitle}>{job.title}</h3>
                      <p className={styles.jobDescription}>
                        {job.focus_points[0] || job.title}
                      </p>
                    </div>
                    <div className={styles.jobIconBackground}>
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.navigation}>
          <button
            onClick={handleNext}
            disabled={!localCompany || !localJob}
            className={styles.nextButton}
          >
            <div
              className={`${styles.nextButtonBg} ${
                !(localCompany && localJob) ? styles.disabled : ''
              }`}
            />

            {localCompany && localJob && (
              <div className={styles.nextButtonShine} />
            )}

            <span className={styles.nextButtonContent}>
              다음
              <ChevronRight />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
