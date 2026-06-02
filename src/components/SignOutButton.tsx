import { useRouter } from 'expo-router';
import type { ComponentProps } from 'react';

import { useAuth } from '../context/AuthContext';
import { AppButton } from './AppButton';

type SignOutButtonProps = Pick<ComponentProps<typeof AppButton>, 'style' | 'variant'> & {
  title?: string;
};

export function SignOutButton({ title = 'Sign Out', variant = 'ghost', style }: SignOutButtonProps) {
  const router = useRouter();
  const { signOut } = useAuth();

  function handleSignOut() {
    signOut();
    router.replace('/login');
  }

  return <AppButton title={title} variant={variant} style={style} onPress={handleSignOut} />;
}
