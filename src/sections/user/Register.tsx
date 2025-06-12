import * as React from 'react';
import { useState } from 'react';
import {
  Button,
  Container,
  Field,
  Heading,
  Input,
  Separator,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { BsArrowRight } from 'react-icons/bs';
import { navigate } from 'gatsby';
import { Link } from '@reach/router';
import { supabase } from '@/lib/supabaseClient';

interface RouteProps {
  path?: string;
}

export const Register: React.FC<RouteProps> = () => {
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
      navigate('/app/login');
    }
  };

  return (
    <Container
      maxW="md"
      py={{ base: '12', md: '24' }}
      minHeight={'100vh'}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Stack gap="8">
        <VStack gap="12">
          <VStack gap="2">
            <Heading size="2xl">Create your account</Heading>
            <Text color="fg.muted">Sign up to get started.</Text>
          </VStack>
        </VStack>
        <Stack gap="6">
          <form onSubmit={handleRegister} style={{ width: '100%' }}>
            <Stack gap="6">
              <Field.Root>
                <Field.Label>Email address</Field.Label>
                <Input
                  type="email"
                  placeholder="me@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Password</Field.Label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field.Root>
              {error && (
                <Text color="red.500" fontSize="sm">
                  {error}
                </Text>
              )}
              <Button type="submit">
                Register <BsArrowRight />
              </Button>
            </Stack>
          </form>
        </Stack>
        <Separator variant="dashed" />
        <Text
          textStyle="sm"
          color="fg.muted"
          textAlign="center"
        >
          Already have an account?{' '}
          <Link
            to="/app/login"
            style={{ color: 'var(--chakra-colors-fg-muted)' }}
          >
            Login
          </Link>
        </Text>
      </Stack>
    </Container>
  );
};
