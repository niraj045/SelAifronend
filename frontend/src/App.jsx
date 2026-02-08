import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import CinematicLanding from './pages/CinematicLanding';
import Dashboard from './pages/Dashboard';
import TestRunStatus from './pages/TestRunStatus';
import Projects from './pages/Projects';
import TestRuns from './pages/TestRuns';
import Reports from './pages/Reports';
import TestCases from './pages/TestCases';
import AIInsights from './pages/AIInsights';
import Settings from './pages/Settings';
import Help from './pages/Help';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<CinematicLanding />} />

        {/* Protected App Routes */}
        <Route path="/app" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/app/projects" element={<AppLayout><Projects /></AppLayout>} />
        <Route path="/app/runs" element={<AppLayout><TestRuns /></AppLayout>} />
        <Route path="/app/reports" element={<AppLayout><Reports /></AppLayout>} />
        <Route path="/app/cases" element={<AppLayout><TestCases /></AppLayout>} />
        <Route path="/app/insights" element={<AppLayout><AIInsights /></AppLayout>} />
        <Route path="/app/settings" element={<AppLayout><Settings /></AppLayout>} />
        <Route path="/app/help" element={<AppLayout><Help /></AppLayout>} />
        <Route path="/app/run/:id" element={<TestRunStatus />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
