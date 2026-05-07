import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfileProvider, useProfile } from './context/ProfileContext';
import { OfflineBanner } from './components/OfflineBanner';
import { Navigation } from './components/Navigation';
import { THEMES } from './themes';
import Login from './pages/Login';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import MyPage from './pages/MyPage';
import PetCard from './pages/PetCard';
import Settings from './pages/Settings';

const AppShell = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const theme = THEMES[profile.ageGroup] || THEMES.standard;

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50">
        <div className="text-slate-500">読み込み中...</div>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className={`${theme.root} min-h-screen`}>
        <OfflineBanner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className={`${theme.root} min-h-screen pb-20`}>
      <OfflineBanner />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz/:disasterType/:stage" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/petcard" element={<PetCard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Navigation />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <AppShell />
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
