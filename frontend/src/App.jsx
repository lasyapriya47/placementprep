import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import ToolDetailPage from './pages/ToolDetailPage';
import RecommendationPage from './pages/RecommendationPage';
import PlacementPrepPage from './pages/PlacementPrepPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { UserContext } from './context/UserContext';

const placementTasks = [
  { id: 'dsa', label: 'DSA Mastery', topic: 'DSA Mastery' },
  { id: 'system-design', label: 'System Design', topic: 'System Design & Architecture' },
  { id: 'behavioral', label: 'Behavioral Prep', topic: 'Behavioral Interview Prep' },
  { id: 'resume', label: 'Resume & LinkedIn', topic: 'Resume & LinkedIn Profile' },
  { id: 'mock-interview', label: 'Mock Interviews', topic: 'Mock Interviews & Coding Challenges' },
];

export default function App() {
  const [expandPlacement, setExpandPlacement] = useState(false);
  const location = useLocation();

  const isPlacementActive = location.pathname.startsWith('/placement-prep');

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <div className="flex min-h-screen">
        <aside className="w-64 bg-[#0d132a] border-r border-slate-800 p-4 sticky top-0 h-screen overflow-y-auto">
          <div className="mb-8">
            <div className="text-2xl font-black text-[#d3a5ff]">AI HUB</div>
            <div className="text-xs text-slate-400 uppercase tracking-widest">Control Panel</div>
          </div>
          <nav className="space-y-2">
            <Link to="/" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#1f2a4a]">Dashboard</Link>
            <Link to="/tools" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#1f2a4a]">Tools</Link>
            <Link to="/recommendation" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#1f2a4a]">Recommendations</Link>
            
            <div>
              <button
                onClick={() => setExpandPlacement(!expandPlacement)}
                className="w-full text-left rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#1f2a4a] flex items-center justify-between"
              >
                Placement Prep
                <span className={`transition-transform ${expandPlacement ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {expandPlacement && (
                <div className="ml-2 mt-1 space-y-1 border-l border-slate-700 pl-2">
                  <Link to="/placement-prep" className="block rounded px-3 py-2 text-xs font-medium hover:bg-[#1f2a4a] text-slate-300">Overview</Link>
                  {placementTasks.map(task => (
                    <Link
                      key={task.id}
                      to={`/placement-prep/${task.id}`}
                      className="block rounded px-3 py-2 text-xs font-medium hover:bg-[#1f2a4a] text-slate-300"
                    >
                      {task.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link to="/profile" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#1f2a4a]">Profile</Link>
            <Link to="/login" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#1f2a4a]">Login</Link>
          </nav>
        </aside>

        <div className="flex-1 p-6">
          <header className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">AI Tools Hub</h1>
            <span className="text-sm text-slate-400">System Status: <span className="text-emerald-400">Online</span></span>
          </header>

          <main className="space-y-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/tools/:id" element={<ToolDetailPage />} />
              <Route path="/recommendation" element={<RecommendationPage />} />
              <Route path="/placement-prep" element={<PlacementPrepPage />} />
              <Route path="/placement-prep/:taskId" element={<PlacementPrepPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>

          <footer className="mt-8 text-xs text-slate-500">&copy; {new Date().getFullYear()} AI Tools Hub</footer>
        </div>
      </div>
    </div>
  );
}
