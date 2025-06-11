import React from 'react';
import { Link, navigate } from 'gatsby';
import { Box } from '@chakra-ui/react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabaseClient';

const NavBar: React.FC = () => {
  const { session } = useAuth();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await supabase.auth.signOut();
    navigate('/app/login');
  };

  return (
    <Box display="flex" flex="1" justifyContent="space-between" borderBottom="1px solid #d1c1e0" mb={4}>
      <span>{session ? `Hello ${session.user.email}` : 'You are not logged in'}</span>
      <nav>
        <Link to="/">Home</Link>{' '}
        <Link to="/app/profile">Profile</Link>{' '}
        {session ? (
          <a href="/" onClick={handleLogout}>
            Logout
          </a>
        ) : null}
      </nav>
    </Box>
  );
};

export default NavBar;
