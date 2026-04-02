import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext(null);

const API_BASE = 'http://localhost:8080/auth';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('aiToolsHubUser');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const persistUser = (userData) => {
    setUser(userData);
    localStorage.setItem('aiToolsHubUser', JSON.stringify(userData));
  };

  const login = async ({ identity, password }) => {
    setError(null);
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity, password }),
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.error || 'Login failed');
      return false;
    }

    const data = await response.json();
    persistUser(data);
    return true;
  };

  const signup = async ({ username, email, password }) => {
    setError(null);
    const response = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.error || 'Signup failed');
      return false;
    }

    const data = await response.json();
    persistUser(data);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aiToolsHubUser');
  };

  return (
    <UserContext.Provider value={{ user, login, signup, logout, error }}>
      {children}
    </UserContext.Provider>
  );
}
