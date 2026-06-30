import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('mindspace_token');
    const savedUser = localStorage.getItem('mindspace_user');
    if (saved && savedUser) {
      setToken(saved);
      setUser(JSON.parse(savedUser));
      authAPI.profile().then((res) => {
        const fresh = res.data?.user;
        if (fresh) {
          setUser(fresh);
          localStorage.setItem('mindspace_user', JSON.stringify(fresh));
        }
      }).catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('mindspace_token');
          localStorage.removeItem('mindspace_user');
          setUser(null);
          setToken(null);
        }
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (method, data) => {
    let res;
    if (method === 'anonymous') {
      res = await authAPI.anonymous(data.language);
    } else if (method === 'register') {
      res = await authAPI.register(data);
    } else {
      res = await authAPI.login(data);
    }
    const { user: u, token: t } = res.data;
    setUser(u);
    setToken(t);
    localStorage.setItem('mindspace_token', t);
    localStorage.setItem('mindspace_user', JSON.stringify(u));
    return u;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mindspace_token');
    localStorage.removeItem('mindspace_user');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('mindspace_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
