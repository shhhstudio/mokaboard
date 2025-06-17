import React, { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextProps {
  session: Session | null | undefined;
}

const AuthContext = createContext<AuthContextProps>({ session: undefined });

export const useAuth: () => AuthContextProps = () => useContext(AuthContext);

export const useSession: () => Session | null | undefined = () => {
  const { session } = useAuth();
  return session;
}

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    let initialSession: Session | null = null;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      initialSession = data.session;
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => {
      // Ne set que si la session a changé
      if (sess?.access_token !== initialSession?.access_token) {
        setSession(sess);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>;
};
