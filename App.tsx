
import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Views
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import SignUpView from './views/SignUpView';
import ForgotPasswordView from './views/ForgotPasswordView';
import StudentsView from './views/StudentsView';
import WorkoutsView from './views/WorkoutsView';
import ProfileView from './views/ProfileView';
import StudentDetailView from './views/StudentDetailView';
import StudentCreateView from './views/StudentCreateView';
import ShareLinkView from './views/ShareLinkView';
import PublicRegistrationView from './views/PublicRegistrationView';
import FeedbackSubmissionView from './views/FeedbackSubmissionView';
import FeedbacksView from './views/FeedbacksView';
import UpdatesMenuView from './views/UpdatesMenuView';
import WorkoutUpdatesView from './views/WorkoutUpdatesView';
import NotificationsView from './views/NotificationsView';
import CreateNotificationSelectionView from './views/CreateNotificationSelectionView';
import ExerciseLibraryView from './views/ExerciseLibraryView';
import FrequencyReportView from './views/FrequencyReportView';
import WorkoutEditorView from './views/WorkoutEditorView';
import RoutineCreateView from './views/RoutineCreateView';
import StudentWorkoutsView from './views/StudentWorkoutsView';
import RoutineDetailView from './views/RoutineDetailView';
import SubscriptionView from './views/SubscriptionView';

// Components
import Navigation from './components/Navigation';
import AIModal from './components/AIModal';

const AppContent: React.FC = () => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const location = useLocation();

  // Routes where navigation should be hidden
  const hideNavRoutes = ['/', '/signup', '/forgot-password', '/register/public'];
  const showNav = !hideNavRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-background-dark pb-24">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginView />} />
        <Route path="/signup" element={<SignUpView />} />
        <Route path="/forgot-password" element={<ForgotPasswordView />} />
        <Route path="/register/public" element={<PublicRegistrationView />} />
        <Route path="/workout/feedback/:id" element={<FeedbackSubmissionView />} />

        {/* Protected Routes */}
        <Route path="/home" element={
          <ProtectedRoute><HomeView /></ProtectedRoute>
        } />
        <Route path="/students" element={
          <ProtectedRoute><StudentsView /></ProtectedRoute>
        } />
        <Route path="/students/new" element={
          <ProtectedRoute><StudentCreateView /></ProtectedRoute>
        } />
        <Route path="/student/:id" element={
          <ProtectedRoute><StudentDetailView /></ProtectedRoute>
        } />
        <Route path="/student/:id/workouts" element={
          <ProtectedRoute><StudentWorkoutsView /></ProtectedRoute>
        } />
        <Route path="/share-link" element={
          <ProtectedRoute><ShareLinkView /></ProtectedRoute>
        } />
        <Route path="/feedbacks" element={
          <ProtectedRoute><FeedbacksView /></ProtectedRoute>
        } />
        <Route path="/updates-menu" element={
          <ProtectedRoute><UpdatesMenuView /></ProtectedRoute>
        } />
        <Route path="/updates/workouts" element={
          <ProtectedRoute><WorkoutUpdatesView /></ProtectedRoute>
        } />
        <Route path="/notifications/dashboard" element={
          <ProtectedRoute><NotificationsView /></ProtectedRoute>
        } />
        <Route path="/notifications/create-selection" element={
          <ProtectedRoute><CreateNotificationSelectionView /></ProtectedRoute>
        } />
        <Route path="/workouts" element={
          <ProtectedRoute><WorkoutsView /></ProtectedRoute>
        } />
        <Route path="/editor/:id" element={
          <ProtectedRoute><WorkoutEditorView /></ProtectedRoute>
        } />
        <Route path="/routine/new/:studentId" element={
          <ProtectedRoute><RoutineCreateView /></ProtectedRoute>
        } />
        <Route path="/routine/:id" element={
          <ProtectedRoute><RoutineDetailView /></ProtectedRoute>
        } />
        <Route path="/subscriptions" element={
          <ProtectedRoute><SubscriptionView /></ProtectedRoute>
        } />
        <Route path="/exercises-library" element={
          <ProtectedRoute><ExerciseLibraryView /></ProtectedRoute>
        } />
        <Route path="/frequency-report" element={
          <ProtectedRoute><FrequencyReportView /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ProfileView /></ProtectedRoute>
        } />
      </Routes>

      {showNav && <Navigation />}

      {/* Global AI Assistant Button - only show on protected routes */}
      {showNav && (
        <button
          onClick={() => setIsAIModalOpen(true)}
          className="fixed bottom-24 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 bg-primary border-2 border-white/20 active:scale-90 transition-transform group"
        >
          <span className="material-symbols-outlined text-white text-3xl font-light group-hover:rotate-12 transition-transform">auto_awesome</span>
          <div className="absolute -top-1 -right-1 bg-primary text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-background-dark text-background-dark">IA</div>
        </button>
      )}

      {isAIModalOpen && <AIModal onClose={() => setIsAIModalOpen(false)} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
