import { AppTabs } from '../../components/AppTabs';

const adminTabs = [
  { name: 'dashboard', title: 'Dashboard', icon: 'dashboard' },
  { name: 'users', title: 'Users', icon: 'users' },
  { name: 'tickets', title: 'Tickets', icon: 'tickets' },
  { name: 'assets', title: 'Assets', icon: 'assets' },
  { name: 'settings', title: 'Settings', icon: 'settings' },
] as const;

export default function AdminTabsLayout() {
  return <AppTabs tabs={adminTabs} />;
}
