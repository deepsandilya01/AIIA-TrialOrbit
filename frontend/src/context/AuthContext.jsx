import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('ctms_user');
      const token = localStorage.getItem('ctms_token');
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        connectSocket(token);
      } else {
        sessionStorage.removeItem('ctms_user');
        localStorage.removeItem('ctms_token');
      }
    } catch (e) {
      sessionStorage.removeItem('ctms_user');
      localStorage.removeItem('ctms_token');
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const res = await (await import('../services/api.js')).api.login(credentials);
      const token = res.data.token;
      const userData = res.data.user;
      
      localStorage.setItem('ctms_token', token);
      sessionStorage.setItem('ctms_user', JSON.stringify(userData));
      setUser(userData);
      connectSocket(token);
      return userData;
    } catch (err) {
      console.error('Login failed', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ctms_token');
    sessionStorage.removeItem('ctms_user');
    disconnectSocket();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
