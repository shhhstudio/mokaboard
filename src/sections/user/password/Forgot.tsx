import * as React from "react";
import { useState } from "react";
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
} from "@chakra-ui/react";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "@reach/router";
import { supabase } from "@/lib/supabaseClient";

interface RouteProps {
  path?: string;
}

export const ForgotPassword: React.FC<RouteProps> = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const redirectTo = `${window.location.origin}/app/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) {
      setError(error.message);
      setMessage(null);
    } else {
      setError(null);
      setMessage("Password reset email sent. Please check your inbox.");
    }
  };

  return (
    <Container
      maxW="md"
      py={{ base: "12", md: "24" }}
      minHeight={"100vh"}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Stack gap="8">
        <VStack gap="12">
          <VStack gap="2">
            <Heading size="2xl">Forgot your password?</Heading>
            <Text color="fg.muted">
              Enter your email to receive a reset link.
            </Text>
          </VStack>
        </VStack>
        <Stack gap="6">
          <form onSubmit={handleReset} style={{ width: "100%" }}>
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
              <Button type="submit">
                Send reset link <BsArrowRight />
              </Button>
            </Stack>
          </form>
        </Stack>
        <Separator variant="dashed" />
        <Text
          textStyle="sm"
          color="fg.muted"
          textAlign="center"
          style={{ color: "var(--chakra-colors-fg-muted)" }}
        >
          Remembered?{" "}
          <Link to="/app/login" style={{ color: "var(--chakra-colors-fg-muted)" }}>
            Back to login
          </Link>
        </Text>
      </Stack>
    </Container>
  );
};
