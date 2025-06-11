import * as React from 'react';
import { useState } from 'react';
import { Box, Button, Center, Input, VStack, Text } from '@chakra-ui/react';
import { Link } from 'gatsby';
import { supabase } from '@/lib/supabaseClient';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) {
      setError(error.message);
      setMessage(null);
    } else {
      setError(null);
      setMessage('Password reset email sent. Please check your inbox.');
    }
  };

  return (
    <Center minH="100vh" bg="gray.50">
      <Box p={8} borderRadius="lg" boxShadow="md" bg="white">
        <form onSubmit={handleReset}>
          <VStack spacing={4}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
            {message && (
              <Text color="green.500" fontSize="sm">
                {message}
              </Text>
            )}
            <Button type="submit" colorScheme="green" width="full">
              Send reset link
            </Button>
            <Text fontSize="sm">
              Remembered? <Link to="/app/login">Back to login</Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Center>
  );
};

export default ForgotPasswordPage;
