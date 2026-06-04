import AsyncStorage from '@react-native-async-storage/async-storage';
import {getApp, getApps, initializeApp} from 'firebase/app';
import {
  Auth,
  Persistence,
  getAuth,
  initializeAuth,
} from 'firebase/auth';
import * as firebaseAuth from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_AUTH_DOMAIN',
  projectId: 'TU_PROJECT_ID',
  storageBucket: 'TU_STORAGE_BUCKET',
  messagingSenderId: 'TU_MESSAGING_SENDER_ID',
  appId: 'TU_APP_ID',
};

type ReactNativePersistenceFactory = (
  storage: typeof AsyncStorage,
) => Persistence;

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const getReactNativePersistence = (
  firebaseAuth as unknown as {
    getReactNativePersistence: ReactNativePersistenceFactory;
  }
).getReactNativePersistence;

let authInstance: Auth;

try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const db = getFirestore(app);
export const storage = getStorage(app);
export {app};