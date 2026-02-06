import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, X, Shield, FileSignature, IdCard } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import styles from './ResumeUpload.module.css';

type FileType = 'portfolio' | 'resume';

export function ResumeUpload() {
  const navigate = useNavigate();
  const { setResumeFile, setResumeText, setSelfIntroText, parseDoc } = useInterview();
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [localResumeFile, setLocalResumeFile] = useState<File | null>(null);
  const [isDraggingPortfolio, setIsDraggingPortfolio] = useState(false);
  const [isDraggingResume, setIsDraggingResume] = useState(false);
  const [portfolioError, setPortfolioError] = useState<string>('');
  const [resumeError, setResumeError] = useState<string>('');
  const [isParsing, setIsParsing] = useState(false);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const MAX_PORTFOLIO_SIZE = 20 * 1024 * 1024; // 20MB
  const MAX_RESUME_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File, type: FileType): boolean => {
    const maxSize = type === 'portfolio' ? MAX_PORTFOLIO_SIZE : MAX_RESUME_SIZE;
    const setError = type === 'portfolio' ? setPortfolioError : setResumeError;

    setError('');

    if (file.type !== 'application/pdf') {
      setError('PDF 파일만 업로드 가능합니다');
      return false;
    }

    if (file.size > maxSize) {
      const maxSizeMB = type === 'portfolio' ? 20 : 10;
      setError(`파일 크기는 ${maxSizeMB}MB 이하이어야 합니다`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File, type: FileType) => {
    if (validateFile(file, type)) {
      if (type === 'portfolio') {
        setPortfolioFile(file);
        setPortfolioError('');
      } else {
        setLocalResumeFile(file);
        setResumeError('');
      }
    }
  };

  const handleDrop = (e: React.DragEvent, type: FileType) => {
    e.preventDefault();
    if (type === 'portfolio') {
      setIsDraggingPortfolio(false);
    } else {
      setIsDraggingResume(false);
    }

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file, type);
    }
  };

  const handleDragOver = (e: React.DragEvent, type: FileType) => {
    e.preventDefault();
    if (type === 'portfolio') {
      setIsDraggingPortfolio(true);
    } else {
      setIsDraggingResume(true);
    }
  };

  const handleDragLeave = (type: FileType) => {
    if (type === 'portfolio') {
      setIsDraggingPortfolio(false);
    } else {
      setIsDraggingResume(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: FileType) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file, type);
    }
  };

  const handleRemoveFile = (type: FileType) => {
    if (type === 'portfolio') {
      setPortfolioFile(null);
      setPortfolioError('');
      if (portfolioInputRef.current) {
        portfolioInputRef.current.value = '';
      }
    } else {
      setLocalResumeFile(null);
      setResumeError('');
      if (resumeInputRef.current) {
        resumeInputRef.current.value = '';
      }
    }
  };

  const handleNext = async () => {
    if (!localResumeFile && !portfolioFile) return;

    setIsParsing(true);
    try {
      if (localResumeFile) {
        const text = await parseDoc(localResumeFile);
        setResumeText(text);
        setResumeFile(localResumeFile);
      }
      if (portfolioFile) {
        const text = await parseDoc(portfolioFile);
        setSelfIntroText(text);
      }
      navigate('/interview-settings');
    } finally {
      setIsParsing(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderUploadArea = (
    type: FileType,
    file: File | null,
    isDragging: boolean,
    error: string,
    inputRef: React.RefObject<HTMLInputElement>,
    icon: React.ReactNode,
    title: string,
    description: string
  ) => (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={(e) => handleFileInputChange(e, type)}
        className="hidden"
      />

      <div
        onDrop={(e) => handleDrop(e, type)}
        onDragOver={(e) => handleDragOver(e, type)}
        onDragLeave={() => handleDragLeave(type)}
        onClick={() => !file && inputRef.current?.click()}
        className={`${styles.dropzone} ${
          isDragging ? styles.dragActive : error ? styles.error : ''
        }`}
      >
        {!file ? (
          <>
            <div className={styles.uploadIconWrapper}>
              {icon}
            </div>
            <div className={styles.uploadContent}>
              <h3 className={styles.uploadTitle}>{title}</h3>
              <p className={styles.uploadDescription}>{description}</p>
            </div>
            <button className={styles.browseButton}>
              파일 업로드
            </button>
          </>
        ) : (
          <div className={styles.filePreview}>
            <FileText className={styles.fileIcon} />
            <div className={styles.fileInfo}>
              <p className={styles.fileName}>{file.name}</p>
              <p className={styles.fileSize}>{formatFileSize(file.size)}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile(type);
              }}
              className={styles.removeButton}
            >
              <X />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <X className={styles.errorIcon} />
          {error}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <FileText className={styles.badgeIcon} />
            <span className={styles.badgeText}>Step 2 of 4</span>
          </div>
          <h1 className={styles.title}>지원자 정보 입력</h1>
          <p className={styles.description}>
            이력서/자소서를 분석해 맞춤 질문을 생성합니다.
          </p>
        </div>

        <div>
          <div className={styles.uploadSection}>
            {renderUploadArea(
              'portfolio',
              portfolioFile,
              isDraggingPortfolio,
              portfolioError,
              portfolioInputRef,
              <FileSignature className={styles.coverLetterIcon} />,
              '자소서',
              'PDF, 최대 20MB'
            )}

            {renderUploadArea(
              'resume',
              localResumeFile,
              isDraggingResume,
              resumeError,
              resumeInputRef,
              <IdCard className={styles.resumeIcon} />,
              '이력서',
              'PDF, 최대 10MB'
            )}
          </div>

          <div className={styles.securityNote}>
            <Shield className={styles.securityIcon} />
            <span>개인정보는 저장되지 않으며 분석 후 즉시 폐기됩니다.</span>
          </div>

          <div className={styles.navigation}>
            <button
              onClick={handleNext}
              disabled={(!localResumeFile && !portfolioFile) || isParsing}
              className={styles.nextButton}
            >
              {isParsing ? '분석 중...' : '다음 단계로 이동'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
