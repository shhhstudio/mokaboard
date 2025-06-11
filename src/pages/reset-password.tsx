import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Button, Center, Input, VStack, Text } from '@chakra-ui/react';
import { navigate, Link } from 'gatsby';
import { useLocation } from '@reach/router';
import { supabase } from '@/lib/supabaseClient';

const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const errorDesc = params.get('error_description');
    if (errorDesc) {
      setError(errorDesc.replace(/\+/g, ' '));
      setLoading(false);
      return;
    }
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type');
    if (accessToken && refreshToken && type === 'recovery') {
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ error }) => {
          if (error) setError(error.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [location.hash]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      navigate('/app/login');
    }
  };

  if (loading) {
    return <Center minH="100vh">Loading...</Center>;
  }

  if (error) {
    return (
      <Center minH="100vh" bg="gray.50">
        <VStack spacing={4} p={8} bg="white" borderRadius="lg" boxShadow="md">
          <Text color="red.500">{error}</Text>
          <Link to="/forgot-password">Request a new link</Link>
        </VStack>
      </Center>
    );
  }

  return (
    <Center minH="100vh" bg="gray.50">
      <Box p={8} borderRadius="lg" boxShadow="md" bg="white">
        <form onSubmit={handleUpdate}>
          <VStack spacing={4}>
            <Input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
            <Button type="submit" colorScheme="green" width="full">
              Update password
            </Button>
          </VStack>
        </form>
      </Box>
    </Center>
  );
};

export default ResetPasswordPage;
