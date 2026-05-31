import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import type { RoleKey } from '../constants/app';
import { login, requestPasswordReset, type AuthSession, type LoginPayload } from '../services/auth';

type AuthContextValue = {
  session: AuthSession | null;
  user: AuthSession['user'] | null;
  role: RoleKey | null;
  isAuthenticated: boolean;
  signIn: (payload: LoginPayload) => Promise<AuthSession>;
  signOut: () => void;
  requestPasswordReset: (email: string) => Promise<string>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      role: session?.role ?? null,
      isAuthenticated: Boolean(session),
      signIn: async (payload) => {
        const nextSession = await login(payload);
        setSession(nextSession);
        return nextSession;
      },
      signOut: () => setSession(null),
      requestPasswordReset,
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}
