import React from 'react';
import { useState, useEffect } from 'react';
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
import { Link } from '@reach/router';
import { useLocation } from '@reach/router';
import { supabase } from '@/lib/supabaseClient';

interface RouteProps {
  path?: string;
}

export const ResetPassword: React.FC<RouteProps> = () => {
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
      setError(null);
      window.location.href = '/app/profile';
    }
  };

  if (loading) {
    return (
      <Container
        maxW="md"
        py={{ base: '12', md: '24' }}
        minHeight={'100vh'}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (error) {
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
              <Heading size="2xl">Reset password</Heading>
              <Text color="red.500">{error}</Text>
            </VStack>
          </VStack>
          <Separator variant="dashed" />
          <Text
            textStyle="sm"
            color="fg.muted"
            textAlign="center"
          >
            <Link
              to="/app/forgot-password"
              style={{ color: 'var(--chakra-colors-fg-muted)' }}
            >
              Request a new link
            </Link>
          </Text>
        </Stack>
      </Container>
    );
  }

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
            <Heading size="2xl">Reset your password</Heading>
            <Text color="fg.muted">Enter and confirm your new password.</Text>
          </VStack>
        </VStack>
        <Stack gap="6">
          <form onSubmit={handleUpdate} style={{ width: '100%' }}>
            <Stack gap="6">
              <Field.Root>
                <Field.Label>New password</Field.Label>
                <Input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Confirm password</Field.Label>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </Field.Root>
              {error && (
                <Text color="red.500" fontSize="sm">
                  {error}
                </Text>
              )}
              <Button type="submit">
                Update password <BsArrowRight />
              </Button>
            </Stack>
          </form>
        </Stack>
      </Stack>
    </Container>
  );
};

