import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { InterviewProvider } from './context/InterviewContext';
import { Landing } from './pages/Landing';
import { CompanyJobSelect } from './pages/CompanyJobSelect';
import { ResumeUpload } from './pages/ResumeUpload';
import { InterviewSettings } from './pages/InterviewSettings';
import { InterviewSession } from './pages/InterviewSession';
import { InterviewComplete } from './pages/InterviewComplete';
import { InterviewReport } from './pages/InterviewReport';

import styles from './App.module.css';

import ConfirmModal from "./components/ConfirmModal";

function HomeButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  if (location.pathname === "/") return null;

  const handleHomeClick = (): void => {
    if (location.pathname === "/interview") {
      setIsModalOpen(true);
    } else {
      navigate("/");
    }
  };

  const handleConfirm = (): void => {
    setIsModalOpen(false);
    navigate("/");
  };

  return (
    <>
      <button className={styles.homeButton} onClick={handleHomeClick}>
        <i className={`fa-solid fa-house ${styles.homeIcon}`} />
        <span className={styles.buttonText}>홈으로</span>
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
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
