import { Routes, Route, Link } from 'react-router-dom';
import { useContext } from 'react';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import ToolDetailPage from './pages/ToolDetailPage';
import RecommendationPage from './pages/RecommendationPage';
import PlacementPrepPage from './pages/PlacementPrepPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { UserContext } from './context/UserContext';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <div className="flex min-h-screen">
        <aside className="w-64 bg-[#0d132a] border-r border-slate-800 p-4 sticky top-0 h-screen">
          <div className="mb-8">
            <div className="text-2xl font-black text-[#d3a5ff]">AI HUB</div>
            <div className="text-xs text-slate-400 uppercase tracking-widest">Control Panel</div>
          </div>
          <nav className="space-y-2">
            <Link to="/" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#1f2a4a]">Dashboard</Link>
            <Link to="/tools" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#1f2a4a]">Tools</Link>
            <Link to="/recommendation" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#1f2a4a]">Recommendations</Link>
            <Link to="/placement-prep" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#1f2a4a]">Placement Prep</Link>
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
