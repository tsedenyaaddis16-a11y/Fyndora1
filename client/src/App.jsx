import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AiStudentMentor } from './components/Chatbot/AiStudentMentor';

// Pages
import { Home } from './pages/Home';
import { Careers } from './pages/Careers';
import { CareerDetail } from './pages/CareerDetail';
import { CareerQuiz } from './pages/CareerQuiz';
import { Scholarships } from './pages/Scholarships';
import { ScholarshipDetail } from './pages/ScholarshipDetail';
import { ScholarshipMatches } from './pages/ScholarshipMatches';
import { Opportunities } from './pages/Opportunities';
import { Dashboard } from './pages/Dashboard';
import { SavedScholarships } from './pages/SavedScholarships';
import { ApplicationTracker } from './pages/ApplicationTracker';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Profile } from './pages/Profile';
import { About } from './pages/About';
import { Discussions } from './pages/Discussions';
import { Universities } from './pages/Universities';
import { UniversityDetail } from './pages/UniversityDetail';
import { UniversityMentor } from './pages/UniversityMentor';
import { NotFound } from './pages/NotFound';

// Protected Route Component for Logged-In Student Pages
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <ToastProvider>
            <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
              <Navbar />
            <main className="flex-1 w-full max-w-full overflow-x-hidden">
              <Routes>
                {/* Public Browsing Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/careers/:id" element={<CareerDetail />} />
                <Route path="/career-quiz" element={<CareerQuiz />} />
                <Route path="/scholarships" element={<Scholarships />} />
                <Route path="/scholarships/:id" element={<ScholarshipDetail />} />
                <Route path="/matches" element={<ScholarshipMatches />} />
                <Route path="/opportunities" element={<Opportunities />} />
                <Route path="/discussions" element={<Discussions />} />
                <Route path="/universities" element={<Universities />} />
                <Route path="/universities/:id" element={<UniversityDetail />} />
                <Route path="/university-mentor" element={<UniversityMentor />} />
                <Route path="/about" element={<About />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Student Account Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/saved"
                  element={
                    <ProtectedRoute>
                      <SavedScholarships />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/applications"
                  element={
                    <ProtectedRoute>
                      <ApplicationTracker />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <AiStudentMentor />
          </div>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
</Router>
  );
}
