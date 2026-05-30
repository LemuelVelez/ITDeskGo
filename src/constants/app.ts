export type RoleKey = 'employee' | 'itStaff' | 'admin';

export type Metric = {
  label: string;
  value: string;
  tone: 'blue' | 'yellow' | 'white';
};

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Pending';

export type TicketPriority = 'Low' | 'Medium' | 'High';

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
  status: 'Assigned' | 'Available' | 'Maintenance';
  serial: string;
};

export type User = {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'Invited' | 'Suspended';
};

export const roleLabels: Record<RoleKey, string> = {
  employee: 'Employee',
  itStaff: 'IT Staff',
  admin: 'Admin',
};

export const employeeMetrics: Metric[] = [
  { label: 'Open Tickets', value: '3', tone: 'blue' },
  { label: 'Assigned Assets', value: '4', tone: 'yellow' },
  { label: 'Saved Articles', value: '12', tone: 'white' },
];

export const staffMetrics: Metric[] = [
  { label: 'Queue', value: '18', tone: 'blue' },
  { label: 'SLA Risk', value: '5', tone: 'yellow' },
  { label: 'Resolved Today', value: '11', tone: 'white' },
];

export const adminMetrics: Metric[] = [
  { label: 'Users', value: '248', tone: 'blue' },
  { label: 'Assets', value: '412', tone: 'yellow' },
  { label: 'Monthly Tickets', value: '1.2K', tone: 'white' },
];

export const tickets: Ticket[] = [
  {
    id: 'TCK-1001',
    title: 'Unable to connect to office Wi-Fi',
    category: 'Network',
    requester: 'Maria Santos',
    status: 'Open',
    priority: 'High',
    updatedAt: 'Today, 9:15 AM',
  },
  {
    id: 'TCK-1002',
    title: 'Laptop battery replacement request',
    category: 'Hardware',
    requester: 'John Lee',
    status: 'In Progress',
    priority: 'Medium',
    updatedAt: 'Today, 10:42 AM',
  },
  {
    id: 'TCK-1003',
    title: 'Reset email account password',
    category: 'Account',
    requester: 'Aisha Khan',
    status: 'Resolved',
    priority: 'Low',
    updatedAt: 'Yesterday, 4:20 PM',
  },
];

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'KB-001',
    title: 'How to submit an IT support ticket',
    category: 'Helpdesk',
    readTime: '3 min read',
    summary: 'Step-by-step guide for reporting issues, adding screenshots, and tracking request status.',
  },
  {
    id: 'KB-002',
    title: 'Troubleshooting common Wi-Fi issues',
    category: 'Network',
    readTime: '5 min read',
    summary: 'Basic checks for device connectivity, saved networks, VPN, and router availability.',
  },
  {
    id: 'KB-003',
    title: 'Asset care and return policy',
    category: 'Assets',
    readTime: '4 min read',
    summary: 'Guidelines for keeping assigned devices secure and returning equipment properly.',
  },
];

export const assets: Asset[] = [
  {
    id: 'AST-2201',
    name: 'Dell Latitude 5440',
    assignedTo: 'Maria Santos',
    status: 'Assigned',
    serial: 'DL-5440-8821',
  },
  {
    id: 'AST-2202',
    name: 'HP LaserJet Pro',
    assignedTo: 'IT Storage',
    status: 'Available',
    serial: 'HP-LJ-5510',
  },
  {
    id: 'AST-2203',
    name: 'Lenovo ThinkPad E14',
    assignedTo: 'Repair Desk',
    status: 'Maintenance',
    serial: 'LN-E14-4408',
  },
];

export const users: User[] = [
  {
    id: 'USR-001',
    name: 'Maria Santos',
    role: 'Employee',
    department: 'Finance',
    status: 'Active',
  },
  {
    id: 'USR-002',
    name: 'Daniel Cruz',
    role: 'IT Staff',
    department: 'Information Technology',
    status: 'Active',
  },
  {
    id: 'USR-003',
    name: 'Aisha Khan',
    role: 'Employee',
    department: 'Human Resources',
    status: 'Invited',
  },
];

export const settings = [
  {
    id: 'SET-001',
    title: 'Ticket Categories',
    description: 'Manage helpdesk categories, priorities, and routing rules.',
  },
  {
    id: 'SET-002',
    title: 'Knowledge Base Review',
    description: 'Approve articles before they become visible to employees.',
  },
  {
    id: 'SET-003',
    title: 'Asset Tracking Rules',
    description: 'Configure asset status, assignment approval, and return process.',
  },
];
