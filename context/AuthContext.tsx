// app/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getApp } from 'firebase/app';

interface AuthContextProps {
  currentUser: any; // Puedes tipar con firebase.User si importas el tipo
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const auth = getAuth(getApp());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, [auth]);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
