import Constants from 'expo-constants';

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

function backendBaseUrl() {
  const { extra, processEnv } = runtimeEnv();

  return trimTrailingSlash(
    firstDefined(
      processEnv.EXPO_BACKEND_URL,
      processEnv.EXPO_PUBLIC_BACKEND_URL,
      processEnv['app.baseURL'],
      extra.EXPO_BACKEND_URL,
      extra.EXPO_PUBLIC_BACKEND_URL,
      extra.backendUrl,
      extra.baseURL,
      extra['app.baseURL'],
    ) ?? 'http://localhost:8080',
  );
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
    return { message: text };
  }
}

export async function apiRequest<T>(paths: string | readonly string[], options: ApiRequestOptions = {}): Promise<T> {
  const candidatePaths = Array.isArray(paths) ? paths : [paths];
  let lastError: unknown;

  for (const path of candidatePaths) {
    try {
      const isFormData = isFormDataBody(options.body);
      const headers = cleanHeaders({
        Accept: 'application/json',
        ...options.headers,
      });

      if (options.body !== undefined && options.body !== null && !isFormData && typeof options.body !== 'string') {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(normalizePath(path), {
        method: options.method ?? 'GET',
        headers,
        body: bodyToRequest(options.body),
      });

      const payload = await parseResponse(response);
      const envelope = isRecord(payload) ? (payload as ApiEnvelope<T>) : undefined;
      const message = typeof envelope?.message === 'string' ? envelope.message : 'Request failed.';

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

  throw lastError instanceof Error ? lastError : new Error('Unable to connect to the backend.');
}
