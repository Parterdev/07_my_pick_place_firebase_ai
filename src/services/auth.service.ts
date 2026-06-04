import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const registerWithEmail = async (
  name: string,
  email: string,
  password: string,
): Promise<User> => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password.trim(),
  );

  await updateProfile(credential.user, {
    displayName: name.trim(),
  });

  return credential.user;
};

export const loginWithEmail = async (
  email: string,
  password: string,
): Promise<User> => {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password.trim(),
  );

  return credential.user;
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email.trim());
};