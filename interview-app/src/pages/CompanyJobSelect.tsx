import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Check, ChevronRight } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import styles from './CompanyJobSelect.module.css';

export function CompanyJobSelect() {
  const navigate = useNavigate();
  const { setSelectedCompany, setSelectedJob, companies } = useInterview();
  const [localCompany, setLocalCompany] = useState<string | null>(null);
  const [localJob, setLocalJob] = useState<string | null>(null);

  const selectedCompanyData = companies.find(c => c.company_id === localCompany);

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
          <div className={styles.badge}>
            <Building2 className={styles.badgeIcon} />
            <span className={styles.badgeText}>Step 1 of 4</span>
          </div>
          <h1 className={styles.title}>기업 & 직무 선택</h1>
          <p className={styles.description}>면접을 준비할 기업과 직무를 선택해 주세요</p>
        </div>

        <div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>기업 선택</h2>

            <div>
              {companies.map((company) => (
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
                    <div className={styles.companyTitle}>
                      <h3 className={styles.companyName}>{company.name}</h3>
                      {localCompany === company.company_id && (
                        <Check className={styles.checkIcon} />
                      )}
                    </div>
                  </div>
                  <p className={styles.companySummary}>{company.company_summary}</p>

                  <div className={styles.profileList}>
                    {company.talent_profile.slice(0, 2).map((profile, idx) => (
                      <div key={idx} className={styles.profileItem}>
                        <div className={styles.bullet} />
                        <p className={styles.profileText}>{profile}</p>
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedCompanyData && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>직무 선택</h2>

              <div className={styles.jobGrid}>
                {selectedCompanyData.jobs.map((job) => (
                  <button
                    key={job.job_id}
                    onClick={() => job.active && setLocalJob(job.job_id)}
                    disabled={!job.active}
                    className={`${styles.jobCard} ${
                      !job.active ? styles.disabled : localJob === job.job_id ? styles.selected : ''
                    }`}
                  >
                    <div className={styles.jobHeader}>
                      <h3 className={styles.jobTitle}>{job.title}</h3>
                      {localJob === job.job_id && <Check className={styles.checkIcon} />}
                      {!job.active && (
                        <span className={styles.disabledBadge}>준비중</span>
                      )}
                    </div>

                    <div className={styles.jobFocusPoints}>
                      {job.focus_points.map((point, idx) => (
                        <div key={idx} className={styles.focusPoint}>
                          <div className={styles.focusBullet} />
                          <p className={styles.focusText}>{point}</p>
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.navigation}>
            <button
              onClick={handleNext}
              disabled={!localCompany || !localJob}
              className={styles.nextButton}
            >
              <div className={`${styles.nextButtonBg} ${
                !(localCompany && localJob) ? styles.disabled : ''
              }`} />

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
    </div>
  );
}
