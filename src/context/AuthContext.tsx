import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {onAuthStateChanged, User} from 'firebase/auth';
import {auth} from '../config/firebase';
import {
  loginWithEmail,
  logoutUser,
  registerWithEmail,
  resetPassword,
} from '../services/auth.service';

interface AuthContextValue {
  user: User | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      login: async (email: string, password: string) => {
        await loginWithEmail(email, password);
      },
      register: async (name: string, email: string, password: string) => {
        await registerWithEmail(name, email, password);
      },
      logout: async () => {
        await logoutUser();
      },
      forgotPassword: async (email: string) => {
        await resetPassword(email);
      },
    }),
    [user, initializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  }

  return context;
};