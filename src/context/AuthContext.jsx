import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, credentials);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const signup = async (data) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const fetchMe = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch {
      logout();
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
