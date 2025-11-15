import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const USERS_KEY = 'hrs_users';
const CURRENT_USER_KEY = 'hrs_current_user';

const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  useEffect(() => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    setIsAuthenticated(!!user);
  }, [user]);

  const register = async (userData) => {
    const users = getStoredUsers();
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Email already registered');
    }
    const newUser = { id: Date.now(), ...userData };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    setUser(newUser);
    return newUser;
  };

  const login = async (email, password) => {
    const users = getStoredUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid credentials');
    setUser(found);
    return found;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
