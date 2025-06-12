import { useEffect } from 'react';
import { navigate } from 'gatsby';
import { useAuth } from '@/providers/AuthProvider';
import type { Session } from '@supabase/supabase-js';

export type RequireAuthResult = Session | undefined;

export const useRequireAuth = (): RequireAuthResult => {
  const { session, loading }: { session: Session | null; loading: boolean } = useAuth();

  if (loading === true) {
    return undefined;
  }
  return session || undefined;
};
