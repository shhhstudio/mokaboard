import React, { useEffect } from "react";
import type { PageProps } from "gatsby";
import { useLocation, navigate } from "@reach/router";
import { useInvitationActions } from "@/hooks/useInvitationActions";
import { Spinner, Flex, Text } from "@chakra-ui/react";
import { useSession } from "@/providers/AuthProvider";

const ClaimInvitationPage: React.FC<PageProps> = () => {
  const location = useLocation();
  const session = useSession();
  const { claimInvitation, loading, error } = useInvitationActions();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (!token) return;
    if (session === null) {
      navigate(`/app/login?next=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }
    claimInvitation(token)
      .then(() => navigate("/app"))
      .catch((err) => console.error("Failed to claim invitation:", err));
  }, [location.search, location.pathname, session, claimInvitation]);

  if (loading || session === undefined) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Text color="red.500">{error.message}</Text>
      </Flex>
    );
  }

  return null;
};

export default ClaimInvitationPage;
