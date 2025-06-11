import * as React from 'react';
import { Box, Button, Center, Heading, Text } from '@chakra-ui/react';
import { navigate } from 'gatsby';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { supabase } from '@/lib/supabaseClient';

interface RouteProps {
  path?: string;
}

const ProfilePage: React.FC<RouteProps> = () => {
  const { session, loading } = useRequireAuth();

  if (loading) {
    return null;
  }
  if (!session) {
    return null;
  }

  const handleLogout = async () => {
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

export default ProfilePage;
