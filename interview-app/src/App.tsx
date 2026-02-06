import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InterviewProvider } from './context/InterviewContext';
import { Landing } from './pages/Landing';
import { CompanyJobSelect } from './pages/CompanyJobSelect';
import { ResumeUpload } from './pages/ResumeUpload';
import { InterviewSettings } from './pages/InterviewSettings';
import { InterviewSession } from './pages/InterviewSession';
import { InterviewComplete } from './pages/InterviewComplete';
import { InterviewReport } from './pages/InterviewReport';

function App() {
  return (
    <BrowserRouter>
      <InterviewProvider>
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
