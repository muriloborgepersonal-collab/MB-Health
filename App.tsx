
import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
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
import WorkoutEditorView from './views/WorkoutEditorView';
import Navigation from './components/Navigation';
import AIModal from './components/AIModal';

const App: React.FC = () => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const location = useLocation();

  // Hide nav on specific editor views if needed, but keeping it for now per screenshots
  const showNav = !['/editor', '/'].some(path => location.pathname === '/' || location.pathname.startsWith('/editor'));

  return (
    <div className="flex flex-col min-h-screen bg-background-dark pb-24">
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/home" element={<HomeView />} />
        <Route path="/students" element={<StudentsView />} />
        <Route path="/students/new" element={<StudentCreateView />} />
        <Route path="/student/:id" element={<StudentDetailView />} />
        <Route path="/share-link" element={<ShareLinkView />} />
        <Route path="/register/public" element={<PublicRegistrationView />} />
        <Route path="/feedbacks" element={<FeedbacksView />} />
        <Route path="/workout/feedback/:id" element={<FeedbackSubmissionView />} />
        <Route path="/updates-menu" element={<UpdatesMenuView />} />
        <Route path="/updates/workouts" element={<WorkoutUpdatesView />} />
        <Route path="/notifications/dashboard" element={<NotificationsView />} />
        <Route path="/notifications/create-selection" element={<CreateNotificationSelectionView />} />
        <Route path="/workouts" element={<WorkoutsView />} />
        <Route path="/editor/:id" element={<WorkoutEditorView />} />
        <Route path="/profile" element={<ProfileView />} />
      </Routes>

      {showNav && <Navigation />}

      {/* Global AI Assistant Button */}
      <button
        onClick={() => setIsAIModalOpen(true)}
        className="fixed bottom-24 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 bg-gradient-to-tr from-primary to-purple-500 border-2 border-white/20 active:scale-90 transition-transform group"
      >
        <span className="material-symbols-outlined text-white text-3xl font-light group-hover:rotate-12 transition-transform">auto_awesome</span>
        <div className="absolute -top-1 -right-1 bg-red-500 text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-background-dark">IA</div>
      </button>

      {isAIModalOpen && <AIModal onClose={() => setIsAIModalOpen(false)} />}
    </div>
  );
};

export default App;
