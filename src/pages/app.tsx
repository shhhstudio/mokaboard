import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import { useAuth } from '@/providers/AuthProvider';

const App: React.FC = () => {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      navigate(session ? '/app/profile' : '/app/login');
    }
  }, [loading, session]);

  return null;
};

export default App;
