import React, {createContext, useContext, useMemo, useState} from 'react';
import {darkColors, lightColors, AppColors} from '../theme/colors';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: AppColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  const toggleTheme = () => {
    setMode(current => (current === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(
    () => ({
      mode,
      colors: mode === 'light' ? lightColors : darkColors,
      toggleTheme,
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeContext debe usarse dentro de ThemeProvider');
  }

  return context;
};