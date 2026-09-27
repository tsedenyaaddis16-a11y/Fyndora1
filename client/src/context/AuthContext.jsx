import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('fyndora_token') || localStorage.getItem('pathfinder_token');
      if (token) {
        try {
          const res = await api.getMe();
          if (res?.user) {
            setUser(res.user);
          } else {
            const fallbackUser = localStorage.getItem('fyndora_current_user') || localStorage.getItem('pathfinder_current_user');
            if (fallbackUser) setUser(JSON.parse(fallbackUser));
          }
        } catch (err) {
          console.warn('Failed to fetch user with token, checking fallback user');
          const fallbackUser = localStorage.getItem('fyndora_current_user') || localStorage.getItem('pathfinder_current_user');
          if (fallbackUser) setUser(JSON.parse(fallbackUser));
        }
      } else {
        // Pre-populate with default student for instant exploration if desired,
        // or keep null. Let's provide a friendly preloaded student so user can test immediately!
        const existing = localStorage.getItem('fyndora_current_user') || localStorage.getItem('pathfinder_current_user');
        if (existing) {
          setUser(JSON.parse(existing));
        } else {
          const defaultStudent = {
            id: 'demo-student-1',
            name: 'Selam Haile',
            email: 'selam.haile@fyndora.org',
            role: 'student',
            age: 17,
            nationality: 'Ethiopia',
            country: 'Ethiopia',
            grade: 'Grade 11',
            graduationYear: 2027,
            interests: ['Technology', 'Engineering'],
            preferredFields: ['Software Engineering', 'Computer Science'],
            preferredCountries: ['USA', 'Canada', 'Germany', 'Japan'],
            fundingPreference: 'Fully funded',
          };
          localStorage.setItem('fyndora_current_user', JSON.stringify(defaultStudent));
          localStorage.setItem('fyndora_token', 'demo_token_default');
          setUser(defaultStudent);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res?.user) {
      setUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res?.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('fyndora_token');
    localStorage.removeItem('fyndora_current_user');
    localStorage.removeItem('pathfinder_token');
    localStorage.removeItem('pathfinder_current_user');
    setUser(null);
  };

  const updateProfile = (updatedFields) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('fyndora_current_user', JSON.stringify(updated));
  };

  // Helper toggle for easily testing admin CRUD vs student mode
  const toggleAdminRole = () => {
    if (!user) return;
    const newRole = user.role === 'admin' ? 'student' : 'admin';
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem('fyndora_current_user', JSON.stringify(updated));
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        toggleAdminRole,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
