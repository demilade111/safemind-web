import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Import pages
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import JournalPage from "./pages/JournalPage";
import TherapistsPage from "./pages/TherapistsPage";
import CommunitiesPage from "./pages/CommunitiesPage";
import ResourcesPage from "./pages/ResourcesPage";
import ProfilePage from "./pages/ProfilePage";
import VideoCallPage from "./pages/VideoCallPage";
import NotFoundPage from "./pages/NotFoundPage";
import TestTailwind from "./components/TestTailwind";

// Import layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />

              {/* Authentication routes */}
              <Route path="auth" element={<AuthLayout />}>
                <Route index element={<AuthPage />} />
                <Route path="login" element={<AuthPage isLogin />} />
                <Route path="register" element={<AuthPage />} />
              </Route>
            </Route>

            {/* Dashboard routes */}
            <Route path="/dashboard" element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="mood-tracker" element={<MoodTrackerPage />} />
              <Route path="journal" element={<JournalPage />} />
              <Route path="therapists" element={<TherapistsPage />} />
              <Route path="communities" element={<CommunitiesPage />} />
              <Route path="resources" element={<ResourcesPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Video call route */}
            <Route path="/video-call/:sessionId" element={<VideoCallPage />} />

            {/* Test Tailwind route */}
            <Route path="/test-tailwind" element={<TestTailwind />} />

            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
