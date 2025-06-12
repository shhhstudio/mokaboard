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
        <Login default path="/app/login" />
        <Register path="/app/register" />
        <ForgotPassword path="/app/forgot-password" />
      </Router>
    );
  }

  return (
    <Router>
      <Home default path="/app" />
      <Profile path="/app/profile" />
      <ResetPassword path="/app/reset-password" />
    </Router>
  );
};

export default App;
