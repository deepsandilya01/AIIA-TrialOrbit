import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('ctms_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      sessionStorage.removeItem('ctms_user');
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // credentials might be simple dummy object in old UI, or real object now
      const res = await (await import('../services/api.js')).api.login(credentials);
      const token = res.data.token;
      const userData = res.data.user;
      
      localStorage.setItem('ctms_token', token);
      sessionStorage.setItem('ctms_user', JSON.stringify(userData));
      setUser(userData);
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
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
