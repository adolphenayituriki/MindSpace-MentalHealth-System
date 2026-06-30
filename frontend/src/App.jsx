import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/common/ToastContainer';
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

function LoadingSkeleton() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ height: '28px', width: '220px', background: 'var(--bg-muted)', borderRadius: '6px', marginBottom: '0.5rem', animation: 'pulse 1.5s infinite' }} />
      <div style={{ height: '16px', width: '340px', background: 'var(--bg-muted)', borderRadius: '6px', marginBottom: '2rem', animation: 'pulse 1.5s infinite' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{ height: '72px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1rem', animation: 'pulse 1.5s infinite' }}>
            <div style={{ height: '14px', width: '60%', background: 'var(--bg-muted)', borderRadius: '4px', marginBottom: '0.5rem' }} />
            <div style={{ height: '10px', width: '40%', background: 'var(--bg-muted)', borderRadius: '4px' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {[1,2].map(i => (
          <div key={i} style={{ height: '200px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', animation: 'pulse 1.5s infinite' }}>
            <div style={{ height: '16px', width: '50%', background: 'var(--bg-muted)', borderRadius: '4px', marginBottom: '1rem' }} />
            <div style={{ height: '10px', width: '90%', background: 'var(--bg-muted)', borderRadius: '4px', marginBottom: '0.5rem' }} />
            <div style={{ height: '10px', width: '75%', background: 'var(--bg-muted)', borderRadius: '4px', marginBottom: '0.5rem' }} />
            <div style={{ height: '10px', width: '60%', background: 'var(--bg-muted)', borderRadius: '4px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSkeleton />;
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
            <ToastProvider>
              <AppRoutes />
              <ToastContainer />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
