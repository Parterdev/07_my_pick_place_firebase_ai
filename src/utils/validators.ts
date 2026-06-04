export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isValidPassword = (password: string): boolean => {
  return password.trim().length >= 6;
};

export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateLoginForm = (email: string, password: string): string | null => {
  if (!isNotEmpty(email)) return 'Ingresa tu correo electrónico.';
  if (!isValidEmail(email)) return 'Ingresa un correo válido.';
  if (!isNotEmpty(password)) return 'Ingresa tu contraseña.';
  if (!isValidPassword(password)) return 'La contraseña debe tener al menos 6 caracteres.';
  return null;
};

export const validateRegisterForm = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): string | null => {
  if (!isNotEmpty(name)) return 'Ingresa tu nombre.';
  if (!isNotEmpty(email)) return 'Ingresa tu correo electrónico.';
  if (!isValidEmail(email)) return 'Ingresa un correo válido.';
  if (!isValidPassword(password)) return 'La contraseña debe tener al menos 6 caracteres.';
  if (password !== confirmPassword) return 'Las contraseñas no coinciden.';
  return null;
};