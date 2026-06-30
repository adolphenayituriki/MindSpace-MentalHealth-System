import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Sidebar from './components/common/Sidebar';
import SOSButton from './components/crisis/SOSButton';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import GuidedReflection from './components/chat/GuidedReflection';
import MoodTracker from './components/mood/MoodTracker';
import JournalPage from './pages/JournalPage';
import CommunityPage from './pages/CommunityPage';
import CounselingPage from './pages/CounselingPage';
import CrisisPage from './pages/CrisisPage';
import InsightsPage from './pages/InsightsPage';
import HealingPage from './pages/HealingPage';
import AdminPage from './pages/AdminPage';
import './index.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading...</p></div>;
  if (!user) return <Navigate to="/onboarding" />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();

  if (location.pathname === '/' || location.pathname === '/onboarding') {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
    );
  }

  return (
    <div className="app-layout">
      {user && <Sidebar />}
      <main className="main-content">
        <Routes>
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/reflect" element={<ProtectedRoute><GuidedReflection /></ProtectedRoute>} />
          <Route path="/mood" element={<ProtectedRoute><MoodTracker /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
          <Route path="/communities" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
          <Route path="/counseling" element={<ProtectedRoute><CounselingPage /></ProtectedRoute>} />
          <Route path="/crisis" element={<ProtectedRoute><CrisisPage /></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
          <Route path="/healing" element={<ProtectedRoute><HealingPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {user && <SOSButton />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
