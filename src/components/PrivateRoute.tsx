import React from 'react';
import { navigate } from 'gatsby';
import { useAuth } from '@/providers/AuthProvider';

interface PrivateRouteProps {
  component: React.ComponentType<any>;
  location: Location;
  path: string;
  [key: string]: any;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, location, ...rest }) => {
  const { session, loading } = useAuth();

  if (!loading && !session && location.pathname !== '/app/login') {
    navigate('/app/login');
    return null;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
