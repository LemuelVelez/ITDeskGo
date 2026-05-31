export type RoleKey = 'employee' | 'itStaff' | 'admin';

export type Metric = {
  label: string;
  value: string;
  tone: 'blue' | 'yellow' | 'white';
};

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Pending' | string;

export type TicketPriority = 'Low' | 'Medium' | 'High' | string;

export type Ticket = {
  id: string;
  title: string;
  category: string;
  requester: string;
  status: TicketStatus;
  priority: TicketPriority;
  updatedAt: string;
};

export type KnowledgeArticle = {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
};

export type Asset = {
  id: string;
  name: string;
  assignedTo: string;
  status: 'Assigned' | 'Available' | 'Maintenance' | string;
  serial: string;
};

export type User = {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'Invited' | 'Suspended' | string;
};

export type SettingsItem = {
  id: string;
  title: string;
  description: string;
};

export const roleLabels: Record<RoleKey, string> = {
  employee: 'Employee',
  itStaff: 'IT Staff',
  admin: 'Admin',
};
