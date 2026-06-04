import { Timestamp } from "firebase/firestore";

export const formatFirebaseAuthError = (code?: string): string => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este correo ya está registrado.';
    case 'auth/invalid-email':
      return 'El correo ingresado no es válido.';
    case 'auth/user-not-found':
      return 'No existe una cuenta con este correo.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Correo o contraseña incorrectos.';
    case 'auth/weak-password':
      return 'La contraseña es demasiado débil.';
    case 'auth/network-request-failed':
      return 'Revisa tu conexión a internet.';
    default:
      return 'Ocurrió un error. Inténtalo nuevamente.';
  }
};

export const formatPlaceDate = (createdAt?: Timestamp | null): string => {
  if (!createdAt) {
    return 'Fecha no disponible';
  }

  const date = createdAt.toDate();

  return new Intl.DateTimeFormat('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatCoordinate = (value: number): string => {
  return value.toFixed(6);
};