import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function LoginPage() {
  const context = useContext(UserContext);
  if (!context) {
    return <div className="text-slate-100">Loading...</div>;
  }
  const { user, login, signup, logout, error } = context;
  const [mode, setMode] = useState('login');
  const [identity, setIdentity] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const ok = await login({ identity: identity.trim(), password: password.trim() });
    if (ok) {
      setStatus('Login successful');
      navigate('/');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const ok = await signup({ username: username.trim() || 'guest', email: email.trim() || 'guest@aitools.io', password: password.trim() || 'guest' });
    if (ok) {
      setStatus('Signup successful');
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    setStatus('Logged out');
    navigate('/');
  };

  return (
    <div className="card-glass p-6 rounded-xl border border-slate-700 max-w-md mx-auto">
      <h1 className="text-xl font-bold text-white mb-3">{user ? `Hello, ${user.username}` : mode === 'login' ? 'Login' : 'Signup'}</h1>
      {user ? (
        <>
          <p className="text-slate-300 mb-3">You are logged in as <strong>{user.username}</strong> ({user.email}).</p>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">Logout</button>
        </>
      ) : (
        <>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setMode('login')} className={`px-3 py-1 rounded ${mode === 'login' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}>Login</button>
            <button onClick={() => setMode('signup')} className={`px-3 py-1 rounded ${mode === 'signup' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}>Signup</button>
          </div>
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder="Username or Email"
                className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded text-slate-100"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded text-slate-100"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-3">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded text-slate-100"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded text-slate-100"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="w-full px-3 py-2 bg-[#0f172a] border border-slate-600 rounded text-slate-100"
              />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Signup</button>
            </form>
          )}

          {error && <p className="text-red-400 mt-3">{error}</p>}
          {status && <p className="text-emerald-300 mt-3">{status}</p>}
        </>
      )}
    </div>
  );
}
