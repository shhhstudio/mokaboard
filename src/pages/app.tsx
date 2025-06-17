import React from "react";
import { Router } from "@reach/router";
import {
  Profile,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
} from "@/sections/user";
import { useSession } from "@/providers/AuthProvider";
import { Home } from "@/sections/Home";
import { Board } from "@/sections/board";
import type { PageProps } from "gatsby";
import { Spinner, Flex } from "@chakra-ui/react";

const App: React.FC<PageProps> = () => {
  // Attendre l'hydratation côté client
  const [isHydrated, setIsHydrated] = React.useState(false);
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);
  const session = useSession();

  if (typeof window === "undefined" || !isHydrated) {
    return null;
  }

  if (session === undefined) {
    // Affiche un spinner pendant le chargement de la session
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (session === null) {
    return (
      <Router>
        <Register path="/app/register" />
        <ForgotPassword path="/app/forgot-password" />
        <Login default path="/app/login" />
      </Router>
    );
  }

  // Add RouteProps to Board for reach router
  const BoardWithPath = (props: any) => <Board {...props} />;

  return (
    <Router>
      <Profile path="/app/profile" />
      <ResetPassword path="/app/reset-password" />
      {/* Board route with optional widgetId param */}
      <BoardWithPath path="/app/board/:uuid/:widgetId" />
      <BoardWithPath path="/app/board/:uuid" />
      <Home default path="/app" />
    </Router>
  );
};

export default App;
