import Constants from 'expo-constants';

type RuntimeEnv = Record<string, string | undefined>;

const extra = (Constants.expoConfig?.extra ?? {}) as RuntimeEnv;
const processEnv =
  ((globalThis as unknown as { process?: { env?: RuntimeEnv } }).process?.env ?? {}) as RuntimeEnv;

function firstDefined(...values: Array<string | undefined>) {
  return values.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim();
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

export const appEnv = {
  frontendUrl: trimTrailingSlash(
    firstDefined(processEnv.EXPO_FRONTEND_URL, processEnv.EXPO_PUBLIC_FRONTEND_URL, extra.EXPO_FRONTEND_URL, extra.frontendUrl) ??
      'http://localhost:8081',
  ),
  backendUrl: trimTrailingSlash(
    firstDefined(processEnv.EXPO_BACKEND_URL, processEnv.EXPO_PUBLIC_BACKEND_URL, extra.EXPO_BACKEND_URL, extra.backendUrl) ??
      'http://localhost:8080',
  ),
} as const;
