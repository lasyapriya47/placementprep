import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext(null);

const emailRegex = /^[^\s@]+@(gmail\.com|edu\.in)$/i;
const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/;

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

  const validatePassword = (password) => {
    if (!password || password.length < 2) return false;
    if (password[0] !== password[0].toUpperCase()) return false;
    if (!passwordRegex.test(password)) return false;
    return true;
  };

  const validateEmail = (email) => {
    return emailRegex.test(email.trim());
  };

  const login = async ({ identity, password }) => {
    setError(null);
    const value = identity.trim();
    if (!value) {
      setError('Username or email is required.');
      return false;
    }
    if (!validatePassword(password.trim())) {
      setError('Password must start with a capital letter and include at least one special character.');
      return false;
    }

    if (value.includes('@')) {
      if (!validateEmail(value)) {
        setError('Email must end with @gmail.com or @edu.in');
        return false;
      }
      persistUser({ username: value.split('@')[0], email: value, loggedInAt: new Date().toISOString() });
      return true;
    }

    persistUser({ username: value, email: '', loggedInAt: new Date().toISOString() });
    return true;
  };

  const signup = async ({ username, email, password }) => {
    setError(null);
    const emailValue = email.trim();
    const usernameValue = username.trim() || emailValue.split('@')[0] || 'guest';

    if (!validateEmail(emailValue)) {
      setError('Email must end with @gmail.com or @edu.in');
      return false;
    }
    if (!validatePassword(password.trim())) {
      setError('Password must start with a capital letter and include at least one special character.');
      return false;
    }

    const userData = {
      username: usernameValue,
      email: emailValue,
      createdAt: new Date().toISOString(),
      loggedInAt: new Date().toISOString(),
    };
    persistUser(userData);
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
