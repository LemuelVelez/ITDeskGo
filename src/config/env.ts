import Constants from 'expo-constants';
import { Platform } from 'react-native';

type RuntimeEnv = Record<string, string | undefined>;

const extra = (Constants.expoConfig?.extra ?? {}) as RuntimeEnv;
const processEnv =
  ((globalThis as unknown as { process?: { env?: RuntimeEnv } }).process?.env ?? {}) as RuntimeEnv;

const DEPLOYED_BACKEND_URL = 'https://itdeskgo-api.jrmsu-tc.tech';
const DEFAULT_BACKEND_PORT = '8080';
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

function defaultLocalBackendUrl() {
  if (Platform.OS === 'android') {
    const hostIp = expoHostIp();

    return `http://${hostIp && hostIp !== 'localhost' ? hostIp : ANDROID_EMULATOR_HOST}:${DEFAULT_BACKEND_PORT}`;
  }

  return `http://localhost:${DEFAULT_BACKEND_PORT}`;
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

function flagEnabled(value: string | undefined) {
  return ['1', 'true', 'yes', 'on', 'local'].includes(value?.trim().toLowerCase() ?? '');
}

function useLocalBackend() {
  return flagEnabled(
    firstDefined(
      processEnv.EXPO_USE_LOCAL_BACKEND,
      processEnv.EXPO_PUBLIC_USE_LOCAL_BACKEND,
      extra.EXPO_USE_LOCAL_BACKEND,
      extra.EXPO_PUBLIC_USE_LOCAL_BACKEND,
      extra.useLocalBackend,
    ),
  );
}

function isLocalBackendUrl(value: string) {
  try {
    const url = new URL(value);

    return ['localhost', '127.0.0.1', '0.0.0.0', ANDROID_EMULATOR_HOST].includes(url.hostname);
  } catch {
    return /^(https?:\/\/)?(localhost|127\.0\.0\.1|0\.0\.0\.0|10\.0\.2\.2)(?=[:/]|$)/i.test(value);
  }
}

function resolveBackendUrl() {
  const configuredUrl = firstDefined(
    processEnv.EXPO_BACKEND_URL,
    processEnv.EXPO_PUBLIC_BACKEND_URL,
    processEnv['app.baseURL'],
    extra.EXPO_BACKEND_URL,
    extra.EXPO_PUBLIC_BACKEND_URL,
    extra.backendUrl,
    extra.baseURL,
    extra['app.baseURL'],
  );

  if (configuredUrl && (!isLocalBackendUrl(configuredUrl) || useLocalBackend())) {
    return configuredUrl;
  }

  if (useLocalBackend()) {
    return configuredUrl ?? defaultLocalBackendUrl();
  }

  return DEPLOYED_BACKEND_URL;
}

export const appEnv = {
  backendUrl: trimTrailingSlash(normalizeAndroidLocalhostUrl(resolveBackendUrl())),
} as const;
