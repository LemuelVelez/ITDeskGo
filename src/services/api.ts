import Constants from 'expo-constants';
import { Platform } from 'react-native';

type RuntimeEnv = Record<string, string | undefined>;

type ApiEnvelope<T> = {
  status?: string;
  message?: string;
  data?: T;
  errors?: unknown;
};

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string | undefined>;
};

const DEPLOYED_BACKEND_URL = 'https://itdeskgo-api.jrmsu-tc.tech';
const DEFAULT_BACKEND_PORT = '8080';
const ANDROID_EMULATOR_HOST = '10.0.2.2';

export class ApiError extends Error {
  status: number;
  errors?: unknown;

  constructor(message: string, status: number, errors?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

function runtimeEnv() {
  const extra = (Constants.expoConfig?.extra ?? {}) as RuntimeEnv;
  const processEnv =
    ((globalThis as unknown as { process?: { env?: RuntimeEnv } }).process?.env ?? {}) as RuntimeEnv;

  return { extra, processEnv };
}

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

function localBackendUrl() {
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

function useLocalBackend(extra: RuntimeEnv, processEnv: RuntimeEnv) {
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

function backendBaseUrl() {
  const { extra, processEnv } = runtimeEnv();
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
  const localRequested = useLocalBackend(extra, processEnv);
  const selectedUrl =
    configuredUrl && (!isLocalBackendUrl(configuredUrl) || localRequested)
      ? configuredUrl
      : localRequested
        ? configuredUrl ?? localBackendUrl()
        : DEPLOYED_BACKEND_URL;

  return trimTrailingSlash(normalizeAndroidLocalhostUrl(selectedUrl));
}

export const appEnv = {
  get backendUrl() {
    return backendBaseUrl();
  },
} as const;

function normalizePath(path: string) {
  let cleanPath = path.trim().replace(/^\/+/, '');
  const cleanBase = backendBaseUrl();

  if (cleanBase.endsWith('/api') && cleanPath.startsWith('api/')) {
    cleanPath = cleanPath.slice(4);
  }

  return `${cleanBase}/${cleanPath}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFormDataBody(body: unknown): body is FormData {
  return typeof FormData !== 'undefined' && body instanceof FormData;
}

function bodyToRequest(body: unknown): BodyInit | null | undefined {
  if (body === undefined || body === null) {
    return body;
  }

  if (typeof body === 'string' || isFormDataBody(body)) {
    return body;
  }

  return JSON.stringify(body);
}

function cleanHeaders(headers: Record<string, string | undefined>) {
  return Object.fromEntries(
    Object.entries(headers).filter((entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].length > 0),
  );
}

async function parseResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    const message = text.replace(/\s+/g, ' ').trim();

    return { message: message.length > 180 ? `${message.slice(0, 177)}...` : message };
  }
}

function connectionErrorMessage(attemptedUrls: string[]) {
  return `Unable to connect to the backend. Checked ${attemptedUrls.join(', ')}.`;
}

function serverErrorMessage(message: string) {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes('unable to connect to the database') ||
    lowerMessage.includes('mysqli') ||
    lowerMessage.includes('php_network_getaddresses') ||
    lowerMessage.includes('getaddrinfo') ||
    lowerMessage.includes('database')
  ) {
    return 'The backend is online, but its database connection is not available. Please check the backend database environment variables in Coolify.';
  }

  return message;
}

export async function apiRequest<T>(paths: string | readonly string[], options: ApiRequestOptions = {}): Promise<T> {
  const candidatePaths = Array.isArray(paths) ? paths : [paths];
  const attemptedUrls: string[] = [];
  let lastError: unknown;

  for (const path of candidatePaths) {
    const url = normalizePath(path);

    attemptedUrls.push(url);

    try {
      const isFormData = isFormDataBody(options.body);
      const headers = cleanHeaders({
        Accept: 'application/json',
        ...options.headers,
      });

      if (options.body !== undefined && options.body !== null && !isFormData && typeof options.body !== 'string') {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(url, {
        method: options.method ?? 'GET',
        headers,
        body: bodyToRequest(options.body),
      });

      const payload = await parseResponse(response);
      const envelope = isRecord(payload) ? (payload as ApiEnvelope<T>) : undefined;
      const rawMessage = typeof envelope?.message === 'string' ? envelope.message : 'Request failed.';
      const message = serverErrorMessage(rawMessage);

      if (!response.ok) {
        throw new ApiError(message, response.status, envelope?.errors);
      }

      if (envelope?.status === 'error') {
        throw new ApiError(message, response.status, envelope.errors);
      }

      if (envelope && Object.prototype.hasOwnProperty.call(envelope, 'data')) {
        return envelope.data as T;
      }

      return payload as T;
    } catch (error) {
      lastError = error;

      if (error instanceof ApiError && error.status !== 404) {
        throw error;
      }
    }
  }

  if (lastError instanceof ApiError) {
    throw lastError;
  }

  throw new Error(connectionErrorMessage(attemptedUrls));
}
