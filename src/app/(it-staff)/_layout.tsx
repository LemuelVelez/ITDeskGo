import { AppTabs } from '../../components/AppTabs';

const itStaffTabs = [
  { name: 'dashboard', title: 'Dashboard', icon: 'dashboard' },
  { name: 'tickets', title: 'Tickets', icon: 'tickets' },
  { name: 'assets', title: 'Assets', icon: 'assets' },
  { name: 'knowledge-base', title: 'Knowledge', icon: 'knowledge' },
  { name: 'profile', title: 'Profile', icon: 'profile' },
] as const;

export default function ITStaffTabsLayout() {
  return <AppTabs tabs={itStaffTabs} />;
}
