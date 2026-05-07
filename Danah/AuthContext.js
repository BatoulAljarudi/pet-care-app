import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState({
    name: 'أحمد',
    email: 'ahmed@example.com',
    avatar: null,
  });

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser({
      name: '',
      email: '',
      avatar: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
}
