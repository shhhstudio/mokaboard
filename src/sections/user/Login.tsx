import React from 'react';
import { useState } from 'react';
import {
  Button,
  Container,
  Field,
  HStack,
  Heading,
  Input,
  Separator,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { BsArrowRight, BsGithub, BsGoogle } from 'react-icons/bs';
import { Link } from '@reach/router';
import { supabase } from '@/lib/supabaseClient';

interface RouteProps {
  path?: string;
  default?: boolean;
}

export const Login: React.FC<RouteProps> = () => {
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
    }
  };

  return (
    <Container maxW="md" py={{ base: '12', md: '24' }} minHeight={'100vh'} display="flex" flexDirection="column" justifyContent="center">
      <Stack gap="8">
        <VStack gap="12">
          <VStack gap="2">
            <Heading size="2xl">Sign in to your account</Heading>
            <Text color="fg.muted">Welcome back! Please sign in to continue.</Text>
          </VStack>
        </VStack>

        <Stack gap="6">
          {/* < HStack gap="4" colorPalette="gray">
          <Button variant="outline" flex="1">
            <BsGoogle /> Google
          </Button>
          <Button variant="outline" flex="1">
            <BsGithub /> Github
          </Button>
        </HStack>

        <HStack>
          <Separator flex="1" />
          <Text color="fg.muted" textStyle="sm">
            or
          </Text>
          <Separator flex="1" />
        </HStack>*/}

          <form onSubmit={handleLogin} style={{ width: '100%' }}>
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
                Continue <BsArrowRight />
              </Button>
            </Stack>
          </form>
        </Stack>

        <Separator variant="dashed" />

        <Text textStyle="sm" color="fg.muted" textAlign="center">
          Don't have an account?{' '}
          <Link to="/app/register" style={{ color: 'var(--chakra-colors-fg-muted)' }}>
            Sign up
          </Link>
        </Text>
        <Text textStyle="sm" color="fg.muted" textAlign="center">
          <Link to="/app/forgot-password" style={{ color: 'var(--chakra-colors-fg-muted)' }}>
            Forgot password?
          </Link>
        </Text>
      </Stack>
    </Container >
  );
};

