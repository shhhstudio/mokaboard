import * as React from 'react';
import { Box, Button, Center, Heading, Text } from '@chakra-ui/react';
import { navigate } from 'gatsby';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { supabase } from '@/lib/supabaseClient';
import type { RequireAuthResult } from '@/hooks/useRequireAuth';
import type { Session } from '@supabase/supabase-js';

interface RouteProps {
  path?: string;
  default?: boolean;
}

export const Profile: React.FC<RouteProps> = () => {
  const session = useRequireAuth();

  if (!session) throw new Error('Session should never be undefined here');

  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
    navigate('/app/login');
  };

  return (
    <Center minH="100vh" bg="gray.50">
      <Box p={8} borderRadius="lg" boxShadow="md" bg="white" textAlign="center">
        <Heading size="lg" mb={4}>
          Profile
        </Heading>
        <Text>Email: {session.user.email}</Text>
        <Button mt={6} colorScheme="green" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Center>
  );
};

