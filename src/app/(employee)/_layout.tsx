import { AppTabs } from '../../components/AppTabs';

const employeeTabs = [
  { name: 'home', title: 'Home', icon: 'home' },
  { name: 'tickets', title: 'Tickets', icon: 'tickets' },
  { name: 'knowledge-base', title: 'Knowledge', icon: 'knowledge' },
  { name: 'assets', title: 'Assets', icon: 'assets' },
  { name: 'profile', title: 'Profile', icon: 'profile' },
] as const;

export default function EmployeeTabsLayout() {
  return <AppTabs tabs={employeeTabs} />;
}
