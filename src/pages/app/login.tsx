import * as React from 'react';
import { useState } from 'react';
import { Box, Button, Center, Input, VStack, Text } from '@chakra-ui/react';
import { navigate, Link } from 'gatsby';
import { supabase } from '@/lib/supabaseClient';

interface RouteProps {
  path?: string;
}

const LoginPage: React.FC<RouteProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setError(null);
      navigate('/app/profile');
    }
  };

  return (
    <Center minH="100vh" bg="gray.50">
      <Box p={8} borderRadius="lg" boxShadow="md" bg="white">
        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
            <Button type="submit" colorScheme="green" width="full">
              Login
            </Button>
            <Text fontSize="sm">
              Don't have an account? <Link to="/register">Register</Link>
            </Text>
            <Text fontSize="sm">
              <Link to="/forgot-password">Forgot password?</Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Center>
  );
};

export default LoginPage;
