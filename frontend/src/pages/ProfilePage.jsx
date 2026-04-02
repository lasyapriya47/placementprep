import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';

const API_BASE = 'http://localhost:8080/auth';

export default function ProfilePage() {
  const { user } = useContext(UserContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user?.username && !user?.email) return;

    const identity = user.username || user.email;
    fetch(`${API_BASE}/profile?identity=${encodeURIComponent(identity)}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => setProfile(data))
      .catch(() => setProfile(null));
  }, [user]);

  if (!user) {
    return <p className="text-slate-200">Please log in to view your profile.</p>;
  }

  return (
    <div className="card-glass p-6 rounded-xl border border-slate-700 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white">Profile</h1>
      <p className="text-slate-300 mt-2">Username: {profile?.username || user.username}</p>
      <p className="text-slate-300">Email: {profile?.email || user.email}</p>
      <p className="text-slate-300">Joined: {profile?.createdAt ? new Date(profile.createdAt).toLocaleString() : 'N/A'}</p>
      <p className="text-slate-300 mt-3">Progress is saved locally and synced to your profile (or in-browser session).</p>
    </div>
  );
}
