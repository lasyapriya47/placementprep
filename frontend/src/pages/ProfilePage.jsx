import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function ProfilePage() {
  const { user } = useContext(UserContext);

  if (!user) {
    return <p className="text-slate-200">Please log in to view your profile.</p>;
  }

  return (
    <div className="card-glass p-6 rounded-xl border border-slate-700 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white">Profile</h1>
      <p className="text-slate-300 mt-2">Username: {user.username || 'Guest'}</p>
      <p className="text-slate-300">Email: {user.email || 'Not provided'}</p>
      <p className="text-slate-300">Joined: {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}</p>
      <p className="text-slate-300 mt-3">Your session is stored locally so the website stays accessible after login.</p>
    </div>
  );
}
