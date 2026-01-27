import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import Home from './pages/Home';
import StudentList from './pages/StudentList';
import StudentProfile from './pages/StudentProfile';
import StudentOptions from './pages/StudentOptions';
import RoutineDetails from './pages/RoutineDetails';
import WorkoutDetails from './pages/WorkoutDetails';
import Library from './pages/Library';

// Placeholder Pages
const Subscription = () => <div className="p-4">Subscription Page</div>;
const Help = () => <div className="p-4">Help Page</div>;
const Profile = () => <div className="p-4">Profile Page</div>;

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/students" element={<StudentList />} />
                    <Route path="/student" element={<StudentProfile />} />
                    <Route path="/student/options" element={<StudentOptions />} />
                    <Route path="/routine" element={<RoutineDetails />} />
                    <Route path="/workout" element={<WorkoutDetails />} />

                    <Route path="/library" element={<Library />} /> {/* Use this if we add a route for it, currently not in Nav, but maybe valid */}

                    <Route path="/subscription" element={<Subscription />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
