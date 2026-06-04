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