import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi, getToken, setToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | authed | anon

  const bootstrap = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setStatus('anon');
      return;
    }
    try {
      const { user } = await authApi.me();
      setUser(user);
      setStatus('authed');
    } catch {
      setToken(null);
      setUser(null);
      setStatus('anon');
    }
  }, []);

  useEffect(() => {
    bootstrap();
    const onExpired = () => {
      setUser(null);
      setStatus('anon');
    };
    window.addEventListener('plutus:auth-expired', onExpired);
    return () => window.removeEventListener('plutus:auth-expired', onExpired);
  }, [bootstrap]);

  const login = useCallback(async (email, password) => {
    const { token, user } = await authApi.login(email, password);
    setToken(token);
    setUser(user);
    setStatus('authed');
    return user;
  }, []);

  const signup = useCallback(async (email, password, name) => {
    const { token, user } = await authApi.signup(email, password, name);
    setToken(token);
    setUser(user);
    setStatus('authed');
    return user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setStatus('anon');
  }, []);

  const refreshUser = useCallback(async () => {
    const { user } = await authApi.me();
    setUser(user);
    return user;
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, signup, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
