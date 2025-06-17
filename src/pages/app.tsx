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

const App: React.FC<PageProps> = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const session = useSession();

  if (session === undefined) {
    return <Router></Router>;
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
