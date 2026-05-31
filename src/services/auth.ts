import { RoleKey, roleLabels } from '../constants/app';
import { apiRequest } from './api';

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthenticatedUser = Record<string, unknown> & {
  id?: number | string;
  email?: string;
  name?: string;
  role?: string;
  role_key?: RoleKey;
};

export type AuthSession = {
  token: string;
  role: RoleKey;
  route: string;
  tabs: string[];
  user: AuthenticatedUser;
};

type BackendRole = string | Record<string, unknown> | null | undefined;

type LoginApiData = {
  token?: string;
  user?: AuthenticatedUser;
  role?: BackendRole;
  role_key?: string;
  role_slug?: string;
  role_name?: string;
  tabs?: string[];
};

export const roleRoutes: Record<RoleKey, string> = {
  employee: '/(employee)/home',
  itStaff: '/(it-staff)/dashboard',
  admin: '/(admin)/dashboard',
};

export function getRouteForRole(role: RoleKey) {
  return roleRoutes[role];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function valueToString(value: unknown) {
  return typeof value === 'string' ? value : undefined;
}

function roleToString(role: BackendRole) {
  if (typeof role === 'string') {
    return role;
  }

  if (isRecord(role)) {
    return valueToString(role.slug) ?? valueToString(role.name) ?? valueToString(role.role) ?? valueToString(role.key);
  }

  return undefined;
}

export function normalizeRole(...candidates: unknown[]): RoleKey {
  const rawRole = candidates
    .map((candidate) => roleToString(candidate as BackendRole) ?? valueToString(candidate))
    .find((candidate): candidate is string => typeof candidate === 'string' && candidate.trim().length > 0);

  const role = rawRole?.trim().toLowerCase().replace(/[\s-]+/g, '_') ?? '';

  if (['admin', 'administrator', 'superadmin', 'super_admin'].includes(role)) {
    return 'admin';
  }

  if (['it_staff', 'itstaff', 'staff', 'technician', 'support_staff', 'support'].includes(role)) {
    return 'itStaff';
  }

  return 'employee';
}

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const data = await apiRequest<LoginApiData>(['api/auth/login', 'auth/login'], {
    method: 'POST',
    body: {
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    },
  });

  const user = isRecord(data.user) ? data.user : {};
  const role = normalizeRole(data.role_key, data.role_slug, data.role_name, data.role, user.role_key, user.role_slug, user.role_name, user.role);

  return {
    token: data.token ?? '',
    role,
    route: getRouteForRole(role),
    tabs: Array.isArray(data.tabs) ? data.tabs : [],
    user: {
      ...user,
      role,
      role_key: role,
      role_label: roleLabels[role],
    },
  };
}

export async function requestPasswordReset(email: string) {
  await apiRequest(['api/auth/forgot-password', 'auth/forgot-password'], {
    method: 'POST',
    body: {
      email: email.trim().toLowerCase(),
    },
  });

  return 'If the email exists, password reset instructions will be prepared.';
}
