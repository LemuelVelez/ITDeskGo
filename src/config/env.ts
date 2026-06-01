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

function unique(values: string[]) {
  return Array.from(new Set(values.map(trimTrailingSlash).filter((value) => value.length > 0)));
}

function expoHostIp() {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    ((Constants as unknown as { manifest2?: { extra?: { expoClient?: { hostUri?: string } } } }).manifest2?.extra?.expoClient?.hostUri);

  if (typeof hostUri !== 'string' || hostUri.trim().length === 0) {
    return undefined;
  }

  const host = hostUri.replace(/^https?:\/\//, '').split(':')[0]?.trim();

  return host && host !== 'localhost' ? host : undefined;
}

function defaultLocalUrl(port: string) {
  if (Platform.OS === 'android') {
    const hostIp = expoHostIp();

    return `http://${hostIp ?? ANDROID_EMULATOR_HOST}:${port}`;
  }

  return `http://localhost:${port}`;
}

function hostnameFromUrl(value: string) {
  try {
    return new URL(value).hostname;
  } catch {
    return value.replace(/^https?:\/\//, '').split(/[/:]/)[0];
  }
}

function isLocalDevelopmentHost(hostname: string | undefined) {
  if (!hostname) {
    return true;
  }

  if (['localhost', '127.0.0.1', ANDROID_EMULATOR_HOST].includes(hostname)) {
    return true;
  }

  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    return true;
  }

  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    return true;
  }

  return /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname);
}

function normalizeAndroidLocalhostUrl(value: string) {
  if (Platform.OS !== 'android') {
    return value;
  }

  try {
    const url = new URL(value);

    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      url.hostname = ANDROID_EMULATOR_HOST;

      return url.toString();
    }

    return value;
  } catch {
    return value.replace(/^(https?:\/\/)(localhost|127\.0\.0\.1)(?=[:/]|$)/i, `$1${ANDROID_EMULATOR_HOST}`);
  }
}

function localBackendCandidates() {
  const hostIp = expoHostIp();
  const candidates: string[] = [];

  if (Platform.OS === 'android') {
    if (hostIp) {
      candidates.push(`http://${hostIp}:${DEFAULT_BACKEND_PORT}`);
    }

    candidates.push(`http://${ANDROID_EMULATOR_HOST}:${DEFAULT_BACKEND_PORT}`);
  } else {
    candidates.push(`http://localhost:${DEFAULT_BACKEND_PORT}`);
  }

  return candidates;
}

function configuredBackendUrl() {
  return firstDefined(
    processEnv.EXPO_BACKEND_URL,
    processEnv.EXPO_PUBLIC_BACKEND_URL,
    processEnv['app.baseURL'],
    extra.EXPO_BACKEND_URL,
    extra.EXPO_PUBLIC_BACKEND_URL,
    extra.backendUrl,
    extra.baseURL,
    extra['app.baseURL'],
  );
}

export function backendUrlCandidates() {
  const configuredUrl = configuredBackendUrl();
  const candidates: string[] = [];

  if (configuredUrl) {
    candidates.push(normalizeAndroidLocalhostUrl(configuredUrl));
  }

  if (!configuredUrl || isLocalDevelopmentHost(hostnameFromUrl(configuredUrl))) {
    candidates.push(...localBackendCandidates());
  }

  return unique(candidates.length > 0 ? candidates : [defaultLocalUrl(DEFAULT_BACKEND_PORT)]);
}

export const appEnv = {
  frontendUrl: trimTrailingSlash(
    normalizeAndroidLocalhostUrl(
      firstDefined(processEnv.EXPO_FRONTEND_URL, processEnv.EXPO_PUBLIC_FRONTEND_URL, extra.EXPO_FRONTEND_URL, extra.frontendUrl) ??
        defaultLocalUrl(DEFAULT_FRONTEND_PORT),
    ),
  ),
  get backendUrl() {
    return backendUrlCandidates()[0];
  },
} as const;
