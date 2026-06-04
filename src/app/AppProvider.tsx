import React from 'react';
import {AuthProvider} from '../context/AuthContext';
import {ThemeProvider} from '../context/ThemeContext';

export const AppProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
};