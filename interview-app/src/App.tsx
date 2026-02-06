import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { InterviewProvider } from './context/InterviewContext';
import { Landing } from './pages/Landing';
import { CompanyJobSelect } from './pages/CompanyJobSelect';
import { ResumeUpload } from './pages/ResumeUpload';
import { InterviewSettings } from './pages/InterviewSettings';
import { InterviewSession } from './pages/InterviewSession';
import { InterviewComplete } from './pages/InterviewComplete';
import { InterviewReport } from './pages/InterviewReport';

import styles from './App.module.css';

function HomeButton() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/') return null;

  // 면접 중일 때는 한 번 물어보는 로직 추가 (선택 사항)
  const handleHomeClick = () => {
    if (location.pathname === '/interview') {
      if (window.confirm("메인으로 돌아가시겠습니까? 진행 중인 면접은 저장되지 않습니다.")) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <button className={styles.homeButton} onClick={handleHomeClick}>
      <i className={`fa-solid fa-house ${styles.homeIcon}`}></i>
      <span className={styles.buttonText}>홈으로</span>
    </button>
  );
}

function App() {
  return (
    <BrowserRouter>
      <InterviewProvider>
        <HomeButton />

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/company-job" element={<CompanyJobSelect />} />
          <Route path="/resume-upload" element={<ResumeUpload />} />
          <Route path="/interview-settings" element={<InterviewSettings />} />
          <Route path="/interview" element={<InterviewSession />} />
          <Route path="/interview-complete" element={<InterviewComplete />} />
          <Route path="/report" element={<InterviewReport />} />
        </Routes>
      </InterviewProvider>
    </BrowserRouter>
  );
}

export default App;
