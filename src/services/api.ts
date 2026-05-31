import { appEnv } from '../config/env';

type ApiEnvelope<T> = {
  status?: string;
  message?: string;
  data?: T;
  errors?: unknown;
};

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
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

function normalizePath(path: string) {
  let cleanPath = path.trim().replace(/^\/+/, '');
  const cleanBase = appEnv.backendUrl.replace(/\/+$/, '');

  if (cleanBase.endsWith('/api') && cleanPath.startsWith('api/')) {
    cleanPath = cleanPath.slice(4);
  }

  return `${cleanBase}/${cleanPath}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFormDataBody(body: unknown) {
  return typeof FormData !== 'undefined' && body instanceof FormData;
}

function bodyToRequest(body: unknown) {
  if (body === undefined) {
    return undefined;
  }

  if (typeof body === 'string' || isFormDataBody(body)) {
    return body;
  }

  return JSON.stringify(body);
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
      const headers: Record<string, string> = {
        Accept: 'application/json',
        ...options.headers,
      };

      if (options.body !== undefined && !isFormData && typeof options.body !== 'string') {
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
