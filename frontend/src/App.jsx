import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';
import AppLayout from './components/AppLayout';

import CinematicLanding from './pages/CinematicLanding';
import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import TestRuns from './pages/TestRuns';
import TestRunDetail from './pages/TestRunDetail';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Subscription from './pages/Subscription';
import Team from './pages/Team';

// Keep old ones that might still be needed if present
import TestCases from './pages/TestCases';
import AIInsights from './pages/AIInsights';
import Help from './pages/Help';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<CinematicLanding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected App Routes */}
          <Route path="/app" element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/app/projects" element={
            <ProtectedRoute>
              <AppLayout>
                <Projects />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/app/projects/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <ProjectDetail />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/app/runs" element={
            <ProtectedRoute>
              <AppLayout>
                <TestRuns />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/app/runs/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <TestRunDetail />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/app/reports" element={
            <ProtectedRoute>
              <AppLayout>
                <Reports />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/app/subscription" element={
            <ProtectedRoute>
              <AppLayout>
                <Subscription />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/app/team" element={
            <ProtectedRoute>
              <AppLayout>
                <Team />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/app/settings" element={
            <ProtectedRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* Fallback old pages if they exist */}
          <Route path="/app/cases" element={
            <ProtectedRoute>
              <AppLayout>
                {TestCases ? <TestCases /> : <Navigate to="/app" />}
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/app/insights" element={
            <ProtectedRoute>
              <AppLayout>
                {AIInsights ? <AIInsights /> : <Navigate to="/app" />}
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/app/help" element={
            <ProtectedRoute>
              <AppLayout>
                {Help ? <Help /> : <Navigate to="/app" />}
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
