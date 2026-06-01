import Constants from 'expo-constants';
import { Platform } from 'react-native';

type RuntimeEnv = Record<string, string | undefined>;

const extra = (Constants.expoConfig?.extra ?? {}) as RuntimeEnv;
const processEnv =
  ((globalThis as unknown as { process?: { env?: RuntimeEnv } }).process?.env ?? {}) as RuntimeEnv;

const DEFAULT_BACKEND_PORT = '8080';
const DEFAULT_FRONTEND_PORT = '8081';
const ANDROID_EMULATOR_HOST = '10.0.2.2';

function firstDefined(...values: Array<string | undefined>) {
  return values.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim();
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function expoHostIp() {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    ((Constants as unknown as { manifest2?: { extra?: { expoClient?: { hostUri?: string } } } }).manifest2?.extra?.expoClient?.hostUri);

  if (typeof hostUri !== 'string' || hostUri.trim().length === 0) {
    return undefined;
  }

  return hostUri.replace(/^https?:\/\//, '').split(':')[0];
}

function defaultLocalUrl(port: string) {
  if (Platform.OS === 'android') {
    const hostIp = expoHostIp();

    return `http://${hostIp && hostIp !== 'localhost' ? hostIp : ANDROID_EMULATOR_HOST}:${port}`;
  }

  return `http://localhost:${port}`;
}

function normalizeAndroidLocalhostUrl(value: string) {
  if (Platform.OS !== 'android') {
    return value;
  }

  try {
    const url = new URL(value);

    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      url.hostname = ANDROID_EMULATOR_HOST;

      return url.toString().replace(/\/+$/, '');
    }

    return value;
  } catch {
    return value.replace(/^(https?:\/\/)(localhost|127\.0\.0\.1)(?=[:/]|$)/i, `$1${ANDROID_EMULATOR_HOST}`);
  }
}

export const appEnv = {
  frontendUrl: trimTrailingSlash(
    normalizeAndroidLocalhostUrl(
      firstDefined(processEnv.EXPO_FRONTEND_URL, processEnv.EXPO_PUBLIC_FRONTEND_URL, extra.EXPO_FRONTEND_URL, extra.frontendUrl) ??
        defaultLocalUrl(DEFAULT_FRONTEND_PORT),
    ),
  ),
  backendUrl: trimTrailingSlash(
    normalizeAndroidLocalhostUrl(
      firstDefined(processEnv.EXPO_BACKEND_URL, processEnv.EXPO_PUBLIC_BACKEND_URL, extra.EXPO_BACKEND_URL, extra.backendUrl) ??
        defaultLocalUrl(DEFAULT_BACKEND_PORT),
    ),
  ),
} as const;
