import { useEffect } from 'react';
import { navigate } from 'gatsby';
import { useAuth } from '@/providers/AuthProvider';

export const useRequireAuth = () => {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      navigate('/login');
    }
  }, [loading, session]);

  return { session, loading };
};
