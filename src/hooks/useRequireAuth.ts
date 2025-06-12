import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import type { Session } from '@supabase/supabase-js';

export type RequireAuthResult = Session | null | undefined;

export const useRequireAuth = (): RequireAuthResult => {
  const { session }: { session: Session | null | undefined } = useAuth();
  return session;
};
