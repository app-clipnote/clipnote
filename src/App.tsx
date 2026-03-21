import { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './features/landing/components/LandingPage';
import { AuthPage } from './features/auth/components/AuthPage';
import { OnboardingFlow } from './features/onboarding/components/OnboardingFlow';
import { Dashboard } from './pages/Dashboard';
import { AdminAuth } from './features/admin/components/AdminAuth';
import { AdminDashboard } from './features/admin/components/AdminDashboard';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { NotFound } from './pages/NotFound';
import { SystemAlertModal } from './components/shared/SystemAlertModal';
import { AlertProvider, useAlert } from './context/AlertContext';
import { getProfile, getAuthUser } from './lib/auth';
import { getSummaries } from './lib/summaries';
import { initializeTheme } from './lib/theme';
import { ToastProvider } from './context/ToastContext';
import type { Summary } from './types';

interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'pro-plus' | 'enterprise';
  avatar?: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  summaries: Summary[];
  setSummaries: (summaries: Summary[]) => void;
  refreshSummaries: () => Promise<void>;
  reloadUser: () => Promise<void>;
  needsOnboarding: boolean;
  setNeedsOnboarding: (needs: boolean) => void;
  loading: boolean;
  isAdmin: boolean;
  showAlert: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    // Check for admin session
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession === 'true') {
      setIsAdmin(true);
    }
    
    // Initialize theme
    initializeTheme();
  }, []);

  const refreshSummaries = async () => {
    if (user) {
      try {
        const data = await getSummaries(user.id);
        setSummaries(data);
      } catch (error) {
        console.error('Error loading summaries:', error);
      }
    }
  };

  const reloadUser = async () => {
    const authUser = await getAuthUser();
    if (authUser?.id) {
      await loadUserData(authUser?.id);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const authUser = await getAuthUser();
        
        if (authUser?.id) {
          await loadUserData(authUser.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Init auth error:', error);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      const profile = await getProfile(userId);
      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        plan: profile.plan,
        avatar: profile.avatar,
      });

      // Load summaries
      const summariesData = await getSummaries(userId);
      setSummaries(summariesData);
    } catch (error) {
      console.error('Error loading user data:', error);
      localStorage.removeItem('ai_summarizer_current_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        summaries,
        setSummaries,
        refreshSummaries,
        reloadUser,
        needsOnboarding,
        setNeedsOnboarding,
        loading,
        isAdmin,
        showAlert,
      }}
    >
      <ToastProvider>
        <Router basename={(import.meta as any).env?.BASE_URL || '/'}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route
            path="/onboarding"
            element={
              user && (needsOnboarding || !user.plan) ? <OnboardingFlow /> : <Navigate to={user ? '/dashboard' : '/auth'} />
            }
          />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
          <Route path="/admin/auth" element={isAdmin ? <Navigate to="/admin/dashboard" /> : <AdminAuth />} />
          <Route path="/admin/dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/auth" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      </ToastProvider>
    </AppContext.Provider>
  );
}

function App() {
  return (
    <AlertProvider>
      <AppContent />
    </AlertProvider>
  );
}

export default App;