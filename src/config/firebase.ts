import AsyncStorage from '@react-native-async-storage/async-storage';
import {getApp, getApps, initializeApp} from 'firebase/app';
import {
  Auth,
  Persistence,
  getAuth,
  initializeAuth,
} from 'firebase/auth';
import * as firebaseAuth from 'firebase/auth';
import {initializeFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBoDFmvNUBjKGK7DrWIkDFDx-orgHOB25o',
  authDomain: 'practicas-septimo-moviles.firebaseapp.com',
  projectId: 'practicas-septimo-moviles',
  storageBucket: 'practicas-septimo-moviles.firebasestorage.app',
  messagingSenderId: '464845868669',
  appId: '1:464845868669:web:74f37d005111fca5c76b14',
};

const storageBucketUrl = 'gs://practicas-septimo-moviles.firebasestorage.app';

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
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export const storage = getStorage(app, storageBucketUrl);
export {app};