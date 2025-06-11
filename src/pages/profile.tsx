import * as React from 'react';
import { Box, Button, Center, Heading, Text } from '@chakra-ui/react';
import { navigate } from 'gatsby';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabaseClient';

const ProfilePage: React.FC = () => {
  const { session, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && !session) {
      navigate('/login');
    }
  }, [session, loading]);

  if (loading) {
    return null;
  }
  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
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
