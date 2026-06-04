import {useThemeContext} from '../context/ThemeContext';

export const useThemeMode = () => {
  return useThemeContext();
};