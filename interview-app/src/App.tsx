import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { InterviewProvider } from './context/InterviewContext';
import { Landing } from './pages/Landing';
import { CompanyJobSelect } from './pages/CompanyJobSelect';
import { ResumeUpload } from './pages/ResumeUpload';
import { InterviewSettings } from './pages/InterviewSettings';
import { InterviewSession } from './pages/InterviewSession';
import { InterviewComplete } from './pages/InterviewComplete';
import { InterviewReport } from './pages/InterviewReport';

function HomeButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 페이지가 랜딩 페이지('/')라면 버튼을 숨깁니다.
  if (location.pathname === '/') return null;

  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 9999,
    padding: '10px 15px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid #ddd',
    borderRadius: '50px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  };

  return (
    <button 
      onClick={() => navigate('/')} 
      style={buttonStyle}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)')}
    >
      <i className="fa-solid fa-house"></i>
      홈으로
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
