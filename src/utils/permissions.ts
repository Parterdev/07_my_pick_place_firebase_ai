import {Platform} from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  check,
  request,
} from 'react-native-permissions';

const isGranted = (status: string) => {
  return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
};

export const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  const permission = PERMISSIONS.ANDROID.CAMERA;
  const currentStatus = await check(permission);

  if (isGranted(currentStatus)) {
    return true;
  }

  const requestStatus = await request(permission);
  return isGranted(requestStatus);
};

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  const permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  const currentStatus = await check(permission);

  if (isGranted(currentStatus)) {
    return true;
  }

  const requestStatus = await request(permission);
  return isGranted(requestStatus);
};