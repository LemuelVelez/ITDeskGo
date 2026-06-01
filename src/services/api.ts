import { appEnv, backendUrlCandidates } from '../config/env';

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

export { appEnv };

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

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function normalizePath(baseUrl: string, path: string) {
  let cleanPath = path.trim().replace(/^\/+/, '');
  const cleanBase = trimTrailingSlash(baseUrl);

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

function isNetworkError(error: unknown) {
  if (error instanceof ApiError) {
    return false;
  }

  if (!(error instanceof Error)) {
    return true;
  }

  return /network request failed|fetch failed|failed to fetch|load failed|connectexception/i.test(error.message);
}

function connectionMessage(urls: string[]) {
  return `Unable to connect to the backend. Checked ${urls.join(', ')}. Make sure CodeIgniter is running on 0.0.0.0:8080 and your phone/emulator can reach the same network.`;
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

async function sendRequest<T>(url: string, options: ApiRequestOptions): Promise<T> {
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
}

export async function apiRequest<T>(paths: string | readonly string[], options: ApiRequestOptions = {}): Promise<T> {
  const candidatePaths = Array.isArray(paths) ? paths : [paths];
  const baseUrls = backendUrlCandidates();
  let lastError: unknown;
  let lastApiError: ApiError | undefined;
  const attemptedUrls: string[] = [];

  for (const baseUrl of baseUrls) {
    for (const path of candidatePaths) {
      const url = normalizePath(baseUrl, path);
      attemptedUrls.push(url);

      try {
        return await sendRequest<T>(url, options);
      } catch (error) {
        lastError = error;

        if (error instanceof ApiError) {
          lastApiError = error;

          if (error.status !== 404) {
            throw error;
          }
        }
      }
    }
  }

  if (lastApiError) {
    throw lastApiError;
  }

  if (isNetworkError(lastError)) {
    throw new ApiError(connectionMessage(attemptedUrls), 0, lastError);
  }

  throw lastError instanceof Error ? lastError : new Error('Unable to connect to the backend.');
}
