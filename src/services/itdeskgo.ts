import type { Asset, KnowledgeArticle, Metric, RoleKey, SettingsItem, Ticket, User } from '../constants/app';
import type { AuthSession } from './auth';
import { apiRequest } from './api';

type RawRecord = Record<string, unknown>;

type PaginatedResponse = {
  items?: unknown[];
  meta?: unknown;
};

export type DashboardSummary = RawRecord;

type RequestAuth = {
  token?: string;
  userId?: string;
};

function isRecord(value: unknown): value is RawRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown, fallback = '') {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return fallback;
}

function numberValue(value: unknown, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
    return Number(value);
  }

  return fallback;
}

function titleCase(value: string) {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function firstString(record: RawRecord, keys: string[], fallback = '') {
  for (const key of keys) {
    const value = stringValue(record[key]);

    if (value !== '') {
      return value;
    }
  }

  return fallback;
}

function queryString(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();

  return query ? `?${query}` : '';
}

function listFromResponse(response: unknown, keys: string[] = []) {
  if (Array.isArray(response)) {
    return response;
  }

  if (!isRecord(response)) {
    return [];
  }

  const paginated = response as PaginatedResponse;

  if (Array.isArray(paginated.items)) {
    return paginated.items;
  }

  for (const key of keys) {
    const value = response[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function authHeaders(auth?: RequestAuth) {
  return {
    Authorization: auth?.token ? `Bearer ${auth.token}` : undefined,
    'X-User-Id': auth?.userId,
  };
}

export function userIdFromSession(session: AuthSession | null) {
  const id = session?.user.id;

  if (typeof id === 'number' || typeof id === 'string') {
    return String(id);
  }

  return undefined;
}

export function authFromSession(session: AuthSession | null): RequestAuth {
  return {
    token: session?.token || undefined,
    userId: userIdFromSession(session),
  };
}

function displayDate(record: RawRecord) {
  return firstString(record, ['updated_at', 'updatedAt', 'created_at', 'createdAt', 'published_at', 'assigned_at'], 'Recently');
}

function normalizeTicket(record: unknown): Ticket {
  const item = isRecord(record) ? record : {};
  const status = titleCase(firstString(item, ['status'], 'Pending'));
  const priority = titleCase(firstString(item, ['priority_name', 'priority', 'priority_label'], 'Medium'));
  const requester = firstString(item, ['requester_name', 'requester', 'created_by_name', 'name'], 'Unassigned requester');

  return {
    id: firstString(item, ['ticket_number', 'ticket_no', 'code', 'id'], 'TCK'),
    title: firstString(item, ['subject', 'title', 'name'], 'Untitled ticket'),
    category: firstString(item, ['category_name', 'category', 'category_label'], 'General'),
    requester,
    status,
    priority,
    updatedAt: displayDate(item),
  };
}

function normalizeArticle(record: unknown): KnowledgeArticle {
  const item = isRecord(record) ? record : {};

  return {
    id: firstString(item, ['id', 'slug'], 'KB'),
    title: firstString(item, ['title', 'name'], 'Untitled article'),
    category: firstString(item, ['category_name', 'category', 'category_label'], 'Knowledge Base'),
    readTime: firstString(item, ['read_time', 'readTime'], 'Article'),
    summary: firstString(item, ['summary', 'description', 'content'], 'No summary provided.'),
  };
}

function normalizeAsset(record: unknown): Asset {
  const item = isRecord(record) ? record : {};
  const status = titleCase(firstString(item, ['status'], 'Available'));

  return {
    id: firstString(item, ['asset_tag', 'tag', 'code', 'id'], 'AST'),
    name: firstString(item, ['name', 'asset_name', 'asset_type_name', 'model'], 'Unnamed asset'),
    assignedTo: firstString(item, ['assigned_to_name', 'assigned_user_name', 'assigned_to', 'user_name'], 'Not assigned'),
    status,
    serial: firstString(item, ['serial_number', 'serial', 'asset_tag'], 'No serial number'),
  };
}

function normalizeUser(record: unknown): User {
  const item = isRecord(record) ? record : {};
  const firstName = firstString(item, ['first_name']);
  const lastName = firstString(item, ['last_name']);
  const combinedName = [firstName, lastName].filter(Boolean).join(' ');

  return {
    id: firstString(item, ['id', 'user_id'], 'USR'),
    name: firstString(item, ['name', 'full_name'], combinedName || 'Unnamed user'),
    role: titleCase(firstString(item, ['role_name', 'role_slug', 'role'], 'Employee')),
    department: firstString(item, ['department_name', 'department'], 'No department'),
    status: titleCase(firstString(item, ['status'], 'Active')),
  };
}

function dashboardNumber(summary: DashboardSummary | null, path: string[], fallback = 0) {
  let current: unknown = summary;

  for (const segment of path) {
    if (!isRecord(current)) {
      return fallback;
    }

    current = current[segment];
  }

  return numberValue(current, fallback);
}

export function dashboardMetrics(role: RoleKey, summary: DashboardSummary | null): Metric[] {
  if (role === 'admin') {
    return [
      { label: 'Users', value: String(dashboardNumber(summary, ['users', 'total'])), tone: 'blue' },
      { label: 'Assets', value: String(dashboardNumber(summary, ['assets', 'total'])), tone: 'yellow' },
      { label: 'Tickets', value: String(dashboardNumber(summary, ['tickets', 'total'])), tone: 'white' },
    ];
  }

  if (role === 'itStaff') {
    return [
      { label: 'Assigned Tickets', value: String(dashboardNumber(summary, ['tickets', 'assigned_to_me'])), tone: 'blue' },
      { label: 'On Hold', value: String(dashboardNumber(summary, ['tickets', 'on_hold'])), tone: 'yellow' },
      { label: 'Resolved Today', value: String(dashboardNumber(summary, ['tickets', 'resolved_today'])), tone: 'white' },
    ];
  }

  return [
    { label: 'Open Tickets', value: String(dashboardNumber(summary, ['tickets', 'open'])), tone: 'blue' },
    { label: 'Assigned Assets', value: String(dashboardNumber(summary, ['assets', 'assigned'])), tone: 'yellow' },
    { label: 'Articles', value: String(dashboardNumber(summary, ['knowledge_base', 'published'])), tone: 'white' },
  ];
}

export async function fetchDashboard(role: RoleKey, auth?: RequestAuth): Promise<DashboardSummary> {
  const userId = auth?.userId;
  const headers = authHeaders(auth);

  if (role === 'admin') {
    return apiRequest<DashboardSummary>(['api/dashboard/admin', 'dashboard/admin'], { headers });
  }

  if (role === 'itStaff') {
    const userQuery = queryString({ user_id: userId });

    return apiRequest<DashboardSummary>([
      userId ? `api/dashboard/staff/${userId}` : 'api/dashboard/staff',
      `api/dashboard/staff${userQuery}`,
      userId ? `dashboard/staff/${userId}` : 'dashboard/staff',
      `dashboard/staff${userQuery}`,
    ], { headers });
  }

  const userQuery = queryString({ user_id: userId });

  return apiRequest<DashboardSummary>([
    userId ? `api/dashboard/employee/${userId}` : 'api/dashboard/employee',
    `api/dashboard/employee${userQuery}`,
    userId ? `dashboard/employee/${userId}` : 'dashboard/employee',
    `dashboard/employee${userQuery}`,
  ], { headers });
}

export async function fetchTickets(role: RoleKey, auth?: RequestAuth, limit = 20): Promise<Ticket[]> {
  const params = queryString({
    per_page: limit,
    requester_id: role === 'employee' ? auth?.userId : undefined,
    assignee_id: role === 'itStaff' ? auth?.userId : undefined,
  });

  const response = await apiRequest<unknown>([`api/tickets${params}`, `tickets${params}`], {
    headers: authHeaders(auth),
  });

  return listFromResponse(response, ['tickets']).map(normalizeTicket);
}

export async function fetchAssets(role: RoleKey, auth?: RequestAuth, limit = 20): Promise<Asset[]> {
  const params = queryString({
    per_page: limit,
    assigned_to: role === 'employee' ? auth?.userId : undefined,
  });

  const response = await apiRequest<unknown>([`api/assets${params}`, `assets${params}`], {
    headers: authHeaders(auth),
  });

  return listFromResponse(response, ['assets']).map(normalizeAsset);
}

export async function fetchKnowledgeArticles(role: RoleKey, auth?: RequestAuth, limit = 20): Promise<KnowledgeArticle[]> {
  const params = queryString({
    per_page: limit,
    status: role === 'employee' ? 'published' : undefined,
  });

  const response = await apiRequest<unknown>([
    `api/knowledge-base${params}`,
    `api/knowledge-base/articles${params}`,
    `api/kb/articles${params}`,
    `knowledge-base${params}`,
    `knowledge-base/articles${params}`,
  ], {
    headers: authHeaders(auth),
  });

  return listFromResponse(response, ['articles', 'knowledge_base']).map(normalizeArticle);
}

export async function fetchUsers(auth?: RequestAuth, limit = 20): Promise<User[]> {
  const params = queryString({ per_page: limit });
  const response = await apiRequest<unknown>([`api/users${params}`, `users${params}`], {
    headers: authHeaders(auth),
  });

  return listFromResponse(response, ['users']).map(normalizeUser);
}

function countArrayField(record: RawRecord, key: string) {
  const value = record[key];

  if (Array.isArray(value)) {
    return value.length;
  }

  if (isRecord(value)) {
    return Object.keys(value).length;
  }

  return 0;
}

export async function fetchSettingsItems(auth?: RequestAuth): Promise<SettingsItem[]> {
  const response = await apiRequest<unknown>(['api/settings', 'settings'], {
    headers: authHeaders(auth),
  });
  const settings = isRecord(response) ? response : {};

  return [
    {
      id: 'SET-001',
      title: 'Ticket Workflow',
      description: `${countArrayField(settings, 'ticket_statuses')} ticket statuses and ${countArrayField(settings, 'user_statuses')} user statuses loaded from the backend.`,
    },
    {
      id: 'SET-002',
      title: 'Knowledge Base',
      description: `${countArrayField(settings, 'kb_statuses')} knowledge base statuses loaded from the backend configuration.`,
    },
    {
      id: 'SET-003',
      title: 'Asset Tracking',
      description: `${countArrayField(settings, 'asset_statuses')} asset statuses loaded from the backend configuration.`,
    },
  ];
}

export function highPriorityTicket(ticket: Ticket) {
  return ticket.priority.toLowerCase() === 'high';
}
