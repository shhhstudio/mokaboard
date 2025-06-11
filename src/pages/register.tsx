import * as React from 'react';
import { useState } from 'react';
import { Box, Button, Center, Input, VStack, Text } from '@chakra-ui/react';
import { navigate, Link } from 'gatsby';
import { supabase } from '@/lib/supabaseClient';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setError(null);
      navigate('/');
    }
  };

  return (
    <Center minH="100vh" bg="gray.50">
      <Box p={8} borderRadius="lg" boxShadow="md" bg="white">
        <form onSubmit={handleRegister}>
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
              Register
            </Button>
            <Text fontSize="sm">
              Already have an account? <Link to="/app/login">Login</Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Center>
  );
};

export default RegisterPage;
